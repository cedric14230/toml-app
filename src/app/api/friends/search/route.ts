import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServerClient, supabaseAdmin } from '@/lib/supabase/server'

/**
 * GET /api/friends/search?q=...
 *
 * Recherche des utilisateurs par nom OU email (correspondance partielle,
 * insensible à la casse). Exclut l'utilisateur courant.
 *
 * Pour chaque résultat, renvoie aussi le statut de l'amitié avec
 * l'utilisateur courant (null, 'pending', 'accepted', etc.) ainsi que
 * la direction de la demande ('sent' | 'received') si applicable.
 *
 * Deux requêtes .ilike() séparées (nom + email) plutôt qu'un .or() avec
 * interpolation de chaîne, pour éviter tout risque d'injection via
 * les caractères spéciaux de la syntaxe PostgREST.
 */
export async function GET(request: NextRequest) {
  const supabase = await createSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
  }

  const q = request.nextUrl.searchParams.get('q')?.trim() ?? ''

  if (q.length < 2) {
    return NextResponse.json({ users: [] })
  }

  const pattern = `%${q}%`

  // Deux requêtes ilike séparées, fusionnées côté serveur
  const [{ data: byName }, { data: byEmail }] = await Promise.all([
    supabaseAdmin
      .from('users')
      .select('id, name, email, avatar_url')
      .neq('id', user.id)
      .ilike('name', pattern)
      .limit(8),
    supabaseAdmin
      .from('users')
      .select('id, name, email, avatar_url')
      .neq('id', user.id)
      .ilike('email', pattern)
      .limit(8),
  ])

  // Fusion + déduplication
  const seen = new Set<string>()
  const merged = [...(byName ?? []), ...(byEmail ?? [])].filter((u) => {
    if (seen.has(u.id)) return false
    seen.add(u.id)
    return true
  }).slice(0, 8)

  if (merged.length === 0) {
    return NextResponse.json({ users: [] })
  }

  // Récupère les amitiés existantes entre l'utilisateur courant et les résultats
  const { data: existingFriendships } = await supabaseAdmin
    .from('friendships')
    .select('user_id_1, user_id_2, status')
    .or(`user_id_1.eq.${user.id},user_id_2.eq.${user.id}`)

  const friendships = existingFriendships ?? []

  const usersWithStatus = merged.map((u) => {
    const f = friendships.find(
      (x) =>
        (x.user_id_1 === user.id && x.user_id_2 === u.id) ||
        (x.user_id_2 === user.id && x.user_id_1 === u.id)
    )
    return {
      ...u,
      friendshipStatus: f?.status ?? null,
      friendshipDirection: f
        ? f.user_id_1 === user.id
          ? 'sent'
          : 'received'
        : null,
    }
  })

  return NextResponse.json({ users: usersWithStatus })
}
