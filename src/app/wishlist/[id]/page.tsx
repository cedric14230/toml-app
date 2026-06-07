import { notFound, redirect } from 'next/navigation'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import type { ItemRow, ItemPriority, WishlistData, WishlistStats, ReactionType } from '@/components/wishlist/types'
import { HDWishlist } from '@/components/wishlist/HDWishlist'
import { HMWishlist } from '@/components/wishlist/HMWishlist'

// ── Helpers ───────────────────────────────────────────────────────────────────

function toneFromId(id: string): 1 | 2 | 3 | 4 | 5 | 6 {
  const hex = id.replace(/-/g, '').slice(0, 4)
  return ((parseInt(hex, 16) % 6) + 1) as 1 | 2 | 3 | 4 | 5 | 6
}

const PRIORITY_STARS: Record<ItemPriority, 1 | 2 | 3> = {
  low:    1,
  medium: 2,
  high:   3,
}

// ── Raw Supabase types ────────────────────────────────────────────────────────

type RawItem = {
  id: string
  title: string
  price: number | null
  note: string | null
  priority: string
  status: string
  image_url: string | null
  source_url: string | null
  created_at: string
  reactions: Array<{ reaction_type: string; user_id: string }> | null
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default async function WishlistPage({
  params,
}: {
  params: { id: string }
}) {
  const supabase = await createSupabaseServerClient()

  // Auth guard — RLS est TO authenticated, rien n'est visible sans session
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/')

  // Fetch wishlist — la RLS retourne null si l'accès est refusé
  const { data: wishlist } = await supabase
    .from('wishlists')
    .select('id, title, description, cover_url, visibility, user_id')
    .eq('id', params.id)
    .single()

  if (!wishlist) notFound()

  // Fetch items
  const { data: rawItems } = await supabase
    .from('items')
    .select('id, title, price, note, priority, status, image_url, source_url, created_at, reactions(reaction_type, user_id)')
    .eq('wishlist_id', params.id)
    .order('created_at', { ascending: false })

  const items: ItemRow[] = ((rawItems ?? []) as RawItem[]).map(it => {
    const rxs = it.reactions ?? []
    return {
      id:         it.id,
      title:      it.title,
      price:      it.price,
      note:       it.note,
      priority:   it.priority as ItemPriority,
      status:     it.status as ItemRow['status'],
      image_url:  it.image_url,
      source_url: it.source_url,
      created_at: it.created_at,
      stars:      PRIORITY_STARS[it.priority as ItemPriority],
      tone:       toneFromId(it.id),
      reactionCounts: {
        love:        rxs.filter(r => r.reaction_type === 'love').length,
        useful:      rxs.filter(r => r.reaction_type === 'useful').length,
        interesting: rxs.filter(r => r.reaction_type === 'interesting').length,
      },
      myReaction: (rxs.find(r => r.user_id === user.id)?.reaction_type ?? null) as ReactionType | null,
    }
  })

  const stats: WishlistStats = {
    total:     items.length,
    available: items.filter(it => it.status === 'available').length,
    high:      items.filter(it => it.priority === 'high').length,
    reserved:  items.filter(it => it.status === 'reserved' || it.status === 'purchased').length,
  }

  const wishlistData: WishlistData = {
    id:          wishlist.id,
    title:       wishlist.title,
    description: wishlist.description,
    cover_url:   wishlist.cover_url,
    visibility:  wishlist.visibility as WishlistData['visibility'],
    tone:        toneFromId(wishlist.id),
  }

  const isOwner = user.id === wishlist.user_id

  return (
    <>
      <div className="hidden md:block">
        <HDWishlist wishlist={wishlistData} items={items} stats={stats} isOwner={isOwner} />
      </div>
      <div className="md:hidden">
        <HMWishlist wishlist={wishlistData} items={items} stats={stats} isOwner={isOwner} />
      </div>
    </>
  )
}
