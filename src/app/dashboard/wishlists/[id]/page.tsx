import { notFound } from 'next/navigation'
import Link from 'next/link'
import Header from '@/components/Header'
import ItemGrid from '@/components/items/ItemGrid'
import ShareButton from './ShareButton'
import WishlistActions from './WishlistActions'
import { createSupabaseServerClient, supabaseAdmin } from '@/lib/supabase/server'
import type { Item } from '@/components/items/ItemCard'

const VISIBILITY_LABELS = {
  private: 'Privé',
  friends: 'Amis',
  public:  'Public',
} as const

export default async function WishlistDetailPage({
  params,
}: {
  params: { id: string }
}) {
  const supabase = await createSupabaseServerClient()

  // Récupérer l'utilisateur connecté pour déterminer l'ownership
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Fetch de la wishlist — la RLS garantit que seuls les accès
  // autorisés (propriétaire, ami, public) retournent une ligne.
  const { data: wishlist } = await supabase
    .from('wishlists')
    .select('id, title, description, visibility, cover_url, user_id')
    .eq('id', params.id)
    .single()

  if (!wishlist) notFound()

  // Fetch des articles de la wishlist, du plus récent au plus ancien
  const { data } = await supabase
    .from('items')
    .select('id, title, image_url, price, source_url, note, priority, status, created_at')
    .eq('wishlist_id', params.id)
    .order('created_at', { ascending: false })

  const items = (data ?? []) as Item[]
  const visibilityLabel = VISIBILITY_LABELS[wishlist.visibility as keyof typeof VISIBILITY_LABELS]
  const isOwner = !!user && user.id === wishlist.user_id

  // Prénom du propriétaire pour le fil d'Ariane (seulement si non-propriétaire)
  let ownerName: string | null = null
  if (!isOwner) {
    const { data: ownerProfile } = await supabaseAdmin
      .from('users')
      .select('name, email')
      .eq('id', wishlist.user_id)
      .single()
    ownerName =
      ownerProfile?.name ??
      ownerProfile?.email?.split('@')[0] ??
      null
  }

  return (
    <>
      <Header />
      <main className="max-w-3xl mx-auto px-4 py-8">

        {/* Lien retour */}
        <Link
          href={isOwner ? '/dashboard' : `/dashboard/friends/${wishlist.user_id}`}
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 mb-6 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          {isOwner ? 'Mes wishlists' : (ownerName ?? 'Retour')}
        </Link>

        {/* Image de couverture */}
        {wishlist.cover_url && (
          <div className="mb-6 rounded-2xl overflow-hidden h-40 bg-gray-100">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={wishlist.cover_url}
              alt=""
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* En-tête wishlist */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 break-words">
            {wishlist.title}
          </h1>
          {wishlist.description && (
            <p className="mt-1.5 text-gray-500 leading-relaxed">
              {wishlist.description}
            </p>
          )}

          {/* Badge visibilité + actions */}
          <div className="flex items-center gap-2 mt-3">
            <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full">
              {visibilityLabel}
            </span>
            {isOwner && (
              <WishlistActions
                wishlist={{
                  id: wishlist.id,
                  title: wishlist.title,
                  description: wishlist.description,
                  visibility: wishlist.visibility as 'private' | 'friends' | 'public',
                  cover_url: wishlist.cover_url,
                }}
              />
            )}
            <ShareButton wishlistId={wishlist.id} />
          </div>
        </div>

        {/* Grille d'articles */}
        <ItemGrid wishlistId={wishlist.id} items={items} isOwner={isOwner} />
      </main>
    </>
  )
}
