'use client'

import { useState, useEffect } from 'react'
import { createSupabaseBrowserClient } from '@/lib/supabase/client'
import type { Item } from './ItemCard'

type Priority = Item['priority']
type Tab = 'url' | 'manual'

// Correspondance étoile (1-3) → valeur enum
const STAR_TO_PRIORITY: Record<number, Priority> = { 1: 'low', 2: 'medium', 3: 'high' }
const PRIORITY_TO_STARS: Record<Priority, number> = { low: 1, medium: 2, high: 3 }
const PRIORITY_LABELS: Record<Priority, string> = { low: 'Basse', medium: 'Moyenne', high: 'Haute' }

type Props = {
  wishlistId: string
  onClose: () => void
  onSuccess: () => void
}

/**
 * Retourne l'URL canonique du produit, sans paramètres de tracking.
 *
 * Amazon :  .../dp/B0DGHYDYJL/ref=sr_1_1?dib=xxx → .../dp/B0DGHYDYJL
 * Autres  : strip query string + fragment
 */
function cleanProductUrl(raw: string): string {
  try {
    const url = new URL(raw)
    const host = url.hostname.replace(/^www\./, '')

    // Amazon : on garde uniquement la partie canonique jusqu'à l'ASIN
    if (/amazon\.[a-z]{2,3}(\.[a-z]{2})?$/.test(host)) {
      const match = url.pathname.match(/^((?:\/[^/]+)*\/dp\/[A-Z0-9]{10})/i)
      if (match) return url.origin + match[1]
    }

    // Règle générale : supprimer query string et fragment
    return url.origin + url.pathname
  } catch {
    return raw
  }
}

/**
 * Retourne true si le titre retourné par Microlink est générique et inutile.
 * Ex : "Product gallery", "Image", "Photo", ou moins de 5 caractères.
 */
function isGenericTitle(title: string): boolean {
  const lower = title.toLowerCase().trim()
  if (lower.length < 5) return true
  if (/\b(gallery|galleries|image|images|photo|photos)\b/.test(lower)) return true
  if (/^products?$/.test(lower)) return true
  return false
}

/**
 * Retourne true si l'URL pointe vers Amazon (tous domaines).
 */
function isAmazonUrl(url: string): boolean {
  try {
    const host = new URL(url).hostname.replace(/^www\./, '')
    return /amazon\.[a-z]{2,3}(\.[a-z]{2})?$/.test(host)
  } catch {
    return false
  }
}

/**
 * Fallback local : extrait un titre lisible depuis le chemin de l'URL.
 * Utilisé UNIQUEMENT si Microlink échoue complètement.
 *
 * Ex: amazon.fr/Apple-AirPods-Pro/dp/B0DGHYDYJL → "Apple AirPods Pro"
 */
function extractTitleFromUrl(raw: string): string {
  try {
    const url = new URL(raw)
    const hostname = url.hostname.replace(/^www\./, '')
    const parts = url.pathname.split('/').filter(Boolean)

    // Segments non-significatifs à ignorer
    const SKIP_EXACT = new Set(['dp', 'ref', 'gp', 's', 'b', 'p', 'sr'])
    const meaningful = parts.filter(
      (seg) =>
        !seg.includes('=') &&           // pas de params de tracking dans le path
        !/^[A-Z0-9]{10}$/.test(seg) &&  // pas d'ASIN Amazon
        !/^\d+$/.test(seg) &&           // pas d'ID numérique pur
        !SKIP_EXACT.has(seg.toLowerCase())
    )

    const candidate = meaningful[meaningful.length - 1]
    if (candidate && candidate.length > 2) {
      return candidate
        .replace(/[-_+]/g, ' ')
        .replace(/\.\w{2,5}$/, '')
        .replace(/\s{2,}/g, ' ')
        .trim()
    }
    return hostname
  } catch {
    return ''
  }
}

