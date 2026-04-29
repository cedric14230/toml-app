'use client'

import { useRouter } from 'next/navigation'
import CopyItemButton from './CopyItemButton'
import ReserveButton from './ReserveButton'

// Type exporté et réutilisé par ItemGrid, wishlists/[id]/page.tsx, etc.
export type Item = {
  id: string
  title: string
  image_url: string | null
  price: number | null
  source_url: string | null
  note: string | null
  priority: 'low' | 'medium' | 'high'
  status: 'available' | 'reserved' | 'purchased'
  created_at: string
}

type Props = {
  item: Item
  /** Rend la carte cliquable et ouvre EditItemModal au clic */
  isOwner?: boolean
  onEdit?: () => void
  /** Lien vers la fiche détail (utilisé quand !isOwner) */
  href?: string
  /** ID de la wishlist — requis pour afficher ReserveButton quand !isOwner */
  wishlistId?: string
}

const PRIORITY_STARS: Record<Item['priority'], number> = {
  low: 1,
  medium: 2,
  high: 3,
}

const priceFormatter = new Intl.NumberFormat('fr-FR', {
  style: 'currency',
  currency: 'EUR',
})

export default function ItemCard({ item, isOwner = false, onEdit, href, wishlistId }: Props) {
  const router = useRouter()
  const stars = PRIORITY_STARS[item.priority]
  // Priorité haute → tuile large (aspect-[4/3]), sinon carrée
  const isLarge = item.priority === 'high'

  function handleCardClick() {
    if (isOwner) {
      onEdit?.()
    } else if (href) {
      router.push(href)
    }
  }

  return (
    <article
      onClick={handleCardClick}
      className={['group', isOwner || href ? 'cursor-pointer' : ''].join(' ')}
    >
      {/* ── Zone image ─────────────────────────────────────────────────── */}
      <div className={[
        'relative overflow-hidden rounded-lg bg-gray-100',
        isLarge ? 'aspect-[4/3]' : 'aspect-square',
      ].join(' ')}>

        {item.image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={item.image_url}
            alt=""
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <svg className="w-10 h-10 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}

        {/* Overlay bas — badge statut + actions
            Masqué pour isOwner+available (rien à afficher).
            Sur mobile : toujours visible. Sur desktop : au hover. */}
        {!(isOwner && item.status === 'available') && (
          <div
            className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/60 to-transparent
                       flex items-center justify-between
                       opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-200"
            onClick={e => e.stopPropagation()}
          >
            {/* Gauche : Offrir / Annuler / badge Réservé / badge Offert */}
            <div>
              {/* Non-proprio : ReserveButton gère available + reserved (Offrir / Annuler / badge) */}
              {!isOwner && item.status !== 'purchased' && wishlistId && (
                <div className="rounded-full bg-white/90 backdrop-blur-sm overflow-hidden">
                  <ReserveButton
                    itemId={item.id}
                    wishlistId={wishlistId}
                    initialReserved={item.status === 'reserved'}
                    compact
                  />
                </div>
              )}
              {/* Proprio : badge statique si réservé */}
              {isOwner && item.status === 'reserved' && (
                <span className="inline-block text-xs font-medium px-2.5 py-1.5 rounded-full bg-white/90 backdrop-blur-sm text-orange-700">
                  Réservé
                </span>
              )}
              {/* Badge "Offert" pour tous quand purchased */}
              {item.status === 'purchased' && (
                <span className="inline-block text-xs font-medium px-2.5 py-1.5 rounded-full bg-white/90 backdrop-blur-sm text-green-700">
                  Offert
                </span>
              )}
            </div>

            {/* Droite : + Ajouter (toujours si !isOwner) */}
            {!isOwner && (
              <div className="rounded-full bg-white/90 backdrop-blur-sm overflow-hidden">
                <CopyItemButton item={item} />
              </div>
            )}
          </div>
        )}

        {/* Overlay hint édition — propriétaire ────────────────────────── */}
        {isOwner && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/10 transition-colors duration-200">
            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-white/90 backdrop-blur-sm rounded-lg p-2 shadow-sm">
              <svg className="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            </div>
          </div>
        )}
      </div>

      {/* ── Texte sous l'image ─────────────────────────────────────────── */}
      <div className="mt-2 px-0.5">
        <h3 className="text-sm font-medium text-gray-900 leading-snug line-clamp-2">
          {item.title}
        </h3>
        <div className="flex items-center justify-between mt-1 gap-1">
          <span className="text-sm font-bold text-gray-900 flex-shrink-0">
            {item.price != null
              ? priceFormatter.format(item.price)
              : <span className="text-xs font-normal text-gray-400">—</span>
            }
          </span>
          <div
            className="flex items-center gap-0.5 flex-shrink-0"
            aria-label={`Priorité : ${item.priority}`}
            role="img"
          >
            {[1, 2, 3].map((n) => (
              <svg
                key={n}
                className={`w-3 h-3 ${n <= stars ? 'text-amber-400' : 'text-gray-200'}`}
                fill="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
            ))}
          </div>
        </div>
      </div>
    </article>
  )
}
