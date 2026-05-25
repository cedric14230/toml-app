'use client'

import { useState } from 'react'
import type { ReactNode } from 'react'
import { HMShell, HMTopBar } from '@/components/landing/shells'
import { TomlAvatar, TomlStars } from '@/components/toml-ds/toml-kit'
import { TomlIcon } from '@/components/toml-ds/toml-icons'

// ── Event row ─────────────────────────────────────────────────────────────────

interface FeedEventProps {
  avatar: string
  who: string
  verb: string
  target: string
  time: string
  tone?: 1 | 2 | 3 | 4 | 5
  body?: ReactNode
}

const FeedEvent = ({ avatar, who, verb, target, time, tone = 1, body }: FeedEventProps) => (
  <div style={{
    display: 'flex', gap: 12, padding: '14px 18px',
    borderBottom: '1px solid var(--t-line-soft)',
    background: 'var(--t-bg)',
  }}>
    <TomlAvatar initial={avatar} tone={tone} size="md" />
    <div style={{ flex: 1, minWidth: 0 }}>
      <div style={{ fontSize: 14, lineHeight: 1.4, color: 'var(--t-ink)' }}>
        <strong style={{ fontWeight: 700 }}>{who}</strong>
        <span style={{ color: 'var(--t-ink-2)' }}> {verb} </span>
        <strong style={{ fontWeight: 600, color: 'var(--t-ink)' }}>{target}</strong>
      </div>
      {body}
      <div style={{ fontSize: 11, color: 'var(--t-ink-3)', marginTop: 6, fontWeight: 600, letterSpacing: '0.02em' }}>
        {time}
      </div>
    </div>
  </div>
)

// ── Feed item card ────────────────────────────────────────────────────────────

interface FeedItemProps {
  brand: string
  title: string
  price: number
  stars: number
  tone: 1 | 2 | 3 | 4 | 5 | 6
  note?: string
}

const FeedItemCard = ({ brand, title, price, stars, tone, note }: FeedItemProps) => (
  <div className="card" style={{ margin: '8px 0 4px' }}>
    <div className={`img img-${tone}`} style={{ height: 160, position: 'relative' }}>
      {stars === 3 && (
        <span className="sticker" style={{ position: 'absolute', top: 10, left: 10 }}>
          <TomlStars value={3} size={10} />
          <span style={{ marginLeft: 4 }}>top wishlist</span>
        </span>
      )}
    </div>
    <div style={{ padding: '12px 14px' }}>
      <div className="label" style={{ color: 'var(--t-rose)', marginBottom: 3, fontSize: 10 }}>{brand}</div>
      <div className="display-2" style={{ fontSize: 16, marginBottom: note ? 6 : 8 }}>{title}</div>
      {note && (
        <div style={{
          fontFamily: 'var(--t-font-display)', fontStyle: 'italic',
          fontWeight: 500, fontSize: 13, color: 'var(--t-ink-2)', marginBottom: 8,
        }}>
          « {note} »
        </div>
      )}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontSize: 15, fontWeight: 700 }}>{price} €</div>
        <button className="btn btn-outline btn-sm">
          <TomlIcon name="gift" size={12} />
          Réserver
        </button>
      </div>
    </div>
  </div>
)

// ── Mobile feed ───────────────────────────────────────────────────────────────

const FILTERS = ['Tout', 'Famille', 'Amis', 'Réservés']

