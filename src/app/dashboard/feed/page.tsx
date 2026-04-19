import { redirect } from 'next/navigation'
import Link from 'next/link'
import Header from '@/components/Header'
import RelativeTime from './RelativeTime'
import { createSupabaseServerClient, supabaseAdmin } from '@/lib/supabase/server'

/**
 * Page /dashboard/feed — Server Component.
 *
 * Affiche en ordre antéchronologique les activités récentes des amis :
 *  - Nouvelles wishlists créées
 *  - Nouveaux articles ajoutés à leurs wishlists
 *
 * Stratégie de récupération (sans N+1) :
 *  1. IDs des amis acceptés depuis friendships.
 *  2. Profils de ces amis en une requête (.in).
 *  3. Wishlists récentes de ces amis (limite 100 — sert aussi de lookup
 *     pour l'étape suivante).
 *  4. Articles récents dans ces wishlists (limite 50, filtré par wishlist_id .in).
 *  5. Assemblage en mémoire : chaque article est enrichi du profil de
 *     l'ami propriétaire via le wishlistMap déjà en mémoire.
 *  6. Fusion + tri par created_at DESC, tronqué à 50 événements.
 *
 * force-dynamic : empêche Next.js de mettre en cache les données du feed,
 * qui doit toujours être à jour au moment où l'utilisateur charge la page.
 */
export const dynamic = 'force-dynamic'

// ── Types ────────────────────────────────────────────────────────────────────

type FriendProfile = {
  id: string
  name: string | null
  email: string | null
  avatar_url: string | null
}

type WishlistEvent = {
  kind: 'wishlist'
  key: string
  created_at: string
  friend: FriendProfile
  wishlistId: string
  wishlistTitle: string
}

type ItemEvent = {
  kind: 'item'
  key: string
  created_at: string
  friend: FriendProfile
  itemTitle: string
  imageUrl: string | null
  wishlistId: string
  wishlistTitle: string
}

type FeedEvent = WishlistEvent | ItemEvent

// ── Helpers ──────────────────────────────────────────────────────────────────

function Avatar({ user }: { user: FriendProfile }) {
  const label = user.name ?? user.email ?? 'U'
  const initial = label.charAt(0).toUpperCase()
  return user.avatar_url ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={user.avatar_url}
      alt={label}
      className="w-8 h-8 rounded-full object-cover ring-1 ring-gray-200 flex-shrink-0"
    />
  ) : (
    <div className="w-8 h-8 rounded-full bg-gray-900 flex items-center justify-center flex-shrink-0">
      <span className="text-xs font-semibold text-white select-none">{initial}</span>
    </div>
  )
}

