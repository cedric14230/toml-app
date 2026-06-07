'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { HMShell, HMTopBar } from '@/components/landing/shells'
import { TomlAvatar, TomlBadge } from '@/components/toml-ds/toml-kit'
import { TomlIcon } from '@/components/toml-ds/toml-icons'
import { createSupabaseBrowserClient } from '@/lib/supabase/client'
import type { FriendData, PendingData, SearchResult } from './types'
import { toTone, toInitial } from './types'

// ── Props ─────────────────────────────────────────────────────────────────────

interface HMFriendsProps {
  friends: FriendData[]
  pendingIn: PendingData[]
  userId: string
  existingFriendIds: string[]
}

// ── Mobile friends ────────────────────────────────────────────────────────────

export const HMFriends = ({
  friends: initialFriends,
  pendingIn: initialPending,
  userId,
  existingFriendIds,
}: HMFriendsProps) => {
  const router = useRouter()
  const [friends, setFriends]     = useState<FriendData[]>(initialFriends)
  const [pendingIn, setPendingIn] = useState<PendingData[]>(initialPending)

  // ── Search state ────────────────────────────────────────────────────────────
  const [query, setQuery]                 = useState('')
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [searching, setSearching]         = useState(false)
  const [sentRequests, setSentRequests]   = useState<Set<string>>(new Set())
  const [sendingTo, setSendingTo]         = useState<Set<string>>(new Set())

  // ── Pending action state ────────────────────────────────────────────────────
  const [accepting, setAccepting] = useState<Set<string>>(new Set())
  const [rejecting, setRejecting] = useState<Set<string>>(new Set())

  // ── Debounced search ────────────────────────────────────────────────────────
  useEffect(() => {
    if (!query.trim()) {
      setSearchResults([])
      return
    }
    setSearching(true)
    const timer = setTimeout(async () => {
      const supabase = createSupabaseBrowserClient()
      const { data, error } = await supabase
        .from('users')
        .select('id, name')
        .ilike('name', `%${query.trim()}%`)
        .limit(6)

      if (error) { setSearching(false); return }

      const excludeIds = new Set([...existingFriendIds, userId])
      const results: SearchResult[] = ((data ?? []) as { id: string; name: string | null }[])
        .filter(u => !excludeIds.has(u.id))
        .map(u => ({
          userId:  u.id,
          name:    u.name ?? 'Utilisateur',
          initial: toInitial(u.name),
          tone:    toTone(u.id),
        }))
      setSearchResults(results)
      setSearching(false)
    }, 350)
    return () => clearTimeout(timer)
  }, [query]) // eslint-disable-line react-hooks/exhaustive-deps

  // ── Handlers ────────────────────────────────────────────────────────────────

  async function handleAdd(targetId: string) {
    setSendingTo(prev => { const s = new Set(prev); s.add(targetId); return s })
    const supabase = createSupabaseBrowserClient()
    await supabase
      .from('friendships')
      .insert({ user_id_1: userId, user_id_2: targetId, status: 'pending' })
    setSentRequests(prev => { const s = new Set(prev); s.add(targetId); return s })
    setSendingTo(prev => { const s = new Set(prev); s.delete(targetId); return s })
  }

  async function handleAccept(senderId: string) {
    setAccepting(prev => { const s = new Set(prev); s.add(senderId); return s })
    const supabase = createSupabaseBrowserClient()
    const { error } = await supabase
      .from('friendships')
      .update({ status: 'accepted' })
      .eq('user_id_1', senderId)
      .eq('user_id_2', userId)
    if (!error) {
      const accepted = pendingIn.find(p => p.senderId === senderId)
      setPendingIn(prev => prev.filter(p => p.senderId !== senderId))
      if (accepted) {
        setFriends(prev => [...prev, {
          userId: accepted.senderId, name: accepted.name,
          initial: accepted.initial, tone: accepted.tone, wishlistCount: 0,
        }])
      }
      router.refresh()
    }
    setAccepting(prev => { const s = new Set(prev); s.delete(senderId); return s })
  }

  async function handleReject(senderId: string) {
    setRejecting(prev => { const s = new Set(prev); s.add(senderId); return s })
    const supabase = createSupabaseBrowserClient()
    const { error } = await supabase
      .from('friendships')
      .delete()
      .eq('user_id_1', senderId)
      .eq('user_id_2', userId)
    if (!error) {
      setPendingIn(prev => prev.filter(p => p.senderId !== senderId))
    }
    setRejecting(prev => { const s = new Set(prev); s.delete(senderId); return s })
  }

  const showSearch = query.trim().length > 0
  const isEmpty    = friends.length === 0 && pendingIn.length === 0

  return (
    <HMShell>
      <HMTopBar
        showBurger
        left={
          <div>
            <div className="label" style={{ marginBottom: 2 }}>
              {friends.length} ami{friends.length !== 1 ? 's' : ''}
            </div>
            <div className="display-2" style={{ fontSize: 22 }}>Amis</div>
          </div>
        }
        right={
          pendingIn.length > 0 ? (
            <TomlBadge style={{ background: 'var(--t-rose)' }}>{pendingIn.length}</TomlBadge>
          ) : undefined
        }
      />

      {/* Barre de recherche */}
      <div style={{ padding: '8px 18px 12px' }}>
        <div style={{ position: 'relative' }}>
          <TomlIcon name="search" size={16} style={{
            position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)',
            color: 'var(--t-ink-3)', pointerEvents: 'none',
          }} />
          <input
            className="input input-soft"
            placeholder="Rechercher un utilisateur…"
            value={query}
            onChange={e => setQuery(e.target.value)}
            style={{ paddingLeft: 38 }}
          />
        </div>
      </div>

      {/* Résultats de recherche */}
      {showSearch && (
        <div style={{ padding: '0 18px 20px' }}>
          {searching && (
            <div style={{ fontSize: 12, color: 'var(--t-ink-3)', marginBottom: 8 }}>
              Recherche en cours…
            </div>
          )}
          {!searching && searchResults.length === 0 && (
            <div style={{ fontSize: 13, color: 'var(--t-ink-3)', padding: '12px 0' }}>
              Aucun utilisateur trouvé.
            </div>
          )}
          {searchResults.map(r => (
            <div
              key={r.userId}
              style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '10px 14px', borderBottom: '1px solid var(--t-line-soft)',
                background: 'var(--t-bg)',
              }}
            >
              <TomlAvatar initial={r.initial} tone={r.tone} size="md" />
              <div style={{ flex: 1, fontSize: 14, fontWeight: 700 }}>{r.name}</div>
              <button
                className={sentRequests.has(r.userId) ? 'btn btn-ghost btn-sm' : 'btn btn-primary btn-stamp btn-sm'}
                disabled={sentRequests.has(r.userId) || sendingTo.has(r.userId)}
                onClick={() => handleAdd(r.userId)}
                style={{ flexShrink: 0, padding: '6px 12px' }}
              >
                <TomlIcon name={sentRequests.has(r.userId) ? 'check' : 'plus'} size={12} />
                {sentRequests.has(r.userId)
                  ? 'Envoyée'
                  : sendingTo.has(r.userId)
                    ? '…'
                    : 'Ajouter'}
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Demandes reçues */}
      {pendingIn.length > 0 && (
        <>
          <div style={{ padding: '8px 18px 8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div className="label">Demandes reçues</div>
            <TomlBadge style={{ background: 'var(--t-rose)' }}>{pendingIn.length}</TomlBadge>
          </div>
          {pendingIn.map(p => (
            <div
              key={p.senderId}
              style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '12px 18px', borderBottom: '1px solid var(--t-line-soft)',
                background: 'var(--t-bg)',
              }}
            >
              <TomlAvatar initial={p.initial} tone={p.tone} size="md" />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 700 }}>{p.name}</div>
                <div style={{ fontSize: 11, color: 'var(--t-ink-3)' }}>souhaite vous ajouter</div>
              </div>
              <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                <button
                  className="btn btn-primary btn-sm btn-stamp"
                  style={{ padding: '6px 10px' }}
                  disabled={accepting.has(p.senderId)}
                  onClick={() => handleAccept(p.senderId)}
                >
                  <TomlIcon name="check" size={12} />
                  {accepting.has(p.senderId) ? '…' : 'Accepter'}
                </button>
                <button
                  className="btn btn-ghost btn-sm"
                  style={{ padding: '6px 10px' }}
                  disabled={rejecting.has(p.senderId)}
                  onClick={() => handleReject(p.senderId)}
                >
                  <TomlIcon name="x" size={12} />
                </button>
              </div>
            </div>
          ))}
        </>
      )}

      {/* Tous mes amis */}
      {friends.length > 0 && (
        <>
          <div style={{ padding: '14px 18px 8px', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <div className="label">Tous mes amis</div>
            <span style={{ fontSize: 11, color: 'var(--t-ink-3)', fontWeight: 600 }}>
              {friends.length} contact{friends.length !== 1 ? 's' : ''}
            </span>
          </div>
          {friends.map(f => (
            <div
              key={f.userId}
              style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '12px 18px', borderBottom: '1px solid var(--t-line-soft)',
                background: 'var(--t-bg)', cursor: 'pointer',
              }}
              onClick={() => router.push(`/profile/${f.userId}`)}
            >
              <TomlAvatar initial={f.initial} tone={f.tone} size="md" />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--t-ink)' }}>{f.name}</div>
                <div style={{ fontSize: 12, color: 'var(--t-ink-2)', marginTop: 2 }}>
                  <strong style={{ color: 'var(--t-ink)' }}>{f.wishlistCount}</strong>{' '}
                  liste{f.wishlistCount !== 1 ? 's' : ''}
                </div>
              </div>
              <TomlIcon name="arrow" size={14} style={{ color: 'var(--t-ink-3)', flexShrink: 0 }} />
            </div>
          ))}
        </>
      )}

      {/* État vide */}
      {isEmpty && !showSearch && (
        <div style={{ padding: '60px 18px', textAlign: 'center', color: 'var(--t-ink-3)' }}>
          <div style={{
            width: 64, height: 64, borderRadius: 999,
            border: '2px dashed var(--t-ink-3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 16px',
          }}>
            <TomlIcon name="friends" size={28} />
          </div>
          <div className="display-2" style={{ fontSize: 18, marginBottom: 8 }}>
            Vos amis vous attendent
          </div>
          <div style={{ fontSize: 13, lineHeight: 1.6 }}>
            Recherchez des utilisateurs par leur nom pour leur envoyer une demande d&apos;amitié.
          </div>
        </div>
      )}

      <div style={{ height: 24 }} />
    </HMShell>
  )
}
