import { NextRequest, NextResponse } from 'next/server'
import twilio from 'twilio'
import { createSupabaseServerClient, supabaseAdmin } from '@/lib/supabase/server'
import { signVerificationToken } from '@/lib/whatsapp-token'

/**
 * POST /api/whatsapp/verify
 *
 * Route authentifiée. Reçoit { phone: "+33612345678" },
 * signe un token HMAC et envoie le lien de confirmation par WhatsApp.
 *
 * Body JSON : { phone: string }
 */
export async function POST(request: NextRequest) {
  // Vérification de l'authentification via session Supabase
  const supabase = await createSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
  }

  // Lecture et validation du numéro
  let phone: string
  try {
    const body = await request.json()
    phone = (body.phone ?? '').trim()
  } catch {
    return NextResponse.json({ error: 'Corps JSON invalide' }, { status: 400 })
  }

  // Format international strict : +XXXXXXXXXXXX (7 à 15 chiffres)
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

  // Génère le token HMAC signé
  const token = signVerificationToken(user.id, phone)

  // URL de confirmation (même domaine que la requête entrante)
  const origin = request.nextUrl.origin
  const confirmUrl = `${origin}/api/whatsapp/confirm?token=${encodeURIComponent(token)}`

  // Envoi du message WhatsApp via Twilio
  const accountSid = process.env.TWILIO_ACCOUNT_SID
  const authToken  = process.env.TWILIO_AUTH_TOKEN
  const fromNumber = (process.env.TWILIO_WHATSAPP_NUMBER ?? '').replace(/\s/g, '')

  if (!accountSid || !authToken || !fromNumber) {
    return NextResponse.json(
      { error: 'Configuration Twilio manquante' },
      { status: 500 }
    )
  }

  // Normalise : s'assure que from a toujours le préfixe whatsapp:
  const fromWhatsapp = fromNumber.startsWith('whatsapp:')
    ? fromNumber
    : `whatsapp:${fromNumber}`

  try {
    const client = twilio(accountSid, authToken)
    await client.messages.create({
      from: fromWhatsapp,
      to:   `whatsapp:${phone}`,
      body:
        `Bonjour ! Pour connecter votre WhatsApp à TOML, ` +
        `cliquez sur ce lien (valable 30 min) :\n${confirmUrl}`,
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
