export type ActivityKind =
  | 'item_added'
  | 'wishlist_created'
  | 'reaction_added'
  | 'friendship_accepted'

export interface FeedActor {
  id:      string
  name:    string
  initial: string
  tone:    1 | 2 | 3 | 4 | 5
}

export interface FeedItem {
  id:        string
  title:     string
  image_url: string | null
  price:     number | null
  note:      string | null
  stars:     1 | 2 | 3
  tone:      1 | 2 | 3 | 4 | 5 | 6
}

export interface FeedWishlist {
  id:    string
  title: string
}

export interface FeedEvent {
  id:           string
  kind:         ActivityKind
  actor:        FeedActor
  wishlist?:    FeedWishlist
  item?:        FeedItem        // pour item_added (1 article) / reaction_added
  items?:       FeedItem[]      // pour item_added groupé (N articles)
  targetUser?:  { name: string; initial: string }
  reactionType?: string
  time:         string          // ex. "il y a 12 min"
  created_at:   string
}

export interface BirthdayEntry {
  name:     string
  initial:  string
  tone:     1 | 2 | 3 | 4 | 5
  when:     string   // ex. "2 juin"
  daysLeft: number
}

export interface MyReservation {
  itemId:         string
  itemTitle:      string
  wishlistId:     string
  wishlistTitle:  string
  ownerName:      string
}
