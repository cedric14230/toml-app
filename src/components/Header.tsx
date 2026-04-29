import Link from 'next/link'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import UserMenu from './UserMenu'

/**
 * Header de l'application — Server Component.
 *
 * Lit la session + le profil côté serveur, puis délègue l'interactivité
 * (dropdown avatar, déconnexion) au Client Component UserMenu.
 */
export default async function Header() {
  const supabase = await createSupabaseServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data: profile } = await supabase
    .from('users')
    .select('name, avatar_url')
    .eq('id', user?.id)
    .single()

  const displayName =
    profile?.name ?? user?.email?.split('@')[0] ?? 'Utilisateur'

  const initial = displayName.charAt(0).toUpperCase()

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-sm border-b border-gray-200">
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">

        {/* Logo + nav */}
        <div className="flex items-center gap-6">
          <Link
            href="/"
            className="text-lg font-bold tracking-tight text-gray-900 hover:opacity-75 transition-opacity"
          >
            TOML
          </Link>
          <Link
            href="/dashboard/feed"
            className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors"
          >
            Feed
          </Link>
          <Link
            href="/dashboard/friends"
            className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors"
          >
            Amis
          </Link>
        </div>

        {/* Avatar cliquable → dropdown */}
        <UserMenu
          displayName={displayName}
          email={user?.email ?? ''}
          avatarUrl={profile?.avatar_url ?? null}
          initial={initial}
        />
      </div>
    </header>
  )
}
