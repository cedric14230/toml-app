import { notFound } from 'next/navigation'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { HDProfile } from '@/components/profile/HDProfile'
import { HMProfile } from '@/components/profile/HMProfile'
import type {
  ProfileData, WishlistCard,
  ViewerContext, FriendshipStatus,
} from '@/components/profile/types'

// ── Helpers ───────────────────────────────────────────────────────────────────

// Réutilisation du même algorithme toneFromId que dans le reste du projet
function toneFromId(id: string): 1 | 2 | 3 | 4 | 5 | 6 {
  const hex = id.replace(/-/g, '').slice(0, 4)
  return ((parseInt(hex, 16) % 6) + 1) as 1 | 2 | 3 | 4 | 5 | 6
}

function avatarToneFromId(id: string): 1 | 2 | 3 | 4 | 5 {
  const hex = id.replace(/-/g, '').slice(0, 4)
  return ((parseInt(hex, 16) % 5) + 1) as 1 | 2 | 3 | 4 | 5
}

function toInitial(name: string | null): string {
  return (name ?? '?').trim().charAt(0).toUpperCase()
}

// ── Raw Supabase types ────────────────────────────────────────────────────────

type RawUser = {
  id:         string
  name:       string | null
  avatar_url: string | null
  bio:        string | null
  birthday:   string | null
}

type RawWishlist = {
  id:         string
  title:      string
  visibility: string
  created_at: string
}

type RawFriendship = {
  status:     string
  user_id_1:  string
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default async function ProfilePage({
  params,
}: {
  params: { id: string }
}) {
  const { id: profileUserId } = params
  const supabase = await createSupabaseServerClient()

  // Le visiteur peut être non authentifié
  const { data: { user: viewer } } = await supabase.auth.getUser()

  // 1. Fetch profil — notFound si inexistant
  const { data: rawProfile, error: profileError } = await supabase
    .from('users')
    .select('id, name, avatar_url, bio, birthday')
    .eq('id', profileUserId)
    .single()

  if (profileError || !rawProfile) notFound()
  const profile = rawProfile as RawUser

  // 2. Déterminer le contexte du visiteur
  let viewerContext: ViewerContext    = 'visitor'
  let friendshipStatus: FriendshipStatus = 'none'

  if (viewer) {
    if (viewer.id === profileUserId) {
      viewerContext = 'owner'
    } else {
      const { data: fships } = await supabase
        .from('friendships')
        .select('status, user_id_1')
        .or(
          `and(user_id_1.eq.${viewer.id},user_id_2.eq.${profileUserId}),` +
          `and(user_id_1.eq.${profileUserId},user_id_2.eq.${viewer.id})`
        )
        .limit(1)

      const fs = (fships as RawFriendship[] | null)?.[0] ?? null

      if (fs?.status === 'accepted') {
        viewerContext    = 'friend'
        friendshipStatus = 'accepted'
      } else if (fs?.status === 'pending') {
        friendshipStatus = fs.user_id_1 === viewer.id ? 'pending_out' : 'pending_in'
      }
    }
  }

  // 3. Filtre de visibilité selon le contexte
  const visibilityFilter =
    viewerContext === 'owner'  ? ['public', 'friends', 'private'] :
    viewerContext === 'friend' ? ['public', 'friends'] :
    ['public']

  // 4. Wishlists + nombre d'amis en parallèle
  const [{ data: rawWishlists }, { count: friendCount }] = await Promise.all([
    supabase
      .from('wishlists')
      .select('id, title, visibility, created_at')
      .eq('user_id', profileUserId)
      .in('visibility', visibilityFilter)
      .order('created_at', { ascending: false }),

    supabase
      .from('friendships')
      .select('*', { count: 'exact', head: true })
      .or(`user_id_1.eq.${profileUserId},user_id_2.eq.${profileUserId}`)
      .eq('status', 'accepted'),
  ])

  const wishlists    = (rawWishlists ?? []) as RawWishlist[]
  const wishlistIds  = wishlists.map(w => w.id)

  // 5. Compter les articles par wishlist
  const { data: rawItemRows } = wishlistIds.length > 0
    ? await supabase
        .from('items')
        .select('wishlist_id')
        .in('wishlist_id', wishlistIds)
    : { data: [] as { wishlist_id: string }[] }

  const itemCountMap = new Map<string, number>()
  for (const row of (rawItemRows ?? []) as { wishlist_id: string }[]) {
    itemCountMap.set(row.wishlist_id, (itemCountMap.get(row.wishlist_id) ?? 0) + 1)
  }

  // 6. Construire les données typées
  const profileData: ProfileData = {
    id:          profile.id,
    name:        profile.name ?? 'Utilisateur',
    initial:     toInitial(profile.name),
    avatarTone:  avatarToneFromId(profile.id),
    bio:         profile.bio,
    friendCount: friendCount ?? 0,
  }

  const wishlistCards: WishlistCard[] = wishlists.map(w => ({
    id:         w.id,
    title:      w.title,
    visibility: w.visibility as WishlistCard['visibility'],
    itemCount:  itemCountMap.get(w.id) ?? 0,
    tone:       toneFromId(w.id),
  }))

  return (
    <>
      <div className="hidden md:block">
        <HDProfile
          profile={profileData}
          wishlists={wishlistCards}
          viewerContext={viewerContext}
          friendshipStatus={friendshipStatus}
          viewerId={viewer?.id ?? null}
        />
      </div>
      <div className="md:hidden">
        <HMProfile
          profile={profileData}
          wishlists={wishlistCards}
          viewerContext={viewerContext}
          friendshipStatus={friendshipStatus}
          viewerId={viewer?.id ?? null}
        />
      </div>
    </>
  )
}
