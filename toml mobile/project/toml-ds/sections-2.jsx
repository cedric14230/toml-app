// Toml DS — Sections 2 : Foundations (spacing/radii/shadows), Icons, Atoms

// === SPACING / RADII / SHADOWS ===
const SFoundations = () => (
  <TBoard>
    <TSection title="Espacements · Radii · Ombres" eyebrow="Foundations 03">
      <p style={{ fontSize: 14, color: 'var(--t-ink-2)', maxWidth: 600, marginTop: 0, marginBottom: 28 }}>
        Trois petites mécaniques qui assurent la cohérence de toutes les compositions.
      </p>

      <div className="label" style={{ marginBottom: 10 }}>Espacements · échelle base 4</div>
      <div style={{ background: 'var(--t-paper)', borderRadius: 14, border: '1px solid var(--t-line)', padding: 20, marginBottom: 28 }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 14 }}>
          {[
            ['s-1', 4], ['s-2', 8], ['s-3', 12], ['s-4', 16], ['s-5', 20],
            ['s-6', 24], ['s-8', 32], ['s-10', 40], ['s-12', 48], ['s-16', 64],
          ].map(([n, v]) => (
            <div key={n} style={{ textAlign: 'center' }}>
              <div style={{ background: 'var(--t-rose-soft)', border: '1px solid var(--t-rose)', width: v, height: v, marginBottom: 6 }}></div>
              <div style={{ fontSize: 11, fontFamily: 'monospace' }}>{n}</div>
              <div style={{ fontSize: 10, color: 'var(--t-ink-3)' }}>{v}px</div>
            </div>
          ))}
        </div>
      </div>

      <div className="t-grid-2" style={{ marginBottom: 28 }}>
        <div>
          <div className="label" style={{ marginBottom: 10 }}>Border radius</div>
          <div className="card-soft" style={{ padding: 20 }}>
            <div style={{ display: 'flex', gap: 14, alignItems: 'flex-end', flexWrap: 'wrap' }}>
              {[
                ['xs', 6], ['sm', 10], ['md', 14], ['lg', 18], ['xl', 24], ['pill', 999],
              ].map(([n, v]) => (
                <div key={n} style={{ textAlign: 'center' }}>
                  <div style={{ width: 56, height: 56, background: 'var(--t-denim-soft)', border: '1.5px solid var(--t-denim)', borderRadius: v, marginBottom: 6 }}></div>
                  <div style={{ fontSize: 11, fontFamily: 'monospace' }}>r-{n}</div>
                  <div style={{ fontSize: 10, color: 'var(--t-ink-3)' }}>{v === 999 ? '999px' : v + 'px'}</div>
                </div>
              ))}
            </div>
            <div style={{ fontSize: 12, color: 'var(--t-ink-3)', marginTop: 14 }}>
              <strong>md (14px)</strong> est notre radius par défaut. <strong>lg (18px)</strong> pour les cards principales. <strong>pill</strong> pour boutons & chips.
            </div>
          </div>
        </div>
        <div>
          <div className="label" style={{ marginBottom: 10 }}>Ombres</div>
          <div className="card-soft" style={{ padding: 20 }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, marginBottom: 14 }}>
              <div style={{ height: 64, background: 'var(--t-paper)', border: '1.5px solid var(--t-ink)', borderRadius: 14, boxShadow: '3px 3px 0 var(--t-ink)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 600 }}>stamp</div>
              <div style={{ height: 64, background: 'var(--t-paper)', border: '1.5px solid var(--t-ink)', borderRadius: 14, boxShadow: '5px 5px 0 var(--t-ink)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 600 }}>stamp-lg</div>
              <div style={{ height: 64, background: 'var(--t-paper)', borderRadius: 14, boxShadow: '0 1px 2px rgba(26,31,46,0.06), 0 1px 3px rgba(26,31,46,0.04)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 600 }}>sm (doux)</div>
            </div>
            <div style={{ fontSize: 12, color: 'var(--t-ink-3)' }}>
              <strong>Stamp</strong> est notre ombre signature (3px noir, plein, jamais soft) — pour CTAs et cards d'item.<br/>
              <strong>Sm</strong> doux pour les overlays/menus discrets.
            </div>
          </div>
        </div>
      </div>

      <div className="label" style={{ marginBottom: 10 }}>Bordures</div>
      <div className="t-grid-3">
        <div className="card-soft" style={{ padding: 16, textAlign: 'center' }}>
          <div style={{ height: 60, background: 'var(--t-bg)', border: '1.5px solid var(--t-ink)', borderRadius: 14, marginBottom: 8 }}></div>
          <div style={{ fontSize: 12, fontWeight: 600 }}>1.5px Encre</div>
          <div style={{ fontSize: 11, color: 'var(--t-ink-3)' }}>Cards principales, boutons stamp</div>
        </div>
        <div className="card-soft" style={{ padding: 16, textAlign: 'center' }}>
          <div style={{ height: 60, background: 'var(--t-bg)', border: '1px solid var(--t-line)', borderRadius: 14, marginBottom: 8 }}></div>
          <div style={{ fontSize: 12, fontWeight: 600 }}>1px Line</div>
          <div style={{ fontSize: 11, color: 'var(--t-ink-3)' }}>Cards douces, inputs secondaires</div>
        </div>
        <div className="card-soft" style={{ padding: 16, textAlign: 'center' }}>
          <div style={{ height: 60, background: 'var(--t-bg)', border: '1.5px dashed var(--t-ink-3)', borderRadius: 14, marginBottom: 8 }}></div>
          <div style={{ fontSize: 12, fontWeight: 600 }}>1.5px Dashed</div>
          <div style={{ fontSize: 11, color: 'var(--t-ink-3)' }}>Empty states, dropzones</div>
        </div>
      </div>
    </TSection>
  </TBoard>
);

// === ICONS ===
const Icon = ({ name, size = 22, stroke = 2 }) => {
  const props = { width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: stroke, strokeLinecap: 'round', strokeLinejoin: 'round' };
  const icons = {
    home: <svg {...props}><path d="M3 11 L12 3 L21 11 V20 a1 1 0 0 1 -1 1 H15 V14 H9 V21 H4 a1 1 0 0 1 -1 -1 Z"/></svg>,
    list: <svg {...props}><path d="M8 6 L21 6 M8 12 L21 12 M8 18 L21 18"/><circle cx="4" cy="6" r="1.5" fill="currentColor"/><circle cx="4" cy="12" r="1.5" fill="currentColor"/><circle cx="4" cy="18" r="1.5" fill="currentColor"/></svg>,
    friends: <svg {...props}><circle cx="9" cy="8" r="3.5"/><path d="M3 21 c0 -4 3 -6 6 -6 s6 2 6 6"/><circle cx="17" cy="6" r="2.5"/><path d="M14 14 c2 -1 4 -1 6 0 s2 3 2 5"/></svg>,
    search: <svg {...props}><circle cx="11" cy="11" r="7"/><path d="M21 21 L16.5 16.5"/></svg>,
    bell: <svg {...props}><path d="M6 16 V11 a6 6 0 1 1 12 0 V16 L20 18 H4 Z"/><path d="M10 21 a2 2 0 0 0 4 0"/></svg>,
    heart: <svg {...props}><path d="M12 21 s-7 -4.5 -9 -10 c-1 -3 1 -6 4 -6 c2 0 3.5 1 5 3 c1.5 -2 3 -3 5 -3 c3 0 5 3 4 6 c-2 5.5 -9 10 -9 10 z"/></svg>,
    star: <svg {...props}><path d="M12 2 L14.8 8.5 L22 9.3 L16.5 13.9 L18.2 21 L12 17.3 L5.8 21 L7.5 13.9 L2 9.3 L9.2 8.5 Z"/></svg>,
    plus: <svg {...props}><path d="M12 5 V19 M5 12 H19"/></svg>,
    check: <svg {...props}><path d="M4 12 L10 18 L20 6"/></svg>,
    x: <svg {...props}><path d="M6 6 L18 18 M6 18 L18 6"/></svg>,
    gift: <svg {...props}><path d="M3 11 H21 V21 H3 Z"/><path d="M12 11 V21 M4 7 H20 V11 H4 Z M8 7 c-1.5 0 -3 -1 -3 -2.5 S6.5 2 8 2 c2 0 4 5 4 5 s2 -5 4 -5 c1.5 0 3 1 3 2.5 S17.5 7 16 7"/></svg>,
    link: <svg {...props}><path d="M10 14 a4 4 0 0 0 5.7 0 L19 11 a4 4 0 0 0 -5.7 -5.7 L11.5 7"/><path d="M14 10 a4 4 0 0 0 -5.7 0 L5 13 a4 4 0 0 0 5.7 5.7 L12.5 17"/></svg>,
    share: <svg {...props}><path d="M4 12 V20 h16 V12 M16 6 L12 2 L8 6 M12 2 V15"/></svg>,
    bookmark: <svg {...props}><path d="M6 3 H18 V21 L12 17 L6 21 Z"/></svg>,
    sparkle: <svg {...props}><path d="M12 3 L14 10 L21 12 L14 14 L12 21 L10 14 L3 12 L10 10 Z"/></svg>,
    eye: <svg {...props}><path d="M2 12 s4 -7 10 -7 s10 7 10 7 s-4 7 -10 7 s-10 -7 -10 -7 Z"/><circle cx="12" cy="12" r="3"/></svg>,
    lock: <svg {...props}><rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11 V8 a4 4 0 0 1 8 0 V11"/></svg>,
    chat: <svg {...props}><path d="M4 12 c0 -4 4 -7 8 -7 s8 3 8 7 s-4 7 -8 7 c-1 0 -2 0 -3 -0.5 L4 20 V15 c0 -1 0 -2 0 -3 Z"/></svg>,
    edit: <svg {...props}><path d="M11 5 H6 a2 2 0 0 0 -2 2 V18 a2 2 0 0 0 2 2 H17 a2 2 0 0 0 2 -2 V13"/><path d="M18 3 L21 6 L11 16 L7 17 L8 13 Z"/></svg>,
    trash: <svg {...props}><path d="M4 7 H20 M9 7 V4 H15 V7 M6 7 L7 21 H17 L18 7 M10 11 V17 M14 11 V17"/></svg>,
    arrow: <svg {...props}><path d="M5 12 H19 M13 6 L19 12 L13 18"/></svg>,
    menu: <svg {...props}><path d="M4 7 H20 M4 12 H20 M4 17 H20"/></svg>,
    settings: <svg {...props}><circle cx="12" cy="12" r="3"/><path d="M12 1 V4 M12 20 V23 M4.2 4.2 L6.3 6.3 M17.7 17.7 L19.8 19.8 M1 12 H4 M20 12 H23 M4.2 19.8 L6.3 17.7 M17.7 6.3 L19.8 4.2"/></svg>,
    user: <svg {...props}><circle cx="12" cy="8" r="4"/><path d="M4 21 c0 -4 4 -7 8 -7 s8 3 8 7"/></svg>,
    filter: <svg {...props}><path d="M4 5 H20 L14 12 V20 L10 18 V12 Z"/></svg>,
    grid: <svg {...props}><rect x="4" y="4" width="7" height="7"/><rect x="13" y="4" width="7" height="7"/><rect x="4" y="13" width="7" height="7"/><rect x="13" y="13" width="7" height="7"/></svg>,
    rows: <svg {...props}><rect x="3" y="4" width="18" height="5" rx="1"/><rect x="3" y="11" width="18" height="5" rx="1"/><rect x="3" y="18" width="18" height="3" rx="1"/></svg>,
  };
  return icons[name] || <svg {...props}><circle cx="12" cy="12" r="9"/></svg>;
};

const SIcons = () => {
  const list = ['home', 'list', 'friends', 'search', 'bell', 'heart', 'star', 'plus', 'check', 'x', 'gift', 'link', 'share', 'bookmark', 'sparkle', 'eye', 'lock', 'chat', 'edit', 'trash', 'arrow', 'menu', 'settings', 'user', 'filter', 'grid', 'rows'];
  const emojiSet = ['🎁', '🎄', '🎂', '✨', '🏠', '📚', '👕', '💄', '🧸', '🍷', '💌', '☕', '🌿', '📷'];
  return (
    <TBoard>
      <TSection title="Iconographie" eyebrow="Foundations 04">
        <p style={{ fontSize: 14, color: 'var(--t-ink-2)', maxWidth: 600, marginTop: 0, marginBottom: 24 }}>
          Mix : ic&#xf4;nes line maison (2px) pour les actions UI structurelles, &#xe9;moticons pour les cat&#xe9;gories de wishlists et la chaleur familiale.
        </p>

        <div className="label" style={{ marginBottom: 12 }}>Icônes line — 24×24, stroke 2</div>
        <div className="card-soft" style={{ padding: 24, marginBottom: 28 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(9, 1fr)', gap: 14 }}>
            {list.map(name => (
              <div key={name} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                <div style={{ width: 44, height: 44, background: 'var(--t-bg)', border: '1px solid var(--t-line)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--t-ink)' }}>
                  <Icon name={name} size={22} />
                </div>
                <div style={{ fontSize: 10, color: 'var(--t-ink-3)', fontFamily: 'monospace' }}>{name}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="label" style={{ marginBottom: 12 }}>Émoticons — catégories & humanité</div>
        <div className="card-soft" style={{ padding: 24, marginBottom: 28 }}>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 16 }}>
            {emojiSet.map(e => (
              <div key={e} style={{ width: 48, height: 48, background: 'var(--t-bg)', border: '1px solid var(--t-line)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>{e}</div>
            ))}
          </div>
          <div style={{ fontSize: 12, color: 'var(--t-ink-3)' }}>
            Pour <strong>nommer une wishlist</strong> (Noël 🎄, Anniv 🎂), <strong>illustrer un état</strong> (réservé 🤫, surprise ✨), ou <strong>donner du ton</strong> à un message. Jamais en remplacement d'une action UI.
          </div>
        </div>

        <div className="label" style={{ marginBottom: 12 }}>Sizing & tailles</div>
        <div className="card-soft" style={{ padding: 24, display: 'flex', gap: 28, alignItems: 'center' }}>
          {[16, 20, 22, 28, 36].map(s => (
            <div key={s} style={{ textAlign: 'center' }}>
              <div style={{ width: s + 16, height: s + 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon name="heart" size={s} />
              </div>
              <div style={{ fontSize: 11, color: 'var(--t-ink-3)', marginTop: 4 }}>{s}px</div>
            </div>
          ))}
          <div style={{ fontSize: 12, color: 'var(--t-ink-2)', marginLeft: 24, maxWidth: 280 }}>
            <strong>20–22px</strong> par défaut dans les barres de nav. <strong>16px</strong> inline avec texte. <strong>28+px</strong> pour states décoratifs.
          </div>
        </div>
      </TSection>
    </TBoard>
  );
};

// === ATOMS — Buttons, inputs, chips, badges, stickers ===
const SAtoms = () => (
  <TBoard>
    <TSection title="Atoms — Boutons & Champs" eyebrow="Composants 01">
      <p style={{ fontSize: 14, color: 'var(--t-ink-2)', maxWidth: 600, marginTop: 0, marginBottom: 24 }}>
        Les briques de base. Tout part d'un bouton clair, d'un champ qui invite à écrire, et d'un chip qui sait dire « actif ».
      </p>

      <div className="label" style={{ marginBottom: 12 }}>Boutons · variants</div>
      <div className="card-soft" style={{ padding: 24, marginBottom: 24 }}>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 18 }}>
          <button className="btn btn-primary btn-stamp">Créer ma wishlist</button>
          <button className="btn btn-accent btn-stamp">Réserver 🎁</button>
          <button className="btn btn-rose">Suivre Léa</button>
          <button className="btn btn-outline">Découvrir</button>
          <button className="btn btn-ghost">Plus tard</button>
        </div>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 18, alignItems: 'center' }}>
          <button className="btn btn-primary btn-stamp btn-sm">Petit</button>
          <button className="btn btn-primary btn-stamp">Moyen</button>
          <button className="btn btn-primary btn-stamp btn-lg">Grand</button>
        </div>
        <div style={{ fontSize: 12, color: 'var(--t-ink-3)' }}>
          <strong>Primary stamp</strong> : action principale (CTA hero, formulaires). <strong>Accent stamp</strong> : action engageante & joyeuse (réservation). <strong>Rose</strong> : action sociale. <strong>Outline / Ghost</strong> : actions secondaires.
        </div>
      </div>

      <div className="label" style={{ marginBottom: 12 }}>Boutons icon-only</div>
      <div className="card-soft" style={{ padding: 24, marginBottom: 24, display: 'flex', gap: 14, alignItems: 'center' }}>
        {[
          { c: 'btn-primary btn-stamp', i: 'plus' },
          { c: 'btn-outline', i: 'heart' },
          { c: 'btn-ghost', i: 'share' },
          { c: 'btn-rose', i: 'gift' },
        ].map((b, i) => (
          <button key={i} className={`btn ${b.c}`} style={{ width: 42, height: 42, padding: 0, borderRadius: 999 }}>
            <Icon name={b.i} size={18} />
          </button>
        ))}
        <button className="btn btn-outline btn-sm">
          <Icon name="link" size={14} /> Copier le lien
        </button>
        <button className="btn btn-primary btn-stamp btn-sm">
          <Icon name="plus" size={14} /> Ajouter
        </button>
      </div>

      <div className="label" style={{ marginBottom: 12 }}>Champs · variants</div>
      <div className="card-soft" style={{ padding: 24, marginBottom: 24, display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 480 }}>
        <input className="input" placeholder="Email" defaultValue="sophie@famille.fr" />
        <input className="input" placeholder="Mot de passe" type="password" defaultValue="••••••••" />
        <div style={{ position: 'relative' }}>
          <Icon name="search" size={16} stroke={2} />
          <input className="input" placeholder="Rechercher un ami…" style={{ paddingLeft: 38 }} />
          <span style={{ position: 'absolute', left: 14, top: 13, color: 'var(--t-ink-3)' }}><Icon name="search" size={16} /></span>
        </div>
        <textarea className="input" rows={3} placeholder="Note personnelle (en taille S s'il te plaît 🙏)" style={{ resize: 'none', fontFamily: 'var(--t-font-ui)' }}></textarea>
      </div>

      <div className="label" style={{ marginBottom: 12 }}>Chips & badges</div>
      <div className="card-soft" style={{ padding: 24, marginBottom: 24 }}>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 14 }}>
          <span className="chip chip-active">Tout (12)</span>
          <span className="chip">Mode</span>
          <span className="chip">Déco</span>
          <span className="chip chip-mustard">★ Priorité</span>
          <span className="chip chip-rose">♥ Coup de cœur</span>
          <span className="chip chip-denim">Réservé</span>
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 14 }}>
          <span className="badge">3</span>
          <span className="badge" style={{ background: 'var(--t-denim)' }}>12</span>
          <span className="badge" style={{ background: 'var(--t-success)' }}>nouveau</span>
          <span className="badge badge-dot" style={{ background: 'var(--t-rose)' }}></span>
          <span style={{ fontSize: 12, color: 'var(--t-ink-3)' }}>Badges pour compteurs et notifs</span>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <span className="dot dot-available"></span><span style={{ fontSize: 12 }}>Disponible</span>
          <span className="dot dot-reserved" style={{ marginLeft: 14 }}></span><span style={{ fontSize: 12 }}>Réservé</span>
          <span className="dot dot-gifted" style={{ marginLeft: 14 }}></span><span style={{ fontSize: 12 }}>Offert</span>
        </div>
      </div>

      <div className="label" style={{ marginBottom: 12 }}>Stickers — signature manuscrite</div>
      <div className="card-soft" style={{ padding: 24, display: 'flex', gap: 14, alignItems: 'center', flexWrap: 'wrap' }}>
        <span className="sticker">Réservé !</span>
        <span className="sticker sticker-rose">surprise</span>
        <span className="sticker sticker-denim">coup de cœur</span>
        <span className="sticker sticker-soft">déjà offert</span>
        <span className="hand" style={{ fontSize: 22 }}>« en taille S ! »</span>
        <div style={{ fontSize: 12, color: 'var(--t-ink-3)', flex: 1, minWidth: 200 }}>
          Sticker en Sora italique 700 sur fond soleil, rotation -2°. La note en italique rose porte l'intention humaine. Pas de fausse écriture manuscrite.
        </div>
      </div>

      <div className="label" style={{ marginBottom: 12, marginTop: 24 }}>Étoiles · priorité</div>
      <div className="card-soft" style={{ padding: 24, display: 'flex', gap: 28, alignItems: 'center' }}>
        {[[1, 'C\'est une idée…'], [2, 'J\'aimerais bien'], [3, 'J\'en rêve']].map(([n, l]) => (
          <div key={n} style={{ textAlign: 'center' }}>
            <div style={{ display: 'flex', gap: 3, justifyContent: 'center', marginBottom: 6 }}>
              {[1, 2, 3].map(i => (
                <span key={i} className={`star ${i > n ? 'star-dim' : ''}`} style={{ width: 18, height: 18 }}></span>
              ))}
            </div>
            <div style={{ fontSize: 12, color: 'var(--t-ink-2)', fontWeight: 600 }}>{l}</div>
          </div>
        ))}
      </div>
    </TSection>
  </TBoard>
);

Object.assign(window, { SFoundations, SIcons, SAtoms, Icon });
