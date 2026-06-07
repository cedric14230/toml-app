'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { HDShell } from '@/components/landing/shells'
import { TomlAvatar, TomlStars, TomlBookmarklet } from '@/components/toml-ds/toml-kit'
import { TomlIcon } from '@/components/toml-ds/toml-icons'
import type { FeedEvent, BirthdayEntry, MyReservation } from './types'

// ── Reaction emoji map ────────────────────────────────────────────────────────

const REACTION_EMOJI: Record<string, string> = {
  love:  '❤️',
  fire:  '🔥',
  party: '🎉',
  clap:  '👏',
  eyes:  '👀',
}

// ── Event body renderers ──────────────────────────────────────────────────────

const ItemAddedBody = ({ event }: { event: FeedEvent }) => {
  const items = event.items ?? (event.item ? [event.item] : [])
  if (items.length === 0) return null

  if (items.length === 1) {
    const it = items[0]
    return (
      <Link
        href={`/wishlist/${event.wishlist?.id}/item/${it.id}`}
        style={{ textDecoration: 'none', display: 'block', marginTop: 12 }}
      >
        <div style={{
          display: 'flex', gap: 16, padding: 16, borderRadius: 'var(--t-r-lg)',
          background: 'var(--t-bg)', border: '1px solid var(--t-line)',
        }}>
          <div className={`img img-${it.tone}`} style={{
            width: 120, height: 120, borderRadius: 'var(--t-r-md)', flexShrink: 0,
            border: '1.5px solid var(--t-ink)', position: 'relative', overflow: 'hidden',
          }}>
            {it.image_url && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={it.image_url} alt={it.title}
                style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
            )}
            {it.stars === 3 && (
              <span className="sticker" style={{ position: 'absolute', top: 8, left: 8, fontSize: 10, padding: '2px 6px' }}>
                <TomlStars value={3} size={9} />
              </span>
            )}
          </div>
          <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
            <div className="display-2" style={{ fontSize: 16, marginBottom: 6 }}>{it.title}</div>
            {it.note && (
              <div style={{
                fontFamily: 'var(--t-font-display)', fontStyle: 'italic',
                fontWeight: 500, fontSize: 13, color: 'var(--t-ink-2)', marginBottom: 8,
              }}>« {it.note} »</div>
            )}
            <div style={{ flex: 1 }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontSize: 15, fontWeight: 700 }}>
                {it.price != null ? `${it.price} €` : '—'}
              </div>
              <TomlStars value={it.stars} size={10} />
            </div>
          </div>
        </div>
      </Link>
    )
  }

  // Multiple items — mini grid
  return (
    <div style={{ display: 'flex', gap: 8, marginTop: 12, flexWrap: 'wrap' }}>
      {items.slice(0, 3).map(it => (
        <Link key={it.id} href={`/wishlist/${event.wishlist?.id}/item/${it.id}`} style={{ textDecoration: 'none' }}>
          <div className={`img img-${it.tone}`} style={{
            width: 80, height: 80, borderRadius: 'var(--t-r-md)',
            border: '1.5px solid var(--t-ink)', position: 'relative', overflow: 'hidden',
          }}>
            {it.image_url && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={it.image_url} alt={it.title}
                style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
            )}
          </div>
        </Link>
      ))}
      {items.length > 3 && (
        <div style={{
          width: 80, height: 80, borderRadius: 'var(--t-r-md)',
          border: '1.5px dashed var(--t-ink-3)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 13, fontWeight: 700, color: 'var(--t-ink-3)',
        }}>+{items.length - 3}</div>
      )}
    </div>
  )
}

const WishlistCreatedBody = ({ event }: { event: FeedEvent }) => {
  if (!event.wishlist) return null
  return (
    <Link
      href={`/wishlist/${event.wishlist.id}`}
      style={{ textDecoration: 'none', display: 'block', marginTop: 10 }}
    >
      <div style={{
        padding: '12px 16px', background: 'var(--t-bg)',
        borderRadius: 'var(--t-r-md)', border: '1px solid var(--t-line)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
      }}>
        <div className="display-2" style={{ fontSize: 15 }}>{event.wishlist.title}</div>
        <button className="btn btn-outline btn-sm">Voir la liste</button>
      </div>
    </Link>
  )
}

const ReactionBody = ({ event }: { event: FeedEvent }) => {
  const emoji = REACTION_EMOJI[event.reactionType ?? ''] ?? '❤️'
  return (
    <div style={{
      marginTop: 8, padding: '8px 14px',
      background: 'var(--t-paper)', border: '1px solid var(--t-line)',
      borderRadius: 'var(--t-r-md)', display: 'inline-flex', alignItems: 'center', gap: 10,
    }}>
      <span style={{ fontSize: 20 }}>{emoji}</span>
      {event.item && (
        <span style={{
          fontFamily: 'var(--t-font-display)', fontStyle: 'italic',
          fontWeight: 500, fontSize: 14, color: 'var(--t-ink-2)',
        }}>
          sur « {event.item.title} »
        </span>
      )}
    </div>
  )
}

