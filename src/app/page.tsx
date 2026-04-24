import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createSupabaseServerClient } from '@/lib/supabase/server'

export default async function HomePage() {
  const supabase = await createSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (user) redirect('/dashboard')

  return (
    <div className="min-h-screen bg-white text-black font-[family-name:var(--font-geist-sans)]">
      {/* ── NAV ─────────────────────────────────────────────────────── */}
      <nav className="fixed top-0 inset-x-0 z-50 flex items-center justify-between px-8 py-5 bg-white/95 backdrop-blur-sm border-b border-gray-100">
        <span className="text-xl font-bold tracking-tight">TOML</span>
        <div className="flex items-center gap-2">
          <Link
            href="/auth/login"
            className="text-sm text-gray-500 hover:text-black transition-colors px-4 py-2"
          >
            Se connecter
          </Link>
          <Link
            href="/auth/signup"
            className="text-sm bg-black text-white px-5 py-2.5 rounded-full hover:bg-gray-800 transition-colors"
          >
            Créer un compte
          </Link>
        </div>
      </nav>

      {/* ── 1. HERO ──────────────────────────────────────────────────── */}
      <section className="pt-44 pb-32 px-6 text-center">
        <p className="text-xs uppercase tracking-[0.2em] text-gray-400 mb-10">
          Top On My List
        </p>
        <h1 className="text-6xl md:text-8xl font-bold tracking-tight leading-[1.05] mb-8">
          Vos envies.
          <br />
          <span className="text-gray-300">Partagées.</span>
          <br />
          Offertes.
        </h1>
        <p className="text-lg md:text-xl text-gray-500 max-w-2xl mx-auto mb-14 leading-relaxed">
          Créez votre wishlist depuis n&apos;importe quel site, partagez-la en un
          lien, et laissez vos proches vous offrir exactement ce qui vous fait
          envie.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/auth/signup"
            className="inline-block bg-black text-white px-9 py-4 rounded-full text-base font-medium hover:bg-gray-800 transition-colors"
          >
            Créer ma wishlist
          </Link>
          <Link
            href="/auth/login"
            className="inline-block border border-gray-300 text-black px-9 py-4 rounded-full text-base font-medium hover:border-black transition-colors"
          >
            Découvrir une wishlist
          </Link>
        </div>
      </section>

      {/* ── 2. PROBLÈME ─────────────────────────────────────────────── */}
      <section className="py-24 px-6 bg-beige">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">
            Offrir un cadeau, c&apos;est compliqué.
          </h2>
          <p className="text-gray-500 mb-16">On le sait. On l&apos;a tous vécu.</p>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl p-8 text-left shadow-sm">
              <div className="text-4xl mb-5">🤔</div>
              <h3 className="text-lg font-semibold mb-3">
                On ne sait pas quoi offrir
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                On tourne en rond, on cherche des idées, et on finit par offrir
                quelque chose qui n&apos;est pas vraiment désiré.
              </p>
            </div>
            <div className="bg-white rounded-2xl p-8 text-left shadow-sm">
              <div className="text-4xl mb-5">📋</div>
              <h3 className="text-lg font-semibold mb-3">
                Les listes sont éparpillées
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                Un message vocal, un screenshot, une note sur le frigo…
                Retrouver la liste, c&apos;est toute une aventure.
              </p>
            </div>
            <div className="bg-white rounded-2xl p-8 text-left shadow-sm">
              <div className="text-4xl mb-5">🎁</div>
              <h3 className="text-lg font-semibold mb-3">
                On offre le même cadeau
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                Trois tantes, une même idée. Résultat&nbsp;: deux cadeaux
                identiques et une gêne générale autour de la table.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 3. SOLUTION ──────────────────────────────────────────────── */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">
              TOML simplifie tout.
            </h2>
            <p className="text-gray-500">Pour vous, et pour ceux qui vous aiment.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {/* Sophie — Wishlist-Maker */}
            <div className="border border-gray-200 rounded-3xl p-10">
              <p className="text-xs uppercase tracking-[0.2em] text-gray-400 mb-2">
                Pour vous
              </p>
              <h3 className="text-2xl font-bold mb-10">
                Sophie, wishlist-maker
              </h3>
              <div className="space-y-8">
                <div className="flex gap-4">
                  <span className="flex-none w-8 h-8 bg-black text-white rounded-full flex items-center justify-center text-sm font-semibold">
                    1
                  </span>
                  <div>
                    <p className="font-semibold mb-1">Ajoutez depuis partout</p>
                    <p className="text-gray-500 text-sm leading-relaxed">
                      Zara, Sézane, Amazon, n&apos;importe où. En un clic via le
                      bookmarklet.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <span className="flex-none w-8 h-8 bg-black text-white rounded-full flex items-center justify-center text-sm font-semibold">
                    2
                  </span>
                  <div>
                    <p className="font-semibold mb-1">Partagez un lien unique</p>
                    <p className="text-gray-500 text-sm leading-relaxed">
                      Un seul lien pour toute votre famille et vos amis. Sans
                      app à installer.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <span className="flex-none w-8 h-8 bg-black text-white rounded-full flex items-center justify-center text-sm font-semibold">
                    3
                  </span>
                  <div>
                    <p className="font-semibold mb-1">
                      Recevez ce qui vous fait envie
                    </p>
                    <p className="text-gray-500 text-sm leading-relaxed">
                      Plus de devinettes, plus de cadeaux ratés. Exactement ce
                      que vous aviez choisi.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Thomas — Gift-Giver */}
            <div className="bg-black text-white rounded-3xl p-10">
              <p className="text-xs uppercase tracking-[0.2em] text-gray-500 mb-2">
                Pour vos proches
              </p>
              <h3 className="text-2xl font-bold mb-10">Thomas, gift-giver</h3>
              <div className="space-y-8">
                <div className="flex gap-4">
                  <span className="flex-none w-8 h-8 bg-white text-black rounded-full flex items-center justify-center text-sm font-semibold">
                    1
                  </span>
                  <div>
                    <p className="font-semibold mb-1">Accèdent à votre liste</p>
                    <p className="text-gray-500 text-sm leading-relaxed">
                      Sans créer de compte. Un simple lien suffit.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <span className="flex-none w-8 h-8 bg-white text-black rounded-full flex items-center justify-center text-sm font-semibold">
                    2
                  </span>
                  <div>
                    <p className="font-semibold mb-1">Réservent discrètement</p>
                    <p className="text-gray-500 text-sm leading-relaxed">
                      La surprise reste intacte. Vous ne voyez pas ce qui a été
                      réservé.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <span className="flex-none w-8 h-8 bg-white text-black rounded-full flex items-center justify-center text-sm font-semibold">
                    3
                  </span>
                  <div>
                    <p className="font-semibold mb-1">Plus de doublons</p>
                    <p className="text-gray-500 text-sm leading-relaxed">
                      Chacun voit ce qui est déjà pris. Fini la gêne des
                      cadeaux identiques.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 4. SOCIAL PROOF ──────────────────────────────────────────── */}
      <section className="py-24 px-6 bg-beige">
        <div className="max-w-5xl mx-auto text-center">
          <p className="text-xs uppercase tracking-[0.2em] text-gray-500 mb-4">
            Ils utilisent TOML
          </p>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-16">
            Rejoignez les premières familles
            <br />
            qui utilisent TOML
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl p-8 text-left shadow-sm">
              <p className="text-gray-700 leading-relaxed mb-6 text-sm">
                &ldquo;Mes parents ne savaient jamais quoi m&apos;offrir. Maintenant ils
                consultent ma liste TOML — je reçois exactement ce qui me fait
                envie.&rdquo;
              </p>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-gray-900 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                  L
                </div>
                <div>
                  <p className="font-medium text-sm">Léa, 28 ans</p>
                  <p className="text-gray-400 text-xs">Paris</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-8 text-left shadow-sm">
              <p className="text-gray-700 leading-relaxed mb-6 text-sm">
                &ldquo;On achetait souvent le même cadeau dans la famille. Depuis TOML,
                plus de doublon — on sait exactement quoi réserver, et c&apos;est
                discret.&rdquo;
              </p>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-gray-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                  M
                </div>
                <div>
                  <p className="font-medium text-sm">Marc, 54 ans</p>
                  <p className="text-gray-400 text-xs">Lyon</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-8 text-left shadow-sm">
              <p className="text-gray-700 leading-relaxed mb-6 text-sm">
                &ldquo;J&apos;ai partagé ma liste d&apos;anniversaire à toute ma famille en un
                message. Simple, rapide, et tout le monde a su quoi offrir.&rdquo;
              </p>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-gray-400 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                  A
                </div>
                <div>
                  <p className="font-medium text-sm">Amandine, 34 ans</p>
                  <p className="text-gray-400 text-xs">Bordeaux</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 5. CTA FINAL ─────────────────────────────────────────────── */}
      <section className="py-36 px-6 bg-black text-white text-center">
        <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
          Prêt à simplifier vos cadeaux&nbsp;?
        </h2>
        <p className="text-gray-400 text-lg mb-12 max-w-xl mx-auto leading-relaxed">
          Rejoignez TOML gratuitement et créez votre première wishlist en moins
          de deux minutes.
        </p>
        <Link
          href="/auth/signup"
          className="inline-block bg-white text-black px-10 py-4 rounded-full text-base font-medium hover:bg-gray-100 transition-colors"
        >
          Créer mon compte gratuitement
        </Link>
      </section>

      {/* ── 6. FOOTER ────────────────────────────────────────────────── */}
      <footer className="py-8 px-6 border-t border-gray-100 text-center text-sm text-gray-400">
        <div className="flex items-center justify-center gap-6">
          <span>© TOML 2026</span>
          <a href="#" className="hover:text-gray-600 transition-colors">
            Confidentialité
          </a>
          <a href="#" className="hover:text-gray-600 transition-colors">
            CGU
          </a>
        </div>
      </footer>
    </div>
  )
}
