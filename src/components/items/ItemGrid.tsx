'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createSupabaseBrowserClient } from '@/lib/supabase/client'
import ItemCard, { type Item } from './ItemCard'
import AddItemModal from './AddItemModal'
import EditItemModal from './EditItemModal'

type Props = {
  wishlistId: string
  items: Item[]
  /** Affiche les menus ⋮ (modifier / supprimer) sur chaque carte */
  isOwner?: boolean
}

export default function ItemGrid({ wishlistId, items, isOwner = false }: Props) {
  const router = useRouter()
  const supabase = createSupabaseBrowserClient()

  const [addOpen, setAddOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<Item | null>(null)
  const [deletingItem, setDeletingItem] = useState<Item | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState<string | null>(null)

  function handleAddSuccess() {
    setAddOpen(false)
    router.refresh()
  }

  function handleEditSuccess() {
    setEditingItem(null)
    router.refresh()
  }

  async function handleDeleteConfirm() {
    if (!deletingItem) return
    setDeleteError(null)
    setDeleting(true)

    const { error } = await supabase
      .from('items')
      .delete()
      .eq('id', deletingItem.id)

    if (error) {
      setDeleteError(error.message)
      setDeleting(false)
      return
    }

    setDeletingItem(null)
    setDeleting(false)
    router.refresh()
  }

  return (
    <section>
      {/* Barre titre + bouton */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
        <h2 className="text-lg font-semibold text-gray-900">
          Articles
          {items.length > 0 && (
            <span className="ml-2 text-sm font-normal text-gray-400">
              ({items.length})
            </span>
          )}
        </h2>

        {isOwner && (
          <button
            onClick={() => setAddOpen(true)}
            className="flex items-center gap-2 px-3.5 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Ajouter un article
          </button>
        )}
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
            Aucun article pour l&apos;instant
          </h3>
          <p className="text-sm text-gray-500 mb-5 max-w-xs">
            Ajoutez le premier article à votre wishlist depuis une URL ou manuellement.
          </p>
          {isOwner && (
            <button
              onClick={() => setAddOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Ajouter un article
            </button>
          )}
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {items.map((item) => (
            <ItemCard
              key={item.id}
              item={item}
              isOwner={isOwner}
              onEdit={() => setEditingItem(item)}
            />
          ))}
        </div>
      )}

      {/* ── Modal : Ajouter ───────────────────────────────────────────── */}
      {addOpen && (
        <AddItemModal
          wishlistId={wishlistId}
          onClose={() => setAddOpen(false)}
          onSuccess={handleAddSuccess}
        />
      )}

      {/* ── Modal : Modifier ──────────────────────────────────────────── */}
      {editingItem && (
        <EditItemModal
          item={editingItem}
          onClose={() => setEditingItem(null)}
          onSuccess={handleEditSuccess}
          onDelete={() => {
            // Bascule vers la confirmation de suppression sans quitter le flux modal
            setDeletingItem(editingItem)
            setEditingItem(null)
          }}
        />
      )}

      {/* ── Modal : Confirmer la suppression ─────────────────────────── */}
      {deletingItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={(e) => { if (e.target === e.currentTarget && !deleting) setDeletingItem(null) }}
        >
          <div
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="delete-dialog-title"
            className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl"
          >
            <h3 id="delete-dialog-title" className="text-base font-semibold text-gray-900 mb-1">
              Supprimer cet article ?
            </h3>
            <p className="text-sm text-gray-500 mb-1 line-clamp-1">
              {deletingItem.title}
            </p>
            <p className="text-sm text-gray-400 mb-5">
              Cette action est irréversible.
            </p>

            {deleteError && (
              <p className="text-sm text-red-600 mb-4">{deleteError}</p>
            )}

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => { setDeletingItem(null); setDeleteError(null) }}
                disabled={deleting}
                className="flex-1 py-2.5 px-4 border border-gray-300 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-colors"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={handleDeleteConfirm}
                disabled={deleting}
                className="flex-1 py-2.5 px-4 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {deleting ? 'Suppression…' : 'Supprimer'}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
