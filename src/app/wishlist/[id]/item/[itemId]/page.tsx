import { notFound, redirect } from 'next/navigation'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import type { ItemRow, ItemPriority, WishlistData } from '@/components/wishlist/types'
import { HDItemDetail } from '@/components/wishlist/HDItemDetail'
import { HMItemDetail } from '@/components/wishlist/HMItemDetail'

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

// ── Page ──────────────────────────────────────────────────────────────────────

export default async function ItemDetailPage({
  params,
}: {
  params: { id: string; itemId: string }
}) {
  const supabase = await createSupabaseServerClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/')

  const { data: wishlist } = await supabase
    .from('wishlists')
    .select('id, title, description, cover_url, visibility, user_id')
    .eq('id', params.id)
    .single()

  if (!wishlist) notFound()

  const { data: rawItem } = await supabase
    .from('items')
    .select('id, title, price, note, priority, status, image_url, source_url, created_at')
    .eq('id', params.itemId)
    .eq('wishlist_id', params.id)
    .single()

  if (!rawItem) notFound()

  const item: ItemRow = {
    id:         rawItem.id,
    title:      rawItem.title,
    price:      rawItem.price,
    note:       rawItem.note,
    priority:   rawItem.priority as ItemPriority,
    status:     rawItem.status as ItemRow['status'],
    image_url:  rawItem.image_url,
    source_url: rawItem.source_url,
    created_at: rawItem.created_at,
    stars:      PRIORITY_STARS[rawItem.priority as ItemPriority],
    tone:       toneFromId(rawItem.id),
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
        <HDItemDetail wishlist={wishlistData} item={item} isOwner={isOwner} />
      </div>
      <div className="md:hidden">
        <HMItemDetail wishlist={wishlistData} item={item} isOwner={isOwner} />
      </div>
    </>
  )
}
