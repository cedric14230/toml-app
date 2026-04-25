'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import EditWishlistModal, { type WishlistEditData } from '@/components/wishlists/EditWishlistModal'

type Props = {
  wishlist: WishlistEditData
}

/**
 * Bouton "Modifier" (icône crayon) affiché à côté du titre de la wishlist.
 * Monté uniquement pour le propriétaire — le Server Component parent vérifie
 * l'ownership avant de l'inclure dans le rendu.
 */
export default function WishlistActions({ wishlist }: Props) {
  const [editOpen, setEditOpen] = useState(false)
  const router = useRouter()

  function handleSuccess() {
    setEditOpen(false)
    router.refresh()
  }

  return (
    <>
      <button
        onClick={() => setEditOpen(true)}
        aria-label="Modifier la wishlist"
        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg border border-gray-200 bg-white hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900"
      >
        <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
        </svg>
        <span className="text-gray-600">Modifier</span>
      </button>

      {editOpen && (
        <EditWishlistModal
          wishlist={wishlist}
          onClose={() => setEditOpen(false)}
          onSuccess={handleSuccess}
        />
      )}
    </>
  )
}
