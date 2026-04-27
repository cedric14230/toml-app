'use client'

import { useState, useEffect } from 'react'

/**
 * Bannière visible uniquement sur mobile (md:hidden via Tailwind).
 * Explique comment installer TOML comme PWA pour accéder au partage natif.
 *
 * - Disparaît si l'app est déjà installée en mode standalone
 * - Peut être fermée définitivement (stocké dans localStorage)
 */
export default function PwaMobileBanner() {
  const [visible, setVisible] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)

  useEffect(() => {
    const dismissed = localStorage.getItem('toml-pwa-banner') === 'dismissed'
    const standalone = window.matchMedia('(display-mode: standalone)').matches
    if (!dismissed && !standalone) setVisible(true)
  }, [])

  function handleDismiss() {
    localStorage.setItem('toml-pwa-banner', 'dismissed')
    setVisible(false)
  }

  if (!visible) return null

  return (
    <>
      {/* Bannière */}
      <div className="md:hidden mt-6 flex items-start gap-3 bg-gray-900 text-white rounded-2xl px-4 py-4">
        <div className="flex-none w-8 h-8 bg-white text-black rounded-lg flex items-center justify-center font-bold text-sm select-none">
          T
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium leading-snug">
            Sur mobile&nbsp;: partagez n&apos;importe quelle page vers TOML
          </p>
          <p className="text-xs text-gray-400 mt-0.5 leading-snug">
            Installez l&apos;app pour accéder au partage natif.
          </p>
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

      {/* Modal d'instructions */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm"
          onClick={(e) => { if (e.target === e.currentTarget) setModalOpen(false) }}
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
                Installer TOML sur votre téléphone
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

            <div className="px-6 py-5 space-y-6">
              {/* iOS */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-lg" aria-hidden="true">🍎</span>
                  <h3 className="text-sm font-semibold text-gray-900">iPhone / iOS Safari</h3>
                </div>
                <ol className="space-y-2.5 text-sm text-gray-600">
                  <li className="flex gap-2.5">
                    <span className="flex-none w-5 h-5 bg-gray-900 text-white rounded-full flex items-center justify-center text-xs font-bold">1</span>
                    <span>
                      Ouvrez <strong>safari.app</strong> et naviguez vers{' '}
                      <span className="font-mono text-xs bg-gray-100 px-1.5 py-0.5 rounded">toml-app.vercel.app</span>
                    </span>
                  </li>
                  <li className="flex gap-2.5">
                    <span className="flex-none w-5 h-5 bg-gray-900 text-white rounded-full flex items-center justify-center text-xs font-bold">2</span>
                    <span>
                      Appuyez sur l&apos;icône <strong>Partager</strong>{' '}
                      <span className="inline-block text-base leading-none align-middle" aria-hidden="true">⬆️</span>{' '}
                      en bas de l&apos;écran
                    </span>
                  </li>
                  <li className="flex gap-2.5">
                    <span className="flex-none w-5 h-5 bg-gray-900 text-white rounded-full flex items-center justify-center text-xs font-bold">3</span>
                    <span>
                      Faites défiler et appuyez sur{' '}
                      <strong>« Sur l&apos;écran d&apos;accueil »</strong>
                    </span>
                  </li>
                  <li className="flex gap-2.5">
                    <span className="flex-none w-5 h-5 bg-gray-900 text-white rounded-full flex items-center justify-center text-xs font-bold">4</span>
                    <span>
                      Sur n&apos;importe quelle page web, appuyez sur <strong>Partager</strong> → choisissez <strong>TOML</strong> dans la liste
                    </span>
                  </li>
                </ol>
              </div>

              {/* Séparateur */}
              <div className="h-px bg-gray-100" />

              {/* Android */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-lg" aria-hidden="true">🤖</span>
                  <h3 className="text-sm font-semibold text-gray-900">Android Chrome</h3>
                </div>
                <ol className="space-y-2.5 text-sm text-gray-600">
                  <li className="flex gap-2.5">
                    <span className="flex-none w-5 h-5 bg-gray-900 text-white rounded-full flex items-center justify-center text-xs font-bold">1</span>
                    <span>
                      Ouvrez <strong>Chrome</strong> et naviguez vers{' '}
                      <span className="font-mono text-xs bg-gray-100 px-1.5 py-0.5 rounded">toml-app.vercel.app</span>
                    </span>
                  </li>
                  <li className="flex gap-2.5">
                    <span className="flex-none w-5 h-5 bg-gray-900 text-white rounded-full flex items-center justify-center text-xs font-bold">2</span>
                    <span>
                      Appuyez sur le menu <strong>⋮</strong> (trois points) en haut à droite
                    </span>
                  </li>
                  <li className="flex gap-2.5">
                    <span className="flex-none w-5 h-5 bg-gray-900 text-white rounded-full flex items-center justify-center text-xs font-bold">3</span>
                    <span>
                      Sélectionnez <strong>« Ajouter à l&apos;écran d&apos;accueil »</strong>
                    </span>
                  </li>
                  <li className="flex gap-2.5">
                    <span className="flex-none w-5 h-5 bg-gray-900 text-white rounded-full flex items-center justify-center text-xs font-bold">4</span>
                    <span>
                      Sur n&apos;importe quelle page web, appuyez sur <strong>Partager</strong> → choisissez <strong>TOML</strong>
                    </span>
                  </li>
                </ol>
              </div>

              {/* Note */}
              <p className="text-xs text-gray-400 text-center leading-relaxed">
                Une fois installée, TOML apparaîtra dans la liste de partage de votre système.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
