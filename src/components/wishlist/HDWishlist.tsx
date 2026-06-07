'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { HDShell } from '@/components/landing/shells'
import { TomlStars } from '@/components/toml-ds/toml-kit'
import { TomlIcon } from '@/components/toml-ds/toml-icons'
import AddItemModal from '@/components/items/AddItemModal'
import EditItemModal from '@/components/items/EditItemModal'
import EditWishlistModal from '@/components/wishlists/EditWishlistModal'
import ReactionBar from '@/components/items/ReactionBar'
import type { ItemRow, WishlistData, WishlistStats } from './types'

// ── Visibility helpers ────────────────────────────────────────────────────────

const VIS_LABEL = { private: 'Privée', friends: 'Amis', public: 'Publique' } as const
const VIS_ICON  = { private: 'lock',   friends: 'friends', public: 'eye'   } as const

// ── Item card ─────────────────────────────────────────────────────────────────

const ItemCard = ({
  item, isOwner, big, onEdit,
}: {
  item: ItemRow
  isOwner: boolean
  big: boolean
  onEdit?: () => void
}) => (
  <div
    className={big ? 'card' : 'card-soft'}
    style={{ breakInside: 'avoid', marginBottom: 16, opacity: item.status !== 'available' ? 0.6 : 1, position: 'relative' }}
  >
    {/* Image area — real image or colored fallback */}
    <div
      className={`img img-${item.tone}`}
      style={{ height: big ? 320 : 220, position: 'relative', overflow: 'hidden' }}
    >
      {item.image_url && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={item.image_url}
          alt={item.title}
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
        />
      )}
      {item.stars === 3 && (
        <span className="sticker" style={{ position: 'absolute', top: 12, left: 12 }}>
          <TomlStars value={3} size={11} />
          <span style={{ marginLeft: 4 }}>top wishlist</span>
        </span>
      )}
      {item.status !== 'available' && (
        <span className="chip chip-mustard" style={{ position: 'absolute', top: 12, left: item.stars === 3 ? 'auto' : 12, right: item.stars === 3 ? 12 : 'auto', fontSize: 11 }}>
          <span className="dot dot-reserved" style={{ marginRight: 4 }} />
          Réservé
        </span>
      )}
    </div>

    {/* Content */}
    <div style={{ padding: big ? '16px 18px' : '12px 14px' }}>
      <div className="display-2" style={{ fontSize: big ? 20 : 15, marginBottom: item.note ? 6 : 8, lineHeight: 1.15 }}>
        {item.title}
      </div>
      {item.note && (
        <div style={{
          fontFamily: 'var(--t-font-display)', fontStyle: 'italic', fontWeight: 500,
          fontSize: big ? 15 : 13, color: 'var(--t-ink-2)', marginBottom: 8,
        }}>
          « {item.note} »
        </div>
      )}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontSize: big ? 17 : 14, fontWeight: 700 }}>
          {item.price != null ? `${item.price} €` : '—'}
        </div>
        {!big && <TomlStars value={item.stars} size={10} />}
        {big && isOwner && (
          <button
            className="btn btn-outline btn-sm"
            onClick={e => { e.preventDefault(); e.stopPropagation(); onEdit?.() }}
          >
            <TomlIcon name="edit" size={12} />
            Modifier
          </button>
        )}
      </div>
      {item.reactionCounts && (
        <ReactionBar
          itemId={item.id}
          initialCounts={item.reactionCounts}
          initialMyReaction={item.myReaction ?? null}
        />
      )}
    </div>
  </div>
)

// ── Filter type ───────────────────────────────────────────────────────────────

type Filter = 'all' | 'available' | 'high' | 'cheap' | 'reserved'

// ── Desktop wishlist ──────────────────────────────────────────────────────────

interface HDWishlistProps {
  wishlist: WishlistData
  items: ItemRow[]
  stats: WishlistStats
  isOwner: boolean
}

