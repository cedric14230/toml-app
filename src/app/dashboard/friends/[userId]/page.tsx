import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import Header from '@/components/Header'
import { createSupabaseServerClient, supabaseAdmin } from '@/lib/supabase/server'

type Wishlist = {
  id: string
  title: string
  description: string | null
  cover_url: string | null
  created_at: string
  items: { count: number }[]
}

export default async function FriendProfilePage({
  params,
}: {
  params: { userId: string }
}) {
  const supabase = await createSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/auth/login')

  const { userId } = params

  // Empêche d'accéder à son propre profil via cette route
  if (userId === user.id) redirect('/dashboard')

  // ── Vérifier que l'amitié est acceptée ─────────────────────────────
  const { data: friendship } = await supabaseAdmin
    .from('friendships')
    .select('id')
    .eq('status', 'accepted')
    .or(
      `and(user_id_1.eq.${user.id},user_id_2.eq.${userId}),` +
      `and(user_id_1.eq.${userId},user_id_2.eq.${user.id})`
    )
    .maybeSingle()

  if (!friendship) notFound()

  // ── Profil de l'ami ─────────────────────────────────────────────────
  const { data: friend } = await supabaseAdmin
    .from('users')
    .select('id, name, email, avatar_url')
    .eq('id', userId)
    .single()

  if (!friend) notFound()

  // ── Wishlists publiques de l'ami ────────────────────────────────────
  const { data: wishlists } = await supabaseAdmin
    .from('wishlists')
    .select('id, title, description, cover_url, created_at, items(count)')
    .eq('user_id', userId)
    .eq('visibility', 'public')
    .eq('archived', false)
    .order('created_at', { ascending: false })

  const publicWishlists: Wishlist[] = (wishlists ?? []) as Wishlist[]

  const displayName = friend.name ?? friend.email ?? 'Utilisateur'
  const initial = displayName.charAt(0).toUpperCase()

  return (
    <>
      <Header />
      <main className="max-w-2xl mx-auto px-4 py-8">

        {/* Lien retour */}
        <Link
          href="/dashboard/friends"
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 mb-8 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Amis
        </Link>

        {/* ── Profil ──────────────────────────────────────────────── */}
        <div className="flex items-center gap-5 mb-10">
          {friend.avatar_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={friend.avatar_url}
              alt={displayName}
              className="w-16 h-16 rounded-full object-cover ring-1 ring-gray-200 flex-shrink-0"
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-gray-900 flex items-center justify-center flex-shrink-0">
              <span className="text-xl font-semibold text-white select-none">{initial}</span>
            </div>
          )}
          <div className="min-w-0">
            <h1 className="text-2xl font-bold text-gray-900 truncate">{displayName}</h1>
            {friend.email && friend.name && (
              <p className="text-sm text-gray-400 truncate mt-0.5">{friend.email}</p>
            )}
          </div>
        </div>

        {/* ── Wishlists publiques ──────────────────────────────────── */}
        <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
          Wishlists publiques
          {publicWishlists.length > 0 && (
            <span className="ml-2 text-gray-400 font-normal normal-case tracking-normal">
              ({publicWishlists.length})
            </span>
          )}
        </h2>

        {publicWishlists.length === 0 ? (
          <div className="text-center py-12 text-gray-400 text-sm">
            <svg
              className="w-10 h-10 mx-auto text-gray-200 mb-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            Aucune wishlist publique pour le moment.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {publicWishlists.map((wl) => {
              const itemCount = wl.items[0]?.count ?? 0
              return (
                <Link
                  key={wl.id}
                  href={`/w/${wl.id}`}
                  className="block group rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2"
                >
                  <article className="bg-white rounded-2xl border border-gray-200 overflow-hidden group-hover:border-gray-300 group-hover:shadow-md transition-all duration-150">
                    {/* Cover */}
                    <div className="h-28 bg-gradient-to-br from-gray-100 to-gray-200 group-hover:from-gray-200 group-hover:to-gray-300 transition-colors duration-150 flex items-center justify-center">
                      {wl.cover_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={wl.cover_url}
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
                      <h3 className="font-semibold text-gray-900 truncate">{wl.title}</h3>
                      {wl.description ? (
                        <p className="text-sm text-gray-500 mt-1 line-clamp-2 leading-snug">
                          {wl.description}
                        </p>
                      ) : (
                        <p className="text-sm text-gray-300 mt-1 italic">Aucune description</p>
                      )}
                      <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                        <span className="text-xs text-gray-500">
                          {itemCount} article{itemCount !== 1 ? 's' : ''}
                        </span>
                        <span className="inline-flex items-center gap-1 text-xs text-gray-400">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                              d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          Public
                        </span>
                      </div>
                    </div>
                  </article>
                </Link>
              )
            })}
          </div>
        )}
      </main>
    </>
  )
}
