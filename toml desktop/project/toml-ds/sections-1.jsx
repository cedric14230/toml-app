// Toml DS — Sections 1 : Cover, Logo, Colors, Typography

const TSection = ({ title, eyebrow, children, style }) => (
  <div className="t-section" style={style}>
    <div className="t-section-head">
      <div>
        {eyebrow && <div className="label" style={{ marginBottom: 4 }}>{eyebrow}</div>}
        <h2 className="display-2" style={{ fontSize: 22 }}>{title}</h2>
      </div>
    </div>
    {children}
  </div>
);

const TBoard = ({ children, padding = 40 }) => (
  <div className="toml-ds" style={{ padding, height: '100%', overflow: 'auto', background: 'var(--t-bg)' }}>
    {children}
  </div>
);

// === COVER ===
const SCover = () => (
  <TBoard padding={48}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32 }}>
      <div>
        <div className="label" style={{ marginBottom: 8 }}>Design System</div>
        <div className="label" style={{ color: 'var(--t-rose)', marginBottom: 0 }}>v1.0 · Mai 2026</div>
      </div>
      <div style={{ textAlign: 'right' }}>
        <div className="label">Inspiration</div>
        <div style={{ fontSize: 13, color: 'var(--t-ink-2)', marginTop: 2 }}>Snap esprit · adulte & familial</div>
      </div>
    </div>

    <h1 className="display" style={{ fontSize: 120, marginBottom: 18, letterSpacing: '-0.04em' }}>
      Toml.
    </h1>
    <div className="display-2" style={{ fontSize: 28, color: 'var(--t-ink-2)', marginBottom: 30, maxWidth: 720 }}>
      Wishlists partagées,<br/>
      <span style={{ background: '#f5c948', padding: '0 14px', borderRadius: 14, border: '1.5px solid var(--t-ink)', display: 'inline-block', boxShadow: '3px 3px 0 var(--t-ink)', transform: 'rotate(-1.5deg)', marginTop: 6 }}>
        cadeaux trouvés.
      </span>
    </div>

    <div style={{ display: 'flex', gap: 0, marginBottom: 30, borderRadius: 16, overflow: 'hidden', border: '1.5px solid var(--t-ink)' }}>
      {[
        ['#e6ecf2', 'var(--t-ink)'],
        ['#1a1f2e', '#fff'],
        ['#5a6f9c', '#fff'],
        ['#c47884', '#fff'],
        ['#d4a73c', 'var(--t-ink)'],
        ['#f5c948', 'var(--t-ink)'],
      ].map(([c, txt], i) => (
        <div key={i} style={{ flex: 1, background: c, color: txt, padding: '24px 16px', fontFamily: 'var(--t-font-ui)', fontWeight: 600, fontSize: 12 }}>
          {['Bleu glacé', 'Encre', 'Denim', 'Rose terre', 'Moutarde', 'Soleil'][i]}
          <div style={{ fontSize: 10, opacity: 0.7, marginTop: 2 }}>{c}</div>
        </div>
      ))}
    </div>

    <div style={{ display: 'flex', gap: 14, alignItems: 'center', flexWrap: 'wrap', marginBottom: 36 }}>
      <button className="btn btn-primary btn-stamp">Créer ma wishlist</button>
      <button className="btn btn-accent btn-stamp">Réserver 🎁</button>
      <button className="btn btn-outline">Découvrir</button>
      <span className="chip chip-active">Tout</span>
      <span className="chip chip-mustard">★ Priorité</span>
      <span className="chip">Mode</span>
      <span className="sticker">Réservé !</span>
      <span className="hand" style={{ fontSize: 22, color: 'var(--t-rose)' }}>« mon coup de cœur »</span>
    </div>

    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 18 }}>
      {[
        { e: 'Foundations', t: 'Couleurs, typo, espacements, ombres, radii' },
        { e: 'Atoms', t: 'Boutons, chips, inputs, badges, stickers' },
        { e: 'Molecules', t: 'Cards, avatars, dropdowns' },
        { e: 'Patterns', t: 'Item, wishlist, feed, gift-giver, empty' },
      ].map((s, i) => (
        <div key={i} className="card" style={{ padding: 16, boxShadow: 'none', borderColor: 'var(--t-line)' }}>
          <div className="label" style={{ color: 'var(--t-rose)', marginBottom: 6 }}>0{i + 1}</div>
          <div className="display-2" style={{ fontSize: 17, marginBottom: 4 }}>{s.e}</div>
          <div style={{ fontSize: 12, color: 'var(--t-ink-2)', lineHeight: 1.4 }}>{s.t}</div>
        </div>
      ))}
    </div>
  </TBoard>
);

