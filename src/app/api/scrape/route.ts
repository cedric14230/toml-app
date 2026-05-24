import { NextRequest, NextResponse } from 'next/server'
import * as cheerio from 'cheerio'

/**
 * GET /api/scrape?url=https://...
 *
 * Extraction hybride à 3 niveaux, chacun plus coûteux que le précédent.
 * On s'arrête au premier niveau qui retourne un titre + une image.
 *
 * ┌─────────────────────────────────────────────────────────────────────┐
 * │ ANTIBOT — Sites anti-bot connus (zara.com, asos.com…)              │
 * │   Bypass L1 et L2. ScrapingBee direct + Claude texte sur le HTML.  │
 * │   Fallback Cheerio si Claude est indisponible.                     │
 * ├─────────────────────────────────────────────────────────────────────┤
 * │ NIVEAU 1 — Open Graph + JSON-LD (gratuit, ~50–200 ms)              │
 * │   Fetch HTML brut avec un User-Agent Chrome réaliste.              │
 * │   Lit les balises meta OG et les blocs <script type="ld+json">.    │
 * │   Couvre ~70% des sites qui publient leurs données pour le SEO.    │
 * ├─────────────────────────────────────────────────────────────────────┤
 * │ NIVEAU 2 — Fetch HTML + Claude texte (~0,001 $ / appel)            │
 * │   Re-fetch le HTML brut avec headers Chrome réalistes.             │
 * │   Envoie jusqu'à 30 000 chars à claude-sonnet-4-6 en mode texte.   │
 * │   Si image_url est null, tente un fallback image via ScrapingBee.  │
 * │   Nécessite ANTHROPIC_API_KEY. Skip si la clé est absente.         │
 * ├─────────────────────────────────────────────────────────────────────┤
 * │ NIVEAU 3 — ScrapingBee render_js (proxies résidentiels, ~0,002 $)  │
 * │   Exécute la page dans un vrai Chromium avec IP résidentielle.     │
 * │   Passe les WAF (Cloudflare, CloudFront) avec un taux >95%.        │
 * │   Nécessite SCRAPINGBEE_KEY. Skip si la clé est absente.           │
 * └─────────────────────────────────────────────────────────────────────┘
 *
 * maxDuration = 60 s : nécessite Vercel Pro (Hobby est limité à 10 s).
 */
export const maxDuration = 60

// ── Constantes ────────────────────────────────────────────────────────────────

const CHROME_UA =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) ' +
  'AppleWebKit/537.36 (KHTML, like Gecko) ' +
  'Chrome/120.0.0.0 Safari/537.36'

/**
 * Domaines connus pour bloquer les fetch directs (Cloudflare strict, JS-only).
 * Ces domaines court-circuitent L1 et L2 et passent directement à ScrapingBee.
 */
const ANTIBOT_DOMAINS = [
  'zara.com',
  'asos.com',
  'hm.com',
  'mango.com',
  'uniqlo.com',
]

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

  if (Array.isArray(obj['@graph'])) {
    for (const node of obj['@graph']) {
      const found = findProduct(node)
      if (found) return found
    }
  }

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

// ── Helper partagé : ScrapingBee fetch ────────────────────────────────────────

/**
 * Récupère le HTML d'une URL via ScrapingBee (render_js + stealth_proxy).
 * Retourne null si SCRAPINGBEE_KEY est absent.
 * Lève une exception si ScrapingBee répond avec un statut non-200.
 * @param timeoutMs Timeout de la requête ScrapingBee (défaut : 30 s)
 */
async function fetchScrapingBee(url: string, timeoutMs = 30_000): Promise<string | null> {
  const apiKey = process.env.SCRAPINGBEE_KEY
  if (!apiKey) {
    console.log('[ScrapingBee] ignoré — SCRAPINGBEE_KEY absent')
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

  const res = await fetch(endpoint, { signal: AbortSignal.timeout(timeoutMs) })
  console.log(`[ScrapingBee] HTTP ${res.status}`)

  if (!res.ok) {
    throw new Error(`ScrapingBee HTTP ${res.status}`)
  }

  const html = await res.text()
  console.log(`[ScrapingBee] HTML reçu — ${html.length} chars`)
  return html || null
}

// ── Helper partagé : extraction Claude texte ──────────────────────────────────

/**
 * Envoie du HTML brut à claude-sonnet-4-6 et retourne un ScrapeResult structuré.
 * @param html  HTML brut à analyser (sera tronqué à 30 000 chars)
 * @param label Préfixe pour les logs (ex: 'L2', 'antibot')
 */
async function extractWithClaude(html: string, label: string): Promise<ScrapeResult | null> {
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    console.log(`[${label}] Claude ignoré — ANTHROPIC_API_KEY absent`)
    return null
  }

  const truncated = html.length > 30_000
  const htmlSnippet = truncated ? html.slice(0, 30_000) : html
  console.log(`[${label}] snippet envoyé à Claude — ${htmlSnippet.length} chars${truncated ? ' (tronqué)' : ''}`)

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
    console.log(`[${label}] réponse Claude brute — ${raw.slice(0, 300)}${raw.length > 300 ? '…' : ''}`)

    const jsonMatch = raw.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      console.warn(`[${label}] échec — aucun bloc JSON trouvé dans la réponse Claude`)
      return null
    }

    parsed = JSON.parse(jsonMatch[0])
    console.log(`[${label}] JSON parsé — title: ${parsed.title ?? 'null'}, image_url: ${parsed.image_url ? 'présente' : 'null'}, price: ${parsed.price ?? 'null'}, currency: ${parsed.currency ?? 'null'}`)
  } catch (err) {
    console.warn(`[${label}] Claude échoué — ${(err as Error).message}`)
    return null
  } finally {
    clearTimeout(timer)
  }

  const title = typeof parsed.title === 'string' && parsed.title ? parsed.title : null
  if (!title) {
    console.warn(`[${label}] titre absent ou vide dans le JSON Claude`)
    return null
  }

  const price =
    parsed.price != null
      ? `${parsed.price}${parsed.currency ? ' ' + parsed.currency : ''}`
      : null

  const image =
    typeof parsed.image_url === 'string' && parsed.image_url ? parsed.image_url : null

  return { title, image, price }
}

