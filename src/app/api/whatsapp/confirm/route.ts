import { NextRequest, NextResponse } from 'next/server'
import twilio from 'twilio'
import { supabaseAdmin } from '@/lib/supabase/server'
import { verifyVerificationToken } from '@/lib/whatsapp-token'

/**
 * GET /api/whatsapp/confirm?token=<base64url>
 *
 * Route publique. L'utilisateur clique sur le lien reçu par WhatsApp.
 * 1. Vérifie la signature et l'expiration du token
 * 2. S'assure que le numéro n'est pas déjà utilisé par un autre compte
 * 3. Met à jour users : phone_number + phone_verified = true
 * 4. Envoie un message WhatsApp de bienvenue
 * 5. Redirige vers /dashboard/settings
 */
export async function GET(request: NextRequest) {
  const origin = request.nextUrl.origin
  const token  = request.nextUrl.searchParams.get('token')

  if (!token) {
    return NextResponse.redirect(
      new URL('/dashboard/settings?phone_error=token_missing', origin)
    )
  }

  const payload = verifyVerificationToken(token)

  if (!payload) {
    return NextResponse.redirect(
      new URL('/dashboard/settings?phone_error=token_invalid', origin)
    )
  }

  const { userId, phone } = payload

  // Vérifie que le numéro n'appartient pas déjà à un autre compte
  const { data: conflictUser } = await supabaseAdmin
    .from('users')
    .select('id')
    .eq('phone_number', phone)
    .eq('phone_verified', true)
    .neq('id', userId)
    .maybeSingle()

  if (conflictUser) {
    return NextResponse.redirect(
      new URL('/dashboard/settings?phone_error=phone_taken', origin)
    )
  }

  // Met à jour le profil
  const { error: updateError } = await supabaseAdmin
    .from('users')
    .update({ phone_number: phone, phone_verified: true })
    .eq('id', userId)

  if (updateError) {
    return NextResponse.redirect(
      new URL('/dashboard/settings?phone_error=db_error', origin)
    )
  }

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
      .catch(() => {}) // Message de bienvenue non critique
  }

  return NextResponse.redirect(
    new URL('/dashboard/settings?phone_verified=1', origin)
  )
}
