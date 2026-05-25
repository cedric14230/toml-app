'use client'

import type { ReactNode } from 'react'
import { HDShell } from '@/components/landing/shells'
import { TomlAvatar, TomlBookmarklet } from '@/components/toml-ds/toml-kit'
import { TomlIcon } from '@/components/toml-ds/toml-icons'

// ── WhatsApp glyph ────────────────────────────────────────────────────────────

const WhatsAppGlyph = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="#fff">
    <path d="M17.5 14.4c-.3-.1-1.6-.8-1.9-.9-.3-.1-.5-.1-.7.1-.2.3-.8.9-1 1.1-.2.2-.4.2-.7.1-.3-.2-1.2-.5-2.3-1.4-.8-.8-1.4-1.7-1.6-2-.2-.3 0-.5.1-.6.1-.1.3-.4.4-.5.1-.2.2-.3.3-.5.1-.2 0-.4 0-.5 0-.1-.7-1.7-1-2.3-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4s-1 1-1 2.5.7 2.8.7 3c.1.2 1.5 2.4 3.7 3.4.5.2.9.3 1.2.4.5.2 1 .1 1.4.1.4-.1 1.3-.5 1.5-1 .2-.6.2-1 .1-1.1-.1-.2-.3-.3-.6-.4zM12 2C6.5 2 2 6.5 2 12c0 1.7.5 3.4 1.3 4.8L2 22l5.3-1.4c1.4.8 3 1.2 4.7 1.2 5.5 0 10-4.5 10-10S17.5 2 12 2zm0 18c-1.5 0-3-.4-4.3-1.1l-.3-.2-3.1.8.8-3-.2-.3C4.4 15 4 13.5 4 12c0-4.4 3.6-8 8-8s8 3.6 8 8-3.6 8-8 8z" />
  </svg>
)

// ── Stat ──────────────────────────────────────────────────────────────────────

const Stat = ({ value, label }: { value: string; label: string }) => (
  <div style={{ flex: 1, textAlign: 'center', padding: '8px 4px' }}>
    <div className="display" style={{ fontSize: 32, marginBottom: 4 }}>{value}</div>
    <div className="label" style={{ fontSize: 10 }}>{label}</div>
  </div>
)

// ── Setting row ───────────────────────────────────────────────────────────────

interface SettingRowProps {
  icon: string; title: string; value?: string
  badge?: string; danger?: boolean; last?: boolean; action?: ReactNode
}

const SettingRow = ({ icon, title, value, badge, danger = false, last = false, action }: SettingRowProps) => (
  <div style={{
    display: 'flex', alignItems: 'center', gap: 14, padding: '16px 20px',
    borderBottom: last ? 'none' : '1px solid var(--t-line-soft)',
    cursor: 'pointer',
  }}>
    <div style={{
      width: 40, height: 40, borderRadius: 10,
      background: danger ? 'var(--t-rose-soft)' : 'var(--t-bg-2)',
      border: '1px solid var(--t-line)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      flexShrink: 0, color: danger ? 'var(--t-danger)' : 'var(--t-ink)',
    }}>
      <TomlIcon name={icon} size={18} />
    </div>
    <div style={{ flex: 1, minWidth: 0 }}>
      <div style={{ fontSize: 14, fontWeight: 700, color: danger ? 'var(--t-danger)' : 'var(--t-ink)' }}>{title}</div>
      {value && <div style={{ fontSize: 12, color: 'var(--t-ink-3)', marginTop: 2 }}>{value}</div>}
    </div>
    {badge && <span className="chip chip-rose" style={{ fontSize: 10 }}>{badge}</span>}
    {action || (!danger && <TomlIcon name="arrow" size={14} style={{ color: 'var(--t-ink-3)', flexShrink: 0 }} />)}
  </div>
)

// ── Desktop profile ───────────────────────────────────────────────────────────

