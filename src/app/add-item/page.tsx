import { redirect } from 'next/navigation'
import Header from '@/components/Header'
import AddItemFromBookmarklet from './AddItemFromBookmarklet'
import { createSupabaseServerClient } from '@/lib/supabase/server'

type SearchParams = {
  title?: string
  image?: string
  price?: string
  sourceUrl?: string
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

  return (
    <>
      <Header />
      <main className="max-w-lg mx-auto px-4 py-8">
        <AddItemFromBookmarklet
          title={searchParams.title ?? ''}
          image={searchParams.image ?? ''}
          price={searchParams.price ?? ''}
          sourceUrl={searchParams.sourceUrl ?? ''}
          wishlists={wishlists ?? []}
        />
      </main>
    </>
  )
}
