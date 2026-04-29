import { notFound } from 'next/navigation'
import Link from 'next/link'
import { supabaseAdmin } from '@/lib/supabase/server'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import ReserveButton from './ReserveButton'

/**
 * Page publique de partage d'une wishlist.
 * Route : /w/[id]
 *
 * Accessible sans compte (le middleware laisse passer /w/*).
 * Utilise supabaseAdmin pour bypasser la RLS : la wishlist est
 * toujours visible via son lien de partage, peu importe la visibilité
 * configurée (le propriétaire a délibérément partagé ce lien).
 *
 * Sécurité :
 * - L'identité des réservants n'est jamais exposée côté client.
 * - Le propriétaire ne voit pas les boutons de réservation.
 * - /api/reserve vérifie côté serveur que l'appelant ≠ propriétaire.
 *
 * dynamic = 'force-dynamic' : désactive le cache Next.js pour cette route.
 * Sans ça, supabaseAdmin passe par fetch() mis en cache par Next.js, et
 * les statuts "reserved" ne s'affichent pas avant la prochaine revalidation.
 */
export const dynamic = 'force-dynamic'

const PRIORITY_STARS: Record<string, number> = { low: 1, medium: 2, high: 3 }

const priceFormatter = new Intl.NumberFormat('fr-FR', {
  style: 'currency',
  currency: 'EUR',
})

type Owner = { name: string | null; avatar_url: string | null }

type PublicItem = {
  id: string
  title: string
  image_url: string | null
  price: number | null
  source_url: string | null
  note: string | null
  priority: 'low' | 'medium' | 'high'
  status: 'available' | 'reserved' | 'purchased'
}

