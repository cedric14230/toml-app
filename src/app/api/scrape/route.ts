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
 * │ NIVEAU 2 — Puppeteer + Claude Vision (coûte ~0,003 $ / appel)      │
 * │   Lance Chromium via @sparticuz/chromium (optimisé serverless).    │
 * │   Prend un screenshot JPEG 1280×800 après rendu JS complet.        │
 * │   Envoie l'image à claude-sonnet-4-6 pour extraction structurée.   │
 * │   Nécessite ANTHROPIC_API_KEY. Skip si la clé est absente.         │
 * │   ⚠️  Vercel Hobby : timeout 10s probablement insuffisant.         │
 * │       Vercel Pro (maxDuration=60) ou déploiement Node.js autonome. │
 * ├─────────────────────────────────────────────────────────────────────┤
 * │ NIVEAU 3 — ScrapingBee render_js (proxies résidentiels, ~0,002 $)  │
 * │   Exécute la page dans un vrai Chromium avec IP résidentielle.     │
 * │   Passe les WAF (Cloudflare, CloudFront) avec un taux >95%.        │
 * │   Nécessite SCRAPINGBEE_KEY. Skip si la clé est absente.           │
 * └─────────────────────────────────────────────────────────────────────┘
 *
 * maxDuration = 60 s : nécessaire pour Puppeteer (Vercel Pro uniquement).
 * Sur Hobby plan, le niveau 2 sera tronqué ; les niveaux 1 et 3 restent ok.
 */
export const maxDuration = 60

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

// ── Niveau 2 : Puppeteer + Claude Vision ─────────────────────────────────────

async function scrapeLevel2(url: string): Promise<ScrapeResult | null> {
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    console.log('[scrape] niveau 2 ignoré : ANTHROPIC_API_KEY absent')
    return null
  }

  // Imports dynamiques pour ne charger ces modules lourds qu'au besoin
  const [{ default: chromium }, { default: puppeteer }] = await Promise.all([
    import('@sparticuz/chromium'),
    import('puppeteer-core'),
  ])

  // v147+ : headless déjà inclus dans chromium.args (--headless='shell')
  const browser = await puppeteer.launch({
    args: chromium.args,
    defaultViewport: { width: 1280, height: 800 },
    executablePath: await chromium.executablePath(),
  })

  let screenshotBase64: string
  try {
    const page = await browser.newPage()
    await page.setUserAgent(CHROME_UA)
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 20_000 })
    // Petit délai pour laisser le JS critique s'exécuter
    await new Promise((r) => setTimeout(r, 2000))

    const buffer = await page.screenshot({
      type: 'jpeg',
      quality: 75,
      clip: { x: 0, y: 0, width: 1280, height: 800 },
    })
    screenshotBase64 = Buffer.from(buffer).toString('base64')
  } finally {
    await browser.close()
  }

  // ── Appel Claude Vision ─────────────────────────────────────────────────
  const { default: Anthropic } = await import('@anthropic-ai/sdk')
  const anthropic = new Anthropic({ apiKey })

  const message = await anthropic.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 512,
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'image',
            source: {
              type: 'base64',
              media_type: 'image/jpeg',
              data: screenshotBase64,
            },
          },
          {
            type: 'text',
            text:
              'Tu es un assistant d\u2019extraction de donn\u00e9es produit. ' +
              'Analyse cette page e-commerce et extrais en JSON : ' +
              '{ "title": string, "price": string | null, "currency": string | null, ' +
              '"imageUrl": string | null, "description": string | null }. ' +
              'R\u00e9ponds UNIQUEMENT avec le JSON, sans texte autour.',
          },
        ],
      },
    ],
  })

  const raw =
    message.content[0].type === 'text' ? message.content[0].text : ''

  // Extrait le bloc JSON même si Claude ajoute du texte autour
  const jsonMatch = raw.match(/\{[\s\S]*\}/)
  if (!jsonMatch) return null

  const parsed: Record<string, unknown> = JSON.parse(jsonMatch[0])

  const title =
    typeof parsed.title === 'string' && parsed.title ? parsed.title : null
  if (!title) return null

  return {
    title,
    image: typeof parsed.imageUrl === 'string' ? parsed.imageUrl : null,
    price:
      parsed.price != null
        ? `${parsed.price}${parsed.currency ? ' ' + parsed.currency : ''}`
        : null,
  }
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
