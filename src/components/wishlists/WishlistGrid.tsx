'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import WishlistCard, { type Wishlist } from './WishlistCard'
import CreateWishlistModal from './CreateWishlistModal'

type Props = {
  wishlists: Wishlist[]
}

export default function WishlistGrid({ wishlists }: Props) {
  const router = useRouter()
  const [modalOpen, setModalOpen] = useState(false)

  function handleSuccess() {
    setModalOpen(false)
    // router.refresh() re-déclenche le Server Component dashboard/page.tsx
    // qui re-fetch les wishlists depuis Supabase avec le nouvel élément.
    router.refresh()
  }

  return (
    <section>
      {/* Barre titre + bouton créer */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Mes wishlists</h1>

        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Créer une wishlist
        </button>
      </div>

      {/* État vide */}
      {wishlists.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div
            aria-hidden="true"
            className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4"
          >
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <h2 className="text-lg font-semibold text-gray-900 mb-1">
            Aucune wishlist pour l'instant
          </h2>
          <p className="text-sm text-gray-500 mb-6 max-w-xs">
            Crée ta première liste de souhaits et partage-la avec tes amis.
          </p>
          <button
            onClick={() => setModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Créer ma première wishlist
          </button>
        </div>
      ) : (
        /* Grille de cartes */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {wishlists.map((wishlist) => (
            <WishlistCard key={wishlist.id} wishlist={wishlist} />
          ))}
        </div>
      )}

      {/* Modal de création */}
      {modalOpen && (
        <CreateWishlistModal
          onClose={() => setModalOpen(false)}
          onSuccess={handleSuccess}
        />
      )}
    </section>
  )
}
