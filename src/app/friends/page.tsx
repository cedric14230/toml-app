import { redirect } from 'next/navigation'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { HDFriends } from '@/components/friends/HDFriends'
import { HMFriends } from '@/components/friends/HMFriends'
import type { FriendData, PendingData } from '@/components/friends/types'
import { toTone, toInitial } from '@/components/friends/types'

// ── Raw Supabase types ────────────────────────────────────────────────────────

// Supabase retourne les jointures FK comme des tableaux même pour les relations 1-1
type RawFriendship = {
  user_id_1: string
  user_id_2: string
  u1: { id: string; name: string | null }[]
  u2: { id: string; name: string | null }[]
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

  // 1. Friendships acceptées + demandes reçues en parallèle
  const [{ data: rawFriendships }, { data: rawPending }] = await Promise.all([
    supabase
      .from('friendships')
      .select(`
        user_id_1, user_id_2,
        u1:users!user_id_1(id, name),
        u2:users!user_id_2(id, name)
      `)
      .or(`user_id_1.eq.${user.id},user_id_2.eq.${user.id}`)
      .eq('status', 'accepted'),

    supabase
      .from('friendships')
      .select(`user_id_1, sender:users!user_id_1(id, name)`)
      .eq('user_id_2', user.id)
      .eq('status', 'pending'),
  ])

  // 2. Extraire les infos de chaque ami
  const friendEntries = ((rawFriendships ?? []) as RawFriendship[])
    .map(f => {
      const friendUser = f.user_id_1 === user.id ? f.u2?.[0] : f.u1?.[0]
      return friendUser ? { userId: friendUser.id, name: friendUser.name } : null
    })
    .filter((f): f is { userId: string; name: string | null } => f !== null)

  const friendUserIds = friendEntries.map(f => f.userId)

  // 3. Compter les wishlists visibles de chaque ami
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

  // 4. Construire les données typées
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
