import { redirect } from 'next/navigation'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import type { WishlistRow } from '@/components/dashboard/types'
import { HDDashboard } from '@/components/dashboard/HDDashboard'
import { HMDashboard } from '@/components/dashboard/HMDashboard'

// ── Helpers ───────────────────────────────────────────────────────────────────

/** Tone 1–6 dérivé de l'UUID — pas de colonne en base. */
function toneFromId(id: string): 1 | 2 | 3 | 4 | 5 | 6 {
  const hex = id.replace(/-/g, '').slice(0, 4)
  return ((parseInt(hex, 16) % 6) + 1) as 1 | 2 | 3 | 4 | 5 | 6
}

/** Dernière activité anonymisée — sans nom d'utilisateur. */
function computeLatest(
  items: Array<{ status: string; created_at: string }>
): string | null {
  const reserved = items.filter(
    i => i.status === 'reserved' || i.status === 'purchased'
  ).length
  if (reserved > 0) {
    return `${reserved} article${reserved > 1 ? 's' : ''} réservé${reserved > 1 ? 's' : ''}`
  }
  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
  const recent = items.filter(i => i.created_at > weekAgo).length
  if (recent > 0) {
    return `${recent} ajout${recent > 1 ? 's' : ''} cette semaine`
  }
  return null
}

// ── Raw type from Supabase (avant transformation) ─────────────────────────────

type RawWishlist = {
  id: string
  title: string
  description: string | null
  visibility: string
  created_at: string
  items: Array<{ id: string; status: string; created_at: string }>
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default async function DashboardPage() {
  const supabase = await createSupabaseServerClient()

  // Auth guard
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/')

  // Profil public (pour le prénom)
  const { data: profile } = await supabase
    .from('users')
    .select('name')
    .eq('id', user.id)
    .single()

  const firstName =
    profile?.name?.split(' ')[0] ??
    user.email?.split('@')[0] ??
    'toi'

  // Wishlists actives + items imbriqués (status + created_at pour calculs)
  const { data: raw } = await supabase
    .from('wishlists')
    .select('id, title, description, visibility, created_at, items(id, status, created_at)')
    .eq('user_id', user.id)
    .eq('archived', false)
    .order('created_at', { ascending: false })

  const wishlists: WishlistRow[] = ((raw ?? []) as RawWishlist[]).map(w => ({
    id: w.id,
    title: w.title,
    description: w.description,
    visibility: w.visibility as WishlistRow['visibility'],
    created_at: w.created_at,
    item_count: w.items.length,
    latest: computeLatest(w.items),
    tone: toneFromId(w.id),
  }))

  return (
    <>
      <div className="hidden md:block">
        <HDDashboard wishlists={wishlists} firstName={firstName} />
      </div>
      <div className="md:hidden">
        <HMDashboard wishlists={wishlists} firstName={firstName} />
      </div>
    </>
  )
}
