import { NextRequest, NextResponse } from 'next/server'
import * as cheerio from 'cheerio'

/**
 * GET /api/scrape?url=https://...
 *
 * Extraction hybride à 3 niveaux, chacun plus coûteux que le précédent.
 * On s'arrête au premier niveau qui retourne un titre + une image.
 *
 * ┌─────────────────────────────────────────────────────────────────────┐
 * │ NIVEAU 1 — Open Graph + JSON-LD (gratuit, ~50–200 ms)              │
 * │   Fetch HTML brut avec un User-Agent Chrome réaliste.              │
 * │   Lit les balises meta OG et les blocs <script type="ld+json">.    │
 * │   Couvre ~70% des sites qui publient leurs données pour le SEO.    │
 * ├─────────────────────────────────────────────────────────────────────┤
 * │ NIVEAU 2 — Fetch HTML + Claude texte (~0,001 $ / appel, <8 s)      │
 * │   Re-fetch le HTML brut avec headers Chrome réalistes.             │
 * │   Envoie jusqu'à 30 000 chars à claude-sonnet-4-6 en mode texte.   │
 * │   Claude retourne un JSON structuré {title, image_url, price…}.    │
 * │   Si image_url est null, tente un fallback image via ScrapingBee.  │
 * │   Nécessite ANTHROPIC_API_KEY. Skip si la clé est absente.         │
 * ├─────────────────────────────────────────────────────────────────────┤
 * │ NIVEAU 3 — ScrapingBee render_js (proxies résidentiels, ~0,002 $)  │
 * │   Exécute la page dans un vrai Chromium avec IP résidentielle.     │
 * │   Passe les WAF (Cloudflare, CloudFront) avec un taux >95%.        │
 * │   Nécessite SCRAPINGBEE_KEY. Skip si la clé est absente.           │
 * └─────────────────────────────────────────────────────────────────────┘
 *
 * maxDuration = 10 s : compatible Vercel Hobby.
 */
export const maxDuration = 10

// ── Constantes ────────────────────────────────────────────────────────────────

const CHROME_UA =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) ' +
  'AppleWebKit/537.36 (KHTML, like Gecko) ' +
  'Chrome/120.0.0.0 Safari/537.36'

// ── Types ─────────────────────────────────────────────────────────────────────

type ScrapeResult = {
  title: string | null
  image: string | null
  price: string | null
}

// ── Helpers ───────────────────────────────────────────────────────────────────

/** Extrait la première URL d'une valeur image JSON-LD polymorphe */
function extractImageUrl(raw: unknown): string | null {
  if (!raw) return null
  if (typeof raw === 'string') return raw
  if (Array.isArray(raw)) {
    for (const item of raw) {
      const url = extractImageUrl(item)
      if (url) return url
    }
    return null
  }
  if (typeof raw === 'object' && raw !== null) {
    const obj = raw as Record<string, unknown>
    if (typeof obj.url === 'string') return obj.url
    if (typeof obj.contentUrl === 'string') return obj.contentUrl
  }
  return null
}

/** Cherche un nœud @type=Product dans un graphe JSON-LD (plat ou @graph) */
function findProduct(data: unknown): Record<string, unknown> | null {
  if (!data || typeof data !== 'object') return null
  const obj = data as Record<string, unknown>

  if (obj['@type'] === 'Product') return obj

  // @graph : tableau de nœuds
  if (Array.isArray(obj['@graph'])) {
    for (const node of obj['@graph']) {
      const found = findProduct(node)
      if (found) return found
    }
  }

  // Tableau au niveau racine
  if (Array.isArray(data)) {
    for (const node of data) {
      const found = findProduct(node)
      if (found) return found
    }
  }

  return null
}

/** Parse le prix depuis l'objet offers (Offer ou tableau) */
function extractPrice(offers: unknown): string | null {
  if (!offers) return null
  const offer = Array.isArray(offers) ? offers[0] : offers
  if (typeof offer !== 'object' || !offer) return null
  const o = offer as Record<string, unknown>
  if (o.price != null) return String(o.price)
  if (typeof o.lowPrice === 'string' || typeof o.lowPrice === 'number')
    return String(o.lowPrice)
  return null
}

// ── Niveau 1 : Open Graph + JSON-LD ──────────────────────────────────────────

