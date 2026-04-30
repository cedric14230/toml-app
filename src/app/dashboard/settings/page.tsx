import { redirect } from 'next/navigation'
import Link from 'next/link'
import Header from '@/components/Header'
import SettingsForm from './SettingsForm'
import { createSupabaseServerClient } from '@/lib/supabase/server'

/**
 * Page de paramètres du compte.
 *
 * Champs mis à jour dans public.users :
 *   name, avatar_url        — existent déjà
 *   bio TEXT                — à ajouter si absent : ALTER TABLE users ADD COLUMN bio TEXT;
 *   birthday DATE           — à ajouter si absent : ALTER TABLE users ADD COLUMN birthday DATE;
 *   default_visibility TEXT — à ajouter si absent : ALTER TABLE users ADD COLUMN default_visibility TEXT DEFAULT 'public';
 *
 * Avatar : upload vers le bucket Supabase Storage "avatars".
 *   Créer le bucket avec accès public et une policy INSERT/UPDATE pour les utilisateurs authentifiés.
 */
export default async function SettingsPage() {
  const supabase = await createSupabaseServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/auth/login?redirectTo=/dashboard/settings')

  const { data: profile } = await supabase
    .from('users')
    .select('name, avatar_url, bio, birthday, default_visibility, phone_number, phone_verified')
    .eq('id', user.id)
    .single()

  return (
    <>
      <Header />
      <main className="max-w-lg mx-auto px-4 py-8">

        {/* Fil d'Ariane */}
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 mb-8 transition-colors"
        >
          <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Tableau de bord
        </Link>

        <h1 className="text-2xl font-bold text-gray-900 mb-6">Paramètres du compte</h1>

        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <SettingsForm
            userId={user.id}
            initialProfile={{
              name:               profile?.name               ?? null,
              avatar_url:         profile?.avatar_url         ?? null,
              bio:                profile?.bio                ?? null,
              birthday:           profile?.birthday           ?? null,
              default_visibility: profile?.default_visibility ?? 'public',
              phone_number:       profile?.phone_number       ?? null,
              phone_verified:     profile?.phone_verified     ?? false,
            }}
          />
        </div>
      </main>
    </>
  )
}
