'use client'

import type { ReactNode } from 'react'
import { HMShell, HMTopBar } from '@/components/landing/shells'
import { TomlAvatar, TomlAvatarStack, TomlBadge } from '@/components/toml-ds/toml-kit'
import { TomlIcon } from '@/components/toml-ds/toml-icons'

// ── Types ─────────────────────────────────────────────────────────────────────

type CircleTone = 'rose' | 'mustard' | 'denim' | null
interface Person { initial: string; tone: 1 | 2 | 3 | 4 | 5 }

// ── Circle card ───────────────────────────────────────────────────────────────

interface CircleCardProps {
  name: string; count: number; people: Person[]; tone: CircleTone; emoji: string
}

const CircleCard = ({ name, count, people, tone, emoji }: CircleCardProps) => {
  const bg = tone === 'rose' ? 'var(--t-rose-soft)'
    : tone === 'mustard' ? 'var(--t-mustard-soft)'
    : tone === 'denim' ? 'var(--t-denim-soft)'
    : 'var(--t-paper)'
  return (
    <div className="card" style={{ padding: 14, display: 'flex', flexDirection: 'column', gap: 8, minHeight: 130, justifyContent: 'space-between', background: bg }}>
      <div>
        <div style={{ fontSize: 22, marginBottom: 4 }}>{emoji}</div>
        <div className="display-2" style={{ fontSize: 17, marginBottom: 2 }}>{name}</div>
        <div style={{ fontSize: 11, color: 'var(--t-ink-2)', fontWeight: 600 }}>
          {count} {count > 1 ? 'membres' : 'membre'}
        </div>
      </div>
      <TomlAvatarStack people={people} max={4} size="xs" />
    </div>
  )
}

// ── Friend row ────────────────────────────────────────────────────────────────

interface FriendRowProps {
  initial: string; name: string; handle: string; tone: 1 | 2 | 3 | 4 | 5
  listsCount: number | null; lastActive: string | null; mutual?: number
  action: ReactNode
}

const FriendRow = ({ initial, name, handle, tone, listsCount, lastActive, mutual, action }: FriendRowProps) => (
  <div style={{
    display: 'flex', alignItems: 'center', gap: 12,
    padding: '12px 18px', borderBottom: '1px solid var(--t-line-soft)',
  }}>
    <TomlAvatar initial={initial} tone={tone} size="md" />
    <div style={{ flex: 1, minWidth: 0 }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--t-ink)' }}>{name}</div>
        <div style={{ fontSize: 11, color: 'var(--t-ink-3)' }}>@{handle}</div>
      </div>
      <div style={{ fontSize: 12, color: 'var(--t-ink-2)', marginTop: 2 }}>
        {listsCount != null && <><strong style={{ color: 'var(--t-ink)' }}>{listsCount}</strong> listes<span style={{ color: 'var(--t-ink-4)', margin: '0 6px' }}>·</span></>}
        {mutual && <><span>{mutual} amis communs</span><span style={{ color: 'var(--t-ink-4)', margin: '0 6px' }}>·</span></>}
        {lastActive && <span>{lastActive}</span>}
      </div>
    </div>
    {action}
  </div>
)

// ── Birthday pill ─────────────────────────────────────────────────────────────

interface BirthdayPillProps {
  initial: string; name: string; when: string; days: number; tone: 1 | 2 | 3 | 4 | 5
}