// ── Event row ─────────────────────────────────────────────────────────────────

const EventRow = ({ event }: { event: FeedEvent }) => {
  const router = useRouter()
  let verb = ''
  let target = ''
  let body: React.ReactNode = null

  switch (event.kind) {
    case 'item_added': {
      const n = event.items?.length ?? 1
      verb   = n > 1 ? `a ajouté ${n} articles dans` : 'a ajouté un article dans'
      target = event.wishlist?.title ?? ''
      body   = <ItemAddedBody event={event} />
      break
    }
    case 'wishlist_created':
      verb   = 'a créé une nouvelle liste'
      target = event.wishlist?.title ?? ''
      body   = <WishlistCreatedBody event={event} />
      break
    case 'reaction_added':
      verb   = 'a réagi à'
      target = event.item?.title ?? ''
      body   = <ReactionBody event={event} />
      break
    case 'friendship_accepted':
      verb   = 'est maintenant ami(e) avec'
      target = event.targetUser?.name ?? ''
      break
  }

  function handleClick(e: React.MouseEvent) {
    if ((e.target as HTMLElement).closest('a')) return
    switch (event.kind) {
      case 'item_added':
      case 'reaction_added':
      case 'wishlist_created':
        if (event.wishlist?.id) router.push(`/wishlist/${event.wishlist.id}`)
        break
      case 'friendship_accepted':
        router.push(`/profile/${event.actor.id}`)
        break
    }
  }

  return (
    <div
      onClick={handleClick}
      style={{
        display: 'flex', gap: 14, padding: '20px 24px',
        borderBottom: '1px solid var(--t-line-soft)',
        background: 'var(--t-paper)', cursor: 'pointer',
      }}
    >
      <TomlAvatar initial={event.actor.initial} tone={event.actor.tone} size="md" />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 2, flexWrap: 'wrap' }}>
          <div style={{ fontSize: 15, color: 'var(--t-ink)' }}>
            <strong style={{ fontWeight: 700 }}>{event.actor.name}</strong>
            <span style={{ color: 'var(--t-ink-2)', fontWeight: 500 }}> {verb} </span>
            <strong style={{ fontWeight: 600 }}>{target}</strong>
          </div>
          <div style={{ fontSize: 12, color: 'var(--t-ink-3)', fontWeight: 600, flexShrink: 0 }}>· {event.time}</div>
        </div>
        {body}
      </div>
    </div>
  )
}

// ── Reservations list ─────────────────────────────────────────────────────────

const ReservationsList = ({ reservations }: { reservations: MyReservation[] }) => {
  if (reservations.length === 0) {
    return (
      <div style={{ padding: '60px 24px', textAlign: 'center', color: 'var(--t-ink-3)' }}>
        <div className="display-2" style={{ fontSize: 18, marginBottom: 8 }}>Aucune réservation</div>
        <div style={{ fontSize: 13 }}>Vous n&apos;avez encore rien réservé pour vos amis.</div>
      </div>
    )
  }
  return (
    <div className="card" style={{ margin: '0 24px', padding: 0, overflow: 'hidden' }}>
      {reservations.map(r => (
        <Link
          key={r.itemId}
          href={`/wishlist/${r.wishlistId}/item/${r.itemId}`}
          style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 16,
            padding: '16px 20px', borderBottom: '1px solid var(--t-line-soft)', background: 'var(--t-paper)' }}
        >
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="display-2" style={{ fontSize: 15, marginBottom: 2 }}>{r.itemTitle}</div>
            <div style={{ fontSize: 12, color: 'var(--t-ink-3)' }}>
              Dans <strong style={{ color: 'var(--t-ink-2)' }}>{r.wishlistTitle}</strong> de {r.ownerName}
            </div>
          </div>
          <span className="chip chip-mustard" style={{ fontSize: 11, flexShrink: 0 }}>
            <span className="dot dot-reserved" style={{ marginRight: 4 }} />
            Réservé
          </span>
        </Link>
      ))}
    </div>
  )
}

// ── Sidebar ───────────────────────────────────────────────────────────────────

type FeedFilter = 'all' | 'reservations'

const Sidebar = ({
  active, onFilter, totalEvents, totalReservations,
}: {
  active: FeedFilter
  onFilter: (f: FeedFilter) => void
  totalEvents: number
  totalReservations: number
}) => (
  <aside style={{ width: 240, flexShrink: 0, padding: '24px 8px 24px 24px' }}>
    <div className="label" style={{ marginBottom: 10, padding: '0 12px' }}>Filtres</div>
    <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {([
        { key: 'all',          label: "Toute l'activité", count: totalEvents },
        { key: 'reservations', label: 'Mes réservations', count: totalReservations },
      ] as { key: FeedFilter; label: string; count: number }[]).map(f => (
        <button key={f.key} onClick={() => onFilter(f.key)} style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '10px 12px', borderRadius: 10, cursor: 'pointer', border: 'none',
          background: active === f.key ? 'var(--t-ink)' : 'transparent',
          color: active === f.key ? 'var(--t-bg)' : 'var(--t-ink)',
          fontFamily: 'var(--t-font-ui)', fontSize: 13.5, fontWeight: active === f.key ? 700 : 500,
        }}>
          <span>{f.label}</span>
          <span style={{ fontSize: 11, fontWeight: 700, color: active === f.key ? 'var(--t-bg-3)' : 'var(--t-ink-3)' }}>
            {f.count}
          </span>
        </button>
      ))}
    </div>
  </aside>
)

