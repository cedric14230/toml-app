'use client'

import { useEffect, useRef, useState } from 'react'
import { useIsMobile } from '@/hooks/useIsMobile'

export default function BookmarkletInstall() {
  const isMobile = useIsMobile()
  const linkRef = useRef<HTMLAnchorElement>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (!linkRef.current) return

    const origin = window.location.origin

    // Approche Pinterest / Pocket :
    // 1. Lit les métadonnées produit (OG tags + JSON-LD Schema.org)
    // 2. Ouvre un nouvel onglet vers /add-item avec les données en paramètres
    // Zéro problème de cookies tiers — la session est lue sur le domaine TOML.
    const code = `(function(){
function g(p){var e=document.querySelector('meta[property="'+p+'"]')||document.querySelector('meta[name="'+p+'"]');return e?e.getAttribute('content'):'';}
var t=g('og:title')||g('twitter:title')||document.title||'';
var im=g('og:image')||g('og:image:url')||g('twitter:image')||'';
var pr=g('og:price:amount')||g('product:price:amount')||'';
var ss=document.querySelectorAll('script[type="application/ld+json"]');
for(var k=0;k<ss.length;k++){
  try{
    var d=JSON.parse(ss[k].textContent||'');
    var ns=d['@graph']?d['@graph']:(Array.isArray(d)?d:[d]);
    for(var j=0;j<ns.length;j++){
      var n=ns[j];
      if(n['@type']==='Product'){
        t=t||n.name||'';
        var imd=n.image;
        if(!im){if(typeof imd==='string')im=imd;else if(imd&&imd.url)im=imd.url;else if(Array.isArray(imd)&&imd[0])im=typeof imd[0]==='string'?imd[0]:(imd[0].url||'');}
        if(!pr){var of=Array.isArray(n.offers)?n.offers[0]:n.offers;if(of&&of.price)pr=String(of.price);}
        break;
      }
    }
  }catch(e){}
}
window.open('${origin}/add-item?'+new URLSearchParams({title:t,image:im,price:pr,sourceUrl:window.location.href}).toString(),'_blank');
})()`.replace(/\n/g, '')

    linkRef.current.setAttribute('href', 'javascript:' + code)
    setReady(true)
  }, [])

  if (isMobile) return null

  return (
    <div className="mt-12 border-t border-gray-100 pt-8">
      <div className="flex items-start gap-4 p-5 bg-gray-50 rounded-xl border border-gray-200">
        <div className="w-10 h-10 bg-gray-900 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
          </svg>
        </div>

        <div className="flex-1 min-w-0">
          <h2 className="text-sm font-semibold text-gray-900 mb-1">
            Ajouter depuis n&apos;importe quel site
          </h2>
          <p className="text-sm text-gray-500 mb-3">
            Glissez ce bouton dans votre barre de favoris. Sur n&apos;importe quelle page produit,
            cliquez dessus pour l&apos;ajouter à votre wishlist en un clic.
          </p>

          <div className="flex items-center gap-3">
            <a
              ref={linkRef}
              href="#"
              className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg cursor-grab active:cursor-grabbing select-none"
              draggable="true"
              aria-label="Bookmarklet TOML — à glisser dans les favoris"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              + Ajouter à TOML
            </a>

            {ready && (
              <p className="text-xs text-gray-400">← Glissez vers vos favoris</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
