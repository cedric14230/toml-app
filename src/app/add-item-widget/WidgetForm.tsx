'use client'

import { useState } from 'react'
import { createSupabaseBrowserClient } from '@/lib/supabase/client'

type Priority = 'low' | 'medium' | 'high'

type Wishlist = { id: string; title: string }

type Props = {
  title: string
  image: string
  price: string
  sourceUrl: string
  wishlists: Wishlist[]
}

const STAR_TO_PRIORITY: Record<number, Priority> = { 1: 'low', 2: 'medium', 3: 'high' }
const PRIORITY_TO_STARS: Record<Priority, number> = { low: 1, medium: 2, high: 3 }

function parsePrice(raw: string): number | null {
  if (!raw) return null
  const n = parseFloat(raw.replace(/[^\d.,]/g, '').replace(',', '.'))
  return isNaN(n) ? null : n
}

export default function WidgetForm({ title: initialTitle, image, price: rawPrice, sourceUrl, wishlists }: Props) {
  const supabase = createSupabaseBrowserClient()

  const [title, setTitle] = useState(initialTitle)
  const [wishlistId, setWishlistId] = useState(wishlists[0]?.id ?? '')
  const [priority, setPriority] = useState<Priority>('medium')
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const parsedPrice = parsePrice(rawPrice)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!wishlistId) return
    setError(null)
    setLoading(true)

    const { error: err } = await supabase.from('items').insert({
      wishlist_id: wishlistId,
      title: title.trim(),
      source_url: sourceUrl || null,
      image_url: image || null,
      price: parsedPrice,
      priority,
    })

    if (err) {
      setError(err.message)
      setLoading(false)
      return
    }

    setDone(true)
    // Prévient la page parente (bookmarklet) que l'article a été ajouté
    window.parent.postMessage({ type: 'toml-item-added' }, '*')
  }

  // ── État succès ─────────────────────────────────────────────────────────────
  if (done) {
    return (
      <div className="flex flex-col items-center justify-center h-full py-12 gap-3">
        <div className="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center">
          <svg className="w-7 h-7 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <p className="text-sm font-semibold text-gray-900">Article ajouté !</p>
        <p className="text-xs text-gray-400">La fenêtre va se fermer…</p>
      </div>
    )
  }

  // ── Pas de wishlist ──────────────────────────────────────────────────────────
  if (wishlists.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full py-10 gap-4 px-6 text-center">
        <p className="text-sm text-gray-500">
          Vous n&apos;avez pas encore de wishlist.
        </p>
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-medium text-gray-900 underline underline-offset-2"
        >
          Créer une wishlist sur TOML
        </a>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col h-full">
      {/* Aperçu produit */}
      <div className="flex items-start gap-3 px-4 py-3 bg-gray-50 border-b border-gray-100">
        {image && (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={image}
            alt=""
            className="w-14 h-14 rounded-lg object-cover flex-shrink-0 border border-gray-200"
          />
        )}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-gray-900 line-clamp-2 leading-snug">
            {title || 'Article sans titre'}
          </p>
          {parsedPrice != null && (
            <p className="text-xs text-gray-500 mt-0.5">{parsedPrice.toFixed(2)} €</p>
          )}
          {sourceUrl && (
            <p className="text-xs text-gray-400 truncate mt-0.5">
              {new URL(sourceUrl).hostname.replace('www.', '')}
            </p>
          )}
        </div>
      </div>

      {/* Formulaire */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {error && (
          <div role="alert" className="text-xs text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
            {error}
          </div>
        )}

        {/* Titre */}
        <div>
          <label htmlFor="w-title" className="block text-xs font-medium text-gray-600 mb-1">
            Titre
          </label>
          <input
            id="w-title"
            type="text"
            required
            maxLength={200}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition"
          />
        </div>

        {/* Wishlist */}
        <div>
          <label htmlFor="w-wishlist" className="block text-xs font-medium text-gray-600 mb-1">
            Ajouter à
          </label>
          <select
            id="w-wishlist"
            value={wishlistId}
            onChange={(e) => setWishlistId(e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition"
          >
            {wishlists.map((w) => (
              <option key={w.id} value={w.id}>
                {w.title}
              </option>
            ))}
          </select>
        </div>

        {/* Priorité */}
        <div>
          <p className="text-xs font-medium text-gray-600 mb-1.5">Priorité</p>
          <div className="flex items-center gap-0.5">
            {[1, 2, 3].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setPriority(STAR_TO_PRIORITY[star])}
                aria-label={`${star} étoile${star > 1 ? 's' : ''}`}
                className="p-0.5 focus:outline-none"
              >
                <svg
                  className={`w-6 h-6 transition-colors ${
                    PRIORITY_TO_STARS[priority] >= star ? 'text-amber-400' : 'text-gray-200'
                  }`}
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Bouton fixé en bas */}
      <div className="px-4 pb-4 pt-3 border-t border-gray-100 flex-shrink-0">
        <button
          type="submit"
          disabled={loading || !title.trim() || !wishlistId}
          className="w-full py-2.5 bg-gray-900 text-white text-sm font-semibold rounded-xl hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? 'Ajout en cours…' : 'Ajouter à ma wishlist'}
        </button>
      </div>
    </form>
  )
}
