import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase/server'

/**
 * CORS headers dynamiques : on renvoie l'origine exacte de la requête
 * plutôt que '*', ce qui est requis quand credentials:'include' est utilisé.
 * Cela permet aux extensions / futures intégrations d'appeler cet endpoint.
 */
function corsHeaders(request: NextRequest) {
  const origin = request.headers.get('origin') ?? '*'
  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Credentials': 'true',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    Vary: 'Origin',
  }
}

export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, { status: 204, headers: corsHeaders(request) })
}

export async function GET(request: NextRequest) {
  const headers = corsHeaders(request)

  const supabase = await createSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers })
  }

  const { data, error } = await supabase
    .from('wishlists')
    .select('id, title')
    .eq('user_id', user.id)
    .eq('archived', false)
    .order('created_at', { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500, headers })
  }

  return NextResponse.json(data ?? [], { headers })
}
