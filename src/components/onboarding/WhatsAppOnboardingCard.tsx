'use client'

import { useState } from 'react'
import { useIsMobile } from '@/hooks/useIsMobile'

type Props = {
  phoneVerified: boolean
}

export default function WhatsAppOnboardingCard({ phoneVerified }: Props) {
  const isMobile = useIsMobile()

  const [sending, setSending] = useState(false)
  const [opened, setOpened]   = useState(false)
  const [error, setError]     = useState<string | null>(null)

  // N'afficher que sur mobile et si le numéro n'est pas encore vérifié
  if (!isMobile || phoneVerified) return null

  async function handleConnect() {
    setSending(true)
    setError(null)
    try {
      const res = await fetch('/api/whatsapp/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error ?? 'Erreur inconnue.')
      } else {
        window.open(data.waUrl, '_blank')
        setOpened(true)
      }
    } catch {
      setError('Impossible de contacter le serveur.')
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="mb-6 rounded-2xl bg-green-50 border border-green-100 p-5">
      <div className="flex items-start gap-4">
        {/* Icône WhatsApp */}
        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-green-500 flex items-center justify-center">
          <svg viewBox="0 0 24 24" fill="white" className="w-5 h-5" aria-hidden="true">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
        </div>

        {/* Texte + bouton */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-gray-900 leading-snug">
            Ajoutez des articles en 2 secondes ⚡
          </p>
          <p className="mt-1 text-xs text-gray-600 leading-relaxed">
            Envoyez n&apos;importe quel lien produit à TOML sur WhatsApp → il apparaît dans votre wishlist. Commencez par connecter votre numéro.
          </p>

          <button
            type="button"
            onClick={handleConnect}
            disabled={sending}
            className="mt-3 inline-flex items-center gap-1.5 px-4 py-2 bg-green-500 hover:bg-green-600 disabled:opacity-60 disabled:cursor-not-allowed text-white text-xs font-semibold rounded-full transition-colors"
          >
            {sending
              ? 'Ouverture de WhatsApp...'
              : opened
              ? 'Message envoyé ? Revenez ici dans quelques secondes'
              : '📱 Connecter WhatsApp'}
          </button>

          {opened && !error && (
            <p className="mt-2 text-xs text-gray-500 leading-relaxed">
              WhatsApp s&apos;est ouvert avec un message pré-rempli. Envoyez-le pour connecter votre compte.
            </p>
          )}

          {error && (
            <p className="mt-2 text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
              {error}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
