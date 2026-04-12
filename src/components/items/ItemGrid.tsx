'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import ItemCard, { type Item } from './ItemCard'
import AddItemModal from './AddItemModal'

type Props = {
  wishlistId: string
  items: Item[]
}

export default function ItemGrid({ wishlistId, items }: Props) {
  const router = useRouter()
  const [modalOpen, setModalOpen] = useState(false)

  function handleSuccess() {
    setModalOpen(false)
    // Re-déclenche le Server Component wishlists/[id]/page.tsx
    // pour re-fetcher la liste d'items depuis Supabase.
    router.refresh()
  }

  return (
    <section>
      {/* Barre titre + bouton */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">
          Articles
          {items.length > 0 && (
            <span className="ml-2 text-sm font-normal text-gray-400">
              ({items.length})
            </span>
          )}
        </h2>

        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 px-3.5 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Ajouter un article
        </button>
      </div>

      {/* État vide */}
      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div
            aria-hidden="true"
            className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center mb-4"
          >
            <svg className="w-7 h-7 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
          <h3 className="text-base font-semibold text-gray-900 mb-1">
            Aucun article pour l'instant
          </h3>
          <p className="text-sm text-gray-500 mb-5 max-w-xs">
            Ajoutez le premier article à votre wishlist depuis une URL ou manuellement.
          </p>
          <button
            onClick={() => setModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Ajouter un article
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {items.map((item) => (
            <ItemCard key={item.id} item={item} />
          ))}
        </div>
      )}

      {/* Modal de création */}
      {modalOpen && (
        <AddItemModal
          wishlistId={wishlistId}
          onClose={() => setModalOpen(false)}
          onSuccess={handleSuccess}
        />
      )}
    </section>
  )
}