// ── Niveau 1 : Open Graph + JSON-LD ──────────────────────────────────────────

async function scrapeLevel1(url: string): Promise<ScrapeResult | null> {
  console.log(`[L1] début — ${url}`)

  const res = await fetch(url, {
    headers: {
      'User-Agent': CHROME_UA,
      Accept:
        'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
      'Accept-Language': 'fr-FR,fr;q=0.9,en-US;q=0.8,en;q=0.7',
      'Accept-Encoding': 'gzip, deflate, br',
    },
    cache: 'no-store',
    signal: AbortSignal.timeout(4_000),
  })

  if (!res.ok) {
    throw new Error(`HTTP ${res.status}`)
  }

  const html = await res.text()
  console.log(`[L1] fetch OK — ${res.status}, ${html.length} chars`)

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

  console.log(`[L1] OG — title: ${ogTitle ? `"${ogTitle}"` : 'absent'}, image: ${ogImage ? 'présente' : 'absente'}, price: ${ogPrice ?? 'absent'}`)

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

  console.log(`[L1] JSON-LD — title: ${jsonLdTitle ? `"${jsonLdTitle}"` : 'absent'}, image: ${jsonLdImage ? 'présente' : 'absente'}, price: ${jsonLdPrice ?? 'absent'}`)

  const title = jsonLdTitle ?? ogTitle ?? ($('title').first().text().trim() || null)
  const image = jsonLdImage ?? ogImage ?? null
  const price = jsonLdPrice ?? ogPrice ?? null

  if (!title || !image) {
    console.log(`[L1] échec — ${!title ? 'titre manquant' : 'image manquante'}`)
    return null
  }

  console.log(`[L1] succès — title: "${title}", image: ${image}, price: ${price ?? 'null'}`)
  return { title, image, price }
}

// ── Niveau 2 : Claude texte sur HTML brut ────────────────────────────────────

async function scrapeLevel2(url: string): Promise<ScrapeResult | null> {
  if (!process.env.ANTHROPIC_API_KEY) {
    console.log('[L2] ignoré — ANTHROPIC_API_KEY absent')
    return null
  }

  console.log(`[L2] début — ${url}`)

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
      signal: AbortSignal.timeout(4_000),
    })
    if (!res.ok) {
      console.warn(`[L2] fetch non-200 (${res.status}) — passage direct à L3`)
      return null
    }
    html = await res.text()
    console.log(`[L2] fetch OK — ${res.status}, ${html.length} chars`)
    if (!html.trim()) {
      console.warn('[L2] body vide — passage direct à L3')
      return null
    }
  } catch (err) {
    console.warn(`[L2] fetch échoué — ${(err as Error).message}`)
    return null
  }

  const result = await extractWithClaude(html, 'L2')
  if (!result) return null

  let { image } = result

  // ── Étape 2 : Fallback image via ScrapingBee si Claude n'a pas trouvé ─
  if (!image) {
    if (!process.env.SCRAPINGBEE_KEY) {
      console.log('[L2] fallback image ignoré — SCRAPINGBEE_KEY absent')
    } else {
      console.log('[L2] image absente — tentative fallback ScrapingBee')
      try {
        const sbHtml = await fetchScrapingBee(url, 8_000)
        if (sbHtml) {
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
          console.log(`[L2] ScrapingBee fallback image — ${image ?? 'non trouvée'}`)
        }
      } catch (err) {
        console.warn(`[L2] ScrapingBee fallback échoué — ${(err as Error).message}`)
      }
    }
  }

  console.log(`[L2] succès — title: "${result.title}", image: ${image ?? 'null'}, price: ${result.price ?? 'null'}`)
  return { title: result.title, image, price: result.price }
}

