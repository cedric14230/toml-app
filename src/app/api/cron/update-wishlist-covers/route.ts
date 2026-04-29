import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/server'

/**
 * GET /api/cron/update-wishlist-covers
 *
 * Job nocturne Vercel Cron (0 2 * * * — 2h UTC).
 * Pour chaque wishlist sans cover_url, cherche le premier article
 * priority=3 avec une image et l'affecte comme couverture.
 *
 * Sécurité : vérification du header Authorization: Bearer ${CRON_SECRET}.
 * Ce secret doit être renseigné sur Vercel et dans .env.local.
 */
export async function GET(request: NextRequest) {
  // ── Auth cron ────────────────────────────────────────────────────────
  const authHeader = request.headers.get('authorization')
  const cronSecret = process.env.CRON_SECRET

  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  }

  // ── Wishlists sans cover_url ─────────────────────────────────────────
  const { data: wishlists, error: wlError } = await supabaseAdmin
    .from('wishlists')
    .select('id')
    .is('cover_url', null)

  if (wlError) {
    return NextResponse.json({ error: wlError.message }, { status: 500 })
  }

  if (!wishlists || wishlists.length === 0) {
    return NextResponse.json({ updated: 0, message: 'Aucune wishlist à mettre à jour' })
  }

  // ── Mise à jour de chaque wishlist ───────────────────────────────────
  let updated = 0

  for (const wishlist of wishlists) {
    // Premier article priority=3 avec image, par ordre de création
    const { data: item } = await supabaseAdmin
      .from('items')
      .select('image_url')
      .eq('wishlist_id', wishlist.id)
      .eq('priority', 'high')
      .not('image_url', 'is', null)
      .order('created_at', { ascending: true })
      .limit(1)
      .single()

    if (!item?.image_url) continue

    const { error: updateError } = await supabaseAdmin
      .from('wishlists')
      .update({ cover_url: item.image_url })
      .eq('id', wishlist.id)

    if (!updateError) updated++
  }

  return NextResponse.json({ updated, total: wishlists.length })
}
