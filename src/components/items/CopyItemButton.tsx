'use client'

import { useState } from 'react'
import type { Item } from './ItemCard'

type Wishlist = {
  id: string
  title: string
}

export default function CopyItemButton({
  item,
  variant = 'compact',
}: {
  item: Item
  /** 'compact' : petit bouton inline (dans ItemCard). 'full' : bouton pleine taille (fiche détail). */
  variant?: 'compact' | 'full'
}) {
  const [open, setOpen] = useState(false)
  const [wishlists, setWishlists] = useState<Wishlist[] | null>(null)
  const [loadingList, setLoadingList] = useState(false)
  const [copying, setCopying] = useState<string | null>(null)
  const [fetchError, setFetchError] = useState<string | null>(null)
  const [toast, setToast] = useState<string | null>(null)

  async function handleOpen(e: React.MouseEvent) {
    e.stopPropagation()
    setOpen(true)
    // Chargement paresseux : seulement au premier clic
    if (wishlists === null) {
      setLoadingList(true)
      setFetchError(null)
      try {
        const res = await fetch('/api/wishlists')
        if (!res.ok) {
          setFetchError('Impossible de charger vos wishlists.')
          return
        }
        const data = await res.json()
        setWishlists(Array.isArray(data) ? data : [])
      } catch {
        setFetchError('Impossible de charger vos wishlists.')
      } finally {
        setLoadingList(false)
      }
    }
  }

  function handleClose() {
    setOpen(false)
    setFetchError(null)
  }

  async function handleCopy(wl: Wishlist) {
    setCopying(wl.id)
    try {
      const res = await fetch('/api/items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          wishlist_id: wl.id,
          title: item.title,
          image_url: item.image_url,
          price: item.price,
          source_url: item.source_url,
        }),
      })
      if (!res.ok) {
        const data = await res.json()
        setFetchError(data.error ?? 'Erreur lors de la copie.')
        return
      }
      handleClose()
      setToast(`Ajouté à "${wl.title}"`)
      setTimeout(() => setToast(null), 3000)
    } catch {
      setFetchError('Erreur réseau — veuillez réessayer.')
    } finally {
      setCopying(null)
    }
  }

  return (
    <>
      {/* Bouton déclencheur */}
      {variant === 'full' ? (
        <button
          type="button"
          onClick={handleOpen}
          aria-label="Ajouter à ma liste"
          className="inline-flex items-center gap-2 px-4 py-2 border border-gray-200 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Ajouter à ma liste
        </button>
      ) : (
        <button
          type="button"
          onClick={handleOpen}
          aria-label="Ajouter à ma liste"
          className="flex items-center gap-1 px-2 py-1 text-xs font-medium text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
        >
          <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Ajouter
        </button>
      )}

      {/* Toast de confirmation */}
      {toast && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[70] bg-gray-900 text-white text-sm font-medium px-4 py-3 rounded-xl shadow-xl flex items-center gap-2 whitespace-nowrap pointer-events-none"
        >
          <svg className="w-4 h-4 text-emerald-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          {toast}
        </div>
      )}

      {/* Bottom sheet */}
      {open && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
            onClick={handleClose}
            aria-hidden="true"
          />

          {/* Sheet — fixed bottom-0 sur mobile, centré sur desktop */}
          <div
            className="fixed bottom-0 left-0 right-0 z-50 sm:inset-0 sm:flex sm:items-center sm:justify-center sm:p-4"
            onClick={(e) => { if (e.target === e.currentTarget) handleClose() }}
          >
            <div
              role="dialog"
              aria-modal="true"
              aria-labelledby="copy-sheet-title"
              className="bg-white w-full sm:max-w-sm rounded-t-2xl sm:rounded-2xl shadow-2xl flex flex-col max-h-[70vh] overflow-hidden"
            >
              {/* En-tête */}
              <div className="flex items-center justify-between px-4 sm:px-6 pt-5 pb-3 border-b border-gray-100 flex-shrink-0">
                <h2 id="copy-sheet-title" className="text-base font-semibold text-gray-900">
                  Ajouter à ma liste
                </h2>
                <button
                  type="button"
                  onClick={handleClose}
                  aria-label="Fermer"
                  className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Aperçu de l'article */}
              <div className="px-4 sm:px-6 py-3 bg-gray-50 border-b border-gray-100 flex-shrink-0 min-w-0">
                <p className="text-xs text-gray-400 mb-0.5">Article à copier</p>
                <p className="text-sm font-medium text-gray-900 truncate">{item.title}</p>
              </div>

              {/* Liste des wishlists */}
              <div className="overflow-y-auto flex-1 py-1">
                {loadingList && (
                  <div className="flex items-center justify-center py-10">
                    <svg className="animate-spin w-5 h-5 text-gray-300" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                  </div>
                )}

                {fetchError && (
                  <p className="text-sm text-red-600 px-4 sm:px-6 py-4">{fetchError}</p>
                )}

                {!loadingList && !fetchError && wishlists?.length === 0 && (
                  <p className="text-sm text-gray-400 text-center px-6 py-10">
                    Vous n&apos;avez aucune wishlist.
                  </p>
                )}

                {!loadingList && wishlists && wishlists.length > 0 && (
                  <ul>
                    {wishlists.map((wl) => (
                      <li key={wl.id}>
                        <button
                          type="button"
                          onClick={() => handleCopy(wl)}
                          disabled={!!copying}
                          className="w-full flex items-center gap-3 px-4 sm:px-6 py-3 text-left hover:bg-gray-50 disabled:opacity-60 transition-colors"
                        >
                          <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0" aria-hidden="true">
                            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                          </div>
                          <span className="flex-1 min-w-0 text-sm font-medium text-gray-900 truncate">{wl.title}</span>
                          {copying === wl.id ? (
                            <svg className="animate-spin w-4 h-4 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                            </svg>
                          ) : (
                            <svg className="w-4 h-4 text-gray-300 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          )}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Safe area iPhone */}
              <div className="flex-shrink-0 h-6 sm:h-0" aria-hidden="true" />
            </div>
          </div>
        </>
      )}
    </>
  )
}
