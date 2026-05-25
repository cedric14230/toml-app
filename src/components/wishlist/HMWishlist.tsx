'use client'

import { HMShell, HMTopBar } from '@/components/landing/shells'
import { TomlStars } from '@/components/toml-ds/toml-kit'
import { TomlIcon } from '@/components/toml-ds/toml-icons'
import type { ItemRow, WishlistData, WishlistStats } from './types'

// ── Visibility helpers ────────────────────────────────────────────────────────

const VIS_LABEL = { private: 'Privée', friends: 'Amis', public: 'Publique' } as const
const VIS_ICON  = { private: 'lock',   friends: 'friends', public: 'eye'   } as const

// ── Heights for masonry visual rhythm (purely visual, not data) ───────────────

const HEIGHTS = [180, 200, 160, 220, 170]

// ── Featured card (3★ — full width) ──────────────────────────────────────────

const FeaturedCard = ({ item, isOwner }: { item: ItemRow; isOwner: boolean }) => (
  <div className="card" style={{ opacity: item.status !== 'available' ? 0.55 : 1, position: 'relative' }}>
    <div
      className={`img img-${item.tone}`}
      style={{ height: 280, position: 'relative', overflow: 'hidden' }}
    >
      {item.image_url && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={item.image_url}
          alt={item.title}
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
        />
      )}
      <span className="sticker" style={{ position: 'absolute', top: 14, left: 14 }}>
        <TomlStars value={3} size={11} />
        <span style={{ marginLeft: 4 }}>top wishlist</span>
      </span>
      {item.status !== 'available' && (
        <span className="chip chip-mustard" style={{ position: 'absolute', top: 14, right: 14, fontSize: 10 }}>
          <span className="dot dot-reserved" style={{ marginRight: 4 }} />
          Réservé
        </span>
      )}
      {!isOwner && item.status === 'available' && (
        <button className="btn btn-ghost" style={{
          position: 'absolute', top: 12, right: 12,
          width: 36, height: 36, padding: 0, borderRadius: 999,
          background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(4px)',
          border: '1px solid var(--t-line)',
        }}>
          <TomlIcon name="heart" size={16} />
        </button>
      )}
    </div>
    <div style={{ padding: '14px 16px' }}>
      <div className="display-2" style={{ fontSize: 18, marginBottom: item.note ? 6 : 8 }}>
        {item.title}
      </div>
      {item.note && (
        <div style={{
          fontFamily: 'var(--t-font-display)', fontStyle: 'italic',
          fontWeight: 500, fontSize: 15, color: 'var(--t-ink-2)', marginBottom: 8,
        }}>
          « {item.note} »
        </div>
      )}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontSize: 17, fontWeight: 700, letterSpacing: '-0.01em' }}>
          {item.price != null ? `${item.price} €` : '—'}
        </div>
        {isOwner && (
          <button className="btn btn-outline btn-sm">
            <TomlIcon name="edit" size={13} />
            Modifier
          </button>
        )}
      </div>
    </div>
  </div>
)

// ── Small card (2-col masonry) ────────────────────────────────────────────────

const SmallCard = ({ item, h }: { item: ItemRow; h: number }) => (
  <div className="card-soft" style={{ opacity: item.status !== 'available' ? 0.55 : 1, marginBottom: 10 }}>
    <div
      className={`img img-${item.tone}`}
      style={{ height: h, position: 'relative', overflow: 'hidden' }}
    >
      {item.image_url && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={item.image_url}
          alt={item.title}
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
        />
      )}
      {item.status !== 'available' && (
        <span className="chip chip-mustard" style={{ position: 'absolute', top: 8, left: 8, fontSize: 10, padding: '2px 8px' }}>
          <span className="dot dot-reserved" style={{ marginRight: 4 }} />
          Réservé
        </span>
      )}
    </div>
    <div style={{ padding: 10 }}>
      <div className="display-2" style={{ fontSize: 13, marginBottom: 6, lineHeight: 1.2 }}>
        {item.title}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontSize: 13, fontWeight: 700 }}>
          {item.price != null ? `${item.price} €` : '—'}
        </div>
        <TomlStars value={item.stars} size={9} />
      </div>
    </div>
  </div>
)

