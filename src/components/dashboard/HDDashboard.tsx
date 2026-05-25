'use client'

import Link from 'next/link'
import { HDShell } from '@/components/landing/shells'
import { TomlBookmarklet } from '@/components/toml-ds/toml-kit'
import { TomlIcon } from '@/components/toml-ds/toml-icons'

// ── Types ─────────────────────────────────────────────────────────────────────

interface WishlistItem {
  title: string
  count: number
  vis: string
  icon: string
  latest: string
  tone: 1 | 2 | 3 | 4 | 5 | 6
  note?: string
}

// ── Dashboard card ────────────────────────────────────────────────────────────

const DashboardCard = ({ title, count, vis, icon, latest, tone, note }: WishlistItem) => (
  <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
    <div className={`img img-${tone}`} style={{ height: 180, position: 'relative' }}>
      <span className="chip" style={{
        position: 'absolute', top: 12, right: 12,
        background: 'rgba(255,255,255,0.92)',
        backdropFilter: 'blur(4px)',
        fontSize: 11,
      }}>
        <TomlIcon name={icon} size={11} />
        {vis}
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
        <div className="display-2" style={{ fontSize: 20 }}>{title}</div>
        <div style={{ fontSize: 13, color: 'var(--t-ink-2)', fontWeight: 700, flexShrink: 0 }}>
          {count} articles
        </div>
      </div>
      {note && (
        <div style={{
          fontFamily: 'var(--t-font-display)', fontStyle: 'italic',
          fontWeight: 500, fontSize: 13, color: 'var(--t-ink-2)',
        }}>
          « {note} »
        </div>
      )}
      <div style={{ flex: 1 }} />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontSize: 12, color: 'var(--t-rose)', fontWeight: 700 }}>{latest}</div>
        <button className="btn btn-outline btn-sm" style={{ padding: '4px 10px', fontSize: 11 }}>
          Ouvrir
          <TomlIcon name="arrow" size={11} />
        </button>
      </div>
    </div>
  </div>
)

// ── Mock data ─────────────────────────────────────────────────────────────────

const LISTS: WishlistItem[] = [
  { title: 'Noël 2026',           count: 12, vis: 'Amis',     icon: 'friends', tone: 1, latest: '5 ajouts cette semaine', note: 'Ma liste de cette année, avec amour 🎄' },
  { title: 'Ma chambre idéale',   count: 7,  vis: 'Publique', icon: 'eye',     tone: 3, latest: 'Léa a réagi à 2 articles' },
  { title: 'Anniversaire',        count: 4,  vis: 'Privée',   icon: 'lock',    tone: 4, latest: '14 juin · perso' },
  { title: 'Lecture été',         count: 9,  vis: 'Publique', icon: 'eye',     tone: 2, latest: '3 livres en attente' },
  { title: 'Cuisine & vaisselle', count: 14, vis: 'Amis',     icon: 'friends', tone: 5, latest: 'Tom a réservé 1 article' },
]

// ── Desktop dashboard ─────────────────────────────────────────────────────────

export const HDDashboard = () => (
  <HDShell active="lists" authed>
    <div style={{ padding: '32px 40px 60px' }}>
      {/* Header */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end',
        gap: 24, marginBottom: 28, flexWrap: 'wrap',
      }}>
        <div>
          <div className="label" style={{ marginBottom: 6 }}>
            Bonjour Camille <span style={{ color: 'var(--t-rose)' }}>✦</span>
          </div>
          <h1 className="display-2" style={{ fontSize: 40, letterSpacing: '-0.02em' }}>
            Mes <span style={{ color: 'var(--t-rose)', fontStyle: 'italic', fontWeight: 600 }}>wishlists</span>
          </h1>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
          <span className="chip chip-active">Toutes ({LISTS.length})</span>
          <span className="chip">Publiques</span>
          <span className="chip">Amis</span>
          <span className="chip">Privées</span>
          <span className="chip">Archivées</span>
          <Link
            href="/add"
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
        {LISTS.map((l, i) => <DashboardCard key={i} {...l} />)}

        {/* Dashed create card */}
        <button style={{
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
