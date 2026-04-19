import { redirect } from 'next/navigation'
import Link from 'next/link'
import Header from '@/components/Header'
import FriendsClient, { type FriendEntry } from './FriendsClient'
import { createSupabaseServerClient, supabaseAdmin } from '@/lib/supabase/server'

/**
 * Page /dashboard/friends — Server Component.
 *
 * Charge toutes les données d'amitié côté serveur avant de les
 * transmettre au Client Component FriendsClient, qui gère l'interactivité.
 *
 * Stratégie de récupération des données :
 *  1. Une seule requête pour toutes les amitiés impliquant l'utilisateur.
 *  2. Séparation en trois catégories (accepted, pendingReceived, pendingSent).
 *  3. Collecte des IDs des "autres" utilisateurs.
 *  4. Une seule requête pour tous leurs profils (.in('id', ids)).
 *  5. Assemblage en mémoire — évite les N+1 requêtes.
 *
 * supabaseAdmin est utilisé pour bypasser la RLS : la page est protégée
 * par le middleware, l'utilisateur est déjà authentifié.
 */
export default async function FriendsPage() {
  const supabase = await createSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/auth/login')

  // ── 1. Toutes les amitiés de l'utilisateur ──────────────────────────
  const { data: allFriendships } = await supabaseAdmin
    .from('friendships')
    .select('id, user_id_1, user_id_2, status')
    .or(`user_id_1.eq.${user.id},user_id_2.eq.${user.id}`)

  const friendships = allFriendships ?? []

  // ── 2. Séparation par statut ────────────────────────────────────────
  const accepted = friendships.filter((f) => f.status === 'accepted')
  const pendingReceived = friendships.filter(
    (f) => f.status === 'pending' && f.user_id_2 === user.id
  )
  const pendingSent = friendships.filter(
    (f) => f.status === 'pending' && f.user_id_1 === user.id
  )

  // ── 3. IDs des autres utilisateurs ─────────────────────────────────
  const otherIds = [
    ...accepted.map((f) => (f.user_id_1 === user.id ? f.user_id_2 : f.user_id_1)),
    ...pendingReceived.map((f) => f.user_id_1),
    ...pendingSent.map((f) => f.user_id_2),
  ]
  const uniqueIds = Array.from(new Set(otherIds))

  // ── 4. Profils en une seule requête ─────────────────────────────────
  const profileMap = new Map<string, { id: string; name: string | null; email: string | null; avatar_url: string | null }>()

  if (uniqueIds.length > 0) {
    const { data: profiles } = await supabaseAdmin
      .from('users')
      .select('id, name, email, avatar_url')
      .in('id', uniqueIds)
    for (const p of profiles ?? []) profileMap.set(p.id, p)
  }

  // ── 5. Assemblage des données ───────────────────────────────────────
  function toEntry(friendshipId: string, otherId: string): FriendEntry {
    const profile = profileMap.get(otherId) ?? {
      id: otherId,
      name: null,
      email: null,
      avatar_url: null,
    }
    return { friendshipId, user: profile }
  }

  const friends: FriendEntry[] = accepted.map((f) =>
    toEntry(f.id, f.user_id_1 === user.id ? f.user_id_2 : f.user_id_1)
  )

  const received: FriendEntry[] = pendingReceived.map((f) =>
    toEntry(f.id, f.user_id_1)
  )

  const sent: FriendEntry[] = pendingSent.map((f) =>
    toEntry(f.id, f.user_id_2)
  )

  return (
    <>
      <Header />
      <main className="max-w-2xl mx-auto px-4 py-8">

        {/* Lien retour */}
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 mb-6 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Tableau de bord
        </Link>

        {/* En-tête */}
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-2xl font-bold text-gray-900">Amis</h1>
        </div>

        <p className="text-sm text-gray-500 mb-6">
          Ajoutez des amis pour accéder à leurs wishlists et leur partager les vôtres.
        </p>

        {/* Composant client */}
        <FriendsClient friends={friends} received={received} sent={sent} />
      </main>
    </>
  )
}
