import { notFound } from 'next/navigation'
import Link from 'next/link'
import Header from '@/components/Header'
import CopyItemButton from '@/components/items/CopyItemButton'
import ReserveButton from '@/components/items/ReserveButton'
import { createSupabaseServerClient, supabaseAdmin } from '@/lib/supabase/server'
import type { Item } from '@/components/items/ItemCard'

const PRIORITY_STARS: Record<string, number> = { low: 1, medium: 2, high: 3 }
const PRIORITY_LABELS: Record<string, string> = { low: 'Basse', medium: 'Moyenne', high: 'Haute' }

const priceFormatter = new Intl.NumberFormat('fr-FR', {
  style: 'currency',
  currency: 'EUR',
})

export default async function ItemDetailPage({
  params,
}: {
  params: { id: string; itemId: string }
}) {
  const supabase = await createSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Fetch wishlist — RLS s'assure que l'utilisateur a accès
  const { data: wishlist } = await supabase
    .from('wishlists')
    .select('id, title, user_id')
    .eq('id', params.id)
    .single()

  if (!wishlist) notFound()

  // Fetch article — doit appartenir à cette wishlist
  const { data: item } = await supabase
    .from('items')
    .select('id, title, image_url, price, source_url, note, priority, status, created_at')
    .eq('id', params.itemId)
    .eq('wishlist_id', params.id)
    .single()

  if (!item) notFound()

  const isOwner = !!user && user.id === wishlist.user_id

  // Nom du propriétaire pour le fil d'Ariane (seulement si non-propriétaire)
  let ownerDisplayName: string | null = null
  if (!isOwner) {
    const { data: ownerProfile } = await supabaseAdmin
      .from('users')
      .select('name, email')
      .eq('id', wishlist.user_id)
      .single()
    ownerDisplayName =
      ownerProfile?.name ??
      ownerProfile?.email?.split('@')[0] ??
      null
  }

  const typedItem = item as Item
  const stars = PRIORITY_STARS[item.priority] ?? 1

  return (
    <>
      <Header />
      <main className="max-w-2xl mx-auto px-4 py-8">

        {/* Fil d'Ariane */}
        <Link
          href={
            isOwner
              ? `/dashboard/wishlists/${params.id}`
              : `/dashboard/wishlists/${params.id}`
          }
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 mb-8 transition-colors min-w-0 max-w-full"
        >
          <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span className="truncate">
            {isOwner
              ? wishlist.title
              : ownerDisplayName
                ? `${ownerDisplayName} — ${wishlist.title}`
                : wishlist.title
            }
          </span>
        </Link>

        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">

          {/* Image */}
          {item.image_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={item.image_url}
              alt=""
              className="w-full h-56 object-cover"
            />
          ) : (
            <div className="w-full h-40 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
              <svg className="w-12 h-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}

          <div className="p-5 space-y-4">

            {/* Titre + badge statut */}
            <div className="flex items-start justify-between gap-3">
              <h1 className="text-xl font-bold text-gray-900 leading-snug break-words flex-1">
                {item.title}
              </h1>
              {item.status !== 'available' && (
                <span className={`flex-shrink-0 text-xs font-medium px-2.5 py-1 rounded-full ${
                  item.status === 'purchased'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-amber-100 text-amber-700'
                }`}>
                  {item.status === 'purchased' ? 'Offert' : 'Réservé'}
                </span>
              )}
            </div>

            {/* Prix */}
            <p className="text-2xl font-semibold text-gray-900">
              {item.price != null
                ? priceFormatter.format(item.price)
                : <span className="text-base font-normal text-gray-400">Prix non renseigné</span>
              }
            </p>

            {/* Priorité */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-0.5" aria-label={`Priorité : ${PRIORITY_LABELS[item.priority]}`} role="img">
                {[1, 2, 3].map((n) => (
                  <svg
                    key={n}
                    className={`w-5 h-5 ${n <= stars ? 'text-amber-400' : 'text-gray-200'}`}
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                ))}
              </div>
              <span className="text-sm text-gray-500">Priorité {PRIORITY_LABELS[item.priority]?.toLowerCase()}</span>
            </div>

            {/* Note */}
            {item.note && (
              <div className="pt-1">
                <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-1">Note</p>
                <p className="text-sm text-gray-700 leading-relaxed">{item.note}</p>
              </div>
            )}

            {/* Séparateur */}
            <div className="border-t border-gray-100 pt-4 flex flex-wrap items-center gap-3">

              {/* Lien externe */}
              {item.source_url && (
                <a
                  href={item.source_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 border border-gray-200 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  Voir sur le site
                </a>
              )}

              {/* Actions non-propriétaire : réserver / annuler + ajouter à ma liste */}
              {!isOwner && (
                <>
                  {item.status !== 'purchased' && (
                    <ReserveButton
                      itemId={item.id}
                      wishlistId={params.id}
                      initialReserved={item.status === 'reserved'}
                    />
                  )}
                  <div className="flex-shrink-0">
                    <CopyItemButton item={typedItem} variant="full" />
                  </div>
                </>
              )}

              {/* Modifier (propriétaire) */}
              {isOwner && (
                <Link
                  href={`/dashboard/wishlists/${params.id}`}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                  Modifier
                </Link>
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
