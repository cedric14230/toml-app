// TOML Hi-fi — Landing B (split + stack cards)

const HiLanding = () => (
  <TBrowser url="toml.app">
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <TNav />
      <div style={{ display: 'grid', gridTemplateColumns: '1.05fr 1fr', flex: 1, overflow: 'hidden' }}>
        <div style={{ padding: '60px 56px', display: 'flex', flexDirection: 'column', justifyContent: 'center', position: 'relative' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 22 }}>
            <span className="tlabel" style={{ color: 'var(--burgundy)' }}>Wishlists partagées</span>
            <span style={{ width: 24, height: 1, background: 'var(--burgundy)' }}></span>
            <span className="tlabel">Pour les familles</span>
          </div>
          <h1 className="toml-serif" style={{
            fontSize: 68, lineHeight: 0.98, fontWeight: 400, margin: 0, marginBottom: 22, letterSpacing: '-0.025em',
          }}>
            Vos envies.<br/>
            <span style={{ fontStyle: 'italic', fontWeight: 500 }} className="tunderline">Partagées.</span><br/>
            Offertes.
          </h1>
          <p style={{ fontSize: 17, color: 'var(--ink-2)', lineHeight: 1.5, maxWidth: 460, margin: '0 0 30px' }}>
            Créez votre wishlist depuis n'importe quel site, partagez-la en un lien, et laissez vos proches vous offrir exactement ce qui vous fait envie.
          </p>
          <div style={{ display: 'flex', gap: 12, marginBottom: 32 }}>
            <button className="tbtn tbtn-primary tbtn-lg">Créer ma wishlist</button>
            <button className="tbtn tbtn-outline tbtn-lg">Découvrir une wishlist</button>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ display: 'flex' }}>
              {['L','M','A','J','S'].map((c, i) => (
                <div key={i} className={`tavatar sm bg-${(i % 5) + 1}`} style={{ marginLeft: i ? -8 : 0, border: '2px solid var(--paper)' }}>{c}</div>
              ))}
            </div>
            <div style={{ fontSize: 13, color: 'var(--ink-2)' }}>
              <strong>+ 500 familles</strong> ont déjà rejoint TOML
            </div>
          </div>
          <div className="tnote" style={{ position: 'absolute', bottom: 30, left: 56, transform: 'rotate(-2deg)' }}>
            ★ 100% gratuit
          </div>
        </div>
        <div style={{
          background: 'var(--paper-2)',
          borderLeft: '1px solid var(--line)',
          padding: 36,
          position: 'relative',
          overflow: 'hidden',
        }}>
          <div style={{ position: 'absolute', top: '20%', left: '15%', width: 8, height: 8, borderRadius: 999, background: 'var(--burgundy)', opacity: 0.5 }}></div>
          <div style={{ position: 'absolute', top: '70%', left: '10%', width: 6, height: 6, borderRadius: 999, background: 'var(--camel)', opacity: 0.6 }}></div>
          <div style={{ position: 'absolute', top: '40%', right: '12%', width: 10, height: 10, borderRadius: 999, background: 'var(--rose)', opacity: 0.5 }}></div>

          <div className="tcard" style={{
            position: 'absolute', top: 50, left: 30, width: 280,
            transform: 'rotate(-3deg)', boxShadow: 'var(--shadow-lg)',
          }}>
            <div style={{ padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 10, borderBottom: '1px solid var(--line)' }}>
              <div className="tavatar sm bg-2">S</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 600 }}>Sophie</div>
                <div style={{ fontSize: 11, color: 'var(--ink-3)' }}>Noël 2026</div>
              </div>
              <span className="tchip tchip-sm">12</span>
            </div>
            <TImg tone={2} h={180} />
            <div style={{ padding: 12 }}>
              <div className="toml-serif" style={{ fontSize: 15, fontWeight: 500, marginBottom: 4 }}>Robe Liliana — Sézane</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 13, color: 'var(--ink-2)', fontWeight: 600 }}>89 €</span>
                <TStars n={3} sm />
              </div>
            </div>
          </div>

          <div className="tcard" style={{
            position: 'absolute', bottom: 60, right: 30, width: 260,
            transform: 'rotate(3deg)', boxShadow: 'var(--shadow-lg)',
          }}>
            <div style={{ padding: '10px 12px', display: 'flex', alignItems: 'center', gap: 10, borderBottom: '1px solid var(--line)' }}>
              <div className="tavatar sm bg-3">T</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 600 }}>Thomas</div>
                <div style={{ fontSize: 11, color: 'var(--ink-3)' }}>Anniversaire</div>
              </div>
            </div>
            <TImg tone={7} h={160} sticker="Réservé ✓" />
            <div style={{ padding: 12 }}>
              <div className="toml-serif" style={{ fontSize: 15, fontWeight: 500, marginBottom: 4 }}>Cafetière Italienne</div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 13, color: 'var(--ink-2)', fontWeight: 600 }}>45 €</span>
                <span style={{ fontSize: 11, color: 'var(--camel-d)', fontWeight: 600 }}>par Léa</span>
              </div>
            </div>
          </div>

          <div style={{
            position: 'absolute', top: 240, left: 200, transform: 'rotate(-1deg)',
            background: 'var(--paper)', borderRadius: 12, padding: '10px 14px',
            boxShadow: 'var(--shadow-md)', border: '1px solid var(--line)',
            display: 'flex', alignItems: 'center', gap: 8,
            fontSize: 12,
          }}>
            <span style={{ width: 24, height: 24, borderRadius: 999, background: 'var(--burgundy)', color: 'var(--paper)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 12 }}>♥</span>
            <span><strong>Léa</strong> a aimé ton article</span>
          </div>
        </div>
      </div>
    </div>
  </TBrowser>
);

Object.assign(window, { HiLanding });
