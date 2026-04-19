import WidgetForm from './WidgetForm'
import { createSupabaseServerClient } from '@/lib/supabase/server'

type SearchParams = {
  title?: string
  image?: string
  price?: string
  sourceUrl?: string
}

export default async function AddItemWidgetPage({
  searchParams,
}: {
  searchParams: SearchParams
}) {
  const supabase = await createSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // ── Non connecté ─────────────────────────────────────────────────────────────
  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4 px-6 text-center bg-white">
        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
        <div>
          <p className="text-sm font-semibold text-gray-900 mb-1">Non connecté</p>
          <p className="text-xs text-gray-500 mb-4">
            Connectez-vous à TOML pour ajouter des articles à votre wishlist.
          </p>
          <a
            href="/auth/login"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors"
          >
            Se connecter à TOML
          </a>
        </div>
      </div>
    )
  }

  // ── Wishlists ─────────────────────────────────────────────────────────────────
  const { data: wishlists } = await supabase
    .from('wishlists')
    .select('id, title')
    .eq('user_id', user.id)
    .eq('archived', false)
    .order('created_at', { ascending: false })

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <WidgetForm
        title={searchParams.title ?? ''}
        image={searchParams.image ?? ''}
        price={searchParams.price ?? ''}
        sourceUrl={searchParams.sourceUrl ?? ''}
        wishlists={wishlists ?? []}
      />
    </div>
  )
}
