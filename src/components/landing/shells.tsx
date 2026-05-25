'use client'

import Link from 'next/link'
import type { ReactNode } from 'react'
import { TomlIcon } from '@/components/toml-ds/toml-icons'

// ── Logo wordmark ─────────────────────────────────────────────────────────────

export const HMLogo = ({ size = 18 }: { size?: number }) => (
  <span style={{
    fontFamily: 'var(--t-font-display)',
    fontWeight: 700,
    fontSize: size,
    letterSpacing: '0.02em',
    color: 'var(--t-ink)',
  }}>
    TOML
  </span>
)

// ── Desktop top nav ───────────────────────────────────────────────────────────

const NAV_LINKS = [
  { id: 'feed',     label: 'Feed',        href: '/dashboard' },
  { id: 'lists',   label: 'Mes listes',  href: '/dashboard' },
  { id: 'friends', label: 'Amis',        href: '/friends' },
  { id: 'discover',label: 'Découvrir',   href: '/discover' },
]

interface HDTopNavProps {
  active?: string
  authed?: boolean
}

export const HDTopNav = ({ active = '', authed = false }: HDTopNavProps) => (
  <div style={{
    height: 64,
    padding: '0 32px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 20,
    background: 'var(--t-paper)',
    borderBottom: '1.5px solid var(--t-ink)',
    flexShrink: 0,
  }}>
    {/* Left : logo + nav */}
    <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
      <Link href="/" style={{ textDecoration: 'none' }}>
        <HMLogo size={22} />
      </Link>
      {authed && (
        <nav style={{ display: 'flex', gap: 4 }}>
          {NAV_LINKS.map(l => {
            const isActive = l.id === active
            return (
              <Link
                key={l.id}
                href={l.href}
                style={{
                  padding: '8px 14px',
                  borderRadius: 999,
                  fontFamily: 'var(--t-font-ui)',
                  fontSize: 14,
                  fontWeight: isActive ? 700 : 500,
                  color: isActive ? 'var(--t-ink)' : 'var(--t-ink-2)',
                  textDecoration: 'none',
                }}
              >
                {l.label}
              </Link>
            )
          })}
        </nav>
      )}
    </div>

    {/* Right : actions */}
    {authed ? (
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ position: 'relative', width: 280 }}>
          <TomlIcon
            name="search"
            size={15}
            style={{
              position: 'absolute', left: 14, top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--t-ink-3)', pointerEvents: 'none',
            }}
          />
          <input
            className="input input-soft"
            placeholder="Rechercher amis, articles…"
            style={{ paddingLeft: 38, fontSize: 13, height: 38 }}
          />
        </div>
        <Link
          href="/add"
          className="btn btn-primary btn-stamp btn-sm"
          style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6 }}
        >
          <TomlIcon name="plus" size={14} />
          Ajouter
        </Link>
      </div>
    ) : (
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <Link
          href="/auth/login"
          className="btn btn-ghost btn-sm"
          style={{ textDecoration: 'none', background: 'transparent' }}
        >
          Se connecter
        </Link>
        <Link
          href="/auth/signup"
          className="btn btn-primary btn-stamp btn-sm"
          style={{ textDecoration: 'none' }}
        >
          Créer ma wishlist
        </Link>
      </div>
    )}
  </div>
)

// ── Desktop shell ─────────────────────────────────────────────────────────────

interface HDShellProps {
  children: ReactNode
  active?: string
  authed?: boolean
}

export const HDShell = ({ children, active = '', authed = false }: HDShellProps) => (
  <div style={{
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    background: 'var(--t-bg)',
  }}>
    <HDTopNav active={active} authed={authed} />
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      {children}
    </div>
  </div>
)

// ── Mobile top bar ────────────────────────────────────────────────────────────

interface HMTopBarProps {
  left?: ReactNode
  right?: ReactNode
  title?: string
  back?: boolean
  transparent?: boolean
}

export const HMTopBar = ({ left, right, title, back = false, transparent = false }: HMTopBarProps) => (
  <div style={{
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '12px 18px 14px',
    background: transparent ? 'transparent' : 'var(--t-bg)',
    borderBottom: transparent ? 'none' : '1px solid var(--t-line-soft)',
    gap: 12,
    minHeight: 56,
  }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0, flex: 1 }}>
      {back && (
        <button
          className="btn btn-ghost"
          style={{ width: 36, height: 36, padding: 0, borderRadius: 999, background: 'var(--t-paper)', border: '1px solid var(--t-line)' }}
        >
          <TomlIcon name="arrow" size={16} style={{ transform: 'rotate(180deg)' }} />
        </button>
      )}
      {left ?? (title
        ? <div style={{ fontFamily: 'var(--t-font-display)', fontWeight: 700, fontSize: 17, letterSpacing: '-0.01em' }}>{title}</div>
        : <HMLogo size={20} />
      )}
    </div>
    <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexShrink: 0 }}>
      {right}
    </div>
  </div>
)

// ── Mobile shell (adapted for real web, no phone frame) ───────────────────────

interface HMShellProps {
  children: ReactNode
  withTabBar?: boolean
  bg?: string
}

export const HMShell = ({ children, bg }: HMShellProps) => (
  <div style={{
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    background: bg ?? 'var(--t-bg)',
  }}>
    {children}
  </div>
)
