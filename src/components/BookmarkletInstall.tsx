'use client'

import { useEffect, useRef, useState } from 'react'

export default function BookmarkletInstall() {
  const linkRef = useRef<HTMLAnchorElement>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (!linkRef.current) return

    const origin = window.location.origin

    // Bookmarklet en deux temps :
    // 1. Extrait titre / image / prix de la page via OG tags + JSON-LD
    // 2. Injecte un overlay avec un iframe pointant vers /add-item-widget
    //    → l'iframe est sur le domaine TOML, a accès aux cookies de session,
    //      et communique via postMessage pour fermer l'overlay.
    const code = `(function(){
var ex=document.getElementById('toml-bm');
if(ex){ex.remove();return;}
var OR='${origin}';
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
var ov=document.createElement('div');
ov.id='toml-bm';
ov.style.cssText='position:fixed;inset:0;z-index:2147483647;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,0.5);font-family:-apple-system,BlinkMacSystemFont,system-ui,sans-serif';
var pn=document.createElement('div');
pn.style.cssText='width:400px;max-width:calc(100vw - 32px);border-radius:20px;overflow:hidden;box-shadow:0 24px 72px rgba(0,0,0,0.3);display:flex;flex-direction:column;background:#fff';
var hd=document.createElement('div');
hd.style.cssText='display:flex;justify-content:space-between;align-items:center;padding:13px 16px;background:#111;flex-shrink:0';
var lg=document.createElement('span');
lg.style.cssText='color:#fff;font-size:12px;font-weight:700;letter-spacing:.1em';
lg.textContent='TOML';
var cl=document.createElement('button');
cl.style.cssText='background:none;border:none;cursor:pointer;color:rgba(255,255,255,.65);font-size:22px;line-height:1;padding:0 2px';
cl.innerHTML='&times;';
cl.onclick=function(){ov.remove();};
hd.appendChild(lg);hd.appendChild(cl);
pn.appendChild(hd);
var params=new URLSearchParams({title:t,image:im,price:pr,sourceUrl:window.location.href});
var ifr=document.createElement('iframe');
ifr.src=OR+'/add-item-widget?'+params.toString();
ifr.style.cssText='display:block;width:100%;height:390px;border:none;background:#fff';
ifr.setAttribute('scrolling','no');
pn.appendChild(ifr);
ov.appendChild(pn);
ov.onclick=function(e){if(e.target===ov)ov.remove();};
document.body.appendChild(ov);
window.addEventListener('message',function h(e){
  if(e.origin===OR&&e.data&&e.data.type==='toml-item-added'){
    setTimeout(function(){ov.remove();},1800);
    window.removeEventListener('message',h);
  }
});
})()`.replace(/\n/g, '')

    linkRef.current.setAttribute('href', 'javascript:' + code)
    setReady(true)
  }, [])

  return (
    <div className="mt-12 border-t border-gray-100 pt-8">
      <div className="flex items-start gap-4 p-5 bg-gray-50 rounded-xl border border-gray-200">
        {/* Icône */}
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
            cliquez dessus pour l&apos;ajouter instantanément à votre wishlist — sans quitter la page.
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
              <p className="text-xs text-gray-400">
                ← Glissez vers vos favoris
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
