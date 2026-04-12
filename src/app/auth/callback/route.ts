import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse, type NextRequest } from 'next/server'
import type { EmailOtpType } from '@supabase/supabase-js'

/**
 * Route Handler Auth — gère deux flux distincts :
 *
 * Flux 1 — OAuth Google (PKCE) :
 *   Google → /auth/callback?code=xxx
 *   → exchangeCodeForSession(code)
 *
 * Flux 2 — Confirmation d'email / magic link :
 *   Supabase → /auth/callback?token_hash=xxx&type=signup
 *   → verifyOtp({ token_hash, type })
 *
 * Les deux flux redirigent vers /dashboard en cas de succès.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)

  const code       = searchParams.get('code')
  const token_hash = searchParams.get('token_hash')
  const type       = searchParams.get('type') as EmailOtpType | null
  const next       = searchParams.get('next') ?? '/dashboard'

  const successUrl = new URL(next, request.url)
  const errorUrl   = new URL('/auth/login', request.url)
  errorUrl.searchParams.set('error', 'auth_callback_error')

  // Instanciation du client une seule fois, partagé par les deux flux
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

  // ── Flux 1 : OAuth / PKCE ──────────────────────────────────────────
  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) return NextResponse.redirect(successUrl)
  }

  // ── Flux 2 : Confirmation email / magic link ───────────────────────
  // Supabase envoie token_hash + type (ex: "signup", "magiclink",
  // "email_change", "recovery") à la place d'un code PKCE.
  if (token_hash && type) {
    const { error } = await supabase.auth.verifyOtp({ token_hash, type })
    if (!error) return NextResponse.redirect(successUrl)
  }

  // ── Échec des deux flux ────────────────────────────────────────────
  return NextResponse.redirect(errorUrl)
}
