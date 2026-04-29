'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createSupabaseBrowserClient } from '@/lib/supabase/client'

type Props = {
  itemId: string
  wishlistId: string
  initialReserved: boolean
  /** compact : petit bouton inline dans ItemCard. Par défaut : bouton pleine taille. */
  compact?: boolean
}

export default function ReserveButton({ itemId, wishlistId, initialReserved, compact = false }: Props) {
  const [reserved, setReserved]     = useState(initialReserved)
  // null = vérification en cours, true = l'utilisateur peut annuler, false = ne peut pas
  const [canCancel, setCanCancel]   = useState<boolean | null>(null)
  const [loading, setLoading]       = useState(false)
  const [error, setError]           = useState<string | null>(null)
  const router = useRouter()

  // Quand l'article est réservé, vérifie si c'est l'utilisateur connecté qui a réservé.
  // Par défaut on affiche le badge "Réservé" ; on switche vers "Annuler" après la vérif.
  useEffect(() => {
    if (!reserved) { setCanCancel(null); return }

    let cancelled = false

    async function check() {
      const supabase = createSupabaseBrowserClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user || cancelled) { setCanCancel(false); return }

      const { data } = await supabase
        .from('reservations')
        .select('id')
        .eq('item_id', itemId)
        .eq('reserver_user_id', user.id)
        .maybeSingle()

      if (!cancelled) setCanCancel(!!data)
    }

    check()
    return () => { cancelled = true }
  }, [itemId, reserved])

  // ── Réserver ─────────────────────────────────────────────────────────
  async function handleReserve(e: React.MouseEvent) {
    e.stopPropagation()
    e.preventDefault()
    setLoading(true)
    setError(null)

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
      setCanCancel(true) // vient de réserver → peut annuler
      setLoading(false)
    } catch {
      setError('Erreur réseau — veuillez réessayer')
      setLoading(false)
    }
  }

  // ── Annuler ──────────────────────────────────────────────────────────
  async function handleCancel(e: React.MouseEvent) {
    e.stopPropagation()
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/reserve', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itemId, wishlistId }),
      })
      const data = await res.json()

      if (!res.ok) {
        setError(data.error ?? 'Une erreur est survenue')
        setLoading(false)
        return
      }

      setReserved(false)
      setCanCancel(null)
      setLoading(false)
    } catch {
      setError('Erreur réseau — veuillez réessayer')
      setLoading(false)
    }
  }

  // ── Rendu : article réservé ──────────────────────────────────────────
  if (reserved) {
    // En attente de vérification OU autre utilisateur → badge "Réservé"
    if (!canCancel) {
      return compact ? (
        <span className="inline-flex items-center px-2 py-1 text-xs font-medium text-orange-700">
          Réservé
        </span>
      ) : (
        <span className="inline-flex items-center gap-1.5 text-sm font-medium text-orange-700 bg-orange-50 border border-orange-200 px-3 py-1.5 rounded-lg">
          Déjà réservé
        </span>
      )
    }

    // L'utilisateur courant est le réservant → bouton "Annuler"
    return compact ? (
      <button
        onClick={handleCancel}
        disabled={loading}
        aria-label="Annuler ma réservation"
        className="flex items-center gap-1 px-2 py-1 text-xs font-medium text-red-700 bg-red-100 hover:bg-red-200 disabled:opacity-50 transition-colors"
      >
        {loading ? '…' : 'Annuler'}
      </button>
    ) : (
      <div className="flex flex-col items-start gap-1.5">
        <button
          onClick={handleCancel}
          disabled={loading}
          className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? (
            <>
              <svg className="animate-spin w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              En cours…
            </>
          ) : 'Annuler ma réservation'}
        </button>
        {error && <p className="text-xs text-red-600">{error}</p>}
      </div>
    )
  }

  // ── Rendu : disponible → bouton "Offrir" ─────────────────────────────
  if (compact) {
    return (
      <>
        <button
          onClick={handleReserve}
          disabled={loading}
          aria-label="Je vais l'offrir"
          className="flex items-center gap-1 px-2 py-1 text-xs font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 disabled:opacity-50 transition-colors"
        >
          <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M12 8v13m0-13V6a2 2 0 112.83 2.83L12 11l-2.83-2.83A2 2 0 1112 6v2z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M17 8H7a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2V10a2 2 0 00-2-2z" />
          </svg>
          {loading ? '…' : 'Offrir'}
        </button>
        {error && <p className="text-xs text-red-600 mt-0.5">{error}</p>}
      </>
    )
  }

  return (
    <div className="flex flex-col items-start gap-1.5">
      <button
        onClick={handleReserve}
        disabled={loading}
        className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  )
}
