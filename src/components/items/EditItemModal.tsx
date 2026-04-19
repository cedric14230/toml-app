'use client'

import { useEffect, useState } from 'react'
import { createSupabaseBrowserClient } from '@/lib/supabase/client'
import type { Item } from './ItemCard'

type Priority = Item['priority']

const STAR_TO_PRIORITY: Record<number, Priority> = { 1: 'low', 2: 'medium', 3: 'high' }
const PRIORITY_TO_STARS: Record<Priority, number> = { low: 1, medium: 2, high: 3 }
const PRIORITY_LABELS: Record<Priority, string> = { low: 'Basse', medium: 'Moyenne', high: 'Haute' }

type Props = {
  item: Item
  onClose: () => void
  onSuccess: () => void
  /** Déclenche la confirmation de suppression dans le parent */
  onDelete?: () => void
}

export default function EditItemModal({ item, onClose, onSuccess, onDelete }: Props) {
  const supabase = createSupabaseBrowserClient()

  const [title, setTitle] = useState(item.title)
  const [sourceUrl, setSourceUrl] = useState(item.source_url ?? '')
  const [imageUrl, setImageUrl] = useState(item.image_url ?? '')
  const [price, setPrice] = useState(item.price != null ? String(item.price) : '')
  const [note, setNote] = useState(item.note ?? '')
  const [priority, setPriority] = useState<Priority>(item.priority)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Fermeture sur Escape
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const { error: err } = await supabase
      .from('items')
      .update({
        title: title.trim(),
        source_url: sourceUrl.trim() || null,
        image_url: imageUrl.trim() || null,
        price: price ? parseFloat(price) : null,
        note: note.trim() || null,
        priority,
      })
      .eq('id', item.id)

    if (err) {
      setError(err.message)
      setLoading(false)
      return
    }

    onSuccess()
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/50 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="edit-item-title"
        className="bg-white w-full sm:max-w-md rounded-t-2xl sm:rounded-2xl shadow-2xl flex flex-col max-h-[92vh]"
      >
        {/* En-tête */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-gray-100 flex-shrink-0">
          <h2 id="edit-item-title" className="text-lg font-semibold text-gray-900">
            Modifier l&apos;article
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

        {/* Formulaire scrollable */}
        <div className="overflow-y-auto flex-1">
          <form id="edit-item-form" onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
            {error && (
              <div role="alert" className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
                {error}
              </div>
            )}

            {/* Titre */}
            <div>
              <label htmlFor="edit-title" className="block text-sm font-medium text-gray-700 mb-1.5">
                Titre <span className="text-red-500" aria-hidden="true">*</span>
              </label>
              <input
                id="edit-title"
                type="text"
                autoFocus
                required
                maxLength={200}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition"
              />
            </div>

            {/* URL source */}
            <div>
              <label htmlFor="edit-source-url" className="block text-sm font-medium text-gray-700 mb-1.5">
                URL du produit{' '}
                <span className="text-gray-400 font-normal">(optionnel)</span>
              </label>
              <input
                id="edit-source-url"
                type="url"
                value={sourceUrl}
                onChange={(e) => setSourceUrl(e.target.value)}
                placeholder="https://…"
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition"
              />
            </div>

            {/* Image URL + aperçu */}
            <div>
              <label htmlFor="edit-image-url" className="block text-sm font-medium text-gray-700 mb-1.5">
                Image{' '}
                <span className="text-gray-400 font-normal">(URL optionnelle)</span>
              </label>
              {imageUrl && (
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-200 mb-2">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={imageUrl}
                    alt=""
                    className="w-12 h-12 rounded-lg object-cover flex-shrink-0 border border-gray-200"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-gray-700">Aperçu</p>
                    <p className="text-xs text-gray-400 truncate mt-0.5">{imageUrl}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setImageUrl('')}
                    aria-label="Supprimer l'image"
                    className="flex-shrink-0 p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              )}
              <input
                id="edit-image-url"
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://…"
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition"
              />
            </div>

            {/* Prix */}
            <div>
              <label htmlFor="edit-price" className="block text-sm font-medium text-gray-700 mb-1.5">
                Prix{' '}
                <span className="text-gray-400 font-normal">(optionnel)</span>
              </label>
              <div className="relative">
                <input
                  id="edit-price"
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

            {/* Note */}
            <div>
              <label htmlFor="edit-note" className="block text-sm font-medium text-gray-700 mb-1.5">
                Note{' '}
                <span className="text-gray-400 font-normal">(optionnel)</span>
              </label>
              <textarea
                id="edit-note"
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
          </form>
        </div>

        {/* Boutons d'action */}
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
            form="edit-item-form"
            disabled={loading || !title.trim()}
            className="flex-1 py-2.5 px-4 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Enregistrement…' : 'Enregistrer'}
          </button>
        </div>
      </div>
    </div>
  )
}
