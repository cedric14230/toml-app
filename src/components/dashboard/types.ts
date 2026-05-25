export interface WishlistRow {
  id: string
  title: string
  description: string | null
  visibility: 'private' | 'friends' | 'public'
  created_at: string
  item_count: number
  latest: string | null
  tone: 1 | 2 | 3 | 4 | 5 | 6
}
