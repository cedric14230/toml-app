'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createSupabaseBrowserClient } from '@/lib/supabase/client'

type Props = {
  itemId: string
  wishlistId: string
  initialReserved: boolean
}

/**
 * Bouton "Je vais l'offrir" affiché sur la page publique /w/[id].
 *
 * - Non connecté  → redirige vers /auth/login?redirectTo=/w/[wishlistId]
 * - Connecté      → POST /api/reserve ; passe en état "réservé" localement
 *
 * L'état est local (optimiste) : on ne recharge pas la page après réservation.
 * Si l'utilisateur rafraîchit, le statut serveur (réservé) est reflété via
 * la props initialReserved.
 */
export default function ReserveButton({ itemId, wishlistId, initialReserved }: Props) {
  const [reserved, setReserved] = useState(initialReserved)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  if (reserved) {
    return (
      <span className="inline-flex items-center gap-1.5 text-sm font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-lg">
        <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
        Déjà réservé
      </span>
    )
  }

  async function handleClick() {
    setLoading(true)
    setError(null)

    // Vérification côté client (évite un aller-retour serveur inutile)
    const supabase = createSupabaseBrowserClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      router.push(`/auth/login?redirectTo=/w/${wishlistId}`)
      return
    }

    try {
      const res = await fetch('/api/reserve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itemId, wishlistId }),
      })
      const data = await res.json()

      if (!res.ok) {
        setError(data.error ?? 'Une erreur est survenue')
        setLoading(false)
        return
      }

      setReserved(true)
    } catch {
      setError('Erreur réseau — veuillez réessayer')
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col items-end gap-1.5">
      <button
        onClick={handleClick}
        disabled={loading}
        className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {loading ? (
          <>
            <svg className="animate-spin w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" aria-hidden="true">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            En cours…
          </>
        ) : (
          <>
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M12 8v13m0-13V6a2 2 0 112.83 2.83L12 11l-2.83-2.83A2 2 0 1112 6v2z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M17 8H7a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2V10a2 2 0 00-2-2z" />
            </svg>
            Je vais l&apos;offrir
          </>
        )}
      </button>
      {error && (
        <p className="text-xs text-red-600">{error}</p>
      )}
    </div>
  )
}