export const HDProfile = () => (
  <HDShell active="" authed>
    <div style={{ padding: '32px 40px 60px' }}>
      {/* Hero */}
      <div style={{
        background:
          'radial-gradient(80% 60% at 0% 0%, var(--t-rose-soft) 0%, transparent 60%),' +
          'radial-gradient(70% 60% at 100% 0%, var(--t-mustard-soft) 0%, transparent 60%),' +
          'var(--t-paper)',
        border: '1.5px solid var(--t-ink)', borderRadius: 'var(--t-r-xl)',
        boxShadow: 'var(--t-shadow-stamp-lg)', padding: 32, marginBottom: 28,
        display: 'flex', alignItems: 'center', gap: 32,
      }}>
        <div style={{ position: 'relative', flexShrink: 0 }}>
          <TomlAvatar initial="C" tone={1} size="xl" style={{ width: 120, height: 120, fontSize: 48 }} />
          <button style={{
            position: 'absolute', bottom: 4, right: 4,
            width: 36, height: 36, borderRadius: 999,
            background: 'var(--t-ink)', color: 'var(--t-bg)',
            border: '2px solid var(--t-bg)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', padding: 0,
          }}>
            <TomlIcon name="edit" size={16} />
          </button>
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="label" style={{ marginBottom: 6 }}>Membre depuis octobre 2025</div>
          <h1 className="display-2" style={{ fontSize: 36, marginBottom: 4, letterSpacing: '-0.02em' }}>Camille Chapon</h1>
          <div style={{ fontSize: 14, color: 'var(--t-ink-3)', fontWeight: 600, marginBottom: 12 }}>
            @camille · camille@chapon.com
          </div>
          <div style={{
            fontFamily: 'var(--t-font-display)', fontStyle: 'italic', fontWeight: 500,
            fontSize: 17, marginBottom: 18, lineHeight: 1.3, maxWidth: 480, color: 'var(--t-ink-2)',
          }}>
            « Les jolies choses, l&apos;art de vivre, et pas mal de céramique »
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button className="btn btn-primary btn-stamp">
              <TomlIcon name="share" size={14} />
              Partager mon profil
            </button>
            <button className="btn btn-outline">
              <TomlIcon name="edit" size={14} />
              Modifier
            </button>
          </div>
        </div>
        {/* Stats stamp */}
        <div style={{
          display: 'flex', flexDirection: 'column',
          background: 'var(--t-paper)', border: '1.5px solid var(--t-ink)',
          borderRadius: 'var(--t-r-lg)', boxShadow: 'var(--t-shadow-stamp)',
          minWidth: 220, overflow: 'hidden',
        }}>
          <Stat value="3" label="Wishlists" />
          <div style={{ height: 1, background: 'var(--t-line)' }} />
          <Stat value="24" label="Articles" />
          <div style={{ height: 1, background: 'var(--t-line)' }} />
          <Stat value="18" label="Amis" />
        </div>
      </div>

      {/* 2-col content */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 24 }}>
        {/* LEFT */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Bookmarklet */}
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ padding: 24, background: 'var(--t-ink)', color: 'var(--t-bg)', display: 'flex', alignItems: 'center', gap: 20 }}>
              <div style={{
                width: 56, height: 56, borderRadius: 14, flexShrink: 0,
                background: 'var(--t-mustard)', color: 'var(--t-ink)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                border: '1.5px solid var(--t-bg)',
              }}>
                <TomlIcon name="bookmark" size={26} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="display-2" style={{ fontSize: 20, marginBottom: 4, color: 'var(--t-bg)' }}>
                  Ajoute depuis n&apos;importe où
                </div>
                <div style={{ fontSize: 13, color: 'var(--t-bg-2)', lineHeight: 1.4 }}>
                  Glisse le bookmarklet dans ta barre de favoris, puis clique dessus sur n&apos;importe quelle page produit.
                </div>
              </div>
              <TomlBookmarklet />
            </div>
            <div style={{
              padding: '12px 24px', background: 'var(--t-bg)',
              fontSize: 12, color: 'var(--t-ink-3)', fontWeight: 600,
              display: 'flex', alignItems: 'center', gap: 8,
            }}>
              <span style={{ color: 'var(--t-success)' }}>●</span>
              Compatible avec Chrome, Safari, Firefox, Edge
            </div>
          </div>

          {/* Connexions */}
          <div className="card-soft" style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--t-line-soft)' }}>
              <div className="label">Connexions</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 20px', borderBottom: '1px solid var(--t-line-soft)' }}>
              <div style={{
                width: 40, height: 40, borderRadius: 999,
                background: '#25D366', border: '1.5px solid var(--t-ink)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>
                <WhatsAppGlyph size={20} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 700 }}>WhatsApp</div>
                <div style={{ fontSize: 11, color: 'var(--t-success)', marginTop: 1, fontWeight: 600 }}>
                  <span className="dot" style={{ background: 'var(--t-success)', marginRight: 4 }}></span>
                  Connecté · +33 6 12 ••• •••
                </div>
              </div>
              <button className="btn btn-outline btn-sm">Gérer</button>
            </div>
            <SettingRow icon="link" title="Extension Chrome" value="Installée et activée" last />
          </div>

          {/* Adresses */}
          <div className="card-soft" style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--t-line-soft)', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <div className="label">Adresses de livraison</div>
              <button className="btn btn-ghost btn-sm" style={{ background: 'transparent', color: 'var(--t-rose)', fontSize: 12, fontWeight: 700, padding: 0 }}>
                + Ajouter
              </button>
            </div>
            <SettingRow icon="home" title="Maison" value="12 rue de Charonne · 75011 Paris" badge="Principale" />
            <SettingRow icon="gift" title="Chez Maman" value="8 av. des Tilleuls · 31000 Toulouse" last />
          </div>
        </div>

        {/* RIGHT */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div className="card-soft" style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--t-line-soft)' }}>
              <div className="label">Paramètres</div>
            </div>
            <SettingRow icon="bell"     title="Notifications"       value="Push · Email · Hebdo" badge="3 nouvelles" />
            <SettingRow icon="eye"      title="Confidentialité"     value="Listes par défaut : Amis" />
            <SettingRow icon="friends"  title="Cercles & invitations" value="4 cercles · 18 amis" />
            <SettingRow icon="sparkle"  title="Apparence"           value="Clair · Sora + Inter" last />
          </div>

          <div className="card-soft" style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--t-line-soft)' }}>
              <div className="label">Compte</div>
            </div>
            <SettingRow icon="user"  title="Données du compte"      value="camille@chapon.com · FR" />
            <SettingRow icon="lock"  title="Mot de passe & sécurité" value="2FA activée" />
            <SettingRow icon="x"     title="Se déconnecter" danger last />
          </div>

          <div style={{ textAlign: 'center', padding: '8px 0' }}>
            <div style={{ fontSize: 11, color: 'var(--t-ink-3)', fontWeight: 600, letterSpacing: '0.04em' }}>
              TOML v1.0 · Made in France
            </div>
          </div>
        </div>
      </div>
    </div>
  </HDShell>
)
