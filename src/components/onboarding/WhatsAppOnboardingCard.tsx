'use client'

import { useState } from 'react'
import { useIsMobile } from '@/hooks/useIsMobile'

type Props = {
  phoneVerified: boolean
}

export default function WhatsAppOnboardingCard({ phoneVerified }: Props) {
  const isMobile = useIsMobile()

  const [sheetOpen, setSheetOpen]   = useState(false)
  const [phone, setPhone]           = useState('')
  const [sending, setSending]       = useState(false)
  const [sent, setSent]             = useState(false)
  const [error, setError]           = useState<string | null>(null)

  // N'afficher que sur mobile et si le numéro n'est pas encore vérifié
  if (!isMobile || phoneVerified) return null

  async function handleSend() {
    setSending(true)
    setError(null)
    try {
      const res = await fetch('/api/whatsapp/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error ?? 'Erreur inconnue.')
      } else {
        setSent(true)
      }
    } catch {
      setError('Impossible de contacter le serveur.')
    } finally {
      setSending(false)
    }
  }

  function handleClose() {
    setSheetOpen(false)
    setSent(false)
    setPhone('')
    setError(null)
  }

  return (
    <>
      {/* ── Carte d'accroche ── */}
      <div className="mb-6 rounded-2xl bg-green-50 border border-green-100 p-5">
        <div className="flex items-start gap-4">
          {/* Icône WhatsApp */}
          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-green-500 flex items-center justify-center">
            <svg viewBox="0 0 24 24" fill="white" className="w-5 h-5" aria-hidden="true">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
          </div>

          {/* Texte */}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-900 leading-snug">
              Ajoutez des articles en 2 secondes ⚡
            </p>
            <p className="mt-1 text-xs text-gray-600 leading-relaxed">
              Envoyez n&apos;importe quel lien produit sur WhatsApp → il apparaît dans votre wishlist. Magique.
            </p>
            <button
              type="button"
              onClick={() => setSheetOpen(true)}
              className="mt-3 inline-flex items-center gap-1.5 px-4 py-2 bg-green-500 hover:bg-green-600 text-white text-xs font-semibold rounded-full transition-colors"
            >
              📱 Activer mon numéro WhatsApp
            </button>
          </div>
        </div>
      </div>

      {/* ── Bottom sheet ── */}
      {sheetOpen && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black/40 z-40"
            onClick={handleClose}
            aria-hidden="true"
          />

          {/* Panel */}
          <div className="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-2xl px-5 pt-5 pb-8 shadow-xl">
            {/* Poignée + fermer */}
            <div className="flex items-center justify-between mb-5">
              <div className="w-8 h-1 rounded-full bg-gray-200 mx-auto absolute left-1/2 -translate-x-1/2 top-3" />
              <h2 className="text-base font-semibold text-gray-900">Mon numéro WhatsApp</h2>
              <button
                type="button"
                onClick={handleClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="Fermer"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {sent ? (
              /* Confirmation */
              <div className="text-center py-6">
                <p className="text-2xl mb-2">📲</p>
                <p className="text-sm font-semibold text-gray-900">Lien envoyé !</p>
                <p className="text-xs text-gray-500 mt-1">Vérifie tes messages WhatsApp et clique sur le lien pour confirmer.</p>
                <button
                  type="button"
                  onClick={handleClose}
                  className="mt-5 text-xs text-gray-400 underline hover:text-gray-600 transition-colors"
                >
                  Fermer
                </button>
              </div>
            ) : (
              /* Formulaire */
              <div className="flex flex-col gap-3">
                <p className="text-xs text-gray-500">
                  Entre ton numéro au format international pour recevoir un lien de vérification.
                </p>
                <input
                  type="tel"
                  value={phone}
                  onChange={e => { setPhone(e.target.value); setError(null) }}
                  placeholder="+33612345678"
                  autoFocus
                  className="w-full px-3 py-3 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
                {error && (
                  <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                    {error}
                  </p>
                )}
                <button
                  type="button"
                  onClick={handleSend}
                  disabled={sending || !phone.trim()}
                  className="w-full py-3 bg-green-500 hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-xl transition-colors"
                >
                  {sending ? 'Envoi…' : 'Envoyer le lien de vérification'}
                </button>
                <p className="text-xs text-center text-gray-400">Format international requis · ex : +33612345678</p>
              </div>
            )}
          </div>
        </>
      )}
    </>
  )
}
