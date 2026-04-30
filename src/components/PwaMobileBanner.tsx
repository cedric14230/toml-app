'use client'

import { useState, useEffect } from 'react'

type OS = 'ios' | 'android' | null

function detectOS(): OS {
  const ua = navigator.userAgent
  if (/iphone|ipad|ipod/i.test(ua)) return 'ios'
  if (/android/i.test(ua)) return 'android'
  return null
}

/**
 * Bannière mobile adaptée à l'OS :
 * - iOS     → invite à installer la PWA via Safari (écran d'accueil)
 * - Android → invite à partager via Chrome
 * - Desktop → masquée
 *
 * Disparaît si l'app est déjà en mode standalone ou si l'utilisateur a fermé.
 */
export default function PwaMobileBanner() {
  const [os, setOs]               = useState<OS>(null)
  const [visible, setVisible]     = useState(false)
  const [modalOpen, setModalOpen] = useState(false)

  useEffect(() => {
    const detectedOs = detectOS()
    if (!detectedOs) return // desktop → rien à faire

    const dismissed  = localStorage.getItem('toml-pwa-banner') === 'dismissed'
    const standalone = window.matchMedia('(display-mode: standalone)').matches
    if (!dismissed && !standalone) {
      setOs(detectedOs)
      setVisible(true)
    }
  }, [])

  function handleDismiss() {
    localStorage.setItem('toml-pwa-banner', 'dismissed')
    setVisible(false)
  }

  if (!visible || !os) return null

  // ── Textes selon l'OS ──────────────────────────────────────────────────────
  const bannerTitle = os === 'ios'
    ? 'Installez TOML sur votre écran d\'accueil 📱'
    : 'Sur mobile\u00a0: partagez n\'importe quelle page vers TOML'

  const bannerSubtitle = os === 'ios'
    ? 'Accédez à TOML en 1 tap, comme une vraie app'
    : 'Installez l\'app pour accéder au partage natif.'

  return (
    <>
      {/* ── Bannière ── */}
      <div className="mt-6 flex items-start gap-3 bg-gray-900 text-white rounded-2xl px-4 py-4">
        <div className="flex-none w-8 h-8 bg-white text-black rounded-lg flex items-center justify-center font-bold text-sm select-none">
          T
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium leading-snug">{bannerTitle}</p>
          <p className="text-xs text-gray-400 mt-0.5 leading-snug">{bannerSubtitle}</p>
          <button
            onClick={() => setModalOpen(true)}
            className="mt-2 text-xs font-semibold text-white underline underline-offset-2 hover:opacity-80 transition-opacity"
          >
            Comment faire ?
          </button>
        </div>
        <button
          onClick={handleDismiss}
          aria-label="Fermer"
          className="flex-none p-1 text-gray-400 hover:text-white transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* ── Modal d'instructions ── */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm"
          onClick={e => { if (e.target === e.currentTarget) setModalOpen(false) }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="pwa-modal-title"
            className="bg-white w-full sm:max-w-md rounded-t-2xl sm:rounded-2xl shadow-2xl"
          >
            {/* En-tête */}
            <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-gray-100">
              <h2 id="pwa-modal-title" className="text-base font-semibold text-gray-900">
                {os === 'ios' ? 'Installer TOML sur iPhone' : 'Partager vers TOML sur Android'}
              </h2>
              <button
                onClick={() => setModalOpen(false)}
                aria-label="Fermer"
                className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="px-6 py-5">
              {os === 'ios' ? (
                /* ── Instructions iOS ── */
                <ol className="space-y-3 text-sm text-gray-600">
                  <li className="flex gap-2.5">
                    <span className="flex-none w-5 h-5 bg-gray-900 text-white rounded-full flex items-center justify-center text-xs font-bold">1</span>
                    <span>
                      Appuyez sur l&apos;icône <strong>Partager</strong>{' '}
                      <span className="inline-block text-base leading-none align-middle" aria-hidden="true">⬆️</span>{' '}
                      en bas de Safari
                    </span>
                  </li>
                  <li className="flex gap-2.5">
                    <span className="flex-none w-5 h-5 bg-gray-900 text-white rounded-full flex items-center justify-center text-xs font-bold">2</span>
                    <span>
                      Faites défiler et appuyez sur <strong>« Sur l&apos;écran d&apos;accueil »</strong>
                    </span>
                  </li>
                  <li className="flex gap-2.5">
                    <span className="flex-none w-5 h-5 bg-gray-900 text-white rounded-full flex items-center justify-center text-xs font-bold">3</span>
                    <span>
                      Appuyez sur <strong>« Ajouter »</strong> — TOML apparaît sur votre écran d&apos;accueil&nbsp;!
                    </span>
                  </li>
                </ol>
              ) : (
                /* ── Instructions Android ── */
                <ol className="space-y-3 text-sm text-gray-600">
                  <li className="flex gap-2.5">
                    <span className="flex-none w-5 h-5 bg-gray-900 text-white rounded-full flex items-center justify-center text-xs font-bold">1</span>
                    <span>
                      Appuyez sur le menu <strong>⋮</strong> (trois points) en haut à droite de Chrome
                    </span>
                  </li>
                  <li className="flex gap-2.5">
                    <span className="flex-none w-5 h-5 bg-gray-900 text-white rounded-full flex items-center justify-center text-xs font-bold">2</span>
                    <span>
                      Sélectionnez <strong>« Ajouter à l&apos;écran d&apos;accueil »</strong>
                    </span>
                  </li>
                  <li className="flex gap-2.5">
                    <span className="flex-none w-5 h-5 bg-gray-900 text-white rounded-full flex items-center justify-center text-xs font-bold">3</span>
                    <span>
                      Sur n&apos;importe quelle page web, appuyez sur <strong>Partager</strong> → choisissez <strong>TOML</strong>
                    </span>
                  </li>
                </ol>
              )}

              <p className="text-xs text-gray-400 text-center leading-relaxed mt-5">
                {os === 'ios'
                  ? 'Une fois installée, TOML s\'ouvre directement comme une app.'
                  : 'Une fois installée, TOML apparaîtra dans la liste de partage de votre système.'}
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
