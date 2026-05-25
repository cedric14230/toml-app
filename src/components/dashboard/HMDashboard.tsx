'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { HMShell, HMTopBar } from '@/components/landing/shells'
import { TomlAvatar } from '@/components/toml-ds/toml-kit'
import { TomlIcon } from '@/components/toml-ds/toml-icons'
import CreateWishlistModal from '@/components/wishlists/CreateWishlistModal'
import type { WishlistRow } from './types'

// ── Visibility helpers ────────────────────────────────────────────────────────

const VIS = {
  private: { label: 'Privée',   icon: 'lock' },
  friends: { label: 'Amis',     icon: 'friends' },
  public:  { label: 'Publique', icon: 'eye' },
} as const

// ── WhatsApp glyph ────────────────────────────────────────────────────────────

const WhatsAppGlyph = ({ size = 22, color = '#fff' }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <path d="M17.5 14.4c-.3-.1-1.6-.8-1.9-.9-.3-.1-.5-.1-.7.1-.2.3-.8.9-1 1.1-.2.2-.4.2-.7.1-.3-.2-1.2-.5-2.3-1.4-.8-.8-1.4-1.7-1.6-2-.2-.3 0-.5.1-.6.1-.1.3-.4.4-.5.1-.2.2-.3.3-.5.1-.2 0-.4 0-.5 0-.1-.7-1.7-1-2.3-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4s-1 1-1 2.5.7 2.8.7 3c.1.2 1.5 2.4 3.7 3.4.5.2.9.3 1.2.4.5.2 1 .1 1.4.1.4-.1 1.3-.5 1.5-1 .2-.6.2-1 .1-1.1-.1-.2-.3-.3-.6-.4zM12 2C6.5 2 2 6.5 2 12c0 1.7.5 3.4 1.3 4.8L2 22l5.3-1.4c1.4.8 3 1.2 4.7 1.2 5.5 0 10-4.5 10-10S17.5 2 12 2zm0 18c-1.5 0-3-.4-4.3-1.1l-.3-.2-3.1.8.8-3-.2-.3C4.4 15 4 13.5 4 12c0-4.4 3.6-8 8-8s8 3.6 8 8-3.6 8-8 8z" />
  </svg>
)

// ── WhatsApp onboarding card ──────────────────────────────────────────────────

interface WhatsAppCardProps {
  onDismiss: () => void
  onConnect: () => void
  connecting: boolean
}

const WhatsAppCard = ({ onDismiss, onConnect, connecting }: WhatsAppCardProps) => (
  <div className="card" style={{
    margin: '14px 18px 4px', padding: 14,
    display: 'flex', gap: 12, alignItems: 'flex-start',
    position: 'relative',
  }}>
    <div style={{
      width: 44, height: 44, borderRadius: 999,
      background: '#25D366', border: '1.5px solid var(--t-ink)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      flexShrink: 0,
    }}>
      <WhatsAppGlyph size={22} />
    </div>

    <div style={{ flex: 1, minWidth: 0, paddingRight: 12 }}>
      <div style={{
        fontFamily: 'var(--t-font-display)', fontWeight: 700,
        fontSize: 15, marginBottom: 3, letterSpacing: '-0.01em', lineHeight: 1.2,
      }}>
        Ajoute en 2 secondes{' '}
        <span style={{ background: '#f5c948', padding: '0 4px', borderRadius: 4, fontStyle: 'italic', fontWeight: 600 }}>
          via WhatsApp
        </span>
      </div>
      <div style={{
        fontFamily: 'var(--t-font-ui)', fontWeight: 500,
        fontSize: 12.5, color: 'var(--t-ink-2)', lineHeight: 1.4, marginBottom: 10,
      }}>
        Envoie un lien produit à Toml sur WhatsApp → il apparaît direct dans ta wishlist.
      </div>
      <button
        onClick={onConnect}
        disabled={connecting}
        className="btn btn-stamp btn-sm"
        style={{ background: '#25D366', color: '#fff', borderColor: 'var(--t-ink)', opacity: connecting ? 0.7 : 1 }}
      >
        <WhatsAppGlyph size={14} color="#fff" />
        {connecting ? 'Ouverture…' : 'Connecter WhatsApp'}
      </button>
    </div>

    <button
      onClick={onDismiss}
      aria-label="Masquer"
      style={{
        position: 'absolute', top: 8, right: 10,
        width: 28, height: 28, borderRadius: 999,
        background: 'transparent', border: 'none',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: 'var(--t-ink-3)', cursor: 'pointer', padding: 0,
      }}
    >
      <TomlIcon name="x" size={16} />
    </button>
  </div>
)

