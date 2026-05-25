export type ItemPriority   = 'low' | 'medium' | 'high'
export type ItemStatus     = 'available' | 'reserved' | 'purchased'
export type WishlistVis    = 'private' | 'friends' | 'public'

export interface ItemRow {
  id: string
  title: string
  price: number | null
  note: string | null
  priority: ItemPriority
  status: ItemStatus
  image_url: string | null
  source_url: string | null
  created_at: string
  // computed
  stars: 1 | 2 | 3
  tone: 1 | 2 | 3 | 4 | 5 | 6
}

export interface WishlistData {
  id: string
  title: string
  description: string | null
  cover_url: string | null
  visibility: WishlistVis
  tone: 1 | 2 | 3 | 4 | 5 | 6
}

export interface WishlistStats {
  total: number
  available: number
  high: number
  reserved: number
}
