'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import AddFriendModal from './AddFriendModal'

export type UserProfile = {
  id: string
  name: string | null
  email: string | null
  avatar_url: string | null
}

export type FriendEntry = {
  friendshipId: string
  user: UserProfile
}

type Props = {
  friends: FriendEntry[]
  received: FriendEntry[]
  sent: FriendEntry[]
}

/**
 * Composant client principal de la page /dashboard/friends.
 *
 * Reçoit les données initiales du Server Component parent (déjà
 * pré-chargées côté serveur) et gère :
 *  - L'ouverture/fermeture du modal "Ajouter un ami"
 *  - L'acceptation et le refus des demandes reçues (PATCH /api/friends/[id])
 *  - router.refresh() après chaque action pour resynchroniser le Server Component
 */
export default function FriendsClient({ friends, received, sent }: Props) {
  const [modalOpen, setModalOpen] = useState(false)
  const [acting, setActing] = useState<string | null>(null) // friendshipId en cours de traitement
  const [actionError, setActionError] = useState<string | null>(null)
  const router = useRouter()

  async function handleAction(friendshipId: string, action: 'accept' | 'reject') {
    setActing(friendshipId)
    setActionError(null)
    try {
      const res = await fetch(`/api/friends/${friendshipId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
      })
      const data = await res.json()
      if (!res.ok) {
        setActionError(data.error ?? 'Une erreur est survenue')
        return
      }
      router.refresh()
    } catch {
      setActionError('Erreur réseau — veuillez réessayer')
    } finally {
      setActing(null)
    }
  }

  return (
    <>
      {/* Bouton principal */}
      <button
        onClick={() => setModalOpen(true)}
        className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 transition-colors"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
        </svg>
        Ajouter un ami
      </button>

      {actionError && (
        <p className="mt-3 text-sm text-red-600">{actionError}</p>
      )}

      {/* ── Demandes reçues ─────────────────────────────────────── */}
      {received.length > 0 && (
        <section className="mt-8">
          <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
            Demandes reçues
            <span className="ml-2 bg-gray-900 text-white text-xs font-medium px-1.5 py-0.5 rounded-full">
              {received.length}
            </span>
          </h2>
          <ul className="space-y-2">
            {received.map(({ friendshipId, user }) => (
              <li
                key={friendshipId}
                className="flex items-center gap-3 bg-white border border-gray-200 rounded-xl px-4 py-3"
              >
                <UserAvatar user={user} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {user.name ?? user.email ?? 'Utilisateur'}
                  </p>
                  {user.email && user.name && (
                    <p className="text-xs text-gray-400 truncate">{user.email}</p>
                  )}
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => handleAction(friendshipId, 'accept')}
                    disabled={acting === friendshipId}
                    className="px-3 py-1.5 text-xs font-medium bg-gray-900 text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 transition-colors"
                  >
                    {acting === friendshipId ? '…' : 'Accepter'}
                  </button>
                  <button
                    onClick={() => handleAction(friendshipId, 'reject')}
                    disabled={acting === friendshipId}
                    className="px-3 py-1.5 text-xs font-medium text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-colors"
                  >
                    Refuser
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* ── Mes amis ────────────────────────────────────────────── */}
      <section className="mt-8">
        <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
          Mes amis
          {friends.length > 0 && (
            <span className="ml-2 text-gray-400 font-normal normal-case tracking-normal">
              ({friends.length})
            </span>
          )}
        </h2>

        {friends.length === 0 ? (
          <div className="text-center py-10 text-gray-400 text-sm">
            Vous n'avez pas encore d'amis.
            <br />
            <button
              onClick={() => setModalOpen(true)}
              className="mt-2 text-gray-900 underline underline-offset-2 font-medium hover:opacity-70 transition-opacity"
            >
              Ajouter quelqu'un
            </button>
          </div>
        ) : (
          <ul className="space-y-2">
            {friends.map(({ friendshipId, user }) => (
              <li
                key={friendshipId}
                className="flex items-center gap-3 bg-white border border-gray-200 rounded-xl px-4 py-3 hover:border-gray-300 transition-colors"
              >
                <UserAvatar user={user} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {user.name ?? user.email ?? 'Utilisateur'}
                  </p>
                  {user.email && user.name && (
                    <p className="text-xs text-gray-400 truncate">{user.email}</p>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* ── Demandes envoyées ───────────────────────────────────── */}
      {sent.length > 0 && (
        <section className="mt-8">
          <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
            Demandes envoyées
          </h2>
          <ul className="space-y-2">
            {sent.map(({ friendshipId, user }) => (
              <li
                key={friendshipId}
                className="flex items-center gap-3 bg-white border border-gray-200 rounded-xl px-4 py-3"
              >
                <UserAvatar user={user} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {user.name ?? user.email ?? 'Utilisateur'}
                  </p>
                  {user.email && user.name && (
                    <p className="text-xs text-gray-400 truncate">{user.email}</p>
                  )}
                </div>
                <span className="flex-shrink-0 text-xs text-gray-400 font-medium">
                  En attente…
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Modal */}
      {modalOpen && <AddFriendModal onClose={() => setModalOpen(false)} />}
    </>
  )
}

/** Avatar réutilisable : photo ou initiale sur fond sombre */
function UserAvatar({ user }: { user: UserProfile }) {
  const displayName = user.name ?? user.email ?? 'U'
  const initial = displayName.charAt(0).toUpperCase()

  return user.avatar_url ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={user.avatar_url}
      alt={displayName}
      className="w-9 h-9 rounded-full object-cover ring-1 ring-gray-200 flex-shrink-0"
    />
  ) : (
    <div className="w-9 h-9 rounded-full bg-gray-900 flex items-center justify-center flex-shrink-0">
      <span className="text-xs font-semibold text-white select-none">{initial}</span>
    </div>
  )
}
