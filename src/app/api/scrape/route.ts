import { NextRequest, NextResponse } from 'next/server'

// Sous-ensemble de la réponse Microlink qui nous intéresse
type MicrolinkResponse = {
  status: 'success' | 'fail'
  data: {
    title?: string | null
    description?: string | null
    image?: { url?: string | null } | null
    publisher?: string | null
    url?: string | null
  }
}

/**
 * GET /api/scrape?url=https://...
 *
 * Proxy vers l'API Microlink (gratuite, 1000 req/mois, sans clé).
 * Avantages du proxy côté serveur :
 *   - Évite les erreurs CORS si Microlink changeait sa politique
 *   - Permet de cacher la réponse (Next.js fetch cache)
 *   - Centralise la gestion d'erreurs
 *
 * Retourne : { title, image, price }
 * Note : Microlink ne retourne pas de prix pour les pages produit standard.
 * Le champ `price` est inclus dans la réponse pour compatibilité future.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const url = searchParams.get('url')

  // ── Validation ────────────────────────────────────────────────────
  if (!url) {
    return NextResponse.json(
      { error: 'Paramètre url manquant' },
      { status: 400 }
    )
  }

  try {
    new URL(url) // lève une exception si l'URL est malformée
  } catch {
    return NextResponse.json(
      { error: 'URL invalide' },
      { status: 400 }
    )
  }

  // ── Appel Microlink ───────────────────────────────────────────────
  const microlinkUrl =
    `https://api.microlink.io?url=${encodeURIComponent(url)}&screenshot=false`

  let microlinkRes: Response
  try {
    microlinkRes = await fetch(microlinkUrl, {
      // Next.js met en cache cette réponse 1h côté serveur.
      // La même URL produit ne sera donc appelée qu'une fois par heure max.
      next: { revalidate: 3600 },
    })
  } catch {
    return NextResponse.json(
      { error: 'Impossible de joindre Microlink' },
      { status: 502 }
    )
  }

  // 402 = quota gratuit dépassé sur Microlink
  if (microlinkRes.status === 402) {
    return NextResponse.json(
      { error: 'Quota Microlink atteint pour ce mois' },
      { status: 429 }
    )
  }

  if (!microlinkRes.ok) {
    return NextResponse.json(
      { error: `Erreur Microlink (HTTP ${microlinkRes.status})` },
      { status: 502 }
    )
  }

  const json: MicrolinkResponse = await microlinkRes.json()

  if (json.status !== 'success') {
    return NextResponse.json(
      { error: 'Microlink n\'a pas pu analyser cette page' },
      { status: 422 }
    )
  }

  // ── Réponse normalisée ────────────────────────────────────────────
  return NextResponse.json({
    title: json.data.title ?? null,
    image: json.data.image?.url ?? null,
    // Microlink ne fournit pas de prix dans sa réponse standard.
    // Les pages produit n'exposent pas le prix en Open Graph/meta.
    price: null,
  })
}
