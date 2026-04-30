import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/server'

/**
 * POST /api/whatsapp/webhook
 *
 * Webhook Twilio WhatsApp. Twilio envoie les messages entrants en
 * application/x-www-form-urlencoded.
 *
 * Flow :
 *   1. Lire From (ex: whatsapp:+33612345678) et Body
 *   2. Trouver l'utilisateur associé à ce numéro vérifié
 *   3. Extraire l'URL du message
 *   4. Scraper les métadonnées via Microlink
 *   5. Insérer l'article dans la dernière wishlist de l'utilisateur
 *   6. Répondre en TwiML
 *
 * Sécurité : Twilio signe chaque requête (X-Twilio-Signature).
 * En production, activez la validation via TWILIO_AUTH_TOKEN + l'URL publique.
 */
export async function POST(request: NextRequest) {
  // Twilio envoie du form-encoded
  const formData = await request.formData()
  const from = formData.get('From') as string | null
  const bodyText = formData.get('Body') as string | null

  if (!from || bodyText === null) {
    return twimlReply('Message invalide.')
  }

  // Normalise le numéro : supprime le préfixe "whatsapp:"
  const phone = from.replace(/^whatsapp:/i, '').trim()

  // Cherche l'utilisateur par numéro vérifié
  const { data: userRecord } = await supabaseAdmin
    .from('users')
    .select('id')
    .eq('phone_number', phone)
    .eq('phone_verified', true)
    .maybeSingle()

  if (!userRecord) {
    return twimlReply(
      'Votre numéro WhatsApp n\'est pas associé à un compte TOML. ' +
      'Configurez-le depuis vos paramètres : toml-app.vercel.app/dashboard/settings'
    )
  }

  // Extrait la première URL du message
  const urlMatch = bodyText.match(/https?:\/\/[^\s]+/)
  if (!urlMatch) {
    return twimlReply(
      'Envoyez-moi un lien produit (ex: https://amazon.fr/…) pour l\'ajouter à votre wishlist !'
    )
  }

  const url = urlMatch[0]

  // Scraping des métadonnées via Microlink (REST, sans package)
  let title: string | null = null
  let imageUrl: string | null = null

  try {
    const mlRes = await fetch(
      `https://api.microlink.io?url=${encodeURIComponent(url)}&screenshot=false`,
      { signal: AbortSignal.timeout(8000) }
    )
    if (mlRes.ok) {
      const mlData = await mlRes.json()
      if (mlData.status === 'success') {
        title = mlData.data?.title ?? null
        imageUrl = mlData.data?.image?.url ?? null
      }
    }
  } catch {
    // Scraping échoué : on crée quand même l'article sans métadonnées
  }

  // Dernière wishlist de l'utilisateur
  const { data: wishlist } = await supabaseAdmin
    .from('wishlists')
    .select('id, title')
    .eq('user_id', userRecord.id)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  if (!wishlist) {
    return twimlReply(
      'Vous n\'avez pas encore de wishlist. Créez-en une sur toml-app.vercel.app/dashboard'
    )
  }

  // Insertion de l'article
  const { error: insertError } = await supabaseAdmin.from('items').insert({
    wishlist_id: wishlist.id,
    title:       title ?? url,
    source_url:  url,
    image_url:   imageUrl,
    status:      'available',
    priority:    'medium',
  })

  if (insertError) {
    return twimlReply('Erreur lors de l\'ajout. Réessayez dans quelques instants.')
  }

  return twimlReply(`Article ajouté à "${wishlist.title}" !`)
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

function twimlReply(message: string): Response {
  const xml =
    `<?xml version="1.0" encoding="UTF-8"?>` +
    `<Response><Message>${escapeXml(message)}</Message></Response>`
  return new Response(xml, {
    headers: { 'Content-Type': 'text/xml; charset=utf-8' },
  })
}

// Twilio envoie uniquement des POST — bloquer les GET
export async function GET(): Promise<NextResponse> {
  return NextResponse.json({ error: 'Method Not Allowed' }, { status: 405 })
}
