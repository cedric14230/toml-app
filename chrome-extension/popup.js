/**
 * TOML Chrome Extension — Popup
 *
 * Flux :
 *  1. Lit les données produit de la page active (OG tags + JSON-LD)
 *  2. Vérifie la session via GET /api/wishlists (credentials:'include')
 *  3. Affiche l'aperçu produit + dropdown wishlist
 *  4. POST /api/items au clic sur "Ajouter à TOML"
 */

const BASE = 'https://toml.fr'

// ── Références DOM ────────────────────────────────────────────────────────
const states = {
  loading:  document.getElementById('s-loading'),
  auth:     document.getElementById('s-auth'),
  main:     document.getElementById('s-main'),
  success:  document.getElementById('s-success'),
  error:    document.getElementById('s-error'),
}

function showState(name) {
  Object.entries(states).forEach(([k, el]) => {
    el.classList.toggle('active', k === name)
  })
}

// ── Extraction des données produit (injectée dans la page active) ─────────
function extractPageData() {
  function meta(attr) {
    const el = document.querySelector(
      `meta[property="${attr}"], meta[name="${attr}"]`
    )
    return el?.content?.trim() ?? ''
  }

  let title   = meta('og:title')   || document.title || ''
  let image   = meta('og:image')   || ''
  let price   = meta('product:price:amount') ||
                meta('og:price:amount')      ||
                meta('price')                ||
                ''
  const sourceUrl = location.href

  // JSON-LD Product schema
  document.querySelectorAll('script[type="application/ld+json"]').forEach((s) => {
    try {
      const nodes = [].concat(JSON.parse(s.textContent))
      for (const node of nodes) {
        const types = [].concat(node['@type'] ?? [])
        if (!types.includes('Product')) continue

        if (!title && node.name) title = String(node.name).trim()

        if (!image && node.image) {
          const img = [].concat(node.image)[0]
          image = typeof img === 'string' ? img : (img?.url ?? '')
        }

        if (!price && node.offers) {
          const offer = [].concat(node.offers)[0]
          if (offer?.price != null) price = String(offer.price)
        }
      }
    } catch (_) { /* JSON-LD malformé */ }
  })

  // Supprime le suffixe "— Nom du site" dans le titre
  title = title.replace(/\s*[|\-–—]\s*[^|\-–—]+$/, '').trim()

  return { title, image, price, sourceUrl }
}

// ── État interne ──────────────────────────────────────────────────────────
let state = {
  product: { title: '', image: '', price: '', sourceUrl: '' },
  wishlists: [],
  selectedWishlistId: null,
  selectedWishlistTitle: '',
  addedItem: null,
}

// ── Init ──────────────────────────────────────────────────────────────────
async function init() {
  showState('loading')

  // 1. Récupérer l'onglet actif
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })

  // 2. Extraire les données produit de la page
  try {
    const [{ result }] = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: extractPageData,
    })
    state.product = result
  } catch (_) {
    // Page non accessible (ex: chrome://) — on continue avec l'URL du tab
    state.product = { title: '', image: '', price: '', sourceUrl: tab.url ?? '' }
  }

  // 3. Vérifier l'authentification via /api/wishlists
  let wishlists
  try {
    const res = await fetch(`${BASE}/api/wishlists`, {
      credentials: 'include',
    })

    if (res.status === 401) {
      showState('auth')
      return
    }

    if (!res.ok) throw new Error(`Erreur ${res.status}`)

    wishlists = await res.json()
  } catch (err) {
    showError(`Impossible de contacter TOML.\nVérifiez votre connexion.\n\n${err.message}`)
    return
  }

  state.wishlists = Array.isArray(wishlists) ? wishlists : []

  // 4. Afficher l'interface principale
  renderMain(tab)
}

