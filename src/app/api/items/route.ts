import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase/server'

function corsHeaders(request: NextRequest) {
  const origin = request.headers.get('origin') ?? '*'
  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Credentials': 'true',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    Vary: 'Origin',
  }
}

export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, { status: 204, headers: corsHeaders(request) })
}

export async function POST(request: NextRequest) {
  const headers = corsHeaders(request)

  const supabase = await createSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers })
  }

  let body: {
    wishlist_id?: string
    title?: string
    image_url?: string | null
    price?: number | null
    source_url?: string | null
  }

  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400, headers })
  }

  const { wishlist_id, title, image_url, price, source_url } = body

  if (!wishlist_id || !title?.trim()) {
    return NextResponse.json(
      { error: 'wishlist_id et title sont requis' },
      { status: 400, headers }
    )
  }

  // Vérifier que la wishlist appartient bien à l'utilisateur connecté
  const { data: wishlist } = await supabase
    .from('wishlists')
    .select('id')
    .eq('id', wishlist_id)
    .eq('user_id', user.id)
    .single()

  if (!wishlist) {
    return NextResponse.json(
      { error: 'Wishlist introuvable ou accès refusé' },
      { status: 403, headers }
    )
  }

  const { data, error } = await supabase
    .from('items')
    .insert({
      wishlist_id,
      title: title.trim(),
      image_url: image_url ?? null,
      price: price != null && !isNaN(Number(price)) ? Number(price) : null,
      source_url: source_url ?? null,
    })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500, headers })
  }

  return NextResponse.json({ item: data }, { status: 201, headers })
}