function FriendName({ user }: { user: FriendProfile }) {
  return (
    <span className="font-semibold text-gray-900">
      {user.name ?? user.email ?? 'Quelqu\u2019un'}
    </span>
  )
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default async function FeedPage() {
  const supabase = await createSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  // ── 1. Amis acceptés ───────────────────────────────────────────────────────
  const { data: friendships } = await supabaseAdmin
    .from('friendships')
    .select('user_id_1, user_id_2')
    .or(`user_id_1.eq.${user.id},user_id_2.eq.${user.id}`)
    .eq('status', 'accepted')

  const friendIds = (friendships ?? []).map((f) =>
    f.user_id_1 === user.id ? f.user_id_2 : f.user_id_1
  )

  // ── État vide : pas encore d'amis ──────────────────────────────────────────
  if (friendIds.length === 0) {
    return (
      <>
        <Header />
        <main className="max-w-2xl mx-auto px-4 py-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Feed</h1>
          <div className="flex flex-col items-center justify-center text-center py-20 gap-4">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
              <svg
                className="w-8 h-8 text-gray-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </div>
            <p className="text-gray-500 text-sm max-w-xs">
              Ajoutez des amis pour voir leurs wishlists et articles ici.
            </p>
            <Link
              href="/dashboard/friends"
              className="mt-1 inline-flex items-center gap-1.5 px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                />
              </svg>
              Ajouter des amis
            </Link>
          </div>
        </main>
      </>
    )
  }

  // ── 2. Profils des amis ────────────────────────────────────────────────────
  const { data: profiles } = await supabaseAdmin
    .from('users')
    .select('id, name, email, avatar_url')
    .in('id', friendIds)

  const profileMap = new Map(
    (profiles ?? []).map((p) => [p.id, p as FriendProfile])
  )

  // ── 3. Wishlists récentes des amis (limite 100, sert aussi de lookup) ──────
  const { data: friendWishlists } = await supabaseAdmin
    .from('wishlists')
    .select('id, title, created_at, user_id')
    .in('user_id', friendIds)
    .eq('archived', false)
    .order('created_at', { ascending: false })
    .limit(100)

  const wishlistMeta = new Map(
    (friendWishlists ?? []).map((w) => [
      w.id,
      { title: w.title as string, ownerId: w.user_id as string },
    ])
  )
  const wishlistIds = (friendWishlists ?? []).map((w) => w.id)

  // ── 4. Articles récents dans ces wishlists ─────────────────────────────────
  const rawItems =
    wishlistIds.length > 0
      ? (
          await supabaseAdmin
            .from('items')
            .select('id, title, image_url, created_at, wishlist_id')
            .in('wishlist_id', wishlistIds)
            .order('created_at', { ascending: false })
            .limit(50)
        ).data ?? []
      : []

  // ── 5. Assemblage des événements ───────────────────────────────────────────
  const wishlistEvents: WishlistEvent[] = (friendWishlists ?? [])
    .slice(0, 30)
    .flatMap((w) => {
      const friend = profileMap.get(w.user_id)
      if (!friend) return []
      return [
        {
          kind: 'wishlist' as const,
          key: `wl-${w.id}`,
          created_at: w.created_at,
          friend,
          wishlistId: w.id,
          wishlistTitle: w.title,
        },
      ]
    })

  const itemEvents: ItemEvent[] = rawItems.flatMap((item) => {
    const meta = wishlistMeta.get(item.wishlist_id)
    if (!meta) return []
    const friend = profileMap.get(meta.ownerId)
    if (!friend) return []
    return [
      {
        kind: 'item' as const,
        key: `it-${item.id}`,
        created_at: item.created_at,
        friend,
        itemTitle: item.title,
        imageUrl: item.image_url,
        wishlistId: item.wishlist_id,
        wishlistTitle: meta.title,
      },
    ]
  })

  // ── 6. Fusion + tri ────────────────────────────────────────────────────────
  const feed: FeedEvent[] = [...wishlistEvents, ...itemEvents]
    .sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )
    .slice(0, 50)

  return (
    <>
      <Header />
      <main className="max-w-2xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Feed</h1>

        {feed.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-16">
            Aucune activité récente de vos amis.
          </p>
        ) : (
          <ol className="space-y-3">
            {feed.map((event) => (
              <li key={event.key}>
                {event.kind === 'wishlist' ? (
                  <WishlistCard event={event} />
                ) : (
                  <ItemCard event={event} />
                )}
              </li>
            ))}
          </ol>
        )}
      </main>
    </>
  )
}

// ── Cartes de feed ────────────────────────────────────────────────────────────

function WishlistCard({ event }: { event: WishlistEvent }) {
  return (
    <Link
      href={`/w/${event.wishlistId}`}
      className="flex items-start gap-3 bg-white border border-gray-200 rounded-xl px-4 py-3.5 hover:border-gray-300 hover:shadow-sm transition-all duration-150 group"
    >
      {/* Avatar ami */}
      <Avatar user={event.friend} />

      {/* Contenu */}
      <div className="flex-1 min-w-0">
        <p className="text-sm text-gray-600 leading-snug">
          <FriendName user={event.friend} />
          {' a créé une wishlist'}
        </p>
        <p className="mt-0.5 text-sm font-semibold text-gray-900 truncate group-hover:underline underline-offset-2">
          {event.wishlistTitle}
        </p>
        <div className="mt-1.5">
          <RelativeTime date={event.created_at} />
        </div>
      </div>

      {/* Icône cadeau */}
      <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center">
        <svg
          className="w-5 h-5 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M12 8v13m0-13V6a2 2 0 112.83 2.83L12 11l-2.83-2.83A2 2 0 1112 6v2z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M17 8H7a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2V10a2 2 0 00-2-2z"
          />
        </svg>
      </div>
    </Link>
  )
}

function ItemCard({ event }: { event: ItemEvent }) {
  return (
    <Link
      href={`/w/${event.wishlistId}`}
      className="flex items-start gap-3 bg-white border border-gray-200 rounded-xl px-4 py-3.5 hover:border-gray-300 hover:shadow-sm transition-all duration-150 group"
    >
      {/* Avatar ami */}
      <Avatar user={event.friend} />

      {/* Contenu */}
      <div className="flex-1 min-w-0">
        <p className="text-sm text-gray-600 leading-snug">
          <FriendName user={event.friend} />
          {' a ajouté un article à '}
          <span className="font-medium text-gray-800">{event.wishlistTitle}</span>
        </p>
        <p className="mt-0.5 text-sm font-semibold text-gray-900 truncate group-hover:underline underline-offset-2">
          {event.itemTitle}
        </p>
        <div className="mt-1.5">
          <RelativeTime date={event.created_at} />
        </div>
      </div>

      {/* Vignette article */}
      <div className="flex-shrink-0 w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
        {event.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={event.imageUrl}
            alt=""
            className="w-full h-full object-cover"
          />
        ) : (
          <svg
            className="w-5 h-5 text-gray-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        )}
      </div>
    </Link>
  )
}
