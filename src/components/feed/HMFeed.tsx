'use client'

import { useState } from 'react'
import Link from 'next/link'
import { HMShell, HMTopBar } from '@/components/landing/shells'
import { TomlAvatar, TomlStars } from '@/components/toml-ds/toml-kit'
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

// ── Event card ────────────────────────────────────────────────────────────────

const FeedEventCard = ({ event }: { event: FeedEvent }) => {
  let verb = ''
  let target = ''

  switch (event.kind) {
    case 'item_added': {
      const n = event.items?.length ?? 1
      verb   = n > 1 ? `a ajouté ${n} articles dans` : 'a ajouté un article dans'
      target = event.wishlist?.title ?? ''
      break
    }
    case 'wishlist_created':
      verb   = 'a créé une nouvelle liste'
      target = event.wishlist?.title ?? ''
      break
    case 'reaction_added':
      verb   = 'a réagi à'
      target = event.item?.title ?? ''
      break
    case 'friendship_accepted':
      verb   = 'est maintenant ami(e) avec'
      target = event.targetUser?.name ?? ''
      break
  }

  const items = event.items ?? (event.item ? [event.item] : [])

  return (
    <div style={{
      display: 'flex', gap: 12, padding: '14px 18px',
      borderBottom: '1px solid var(--t-line-soft)',
      background: 'var(--t-bg)',
    }}>
      <TomlAvatar initial={event.actor.initial} tone={event.actor.tone} size="md" />
      <div style={{ flex: 1, minWidth: 0 }}>
        {/* Header */}
        <div style={{ fontSize: 14, lineHeight: 1.4, color: 'var(--t-ink)', marginBottom: 2 }}>
          <strong style={{ fontWeight: 700 }}>{event.actor.name}</strong>
          <span style={{ color: 'var(--t-ink-2)' }}> {verb} </span>
          <strong style={{ fontWeight: 600 }}>{target}</strong>
        </div>

        {/* Body */}
        {event.kind === 'item_added' && items.length === 1 && (
          <Link
            href={`/wishlist/${event.wishlist?.id}/item/${items[0].id}`}
            style={{ textDecoration: 'none', display: 'block' }}
          >
            <div className="card" style={{ marginTop: 8 }}>
              <div className={`img img-${items[0].tone}`} style={{ height: 140, position: 'relative', overflow: 'hidden' }}>
                {items[0].image_url && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={items[0].image_url} alt={items[0].title}
                    style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                )}
                {items[0].stars === 3 && (
                  <span className="sticker" style={{ position: 'absolute', top: 10, left: 10 }}>
                    <TomlStars value={3} size={10} />
                    <span style={{ marginLeft: 4 }}>top</span>
                  </span>
                )}
              </div>
              <div style={{ padding: '10px 14px' }}>
                <div className="display-2" style={{ fontSize: 14, marginBottom: 4 }}>{items[0].title}</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontSize: 14, fontWeight: 700 }}>
                    {items[0].price != null ? `${items[0].price} €` : '—'}
                  </div>
                  <TomlStars value={items[0].stars} size={9} />
                </div>
              </div>
            </div>
          </Link>
        )}

        {event.kind === 'item_added' && items.length > 1 && (
          <div style={{ display: 'flex', gap: 6, marginTop: 8, flexWrap: 'wrap' }}>
            {items.slice(0, 3).map(it => (
              <Link key={it.id} href={`/wishlist/${event.wishlist?.id}/item/${it.id}`} style={{ textDecoration: 'none' }}>
                <div className={`img img-${it.tone}`} style={{
                  width: 56, height: 56, borderRadius: 10, border: '1.5px solid var(--t-ink)',
                  position: 'relative', overflow: 'hidden',
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
                width: 56, height: 56, borderRadius: 10, border: '1.5px dashed var(--t-ink-3)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 11, fontWeight: 700, color: 'var(--t-ink-3)',
              }}>+{items.length - 3}</div>
            )}
          </div>
        )}

        {event.kind === 'wishlist_created' && event.wishlist && (
          <Link href={`/wishlist/${event.wishlist.id}`} style={{ textDecoration: 'none' }}>
            <div className="card-soft" style={{ marginTop: 8, padding: '10px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div className="display-2" style={{ fontSize: 13 }}>{event.wishlist.title}</div>
              <TomlIcon name="arrow" size={12} />
            </div>
          </Link>
        )}

        {event.kind === 'reaction_added' && (
          <div style={{
            marginTop: 6, padding: '6px 12px',
            background: 'var(--t-paper)', border: '1px solid var(--t-line)',
            borderRadius: 'var(--t-r-md)', display: 'flex', alignItems: 'center', gap: 8,
          }}>
            <span style={{ fontSize: 18 }}>{REACTION_EMOJI[event.reactionType ?? ''] ?? '❤️'}</span>
            {event.item && (
              <span style={{
                fontFamily: 'var(--t-font-display)', fontStyle: 'italic',
                fontWeight: 500, fontSize: 12, color: 'var(--t-ink-2)',
              }}>« {event.item.title} »</span>
            )}
          </div>
        )}

        {/* Timestamp */}
        <div style={{ fontSize: 11, color: 'var(--t-ink-3)', marginTop: 6, fontWeight: 600, letterSpacing: '0.02em' }}>
          {event.time}
        </div>
      </div>
    </div>
  )
}

// ── Reservations list ─────────────────────────────────────────────────────────

const ReservationsList = ({ reservations }: { reservations: MyReservation[] }) => {
  if (reservations.length === 0) {
    return (
      <div style={{ padding: '60px 18px', textAlign: 'center', color: 'var(--t-ink-3)' }}>
        <div className="display-2" style={{ fontSize: 16, marginBottom: 8 }}>Aucune réservation</div>
        <div style={{ fontSize: 13 }}>Tu n&apos;as encore rien réservé pour tes amis.</div>
      </div>
    )
  }
  return (
    <div>
      {reservations.map(r => (
        <Link
          key={r.itemId}
          href={`/wishlist/${r.wishlistId}/item/${r.itemId}`}
          style={{
            textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 14,
            padding: '14px 18px', borderBottom: '1px solid var(--t-line-soft)', background: 'var(--t-bg)',
          }}
        >
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="display-2" style={{ fontSize: 14, marginBottom: 2 }}>{r.itemTitle}</div>
            <div style={{ fontSize: 11, color: 'var(--t-ink-3)' }}>
              {r.wishlistTitle} · {r.ownerName}
            </div>
          </div>
          <span className="chip chip-mustard" style={{ fontSize: 10, flexShrink: 0 }}>
            <span className="dot dot-reserved" style={{ marginRight: 4 }} />
            Réservé
          </span>
        </Link>
      ))}
    </div>
  )
}

// ── Mobile feed ───────────────────────────────────────────────────────────────

type FeedFilter = 'all' | 'reservations'

interface HMFeedProps {
  events:         FeedEvent[]
  birthdays:      BirthdayEntry[]
  myReservations: MyReservation[]
}

export const HMFeed = ({ events, birthdays, myReservations }: HMFeedProps) => {
  const [active, setActive] = useState<FeedFilter>('all')

  const nextBday = birthdays[0]

  return (
    <HMShell>
      <HMTopBar
        left={
          <div>
            <div className="label" style={{ marginBottom: 2 }}>Activité</div>
            <div className="display-2" style={{ fontSize: 22 }}>Feed</div>
          </div>
        }
        right={
          <button className="btn btn-ghost" style={{
            width: 38, height: 38, padding: 0, borderRadius: 999,
            background: 'var(--t-paper)', border: '1px solid var(--t-line)',
          }}>
            <TomlIcon name="filter" size={18} />
          </button>
        }
      />

      {/* Filters */}
      <div style={{
        padding: '8px 18px 14px', display: 'flex', gap: 8, overflowX: 'auto',
        borderBottom: '1px solid var(--t-line-soft)',
      }}>
        {([
          { key: 'all',          label: `Tout (${events.length})` },
          { key: 'reservations', label: `Mes réservations (${myReservations.length})` },
        ] as { key: FeedFilter; label: string }[]).map(f => (
          <button key={f.key} onClick={() => setActive(f.key)}
            className={`chip ${active === f.key ? 'chip-active' : ''}`}
            style={{ border: 'none', cursor: 'pointer', flexShrink: 0 }}>
            {f.label}
          </button>
        ))}
      </div>

      {/* Next birthday highlight */}
      {active === 'all' && nextBday && (
        <div style={{ padding: '14px 18px 8px' }}>
          <div className="giver-banner">
            <span style={{ fontSize: 26 }}>🎂</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: 14 }}>Anniversaire de {nextBday.name}</div>
              <div style={{ fontSize: 12, color: 'var(--t-ink-2)' }}>
                {nextBday.daysLeft === 0 ? "C'est aujourd'hui !" : `Dans ${nextBday.daysLeft} jour${nextBday.daysLeft > 1 ? 's' : ''} — ${nextBday.when}`}
              </div>
            </div>
            <button className="btn btn-primary btn-sm btn-stamp" style={{ flexShrink: 0 }}>Voir</button>
          </div>
        </div>
      )}

      {/* Content */}
      {active === 'reservations' ? (
        <ReservationsList reservations={myReservations} />
      ) : events.length === 0 ? (
        <div style={{ padding: '60px 18px', textAlign: 'center', color: 'var(--t-ink-3)' }}>
          <div className="display-2" style={{ fontSize: 16, marginBottom: 8 }}>Aucune activité</div>
          <div style={{ fontSize: 13 }}>Invite des amis pour voir leur activité ici.</div>
        </div>
      ) : (
        <div>
          {events.map(e => <FeedEventCard key={e.id} event={e} />)}
          <div style={{ padding: '20px 18px 30px', textAlign: 'center' }}>
            <button className="btn btn-outline btn-sm">Charger plus d&apos;activité</button>
          </div>
        </div>
      )}
    </HMShell>
  )
}
