export interface FriendData {
  userId: string
  name: string
  initial: string
  tone: 1 | 2 | 3 | 4 | 5
  wishlistCount: number
}

export interface PendingData {
  senderId: string
  name: string
  initial: string
  tone: 1 | 2 | 3 | 4 | 5
}

export interface SearchResult {
  userId: string
  name: string
  initial: string
  tone: 1 | 2 | 3 | 4 | 5
}

// ── Shared utilities ──────────────────────────────────────────────────────────

export function toTone(id: string): 1 | 2 | 3 | 4 | 5 {
  const hex = id.replace(/-/g, '').slice(0, 4)
  return ((parseInt(hex, 16) % 5) + 1) as 1 | 2 | 3 | 4 | 5
}

export function toInitial(name: string | null): string {
  return (name ?? '?').trim().charAt(0).toUpperCase()
}
