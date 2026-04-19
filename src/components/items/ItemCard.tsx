'use client'

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
}

const PRIORITY_STARS: Record<Item['priority'], number> = {
  low: 1,
  medium: 2,
  high: 3,
}

const STATUS_CONFIG: Record<
  Item['status'],
  { label: string; className: string } | null
> = {
  available: null,
  reserved: { label: 'Réservé', className: 'bg-amber-100 text-amber-700' },
  purchased: { label: 'Offert',  className: 'bg-green-100 text-green-700' },
}

const priceFormatter = new Intl.NumberFormat('fr-FR', {
  style: 'currency',
  currency: 'EUR',
})

export default function ItemCard({ item, isOwner = false, onEdit }: Props) {
  const stars = PRIORITY_STARS[item.priority]
  const status = STATUS_CONFIG[item.status]

  return (
    <article
      onClick={isOwner ? () => onEdit?.() : undefined}
      className={[
        'bg-white rounded-xl border border-gray-200 overflow-hidden flex transition-all duration-150',
        isOwner
          ? 'cursor-pointer hover:border-gray-300 hover:shadow-sm hover:bg-gray-50'
          : 'hover:border-gray-300 hover:shadow-sm',
      ].join(' ')}
    >
      {/* Vignette image */}
      <div className="w-24 h-24 flex-shrink-0 bg-gray-100 flex items-center justify-center">
        {item.image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={item.image_url}
            alt=""
            className="w-full h-full object-cover"
          />
        ) : (
          <svg
            className="w-8 h-8 text-gray-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        )}
      </div>

      {/* Contenu */}
      <div className="flex-1 p-3 flex flex-col justify-between min-w-0">
        <div>
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-sm font-medium text-gray-900 leading-snug line-clamp-2">
              {item.title}
            </h3>
            {status && (
              <span className={`flex-shrink-0 text-xs font-medium px-2 py-0.5 rounded-full ${status.className}`}>
                {status.label}
              </span>
            )}
          </div>

          {item.note && (
            <p className="text-xs text-gray-500 mt-1 line-clamp-1">{item.note}</p>
          )}
        </div>

        {/* Prix + priorité */}
        <div className="flex items-center justify-between mt-2">
          <span className="text-sm font-semibold text-gray-900">
            {item.price != null
              ? priceFormatter.format(item.price)
              : (
                <span className="text-xs font-normal text-gray-300">
                  Prix non renseigné
                </span>
              )
            }
          </span>

          <div
            className="flex items-center gap-0.5"
            aria-label={`Priorité : ${item.priority}`}
            role="img"
          >
            {[1, 2, 3].map((n) => (
              <svg
                key={n}
                className={`w-3.5 h-3.5 ${n <= stars ? 'text-amber-400' : 'text-gray-200'}`}
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
