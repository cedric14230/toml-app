'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { HMShell, HMTopBar } from '@/components/landing/shells'
import { TomlAvatar } from '@/components/toml-ds/toml-kit'
import { TomlIcon } from '@/components/toml-ds/toml-icons'
import { createSupabaseBrowserClient } from '@/lib/supabase/client'
import type { ProfilePageProps, WishlistCard, FriendshipStatus } from './types'

// ── Visibility helpers ────────────────────────────────────────────────────────

const VIS_ICON: Record<string, string> = {
  private: 'lock', friends: 'friends', public: 'eye',
}
const VIS_LABEL: Record<string, string> = {
  private: 'Privée', friends: 'Amis', public: 'Publique',
}

// ── Wishlist row ──────────────────────────────────────────────────────────────

const WishlistRow = ({ w, isOwner }: { w: WishlistCard; isOwner: boolean }) => (
  <Link href={`/wishlist/${w.id}`} style={{ textDecoration: 'none', display: 'block' }}>
    <div style={{
      display: 'flex', alignItems: 'center', gap: 14,
      padding: '12px 18px', borderBottom: '1px solid var(--t-line-soft)',
      background: 'var(--t-bg)',
    }}>
      <div
        className={`img img-${w.tone}`}
        style={{ width: 52, height: 52, borderRadius: 'var(--t-r-md)', flexShrink: 0, border: '1.5px solid var(--t-ink)' }}
      />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div className="display-2" style={{ fontSize: 15, marginBottom: 2 }}>{w.title}</div>
        <div style={{ fontSize: 12, color: 'var(--t-ink-3)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>
          <span>{w.itemCount} article{w.itemCount !== 1 ? 's' : ''}</span>
          {isOwner && w.visibility !== 'public' && (
            <>
              <span style={{ color: 'var(--t-ink-4)' }}>·</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                <TomlIcon name={VIS_ICON[w.visibility]} size={10} />
                {VIS_LABEL[w.visibility]}
              </span>
            </>
          )}
        </div>
      </div>
      <TomlIcon name="arrow" size={13} style={{ color: 'var(--t-ink-3)', flexShrink: 0 }} />
    </div>
  </Link>
)

// ── Add-friend button ─────────────────────────────────────────────────────────

const AddFriendButton = ({
  profileId,
  viewerId,
  initialStatus,
}: {
  profileId: string
  viewerId: string
  initialStatus: FriendshipStatus
}) => {
  const [status, setStatus]   = useState<FriendshipStatus>(initialStatus)
  const [loading, setLoading] = useState(false)

  async function handleAdd() {
    if (loading || status !== 'none') return
    setLoading(true)
    const supabase = createSupabaseBrowserClient()
    const { error } = await supabase
      .from('friendships')
      .insert({ user_id_1: viewerId, user_id_2: profileId, status: 'pending' })
    if (!error) setStatus('pending_out')
    setLoading(false)
  }

  if (status === 'accepted') return null

  if (status === 'pending_in') {
    return (
      <Link
        href="/friends"
        className="btn btn-outline btn-sm"
        style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6 }}
      >
        <TomlIcon name="check" size={12} />
        Demande reçue — Répondre
      </Link>
    )
  }

  return (
    <button
      className={status === 'pending_out' ? 'btn btn-ghost btn-sm' : 'btn btn-primary btn-stamp btn-sm'}
      onClick={handleAdd}
      disabled={loading || status === 'pending_out'}
    >
      <TomlIcon name={status === 'pending_out' ? 'check' : 'plus'} size={12} />
      {loading ? 'Envoi…' : status === 'pending_out' ? 'Demande envoyée' : 'Ajouter en ami'}
    </button>
  )
}

// ── Mobile profile ────────────────────────────────────────────────────────────

