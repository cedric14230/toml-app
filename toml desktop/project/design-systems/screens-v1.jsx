// 3 Design Systems — Sezane / Nike / Instagram

const Section = ({ title, children, ds }) => (
  <div style={{ marginBottom: 36 }}>
    <div className="label" style={{ marginBottom: 14, opacity: 0.7 }}>{title}</div>
    {children}
  </div>
);

const Swatches = ({ colors }) => (
  <div style={{ display: 'grid', gridTemplateColumns: `repeat(${colors.length}, 1fr)`, gap: 10 }}>
    {colors.map(([n, c, label]) => (
      <div key={n}>
        <div className="swatch" style={{ background: c, marginBottom: 6 }}></div>
        <div style={{ fontSize: 12, fontWeight: 600 }}>{n}</div>
        <div style={{ fontSize: 11, opacity: 0.6 }}>{label || c}</div>
      </div>
    ))}
  </div>
);

// ============== DS1 — SEZANE ==============
const DSSezane = () => (
  <div className="ds ds-sezane" style={{ padding: 36, height: '100%', overflow: 'auto' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 4 }}>
      <div className="label">Design System · Option 01</div>
      <div className="label">Inspiration : sezane.com</div>
    </div>
    <h1 className="serif" style={{ fontSize: 56, margin: 0, marginBottom: 8, lineHeight: 1 }}>
      Sézane <span style={{ fontStyle: 'italic' }}>·</span> Premium chaleureux
    </h1>
    <p style={{ fontSize: 15, color: 'var(--ink-2)', maxWidth: 620, marginBottom: 32 }}>
      Une atmosphère intemporelle, rassurante. Blanc cassé chaud, accents bordeaux et camel, italiques élégants, touches manuscrites pour la chaleur familiale.
    </p>

    <Section title="Couleurs">
      <Swatches colors={[
        ['Paper', '#faf6f0'], ['Ink', '#1f1812'], ['Bordeaux', '#6b1f2a'],
        ['Camel', '#b88a5e'], ['Sage', '#6e7a5e'], ['Rose', '#e9a89a'], ['Gold', '#c89b4a'],
      ]} />
    </Section>

    <Section title="Typographie">
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        <div>
          <div className="label" style={{ marginBottom: 6 }}>Fraunces — Titres</div>
          <div className="serif" style={{ fontSize: 44, lineHeight: 1, marginBottom: 6 }}>Mes <span style={{ fontStyle: 'italic' }}>envies</span></div>
          <div className="serif" style={{ fontSize: 22, marginBottom: 4 }}>Wishlist Noël 2026</div>
          <div style={{ fontSize: 12, color: 'var(--ink-3)' }}>Variable, italique pour la touche perso</div>
        </div>
        <div>
          <div className="label" style={{ marginBottom: 6 }}>Inter — UI & corps</div>
          <div style={{ fontSize: 17, fontWeight: 500, marginBottom: 4 }}>Une seule liste, partagée.</div>
          <div style={{ fontSize: 14, color: 'var(--ink-2)', marginBottom: 6 }}>Sans propre, lisible à toutes tailles. Hiérarchie claire avec poids 400/500/600.</div>
          <div className="hand" style={{ fontSize: 22, color: 'var(--burgundy)' }}>« petit mot manuscrit »</div>
        </div>
      </div>
    </Section>

    <Section title="Composants">
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 16, alignItems: 'center' }}>
        <button className="btn btn-primary">Action principale</button>
        <button className="btn btn-outline">Secondaire</button>
        <button className="btn btn-ghost">Ghost</button>
        <span className="chip active">Tout</span>
        <span className="chip">Filter</span>
        <span className="chip">★★★ Priorité</span>
        <span className="sticker">Réservé ★</span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
        {[1,2,3].map(i => (
          <div key={i} className="card">
            <div className={`img-${i}`} style={{ height: 140 }}></div>
            <div style={{ padding: 14 }}>
              <div className="label" style={{ marginBottom: 4, color: 'var(--camel-d)' }}>Sézane</div>
              <div className="serif" style={{ fontSize: 17, marginBottom: 4 }}>Robe Liliana</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                <span style={{ fontWeight: 600 }}>89 €</span>
                <span style={{ color: 'var(--ink-3)' }}>★★★</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 14, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        <div><input className="input" placeholder="Email" /></div>
        <div><input className="input" placeholder="Rechercher un ami…" /></div>
      </div>
    </Section>

    <Section title="Style général">
      <div style={{ fontSize: 13, color: 'var(--ink-2)', lineHeight: 1.6 }}>
        Coins arrondis 10–16px · ombres très douces · 1px de bordure crème · ornements manuscrits ponctuels · italiques pour la chaleur · stickers tampons rotation -3°
      </div>
    </Section>
  </div>
);

// ============== DS2 — NIKE ==============
const DSNike = () => (
  <div className="ds ds-nike" style={{ padding: 36, height: '100%', overflow: 'auto' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 4 }}>
      <div className="label">DESIGN SYSTEM · OPTION 02</div>
      <div className="label">INSPIRATION : NIKE.COM</div>
    </div>
    <h1 className="display" style={{ fontSize: 78, margin: 0, marginBottom: 8 }}>
      NIKE <span className="italic-display" style={{ color: 'var(--accent)' }}>· BOLD</span> & ENERGETIC
    </h1>
    <p style={{ fontSize: 15, color: 'var(--ink-2)', maxWidth: 620, marginBottom: 32, fontWeight: 500 }}>
      Contraste maximal, tension graphique. Anton condensé pour les titres, italiques en MAJUSCULES pour l'énergie. Orange flash sur noir profond. Coins droits, blocs francs.
    </p>

    <Section title="COLORS">
      <Swatches colors={[
        ['White', '#ffffff'], ['Black', '#111111'], ['Orange', '#fa5400'],
        ['Hot', '#ff7300'], ['Red', '#fe0000'], ['Grey 50', '#f5f5f5'], ['Grey 200', '#e5e5e5'],
      ]} />
    </Section>

    <Section title="TYPOGRAPHY">
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        <div>
          <div className="label" style={{ marginBottom: 6 }}>ANTON — DISPLAY</div>
          <div className="display" style={{ fontSize: 60, marginBottom: 4 }}>JUST WISH IT.</div>
          <div className="italic-display" style={{ fontSize: 32 }}>NOËL <span style={{ color: 'var(--accent)' }}>2026</span></div>
        </div>
        <div>
          <div className="label" style={{ marginBottom: 6 }}>INTER TIGHT — UI</div>
          <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>Add to wishlist.</div>
          <div style={{ fontSize: 14, color: 'var(--ink-2)', fontWeight: 500 }}>Heavy weights for emphasis. Lots of UPPERCASE for actions and labels.</div>
        </div>
      </div>
    </Section>

    <Section title="COMPONENTS">
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 16, alignItems: 'center' }}>
        <button className="btn btn-primary">SHOP NOW</button>
        <button className="btn btn-accent">RESERVE</button>
        <button className="btn btn-outline">DETAILS</button>
        <button className="btn btn-primary btn-square">FILTER</button>
        <span className="chip active">ALL</span>
        <span className="chip">UNDER 50€</span>
        <span className="chip flat">PRIORITY</span>
        <span className="sticker">JUST IN</span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
        {[1,2,3].map(i => (
          <div key={i} className="card" style={{ position: 'relative' }}>
            <div className={`img-${i}`} style={{ height: 200 }}></div>
            {i === 1 && <span className="sticker" style={{ position: 'absolute', top: 12, left: 12 }}>RESERVED</span>}
            <div style={{ padding: 14 }}>
              <div style={{ fontSize: 11, color: 'var(--ink-2)', fontWeight: 600, marginBottom: 4 }}>Just dropped</div>
              <div className="display" style={{ fontSize: 19, marginBottom: 4 }}>AIR ZOOM PEGASUS 41</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, fontWeight: 700 }}>
                <span>140€</span>
                <span style={{ color: 'var(--accent)' }}>★★★</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 14, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        <div><input className="input" placeholder="EMAIL" /></div>
        <div><input className="input" placeholder="SEARCH..." /></div>
      </div>
    </Section>

    <Section title="STYLE">
      <div style={{ fontSize: 13, color: 'var(--ink-2)', lineHeight: 1.6, fontWeight: 500 }}>
        Coins droits ou pill 999px (jamais entre les deux) · zéro ombre · bordures 1.5px noir franc · UPPERCASE partout · italiques chargés d'énergie · orange flash en spot, sinon noir & blanc.
      </div>
    </Section>
  </div>
);

// ============== DS3 — INSTAGRAM ==============
const DSInsta = () => (
  <div className="ds ds-insta" style={{ padding: 36, height: '100%', overflow: 'auto' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 4 }}>
      <div className="label">Design System · Option 03</div>
      <div className="label">Inspiration : instagram.com</div>
    </div>
    <h1 style={{ fontSize: 52, margin: 0, marginBottom: 8, fontWeight: 600, letterSpacing: '-0.025em' }}>
      <span className="grad-text">Instagram</span> · Clean social
    </h1>
    <p style={{ fontSize: 15, color: 'var(--ink-2)', maxWidth: 620, marginBottom: 32 }}>
      Minimalisme blanc, focus total sur l'image et les avatars. Coins arrondis 8–12px, gradient signature pour les stories et CTAs forts. Une UI qui s'efface devant le contenu.
    </p>

    <Section title="Couleurs">
      <Swatches colors={[
        ['White', '#ffffff'], ['Ink', '#262626'], ['Grey 100', '#fafafa'],
        ['Grey 300', '#dbdbdb'], ['Blue CTA', '#0095f6'], ['Red Like', '#ed4956'],
      ]} />
      <div style={{ marginTop: 12, padding: 16, borderRadius: 12, background: 'linear-gradient(45deg, #f09433, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888)' }}>
        <div style={{ color: 'white', fontWeight: 600, fontSize: 14 }}>Gradient signature — stories, CTAs émotionnels</div>
      </div>
    </Section>

    <Section title="Typographie">
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        <div>
          <div className="label" style={{ marginBottom: 6 }}>Inter — Tout</div>
          <div style={{ fontSize: 36, fontWeight: 700, letterSpacing: '-0.03em', marginBottom: 4 }}>Mes wishlists</div>
          <div style={{ fontSize: 22, fontWeight: 600, marginBottom: 4 }}>Noël 2026</div>
          <div style={{ fontSize: 14, fontWeight: 600 }}>cedric · 12 articles</div>
        </div>
        <div>
          <div className="label" style={{ marginBottom: 6 }}>Logo manuscrit</div>
          <div className="billabong" style={{ fontSize: 44, marginBottom: 4 }}>toml</div>
          <div style={{ fontSize: 13, color: 'var(--ink-2)' }}>Une seule font (Inter) à tous les poids. Logo manuscrit pour la chaleur, contre-pied du sans-serif partout.</div>
        </div>
      </div>
    </Section>

    <Section title="Composants">
      <div style={{ display: 'flex', gap: 14, alignItems: 'center', marginBottom: 16, paddingBottom: 16, borderBottom: '1px solid var(--line)' }}>
        {['+', 'L', 'M', 'A', 'J'].map((c, i) => (
          <div key={i} style={{ textAlign: 'center' }}>
            <div className={i === 0 ? '' : 'story'}>
              <div style={{
                width: 56, height: 56, borderRadius: 999,
                background: i === 0 ? 'var(--bg-2)' : `hsl(${i * 60}, 50%, 80%)`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 600, color: i === 0 ? 'var(--ink-2)' : 'var(--ink)',
                border: i === 0 ? '2px dashed var(--line)' : 'none',
              }}>{c}</div>
            </div>
            <div style={{ fontSize: 11, marginTop: 4 }}>{i === 0 ? 'Toi' : ['Léa','Marc','Amandine','Julie'][i-1]}</div>
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16, alignItems: 'center' }}>
        <button className="btn btn-primary">Suivre</button>
        <button className="btn btn-grad">Réserver 🎁</button>
        <button className="btn btn-outline">Message</button>
        <button className="btn btn-ghost">Partager</button>
        <span className="chip active">Tout</span>
        <span className="chip">Articles</span>
        <span className="chip">Listes</span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 4, marginBottom: 14 }}>
        {[1,2,3,4,1,2].map((i, k) => (
          <div key={k} className={`img-${i}`} style={{ aspectRatio: '1', borderRadius: 0 }}></div>
        ))}
      </div>
      <div className="card">
        <div style={{ padding: 12, display: 'flex', alignItems: 'center', gap: 10, borderBottom: '1px solid var(--line)' }}>
          <div className="story" style={{ padding: 1 }}>
            <div style={{ width: 30, height: 30, borderRadius: 999, background: 'var(--img-3, #d8f0d4)', backgroundImage: 'linear-gradient(140deg, #c4d3f0, #8ba6e0)' }}></div>
          </div>
          <div style={{ flex: 1, fontSize: 13, fontWeight: 600 }}>lea_martin</div>
          <span style={{ fontSize: 16 }}>⋯</span>
        </div>
        <div className="img-2" style={{ height: 240 }}></div>
        <div style={{ padding: 12 }}>
          <div style={{ display: 'flex', gap: 14, fontSize: 22, marginBottom: 6 }}>
            <span style={{ color: 'var(--red)' }}>♥</span>
            <span>💬</span>
            <span>↗</span>
          </div>
          <div style={{ fontSize: 13, fontWeight: 600 }}>23 j'adore</div>
          <div style={{ fontSize: 13 }}><strong>lea_martin</strong> Vase céramique, mon coup de cœur 🤍</div>
        </div>
      </div>
      <div style={{ marginTop: 14, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        <div><input className="input" placeholder="Email" /></div>
        <div><input className="input" placeholder="🔍 Rechercher" /></div>
      </div>
    </Section>

    <Section title="Style général">
      <div style={{ fontSize: 13, color: 'var(--ink-2)', lineHeight: 1.6 }}>
        Blanc dominant · coins arrondis 8–12px · zéro ombre, juste 1px gris clair · gradient orange/rose/violet en signature (stories) · UI qui s'efface · grille 3 col carrées · réactions emotionnelles centrales.
      </div>
    </Section>
  </div>
);

Object.assign(window, { DSSezane, DSNike, DSInsta });