async function scrapeLevel1(url: string): Promise<ScrapeResult | null> {
  const res = await fetch(url, {
    headers: {
      'User-Agent': CHROME_UA,
      Accept:
        'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
      'Accept-Language': 'fr-FR,fr;q=0.9,en-US;q=0.8,en;q=0.7',
      'Accept-Encoding': 'gzip, deflate, br',
    },
    cache: 'no-store',
    signal: AbortSignal.timeout(8000),
  })

  if (!res.ok) {
    throw new Error(`HTTP ${res.status}`)
  }

  const html = await res.text()
  const $ = cheerio.load(html)

  // ── Open Graph ──────────────────────────────────────────────────────────
  const ogTitle =
    $('meta[property="og:title"]').attr('content') ??
    $('meta[name="twitter:title"]').attr('content') ??
    null

  const ogImage =
    $('meta[property="og:image"]').attr('content') ??
    $('meta[property="og:image:url"]').attr('content') ??
    $('meta[name="twitter:image"]').attr('content') ??
    null

  const ogPrice =
    $('meta[property="og:price:amount"]').attr('content') ??
    $('meta[property="product:price:amount"]').attr('content') ??
    null

  // ── JSON-LD Schema.org Product ──────────────────────────────────────────
  let jsonLdTitle: string | null = null
  let jsonLdImage: string | null = null
  let jsonLdPrice: string | null = null

  $('script[type="application/ld+json"]').each((_, el) => {
    if (jsonLdTitle) return // déjà trouvé
    try {
      const data: unknown = JSON.parse($(el).html() ?? '')
      const product = findProduct(data)
      if (!product) return

      jsonLdTitle = typeof product.name === 'string' ? product.name : null
      jsonLdImage = extractImageUrl(product.image)
      jsonLdPrice = extractPrice(product.offers)
    } catch {
      // JSON malformé — on ignore
    }
  })

  const title = jsonLdTitle ?? ogTitle ?? ($('title').first().text().trim() || null)
  const image = jsonLdImage ?? ogImage ?? null
  const price = jsonLdPrice ?? ogPrice ?? null

  // On considère le niveau réussi uniquement si on a les deux essentiels
  if (!title || !image) return null
  return { title, image, price }
}

// ── Niveau 2 : Claude texte sur HTML brut ────────────────────────────────────

async function scrapeLevel2(url: string): Promise<ScrapeResult | null> {
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    console.log('[scrape] niveau 2 ignoré : ANTHROPIC_API_KEY absent')
    return null
  }

  // ── Étape 1 : Fetch HTML + extraction Claude texte ────────────────────
  let html: string
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': CHROME_UA,
        Accept:
          'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
        'Accept-Language': 'fr-FR,fr;q=0.9,en-US;q=0.8,en;q=0.7',
        'Accept-Encoding': 'gzip, deflate, br',
      },
      cache: 'no-store',
      signal: AbortSignal.timeout(8_000),
    })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    html = await res.text()
  } catch (err) {
    console.warn('[scrape] niveau 2 : fetch échoué', err)
    return null
  }

  // Tronquer pour limiter les tokens (≈7 500 tokens pour ~30 000 chars)
  const htmlSnippet = html.length > 30_000 ? html.slice(0, 30_000) : html

  const { default: Anthropic } = await import('@anthropic-ai/sdk')
  const anthropic = new Anthropic({ apiKey })

  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), 8_000)

  let parsed: Record<string, unknown>
  try {
    const message = await anthropic.messages.create(
      {
        model: 'claude-sonnet-4-6',
        max_tokens: 512,
        system:
          'Tu es un extracteur de données produit. ' +
          'Analyse ce HTML et retourne UNIQUEMENT un JSON valide avec ces clés : ' +
          '{ "title": string | null, "image_url": string | null, "price": string | null, ' +
          '"currency": string | null, "description": string | null }. ' +
          'Si une donnée est introuvable, mets null. Aucun texte hors du JSON.',
        messages: [{ role: 'user', content: htmlSnippet }],
      },
      { signal: controller.signal },
    )

    const raw = message.content[0].type === 'text' ? message.content[0].text : ''
    const jsonMatch = raw.match(/\{[\s\S]*\}/)
    if (!jsonMatch) return null

    parsed = JSON.parse(jsonMatch[0])
  } catch (err) {
    console.warn('[scrape] niveau 2 : Claude échoué', err)
    return null
  } finally {
    clearTimeout(timer)
  }

  const title = typeof parsed.title === 'string' && parsed.title ? parsed.title : null
  if (!title) return null

  const price =
    parsed.price != null
      ? `${parsed.price}${parsed.currency ? ' ' + parsed.currency : ''}`
      : null

  let image =
    typeof parsed.image_url === 'string' && parsed.image_url ? parsed.image_url : null

  // ── Étape 2 : Fallback image via ScrapingBee si Claude n'a pas trouvé ─
  if (!image) {
    const sbKey = process.env.SCRAPINGBEE_KEY
    if (sbKey) {
      try {
        const endpoint =
          `https://app.scrapingbee.com/api/v1/` +
          `?api_key=${sbKey}` +
          `&url=${encodeURIComponent(url)}` +
          `&render_js=true` +
          `&stealth_proxy=true` +
          `&block_ads=true` +
          `&wait=2000`

        const sbRes = await fetch(endpoint, { signal: AbortSignal.timeout(8_000) })
        if (sbRes.ok) {
          const sbHtml = await sbRes.text()
          const $ = cheerio.load(sbHtml)

          image =
            $('meta[property="og:image"]').attr('content') ??
            $('meta[name="twitter:image"]').attr('content') ??
            null

          if (!image) {
            $('img').each((_, el) => {
              if (image) return
              const widthAttr = $(el).attr('width')
              const styleMatch = ($(el).attr('style') ?? '').match(/width\s*:\s*(\d+)/)
              const width = widthAttr
                ? parseInt(widthAttr, 10)
                : styleMatch
                ? parseInt(styleMatch[1], 10)
                : 0
              if (width > 200) {
                image = $(el).attr('src') ?? null
              }
            })
          }
        }
      } catch (err) {
        console.warn('[scrape] niveau 2 : fallback image ScrapingBee échoué', err)
      }
    }
  }

  return { title, image, price }
}