// ── Right rail ────────────────────────────────────────────────────────────────

const RightRail = ({ birthdays }: { birthdays: BirthdayEntry[] }) => (
  <aside style={{ width: 300, flexShrink: 0, padding: '24px 24px 24px 8px' }}>

    {/* Anniversaires */}
    {birthdays.length > 0 && (
      <div className="card" style={{ padding: 18, marginBottom: 18 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 12 }}>
          <div className="display-2" style={{ fontSize: 15 }}>🎂 Anniversaires</div>
          <span style={{ fontSize: 11, color: 'var(--t-ink-3)', fontWeight: 600 }}>{birthdays.length} prochain{birthdays.length > 1 ? 's' : ''}</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {birthdays.map((b, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <TomlAvatar initial={b.initial} tone={b.tone} size="sm" />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 700 }}>{b.name}</div>
                <div style={{ fontSize: 11, color: 'var(--t-ink-3)' }}>{b.when}</div>
              </div>
              <span className="chip chip-mustard" style={{ fontSize: 10, padding: '2px 8px' }}>
                {b.daysLeft === 0 ? "aujourd'hui" : `${b.daysLeft}j`}
              </span>
            </div>
          ))}
        </div>
      </div>
    )}

    {/* Bookmarklet */}
    <div className="card" style={{ padding: 16, marginBottom: 18, background: 'var(--t-ink)', color: 'var(--t-bg)' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
        <div style={{
          width: 36, height: 36, borderRadius: 10, flexShrink: 0,
          background: 'var(--t-mustard)', color: 'var(--t-ink)',
          border: '1.5px solid var(--t-bg)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <TomlIcon name="bookmark" size={18} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: 'var(--t-font-display)', fontWeight: 700, fontSize: 14, marginBottom: 4, lineHeight: 1.2, color: 'var(--t-bg)' }}>
            Ajoutez en 1 clic
          </div>
          <div style={{ fontSize: 12, color: 'var(--t-bg-2)', marginBottom: 12, lineHeight: 1.4 }}>
            Glissez ce bouton dans votre barre de favoris.
          </div>
          <TomlBookmarklet />
        </div>
      </div>
    </div>
  </aside>
)

// ── Empty state ───────────────────────────────────────────────────────────────

const EmptyFeed = () => (
  <div style={{ padding: '60px 24px', textAlign: 'center', color: 'var(--t-ink-3)' }}>
    <div className="display-2" style={{ fontSize: 20, marginBottom: 10 }}>Aucune activité</div>
    <div style={{ fontSize: 14, maxWidth: 320, margin: '0 auto 20px', lineHeight: 1.5 }}>
      Invitez des amis et ajoutez-les à votre liste pour voir leur activité ici.
    </div>
    <Link href="/friends" className="btn btn-primary btn-stamp" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
      <TomlIcon name="friends" size={14} />
      Trouver des amis
    </Link>
  </div>
)

// ── Desktop feed ──────────────────────────────────────────────────────────────

interface HDFeedProps {
  events:         FeedEvent[]
  birthdays:      BirthdayEntry[]
  myReservations: MyReservation[]
}

export const HDFeed = ({ events, birthdays, myReservations }: HDFeedProps) => {
  const [activeFilter, setActiveFilter] = useState<FeedFilter>('all')

  return (
    <HDShell active="feed" authed>
      <div style={{ display: 'flex', minHeight: '100%' }}>
        <Sidebar
          active={activeFilter}
          onFilter={setActiveFilter}
          totalEvents={events.length}
          totalReservations={myReservations.length}
        />

        <main style={{ flex: 1, minWidth: 0, padding: '24px 0' }}>
          <div style={{ padding: '0 24px 16px' }}>
            <div className="label" style={{ marginBottom: 4 }}>Activité</div>
            <h1 className="display-2" style={{ fontSize: 28 }}>Feed</h1>
          </div>

          {activeFilter === 'reservations' ? (
            <ReservationsList reservations={myReservations} />
          ) : events.length === 0 ? (
            <EmptyFeed />
          ) : (
            <div className="card" style={{ margin: '0 24px', padding: 0, overflow: 'hidden' }}>
              {events.map(e => <EventRow key={e.id} event={e} />)}
              <div style={{ padding: '20px 24px', textAlign: 'center' }}>
                <button className="btn btn-outline btn-sm">Charger plus d&apos;activité</button>
              </div>
            </div>
          )}
        </main>

        <RightRail birthdays={birthdays} />
      </div>
    </HDShell>
  )
}
