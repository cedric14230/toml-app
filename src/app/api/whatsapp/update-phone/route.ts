import { NextRequest, NextResponse } from 'next/server'
import twilio from 'twilio'
import { createSupabaseServerClient, supabaseAdmin } from '@/lib/supabase/server'
import { signVerificationToken } from '@/lib/whatsapp-token'

/**
 * PATCH /api/whatsapp/update-phone
 *
 * Route authentifiée. Utilisée quand un utilisateur veut changer un numéro
 * déjà vérifié. Contrairement à /verify (qui ne touche pas à la DB avant
 * confirmation), cette route :
 *   1. Met à jour phone_number + phone_verified = false en DB immédiatement
 *   2. Puis envoie le lien de vérification WhatsApp au nouveau numéro
 *
 * Body JSON : { phone: string }
 */
export async function PATCH(request: NextRequest) {
  // Auth
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

  if (!/^\+\d{7,15}$/.test(phone)) {
    return NextResponse.json(
      { error: 'Format invalide. Utilisez le format international, ex : +33612345678' },
      { status: 400 }
    )
  }

  // Vérifie que le numéro n'est pas déjà utilisé par un autre compte
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

  // Mise à jour immédiate en DB : nouveau numéro, vérification réinitialisée
  const { error: dbError } = await supabaseAdmin
    .from('users')
    .update({ phone_number: phone, phone_verified: false })
    .eq('id', user.id)

  if (dbError) {
    return NextResponse.json({ error: dbError.message }, { status: 500 })
  }

  // Envoi du lien de vérification WhatsApp
  const accountSid = process.env.TWILIO_ACCOUNT_SID
  const authToken  = process.env.TWILIO_AUTH_TOKEN
  const rawFrom    = (process.env.TWILIO_WHATSAPP_NUMBER ?? '').replace(/\s/g, '')

  if (!accountSid || !authToken || !rawFrom) {
    return NextResponse.json(
      { error: 'Configuration Twilio manquante' },
      { status: 500 }
    )
  }

  const fromWhatsapp = rawFrom.startsWith('whatsapp:') ? rawFrom : `whatsapp:${rawFrom}`
  const token      = signVerificationToken(user.id, phone)
  const origin     = request.nextUrl.origin
  const confirmUrl = `${origin}/api/whatsapp/confirm?token=${encodeURIComponent(token)}`

  try {
    const client = twilio(accountSid, authToken)
    await client.messages.create({
      from: fromWhatsapp,
      to:   `whatsapp:${phone}`,
      body:
        `Bonjour ! Pour confirmer votre nouveau numéro WhatsApp sur TOML, ` +
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
