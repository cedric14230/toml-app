import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServerClient, supabaseAdmin } from '@/lib/supabase/server'

const BUCKET = 'wishlist-covers'
const MAX_SIZE = 5 * 1024 * 1024 // 5 Mo

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = await createSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Vérifier que la wishlist appartient bien à l'utilisateur
  const { data: wishlist } = await supabaseAdmin
    .from('wishlists')
    .select('id')
    .eq('id', params.id)
    .eq('user_id', user.id)
    .single()

  if (!wishlist) {
    return NextResponse.json({ error: 'Wishlist introuvable' }, { status: 404 })
  }

  // Lire le fichier depuis le FormData
  let formData: FormData
  try {
    formData = await request.formData()
  } catch {
    return NextResponse.json({ error: 'FormData invalide' }, { status: 400 })
  }

  const file = formData.get('file') as File | null
  if (!file) {
    return NextResponse.json({ error: 'Aucun fichier fourni' }, { status: 400 })
  }

  if (!file.type.startsWith('image/')) {
    return NextResponse.json({ error: 'Le fichier doit être une image' }, { status: 400 })
  }

  if (file.size > MAX_SIZE) {
    return NextResponse.json({ error: 'L\'image doit faire moins de 5 Mo' }, { status: 400 })
  }

  // Créer le bucket s'il n'existe pas encore (opération idempotente)
  await supabaseAdmin.storage
    .createBucket(BUCKET, { public: true, fileSizeLimit: MAX_SIZE })
    .catch(() => {
      // Le bucket existe déjà — on ignore l'erreur
    })

  const ext = file.name.split('.').pop()?.toLowerCase() ?? 'jpg'
  const path = `${user.id}/${params.id}-${Date.now()}.${ext}`

  const { error: uploadError } = await supabaseAdmin.storage
    .from(BUCKET)
    .upload(path, file, { upsert: true, contentType: file.type })

  if (uploadError) {
    return NextResponse.json({ error: uploadError.message }, { status: 500 })
  }

  const {
    data: { publicUrl },
  } = supabaseAdmin.storage.from(BUCKET).getPublicUrl(path)

  return NextResponse.json({ url: publicUrl })
}
