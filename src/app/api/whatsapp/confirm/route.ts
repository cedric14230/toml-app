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
 * 5. Redirige vers /dashboard/settings?verified=true
 */
export async function GET(request: NextRequest) {
  const origin = request.nextUrl.origin
  const token  = request.nextUrl.searchParams.get('token')

  console.log('[confirm] ── début ──────────────────────────────────────')
  console.log('[confirm] token reçu :', token ? token.slice(0, 40) + '…' : 'ABSENT')

  // Affiche les 10 premiers caractères de chaque secret pour comparer
  // avec celui utilisé lors de la signature (sans révéler la valeur complète)
  const wtsSecret  = process.env.WHATSAPP_TOKEN_SECRET ?? ''
  const cronSecret = process.env.CRON_SECRET ?? ''
  console.log('[confirm] WHATSAPP_TOKEN_SECRET :', wtsSecret  ? wtsSecret.slice(0, 10)  + '…' : 'NON DÉFINI')
  console.log('[confirm] CRON_SECRET           :', cronSecret ? cronSecret.slice(0, 10) + '…' : 'NON DÉFINI')
  console.log('[confirm] secret effectif utilisé :', wtsSecret ? 'WHATSAPP_TOKEN_SECRET' : cronSecret ? 'CRON_SECRET' : 'dev-fallback-secret')

  if (!token) {
    console.log('[confirm] → redirect : token_missing')
    return NextResponse.redirect(
      new URL('/dashboard/settings?phone_error=token_missing', origin)
    )
  }

  // Décodage brut pour diagnostic (sans vérification de signature)
  try {
    const decoded = Buffer.from(token, 'base64url').toString('utf8')
    const parts   = decoded.split('|')
    console.log('[confirm] nombre de parties dans le token :', parts.length, '(attendu : 4)')
    if (parts.length === 4) {
      const [userId, phone, ts, sigPreview] = parts
      const ageMs = Date.now() - Number(ts)
      const ttlMs = 30 * 60 * 1000
      console.log('[confirm] userId  :', userId)
      console.log('[confirm] phone   :', phone)
      console.log('[confirm] ts      :', ts, '→ âge :', Math.round(ageMs / 1000), 's / TTL :', ttlMs / 1000, 's')
      console.log('[confirm] expiré  :', ageMs > ttlMs)
      console.log('[confirm] sig (10 premiers chars) :', sigPreview?.slice(0, 10) + '…')
    } else {
      console.log('[confirm] parties brutes :', parts)
    }
  } catch (e) {
    console.log('[confirm] impossible de décoder le token :', e)
  }

  // Vérification complète (signature + expiration)
  const payload = verifyVerificationToken(token)
  console.log('[confirm] résultat vérification :', payload
    ? `OK — userId=${payload.userId} phone=${payload.phone}`
    : 'INVALIDE ou EXPIRÉ')

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
    console.log('[confirm] → redirect : phone_taken (conflictUserId =', conflictUser.id, ')')
    return NextResponse.redirect(
      new URL('/dashboard/settings?phone_error=phone_taken', origin)
    )
  }

  // Met à jour le profil avec supabaseAdmin (bypasse la RLS)
  const { error: updateError } = await supabaseAdmin
    .from('users')
    .update({ phone_number: phone, phone_verified: true })
    .eq('id', userId)

  console.log('[confirm] UPDATE Supabase :', updateError
    ? `ERREUR — ${updateError.message} (code: ${updateError.code})`
    : 'OK — phone_verified = true')

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
      .catch((err) => console.log('[confirm] message de bienvenue échoué :', err.message))
  }

  console.log('[confirm] → redirect : verified=true')
  return NextResponse.redirect(
    new URL('/dashboard/settings?verified=true', origin)
  )
}
