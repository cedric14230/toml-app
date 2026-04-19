'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createSupabaseBrowserClient } from '@/lib/supabase/client'

type Priority = 'low' | 'medium' | 'high'

type Wishlist = {
  id: string
  title: string
}

type Props = {
  title: string
  image: string
  price: string
  sourceUrl: string
  wishlists: Wishlist[]
}

const STAR_TO_PRIORITY: Record<number, Priority> = { 1: 'low', 2: 'medium', 3: 'high' }
const PRIORITY_TO_STARS: Record<Priority, number> = { low: 1, medium: 2, high: 3 }
const PRIORITY_LABELS: Record<Priority, string> = { low: 'Basse', medium: 'Moyenne', high: 'Haute' }

function parsePrice(raw: string): number | null {
  if (!raw) return null
  const num = parseFloat(raw.replace(/[^\d.,]/g, '').replace(',', '.'))
  return isNaN(num) ? null : num
}

export default function AddItemFromBookmarklet({
  title: initialTitle,
  image,
  price: rawPrice,
  sourceUrl,
  wishlists,
}: Props) {
  const router = useRouter()
  const supabase = createSupabaseBrowserClient()

  const initialParsedPrice = parsePrice(rawPrice)

  const [title, setTitle] = useState(initialTitle)
  const [editablePrice, setEditablePrice] = useState(
    initialParsedPrice != null ? String(initialParsedPrice) : ''
  )
  const [editableSourceUrl, setEditableSourceUrl] = useState(sourceUrl)
  const [selectedWishlistId, setSelectedWishlistId] = useState(wishlists[0]?.id ?? '')
  const [note, setNote] = useState('')
  const [priority, setPriority] = useState<Priority>('medium')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!selectedWishlistId) return
    setError(null)
    setLoading(true)

    const { error: insertError } = await supabase.from('items').insert({
      wishlist_id: selectedWishlistId,
      title: title.trim(),
      source_url: editableSourceUrl.trim() || null,
      image_url: image || null,
      price: editablePrice ? parseFloat(editablePrice) : null,
      note: note.trim() || null,
      priority,
    })

    if (insertError) {
      setError(insertError.message)
      setLoading(false)
      return
    }

    router.push(`/dashboard/wishlists/${selectedWishlistId}`)
  }

  if (wishlists.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 mb-4">
          Vous n&apos;avez pas encore de wishlist. Créez-en une d&apos;abord depuis le tableau de bord.
        </p>
        <a
          href="/dashboard"
          className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors"
        >
          Aller au tableau de bord
        </a>
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Ajouter un article</h1>

      {/* Aperçu du produit */}
      {(image || title) && (
        <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl border border-gray-200 mb-6">
          {image && (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={image}
              alt=""
              className="w-20 h-20 rounded-lg object-cover flex-shrink-0 border border-gray-200"
            />
          )}
          <div className="flex-1 min-w-0">
            {title && (
              <p className="font-medium text-gray-900 line-clamp-2">{title}</p>
            )}
            {initialParsedPrice != null && (
              <p className="text-sm text-gray-500 mt-1">{initialParsedPrice.toFixed(2)} €</p>
            )}
            {sourceUrl && (
              <a
                href={sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-blue-600 hover:underline truncate block mt-1"
              >
                {new URL(sourceUrl).hostname.replace('www.', '')}
              </a>
            )}
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <div role="alert" className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
            {error}
          </div>
        )}

        {/* Titre */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1.5">
            Titre <span className="text-red-500" aria-hidden="true">*</span>
          </label>
          <input
            id="title"
            type="text"
            required
            maxLength={200}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Nom de l&apos;article"
            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition"
          />
        </div>

        {/* Wishlist */}
        <div>
          <label htmlFor="wishlist" className="block text-sm font-medium text-gray-700 mb-1.5">
            Ajouter à la wishlist
          </label>
          <select
            id="wishlist"
            value={selectedWishlistId}
            onChange={(e) => setSelectedWishlistId(e.target.value)}
            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition"
          >
            {wishlists.map((w) => (
              <option key={w.id} value={w.id}>
                {w.title}
              </option>
            ))}
          </select>
        </div>

        {/* Prix */}
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
              value={editablePrice}
              onChange={(e) => setEditablePrice(e.target.value)}
              placeholder="0.00"
              className="w-full pl-3 pr-8 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-400 pointer-events-none">
              €
            </span>
          </div>
        </div>

        {/* URL source */}
        <div>
          <label htmlFor="source-url" className="block text-sm font-medium text-gray-700 mb-1.5">
            URL du produit <span className="text-gray-400 font-normal">(optionnel)</span>
          </label>
          <input
            id="source-url"
            type="url"
            value={editableSourceUrl}
            onChange={(e) => setEditableSourceUrl(e.target.value)}
            placeholder="https://…"
            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition"
          />
        </div>

        {/* Note */}
        <div>
          <label htmlFor="note" className="block text-sm font-medium text-gray-700 mb-1.5">
            Note personnelle <span className="text-gray-400 font-normal">(optionnel)</span>
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

        {/* Priorité */}
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
            <span className="ml-2 text-sm text-gray-500">{PRIORITY_LABELS[priority]}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={() => router.back()}
            className="flex-1 py-2.5 px-4 border border-gray-300 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Annuler
          </button>
          <button
            type="submit"
            disabled={loading || !title.trim() || !selectedWishlistId}
            className="flex-1 py-2.5 px-4 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Ajout…' : 'Ajouter à ma wishlist'}
          </button>
        </div>
      </form>
    </div>
  )
}