export const HMProfile = ({
  profile,
  wishlists,
  viewerContext,
  friendshipStatus,
  viewerId,
}: ProfilePageProps) => {
  const router  = useRouter()
  const isOwner = viewerContext === 'owner'

  return (
    <HMShell>
      <HMTopBar
        left={
          <button
            className="btn btn-ghost"
            onClick={() => router.back()}
            style={{ width: 36, height: 36, padding: 0, borderRadius: 999, background: 'var(--t-paper)', border: '1px solid var(--t-line)' }}
          >
            <TomlIcon name="arrow" size={16} style={{ transform: 'rotate(180deg)' }} />
          </button>
        }
        title={profile.name}
        right={
          isOwner ? (
            <button className="btn btn-ghost" style={{
              width: 36, height: 36, padding: 0, borderRadius: 999,
              background: 'var(--t-paper)', border: '1px solid var(--t-line)',
            }}>
              <TomlIcon name="settings" size={16} />
            </button>
          ) : undefined
        }
      />

      {/* Hero */}
      <div style={{
        padding: '20px 18px 20px',
        background:
          'radial-gradient(120% 70% at 0% 0%, var(--t-rose-soft) 0%, transparent 55%),' +
          'radial-gradient(110% 70% at 100% 0%, var(--t-mustard-soft) 0%, transparent 55%),' +
          'var(--t-bg)',
        borderBottom: '1px solid var(--t-line-soft)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
          <TomlAvatar initial={profile.initial} tone={profile.avatarTone} size="xl" />
          <div style={{ flex: 1, minWidth: 0 }}>
            <h1 className="display-2" style={{ fontSize: 22, marginBottom: 2 }}>{profile.name}</h1>
            {viewerContext === 'friend' && (
              <div style={{ fontSize: 12, color: 'var(--t-success)', fontWeight: 600, marginBottom: 4 }}>
                ● Ami
              </div>
            )}
            {profile.bio && (
              <div style={{
                fontFamily: 'var(--t-font-display)', fontStyle: 'italic',
                fontWeight: 500, fontSize: 13, lineHeight: 1.35, color: 'var(--t-ink-2)',
              }}>
                « {profile.bio} »
              </div>
            )}
          </div>
        </div>

        {/* Stats */}
        <div style={{
          display: 'flex', marginBottom: 14,
          background: 'var(--t-paper)', border: '1.5px solid var(--t-ink)',
          borderRadius: 'var(--t-r-lg)', boxShadow: 'var(--t-shadow-stamp)', overflow: 'hidden',
        }}>
          <div style={{ flex: 1, textAlign: 'center', padding: '10px 4px' }}>
            <div className="display" style={{ fontSize: 24, marginBottom: 2 }}>{wishlists.length}</div>
            <div className="label" style={{ fontSize: 10 }}>Wishlists</div>
          </div>
          <div style={{ width: 1, background: 'var(--t-line)' }} />
          <div style={{ flex: 1, textAlign: 'center', padding: '10px 4px' }}>
            <div className="display" style={{ fontSize: 24, marginBottom: 2 }}>{profile.friendCount}</div>
            <div className="label" style={{ fontSize: 10 }}>Amis</div>
          </div>
        </div>

        {/* Add friend / owner actions */}
        {isOwner ? (
          <Link href="/dashboard" className="btn btn-outline btn-sm" style={{ width: '100%', textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
            <TomlIcon name="plus" size={13} />
            Nouvelle wishlist
          </Link>
        ) : viewerId ? (
          <AddFriendButton
            profileId={profile.id}
            viewerId={viewerId}
            initialStatus={friendshipStatus}
          />
        ) : null}
      </div>

      {/* Wishlists */}
      <div style={{ padding: '14px 18px 8px', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <div className="label">
          {isOwner ? 'Mes wishlists' : `Wishlists de ${profile.name}`}
        </div>
        <span style={{ fontSize: 11, color: 'var(--t-ink-3)', fontWeight: 600 }}>
          {wishlists.length} liste{wishlists.length !== 1 ? 's' : ''}
        </span>
      </div>

      {wishlists.length === 0 ? (
        <div style={{ padding: '40px 18px', textAlign: 'center', color: 'var(--t-ink-3)' }}>
          <div className="display-2" style={{ fontSize: 16, marginBottom: 8 }}>
            {isOwner ? 'Aucune wishlist pour le moment' : 'Aucune liste publique pour le moment'}
          </div>
          <div style={{ fontSize: 13, marginBottom: isOwner ? 16 : 0 }}>
            {isOwner
              ? 'Créez votre première wishlist depuis le tableau de bord.'
              : `${profile.name} n'a pas encore partagé de listes.`}
          </div>
          {isOwner && (
            <Link href="/dashboard" className="btn btn-primary btn-stamp btn-sm" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              <TomlIcon name="bookmark" size={13} />
              Tableau de bord
            </Link>
          )}
        </div>
      ) : (
        wishlists.map(w => (
          <WishlistRow key={w.id} w={w} isOwner={isOwner} />
        ))
      )}

      <div style={{ height: 24 }} />
    </HMShell>
  )
}
