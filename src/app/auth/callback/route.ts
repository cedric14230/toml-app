import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse, type NextRequest } from 'next/server'

/**
 * Route Handler OAuth — appelé par Supabase après authentification Google.
 *
 * Flux :
 *   1. L'utilisateur clique "Continuer avec Google"
 *   2. Supabase redirige vers Google
 *   3. Google redirige vers /auth/callback?code=xxx
 *   4. Ce handler échange le code contre une session
 *   5. Il redirige vers la destination finale (/ par défaut)
 *
 * Également utilisé pour la confirmation d'email (signUp) :
 * Supabase envoie un lien vers /auth/callback?code=xxx
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  // `next` permet de rediriger vers la page initialement demandée
  const next = searchParams.get('next') ?? '/'

  if (code) {
    const cookieStore = await cookies()

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          },
        },
      }
    )

    // Échange le code d'autorisation contre une session utilisateur.
    // Supabase pose automatiquement le cookie de session.
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      // Redirection vers la destination finale (page protégée ou /)
      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  // En cas d'erreur (code absent ou invalide) → retour à la page de login
  return NextResponse.redirect(`${origin}/auth/login?error=auth_callback_error`)
}