export default async function PublicWishlistPage({
  params,
}: {
  params: { id: string }
}) {
  // ── Wishlist + propriétaire ─────────────────────────────────────────
  // !user_id indique à PostgREST quelle FK utiliser pour le join.
  const { data: wishlist } = await supabaseAdmin
    .from('wishlists')
    .select('id, title, description, user_id, users!user_id(name, avatar_url)')
    .eq('id', params.id)
    .single()

  if (!wishlist) notFound()

  const owner = (
    Array.isArray(wishlist.users) ? wishlist.users[0] : wishlist.users
  ) as Owner | null

  // ── Articles ────────────────────────────────────────────────────────
  const { data: items } = await supabaseAdmin
    .from('items')
    .select('id, title, image_url, price, source_url, note, priority, status')
    .eq('wishlist_id', params.id)
    .order('created_at', { ascending: false })

  const publicItems = (items ?? []) as PublicItem[]

  // ── Utilisateur connecté (optionnel) ────────────────────────────────
  // Permet de masquer les boutons de réservation pour le propriétaire.
  const supabase = await createSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const isOwner = !!user && user.id === wishlist.user_id

  // ── Données d'affichage du propriétaire ─────────────────────────────
  const ownerName = owner?.name ?? "Quelqu\u2019un"
  const ownerInitial = ownerName.charAt(0).toUpperCase()

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Barre supérieure minimale */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-2xl mx-auto px-4 h-13 flex items-center justify-between py-3">
          <Link
            href="/"
            className="text-lg font-bold tracking-tight text-gray-900 hover:opacity-75 transition-opacity"
          >
            TOML
          </Link>

          {user ? (
            <Link
              href="/dashboard"
              className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
            >
              Tableau de bord
            </Link>
          ) : (
            <Link
              href={`/auth/login?redirectTo=/w/${params.id}`}
              className="text-sm font-medium text-gray-900 hover:opacity-75 transition-opacity"
            >
              Se connecter
            </Link>
          )}
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8">

        {/* Carte propriétaire */}
        <div className="flex items-center gap-3 mb-6">
          {owner?.avatar_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={owner.avatar_url}
              alt={ownerName}
              className="w-10 h-10 rounded-full object-cover ring-1 ring-gray-200 flex-shrink-0"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gray-900 flex items-center justify-center flex-shrink-0">
              <span className="text-sm font-semibold text-white select-none">
                {ownerInitial}
              </span>
            </div>
          )}
          <div className="min-w-0">
            <p className="text-xs text-gray-500">Wishlist de</p>
            <p className="text-sm font-semibold text-gray-900 truncate">{ownerName}</p>
          </div>
        </div>

        {/* En-tête wishlist */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 break-words">
            {wishlist.title}
          </h1>
          {wishlist.description && (
            <p className="mt-2 text-gray-500 leading-relaxed">
              {wishlist.description}
            </p>
          )}
        </div>

        {/* Liste des articles */}
        {publicItems.length === 0 ? (
          <p className="text-gray-400 text-sm text-center py-12">
            Cette wishlist ne contient pas encore d&apos;articles.
          </p>
        ) : (
          <ul className="space-y-3">
            {publicItems.map((item) => {
              const stars = PRIORITY_STARS[item.priority] ?? 1

              return (
                <li key={item.id}>
                  <article className="bg-white rounded-xl border border-gray-200 overflow-hidden flex hover:border-gray-300 hover:shadow-sm transition-all duration-150">

                    {/* Vignette image */}
                    <div className="w-24 h-24 flex-shrink-0 bg-gray-100 flex items-center justify-center">
                      {item.image_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={item.image_url}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <svg
                          className="w-8 h-8 text-gray-300"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          aria-hidden="true"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                      )}
                    </div>

                    {/* Contenu */}
                    <div className="flex-1 p-3 flex flex-col justify-between min-w-0">
                      <div>
                        <h2 className="text-sm font-medium text-gray-900 leading-snug line-clamp-2">
                          {item.title}
                        </h2>
                        {item.note && (
                          <p className="text-xs text-gray-500 mt-1 line-clamp-1">
                            {item.note}
                          </p>
                        )}
                        {item.source_url && (
                          <a
                            href={item.source_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 mt-1 text-xs text-gray-400 hover:text-gray-700 transition-colors"
                          >
                            <svg className="w-3 h-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                            Voir sur le site
                          </a>
                        )}
                      </div>

                      {/* Prix + priorité + bouton */}
                      <div className="flex items-center justify-between mt-2 gap-2">
                        <div className="flex items-center gap-3 min-w-0">
                          <span className="text-sm font-semibold text-gray-900 whitespace-nowrap">
                            {item.price != null ? (
                              priceFormatter.format(item.price)
                            ) : (
                              <span className="text-xs font-normal text-gray-300">
                                Prix non renseigné
                              </span>
                            )}
                          </span>

                          {/* Étoiles priorité */}
                          <div
                            className="flex items-center gap-0.5 flex-shrink-0"
                            aria-label={`Priorité : ${item.priority}`}
                            role="img"
                          >
                            {[1, 2, 3].map((n) => (
                              <svg
                                key={n}
                                className={`w-3.5 h-3.5 ${n <= stars ? 'text-amber-400' : 'text-gray-200'}`}
                                fill="currentColor"
                                viewBox="0 0 24 24"
                                aria-hidden="true"
                              >
                                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                              </svg>
                            ))}
                          </div>
                        </div>

                        {/* Action : réserver ou badge "déjà réservé" */}
                        <div className="flex-shrink-0">
                          {item.status !== 'available' ? (
                            <span
                              className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-400 bg-gray-100 border border-gray-200 px-3 py-1.5 rounded-lg cursor-not-allowed select-none"
                              aria-label="Cet article a déjà été réservé"
                            >
                              Déjà réservé 🎁
                            </span>
                          ) : isOwner ? null : (
                            <ReserveButton
                              itemId={item.id}
                              wishlistId={wishlist.id}
                              initialReserved={false}
                            />
                          )}
                        </div>
                      </div>
                    </div>
                  </article>
                </li>
              )
            })}
          </ul>
        )}

        {/* Message si le viewer est le propriétaire */}
        {isOwner && (
          <p className="mt-8 text-center text-xs text-gray-400">
            Vous consultez votre propre wishlist — vos invités verront les boutons de réservation.
          </p>
        )}

        {/* Footer */}
        <p className="mt-10 text-center text-xs text-gray-300">
          Partagez vos envies avec{' '}
          <Link href="/" className="hover:text-gray-500 transition-colors">
            TOML
          </Link>
        </p>
      </main>
    </div>
  )
}
