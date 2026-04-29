import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  // On crée une réponse "pass-through" initiale.
  // Elle sera mutée si Supabase doit rafraîchir le cookie de session.
  let supabaseResponse = NextResponse.next({ request })

  // Le client middleware utilise request.cookies / response.cookies,
  // PAS cookies() de next/headers (réservé aux Server Components).
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          // 1. Écrire dans la requête (pour les Server Components de ce cycle)
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          // 2. Recréer la réponse avec la requête mise à jour
          supabaseResponse = NextResponse.next({ request })
          // 3. Écrire dans la réponse (pour le navigateur)
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // IMPORTANT : ne rien placer entre createServerClient et getUser().
  // getUser() rafraîchit silencieusement le token si nécessaire
  // et écrit le nouveau cookie via setAll() ci-dessus.
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { pathname } = request.nextUrl
  const isAuthRoute = pathname.startsWith('/auth')
  const isCallbackRoute = pathname.startsWith('/auth/callback')
  // Routes publiques accessibles sans compte (listes partagées)
  const isPublicShareRoute = pathname.startsWith('/w/')
  // Widget iframe : gère son propre état d'authentification côté serveur
  const isWidgetRoute = pathname === '/add-item-widget'
  // Homepage publique : les visiteurs non connectés voient la landing page
  const isHomepage = pathname === '/'
  // Routes cron : sécurisées par Authorization Bearer dans la route elle-même
  const isCronRoute = pathname.startsWith('/api/cron/')

  // Non connecté → redirige vers /auth/login
  // (sauf si déjà sur /auth/* ou sur une page de partage publique /w/*)
  if (!user && !isAuthRoute && !isPublicShareRoute && !isWidgetRoute && !isHomepage && !isCronRoute) {
    const redirectUrl = request.nextUrl.clone()
    redirectUrl.pathname = '/auth/login'
    // On mémorise la destination pour rediriger après connexion
    redirectUrl.searchParams.set('redirectTo', pathname + request.nextUrl.search)
    return NextResponse.redirect(redirectUrl)
  }

  // Déjà connecté → redirige vers / si on tente d'accéder à /auth/login ou /auth/signup
  // (on laisse passer /auth/callback qui a besoin de s'exécuter)
  if (user && isAuthRoute && !isCallbackRoute) {
    const redirectUrl = request.nextUrl.clone()
    redirectUrl.pathname = '/'
    return NextResponse.redirect(redirectUrl)
  }

  // Retourne la réponse avec les cookies de session potentiellement rafraîchis
  return supabaseResponse
}

export const config = {
  matcher: [
    // Applique le middleware à toutes les routes sauf :
    // - les fichiers statiques Next.js (_next/static, _next/image)
    // - favicon.ico
    // - les images (svg, png, jpg…)
    '/((?!_next/static|_next/image|favicon\\.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
