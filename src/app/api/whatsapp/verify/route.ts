import { NextResponse } from 'next/server'
import { createSupabaseServerClient, supabaseAdmin } from '@/lib/supabase/server'

/**
 * POST /api/whatsapp/verify
 *
 * Route authentifiée. Génère un UUID stocké dans verification_tokens
 * (15 min d'expiration) et retourne une URL wa.me avec un message pré-rempli
 * contenant le code UUID en clair (pas d'URL, évite les previews 404).
 * Le webhook détecte "Code de liaison : <UUID>" et lie le numéro au compte.
 *
 * Body JSON : (aucun)
 * Réponse   : { waUrl: string }
 */
export async function POST() {
  const supabase = await createSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
  }

  const id         = crypto.randomUUID()
  const expiresAt  = new Date(Date.now() + 15 * 60 * 1000).toISOString()

  const { error: insertError } = await supabaseAdmin
    .from('verification_tokens')
    .insert({ id, user_id: user.id, expires_at: expiresAt })

  if (insertError) {
    return NextResponse.json(
      { error: 'Impossible de créer le lien de vérification.' },
      { status: 500 }
    )
  }

  const message = `Je souhaite connecter mon compte TOML. Code de liaison : ${id}`
  const waUrl   = `https://wa.me/17079863698?text=${encodeURIComponent(message)}`

  return NextResponse.json({ waUrl })
}
