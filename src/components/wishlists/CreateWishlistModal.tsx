'use client'

import { useState, useEffect, useRef } from 'react'
import { createSupabaseBrowserClient } from '@/lib/supabase/client'
import type { Wishlist } from './WishlistCard'

type Visibility = Wishlist['visibility']

type Props = {
  onClose: () => void
  onSuccess: () => void
}

const VISIBILITY_OPTIONS: {
  value: Visibility
  label: string
  description: string
  icon: React.ReactNode
}[] = [
  {
    value: 'private',
    label: 'Privé',
    description: 'Vous seul',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}
          d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
    ),
  },
  {
    value: 'friends',
    label: 'Amis',
    description: 'Vos amis',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}
          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
  {
    value: 'public',
    label: 'Public',
    description: 'Tout le monde',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}
          d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
]

export default function CreateWishlistModal({ onClose, onSuccess }: Props) {
  const supabase = createSupabaseBrowserClient()
  const titleRef = useRef<HTMLInputElement>(null)

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [visibility, setVisibility] = useState<Visibility>('friends')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  // Focus automatique sur le titre à l'ouverture
  useEffect(() => {
    titleRef.current?.focus()
  }, [])

  // Fermeture sur la touche Escape
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [onClose])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      setError('Session expirée. Recharge la page.')
      setLoading(false)
      return
    }

    const { error } = await supabase.from('wishlists').insert({
      user_id: user.id,
      title: title.trim(),
      description: description.trim() || null,
      visibility,
    })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    // onSuccess ferme le modal et déclenche router.refresh() dans WishlistGrid
    onSuccess()
  }

  return (
    // Backdrop — clic en dehors ferme le modal
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/50 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        className="bg-white w-full sm:max-w-md rounded-t-2xl sm:rounded-2xl shadow-2xl"
      >
        {/* En-tête */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-gray-100">
          <h2 id="modal-title" className="text-lg font-semibold text-gray-900">
            Nouvelle wishlist
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

        {/* Formulaire */}
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-5">
          {error && (
            <div role="alert" className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
              {error}
            </div>
          )}

          {/* Titre */}
          <div>
            <label htmlFor="wl-title" className="block text-sm font-medium text-gray-700 mb-1.5">
              Titre <span className="text-red-500" aria-hidden="true">*</span>
            </label>
            <input
              id="wl-title"
              ref={titleRef}
              type="text"
              required
              maxLength={100}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex : Noël, Anniversaire, Liste appart…"
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition"
            />
          </div>

          {/* Description */}
          <div>
            <label htmlFor="wl-description" className="block text-sm font-medium text-gray-700 mb-1.5">
              Description{' '}
              <span className="text-gray-400 font-normal">(optionnel)</span>
            </label>
            <textarea
              id="wl-description"
              rows={3}
              maxLength={300}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Décrivez votre liste en quelques mots…"
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition resize-none"
            />
          </div>

          {/* Visibilité */}
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">Visibilité</p>
            <div className="grid grid-cols-3 gap-2" role="radiogroup" aria-label="Visibilité de la wishlist">
              {VISIBILITY_OPTIONS.map((opt) => {
                const isSelected = visibility === opt.value
                return (
                  <label
                    key={opt.value}
                    className={`
                      flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 cursor-pointer
                      text-center transition-all duration-100 select-none
                      ${isSelected
                        ? 'border-gray-900 bg-gray-900 text-white'
                        : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50'
                      }
                    `}
                  >
                    <input
                      type="radio"
                      name="visibility"
                      value={opt.value}
                      checked={isSelected}
                      onChange={() => setVisibility(opt.value)}
                      className="sr-only"
                    />
                    <span aria-hidden="true">{opt.icon}</span>
                    <span className="text-xs font-semibold leading-none">{opt.label}</span>
                    <span className={`text-[10px] leading-none ${isSelected ? 'text-gray-300' : 'text-gray-400'}`}>
                      {opt.description}
                    </span>
                  </label>
                )
              })}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 px-4 border border-gray-300 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading || !title.trim()}
              className="flex-1 py-2.5 px-4 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Création…' : 'Créer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
