import { redirect } from 'next/navigation'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { HDFeed } from '@/components/feed/HDFeed'
import { HMFeed } from '@/components/feed/HMFeed'
import type { FeedEvent, FeedItem, BirthdayEntry, MyReservation } from '@/components/feed/types'

// ── Helpers ───────────────────────────────────────────────────────────────────

function toneFromId(id: string): 1 | 2 | 3 | 4 | 5 | 6 {
  const hex = id.replace(/-/g, '').slice(0, 4)
  return ((parseInt(hex, 16) % 6) + 1) as 1 | 2 | 3 | 4 | 5 | 6
}

function actorTone(id: string): 1 | 2 | 3 | 4 | 5 {
  const hex = id.replace(/-/g, '').slice(0, 4)
  return ((parseInt(hex, 16) % 5) + 1) as 1 | 2 | 3 | 4 | 5
}

function initial(name: string | null): string {
  return (name ?? '?').trim().charAt(0).toUpperCase()
}

const PRIORITY_STARS: Record<string, 1 | 2 | 3> = { low: 1, medium: 2, high: 3 }

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const m = Math.floor(diff / 60_000)
  if (m < 1)  return "à l'instant"
  if (m < 60) return `il y a ${m} min`
  const h = Math.floor(m / 60)
  if (h < 24) return `il y a ${h} h`
  const d = Math.floor(h / 24)
  if (d === 1) return 'hier'
  if (d < 7)   return `il y a ${d} jours`
  return `il y a ${Math.floor(d / 7)} semaines`
}

function nextBirthday(birthday: string): { when: string; daysLeft: number } | null {
  const bday = new Date(birthday)
  if (isNaN(bday.getTime())) return null
  const now = new Date()
  const thisYear = new Date(now.getFullYear(), bday.getMonth(), bday.getDate())
  const target   = thisYear >= now
    ? thisYear
    : new Date(now.getFullYear() + 1, bday.getMonth(), bday.getDate())
  const daysLeft = Math.round((target.getTime() - now.getTime()) / 86_400_000)
  const when = target.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })
  return { when, daysLeft }
}

function eventDay(dateStr: string): string {
  return new Date(dateStr).toISOString().slice(0, 10)
}

// ── Raw Supabase types ────────────────────────────────────────────────────────

// Supabase retourne les jointures FK comme des tableaux même pour les relations 1-1
type RawEvent = {
  id: string
  kind: string
  reaction_type: string | null
  created_at: string
  actor:       { id: string; name: string | null }[]
  wishlist:    { id: string; title: string }[]
  item:        { id: string; title: string; image_url: string | null; price: number | null; note: string | null; priority: string }[]
  target_user: { id: string; name: string | null }[]
}

type RawFriendship = {
  user_id_1: string
  user_id_2: string
  u1: { id: string; name: string | null; birthday: string | null }[]
  u2: { id: string; name: string | null; birthday: string | null }[]
}

