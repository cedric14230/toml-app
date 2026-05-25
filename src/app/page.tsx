import { redirect } from 'next/navigation'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { HDLanding } from '@/components/landing/HDLanding'
import { HMLanding } from '@/components/landing/HMLanding'

export default async function HomePage() {
  const supabase = await createSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (user) redirect('/dashboard')

  return (
    <>
      <div className="hidden md:block">
        <HDLanding />
      </div>
      <div className="md:hidden">
        <HMLanding />
      </div>
    </>
  )
}
