'use client'

import { useRouter } from 'next/navigation'
import { HMShell, HMTopBar } from '@/components/landing/shells'
import { TomlStars } from '@/components/toml-ds/toml-kit'
import { TomlIcon } from '@/components/toml-ds/toml-icons'
import ReserveButton from '@/components/items/ReserveButton'
import type { ItemRow, WishlistData } from './types'

interface HMItemDetailProps {
  wishlist: WishlistData
  item: ItemRow
  isOwner: boolean
}

export const HMItemDetail = ({ wishlist, item, isOwner }: HMItemDetailProps) => {
  const router = useRouter()

  return (
  <HMShell>
    <HMTopBar
      title={item.title}
      left={
        <button
          className="btn btn-ghost"
          onClick={() => router.back()}
          style={{ width: 36, height: 36, padding: 0, borderRadius: 999, background: 'var(--t-paper)', border: '1px solid var(--t-line)' }}
        >
          <TomlIcon name="arrow" size={16} style={{ transform: 'rotate(180deg)' }} />
        </button>
      }
    />

    {/* Image */}
    <div
      className={`img img-${item.tone}`}
      style={{ height: 300, position: 'relative', overflow: 'hidden' }}
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
        <span className="sticker" style={{ position: 'absolute', top: 14, left: 14 }}>
          <TomlStars value={3} size={11} />
          <span style={{ marginLeft: 4 }}>top wishlist</span>
        </span>
      )}
      {item.status !== 'available' && (
        <span className="chip chip-mustard" style={{ position: 'absolute', top: 14, right: 14, fontSize: 10 }}>
          <span className="dot dot-reserved" style={{ marginRight: 4 }} />
          {item.status === 'purchased' ? 'Offert' : 'Réservé'}
        </span>
      )}
    </div>

    {/* Info */}
    <div style={{ padding: '20px 18px 32px' }}>
      <div className="label" style={{ marginBottom: 6 }}>
        {wishlist.title}
      </div>

      <div className="display-2" style={{ fontSize: 24, letterSpacing: '-0.02em', marginBottom: 8, lineHeight: 1.15 }}>
        {item.title}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
        <TomlStars value={item.stars} size={11} />
        <span style={{ fontSize: 12, color: 'var(--t-ink-3)', fontWeight: 600 }}>
          {item.stars === 1 ? 'Priorité basse' : item.stars === 2 ? 'Priorité moyenne' : 'Priorité haute'}
        </span>
      </div>

      {item.note && (
        <div style={{
          fontFamily: 'var(--t-font-display)', fontStyle: 'italic', fontWeight: 500,
          fontSize: 15, color: 'var(--t-ink-2)', marginBottom: 14, lineHeight: 1.4,
        }}>
          « {item.note} »
        </div>
      )}

      <div style={{ fontSize: 26, fontWeight: 800, letterSpacing: '-0.02em', marginBottom: 20 }}>
        {item.price != null
          ? `${item.price} €`
          : <span style={{ color: 'var(--t-ink-3)', fontSize: 15, fontWeight: 500 }}>Prix non renseigné</span>
        }
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {item.source_url && (
          <a
            href={item.source_url}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-outline"
            style={{ textDecoration: 'none', justifyContent: 'center' }}
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
          <button className="btn btn-outline" style={{ width: '100%', justifyContent: 'center' }}>
            <TomlIcon name="edit" size={13} />
            Modifier
          </button>
        )}
      </div>
    </div>
  </HMShell>
  )
}
