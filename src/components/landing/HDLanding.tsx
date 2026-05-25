'use client'

import Link from 'next/link'
import { HDShell } from './shells'
import {
  TomlAvatar,
  TomlAvatarStack,
  TomlStars,
  TomlBookmarklet,
} from '@/components/toml-ds/toml-kit'
import { TomlIcon } from '@/components/toml-ds/toml-icons'

// ── Floating product card ─────────────────────────────────────────────────────

interface CardFloatProps {
  tilt: number
  top?: number | string
  left?: number | string
  right?: number | string
  bottom?: number | string
  width: number
  owner: string
  ownerTone: 1 | 2 | 3 | 4 | 5
  listName: string
  brand: string
  title: string
  price: number
  stars: number
  tone: 1 | 2 | 3 | 4 | 5 | 6
  reserved?: boolean
  by?: string
}

const CardFloat = ({
  tilt, top, left, right, bottom, width,
  owner, ownerTone, listName,
  brand, title, price, stars, tone,
  reserved, by,
}: CardFloatProps) => (
  <div className="card" style={{
    position: 'absolute', top, left, right, bottom,
    width, transform: `rotate(${tilt}deg)`,
    boxShadow: '6px 6px 0 var(--t-ink), 0 12px 30px rgba(26,31,46,0.18)',
  }}>
    <div style={{
      padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 10,
      borderBottom: '1px solid var(--t-line)',
    }}>
      <TomlAvatar initial={owner[0]} tone={ownerTone} size="sm" />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 12, fontWeight: 700 }}>{owner}</div>
        <div style={{ fontSize: 10, color: 'var(--t-ink-3)' }}>{listName}</div>
      </div>
      <TomlStars value={stars} size={9} />
    </div>
    <div className={`img img-${tone}`} style={{ height: 160, position: 'relative' }}>
      {reserved && (
        <span className="chip chip-mustard" style={{ position: 'absolute', top: 8, left: 8, fontSize: 10 }}>
          <span className="dot dot-reserved" style={{ marginRight: 4 }}></span>
          Réservé
        </span>
      )}
    </div>
    <div style={{ padding: '10px 14px' }}>
      <div className="label" style={{ color: 'var(--t-rose)', marginBottom: 2, fontSize: 9 }}>{brand}</div>
      <div className="display-2" style={{ fontSize: 14, marginBottom: 6 }}>{title}</div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontSize: 13, fontWeight: 700 }}>{price} €</div>
        {by && <span style={{ fontSize: 10, color: 'var(--t-ink-3)', fontWeight: 600 }}>par {by}</span>}
      </div>
    </div>
  </div>
)

// ── Desktop landing ───────────────────────────────────────────────────────────