const BirthdayPill = ({ initial, name, when, days, tone }: BirthdayPillProps) => (
  <div style={{
    flexShrink: 0, width: 130,
    background: 'var(--t-paper)', border: '1.5px solid var(--t-ink)',
    borderRadius: 'var(--t-r-lg)', padding: 12,
    boxShadow: 'var(--t-shadow-stamp)',
    display: 'flex', flexDirection: 'column', gap: 6,
  }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
      <TomlAvatar initial={initial} tone={tone} size="sm" />
      <span style={{ fontSize: 18 }}>🎂</span>
    </div>
    <div>
      <div style={{ fontSize: 13, fontWeight: 700, lineHeight: 1.2 }}>{name}</div>
      <div style={{ fontSize: 11, color: 'var(--t-ink-3)', marginTop: 2 }}>{when}</div>
    </div>
    <span className="chip chip-mustard" style={{ fontSize: 10, alignSelf: 'flex-start' }}>Dans {days}j</span>
  </div>
)

// ── Mock data ─────────────────────────────────────────────────────────────────

const CIRCLES: CircleCardProps[] = [
  { name: 'Famille', count: 8,  emoji: '🏡', tone: 'rose',
    people: [{initial:'M',tone:5},{initial:'P',tone:2},{initial:'C',tone:1},{initial:'A',tone:3}] },
  { name: 'Crew',    count: 12, emoji: '✨', tone: 'mustard',
    people: [{initial:'L',tone:1},{initial:'T',tone:2},{initial:'I',tone:4},{initial:'S',tone:3}] },
  { name: 'Cousins', count: 6,  emoji: '🎯', tone: 'denim',
    people: [{initial:'P',tone:3},{initial:'J',tone:1},{initial:'M',tone:5}] },
  { name: 'Bureau',  count: 4,  emoji: '☕', tone: null,
    people: [{initial:'V',tone:2},{initial:'R',tone:4}] },
]

const BIRTHDAYS: BirthdayPillProps[] = [
  { initial: 'L', name: 'Léa',    when: '2 juin',  days: 8,  tone: 1 },
  { initial: 'P', name: 'Papa',   when: '15 juin', days: 21, tone: 2 },
  { initial: 'I', name: 'Inès',   when: '28 juin', days: 34, tone: 4 },
]

const FRIENDS = [
  { initial:'L', name:'Léa Moreau',   handle:'leam',    tone:1 as const, listsCount:3, mutual:8,  lastActive:'actif' },
  { initial:'T', name:'Tom Bernard',  handle:'tomb',    tone:2 as const, listsCount:2, mutual:4,  lastActive:'hier' },
  { initial:'I', name:'Inès Lambert', handle:'ineslam', tone:4 as const, listsCount:5, mutual:12, lastActive:'actif' },
  { initial:'M', name:'Maman',        handle:'mum',     tone:5 as const, listsCount:1, mutual:0,  lastActive:'il y a 2 j' },
  { initial:'P', name:'Paul Durand',  handle:'pdurand', tone:3 as const, listsCount:0, mutual:6,  lastActive:'la sem. dernière' },
]

const PENDING = [
  { initial:'S', name:'Sophie Vermeil', handle:'sosolavie', tone:2 as const, mutual:3 },
  { initial:'A', name:'Alex Roy',       handle:'alex_r',    tone:4 as const, mutual:1 },
]

// ── Mobile friends ────────────────────────────────────────────────────────────

export const HMFriends = () => (
  <HMShell>
    <HMTopBar
      left={
        <div>
          <div className="label" style={{ marginBottom: 2 }}>Mes cercles</div>
          <div className="display-2" style={{ fontSize: 22 }}>Amis</div>
        </div>
      }
      right={
        <button className="btn btn-accent btn-sm btn-stamp">
          <TomlIcon name="plus" size={14} />
          Inviter
        </button>
      }
    />

    {/* Search */}
    <div style={{ padding: '8px 18px 14px' }}>
      <div style={{ position: 'relative' }}>
        <TomlIcon name="search" size={16} style={{
          position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)',
          color: 'var(--t-ink-3)', pointerEvents: 'none',
        }} />
        <input className="input input-soft" placeholder="Chercher un ami, un cercle…" style={{ paddingLeft: 38 }} />
      </div>
    </div>

    {/* Cercles */}
    <div style={{ padding: '6px 18px 4px', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
      <div className="label">Cercles</div>
      <button style={{ background: 'transparent', border: 'none', color: 'var(--t-rose)', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>
        Tout voir
      </button>
    </div>
    <div style={{ padding: '8px 18px 20px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
      {CIRCLES.map((c, i) => <CircleCard key={i} {...c} />)}
    </div>

    {/* Anniversaires */}
    <div style={{ padding: '4px 18px 10px', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
      <div className="label">Anniversaires à venir</div>
      <span style={{ fontSize: 11, color: 'var(--t-ink-3)', fontWeight: 600 }}>3 prochains</span>
    </div>
    <div style={{ display: 'flex', gap: 10, overflowX: 'auto', padding: '4px 18px 20px' }}>
      {BIRTHDAYS.map((b, i) => <BirthdayPill key={i} {...b} />)}
    </div>

    {/* Demandes */}
    {PENDING.length > 0 && (
      <>
        <div style={{ padding: '8px 18px 8px', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <div className="label">Demandes</div>
          <TomlBadge style={{ background: 'var(--t-rose)' }}>{PENDING.length}</TomlBadge>
        </div>
        {PENDING.map((p, i) => (
          <FriendRow key={i} {...p} listsCount={null} lastActive={null}
            action={
              <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                <button className="btn btn-primary btn-sm btn-stamp" style={{ padding: '6px 10px' }}>
                  <TomlIcon name="check" size={12} />
                </button>
                <button className="btn btn-ghost btn-sm" style={{ padding: '6px 10px' }}>
                  <TomlIcon name="x" size={12} />
                </button>
              </div>
            }
          />
        ))}
      </>
    )}

    {/* Tous mes amis */}
    <div style={{ padding: '14px 18px 8px', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
      <div className="label">Tous mes amis</div>
      <span style={{ fontSize: 11, color: 'var(--t-ink-3)', fontWeight: 600 }}>{FRIENDS.length} contacts</span>
    </div>
    {FRIENDS.map((f, i) => (
      <FriendRow key={i} {...f}
        action={
          <button className="btn btn-ghost btn-sm" style={{
            flexShrink: 0, width: 32, height: 32, padding: 0, borderRadius: 999, background: 'transparent',
          }}>
            <TomlIcon name="arrow" size={14} />
          </button>
        }
      />
    ))}
    <div style={{ height: 20 }} />
  </HMShell>
)
