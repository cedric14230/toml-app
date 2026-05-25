'use client'

import { useState } from 'react'
import Link from 'next/link'
import { HDShell } from '@/components/landing/shells'
import { TomlBookmarklet } from '@/components/toml-ds/toml-kit'
import { TomlIcon } from '@/components/toml-ds/toml-icons'
import type { WishlistRow } from './types'

type Filter = 'all' | 'public' | 'friends' | 'private' | 'archived'

// ── Visibility helpers ────────────────────────────────────────────────────────

const VIS = {
  private: { label: 'Privée',   icon: 'lock' },
  friends: { label: 'Amis',     icon: 'friends' },
  public:  { label: 'Publique', icon: 'eye' },
} as const

// ── Dashboard card ────────────────────────────────────────────────────────────

const DashboardCard = ({ w }: { w: WishlistRow }) => {
  const { label, icon } = VIS[w.visibility]
  return (
    <Link href={`/wishlist/${w.id}`} style={{ textDecoration: 'none' }}>
      <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
        <div className={`img img-${w.tone}`} style={{ height: 180, position: 'relative' }}>
          <span className="chip" style={{
            position: 'absolute', top: 12, right: 12,
            background: 'rgba(255,255,255,0.92)',
            backdropFilter: 'blur(4px)',
            fontSize: 11,
          }}>
            <TomlIcon name={icon} size={11} />
            {label}
          </span>
          <button className="btn btn-ghost" style={{
            position: 'absolute', top: 10, left: 10,
            width: 32, height: 32, padding: 0, borderRadius: 999,
            background: 'rgba(255,255,255,0.92)',
            backdropFilter: 'blur(4px)',
            border: '1px solid var(--t-line)',
          }}>
            <TomlIcon name="menu" size={14} />
          </button>
        </div>
        <div style={{ padding: 18, display: 'flex', flexDirection: 'column', gap: 8, flex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
            <div className="display-2" style={{ fontSize: 20 }}>{w.title}</div>
            <div style={{ fontSize: 13, color: 'var(--t-ink-2)', fontWeight: 700, flexShrink: 0 }}>
              {w.item_count} article{w.item_count !== 1 ? 's' : ''}
            </div>
          </div>
          {w.description && (
            <div style={{
              fontFamily: 'var(--t-font-display)', fontStyle: 'italic',
              fontWeight: 500, fontSize: 13, color: 'var(--t-ink-2)',
            }}>
              « {w.description} »
            </div>
          )}
          <div style={{ flex: 1 }} />
          {w.latest && (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontSize: 12, color: 'var(--t-rose)', fontWeight: 700 }}>{w.latest}</div>
              <button className="btn btn-outline btn-sm" style={{ padding: '4px 10px', fontSize: 11 }}>
                Ouvrir
                <TomlIcon name="arrow" size={11} />
              </button>
            </div>
          )}
        </div>
      </div>
    </Link>
  )
}

// ── Desktop dashboard ─────────────────────────────────────────────────────────

interface HDDashboardProps {
  wishlists: WishlistRow[]
  firstName: string
}

export const HDDashboard = ({ wishlists, firstName }: HDDashboardProps) => {
  const [activeFilter, setActiveFilter] = useState<Filter>('all')

  const counts = {
    all:     wishlists.length,
    public:  wishlists.filter(w => w.visibility === 'public').length,
    friends: wishlists.filter(w => w.visibility === 'friends').length,
    private: wishlists.filter(w => w.visibility === 'private').length,
  }

  const displayed = activeFilter === 'all' || activeFilter === 'archived'
    ? wishlists
    : wishlists.filter(w => w.visibility === activeFilter)

  return (
    <HDShell active="lists" authed>
      <div style={{ padding: '32px 40px 60px' }}>
        {/* Header */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end',
          gap: 24, marginBottom: 28, flexWrap: 'wrap',
        }}>
          <div>
            <div className="label" style={{ marginBottom: 6 }}>
              Bonjour {firstName} <span style={{ color: 'var(--t-rose)' }}>✦</span>
            </div>
            <h1 className="display-2" style={{ fontSize: 40, letterSpacing: '-0.02em' }}>
              Mes <span style={{ color: 'var(--t-rose)', fontStyle: 'italic', fontWeight: 600 }}>wishlists</span>
            </h1>
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
            {([
              { key: 'all',     label: `Toutes (${counts.all})` },
              ...(counts.public  > 0 ? [{ key: 'public',  label: `Publiques (${counts.public})` }]  : []),
              ...(counts.friends > 0 ? [{ key: 'friends', label: `Amis (${counts.friends})` }]       : []),
              ...(counts.private > 0 ? [{ key: 'private', label: `Privées (${counts.private})` }]   : []),
              { key: 'archived', label: 'Archivées' },
            ] as { key: Filter; label: string }[]).map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setActiveFilter(key)}
                className={`chip ${activeFilter === key ? 'chip-active' : ''}`}
                style={{ border: 'none', cursor: 'pointer' }}
              >
                {label}
              </button>
            ))}
            <Link
              href="/wishlist/new"
              className="btn btn-primary btn-stamp"
              style={{ marginLeft: 8, textDecoration: 'none' }}
            >
              <TomlIcon name="plus" size={14} />
              Créer une wishlist
            </Link>
          </div>
        </div>

        {/* Cards grid 3 cols */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20, marginBottom: 24 }}>
          {displayed.map(w => <DashboardCard key={w.id} w={w} />)}

          {/* Dashed create card */}
          <Link href="/wishlist/new" style={{ textDecoration: 'none' }}>
            <button style={{
              width: '100%',
              background: 'transparent',
              border: '1.5px dashed var(--t-ink-3)',
              borderRadius: 'var(--t-r-lg)',
              padding: '40px 20px',
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10,
              color: 'var(--t-ink-3)', cursor: 'pointer', minHeight: 360,
              fontFamily: 'var(--t-font-ui)', fontWeight: 600, fontSize: 14,
            }}>
              <div style={{
                width: 56, height: 56, borderRadius: 999,
                background: 'var(--t-bg-2)', border: '1.5px dashed var(--t-ink-3)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <TomlIcon name="plus" size={24} />
              </div>
              <div className="display-2" style={{ fontSize: 17, color: 'var(--t-ink-2)' }}>
                Nouvelle wishlist
              </div>
              <div style={{ fontSize: 12, color: 'var(--t-ink-3)', textAlign: 'center', maxWidth: 200 }}>
                Anniversaire, déménagement, liste de naissance…
              </div>
            </button>
          </Link>
        </div>

        {/* Bookmarklet promo */}
        <div className="card" style={{ padding: 20, background: 'var(--t-ink)', color: 'var(--t-bg)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
            <div style={{
              width: 52, height: 52, borderRadius: 14,
              background: 'var(--t-mustard)', color: 'var(--t-ink)',
              border: '1.5px solid var(--t-bg)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
            }}>
              <TomlIcon name="bookmark" size={24} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div className="display-2" style={{ fontSize: 18, marginBottom: 2, color: 'var(--t-bg)' }}>
                Ajoute depuis n&apos;importe quel site
              </div>
              <div style={{ fontSize: 13, color: 'var(--t-bg-2)' }}>
                Glisse le bouton dans ta barre de favoris. 1 clic = 1 article ajouté à ta liste.
              </div>
            </div>
            <TomlBookmarklet />
            <button className="btn btn-outline btn-sm" style={{
              flexShrink: 0, color: 'var(--t-bg)', borderColor: 'var(--t-bg-2)',
            }}>
              En savoir plus
            </button>
          </div>
        </div>
      </div>
    </HDShell>
  )
}
