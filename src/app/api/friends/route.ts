import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServerClient, supabaseAdmin } from '@/lib/supabase/server'

/**
 * POST /api/friends
 * Body : { targetUserId: string }
 *
 * Envoie une demande d'amitié à targetUserId.
 *
 * Règles :
 * - L'utilisateur ne peut pas s'ajouter lui-même (doublé par la contrainte
 *   CHECK no_self_friendship de la BDD).
 * - Si une amitié refusée existe déjà, on la remet à 'pending' au lieu
 *   d'insérer (l'index unique LEAST/GREATEST l'interdirait de toute façon).
 * - Si une amitié pending/accepted existe, retourne 409.
 *
 * On utilise supabaseAdmin pour bypasser la RLS et contrôler finement
 * les règles métier ici plutôt que dans la politique SQL.
 */
export async function POST(request: NextRequest) {
  const supabase = await createSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
  }

  let targetUserId: string
  try {
    const body = await request.json()
    targetUserId = body.targetUserId
    if (!targetUserId) throw new Error()
  } catch {
    return NextResponse.json({ error: 'Corps de requête invalide' }, { status: 400 })
  }

  if (targetUserId === user.id) {
    return NextResponse.json(
      { error: 'Vous ne pouvez pas vous ajouter vous-même' },
      { status: 400 }
    )
  }

  // Vérifie que la cible existe
  const { data: target } = await supabaseAdmin
    .from('users')
    .select('id')
    .eq('id', targetUserId)
    .single()

  if (!target) {
    return NextResponse.json({ error: 'Utilisateur introuvable' }, { status: 404 })
  }

  // Cherche une amitié existante dans les deux sens
  const { data: existing } = await supabaseAdmin
    .from('friendships')
    .select('id, status, user_id_1')
    .or(
      `and(user_id_1.eq.${user.id},user_id_2.eq.${targetUserId}),` +
      `and(user_id_1.eq.${targetUserId},user_id_2.eq.${user.id})`
    )
    .maybeSingle()

  if (existing) {
    if (existing.status === 'accepted') {
      return NextResponse.json({ error: 'Vous êtes déjà amis' }, { status: 409 })
    }
    if (existing.status === 'pending') {
      return NextResponse.json({ error: 'Une demande est déjà en attente' }, { status: 409 })
    }
    if (existing.status === 'blocked') {
      return NextResponse.json({ error: 'Impossible d\'envoyer cette demande' }, { status: 403 })
    }
    // status === 'rejected' : on réactive la demande en la remettant à 'pending'
    const { error } = await supabaseAdmin
      .from('friendships')
      .update({ status: 'pending', user_id_1: user.id, user_id_2: targetUserId })
      .eq('id', existing.id)
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    return NextResponse.json({ success: true })
  }

  // Crée la demande d'amitié
  const { error } = await supabaseAdmin
    .from('friendships')
    .insert({ user_id_1: user.id, user_id_2: targetUserId, status: 'pending' })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
