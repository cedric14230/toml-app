import { NextRequest, NextResponse } from 'next/server'
import twilio from 'twilio'
import { supabaseAdmin } from '@/lib/supabase/server'
import { verifyVerificationToken } from '@/lib/whatsapp-token'

/**
 * GET /api/whatsapp/confirm?id=<UUID>
 *
 * Route publique. L'utilisateur clique sur le lien reçu par WhatsApp.
 * 1. Récupère le token HMAC dans verification_tokens via l'UUID
 * 2. Vérifie l'expiration (expires_at) et la signature HMAC
 * 3. S'assure que le numéro n'est pas utilisé par un autre compte
 * 4. Met à jour users : phone_number + phone_verified = true
 * 5. Supprime le token (usage unique)
 * 6. Envoie un message WhatsApp de bienvenue
 * 7. Redirige vers /dashboard/settings?verified=true
 */
export async function GET(request: NextRequest) {
  const origin = request.nextUrl.origin
  const id     = request.nextUrl.searchParams.get('id')

  console.log('[confirm] id reçu :', id)

  if (!id) {
    return NextResponse.redirect(
      new URL('/dashboard/settings?phone_error=token_missing', origin)
    )
  }

  // Récupère le token depuis la base — vérifie l'expiration côté DB
  const { data: tokenRow, error: selectError } = await supabaseAdmin
    .from('verification_tokens')
    .select('token, user_id, phone')
    .eq('id', id)
    .gt('expires_at', new Date().toISOString())
    .maybeSingle()

  console.log('[confirm] token trouvé :', tokenRow ? 'oui' : 'non')
  if (selectError) console.log('[confirm] erreur SELECT verification_tokens :', selectError.message, selectError.code)

  if (!tokenRow) {
    return NextResponse.redirect(
      new URL('/dashboard/settings?phone_error=token_invalid', origin)
    )
  }

  const { token: hmacToken, user_id: userId, phone } = tokenRow
  console.log('[confirm] user_id :', userId)
  console.log('[confirm] phone :', phone)

  // Vérifie la signature HMAC du token stocké
  const payload = verifyVerificationToken(hmacToken)
  console.log('[confirm] vérification HMAC :', payload ? 'valide' : 'invalide/expiré')

  if (!payload) {
    await supabaseAdmin.from('verification_tokens').delete().eq('id', id)
    return NextResponse.redirect(
      new URL('/dashboard/settings?phone_error=token_invalid', origin)
    )
  }

  // Vérifie que le numéro n'appartient pas déjà à un autre compte
  const { data: conflictUser } = await supabaseAdmin
    .from('users')
    .select('id')
    .eq('phone_number', phone)
    .eq('phone_verified', true)
    .neq('id', userId)
    .maybeSingle()

  if (conflictUser) {
    console.log('[confirm] conflit numéro — autre compte :', conflictUser.id)
    await supabaseAdmin.from('verification_tokens').delete().eq('id', id)
    return NextResponse.redirect(
      new URL('/dashboard/settings?phone_error=phone_taken', origin)
    )
  }

  // Met à jour le profil (supabaseAdmin bypasse la RLS)
  const { error: updateError } = await supabaseAdmin
    .from('users')
    .update({ phone_number: phone, phone_verified: true })
    .eq('id', userId)

  if (updateError) {
    console.log('[confirm] résultat UPDATE users : erreur —', updateError.message, '| code :', updateError.code)
    return NextResponse.redirect(
      new URL('/dashboard/settings?phone_error=db_error', origin)
    )
  }
  console.log('[confirm] résultat UPDATE users : succès — phone_verified = true pour', userId)

  // Supprime le token — usage unique
  await supabaseAdmin.from('verification_tokens').delete().eq('id', id)

  // Envoie un message de bienvenue (non bloquant)
  const accountSid = process.env.TWILIO_ACCOUNT_SID
  const authToken  = process.env.TWILIO_AUTH_TOKEN
  const fromNumber = (process.env.TWILIO_WHATSAPP_NUMBER ?? '').replace(/\s/g, '')

  if (accountSid && authToken && fromNumber) {
    const fromWhatsapp = fromNumber.startsWith('whatsapp:')
      ? fromNumber
      : `whatsapp:${fromNumber}`

    twilio(accountSid, authToken)
      .messages.create({
        from: fromWhatsapp,
        to:   `whatsapp:${phone}`,
        body:
          'Votre WhatsApp est connecté à TOML ! ' +
          'Envoyez-moi un lien produit pour l\'ajouter directement à votre wishlist.',
      })
      .catch(() => {})
  }

  return NextResponse.redirect(
    new URL('/dashboard/settings?verified=true', origin)
  )
}
