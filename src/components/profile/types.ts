export type ViewerContext    = 'owner' | 'friend' | 'visitor'
export type FriendshipStatus = 'none' | 'pending_out' | 'pending_in' | 'accepted'

export interface ProfileData {
  id:          string
  name:        string
  initial:     string
  avatarTone:  1 | 2 | 3 | 4 | 5
  bio:         string | null
  friendCount: number
}

export interface WishlistCard {
  id:         string
  title:      string
  visibility: 'public' | 'friends' | 'private'
  itemCount:  number
  tone:       1 | 2 | 3 | 4 | 5 | 6
}

export interface ProfilePageProps {
  profile:          ProfileData
  wishlists:        WishlistCard[]
  viewerContext:    ViewerContext
  friendshipStatus: FriendshipStatus
  viewerId:         string | null
}