// ── Rendu de l'état principal ─────────────────────────────────────────────
function renderMain(tab) {
  const { product, wishlists } = state

  // Domain dans le header
  try {
    const url = new URL(product.sourceUrl || tab.url)
    document.getElementById('header-domain').textContent = url.hostname.replace(/^www\./, '')
  } catch (_) {}

  // Aperçu image
  const img = document.getElementById('preview-img')
  const placeholder = document.getElementById('preview-placeholder')
  if (product.image) {
    img.src = product.image
    img.style.display = 'block'
    placeholder.style.display = 'none'
    img.onerror = () => {
      img.style.display = 'none'
      placeholder.style.display = 'flex'
    }
  }

  // Titre et prix
  const titleEl = document.getElementById('preview-title')
  const priceEl = document.getElementById('preview-price')
  const noDataEl = document.getElementById('preview-no-data')

  if (product.title) {
    titleEl.textContent = product.title
  } else {
    titleEl.textContent = tab.title || 'Article sans titre'
    titleEl.style.color = '#999'
  }

  if (product.price) {
    const num = parseFloat(product.price)
    priceEl.textContent = isNaN(num)
      ? product.price
      : num.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })
  }

  if (!product.title && !product.image && !product.price) {
    noDataEl.style.display = 'block'
  }

  // Dropdown wishlists
  const select = document.getElementById('wishlist-select')
  select.innerHTML = '<option value="">Choisir une wishlist…</option>'

  if (wishlists.length === 0) {
    const opt = document.createElement('option')
    opt.disabled = true
    opt.textContent = 'Aucune wishlist — créez-en une sur TOML'
    select.appendChild(opt)
  } else {
    wishlists.forEach((wl) => {
      const opt = document.createElement('option')
      opt.value = wl.id
      opt.textContent = wl.title
      select.appendChild(opt)
    })
  }

  // Activer le bouton "Ajouter" quand une wishlist est sélectionnée
  const btnAdd = document.getElementById('btn-add')
  select.addEventListener('change', () => {
    const selected = wishlists.find((wl) => wl.id === select.value)
    state.selectedWishlistId = select.value || null
    state.selectedWishlistTitle = selected?.title ?? ''
    btnAdd.disabled = !state.selectedWishlistId
  })

  showState('main')
}

// ── Ajouter l'article ─────────────────────────────────────────────────────
async function addItem() {
  const { product, selectedWishlistId, selectedWishlistTitle } = state
  if (!selectedWishlistId) return

  const btnAdd = document.getElementById('btn-add')
  btnAdd.disabled = true
  btnAdd.textContent = 'Ajout en cours…'

  const body = {
    wishlist_id: selectedWishlistId,
    title: product.title || document.title || 'Article sans titre',
    image_url:  product.image   || null,
    source_url: product.sourceUrl || null,
    price:      product.price ? parseFloat(product.price) || null : null,
  }

  try {
    const res = await fetch(`${BASE}/api/items`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })

    if (res.status === 401) {
      showState('auth')
      return
    }

    const data = await res.json()

    if (!res.ok) {
      showError(data.error || `Erreur ${res.status}`)
      return
    }

    state.addedItem = data.item
    renderSuccess(selectedWishlistId, selectedWishlistTitle)
  } catch (err) {
    showError(`Erreur réseau : ${err.message}`)
  }
}

// ── Rendu succès ──────────────────────────────────────────────────────────
function renderSuccess(wishlistId, wishlistTitle) {
  document.getElementById('success-wishlist-name').textContent =
    wishlistTitle
      ? `Article ajouté à "${wishlistTitle}".`
      : "L'article a été ajouté à votre wishlist."

  document.getElementById('btn-open-wishlist').dataset.wishlistId = wishlistId
  showState('success')
}

// ── Erreur ────────────────────────────────────────────────────────────────
function showError(msg) {
  document.getElementById('error-msg').textContent = msg
  showState('error')
}

// ── Écouteurs d'événements ────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  // Se connecter
  document.getElementById('btn-login').addEventListener('click', () => {
    chrome.tabs.create({ url: `${BASE}/auth/login` })
  })

  // Ajouter l'article
  document.getElementById('btn-add').addEventListener('click', addItem)

  // Voir la wishlist (succès)
  document.getElementById('btn-open-wishlist').addEventListener('click', (e) => {
    const id = e.currentTarget.dataset.wishlistId
    chrome.tabs.create({ url: `${BASE}/dashboard/wishlists/${id}` })
  })

  // Ajouter un autre article (succès → retour)
  document.getElementById('btn-add-another').addEventListener('click', () => {
    state.selectedWishlistId = null
    state.selectedWishlistTitle = ''
    state.addedItem = null
    init()
  })

  // Réessayer après erreur
  document.getElementById('btn-retry').addEventListener('click', init)

  // Démarrer
  init()
})
