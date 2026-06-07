'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { HDShell } from '@/components/landing/shells'
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

// ── Wishlist card ─────────────────────────────────────────────────────────────

const WishlistCardItem = ({ w, isOwner }: { w: WishlistCard; isOwner: boolean }) => (
  <Link href={`/wishlist/${w.id}`} style={{ textDecoration: 'none', display: 'block' }}>
    <div className="card" style={{ padding: 0, overflow: 'hidden', cursor: 'pointer' }}>
      <div
        className={`img img-${w.tone}`}
        style={{ height: 140, position: 'relative' }}
      >
        {isOwner && w.visibility !== 'public' && (
          <span
            className="chip chip-mustard"
            style={{ position: 'absolute', top: 10, right: 10, fontSize: 10, display: 'flex', alignItems: 'center', gap: 4 }}
          >
            <TomlIcon name={VIS_ICON[w.visibility]} size={9} />
            {VIS_LABEL[w.visibility]}
          </span>
        )}
      </div>
      <div style={{ padding: '12px 14px' }}>
        <div className="display-2" style={{ fontSize: 15, marginBottom: 4 }}>{w.title}</div>
        <div style={{ fontSize: 12, color: 'var(--t-ink-3)', fontWeight: 600 }}>
          {w.itemCount} article{w.itemCount !== 1 ? 's' : ''}
        </div>
      </div>
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
      <Link href="/friends" className="btn btn-outline" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
        <TomlIcon name="check" size={14} />
        Demande reçue — Répondre
      </Link>
    )
  }

  return (
    <button
      className="btn btn-primary btn-stamp"
      onClick={handleAdd}
      disabled={loading || status === 'pending_out'}
    >
      <TomlIcon name={status === 'pending_out' ? 'check' : 'plus'} size={14} />
      {loading ? 'Envoi…' : status === 'pending_out' ? 'Demande envoyée' : 'Ajouter en ami'}
    </button>
  )
}

// ── Desktop profile ───────────────────────────────────────────────────────────

export const HDProfile = ({
  profile,
  wishlists,
  viewerContext,
  friendshipStatus,
  viewerId,
}: ProfilePageProps) => {
  const router = useRouter()
  const isOwner = viewerContext === 'owner'

  return (
    <HDShell active="" authed>
      <div style={{ padding: '24px 40px 60px' }}>

        {/* Retour */}
        <button
          onClick={() => router.back()}
          style={{
            fontSize: 13, color: 'var(--t-ink-3)', marginBottom: 18,
            display: 'inline-flex', alignItems: 'center', gap: 6,
            fontWeight: 600, background: 'none', border: 'none',
            cursor: 'pointer', padding: 0,
          }}
        >
          <TomlIcon name="arrow" size={12} style={{ transform: 'rotate(180deg)' }} />
          Retour
        </button>

        {/* Hero */}
        <div style={{
          background:
            'radial-gradient(80% 60% at 0% 0%, var(--t-rose-soft) 0%, transparent 60%),' +
            'radial-gradient(70% 60% at 100% 0%, var(--t-mustard-soft) 0%, transparent 60%),' +
            'var(--t-paper)',
          border: '1.5px solid var(--t-ink)', borderRadius: 'var(--t-r-xl)',
          boxShadow: 'var(--t-shadow-stamp-lg)', padding: 32, marginBottom: 32,
          display: 'flex', alignItems: 'center', gap: 32,
        }}>
          <TomlAvatar
            initial={profile.initial}
            tone={profile.avatarTone}
            size="xl"
            style={{ width: 110, height: 110, fontSize: 44, flexShrink: 0 }}
          />

          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="label" style={{ marginBottom: 6 }}>
              {viewerContext === 'friend' && (
                <span style={{ color: 'var(--t-success)', marginRight: 8 }}>● Ami</span>
              )}
              Profil
            </div>
            <h1 className="display-2" style={{ fontSize: 36, marginBottom: 4, letterSpacing: '-0.02em' }}>
              {profile.name}
            </h1>
            {profile.bio && (
              <div style={{
                fontFamily: 'var(--t-font-display)', fontStyle: 'italic', fontWeight: 500,
                fontSize: 16, marginBottom: 18, lineHeight: 1.35, maxWidth: 480, color: 'var(--t-ink-2)',
              }}>
                « {profile.bio} »
              </div>
            )}
            <div style={{ display: 'flex', gap: 10, marginTop: profile.bio ? 0 : 14 }}>
              {isOwner ? (
                <button className="btn btn-outline">
                  <TomlIcon name="edit" size={14} />
                  Modifier le profil
                </button>
              ) : viewerId ? (
                <AddFriendButton
                  profileId={profile.id}
                  viewerId={viewerId}
                  initialStatus={friendshipStatus}
                />
              ) : null}
            </div>
          </div>

          {/* Stats */}
          <div style={{
            display: 'flex', flexDirection: 'column',
            background: 'var(--t-paper)', border: '1.5px solid var(--t-ink)',
            borderRadius: 'var(--t-r-lg)', boxShadow: 'var(--t-shadow-stamp)',
            minWidth: 200, overflow: 'hidden', flexShrink: 0,
          }}>
            <div style={{ flex: 1, textAlign: 'center', padding: '14px 4px' }}>
              <div className="display" style={{ fontSize: 32, marginBottom: 4 }}>{wishlists.length}</div>
              <div className="label" style={{ fontSize: 10 }}>
                {viewerContext === 'owner' ? 'Mes wishlists' : 'Wishlists'}
              </div>
            </div>
            <div style={{ height: 1, background: 'var(--t-line)' }} />
            <div style={{ flex: 1, textAlign: 'center', padding: '14px 4px' }}>
              <div className="display" style={{ fontSize: 32, marginBottom: 4 }}>{profile.friendCount}</div>
              <div className="label" style={{ fontSize: 10 }}>Amis</div>
            </div>
          </div>
        </div>

        {/* Wishlists */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 16 }}>
          <h2 className="display-2" style={{ fontSize: 22 }}>
            {isOwner ? 'Mes wishlists' : `Wishlists de ${profile.name}`}
          </h2>
          {isOwner && (
            <Link href="/dashboard" className="btn btn-primary btn-stamp" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              <TomlIcon name="plus" size={13} />
              Nouvelle wishlist
            </Link>
          )}
        </div>

        {wishlists.length === 0 ? (
          <div style={{ padding: '60px 24px', textAlign: 'center', color: 'var(--t-ink-3)' }}>
            <div className="display-2" style={{ fontSize: 18, marginBottom: 10 }}>
              {isOwner ? 'Aucune wishlist pour le moment' : 'Aucune liste publique pour le moment'}
            </div>
            <div style={{ fontSize: 13, marginBottom: 20 }}>
              {isOwner
                ? 'Créez votre première wishlist depuis le tableau de bord.'
                : `${profile.name} n'a pas encore partagé de listes.`}
            </div>
            {isOwner && (
              <Link href="/dashboard" className="btn btn-primary btn-stamp" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                <TomlIcon name="bookmark" size={14} />
                Aller au tableau de bord
              </Link>
            )}
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 18 }}>
            {wishlists.map(w => (
              <WishlistCardItem key={w.id} w={w} isOwner={isOwner} />
            ))}
          </div>
        )}
      </div>
    </HDShell>
  )
}
