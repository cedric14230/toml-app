'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { ReactNode } from 'react'
import { TomlIcon } from '@/components/toml-ds/toml-icons'
import { createSupabaseBrowserClient } from '@/lib/supabase/client'

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

// ── Nav config ────────────────────────────────────────────────────────────────

const NAV_ITEMS = [
  { id: 'lists',   label: 'Dashboard', href: '/dashboard' },
  { id: 'feed',    label: 'Feed',      href: '/feed' },
  { id: 'friends', label: 'Amis',      href: '/friends' },
]

function getActiveId(pathname: string): string {
  if (pathname.startsWith('/feed'))    return 'feed'
  if (pathname.startsWith('/friends')) return 'friends'
  if (pathname.startsWith('/profile')) return 'profile'
  return 'lists' // /dashboard, /wishlist/*, etc.
}

// ── Profile link — userId résolu côté client ──────────────────────────────────

const NavProfileLink = ({
  mobile = false,
  onClick,
}: {
  mobile?: boolean
  onClick?: () => void
}) => {
  const [userId, setUserId] = useState<string | null>(null)
  const pathname = usePathname()
  const isActive = pathname.startsWith('/profile')

  useEffect(() => {
    createSupabaseBrowserClient()
      .auth.getUser()
      .then(({ data: { user } }) => setUserId(user?.id ?? null))
  }, [])

  const href = userId ? `/profile/${userId}` : '#'

  if (mobile) {
    return (
      <Link
        href={href}
        onClick={onClick}
        style={{
          display: 'block', padding: '12px 14px', borderRadius: 10,
          fontFamily: 'var(--t-font-ui)', fontSize: 15,
          fontWeight: isActive ? 700 : 500,
          color: isActive ? 'var(--t-bg)' : 'var(--t-ink)',
          background: isActive ? 'var(--t-ink)' : 'transparent',
          textDecoration: 'none',
        }}
      >
        Profil
      </Link>
    )
  }

  return (
    <Link
      href={href}
      style={{
        padding: '8px 14px', borderRadius: 999,
        fontFamily: 'var(--t-font-ui)', fontSize: 14,
        fontWeight: isActive ? 700 : 500,
        color: isActive ? 'var(--t-ink)' : 'var(--t-ink-2)',
        background: isActive ? 'var(--t-bg-2)' : 'transparent',
        textDecoration: 'none',
      }}
    >
      Profil
    </Link>
  )
}

// ── Mobile drawer ─────────────────────────────────────────────────────────────

const MobileDrawer = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
  const pathname = usePathname()
  const activeId = getActiveId(pathname)

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0,
          background: 'rgba(0,0,0,0.45)',
          opacity: open ? 1 : 0,
          pointerEvents: open ? 'auto' : 'none',
          transition: 'opacity 0.22s ease',
          zIndex: 1000,
        }}
      />

      {/* Panel */}
      <div style={{
        position: 'fixed', left: 0, top: 0, bottom: 0, width: 280,
        background: 'var(--t-bg)',
        borderRight: '1.5px solid var(--t-ink)',
        boxShadow: '4px 0 24px rgba(0,0,0,0.12)',
        transform: open ? 'translateX(0)' : 'translateX(-100%)',
        transition: 'transform 0.25s ease',
        zIndex: 1001,
        display: 'flex', flexDirection: 'column',
      }}>
        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '20px 20px 18px',
          borderBottom: '1px solid var(--t-line-soft)',
        }}>
          <HMLogo size={20} />
          <button
            onClick={onClose}
            className="btn btn-ghost"
            style={{ width: 32, height: 32, padding: 0, borderRadius: 999, background: 'transparent' }}
          >
            <TomlIcon name="x" size={16} />
          </button>
        </div>

        {/* Nav links */}
        <nav style={{ padding: '14px 12px', flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
          {NAV_ITEMS.map(item => {
            const isActive = item.id === activeId
            return (
              <Link
                key={item.id}
                href={item.href}
                onClick={onClose}
                style={{
                  display: 'block', padding: '12px 14px', borderRadius: 10,
                  fontFamily: 'var(--t-font-ui)', fontSize: 15,
                  fontWeight: isActive ? 700 : 500,
                  color: isActive ? 'var(--t-bg)' : 'var(--t-ink)',
                  background: isActive ? 'var(--t-ink)' : 'transparent',
                  textDecoration: 'none',
                }}
              >
                {item.label}
              </Link>
            )
          })}
          <NavProfileLink mobile onClick={onClose} />
        </nav>
      </div>
    </>
  )
}

// ── Desktop top nav ───────────────────────────────────────────────────────────

interface HDTopNavProps {
  authed?: boolean
}