// ── Niveau 3 : ScrapingBee + Cheerio ─────────────────────────────────────────

async function scrapeLevel3(url: string): Promise<ScrapeResult | null> {
  if (!process.env.SCRAPINGBEE_KEY) {
    console.log('[L3] ignoré — SCRAPINGBEE_KEY absent')
    return null
  }

  console.log(`[L3] début — ${url}`)

  const html = await fetchScrapingBee(url)
  if (!html) return null

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

  console.log(`[L3] Cheerio — title: ${title ? `"${title}"` : 'absent'}, image: ${image ? 'présente' : 'absente'}, price: ${price ?? 'absent'}`)

  if (!title || !image) {
    console.log(`[L3] échec — ${!title ? 'titre manquant' : 'image manquante'}`)
    return null
  }

  console.log(`[L3] succès — title: "${title}", image: ${image}, price: ${price ?? 'null'}`)
  return { title, image, price }
}

// ── Antibot : ScrapingBee direct + Claude texte ───────────────────────────────

/**
 * Chemin réservé aux domaines anti-bot connus (ANTIBOT_DOMAINS).
 * Bypass L1 et L2 : récupère directement le HTML via ScrapingBee,
 * puis tente l'extraction Claude texte. Fallback Cheerio si Claude est absent.
 */
async function scrapeAntibotDomain(url: string): Promise<ScrapeResult | null> {
  if (!process.env.SCRAPINGBEE_KEY) {
    console.log('[antibot] ignoré — SCRAPINGBEE_KEY absent')
    return null
  }

  console.log(`[antibot] ScrapingBee direct — ${url}`)

  let html: string
  try {
    html = (await fetchScrapingBee(url)) ?? ''
  } catch (err) {
    console.warn(`[antibot] ScrapingBee échoué — ${(err as Error).message}`)
    return null
  }

  if (!html) {
    console.warn('[antibot] HTML vide reçu de ScrapingBee')
    return null
  }

  // Tentative extraction Claude sur le HTML rendu
  const claudeResult = await extractWithClaude(html, 'antibot')
  if (claudeResult) {
    console.log(`[antibot] succès via Claude — title: "${claudeResult.title}", image: ${claudeResult.image ?? 'null'}, price: ${claudeResult.price ?? 'null'}`)
    return claudeResult
  }

  // Fallback Cheerio si Claude est indisponible ou a échoué
  console.log('[antibot] Claude indisponible ou échec — fallback Cheerio')
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

  console.log(`[antibot] Cheerio — title: ${title ? `"${title}"` : 'absent'}, image: ${image ? 'présente' : 'absente'}, price: ${price ?? 'absent'}`)

  if (!title || !image) {
    console.log(`[antibot] échec — ${!title ? 'titre manquant' : 'image manquante'}`)
    return null
  }

  console.log(`[antibot] succès via Cheerio — title: "${title}", image: ${image}, price: ${price ?? 'null'}`)
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

  // ── Détection anti-bot : bypass L1 et L2 ──────────────────────────────
  const hostname = new URL(url).hostname
  const isAntibot = ANTIBOT_DOMAINS.some((d) => hostname.includes(d))

  if (isAntibot) {
    console.log(`[scrape] domaine anti-bot détecté (${hostname}) — bypass L1/L2`)
    try {
      const result = await scrapeAntibotDomain(url)
      if (result?.title) {
        console.log(`[scrape] ✓ antibot retenu — title: "${result.title}", image: ${result.image ? 'présente' : 'null'}, price: ${result.price ?? 'null'}`)
        return NextResponse.json(result)
      }
    } catch (err) {
      console.warn(`[scrape] antibot — exception : ${(err as Error).message}`)
    }
    console.warn(`[scrape] ✗ antibot — tous les fallbacks ont échoué pour ${url}`)
    return NextResponse.json({
      title: null,
      image: null,
      price: null,
      error: "Impossible d'extraire les données de cette page",
    })
  }

  // ── Flux standard L1 → L2 → L3 ────────────────────────────────────────
  const levels: [number, (u: string) => Promise<ScrapeResult | null>][] = [
    [1, scrapeLevel1],
    [2, scrapeLevel2],
    [3, scrapeLevel3],
  ]

  for (const [level, fn] of levels) {
    try {
      const result = await fn(url)
      if (result?.title) {
        console.log(`[scrape] ✓ niveau ${level} retenu — title: "${result.title}", image: ${result.image ? 'présente' : 'null'}, price: ${result.price ?? 'null'}`)
        return NextResponse.json(result)
      }
      console.log(`[scrape] niveau ${level} — résultat incomplet, passage au suivant`)
    } catch (err) {
      console.warn(`[scrape] niveau ${level} — exception : ${(err as Error).message}`)
    }
  }

  console.warn(`[scrape] ✗ tous les niveaux ont échoué pour ${url}`)
  return NextResponse.json({
    title: null,
    image: null,
    price: null,
    error: "Impossible d'extraire les données de cette page",
  })
}
