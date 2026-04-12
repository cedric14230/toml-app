import Link from 'next/link'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import LogoutButton from './LogoutButton'

/**
 * Header de l'application — Server Component.
 *
 * Il lit la session directement depuis le serveur (aucun appel client),
 * puis passe la responsabilité de la déconnexion à LogoutButton (Client Component).
 *
 * Données chargées :
 * - session Supabase Auth (pour l'id utilisateur)
 * - profil public.users (pour le nom et l'avatar)
 */
export default async function Header() {
  const supabase = await createSupabaseServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Lecture du profil dans public.users (créé automatiquement par le trigger)
  const { data: profile } = await supabase
    .from('users')
    .select('name, avatar_url')
    .eq('id', user?.id)
    .single()

  // Fallback : prénom extrait de l'email si le profil n'est pas encore disponible
  const displayName =
    profile?.name ?? user?.email?.split('@')[0] ?? 'Utilisateur'

  const initial = displayName.charAt(0).toUpperCase()

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-sm border-b border-gray-200">
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">

        {/* Logo */}
        <Link
          href="/"
          className="text-lg font-bold tracking-tight text-gray-900 hover:opacity-75 transition-opacity"
        >
          TOML
        </Link>

        {/* Zone utilisateur */}
        <div className="flex items-center gap-3">

          {/* Avatar + nom */}
          <div className="flex items-center gap-2.5">
            {profile?.avatar_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={profile.avatar_url}
                alt={displayName}
                width={32}
                height={32}
                className="w-8 h-8 rounded-full object-cover ring-1 ring-gray-200"
              />
            ) : (
              <div
                aria-hidden="true"
                className="w-8 h-8 rounded-full bg-gray-900 flex items-center justify-center flex-shrink-0"
              >
                <span className="text-xs font-semibold text-white select-none">
                  {initial}
                </span>
              </div>
            )}

            {/* Nom masqué sur très petits écrans */}
            <span className="text-sm font-medium text-gray-700 hidden sm:block truncate max-w-[140px]">
              {displayName}
            </span>
          </div>

          {/* Séparateur vertical */}
          <div className="h-4 w-px bg-gray-200" aria-hidden="true" />

          <LogoutButton />
        </div>
      </div>
    </header>
  )
}
