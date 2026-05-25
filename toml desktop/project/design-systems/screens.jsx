// 3 Design Systems v2 — Snapchat / Vinted / Pinterest

const Section = ({ title, children }) => (
  <div style={{ marginBottom: 36 }}>
    <div className="label" style={{ marginBottom: 14, opacity: 0.7 }}>{title}</div>
    {children}
  </div>
);

const Swatches = ({ colors }) => (
  <div style={{ display: 'grid', gridTemplateColumns: `repeat(${colors.length}, 1fr)`, gap: 10 }}>
    {colors.map(([n, c]) => (
      <div key={n}>
        <div className="swatch" style={{ background: c, marginBottom: 6 }}></div>
        <div style={{ fontSize: 12, fontWeight: 600 }}>{n}</div>
        <div style={{ fontSize: 11, opacity: 0.55 }}>{c}</div>
      </div>
    ))}
  </div>
);

// ============== DS1 — SNAPCHAT ==============
const DSSnap = () => (
  <div className="ds ds-snap" style={{ padding: 36, height: '100%', overflow: 'auto' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 4 }}>
      <div className="label">Design System · Option 01</div>
      <div className="label">Inspiration : snapchat.com</div>
    </div>
    <h1 className="display" style={{ fontSize: 64, margin: 0, marginBottom: 8 }}>
      Snap <span style={{ background: 'var(--yellow)', padding: '0 12px', borderRadius: 12, border: '2px solid var(--ink)', display: 'inline-block', boxShadow: '4px 4px 0 var(--ink)', transform: 'rotate(-2deg)' }}>fun</span> &amp; jeune
    </h1>
    <p style={{ fontSize: 15, color: 'var(--ink-2)', maxWidth: 620, marginBottom: 32 }}>
      Énergie ado, jaune électrique, traits noirs francs, ombres tampon. Stickers, ghosts, formes rondes. Le ton léger d'une appli entre potes.
    </p>

    <Section title="Couleurs">
      <Swatches colors={[
        ['Snap Yellow', '#fffc00'], ['Ink', '#0b0b0b'], ['Pink', '#ff5fa2'],
        ['Purple', '#8a3df7'], ['Teal', '#00d6c0'], ['Blue', '#2477ff'], ['Paper', '#ffffff'],
      ]} />
    </Section>

    <Section title="Typographie">
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        <div>
          <div className="label" style={{ marginBottom: 6 }}>Sora — Display</div>
          <div className="display" style={{ fontSize: 56, marginBottom: 6 }}>Wishlist 🎁</div>
          <div className="display" style={{ fontSize: 28 }}>Noël 2026</div>
          <div style={{ fontSize: 12, color: 'var(--ink-3)', marginTop: 6 }}>Geometric, friendly, lisible petit</div>
        </div>
        <div>
          <div className="label" style={{ marginBottom: 6 }}>Inter — UI</div>
          <div style={{ fontSize: 17, fontWeight: 700, marginBottom: 4 }}>cedric a réservé un cadeau 🤫</div>
          <div style={{ fontSize: 14, color: 'var(--ink-2)' }}>500 / 600 / 700 selon hiérarchie. Beaucoup de bold pour la pop.</div>
        </div>
      </div>
    </Section>

    <Section title="Composants">
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 18, alignItems: 'center' }}>
        <button className="btn btn-primary">Send a Snap</button>
        <button className="btn btn-dark">Voir liste</button>
        <button className="btn btn-outline">Filter</button>
        <button className="btn btn-ghost">Plus tard</button>
        <span className="chip active">Tout</span>
        <span className="chip">Mode</span>
        <span className="chip">Tech</span>
        <span className="sticker">Just dropped</span>
      </div>

      <div style={{ display: 'flex', gap: 14, alignItems: 'center', marginBottom: 18 }}>
        <div className="ghost-icon">
          <svg viewBox="0 0 32 32" width="28" height="28" fill="none">
            <path d="M16 4c-5 0-8 4-8 9v8c0 1.5-1 2-2 2.5v1c2 0 3.5-.5 5-1.5 1 1 2.5 1.5 5 1.5s4-.5 5-1.5c1.5 1 3 1.5 5 1.5v-1c-1-.5-2-1-2-2.5v-8c0-5-3-9-8-9z" fill="#0b0b0b"/>
          </svg>
        </div>
        <div className="bitmoji"></div>
        <div className="bitmoji" style={{ background: 'linear-gradient(140deg, #c4d8ff, #6c8bff)' }}></div>
        <div className="bitmoji" style={{ background: 'linear-gradient(140deg, #d4f0c8, #88c068)' }}></div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
        {[1,2,3].map(i => (
          <div key={i} className="card">
            <div className={`img-${i}`} style={{ height: 160, position: 'relative' }}>
              {i === 1 && <span className="sticker" style={{ position: 'absolute', top: 12, left: 12 }}>🔒 Réservé</span>}
            </div>
            <div style={{ padding: 14 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--ink-2)', textTransform: 'uppercase', marginBottom: 4 }}>de @lea</div>
              <div className="display" style={{ fontSize: 19, marginBottom: 4 }}>Vase céramique</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, fontWeight: 700 }}>
                <span>45 €</span>
                <span style={{ color: 'var(--pink)' }}>🔥🔥🔥</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 16, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        <input className="input" placeholder="Email" />
        <input className="input" placeholder="🔍 Cherche un pote" />
      </div>
    </Section>

    <Section title="Style général">
      <div style={{ fontSize: 13, color: 'var(--ink-2)', lineHeight: 1.6 }}>
        Coins très arrondis 14–20px ou pill 999px · bordure noir 2px partout · ombre tampon 3-4px noire (jamais soft) · stickers rotation -3° · fond blanc, jaune en hero, accents pink/purple/teal en spot.
      </div>
    </Section>
  </div>
);

// ============== DS2 — VINTED ==============
const DSVinted = () => (
  <div className="ds ds-vinted" style={{ padding: 36, height: '100%', overflow: 'auto' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 4 }}>
      <div className="label">Design System · Option 02</div>
      <div className="label">Inspiration : vinted.fr</div>
    </div>
    <h1 style={{ fontSize: 56, margin: 0, marginBottom: 8, fontFamily: 'Inter Tight', fontWeight: 700, letterSpacing: '-0.025em' }}>
      Vinted <span style={{ color: 'var(--green)' }}>·</span> Friendly &amp; trust
    </h1>
    <p style={{ fontSize: 15, color: 'var(--ink-2)', maxWidth: 620, marginBottom: 32 }}>
      Inspiré marketplace : vert sapin rassurant, blanc dominant, infos claires, badges de statut, prix lisibles. UI d'efficacité — l'utilisateur trouve, réserve, marque.
    </p>

    <Section title="Couleurs">
      <Swatches colors={[
        ['Green', '#07875e'], ['Green Soft', '#d6efe4'], ['Ink', '#0c2418'],
        ['Paper', '#fbfaf6'], ['Teal', '#007782'], ['Orange', '#ff7a50'], ['Warn', '#ffd84d'],
      ]} />
    </Section>

    <Section title="Typographie">
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        <div>
          <div className="label" style={{ marginBottom: 6 }}>Inter Tight — Titres</div>
          <div style={{ fontSize: 40, fontWeight: 700, letterSpacing: '-0.025em', marginBottom: 4 }}>Mes wishlists</div>
          <div style={{ fontSize: 22, fontWeight: 700, marginBottom: 4 }}>Noël 2026</div>
          <div style={{ fontSize: 12, color: 'var(--ink-3)' }}>Tight tracking, lisibilité maximale</div>
        </div>
        <div>
          <div className="label" style={{ marginBottom: 6 }}>Inter — Corps & UI</div>
          <div style={{ fontSize: 17, fontWeight: 600, marginBottom: 4 }}>12 articles · 5 réservés</div>
          <div style={{ fontSize: 14, color: 'var(--ink-2)' }}>Densité confortable. Petits chiffres / labels en gras pour la lecture rapide.</div>
        </div>
      </div>
    </Section>

    <Section title="Composants">
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 18, alignItems: 'center' }}>
        <button className="btn btn-primary">Réserver le cadeau</button>
        <button className="btn btn-outline">Voir détails</button>
        <button className="btn btn-ghost">Partager</button>
        <button className="btn btn-warn">Acheté ✓</button>
        <span className="chip active">Tout</span>
        <span className="chip">Mode</span>
        <span className="chip success">✓ Réservé par toi</span>
        <span className="badge">Nouveau</span>
        <span className="sticker">-30%</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
        {[1,2,3,4].map(i => (
          <div key={i} className="card" style={{ position: 'relative' }}>
            <div className={`img-${i}`} style={{ height: 170, position: 'relative' }}>
              <button style={{
                position: 'absolute', top: 10, right: 10, width: 32, height: 32, borderRadius: 999,
                border: 'none', background: 'rgba(255,255,255,0.95)', cursor: 'pointer', fontSize: 16
              }}>♡</button>
              {i === 2 && <span className="badge" style={{ position: 'absolute', top: 12, left: 12 }}>Réservé</span>}
            </div>
            <div style={{ padding: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                <div className="avatar" style={{ width: 22, height: 22, border: 'none' }}></div>
                <div style={{ fontSize: 12, color: 'var(--ink-2)', fontWeight: 600 }}>cedric</div>
              </div>
              <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 4, lineHeight: 1.3 }}>Vase céramique blanc</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--green)' }}>45 €</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 16 }}>
        <div className="card" style={{ padding: 14, display: 'flex', alignItems: 'center', gap: 12 }}>
          <div className="avatar"></div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 700 }}>Léa Martin <span style={{ color: 'var(--green)', fontSize: 12 }}>● en ligne</span></div>
            <div style={{ fontSize: 12, color: 'var(--ink-2)' }}>23 articles · membre depuis 2024</div>
          </div>
          <button className="btn btn-outline">Suivre</button>
        </div>
      </div>

      <div style={{ marginTop: 14, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        <input className="input" placeholder="Email" />
        <input className="input" placeholder="🔍 Rechercher dans tes listes" />
      </div>
    </Section>

    <Section title="Style général">
      <div style={{ fontSize: 13, color: 'var(--ink-2)', lineHeight: 1.6 }}>
        Coins arrondis 8–14px · ombres ultra-discrètes · vert sapin sur prix &amp; CTAs · badges &amp; chips de statut omniprésents · grille 4 col mobile-friendly · cards qui respirent.
      </div>
    </Section>
  </div>
);

// ============== DS3 — PINTEREST ==============
const DSPin = () => (
  <div className="ds ds-pin" style={{ padding: 36, height: '100%', overflow: 'auto' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 4 }}>
      <div className="label">Design System · Option 03</div>
      <div className="label">Inspiration : pinterest.com</div>
    </div>
    <h1 className="display" style={{ fontSize: 64, margin: 0, marginBottom: 8 }}>
      Pinterest <span className="editorial-italic" style={{ color: 'var(--red)' }}>·</span> <span className="editorial-italic">Editorial &amp; tactile</span>
    </h1>
    <p style={{ fontSize: 15, color: 'var(--ink-2)', maxWidth: 620, marginBottom: 32 }}>
      Une galerie inspirante. Serif italique pour la chaleur, masonry pour le rythme visuel, rouge en accent. La wishlist devient un moodboard partagé entre proches.
    </p>

    <Section title="Couleurs">
      <Swatches colors={[
        ['Pin Red', '#e60023'], ['Ink', '#1a1a1a'], ['Paper', '#fbf9f6'],
        ['Beige', '#efe7d8'], ['Beige D', '#d8c9ad'], ['Olive', '#5a5635'], ['Red Soft', '#fde6ea'],
      ]} />
    </Section>

    <Section title="Typographie">
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        <div>
          <div className="label" style={{ marginBottom: 6 }}>DM Serif Display — Titres</div>
          <div className="display" style={{ fontSize: 56, marginBottom: 4 }}>Mes <span className="editorial-italic">envies</span></div>
          <div className="display editorial-italic" style={{ fontSize: 28, color: 'var(--ink-2)' }}>moodboard de Noël</div>
        </div>
        <div>
          <div className="label" style={{ marginBottom: 6 }}>Inter — UI</div>
          <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 4 }}>12 idées épinglées</div>
          <div style={{ fontSize: 14, color: 'var(--ink-2)' }}>Sans serif neutre pour ne pas concurrencer le serif éditorial. Italiques réservés au serif.</div>
        </div>
      </div>
    </Section>

    <Section title="Composants">
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 18, alignItems: 'center' }}>
        <button className="btn btn-primary">Épingler</button>
        <button className="btn btn-dark">Réserver</button>
        <button className="btn btn-outline">Enregistrer</button>
        <button className="btn btn-ghost">Partager</button>
        <span className="chip active">Tout</span>
        <span className="chip">Maison</span>
        <span className="chip">Mode</span>
        <span className="badge">12</span>
        <span className="sticker">moodboard</span>
      </div>

      <div style={{ columnCount: 3, columnGap: 10 }}>
        {[
          { i: 1, h: 220 }, { i: 2, h: 180 },
          { i: 3, h: 260 }, { i: 4, h: 200 },
          { i: 5, h: 160 }, { i: 6, h: 240 },
        ].map(({ i, h }, k) => (
          <div key={k} className="pin">
            <div className={`img-${i}`} style={{ height: h, position: 'relative' }}>
              {k === 0 && (
                <button className="btn btn-primary" style={{ position: 'absolute', top: 10, right: 10, padding: '6px 14px', fontSize: 12 }}>Réserver</button>
              )}
              {k === 2 && <span className="sticker" style={{ position: 'absolute', bottom: 10, left: 10 }}>réservé</span>}
            </div>
            <div style={{ padding: '8px 4px' }}>
              <div style={{ fontSize: 13, fontWeight: 600, lineHeight: 1.3 }}>{['Vase céramique', 'Pull cachemire', 'Carnet relié cuir', 'Livre photo', 'Bougie', 'Cadre bois'][k]}</div>
              <div style={{ fontSize: 12, color: 'var(--ink-2)' }}>{['45 €','120 €','30 €','25 €','22 €','55 €'][k]} · de cedric</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 16, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        <input className="input" placeholder="Email" />
        <input className="input" placeholder="🔍 Rechercher des idées" />
      </div>
    </Section>

    <Section title="Style général">
      <div style={{ fontSize: 13, color: 'var(--ink-2)', lineHeight: 1.6 }}>
        Masonry 3 col · coins arrondis 18px · serif italique pour les titres &amp; sentiments · rouge Pinterest sur CTAs primaires · beige doux comme alternative au blanc · pas d'ombres, juste un soupçon de bordure.
      </div>
    </Section>
  </div>
);

// ============== DS0 — SNAP FAMILY ==============
const DSSnapFam = () => (
  <div className="ds ds-snapfam" style={{ padding: 36, height: '100%', overflow: 'auto' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 4 }}>
      <div className="label">Design System · Snap Family</div>
      <div className="label">Snap esprit · ton adulte &amp; familial</div>
    </div>
    <h1 className="display" style={{ fontSize: 60, margin: 0, marginBottom: 8 }}>
      Joyeux <span style={{ background: '#f5c948', color: 'var(--ink)', padding: '0 14px', borderRadius: 14, border: '1.5px solid var(--ink)', display: 'inline-block', boxShadow: '3px 3px 0 var(--ink)', transform: 'rotate(-2deg)' }}>chaleureux</span>
      <br />et complice.
    </h1>
    <p style={{ fontSize: 15, color: 'var(--ink-2)', maxWidth: 620, marginBottom: 32 }}>
      L'esprit Snap (formes rondes, jaune, ombres tampon, stickers manuscrits) revisité pour des familles : palette crème + indigo profond + corail terre, jaune adouci, typographie plus posée. Ludique sans être enfantin.
    </p>

    <Section title="Couleurs">
      <Swatches colors={[
        ['Crème', '#fdf9f0'], ['Encre', '#1a1a2e'], ['Jaune doux', '#f5c948'],
        ['Indigo', '#3d4a8c'], ['Corail', '#e87358'], ['Sauge', '#5a8c87'], ['Lait', '#fef0c4'],
      ]} />
    </Section>

    <Section title="Typographie">
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        <div>
          <div className="label" style={{ marginBottom: 6 }}>Sora — Display</div>
          <div className="display" style={{ fontSize: 52, marginBottom: 6 }}>Mes envies</div>
          <div className="display" style={{ fontSize: 26 }}>Noël 2026</div>
          <div style={{ fontSize: 12, color: 'var(--ink-3)', marginTop: 6 }}>Géométrique chaleureux, lisible &amp; familier</div>
        </div>
        <div>
          <div className="label" style={{ marginBottom: 6 }}>Inter + Caveat (annot.)</div>
          <div style={{ fontSize: 17, fontWeight: 600, marginBottom: 4 }}>Léa a réservé pour ton anniv 🤫</div>
          <div className="hand" style={{ fontSize: 22, color: 'var(--coral)' }}>« coup de cœur ! »</div>
          <div style={{ fontSize: 13, color: 'var(--ink-2)', marginTop: 4 }}>Caveat pour notes &amp; surprises, sans tomber dans l'ado.</div>
        </div>
      </div>
    </Section>

    <Section title="Composants">
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 18, alignItems: 'center' }}>
        <button className="btn btn-primary">Créer ma wishlist</button>
        <button className="btn btn-yellow">Réserver 🎁</button>
        <button className="btn btn-outline">Découvrir</button>
        <button className="btn btn-ghost">Plus tard</button>
        <span className="chip active">Tout</span>
        <span className="chip yellow">★ Priorité</span>
        <span className="chip">Mode</span>
        <span className="sticker">Réservé !</span>
      </div>

      <div style={{ display: 'flex', gap: 14, alignItems: 'center', marginBottom: 18 }}>
        <div className="ghost-icon">
          <svg viewBox="0 0 32 32" width="26" height="26" fill="none">
            <path d="M16 4c-5 0-8 4-8 9v8c0 1.5-1 2-2 2.5v1c2 0 3.5-.5 5-1.5 1 1 2.5 1.5 5 1.5s4-.5 5-1.5c1.5 1 3 1.5 5 1.5v-1c-1-.5-2-1-2-2.5v-8c0-5-3-9-8-9z" fill="#1a1a2e"/>
          </svg>
        </div>
        <div className="avatar"></div>
        <div className="avatar" style={{ background: 'linear-gradient(140deg, #c8d0e8, #3d4a8c)' }}></div>
        <div className="avatar" style={{ background: 'linear-gradient(140deg, #d4e0d8, #5a8c87)' }}></div>
        <span className="hand" style={{ fontSize: 20, color: 'var(--coral)' }}>← ta famille ♥</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
        {[1,2,3].map(i => (
          <div key={i} className="card">
            <div className={`img-${i}`} style={{ height: 160, position: 'relative' }}>
              {i === 1 && <span className="sticker" style={{ position: 'absolute', top: 12, left: 12 }}>Réservé ♥</span>}
            </div>
            <div style={{ padding: 14 }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--coral)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>par Léa</div>
              <div className="display" style={{ fontSize: 19, marginBottom: 4 }}>Vase céramique</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, fontWeight: 600 }}>
                <span>45 €</span>
                <span style={{ color: 'var(--ink-3)' }}>★★★</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 16, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        <input className="input" placeholder="Email" />
        <input className="input" placeholder="🔍 Trouver un proche" />
      </div>
    </Section>

    <Section title="Style général">
      <div style={{ fontSize: 13, color: 'var(--ink-2)', lineHeight: 1.6 }}>
        Coins arrondis 14–18px ou pill · bordure encre 1.5px · ombres tampon 3px (présentes mais discrètes) · jaune doux en spot, jamais en aplat plein · stickers manuscrits Caveat · indigo &amp; corail pour la profondeur émotionnelle, le tout sur crème pour la chaleur.
      </div>
    </Section>
  </div>
);

Object.assign(window, { DSSnap, DSSnapFam, DSVinted, DSPin });
