import { redirect } from 'next/navigation'
import Header from '@/components/Header'
import AddItemFromBookmarklet from './AddItemFromBookmarklet'
import { createSupabaseServerClient } from '@/lib/supabase/server'

type SearchParams = {
  title?: string
  image?: string
  price?: string
  sourceUrl?: string
  /** Paramètre "text" envoyé par le Web Share Target API sur mobile.
   *  Certains navigateurs (notamment iOS Safari) placent l'URL de la page
   *  dans ce champ quand le champ "url" du share_target est vide. */
  text?: string
}

export default async function AddItemPage({
  searchParams,
}: {
  searchParams: SearchParams
}) {
  const supabase = await createSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/auth/login')

  const { data: wishlists } = await supabase
    .from('wishlists')
    .select('id, title')
    .eq('user_id', user.id)
    .eq('archived', false)
    .order('created_at', { ascending: false })

  // Résoudre l'URL source : priorité à sourceUrl, fallback sur text si c'est une URL
  const textParam = searchParams.text?.trim() ?? ''
  const rawSourceUrl = searchParams.sourceUrl?.trim() ?? ''
  const resolvedSourceUrl =
    rawSourceUrl ||
    (textParam.match(/^https?:\/\//) ? textParam : '')

  // Si text n'a pas servi comme URL, l'utiliser comme titre de fallback
  const resolvedTitle =
    searchParams.title?.trim() ||
    (!resolvedSourceUrl && textParam ? textParam : '')

  return (
    <>
      <Header />
      <main className="max-w-lg mx-auto px-4 py-8">
        <AddItemFromBookmarklet
          title={resolvedTitle}
          image={searchParams.image ?? ''}
          price={searchParams.price ?? ''}
          sourceUrl={resolvedSourceUrl}
          wishlists={wishlists ?? []}
        />
      </main>
    </>
  )
}
