import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServerClient, supabaseAdmin } from '@/lib/supabase/server'

/**
 * PATCH /api/friends/[id]
 * Body : { action: 'accept' | 'reject' }
 *
 * Accepte ou refuse une demande d'amitié identifiée par [id] (friendship id).
 *
 * Règles de sécurité :
 * - L'utilisateur courant doit être le destinataire (user_id_2).
 * - La demande doit être en statut 'pending'.
 *
 * On utilise supabaseAdmin car la RLS du UPDATE friendships exigerait
 * que l'appel soit fait avec la session de user_id_2, ce qui est le cas,
 * mais on préfère vérifier explicitement ici plutôt que de dépendre du RLS.
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = await createSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
  }

  let action: string
  try {
    const body = await request.json()
    action = body.action
    if (action !== 'accept' && action !== 'reject') throw new Error()
  } catch {
    return NextResponse.json({ error: 'Action invalide (accept | reject)' }, { status: 400 })
  }

  const { data: friendship } = await supabaseAdmin
    .from('friendships')
    .select('id, user_id_2, status')
    .eq('id', params.id)
    .single()

  if (!friendship) {
    return NextResponse.json({ error: 'Demande introuvable' }, { status: 404 })
  }

  if (friendship.user_id_2 !== user.id) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 403 })
  }

  if (friendship.status !== 'pending') {
    return NextResponse.json(
      { error: 'Cette demande a déjà été traitée' },
      { status: 409 }
    )
  }

  const { error } = await supabaseAdmin
    .from('friendships')
    .update({ status: action === 'accept' ? 'accepted' : 'rejected' })
    .eq('id', params.id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
