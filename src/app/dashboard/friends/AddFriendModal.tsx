'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'

type SearchResult = {
  id: string
  name: string | null
  email: string | null
  avatar_url: string | null
  friendshipStatus: string | null
  friendshipDirection: 'sent' | 'received' | null
}

/**
 * Modal "Ajouter un ami".
 *
 * - Recherche en temps réel (300 ms de debounce) via GET /api/friends/search.
 * - Affiche avatar, nom et email de chaque résultat.
 * - Bouton "Ajouter" → POST /api/friends.
 * - L'état de chaque résultat reflète la relation existante :
 *     null           → bouton "Ajouter"
 *     pending sent   → "En attente…"
 *     pending recv.  → "Demande reçue"
 *     accepted       → "Déjà ami"
 * - router.refresh() après envoi pour rafraîchir le Server Component parent.
 */
export default function AddFriendModal({ onClose }: { onClose: () => void }) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [sending, setSending] = useState<string | null>(null) // userId en cours d'envoi
  const [sent, setSent] = useState<Set<string>>(new Set())
  const [error, setError] = useState<string | null>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  // Focus automatique à l'ouverture
  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  // Fermeture sur Escape
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  function handleSearch(value: string) {
    setQuery(value)
    setError(null)
    if (debounceRef.current) clearTimeout(debounceRef.current)

    if (value.trim().length < 2) {
      setResults([])
      return
    }

    setLoading(true)
    debounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch(
          `/api/friends/search?q=${encodeURIComponent(value.trim())}`
        )
        const data = await res.json()
        setResults(data.users ?? [])
      } catch {
        setError('Erreur réseau — veuillez réessayer')
      } finally {
        setLoading(false)
      }
    }, 300)
  }

  async function handleAdd(targetUserId: string) {
    setSending(targetUserId)
    setError(null)
    try {
      const res = await fetch('/api/friends', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetUserId }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error ?? 'Une erreur est survenue')
        return
      }
      setSent((prev) => new Set(prev).add(targetUserId))
      router.refresh()
    } catch {
      setError('Erreur réseau — veuillez réessayer')
    } finally {
      setSending(null)
    }
  }

  function statusLabel(result: SearchResult): {
    label: string
    disabled: boolean
  } {
    if (sent.has(result.id)) return { label: 'Demande envoyée ✓', disabled: true }
    if (!result.friendshipStatus) return { label: 'Ajouter', disabled: false }
    if (result.friendshipStatus === 'accepted') return { label: 'Déjà ami', disabled: true }
    if (result.friendshipStatus === 'pending' && result.friendshipDirection === 'sent')
      return { label: 'En attente…', disabled: true }
    if (result.friendshipStatus === 'pending' && result.friendshipDirection === 'received')
      return { label: 'Demande reçue', disabled: true }
    return { label: 'Ajouter', disabled: false }
  }

  return (
    /* Overlay */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md flex flex-col max-h-[80vh]">

        {/* En-tête */}
        <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-gray-100">
          <h2 className="text-base font-semibold text-gray-900">Ajouter un ami</h2>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-600"
            aria-label="Fermer"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Champ de recherche */}
        <div className="px-5 pt-4 pb-2">
          <div className="relative">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
            </svg>
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Rechercher par nom ou email…"
              className="w-full pl-9 pr-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent placeholder:text-gray-400"
            />
          </div>
          {error && (
            <p className="mt-2 text-xs text-red-600">{error}</p>
          )}
        </div>

        {/* Résultats */}
        <div className="flex-1 overflow-y-auto px-5 pb-5">
          {loading && (
            <div className="flex justify-center py-6">
              <svg className="animate-spin w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            </div>
          )}

          {!loading && query.trim().length >= 2 && results.length === 0 && (
            <p className="text-sm text-gray-400 text-center py-6">
              Aucun utilisateur trouvé
            </p>
          )}

          {!loading && results.length > 0 && (
            <ul className="space-y-2 mt-2">
              {results.map((result) => {
                const { label, disabled } = statusLabel(result)
                const isSending = sending === result.id
                const displayName = result.name ?? result.email ?? 'Utilisateur'
                const initial = displayName.charAt(0).toUpperCase()

                return (
                  <li key={result.id} className="flex items-center gap-3 py-2">
                    {/* Avatar */}
                    {result.avatar_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={result.avatar_url}
                        alt={displayName}
                        className="w-9 h-9 rounded-full object-cover ring-1 ring-gray-200 flex-shrink-0"
                      />
                    ) : (
                      <div className="w-9 h-9 rounded-full bg-gray-900 flex items-center justify-center flex-shrink-0">
                        <span className="text-xs font-semibold text-white select-none">
                          {initial}
                        </span>
                      </div>
                    )}

                    {/* Nom + email */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {result.name ?? '—'}
                      </p>
                      <p className="text-xs text-gray-400 truncate">{result.email}</p>
                    </div>

                    {/* Bouton */}
                    <button
                      onClick={() => !disabled && handleAdd(result.id)}
                      disabled={disabled || isSending}
                      className={`flex-shrink-0 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                        disabled || isSending
                          ? 'bg-gray-100 text-gray-400 cursor-default'
                          : 'bg-gray-900 text-white hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-1'
                      }`}
                    >
                      {isSending ? (
                        <svg className="animate-spin w-3.5 h-3.5" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                      ) : (
                        label
                      )}
                    </button>
                  </li>
                )
              })}
            </ul>
          )}

          {query.trim().length < 2 && (
            <p className="text-xs text-gray-400 text-center py-6">
              Saisissez au moins 2 caractères pour rechercher
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
