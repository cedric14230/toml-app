'use client'

import { useState, useEffect } from 'react'

/**
 * Retourne true si l'utilisateur est sur un appareil mobile.
 * Combine deux signaux :
 *   - largeur d'écran < 768 px (breakpoint md Tailwind)
 *   - userAgent iOS / Android
 *
 * Initialisé à false côté serveur pour éviter les erreurs SSR ;
 * mis à jour au premier rendu côté client.
 */
export function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    function check() {
      const byWidth = window.innerWidth < 768
      const byAgent = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
      setIsMobile(byWidth || byAgent)
    }

    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  return isMobile
}
