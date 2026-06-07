import { redirect } from 'next/navigation'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { HDFriends } from '@/components/friends/HDFriends'
import { HMFriends } from '@/components/friends/HMFriends'
import type { FriendData, PendingData } from '@/components/friends/types'
import { toTone, toInitial } from '@/components/friends/types'

// ── Raw Supabase types ────────────────────────────────────────────────────────

// Friendships : on récupère uniquement les IDs pour éviter la double jointure
// sur la même table users (u1 + u2), qui retourne des tableaux vides dans
// certaines versions de PostgREST.
type RawFriendship = {
  user_id_1: string
  user_id_2: string
}

type RawFriendUser = {
  id:   string
  name: string | null
}

type RawPending = {
  user_id_1: string
  sender: { id: string; name: string | null }[]
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default async function FriendsPage() {
  const supabase = await createSupabaseServerClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/')

  // 1. Friendships acceptées (IDs seulement) + demandes reçues en parallèle
  const [{ data: rawFriendships }, { data: rawPending }] = await Promise.all([
    supabase
      .from('friendships')
      .select('user_id_1, user_id_2')
      .or(`user_id_1.eq.${user.id},user_id_2.eq.${user.id}`)
      .eq('status', 'accepted'),

    supabase
      .from('friendships')
      .select(`user_id_1, sender:users!user_id_1(id, name)`)
      .eq('user_id_2', user.id)
      .eq('status', 'pending'),
  ])

  // 2. Extraire l'ID de l'ami (celui qui n'est pas moi) dans chaque friendship
  const friendUserIds = ((rawFriendships ?? []) as RawFriendship[]).map(f =>
    f.user_id_1 === user.id ? f.user_id_2 : f.user_id_1
  )

  // 3. Récupérer les données utilisateurs des amis en une seule requête
  const { data: rawFriendUsers } = friendUserIds.length > 0
    ? await supabase
        .from('users')
        .select('id, name')
        .in('id', friendUserIds)
    : { data: [] as RawFriendUser[] }

  const friendEntries = ((rawFriendUsers ?? []) as RawFriendUser[]).map(u => ({
    userId: u.id,
    name:   u.name,
  }))

  // 4. Compter les wishlists visibles de chaque ami
  const { data: rawWishlists } = friendUserIds.length > 0
    ? await supabase
        .from('wishlists')
        .select('user_id')
        .in('user_id', friendUserIds)
        .in('visibility', ['public', 'friends'])
    : { data: [] as { user_id: string }[] }

  const wishlistCountMap = new Map<string, number>()
  for (const w of (rawWishlists ?? []) as { user_id: string }[]) {
    wishlistCountMap.set(w.user_id, (wishlistCountMap.get(w.user_id) ?? 0) + 1)
  }

  // 5. Construire les données typées
  const friends: FriendData[] = friendEntries.map(f => ({
    userId:        f.userId,
    name:          f.name ?? 'Utilisateur',
    initial:       toInitial(f.name),
    tone:          toTone(f.userId),
    wishlistCount: wishlistCountMap.get(f.userId) ?? 0,
  }))

  const pendingIn: PendingData[] = ((rawPending ?? []) as RawPending[])
    .map(p => {
      const sender = p.sender?.[0]
      if (!sender) return null
      return {
        senderId: sender.id,
        name:     sender.name ?? 'Utilisateur',
        initial:  toInitial(sender.name),
        tone:     toTone(sender.id),
      }
    })
    .filter((p): p is PendingData => p !== null)

  return (
    <>
      <div className="hidden md:block">
        <HDFriends
          friends={friends}
          pendingIn={pendingIn}
          userId={user.id}
          existingFriendIds={friendUserIds}
        />
      </div>
      <div className="md:hidden">
        <HMFriends
          friends={friends}
          pendingIn={pendingIn}
          userId={user.id}
          existingFriendIds={friendUserIds}
        />
      </div>
    </>
  )
}
