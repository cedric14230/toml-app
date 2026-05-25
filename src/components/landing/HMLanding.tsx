'use client'

import Link from 'next/link'
import { HMShell, HMTopBar, HMLogo } from './shells'
import { TomlAvatar, TomlAvatarStack } from '@/components/toml-ds/toml-kit'

// ── Landing background ────────────────────────────────────────────────────────

const PALETTE = ['#e6ecf2', '#ecd0d4', '#f0dca8', '#f0e4d8']

const landingBg =
  `radial-gradient(110% 70% at 8% 0%, ${PALETTE[1]} 0%, transparent 55%),` +
  `radial-gradient(120% 80% at 100% 22%, ${PALETTE[2]} 0%, transparent 50%),` +
  `radial-gradient(90% 60% at 50% 100%, ${PALETTE[3]} 0%, transparent 60%),` +
  PALETTE[0]

// ── Mobile landing ────────────────────────────────────────────────────────────

export const HMLanding = () => (
  <HMShell bg={landingBg}>
    {/* Top bar */}
    <HMTopBar
      transparent
      left={<HMLogo size={20} />}
      right={
        <Link
          href="/auth/login"
          className="btn btn-outline btn-sm"
          style={{ textDecoration: 'none' }}
        >
          Se connecter
        </Link>
      }
    />

    {/* Hero */}
    <div style={{ padding: '20px 24px 24px', position: 'relative' }}>
      <div className="label" style={{ marginBottom: 14, color: 'var(--t-rose-d)' }}>
        Top On My List
      </div>
      <h1 className="display" style={{ fontSize: 48, lineHeight: 1, marginBottom: 18 }}>
        <div>Vos envies</div>
        <div style={{ color: 'var(--t-rose)', fontStyle: 'italic', fontWeight: 600 }}>Partagées</div>
        <div>Offertes</div>
      </h1>
      <p style={{
        fontFamily: 'var(--t-font-ui)', fontWeight: 500,
        fontSize: 14.5, lineHeight: 1.5,
        color: 'var(--t-ink-2)', margin: '0 0 24px',
      }}>
        Créez votre wishlist depuis n&apos;importe quel site, partagez-la en un lien,
        et laissez vos proches vous offrir exactement ce qui vous fait envie.
      </p>

      {/* CTAs */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 22 }}>
        <Link
          href="/auth/signup"
          className="btn btn-primary btn-stamp btn-lg"
          style={{ width: '100%', textDecoration: 'none' }}
        >
          Créer ma wishlist
        </Link>
        <Link
          href="/auth/login"
          className="btn btn-outline btn-lg"
          style={{ width: '100%', textDecoration: 'none' }}
        >
          Découvrir une wishlist
        </Link>
      </div>

      {/* Social proof */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, justifyContent: 'center' }}>
        <TomlAvatarStack
          people={[
            { initial: 'L', tone: 2 },
            { initial: 'M', tone: 4 },
            { initial: 'A', tone: 1 },
            { initial: 'J', tone: 3 },
          ]}
          max={4} size="xs"
        />
        <div style={{ fontSize: 13, color: 'var(--t-ink-2)', fontWeight: 500 }}>
          + 500 familles nous ont rejoint
        </div>
      </div>
    </div>

    {/* Tilted cards band */}
    <div style={{
      position: 'relative',
      background:
        'linear-gradient(180deg, rgba(255,255,255,0.55) 0%, var(--t-paper) 35%, var(--t-paper) 100%)',
      borderBottom: '1.5px solid var(--t-ink)',
      padding: '36px 0 40px',
      minHeight: 320,
      overflow: 'hidden',
    }}>
      {/* Floating sticker */}
      <span className="sticker" style={{
        position: 'absolute', top: 18, left: '50%',
        transform: 'translateX(-50%) rotate(-3deg)',
        zIndex: 5,
      }}>
        nouvelle wishlist
      </span>

      {/* Card 1 — Sophie · Noël (tilted left) */}
      <div className="card" style={{
        position: 'absolute', top: 64, left: 22, width: 220,
        transform: 'rotate(-3deg)', zIndex: 1,
      }}>
        <div className="img img-1" style={{ height: 120 }}></div>
        <div style={{ padding: '12px 14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <TomlAvatar initial="S" tone={4} size="xs" />
            <div>
              <div style={{ fontSize: 12, fontWeight: 700 }}>Sophie</div>
              <div className="label" style={{ fontSize: 9, marginTop: 1 }}>Noël 2026</div>
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontSize: 11, color: 'var(--t-ink-2)', fontWeight: 600 }}>12 articles</div>
            <span className="chip chip-rose" style={{ fontSize: 10, padding: '2px 8px' }}>Amis</span>
          </div>
        </div>
      </div>

      {/* Card 2 — Thomas · Anniv (tilted right) */}
      <div className="card" style={{
        position: 'absolute', bottom: 24, right: 18, width: 210,
        transform: 'rotate(2.5deg)', zIndex: 2,
      }}>
        <div className="img img-2" style={{ height: 110 }}></div>
        <div style={{ padding: '12px 14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <TomlAvatar initial="T" tone={2} size="xs" />
            <div>
              <div style={{ fontSize: 12, fontWeight: 700 }}>Thomas</div>
              <div className="label" style={{ fontSize: 9, marginTop: 1 }}>Anniversaire</div>
            </div>
          </div>
          <span className="chip chip-mustard" style={{ fontSize: 10, padding: '2px 8px' }}>
            <span className="dot dot-reserved" style={{ marginRight: 4 }}></span>
            3 réservés
          </span>
        </div>
      </div>
    </div>

    {/* Footer */}
    <div style={{ padding: '20px 24px 32px', textAlign: 'center' }}>
      <div className="label" style={{ marginBottom: 6 }}>Comment ça marche</div>
      <div style={{
        fontFamily: 'var(--t-font-display)', fontWeight: 600,
        fontSize: 16, color: 'var(--t-ink-2)', letterSpacing: '-0.01em',
      }}>
        Capture · Partage · Offre
      </div>
    </div>
  </HMShell>
)