// ── Mobile wishlist ───────────────────────────────────────────────────────────

interface HMWishlistProps {
  wishlist: WishlistData
  items: ItemRow[]
  stats: WishlistStats
  isOwner: boolean
}

export const HMWishlist = ({ wishlist, items, stats, isOwner }: HMWishlistProps) => {
  const featured = items.filter(it => it.stars === 3)
  const others   = items.filter(it => it.stars < 3)
  const col1     = others.filter((_, i) => i % 2 === 0)
  const col2     = others.filter((_, i) => i % 2 === 1)

  const visLabel = VIS_LABEL[wishlist.visibility]
  const visIcon  = VIS_ICON[wishlist.visibility]

  return (
    <HMShell>
      <HMTopBar
        back
        title={wishlist.title}
        right={
          <>
            <button className="btn btn-ghost" style={{
              width: 36, height: 36, padding: 0, borderRadius: 999,
              background: 'var(--t-paper)', border: '1px solid var(--t-line)',
            }}>
              <TomlIcon name="share" size={16} />
            </button>
            {isOwner && (
              <button className="btn btn-ghost" style={{
                width: 36, height: 36, padding: 0, borderRadius: 999,
                background: 'var(--t-paper)', border: '1px solid var(--t-line)',
              }}>
                <TomlIcon name="menu" size={16} />
              </button>
            )}
          </>
        }
      />

      {/* Hero context */}
      <div style={{ padding: '14px 18px 8px' }}>
        <div className="label" style={{ marginBottom: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
          <TomlIcon name={visIcon} size={11} />
          {visLabel} · {stats.total} article{stats.total !== 1 ? 's' : ''} · {stats.available} disponible{stats.available !== 1 ? 's' : ''}
        </div>
        {wishlist.description && (
          <div style={{
            fontFamily: 'var(--t-font-display)', fontStyle: 'italic',
            fontWeight: 500, fontSize: 17, lineHeight: 1.35, color: 'var(--t-ink-2)',
          }}>
            « {wishlist.description} »
          </div>
        )}
      </div>

      {/* Add button (owner only) */}
      {isOwner && (
        <div style={{ padding: '8px 18px 4px' }}>
          <button className="btn btn-primary btn-stamp btn-sm" style={{ width: '100%' }}>
            <TomlIcon name="plus" size={14} />
            Ajouter un article
          </button>
        </div>
      )}

      {/* Empty state */}
      {items.length === 0 && (
        <div style={{ padding: '60px 18px', textAlign: 'center', color: 'var(--t-ink-3)' }}>
          <div className="display-2" style={{ fontSize: 18, marginBottom: 8 }}>Aucun article</div>
          <div style={{ fontSize: 13 }}>
            {isOwner ? 'Ajoute ton premier article !' : 'Cette wishlist est encore vide.'}
          </div>
        </div>
      )}

      {/* Featured 3★ — full width */}
      {featured.length > 0 && (
        <div style={{ padding: '12px 18px 0', display: 'flex', flexDirection: 'column', gap: 16 }}>
          {featured.map(it => <FeaturedCard key={it.id} item={it} isOwner={isOwner} />)}
        </div>
      )}

      {/* Others — 2-col masonry */}
      {others.length > 0 && (
        <>
          <div style={{ padding: '20px 18px 8px' }}>
            <div className="label">Le reste de la liste</div>
          </div>
          <div style={{ padding: '0 14px 24px', display: 'flex', gap: 10 }}>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
              {col1.map((it, i) => <SmallCard key={it.id} item={it} h={HEIGHTS[i % HEIGHTS.length]} />)}
            </div>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
              {col2.map((it, i) => <SmallCard key={it.id} item={it} h={HEIGHTS[(i + 1) % HEIGHTS.length]} />)}
            </div>
          </div>
        </>
      )}
    </HMShell>
  )
}
