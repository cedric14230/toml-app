import { NextRequest, NextResponse } from 'next/server'
import twilio from 'twilio'
import { createSupabaseServerClient, supabaseAdmin } from '@/lib/supabase/server'
import { signVerificationToken } from '@/lib/whatsapp-token'

/**
 * POST /api/whatsapp/verify
 *
 * Route authentifiée. Reçoit { phone: "+33612345678" }.
 * Sauvegarde le token HMAC dans verification_tokens et envoie
 * une URL courte (/api/whatsapp/confirm?id=UUID) par WhatsApp
 * via un Message Template approuvé.
 *
 * Body JSON : { phone: string }
 */
export async function POST(request: NextRequest) {
  const supabase = await createSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
  }

  let phone: string
  try {
    const body = await request.json()
    phone = (body.phone ?? '').trim()
  } catch {
    return NextResponse.json({ error: 'Corps JSON invalide' }, { status: 400 })
  }

  if (!/^\+\d{7,15}$/.test(phone)) {
    return NextResponse.json(
      { error: 'Format invalide. Utilisez le format international, ex : +33612345678' },
      { status: 400 }
    )
  }

  // Vérifie qu'aucun autre compte n'utilise déjà ce numéro (vérifié)
  const { data: conflict } = await supabaseAdmin
    .from('users')
    .select('id')
    .eq('phone_number', phone)
    .eq('phone_verified', true)
    .neq('id', user.id)
    .maybeSingle()

  if (conflict) {
    return NextResponse.json(
      { error: 'Ce numéro est déjà associé à un autre compte TOML. Si c\'est le tien, connecte-toi avec ce compte ou contacte-nous.' },
      { status: 409 }
    )
  }

  // Génère le token HMAC et le persiste en base (durée 30 min)
  const hmacToken = signVerificationToken(user.id, phone)

  const { data: tokenRow, error: insertError } = await supabaseAdmin
    .from('verification_tokens')
    .insert({ token: hmacToken, user_id: user.id, phone })
    .select('id')
    .single()

  if (insertError || !tokenRow) {
    return NextResponse.json(
      { error: 'Impossible de créer le lien de vérification.' },
      { status: 500 }
    )
  }

  // URL courte : seul l'UUID est transmis, pas le token HMAC complet
  const origin     = request.nextUrl.origin
  const confirmUrl = `${origin}/api/whatsapp/confirm?id=${tokenRow.id}`

  const accountSid  = process.env.TWILIO_ACCOUNT_SID
  const authToken   = process.env.TWILIO_AUTH_TOKEN
  const fromNumber  = (process.env.TWILIO_WHATSAPP_NUMBER ?? '').replace(/\s/g, '')
  const templateSid = process.env.TWILIO_VERIFICATION_TEMPLATE_SID

  if (!accountSid || !authToken || !fromNumber || !templateSid) {
    return NextResponse.json(
      { error: 'Configuration Twilio manquante' },
      { status: 500 }
    )
  }

  const fromWhatsapp = fromNumber.startsWith('whatsapp:')
    ? fromNumber
    : `whatsapp:${fromNumber}`

  try {
    const client = twilio(accountSid, authToken)
    await client.messages.create({
      from:             fromWhatsapp,
      to:               `whatsapp:${phone}`,
      contentSid:       templateSid,
      contentVariables: JSON.stringify({ '1': confirmUrl }),
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    return NextResponse.json(
      { error: `Échec d'envoi WhatsApp : ${message}` },
      { status: 502 }
    )
  }

  return NextResponse.json({ ok: true })
}
