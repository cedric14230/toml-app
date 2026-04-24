/**
 * TOML Chrome Extension — Service Worker (Manifest V3)
 *
 * Au clic sur l'icône TOML :
 *  1. Lit les OG tags + JSON-LD de la page active
 *  2. Ouvre un nouvel onglet vers toml-app.vercel.app/add-item
 *     avec title, image, price et sourceUrl en query params
 */

const BASE_URL = 'https://toml-app.vercel.app/add-item'

chrome.action.onClicked.addListener(async (tab) => {
  if (!tab.id) return

  try {
    const [{ result }] = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: extractPageData,
    })

    const params = new URLSearchParams()
    if (result.title)     params.set('title',     result.title)
    if (result.image)     params.set('image',      result.image)
    if (result.price)     params.set('price',      result.price)
    if (result.sourceUrl) params.set('sourceUrl',  result.sourceUrl)

    const qs = params.toString()
    chrome.tabs.create({ url: qs ? `${BASE_URL}?${qs}` : BASE_URL })
  } catch (err) {
    console.error('[TOML] Impossible de lire les données de la page :', err)
    // Fallback : ouvrir l'interface sans pré-remplissage
    chrome.tabs.create({ url: BASE_URL })
  }
})

/**
 * Fonction injectée dans la page active (contexte de la page, pas du SW).
 * Lit : OG tags, meta product, JSON-LD Product schema.
 */
function extractPageData() {
  /** Lit le contenu d'une balise <meta> par property ou name */
  function meta(attr) {
    const el = document.querySelector(
      `meta[property="${attr}"], meta[name="${attr}"]`
    )
    return el?.content?.trim() ?? ''
  }

  let title     = meta('og:title')   || document.title || ''
  let image     = meta('og:image')   || ''
  let price     = meta('product:price:amount') ||
                  meta('og:price:amount')      ||
                  meta('price')                ||
                  ''
  const sourceUrl = location.href

  // ── JSON-LD Product schema ─────────────────────────────────────────────
  document.querySelectorAll('script[type="application/ld+json"]').forEach((s) => {
    try {
      const nodes = [].concat(JSON.parse(s.textContent))
      for (const node of nodes) {
        const types = [].concat(node['@type'] ?? [])
        if (!types.includes('Product')) continue

        if (!title && node.name)  title = String(node.name).trim()

        if (!image && node.image) {
          const img = [].concat(node.image)[0]
          image = typeof img === 'string' ? img : (img?.url ?? '')
        }

        if (!price && node.offers) {
          const offer = [].concat(node.offers)[0]
          if (offer?.price != null) price = String(offer.price)
        }
      }
    } catch (_) {
      // JSON-LD malformé — on ignore
    }
  })

  // ── Nettoyage titre ────────────────────────────────────────────────────
  // Certains sites ajoutent le nom du site (ex. "Produit — Boutique")
  title = title.replace(/\s*[|\-–—]\s*[^|\-–—]+$/, '').trim()

  return { title, image, price, sourceUrl }
}
