import Header from '@/components/Header'
import WishlistGrid from '@/components/wishlists/WishlistGrid'
import BookmarkletInstall from '@/components/BookmarkletInstall'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import type { Wishlist } from '@/components/wishlists/WishlistCard'

export default async function DashboardPage() {
  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Récupère les wishlists non archivées de l'utilisateur, avec le
  // nombre d'items via un agrégat Supabase : items(count) retourne
  // [{ count: N }] pour chaque wishlist.
  const { data } = await supabase
    .from('wishlists')
    .select('id, title, description, cover_url, visibility, created_at, items(count)')
    .eq('user_id', user!.id)
    .eq('archived', false)
    .order('created_at', { ascending: false })

  const wishlists = (data ?? []) as Wishlist[]

  return (
    <>
      <Header />
      <main className="max-w-5xl mx-auto px-4 py-8">
        <WishlistGrid wishlists={wishlists} />
        <BookmarkletInstall />
      </main>
    </>
  )
}