export const HDWishlist = ({ wishlist, items, stats, isOwner }: HDWishlistProps) => {
  const router = useRouter()
  const [activeFilter, setActiveFilter]   = useState<Filter>('all')
  const [addItemOpen, setAddItemOpen]     = useState(false)
  const [editingItem, setEditingItem]     = useState<ItemRow | null>(null)
  const [editWlOpen, setEditWlOpen]       = useState(false)
  const [shareCopied, setShareCopied]     = useState(false)

  function handleShare() {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setShareCopied(true)
      setTimeout(() => setShareCopied(false), 2000)
    })
  }

  const displayed =
    activeFilter === 'available' ? items.filter(it => it.status === 'available')
    : activeFilter === 'high'    ? items.filter(it => it.priority === 'high')
    : activeFilter === 'cheap'   ? items.filter(it => (it.price ?? Infinity) < 50)
    : activeFilter === 'reserved'? items.filter(it => it.status !== 'available')
    : items

  const visLabel = VIS_LABEL[wishlist.visibility]
  const visIcon  = VIS_ICON[wishlist.visibility]

  return (
    <>
    <HDShell active="lists" authed>
      <div style={{ padding: '24px 40px 60px' }}>
        {/* Bouton retour */}
        <button
          onClick={() => router.back()}
          style={{
            fontSize: 13, color: 'var(--t-ink-3)', marginBottom: 18,
            display: 'inline-flex', alignItems: 'center', gap: 6,
            fontWeight: 600, background: 'none', border: 'none',
            cursor: 'pointer', padding: 0,
          }}
        >
          <TomlIcon name="arrow" size={12} style={{ transform: 'rotate(180deg)' }} />
          Mes wishlists
        </button>

        {/* Hero */}
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 28, marginBottom: 28, flexWrap: 'wrap' }}>
          {/* Cover image or colored block */}
          <div
            className={`img img-${wishlist.tone}`}
            style={{
              width: 200, height: 160, borderRadius: 'var(--t-r-lg)',
              border: '1.5px solid var(--t-ink)', boxShadow: 'var(--t-shadow-stamp)',
              position: 'relative', flexShrink: 0, overflow: 'hidden',
            }}
          >
            {wishlist.cover_url && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={wishlist.cover_url}
                alt={wishlist.title}
                style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
              />
            )}
          </div>

          <div style={{ flex: 1, minWidth: 280 }}>
            <div className="label" style={{ marginBottom: 6, display: 'flex', alignItems: 'center', gap: 8 }}>
              <TomlIcon name={visIcon} size={11} />
              Wishlist · {stats.total} article{stats.total !== 1 ? 's' : ''} · {stats.available} disponible{stats.available !== 1 ? 's' : ''} · {visLabel}
            </div>
            <h1 className="display-2" style={{ fontSize: 48, letterSpacing: '-0.025em', marginBottom: 10 }}>
              {wishlist.title}
            </h1>
            {wishlist.description && (
              <div style={{
                fontFamily: 'var(--t-font-display)', fontStyle: 'italic',
                fontWeight: 500, fontSize: 18, color: 'var(--t-ink-2)', maxWidth: 520,
              }}>
                « {wishlist.description} »
              </div>
            )}
          </div>

          {isOwner && (
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', flexShrink: 0 }}>
              <button className="btn btn-outline" onClick={handleShare}>
                <TomlIcon name="share" size={14} />
                {shareCopied ? 'Lien copié !' : 'Partager'}
              </button>
              <button
                className="btn btn-ghost"
                style={{ background: 'var(--t-paper)', border: '1px solid var(--t-line)' }}
                onClick={() => setEditWlOpen(true)}
              >
                <TomlIcon name="menu" size={14} />
                Modifier
              </button>
              <button className="btn btn-primary btn-stamp" onClick={() => setAddItemOpen(true)}>
                <TomlIcon name="plus" size={14} />
                Ajouter un article
              </button>
            </div>
          )}
        </div>

        {/* Filter bar */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap',
          paddingBottom: 18, borderBottom: '1px solid var(--t-line)', marginBottom: 24,
        }}>
          {([
            { key: 'all',       label: `Tout (${stats.total})` },
            { key: 'available', label: `Disponibles (${stats.available})` },
            { key: 'high',      label: `Priorité 3★ (${stats.high})`,  icon: true },
            { key: 'cheap',     label: '< 50 €' },
            ...(stats.reserved > 0 ? [{ key: 'reserved', label: `Réservés (${stats.reserved})` }] : []),
          ] as { key: Filter; label: string; icon?: boolean }[]).map(({ key, label, icon }) => (
            <button
              key={key}
              onClick={() => setActiveFilter(key)}
              className={`chip ${activeFilter === key ? 'chip-active' : ''}`}
              style={{ border: 'none', cursor: 'pointer' }}
            >
              {icon && <TomlStars value={3} size={9} />}
              {label}
            </button>
          ))}

          <div style={{ flex: 1 }} />
          <span className="chip">
            <TomlIcon name="filter" size={11} />
            Tri : Récents ↓
          </span>
        </div>

        {/* Masonry 3 colonnes */}
        {displayed.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--t-ink-3)' }}>
            <div className="display-2" style={{ fontSize: 18, marginBottom: 8 }}>Aucun article</div>
            <div style={{ fontSize: 13 }}>Essayez un autre filtre ou ajoutez des articles.</div>
          </div>
        ) : (
          <div style={{ columnCount: 3, columnGap: 18 }}>
            {displayed.map(it =>
              isOwner ? (
                <div
                  key={it.id}
                  onClick={() => setEditingItem(it)}
                  style={{ cursor: 'pointer', display: 'block' }}
                >
                  <ItemCard item={it} isOwner big={it.stars === 3} onEdit={() => setEditingItem(it)} />
                </div>
              ) : (
                <Link
                  key={it.id}
                  href={`/wishlist/${wishlist.id}/item/${it.id}`}
                  style={{ textDecoration: 'none', display: 'block' }}
                >
                  <ItemCard item={it} isOwner={false} big={it.stars === 3} />
                </Link>
              )
            )}
          </div>
        )}
      </div>
    </HDShell>

    {addItemOpen && (
      <AddItemModal
        wishlistId={wishlist.id}
        onClose={() => setAddItemOpen(false)}
        onSuccess={() => { setAddItemOpen(false); router.refresh() }}
      />
    )}

    {editingItem && (
      <EditItemModal
        item={editingItem}
        onClose={() => setEditingItem(null)}
        onSuccess={() => { setEditingItem(null); router.refresh() }}
      />
    )}

    {editWlOpen && (
      <EditWishlistModal
        wishlist={wishlist}
        onClose={() => setEditWlOpen(false)}
        onSuccess={() => { setEditWlOpen(false); router.refresh() }}
      />
    )}
    </>
  )
}
