import Header from '@/components/Header'
import WishlistGrid from '@/components/wishlists/WishlistGrid'
import BookmarkletInstall from '@/components/BookmarkletInstall'
import PwaMobileBanner from '@/components/PwaMobileBanner'
import WhatsAppOnboardingCard from '@/components/onboarding/WhatsAppOnboardingCard'
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

  const { data: profile } = await supabase
    .from('users')
    .select('phone_verified')
    .eq('id', user!.id)
    .single()

  const phoneVerified = profile?.phone_verified ?? false

  return (
    <>
      <Header />
      <main className="max-w-5xl mx-auto px-4 py-8">
        <WhatsAppOnboardingCard phoneVerified={phoneVerified} />
        <WishlistGrid wishlists={wishlists} />
        <PwaMobileBanner />
        <BookmarkletInstall />
      </main>
    </>
  )
}
