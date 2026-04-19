import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { supabaseAdmin } from '@/lib/supabase/server'

/**
 * POST /api/reserve
 * Body : { itemId: string, wishlistId: string }
 *
 * Logique :
 *  1. Vérifie que l'utilisateur est connecté
 *  2. Vérifie que l'article appartient à la wishlist et est disponible
 *  3. Vérifie que l'utilisateur n'est pas le propriétaire de la liste
 *  4. Met à jour le statut de l'article de 'available' → 'reserved' (atomique)
 *  5. Insère une entrée dans la table reservations
 *
 * L'étape 4 est atomique (.eq('status', 'available')) : si deux personnes
 * cliquent en même temps, seule l'une réussira.
 */
export async function POST(request: NextRequest) {
  const supabase = await createSupabaseServerClient()

  // ── Auth ────────────────────────────────────────────────────────────
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
  }

  // ── Body ────────────────────────────────────────────────────────────
  let itemId: string, wishlistId: string
  try {
    const body = await request.json()
    itemId = body.itemId
    wishlistId = body.wishlistId
    if (!itemId || !wishlistId) throw new Error()
  } catch {
    return NextResponse.json({ error: 'Corps de requête invalide' }, { status: 400 })
  }

  // ── Vérification propriétaire ────────────────────────────────────────
  // Utilise l'admin client pour contourner la RLS et vérifier user_id
  const { data: wishlist } = await supabaseAdmin
    .from('wishlists')
    .select('user_id')
    .eq('id', wishlistId)
    .single()

  if (!wishlist) {
    return NextResponse.json({ error: 'Wishlist introuvable' }, { status: 404 })
  }

  if (wishlist.user_id === user.id) {
    return NextResponse.json(
      { error: 'Vous ne pouvez pas réserver vos propres articles' },
      { status: 403 }
    )
  }

  // ── Mise à jour atomique du statut ───────────────────────────────────
  // .eq('status', 'available') garantit qu'on ne peut pas réserver
  // un article déjà réservé (protection race condition).
  const { data: updated } = await supabaseAdmin
    .from('items')
    .update({ status: 'reserved' })
    .eq('id', itemId)
    .eq('wishlist_id', wishlistId)
    .eq('status', 'available')
    .select('id')

  if (!updated || updated.length === 0) {
    return NextResponse.json(
      { error: 'Article déjà réservé ou introuvable' },
      { status: 409 }
    )
  }

  // ── Insertion réservation ────────────────────────────────────────────
  const { error: reserveError } = await supabase
    .from('reservations')
    .insert({ item_id: itemId, reserver_user_id: user.id })

  if (reserveError) {
    // Rollback : restaure le statut 'available'
    await supabaseAdmin
      .from('items')
      .update({ status: 'available' })
      .eq('id', itemId)
    return NextResponse.json({ error: reserveError.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