// === LOGO ===
const Logo1 = ({ size = 36, light }) => (
  <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
    <span style={{
      width: size * 0.9, height: size * 0.9, borderRadius: size * 0.2,
      background: light ? '#fff' : 'var(--t-ink)',
      color: light ? 'var(--t-ink)' : '#fff',
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: 'var(--t-font-display)', fontWeight: 800, fontSize: size * 0.5,
    }}>t</span>
    <span style={{ fontFamily: 'var(--t-font-display)', fontWeight: 700, fontSize: size, letterSpacing: '-0.04em', color: light ? '#fff' : 'var(--t-ink)' }}>oml.</span>
  </div>
);

const Logo2 = ({ size = 36, light }) => (
  <div style={{ display: 'inline-flex', alignItems: 'baseline' }}>
    <span style={{ fontFamily: 'var(--t-font-display)', fontWeight: 700, fontSize: size, letterSpacing: '-0.04em', color: light ? '#fff' : 'var(--t-ink)' }}>tom</span>
    <span style={{
      fontFamily: 'var(--t-font-display)', fontWeight: 700, fontSize: size, letterSpacing: '-0.04em',
      color: light ? 'var(--t-bg)' : 'var(--t-ink)',
      background: light ? 'var(--t-rose)' : '#f5c948',
      padding: '0 4px', borderRadius: 6, marginLeft: 2,
      border: '1.5px solid ' + (light ? 'var(--t-rose)' : 'var(--t-ink)'),
      transform: 'rotate(-2deg)', display: 'inline-block', lineHeight: 1,
    }}>l</span>
  </div>
);

const Logo3 = ({ size = 36, light }) => (
  <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <circle cx="16" cy="16" r="14" fill={light ? '#fff' : 'var(--t-ink)'} stroke={light ? '#fff' : 'var(--t-ink)'} strokeWidth="2"/>
      <path d="M10 11.5 L22 11.5 M16 11.5 L16 22" stroke={light ? 'var(--t-ink)' : '#fff'} strokeWidth="2.5" strokeLinecap="round"/>
      <circle cx="22" cy="9" r="2.5" fill="#f5c948" stroke={light ? '#fff' : 'var(--t-ink)'} strokeWidth="1.5"/>
    </svg>
    <span style={{ fontFamily: 'var(--t-font-display)', fontWeight: 700, fontSize: size * 0.85, letterSpacing: '-0.03em', color: light ? '#fff' : 'var(--t-ink)' }}>toml</span>
  </div>
);

