'use client'

import Link from 'next/link'
import { HDShell } from '@/components/landing/shells'
import { TomlStars } from '@/components/toml-ds/toml-kit'
import { TomlIcon } from '@/components/toml-ds/toml-icons'
import ReserveButton from '@/components/items/ReserveButton'
import type { ItemRow, WishlistData } from './types'

interface HDItemDetailProps {
  wishlist: WishlistData
  item: ItemRow
  isOwner: boolean
}

export const HDItemDetail = ({ wishlist, item, isOwner }: HDItemDetailProps) => (
  <HDShell active="lists" authed>
    <div style={{ padding: '24px 40px 60px', maxWidth: 760 }}>

      {/* Breadcrumb */}
      <Link
        href={`/wishlist/${wishlist.id}`}
        style={{
          fontSize: 13, color: 'var(--t-ink-3)', marginBottom: 24,
          display: 'inline-flex', alignItems: 'center', gap: 6,
          fontWeight: 600, textDecoration: 'none',
        }}
      >
        <TomlIcon name="arrow" size={12} style={{ transform: 'rotate(180deg)' }} />
        {wishlist.title}
      </Link>

      {/* Card */}
      <div className="card" style={{ overflow: 'hidden' }}>

        {/* Image */}
        <div
          className={`img img-${item.tone}`}
          style={{ height: 420, position: 'relative', overflow: 'hidden' }}
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
            <span className="sticker" style={{ position: 'absolute', top: 16, left: 16 }}>
              <TomlStars value={3} size={12} />
              <span style={{ marginLeft: 4 }}>top wishlist</span>
            </span>
          )}
          {item.status !== 'available' && (
            <span className="chip chip-mustard" style={{ position: 'absolute', top: 16, right: 16, fontSize: 12 }}>
              <span className="dot dot-reserved" style={{ marginRight: 4 }} />
              {item.status === 'purchased' ? 'Offert' : 'Réservé'}
            </span>
          )}
        </div>

        {/* Info */}
        <div style={{ padding: '28px 32px' }}>
          <div className="display-2" style={{ fontSize: 34, letterSpacing: '-0.02em', marginBottom: 10, lineHeight: 1.1 }}>
            {item.title}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
            <TomlStars value={item.stars} size={13} />
            <span style={{ fontSize: 13, color: 'var(--t-ink-3)', fontWeight: 600 }}>
              {item.stars === 1 ? 'Priorité basse' : item.stars === 2 ? 'Priorité moyenne' : 'Priorité haute'}
            </span>
          </div>

          {item.note && (
            <div style={{
              fontFamily: 'var(--t-font-display)', fontStyle: 'italic', fontWeight: 500,
              fontSize: 17, color: 'var(--t-ink-2)', marginBottom: 18, lineHeight: 1.4,
            }}>
              « {item.note} »
            </div>
          )}

          <div style={{ fontSize: 32, fontWeight: 800, letterSpacing: '-0.02em', marginBottom: 24 }}>
            {item.price != null ? `${item.price} €` : <span style={{ color: 'var(--t-ink-3)', fontSize: 18, fontWeight: 500 }}>Prix non renseigné</span>}
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
            {item.source_url && (
              <a
                href={item.source_url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline"
                style={{ textDecoration: 'none' }}
              >
                <TomlIcon name="arrow" size={13} />
                Voir sur le site
              </a>
            )}

            {!isOwner && item.status !== 'purchased' && (
              <ReserveButton
                itemId={item.id}
                wishlistId={wishlist.id}
                initialReserved={item.status === 'reserved'}
              />
            )}

            {isOwner && (
              <button className="btn btn-outline">
                <TomlIcon name="edit" size={13} />
                Modifier
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  </HDShell>
)