export default function AddItemModal({ wishlistId, onClose, onSuccess }: Props) {
  const supabase = createSupabaseBrowserClient()

  const [activeTab, setActiveTab] = useState<Tab>('url')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [priority, setPriority] = useState<Priority>('medium')

  // --- Onglet URL ---
  const [sourceUrl, setSourceUrl] = useState('')
  const [urlTitle, setUrlTitle] = useState('')
  const [urlImage, setUrlImage] = useState('')
  // Empêche l'écrasement si l'utilisateur a édité le titre manuellement
  const [urlTitleEdited, setUrlTitleEdited] = useState(false)
  // true quand Microlink a retourné un titre générique (ex: "Product gallery")
  const [urlTitleGeneric, setUrlTitleGeneric] = useState(false)
  // État du scraping Microlink
  const [scraping, setScraping] = useState(false)
  const [scrapeError, setScrapeError] = useState<string | null>(null)

  // --- Onglet Manuel ---
  const [manualTitle, setManualTitle] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [price, setPrice] = useState('')
  const [note, setNote] = useState('')

  // Fermeture sur Escape
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [onClose])

  /**
   * Déclenché au onBlur du champ URL.
   * 1. Nettoie l'URL (supprime tracking params)
   * 2. Appelle /api/scrape avec l'URL propre
   * 3. Microlink répond  → remplace toujours le titre local (sauf si user a tapé manuellement)
   * 4. Microlink échoue → titre local (extractTitleFromUrl) comme fallback
   */
  async function handleUrlBlur() {
    const trimmed = sourceUrl.trim()
    if (!trimmed || scraping) return
    try { new URL(trimmed) } catch { return }

    // URL nettoyée : ce qui est envoyé à Microlink (sans tracking)
    const cleanedUrl = cleanProductUrl(trimmed)

    setScraping(true)
    setScrapeError(null)
    setUrlTitleGeneric(false)

    try {
      const res = await fetch(`/api/scrape?url=${encodeURIComponent(cleanedUrl)}`)
      const data = await res.json()

      if (!res.ok) {
        setScrapeError(data.error ?? 'Impossible de récupérer les métadonnées')
        // Fallback local uniquement si aucun titre n'est encore présent
        if (!urlTitleEdited && !urlTitle) {
          const local = extractTitleFromUrl(cleanedUrl)
          if (local) setUrlTitle(local)
        }
        return
      }

      // Microlink a répondu : son titre remplace toujours le titre local.
      // Exception : si l'utilisateur a déjà tapé manuellement (urlTitleEdited).
      if (data.title && !urlTitleEdited) {
        if (isGenericTitle(data.title)) {
          setUrlTitle('')
          setUrlTitleGeneric(true)
        } else {
          setUrlTitle(data.title)
          setUrlTitleGeneric(false)
        }
      }
      if (data.image) setUrlImage(data.image)
    } catch {
      setScrapeError('Erreur réseau — saisis le titre manuellement')
      if (!urlTitleEdited && !urlTitle) {
        const local = extractTitleFromUrl(cleanedUrl)
        if (local) setUrlTitle(local)
      }
    } finally {
      setScraping(false)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const title = activeTab === 'url' ? urlTitle.trim() : manualTitle.trim()

    const { error } = await supabase.from('items').insert({
      wishlist_id: wishlistId,
      title,
      source_url: sourceUrl.trim() || null,
      image_url:  activeTab === 'manual' ? (imageUrl.trim() || null) : (urlImage || null),
      price:      activeTab === 'manual' && price ? parseFloat(price) : null,
      note:       activeTab === 'manual' ? (note.trim() || null) : null,
      priority,
    })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    onSuccess()
  }

  const isValid =
    activeTab === 'url'
      ? sourceUrl.trim().length > 0 && urlTitle.trim().length > 0
      : manualTitle.trim().length > 0

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/50 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-item-title"
        className="bg-white w-full sm:max-w-md rounded-t-2xl sm:rounded-2xl shadow-2xl flex flex-col max-h-[92vh]"
      >
        {/* En-tête fixe */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-gray-100 flex-shrink-0">
          <h2 id="add-item-title" className="text-lg font-semibold text-gray-900">
            Ajouter un article
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fermer"
            className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Scroll area */}
        <div className="overflow-y-auto flex-1">
          {/* Sélecteur d'onglets */}
          <div className="mx-6 mt-5">
            <div className="flex gap-1 p-1 bg-gray-100 rounded-lg" role="tablist">
              {(['url', 'manual'] as Tab[]).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  role="tab"
                  aria-selected={activeTab === tab}
                  onClick={() => setActiveTab(tab)}
                  className={`
                    flex-1 py-1.5 text-sm font-medium rounded-md transition-all
                    ${activeTab === tab
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-500 hover:text-gray-700'
                    }
                  `}
                >
                  {tab === 'url' ? 'Depuis une URL' : 'Saisie manuelle'}
                </button>
              ))}
            </div>
          </div>

          {/* Formulaire */}
          <form id="add-item-form" onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
            {error && (
              <div role="alert" className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
                {error}
              </div>
            )}

            {/* ── Onglet URL ─────────────────────────────────────────── */}
            {activeTab === 'url' && (
              <>
                {/* Champ URL avec spinner de scraping */}
                <div>
                  <label htmlFor="source-url" className="block text-sm font-medium text-gray-700 mb-1.5">
                    URL du produit <span className="text-red-500" aria-hidden="true">*</span>
                  </label>
                  <div className="relative">
                    <input
                      id="source-url"
                      type="url"
                      autoFocus
                      required
                      value={sourceUrl}
                      onChange={(e) => setSourceUrl(e.target.value)}
                      onBlur={handleUrlBlur}
                      placeholder="https://www.amazon.fr/…"
                      className="w-full px-3 py-2.5 pr-10 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition"
                    />
                    {/* Spinner visible pendant le scraping */}
                    {scraping && (
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                        <svg
                          className="animate-spin w-4 h-4 text-gray-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          aria-hidden="true"
                        >
                          <circle
                            className="opacity-25"
                            cx="12" cy="12" r="10"
                            stroke="currentColor" strokeWidth="4"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                          />
                        </svg>
                      </div>
                    )}
                  </div>

                  {/* Message d'erreur non-bloquant : le formulaire reste utilisable */}
                  {scrapeError && (
                    <p className="mt-1.5 flex items-center gap-1.5 text-xs text-amber-700">
                      <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                      {scrapeError} — vous pouvez saisir le titre manuellement.
                    </p>
                  )}
                </div>

                {/* Titre — auto-rempli par Microlink ou suggéré depuis l'URL */}
                <div>
                  <label htmlFor="url-title" className="block text-sm font-medium text-gray-700 mb-1.5">
                    Titre <span className="text-red-500" aria-hidden="true">*</span>
                    {urlTitle && !urlTitleEdited && !scraping && (
                      <span className="ml-1.5 text-xs text-emerald-600 font-normal">
                        — récupéré automatiquement
                      </span>
                    )}
                  </label>
                  <input
                    id="url-title"
                    type="text"
                    required
                    maxLength={200}
                    value={urlTitle}
                    onChange={(e) => {
                      setUrlTitle(e.target.value)
                      setUrlTitleEdited(true)
                      setUrlTitleGeneric(false)
                    }}
                    placeholder={
                      scraping
                        ? 'Récupération en cours…'
                        : urlTitleGeneric
                        ? 'Modifiez le titre du produit…'
                        : 'Nom de l\'article'
                    }
                    className={`w-full px-3 py-2.5 border rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:border-transparent transition ${
                      urlTitleGeneric
                        ? 'border-amber-300 placeholder-amber-500 focus:ring-amber-400'
                        : 'border-gray-300 placeholder-gray-400 focus:ring-gray-900'
                    }`}
                  />
                  {isAmazonUrl(sourceUrl) && !scraping && (
                    <p className="mt-1.5 flex items-center gap-1.5 text-xs text-gray-400">
                      <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Amazon masque parfois le titre — vérifiez et corrigez si besoin
                    </p>
                  )}
                </div>

                {/* Aperçu de l'image scrapée */}
                {urlImage && (
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-200">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={urlImage}
                      alt=""
                      className="w-12 h-12 rounded-lg object-cover flex-shrink-0 border border-gray-200"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-gray-700">Image récupérée</p>
                      <p className="text-xs text-gray-400 truncate mt-0.5">{urlImage}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setUrlImage('')}
                      aria-label="Supprimer l'image"
                      className="flex-shrink-0 p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                )}
              </>
            )}

            {/* ── Onglet Manuel ──────────────────────────────────────── */}
            {activeTab === 'manual' && (
              <>
                <div>
                  <label htmlFor="manual-title" className="block text-sm font-medium text-gray-700 mb-1.5">
                    Titre <span className="text-red-500" aria-hidden="true">*</span>
                  </label>
                  <input
                    id="manual-title"
                    type="text"
                    autoFocus
                    required
                    maxLength={200}
                    value={manualTitle}
                    onChange={(e) => setManualTitle(e.target.value)}
                    placeholder="Ex : Nike Air Max 90, Livre de cuisine…"
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition"
                  />
                </div>

                <div>
                  <label htmlFor="image-url" className="block text-sm font-medium text-gray-700 mb-1.5">
                    Image <span className="text-gray-400 font-normal">(URL optionnelle)</span>
                  </label>
                  <input
                    id="image-url"
                    type="url"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="https://…"
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition"
                  />
                </div>

                <div>
                  <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1.5">
                    Prix <span className="text-gray-400 font-normal">(optionnel)</span>
                  </label>
                  <div className="relative">
                    <input
                      id="price"
                      type="number"
                      min="0"
                      step="0.01"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      placeholder="0.00"
                      className="w-full pl-3 pr-8 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-400 pointer-events-none">
                      €
                    </span>
                  </div>
                </div>

                <div>
                  <label htmlFor="note" className="block text-sm font-medium text-gray-700 mb-1.5">
                    Note <span className="text-gray-400 font-normal">(optionnel)</span>
                  </label>
                  <textarea
                    id="note"
                    rows={2}
                    maxLength={500}
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Taille, couleur, modèle exact…"
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition resize-none"
                  />
                </div>
              </>
            )}

            {/* ── Priorité (commun aux deux onglets) ─────────────────── */}
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">Priorité</p>
              <div className="flex items-center gap-0.5">
                {[1, 2, 3].map((star) => {
                  const filled = PRIORITY_TO_STARS[priority] >= star
                  return (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setPriority(STAR_TO_PRIORITY[star])}
                      aria-label={`Priorité ${star} étoile${star > 1 ? 's' : ''}`}
                      className="p-1 hover:scale-110 transition-transform focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 rounded"
                    >
                      <svg
                        className={`w-7 h-7 transition-colors ${filled ? 'text-amber-400' : 'text-gray-200'}`}
                        fill="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                      </svg>
                    </button>
                  )
                })}
                <span className="ml-2 text-sm text-gray-500">
                  {PRIORITY_LABELS[priority]}
                </span>
              </div>
            </div>
          </form>
        </div>

        {/* Actions fixées en bas */}
        <div className="flex gap-3 px-6 py-4 border-t border-gray-100 flex-shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 px-4 border border-gray-300 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Annuler
          </button>
          <button
            type="submit"
            form="add-item-form"
            disabled={loading || !isValid}
            className="flex-1 py-2.5 px-4 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Ajout…' : 'Ajouter'}
          </button>
        </div>
      </div>
    </div>
  )
}