export const HDLanding = () => (
  <HDShell active="" authed={false}>
    <div style={{
      display: 'grid', gridTemplateColumns: '1.05fr 1fr',
      minHeight: 'calc(100vh - 64px)', overflow: 'hidden',
    }}>
      {/* Left — copy */}
      <div style={{
        padding: '80px 72px',
        display: 'flex', flexDirection: 'column', justifyContent: 'center',
        position: 'relative',
        background:
          'radial-gradient(80% 60% at 0% 0%, var(--t-rose-soft) 0%, transparent 55%),' +
          'radial-gradient(70% 50% at 100% 100%, var(--t-mustard-soft) 0%, transparent 55%),' +
          'var(--t-bg)',
      }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
          <div className="label" style={{ color: 'var(--t-rose-d)' }}>Top On My List</div>
          <span style={{ width: 28, height: 1.5, background: 'var(--t-rose-d)' }}></span>
          <div className="label">Pour les familles &amp; les amis</div>
        </div>

        <h1 className="display" style={{
          fontSize: 84, lineHeight: 0.98, letterSpacing: '-0.03em', marginBottom: 28,
        }}>
          <div>Vos envies</div>
          <div style={{ color: 'var(--t-rose)', fontStyle: 'italic', fontWeight: 600 }}>Partagées</div>
          <div>Offertes</div>
        </h1>

        <p style={{
          fontSize: 18, color: 'var(--t-ink-2)', lineHeight: 1.5,
          maxWidth: 480, margin: '0 0 32px',
        }}>
          Une wishlist propre, jolie, partageable. Tu y mets ce qui te fait envie
          depuis n&apos;importe quel site, tes proches voient ce qui te ferait
          vraiment plaisir.
        </p>

        <div style={{ display: 'flex', gap: 12, marginBottom: 36 }}>
          <Link
            href="/auth/signup"
            className="btn btn-primary btn-stamp btn-lg"
            style={{ textDecoration: 'none' }}
          >
            Créer ma wishlist
          </Link>
          <Link
            href="/auth/login"
            className="btn btn-outline btn-lg"
            style={{ textDecoration: 'none' }}
          >
            Découvrir une liste
          </Link>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <TomlAvatarStack
            people={[
              { initial: 'L', tone: 1 },
              { initial: 'M', tone: 2 },
              { initial: 'A', tone: 3 },
              { initial: 'J', tone: 4 },
              { initial: 'S', tone: 5 },
            ]}
            max={5} size="sm"
          />
          <div style={{ fontSize: 14, color: 'var(--t-ink-2)' }}>
            <strong>+ 500 familles</strong> ont déjà rejoint Toml
          </div>
        </div>

        <span className="sticker" style={{
          position: 'absolute', bottom: 60, left: 72,
          background: 'var(--t-mustard)', fontSize: 14, padding: '4px 14px',
        }}>
          ★ 100% gratuit
        </span>
      </div>

      {/* Right — floating cards */}
      <div style={{
        position: 'relative',
        background:
          'linear-gradient(180deg, rgba(255,255,255,0.5) 0%, var(--t-paper) 50%, var(--t-paper) 100%)',
        borderLeft: '1.5px solid var(--t-ink)',
        overflow: 'hidden',
      }}>
        {/* Confetti décor */}
        <span style={{ position: 'absolute', top: '18%', left: '14%', width: 10, height: 10, borderRadius: 999, background: 'var(--t-rose)', boxShadow: '2px 2px 0 var(--t-ink)' }}></span>
        <span style={{ position: 'absolute', top: '74%', left: '12%', width: 8, height: 8, borderRadius: 2, background: 'var(--t-mustard)', border: '1.5px solid var(--t-ink)', transform: 'rotate(18deg)' }}></span>
        <span style={{ position: 'absolute', top: '46%', right: '10%', width: 12, height: 4, borderRadius: 999, background: 'var(--t-ink)', transform: 'rotate(-22deg)' }}></span>
        <span style={{ position: 'absolute', top: '88%', right: '24%', width: 6, height: 6, borderRadius: 999, background: 'var(--t-denim)' }}></span>

        <CardFloat
          tilt={-4} top={50} left={40} width={260}
          owner="Sophie" ownerTone={2} listName="Noël 2026 · 12 articles"
          brand="Sézane" title="Robe Liliana — taille S"
          price={89} stars={3} tone={1}
        />

        <CardFloat
          tilt={3} bottom={80} right={40} width={250}
          owner="Thomas" ownerTone={3} listName="Anniversaire · 28 mai"
          brand="Bialetti" title="Cafetière italienne"
          price={45} stars={2} tone={6} reserved by="Léa"
        />

        {/* Toast notification */}
        <div style={{
          position: 'absolute', top: '40%', left: '38%',
          transform: 'rotate(-2deg)',
          background: 'var(--t-paper)', border: '1.5px solid var(--t-ink)',
          borderRadius: 'var(--t-r-md)', padding: '10px 14px',
          boxShadow: 'var(--t-shadow-stamp)',
          display: 'flex', alignItems: 'center', gap: 10,
          fontSize: 13,
        }}>
          <span style={{
            width: 26, height: 26, borderRadius: 999,
            background: 'var(--t-rose)', color: 'var(--t-paper)',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <TomlIcon name="heart" size={14} />
          </span>
          <span>
            <strong>Léa</strong>
            <span style={{ color: 'var(--t-ink-2)' }}> a aimé ton article</span>
          </span>
        </div>

        {/* Bookmarklet pinned */}
        <div style={{ position: 'absolute', top: 30, right: 30, transform: 'rotate(2deg)' }}>
          <TomlBookmarklet />
        </div>
      </div>
    </div>
  </HDShell>
)