const SLogo = () => (
  <TBoard>
    <TSection title="Logo · Wordmark" eyebrow="Identité">
      <p style={{ fontSize: 14, color: 'var(--t-ink-2)', maxWidth: 600, marginTop: 0, marginBottom: 28 }}>
        Trois explorations de logotype. Toujours en minuscules pour le côté chaleureux & complice. Le « . » final ancre le mot et évoque la liste qui se ferme proprement.
      </p>

      <div className="t-grid-3" style={{ marginBottom: 32 }}>
        {[
          { name: 'A · Initiale tampon', sub: 'Lettre "t" dans un carré sombre + wordmark', Logo: Logo1 },
          { name: 'B · Sticker souligné', sub: 'Dernière lettre en sticker tilté — plus joueur', Logo: Logo2 },
          { name: 'C · Étoile + symbole', sub: 'Marque circulaire avec star (priorité)', Logo: Logo3 },
        ].map((v, i) => (
          <div key={i}>
            <div className="card" style={{ background: 'var(--t-paper)', padding: '40px 24px', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 140 }}>
              <v.Logo size={42} />
            </div>
            <div style={{ marginTop: 10 }}>
              <div className="display-2" style={{ fontSize: 15, marginBottom: 2 }}>{v.name}</div>
              <div style={{ fontSize: 12, color: 'var(--t-ink-3)' }}>{v.sub}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="label" style={{ marginBottom: 12 }}>Échelles & contextes</div>
      <div className="t-grid-3">
        <div className="card-soft" style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 18, alignItems: 'flex-start' }}>
          <Logo2 size={56} />
          <Logo2 size={32} />
          <Logo2 size={20} />
          <Logo2 size={14} />
        </div>
        <div className="card-soft" style={{ padding: 24, background: 'var(--t-ink)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Logo2 size={40} light />
        </div>
        <div className="card-soft" style={{ padding: 24, background: 'var(--t-rose)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Logo2 size={40} light />
        </div>
      </div>
    </TSection>
  </TBoard>
);

// === COLORS ===
const ColorSwatch = ({ name, hex, role, light }) => (
  <div>
    <div className="swatch" style={{ background: hex, marginBottom: 8 }}></div>
    <div className="display-2" style={{ fontSize: 14, marginBottom: 2 }}>{name}</div>
    <div style={{ fontSize: 11, color: 'var(--t-ink-3)', fontFamily: 'monospace', marginBottom: 2 }}>{hex}</div>
    <div style={{ fontSize: 11, color: 'var(--t-ink-2)' }}>{role}</div>
  </div>
);

const SColors = () => (
  <TBoard>
    <TSection title="Couleurs" eyebrow="Foundations 01">
      <p style={{ fontSize: 14, color: 'var(--t-ink-2)', maxWidth: 600, marginTop: 0, marginBottom: 24 }}>
        Palette « Bleu glacé · Denim · Rose terre ». Un fond bleu très pâle qui apporte de la fraîcheur, des accents denim & rose terre pour la chaleur émotionnelle, jaune soleil en pop ponctuel.
      </p>

      <div className="label" style={{ marginBottom: 10 }}>Surfaces & encre</div>
      <div className="t-grid-5" style={{ marginBottom: 28 }}>
        <ColorSwatch name="Bg" hex="#e6ecf2" role="Fond principal" />
        <ColorSwatch name="Bg 2" hex="#d4dae0" role="Surfaces" />
        <ColorSwatch name="Surface" hex="#f5f8fb" role="Sub-bg léger" />
        <ColorSwatch name="Paper" hex="#ffffff" role="Cards, inputs" />
        <ColorSwatch name="Encre" hex="#1a1f2e" role="Texte, bordures" />
      </div>

      <div className="label" style={{ marginBottom: 10 }}>Accents</div>
      <div className="t-grid-5" style={{ marginBottom: 28 }}>
        <ColorSwatch name="Denim" hex="#5a6f9c" role="CTA secondaire, liens" />
        <ColorSwatch name="Denim soft" hex="#c8d0e0" role="Surfaces denim" />
        <ColorSwatch name="Rose terre" hex="#c47884" role="Accent émotionnel" />
        <ColorSwatch name="Rose soft" hex="#ecd0d4" role="Surfaces rose" />
        <ColorSwatch name="Moutarde" hex="#d4a73c" role="Priorité, étoiles" />
      </div>

      <div className="label" style={{ marginBottom: 10 }}>Pop & feedback</div>
      <div className="t-grid-5" style={{ marginBottom: 28 }}>
        <ColorSwatch name="Soleil" hex="#f5c948" role="Stickers, highlights" />
        <ColorSwatch name="Sauge" hex="#7a8a9c" role="Texte alt" />
        <ColorSwatch name="Success" hex="#4a8a6e" role="Dispo, réussite" />
        <ColorSwatch name="Warning" hex="#d4a73c" role="Réservé" />
        <ColorSwatch name="Danger" hex="#c47878" role="Erreur, suppr." />
      </div>

      <div className="label" style={{ marginBottom: 10 }}>Texte — échelle</div>
      <div className="t-grid-4" style={{ marginBottom: 28 }}>
        {[
          ['Encre', '#1a1f2e', 'Texte principal'],
          ['Encre 2', '#4a4f5e', 'Texte sec.'],
          ['Encre 3', '#7a7f8e', 'Texte tert.'],
          ['Encre 4', '#a8acb8', 'Placeholders'],
        ].map(([n, c, r]) => (
          <div key={n} style={{ background: 'var(--t-paper)', padding: 16, borderRadius: 14, border: '1px solid var(--t-line)' }}>
            <div style={{ color: c, fontSize: 18, fontWeight: 600, marginBottom: 4 }}>Toml</div>
            <div style={{ fontSize: 11, fontFamily: 'monospace', color: 'var(--t-ink-3)' }}>{c}</div>
            <div style={{ fontSize: 12, color: 'var(--t-ink-2)' }}>{r}</div>
          </div>
        ))}
      </div>

      <div className="label" style={{ marginBottom: 10 }}>Usages clés</div>
      <div className="t-grid-3">
        <div className="card-soft" style={{ padding: 16 }}>
          <div className="display-2" style={{ fontSize: 14, marginBottom: 6 }}>Encre = primary</div>
          <div style={{ fontSize: 12, color: 'var(--t-ink-2)', marginBottom: 12 }}>Tous les CTAs principaux sont en noir-encre. Le bouton « stamp » avec ombre tampon est notre signature.</div>
          <button className="btn btn-primary btn-stamp btn-sm">Créer ma wishlist</button>
        </div>
        <div className="card-soft" style={{ padding: 16 }}>
          <div className="display-2" style={{ fontSize: 14, marginBottom: 6 }}>Soleil = highlight</div>
          <div style={{ fontSize: 12, color: 'var(--t-ink-2)', marginBottom: 12 }}>Le jaune ne remplit jamais un fond entier. Il sert aux stickers, aux highlights de mots-clés, aux étoiles de priorité.</div>
          <span className="sticker">coup de cœur</span>
        </div>
        <div className="card-soft" style={{ padding: 16 }}>
          <div className="display-2" style={{ fontSize: 14, marginBottom: 6 }}>Rose = émotion</div>
          <div style={{ fontSize: 12, color: 'var(--t-ink-2)', marginBottom: 12 }}>Rose terre signale ce qui est personnel : notes en italique, réactions « j'adore », auteur d'un article.</div>
          <span className="hand" style={{ color: 'var(--t-rose)', fontSize: 20 }}>« coucou Léa »</span>
        </div>
      </div>
    </TSection>
  </TBoard>
);

// === TYPOGRAPHY ===
const STypo = () => (
  <TBoard>
    <TSection title="Typographie" eyebrow="Foundations 02">
      <p style={{ fontSize: 14, color: 'var(--t-ink-2)', maxWidth: 600, marginTop: 0, marginBottom: 28 }}>
        Deux familles seulement. <strong>Sora</strong> pour le display (géométrique, chaleureux). <strong>Inter</strong> pour l'UI (lisibilité). Pour les notes personnelles & stickers, on réutilise <strong>Sora italique</strong> colorée — pas de fausse écriture manuscrite.
      </p>

      <div className="t-grid-2" style={{ marginBottom: 28 }}>
        <div className="card-soft" style={{ padding: 24 }}>
          <div className="label" style={{ marginBottom: 10 }}>Sora · Display</div>
          <div className="display" style={{ fontSize: 64, marginBottom: 4 }}>Toml.</div>
          <div className="display" style={{ fontSize: 36, marginBottom: 4 }}>Noël 2026</div>
          <div className="display-2" style={{ fontSize: 22, marginBottom: 4 }}>Mes envies</div>
          <div className="display-2" style={{ fontSize: 17 }}>Vase céramique</div>
          <div className="divider" style={{ margin: '16px 0' }}></div>
          <div style={{ fontSize: 12, color: 'var(--t-ink-3)' }}>Poids 700 par défaut · letter-spacing -0.025em · line-height 1 pour le display, 1.05 pour display-2</div>
        </div>
        <div className="card-soft" style={{ padding: 24 }}>
          <div className="label" style={{ marginBottom: 10 }}>Inter · UI & corps</div>
          <div style={{ fontSize: 28, fontWeight: 700, marginBottom: 4, letterSpacing: '-0.02em' }}>Heading 3 — section</div>
          <div style={{ fontSize: 20, fontWeight: 600, marginBottom: 4 }}>Heading 4 — block</div>
          <div style={{ fontSize: 16, fontWeight: 500, marginBottom: 4 }}>Body large — sous-titres importants</div>
          <div style={{ fontSize: 14, marginBottom: 4, color: 'var(--t-ink-2)' }}>Body regular — texte courant, descriptions</div>
          <div style={{ fontSize: 12, color: 'var(--t-ink-3)' }}>Small — méta, prix, dates</div>
          <div className="divider" style={{ margin: '16px 0' }}></div>
          <div className="label">Label en uppercase 11px · letter-spacing .08em</div>
        </div>
      </div>

      <div className="card-soft" style={{ padding: 24, marginBottom: 28 }}>
        <div className="label" style={{ marginBottom: 10 }}>Sora italique · Note personnelle</div>
        <div style={{ display: 'flex', gap: 24, alignItems: 'baseline', flexWrap: 'wrap' }}>
          <span className="hand" style={{ fontSize: 26 }}>« mon coup de cœur »</span>
          <span className="hand" style={{ fontSize: 20, color: 'var(--t-denim)' }}>← regarde ça</span>
          <span className="sticker">Réservé !</span>
          <span className="sticker sticker-rose">surprise</span>
        </div>
        <div style={{ fontSize: 12, color: 'var(--t-ink-3)', marginTop: 16 }}>Sora italique 500, rose terre par défaut. La couleur porte le signal "personnel". Réservé aux notes courtes & stickers — jamais d'UI structurelle.</div>
      </div>

      <div className="label" style={{ marginBottom: 10 }}>Échelle complète</div>
      <div style={{ background: 'var(--t-paper)', borderRadius: 14, border: '1px solid var(--t-line)', overflow: 'hidden' }}>
        {[
          ['display-xl', 'Sora 700', '96 / -.04 / 1', 96, 'display'],
          ['display-lg', 'Sora 700', '64 / -.03 / 1', 64, 'display'],
          ['display-md', 'Sora 700', '40 / -.025 / 1.05', 40, 'display-2'],
          ['display-sm', 'Sora 700', '28 / -.02 / 1.1', 28, 'display-2'],
          ['heading', 'Inter 700', '22 / -.02 / 1.2', 22, ''],
          ['body-lg', 'Inter 500', '16 / 0 / 1.45', 16, ''],
          ['body', 'Inter 400', '14 / 0 / 1.5', 14, ''],
          ['small', 'Inter 400', '12 / 0 / 1.4', 12, ''],
          ['hand', 'Sora italic 500', '20 / -.005 / 1.3', 20, 'hand'],
        ].map((row, i) => (
          <div key={i} style={{
            display: 'grid', gridTemplateColumns: '120px 100px 160px 1fr',
            alignItems: 'baseline', padding: '12px 18px',
            borderBottom: i < 8 ? '1px solid var(--t-line)' : 'none',
          }}>
            <div style={{ fontSize: 12, fontFamily: 'monospace', color: 'var(--t-ink-3)' }}>{row[0]}</div>
            <div style={{ fontSize: 12, color: 'var(--t-ink-2)' }}>{row[1]}</div>
            <div style={{ fontSize: 11, fontFamily: 'monospace', color: 'var(--t-ink-3)' }}>{row[2]}</div>
            <div className={row[4]} style={{ fontSize: row[3], fontFamily: row[4] ? undefined : 'var(--t-font-ui)', fontWeight: row[4] ? undefined : (row[0].startsWith('heading') ? 700 : (row[0] === 'body-lg' ? 500 : 400)) }}>
              {row[0] === 'hand' ? '« mon coup de cœur »' : 'Aa Bb Cc — Mes envies'}
            </div>
          </div>
        ))}
      </div>
    </TSection>
  </TBoard>
);

Object.assign(window, { TBoard, TSection, SCover, SLogo, SColors, STypo, Logo1, Logo2, Logo3 });