// ── Niveau 3 : ScrapingBee ────────────────────────────────────────────────────

async function scrapeLevel3(url: string): Promise<ScrapeResult | null> {
  const apiKey = process.env.SCRAPINGBEE_KEY
  if (!apiKey) {
    console.log('[scrape] niveau 3 ignoré : SCRAPINGBEE_KEY absent')
    return null
  }

  const endpoint =
    `https://app.scrapingbee.com/api/v1/` +
    `?api_key=${apiKey}` +
    `&url=${encodeURIComponent(url)}` +
    `&render_js=true` +
    `&stealth_proxy=true` +
    `&block_ads=true` +
    `&wait=2000`

  const res = await fetch(endpoint, {
    signal: AbortSignal.timeout(30_000),
  })

  if (!res.ok) {
    throw new Error(`ScrapingBee HTTP ${res.status}`)
  }

  const html = await res.text()
  const $ = cheerio.load(html)

  const title =
    $('meta[property="og:title"]').attr('content') ??
    ($('title').first().text().trim() || null)

  const image =
    $('meta[property="og:image"]').attr('content') ??
    $('meta[property="og:image:url"]').attr('content') ??
    null

  const price =
    $('meta[property="og:price:amount"]').attr('content') ??
    $('meta[property="product:price:amount"]').attr('content') ??
    null

  if (!title || !image) return null
  return { title, image, price }
}

// ── Handler principal ─────────────────────────────────────────────────────────

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get('url')

  if (!url) {
    return NextResponse.json({ error: 'Paramètre url manquant' }, { status: 400 })
  }

  try {
    new URL(url)
  } catch {
    return NextResponse.json({ error: 'URL invalide' }, { status: 400 })
  }

  const levels: [number, (u: string) => Promise<ScrapeResult | null>][] = [
    [1, scrapeLevel1],
    [2, scrapeLevel2],
    [3, scrapeLevel3],
  ]

  for (const [level, fn] of levels) {
    try {
      const result = await fn(url)
      if (result?.title) {
        console.log(`[scrape] niveau ${level} réussi pour ${url}`)
        return NextResponse.json(result)
      }
      console.log(`[scrape] niveau ${level} incomplet (titre ou image manquant)`)
    } catch (err) {
      console.warn(`[scrape] niveau ${level} échoué :`, err)
    }
  }

  console.warn(`[scrape] tous les niveaux ont échoué pour ${url}`)
  return NextResponse.json({
    title: null,
    image: null,
    price: null,
    error: "Impossible d\u2019extraire les donn\u00e9es de cette page",
  })
}
