'use client'

import { useState } from 'react'

/**
 * Bouton "Partager" affiché sur la page de détail d'une wishlist.
 *
 * Au clic :
 *  1. Construit l'URL publique /w/[wishlistId] avec l'origine courante.
 *  2. Copie cette URL dans le presse-papier via l'API Clipboard.
 *  3. Affiche "Lien copié !" pendant 2 secondes puis revient à l'état initial.
 *
 * Le composant est isolé dans un Client Component pour ne pas alourdir
 * le Server Component parent (qui reste entièrement serveur).
 */
export default function ShareButton({ wishlistId }: { wishlistId: string }) {
  const [copied, setCopied] = useState(false)

  async function handleShare() {
    const url = `${window.location.origin}/w/${wishlistId}`
    try {
      await navigator.clipboard.writeText(url)
    } catch {
      // Fallback pour les contextes sans accès au presse-papier (HTTP non-sécurisé)
      const input = document.createElement('input')
      input.value = url
      document.body.appendChild(input)
      input.select()
      document.execCommand('copy')
      document.body.removeChild(input)
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button
      onClick={handleShare}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg border border-gray-200 bg-white hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900"
      aria-label="Copier le lien de partage"
    >
      {copied ? (
        <>
          <svg
            className="w-4 h-4 text-emerald-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <span className="text-emerald-700">Lien copié !</span>
        </>
      ) : (
        <>
          <svg
            className="w-4 h-4 text-gray-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
            />
          </svg>
          <span className="text-gray-600">Partager</span>
        </>
      )}
    </button>
  )
}
