import Link from 'next/link'

// Type exporté et réutilisé par WishlistGrid et dashboard/page.tsx
export type Wishlist = {
  id: string
  title: string
  description: string | null
  cover_url: string | null
  visibility: 'private' | 'friends' | 'public'
  created_at: string
  items: { count: number }[]
}

const VISIBILITY_CONFIG: Record<
  Wishlist['visibility'],
  { label: string; icon: React.ReactNode }
> = {
  private: {
    label: 'Privé',
    icon: (
      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
    ),
  },
  friends: {
    label: 'Amis',
    icon: (
      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
  public: {
    label: 'Public',
    icon: (
      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
}

export default function WishlistCard({ wishlist }: { wishlist: Wishlist }) {
  const itemCount = wishlist.items[0]?.count ?? 0
  const vis = VISIBILITY_CONFIG[wishlist.visibility]

  return (
    <Link
      href={`/dashboard/wishlists/${wishlist.id}`}
      className="block group rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2"
    >
    <article className="bg-white rounded-2xl border border-gray-200 overflow-hidden group-hover:border-gray-300 group-hover:shadow-md transition-all duration-150">

      {/* Zone cover — dégradé placeholder jusqu'à ce qu'une image soit définie */}
      <div className="h-28 bg-gradient-to-br from-gray-100 to-gray-200 group-hover:from-gray-200 group-hover:to-gray-300 transition-colors duration-150 flex items-center justify-center">
        {wishlist.cover_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={wishlist.cover_url}
            alt=""
            className="w-full h-full object-cover"
          />
        ) : (
          <svg
            className="w-9 h-9 text-gray-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        )}
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-gray-900 truncate">{wishlist.title}</h3>

        {wishlist.description ? (
          <p className="text-sm text-gray-500 mt-1 line-clamp-2 leading-snug">
            {wishlist.description}
          </p>
        ) : (
          <p className="text-sm text-gray-300 mt-1 italic">Aucune description</p>
        )}

        {/* Footer : articles + visibilité */}
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
          <span className="text-xs text-gray-500">
            {itemCount} article{itemCount !== 1 ? 's' : ''}
          </span>

          <span className="inline-flex items-center gap-1 text-xs text-gray-500">
            {vis.icon}
            {vis.label}
          </span>
        </div>
      </div>
    </article>
    </Link>
  )
}