export const HDTopNav = ({ authed = false }: HDTopNavProps) => {
  const pathname = usePathname()
  const activeId = getActiveId(pathname)

  return (
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
        <Link href="/dashboard" style={{ textDecoration: 'none' }}>
          <HMLogo size={22} />
        </Link>
        {authed && (
          <nav style={{ display: 'flex', gap: 4 }}>
            {NAV_ITEMS.map(l => {
              const isActive = l.id === activeId
              return (
                <Link
                  key={l.id}
                  href={l.href}
                  style={{
                    padding: '8px 14px', borderRadius: 999,
                    fontFamily: 'var(--t-font-ui)', fontSize: 14,
                    fontWeight: isActive ? 700 : 500,
                    color: isActive ? 'var(--t-ink)' : 'var(--t-ink-2)',
                    background: isActive ? 'var(--t-bg-2)' : 'transparent',
                    textDecoration: 'none',
                  }}
                >
                  {l.label}
                </Link>
              )
            })}
            <NavProfileLink />
          </nav>
        )}
      </div>

      {/* Right : actions */}
      {authed ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ position: 'relative', width: 280 }}>
            <TomlIcon
              name="search" size={15}
              style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--t-ink-3)', pointerEvents: 'none' }}
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
          <Link href="/auth/login" className="btn btn-ghost btn-sm" style={{ textDecoration: 'none', background: 'transparent' }}>
            Se connecter
          </Link>
          <Link href="/auth/signup" className="btn btn-primary btn-stamp btn-sm" style={{ textDecoration: 'none' }}>
            Créer ma wishlist
          </Link>
        </div>
      )}
    </div>
  )
}

// ── Desktop shell ─────────────────────────────────────────────────────────────

interface HDShellProps {
  children:  ReactNode
  active?:   string   // conservé pour rétrocompatibilité, remplacé par usePathname
  authed?:   boolean
}

export const HDShell = ({ children, authed = false }: HDShellProps) => (
  <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--t-bg)' }}>
    <HDTopNav authed={authed} />
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      {children}
    </div>
  </div>
)

// ── Mobile top bar ────────────────────────────────────────────────────────────

interface HMTopBarProps {
  left?:        ReactNode
  right?:       ReactNode
  title?:       string
  back?:        boolean       // legacy — préférer left={<button onClick={router.back()}>}
  transparent?: boolean
  showBurger?:  boolean       // affiche le bouton burger (☰) ouvrant le drawer de navigation
}

export const HMTopBar = ({
  left, right, title, back = false, transparent = false, showBurger = false,
}: HMTopBarProps) => {
  const [drawerOpen, setDrawerOpen] = useState(false)

  // Le slot gauche : left prop > legacy back > rien
  const leftSlot = left ?? (back
    ? (
      <button className="btn btn-ghost" style={{
        width: 36, height: 36, padding: 0, borderRadius: 999,
        background: 'var(--t-paper)', border: '1px solid var(--t-line)',
      }}>
        <TomlIcon name="arrow" size={16} style={{ transform: 'rotate(180deg)' }} />
      </button>
    )
    : null)

  // Logo affiché quand aucun contenu n'occupe la zone gauche
  const showLogo = !leftSlot && !title

  return (
    <>
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '12px 18px 14px',
        background: transparent ? 'transparent' : 'var(--t-bg)',
        borderBottom: transparent ? 'none' : '1px solid var(--t-line-soft)',
        gap: 12, minHeight: 56,
      }}>
        {/* Left section */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0, flex: 1 }}>
          {showBurger && (
            <button
              className="btn btn-ghost"
              onClick={() => setDrawerOpen(true)}
              aria-label="Menu de navigation"
              style={{
                width: 36, height: 36, padding: 0, borderRadius: 999, flexShrink: 0,
                background: 'var(--t-paper)', border: '1px solid var(--t-line)',
              }}
            >
              <TomlIcon name="menu" size={16} />
            </button>
          )}
          {leftSlot}
          {title && (
            <div style={{ fontFamily: 'var(--t-font-display)', fontWeight: 700, fontSize: 17, letterSpacing: '-0.01em', minWidth: 0 }}>
              {title}
            </div>
          )}
          {showLogo && !showBurger && <HMLogo size={20} />}
        </div>

        {/* Right section */}
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexShrink: 0 }}>
          {right}
        </div>
      </div>

      <MobileDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </>
  )
}

// ── Mobile shell ──────────────────────────────────────────────────────────────

interface HMShellProps {
  children:    ReactNode
  withTabBar?: boolean
  bg?:         string
}

export const HMShell = ({ children, bg }: HMShellProps) => (
  <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: bg ?? 'var(--t-bg)' }}>
    {children}
  </div>
)
