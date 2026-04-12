'use client'

import { useRouter } from 'next/navigation'
import { createSupabaseBrowserClient } from '@/lib/supabase/client'

/**
 * Composant client isolé pour la déconnexion.
 * Séparé du Header (Server Component) car il a besoin de useRouter
 * et d'un event handler côté navigateur.
 */
export default function LogoutButton() {
  const router = useRouter()
  const supabase = createSupabaseBrowserClient()

  async function handleLogout() {
    await supabase.auth.signOut()
    // router.refresh() invalide le cache des Server Components
    // router.push() redirige vers la page de login
    router.push('/auth/login')
    router.refresh()
  }

  return (
    <button
      onClick={handleLogout}
      className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors"
    >
      Déconnexion
    </button>
  )
}