type RawReservation = {
  item_id: string
  item: {
    id: string
    title: string
    wishlist: {
      id: string
      title: string
      owner: { name: string | null }[]
    }[]
  }[]
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default async function FeedPage() {
  const supabase = await createSupabaseServerClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/')

  const [
    { data: rawActivity },
    { data: rawFriendships },
    { data: rawReservations },
  ] = await Promise.all([

    supabase
      .from('activity')
      .select(`
        id, kind, reaction_type, created_at,
        actor:users!actor_id(id, name),
        wishlist:wishlists!wishlist_id(id, title),
        item:items!item_id(id, title, image_url, price, note, priority),
        target_user:users!target_user_id(id, name)
      `)
      .order('created_at', { ascending: false })
      .limit(60),

    supabase
      .from('friendships')
      .select(`
        user_id_1, user_id_2,
        u1:users!user_id_1(id, name, birthday),
        u2:users!user_id_2(id, name, birthday)
      `)
      .or(`user_id_1.eq.${user.id},user_id_2.eq.${user.id}`)
      .eq('status', 'accepted'),

    supabase
      .from('reservations')
      .select(`
        item_id,
        item:items!item_id(
          id, title,
          wishlist:wishlists!wishlist_id(
            id, title,
            owner:users!user_id(name)
          )
        )
      `)
      .eq('reserver_user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(20),
  ])

  // ── Transform activity + group item_added ─────────────────────────────────
  // Supabase retourne les jointures comme des tableaux — on prend toujours [0]

  type RawItemRow = RawEvent['item'][0]

  function toFeedItem(it: RawItemRow | undefined): FeedItem | undefined {
    if (!it) return undefined
    return {
      id:        it.id,
      title:     it.title,
      image_url: it.image_url,
      price:     it.price,
      note:      it.note,
      stars:     PRIORITY_STARS[it.priority] ?? 2,
      tone:      toneFromId(it.id),
    }
  }

  const events: FeedEvent[] = []
  const groupMap = new Map<string, FeedEvent>()

  for (const e of ((rawActivity ?? []) as RawEvent[])) {
    const actorRow  = e.actor?.[0]
    const wishlistRow = e.wishlist?.[0]
    const itemRow     = e.item?.[0]
    const targetRow   = e.target_user?.[0]

    if (!actorRow) continue

    const actor = {
      id:      actorRow.id,
      name:    actorRow.name ?? 'Utilisateur',
      initial: initial(actorRow.name),
      tone:    actorTone(actorRow.id),
    }

    if (e.kind === 'item_added' && wishlistRow && itemRow) {
      const key = `${actor.id}:${wishlistRow.id}:${eventDay(e.created_at)}`
      if (groupMap.has(key)) {
        groupMap.get(key)!.items!.push(toFeedItem(itemRow)!)
        continue
      }
      const ev: FeedEvent = {
        id:         e.id,
        kind:       'item_added',
        actor,
        wishlist:   wishlistRow,
        items:      [toFeedItem(itemRow)!],
        time:       timeAgo(e.created_at),
        created_at: e.created_at,
      }
      groupMap.set(key, ev)
      events.push(ev)
      continue
    }

    events.push({
      id:           e.id,
      kind:         e.kind as FeedEvent['kind'],
      actor,
      wishlist:     wishlistRow,
      item:         toFeedItem(itemRow),
      targetUser:   targetRow
        ? { name: targetRow.name ?? 'Utilisateur', initial: initial(targetRow.name) }
        : undefined,
      reactionType: e.reaction_type ?? undefined,
      time:         timeAgo(e.created_at),
      created_at:   e.created_at,
    })
  }

  // ── Birthdays ─────────────────────────────────────────────────────────────

  const birthdays: BirthdayEntry[] = ((rawFriendships ?? []) as RawFriendship[])
    .map(f => {
      const friend = (f.user_id_1 === user.id ? f.u2 : f.u1)?.[0]
      if (!friend || !friend.birthday) return null
      const bd = nextBirthday(friend.birthday)
      if (!bd) return null
      return {
        name:     friend.name ?? 'Ami',
        initial:  initial(friend.name),
        tone:     actorTone(friend.id),
        when:     bd.when,
        daysLeft: bd.daysLeft,
      }
    })
    .filter((b): b is BirthdayEntry => b !== null)
    .sort((a, b) => a.daysLeft - b.daysLeft)
    .slice(0, 5)

  // ── My reservations ───────────────────────────────────────────────────────

  const myReservations: MyReservation[] = ((rawReservations ?? []) as RawReservation[])
    .map(r => {
      const item     = r.item?.[0]
      const wishlist = item?.wishlist?.[0]
      const owner    = wishlist?.owner?.[0]
      if (!item || !wishlist) return null
      return {
        itemId:        item.id,
        itemTitle:     item.title,
        wishlistId:    wishlist.id,
        wishlistTitle: wishlist.title,
        ownerName:     owner?.name ?? 'Quelqu\'un',
      }
    })
    .filter((r): r is MyReservation => r !== null)

  return (
    <>
      <div className="hidden md:block">
        <HDFeed events={events} birthdays={birthdays} myReservations={myReservations} />
      </div>
      <div className="md:hidden">
        <HMFeed events={events} birthdays={birthdays} myReservations={myReservations} />
      </div>
    </>
  )
}