// ── Mobile dashboard ──────────────────────────────────────────────────────────

interface HMDashboardProps {
  wishlists: WishlistRow[]
  firstName: string
  phoneVerified: boolean
}

export const HMDashboard = ({ wishlists, firstName, phoneVerified }: HMDashboardProps) => {
  const router = useRouter()
  const [waVisible, setWaVisible]       = useState(!phoneVerified)
  const [waConnecting, setWaConnecting] = useState(false)
  const [createOpen, setCreateOpen]     = useState(false)
  const initial = firstName.charAt(0).toUpperCase()

  async function handleConnectWhatsApp() {
    setWaConnecting(true)
    try {
      const res = await fetch('/api/whatsapp/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      })
      const data = await res.json()
      if (res.ok) {
        window.open(data.waUrl, '_blank')
      }
    } finally {
      setWaConnecting(false)
    }
  }

  return (
    <HMShell>
      <HMTopBar
        showBurger
        right={
          <>
            <button className="btn btn-ghost" style={{
              width: 38, height: 38, padding: 0, borderRadius: 999,
              background: 'var(--t-paper)', border: '1px solid var(--t-line)',
            }}>
              <TomlIcon name="bell" size={18} />
            </button>
            <TomlAvatar initial={initial} tone={1} size="sm" />
          </>
        }
      />

      {waVisible && (
        <WhatsAppCard
          onDismiss={() => setWaVisible(false)}
          onConnect={handleConnectWhatsApp}
          connecting={waConnecting}
        />
      )}

      {/* Header */}
      <div style={{
        padding: '20px 18px 14px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end',
      }}>
        <div>
          <div className="label" style={{ marginBottom: 4 }}>Tableau de bord</div>
          <h1 className="display-2" style={{ fontSize: 28 }}>Mes wishlists</h1>
        </div>
        <button
          onClick={() => setCreateOpen(true)}
          className="btn btn-primary btn-stamp btn-sm"
        >
          <TomlIcon name="plus" size={14} />
          Créer
        </button>
      </div>

      {/* Wishlist cards */}
      <div style={{ padding: '0 18px 24px', display: 'flex', flexDirection: 'column', gap: 14 }}>
        {wishlists.map(w => {
          const { label, icon } = VIS[w.visibility]
          return (
            <Link key={w.id} href={`/wishlist/${w.id}`} style={{ textDecoration: 'none' }}>
              <div className="card">
                <div className={`img img-${w.tone}`} style={{ height: 130, position: 'relative' }}>
                  <span className="chip" style={{
                    position: 'absolute', top: 10, right: 10,
                    background: 'rgba(255,255,255,0.92)',
                    backdropFilter: 'blur(4px)',
                    fontSize: 11,
                  }}>
                    <TomlIcon name={icon} size={11} />
                    {label}
                  </span>
                </div>
                <div style={{ padding: '14px 16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
                    <div className="display-2" style={{ fontSize: 18 }}>{w.title}</div>
                    <div style={{ fontSize: 13, color: 'var(--t-ink-2)', fontWeight: 600, flexShrink: 0, marginLeft: 8 }}>
                      {w.item_count} article{w.item_count !== 1 ? 's' : ''}
                    </div>
                  </div>
                  {w.latest && (
                    <div style={{ fontSize: 12, color: 'var(--t-rose)', fontWeight: 600 }}>
                      {w.latest}
                    </div>
                  )}
                </div>
              </div>
            </Link>
          )
        })}

        {/* Dashed create card */}
        <button
          onClick={() => setCreateOpen(true)}
          style={{
            width: '100%',
            background: 'transparent',
            border: '1.5px dashed var(--t-ink-3)',
            borderRadius: 'var(--t-r-lg)',
            padding: '22px 16px',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            color: 'var(--t-ink-2)', cursor: 'pointer',
            fontFamily: 'var(--t-font-ui)', fontWeight: 600, fontSize: 14,
          }}
        >
          <TomlIcon name="plus" size={18} />
          Créer une nouvelle wishlist
        </button>
      </div>

      {createOpen && (
        <CreateWishlistModal
          onClose={() => setCreateOpen(false)}
          onSuccess={id => router.push(`/wishlist/${id}`)}
        />
      )}
    </HMShell>
  )
}