export const HMFeed = () => {
  const [active, setActive] = useState('Tout')

  return (
    <HMShell>
      <HMTopBar
        left={
          <div>
            <div className="label" style={{ marginBottom: 2 }}>Activité</div>
            <div className="display-2" style={{ fontSize: 22 }}>Feed</div>
          </div>
        }
        right={
          <button className="btn btn-ghost" style={{
            width: 38, height: 38, padding: 0, borderRadius: 999,
            background: 'var(--t-paper)', border: '1px solid var(--t-line)',
          }}>
            <TomlIcon name="filter" size={18} />
          </button>
        }
      />

      {/* Filters */}
      <div style={{
        padding: '8px 18px 14px', display: 'flex', gap: 8, overflowX: 'auto',
        borderBottom: '1px solid var(--t-line-soft)',
      }}>
        {FILTERS.map(f => (
          <button key={f} onClick={() => setActive(f)}
            className={`chip ${active === f ? 'chip-active' : ''}`}
            style={{ border: 'none', cursor: 'pointer', flexShrink: 0 }}>
            {f}
          </button>
        ))}
      </div>

      {/* Birthday highlight */}
      <div style={{ padding: '14px 18px 8px' }}>
        <div className="giver-banner">
          <span style={{ fontSize: 26 }}>🎂</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700, fontSize: 14 }}>Anniversaire de Léa</div>
            <div style={{ fontSize: 12, color: 'var(--t-ink-2)' }}>Dans 8 jours — sa liste est prête</div>
          </div>
          <button className="btn btn-primary btn-sm btn-stamp" style={{ flexShrink: 0 }}>Voir</button>
        </div>
      </div>

      {/* Events */}
      <div>
        <FeedEvent
          avatar="L" who="Léa" verb="a ajouté un coup de cœur dans" target="Anniv 2026"
          time="il y a 12 min" tone={1}
          body={<FeedItemCard brand="Sézane" title="Robe Liliana — taille S" price={89} stars={3} tone={1} note="Si tu trouves en bleu nuit je meurs" />}
        />

        <FeedEvent
          avatar="T" who="Tom" verb="a réservé" target="Bougie Diptyque" time="il y a 1 h" tone={2}
          body={
            <div className="card-soft" style={{ marginTop: 8, padding: '10px 12px', display: 'flex', alignItems: 'center', gap: 10 }}>
              <div className="img img-5" style={{ width: 44, height: 44, borderRadius: 8, flexShrink: 0 }}></div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 600 }}>Bougie Baies — Diptyque</div>
                <div style={{ fontSize: 11, color: 'var(--t-ink-3)' }}>
                  Dans <strong style={{ color: 'var(--t-ink-2)' }}>Noël 2026</strong> de Camille
                </div>
              </div>
              <span className="chip chip-mustard" style={{ fontSize: 10 }}>
                <span className="dot dot-reserved" style={{ marginRight: 4 }}></span>
                Réservé
              </span>
            </div>
          }
        />

        <FeedEvent
          avatar="I" who="Inès" verb="a créé une nouvelle liste" target="Crémaillère 12 juin"
          time="il y a 3 h" tone={4}
          body={
            <div className="card-soft" style={{ marginTop: 8, padding: '12px 14px' }}>
              <div style={{
                fontFamily: 'var(--t-font-display)', fontStyle: 'italic',
                fontWeight: 500, fontSize: 14, color: 'var(--t-ink-2)', marginBottom: 6,
              }}>
                « On pend la crémaillère ! Si vous voulez participer 🏠 »
              </div>
              <div style={{ display: 'flex', gap: 6 }}>
                <span className="chip" style={{ fontSize: 10 }}>0 articles</span>
                <span className="chip" style={{ fontSize: 10 }}>
                  <TomlIcon name="friends" size={10} />
                  Amis
                </span>
              </div>
            </div>
          }
        />

        <FeedEvent
          avatar="M" who="Maman" verb="a réagi à" target="Trench long cercle" time="hier" tone={5}
          body={
            <div style={{
              marginTop: 6, padding: '8px 12px',
              background: 'var(--t-paper)', border: '1px solid var(--t-line)',
              borderRadius: 'var(--t-r-md)', display: 'flex', alignItems: 'center', gap: 8,
            }}>
              <span style={{ fontSize: 18 }}>❤️</span>
              <span style={{
                fontFamily: 'var(--t-font-display)', fontStyle: 'italic',
                fontWeight: 500, fontSize: 13, color: 'var(--t-ink-2)',
              }}>
                « Très joli ce trench, ça t&apos;irait tellement bien »
              </span>
            </div>
          }
        />

        <FeedEvent avatar="P" who="Paul" verb="a rejoint le cercle" target="Cousins" time="hier" tone={3} />

        <FeedEvent
          avatar="L" who="Léa" verb="a ajouté 3 articles dans" target="Anniv 2026"
          time="il y a 2 jours" tone={1}
          body={
            <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
              {[2, 3, 4].map(t => (
                <div key={t} className={`img img-${t}`} style={{
                  width: 56, height: 56, borderRadius: 10, border: '1.5px solid var(--t-ink)',
                }}></div>
              ))}
              <div style={{
                width: 56, height: 56, borderRadius: 10, border: '1.5px dashed var(--t-ink-3)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 11, fontWeight: 700, color: 'var(--t-ink-3)',
              }}>+5</div>
            </div>
          }
        />

        <div style={{ padding: '20px 18px 30px', textAlign: 'center' }}>
          <button className="btn btn-outline btn-sm">Charger plus d&apos;activité</button>
        </div>
      </div>
    </HMShell>
  )
}
