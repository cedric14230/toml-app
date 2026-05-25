// Toml DS — Sections 3 : Molecules + Patterns + Microcopy

// === MOLECULES — Avatars, Dropdowns, Toasts ===
const SMolecules = () => (
  <TBoard>
    <TSection title="Molecules — Avatars & Surfaces" eyebrow="Composants 02">
      <p style={{ fontSize: 14, color: 'var(--t-ink-2)', maxWidth: 600, marginTop: 0, marginBottom: 24 }}>
        Les petits assemblages : avatars (5 variations colorées), cards (3 niveaux d'emphase), surfaces flottantes.
      </p>

      <div className="label" style={{ marginBottom: 12 }}>Avatars · échelle</div>
      <div className="card-soft" style={{ padding: 24, marginBottom: 24, display: 'flex', gap: 18, alignItems: 'center' }}>
        {[['xs', 'C'], ['sm', 'C'], ['md', 'L'], ['lg', 'A'], ['xl', 'S']].map(([s, l], i) => (
          <div key={i} style={{ textAlign: 'center' }}>
            <div className={`avatar avatar-${s} avatar-${i + 1}`} style={{ margin: '0 auto 8px' }}>{l}</div>
            <div style={{ fontSize: 11, fontFamily: 'monospace', color: 'var(--t-ink-3)' }}>{s}</div>
          </div>
        ))}
        <div style={{ flex: 1, paddingLeft: 24, fontSize: 12, color: 'var(--t-ink-2)' }}>
          5 gradients pré-définis (avatar-1 à 5) attribués selon l'initiale, pour éviter qu'on tombe sur des avatars tous identiques.
        </div>
      </div>

      <div className="label" style={{ marginBottom: 12 }}>Avatars groupés</div>
      <div className="card-soft" style={{ padding: 24, marginBottom: 24, display: 'flex', gap: 24, alignItems: 'center' }}>
        <div style={{ display: 'flex' }}>
          {['L', 'M', 'A', 'J'].map((c, i) => (
            <div key={c} className={`avatar avatar-sm avatar-${i + 1}`} style={{ marginLeft: i ? -10 : 0, border: '2px solid var(--t-bg)' }}>{c}</div>
          ))}
        </div>
        <div style={{ display: 'flex' }}>
          {['L', 'M', 'A'].map((c, i) => (
            <div key={c} className={`avatar avatar-sm avatar-${i + 1}`} style={{ marginLeft: i ? -10 : 0, border: '2px solid var(--t-bg)' }}>{c}</div>
          ))}
          <div className="avatar avatar-sm" style={{ marginLeft: -10, border: '2px solid var(--t-bg)', background: 'var(--t-bg-2)', color: 'var(--t-ink-2)', fontSize: 12 }}>+5</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div className="avatar avatar-sm avatar-2">L</div>
          <span className="dot dot-available" style={{ width: 10, height: 10, border: '2px solid var(--t-bg)', marginLeft: -16, marginTop: 18, position: 'relative', zIndex: 2 }}></span>
          <span style={{ fontSize: 12, color: 'var(--t-ink-2)', marginLeft: 4 }}>Léa · en ligne</span>
        </div>
      </div>

      <div className="label" style={{ marginBottom: 12 }}>Cards · niveaux d'emphase</div>
      <div className="t-grid-3" style={{ marginBottom: 24 }}>
        <div>
          <div className="card" style={{ padding: 20 }}>
            <div className="display-2" style={{ fontSize: 16, marginBottom: 4 }}>Card principale</div>
            <div style={{ fontSize: 12, color: 'var(--t-ink-2)' }}>Border 1.5px + ombre stamp · pour items et CTAs forts</div>
          </div>
          <div style={{ fontSize: 11, color: 'var(--t-ink-3)', marginTop: 6, fontFamily: 'monospace' }}>.card</div>
        </div>
        <div>
          <div className="card-soft" style={{ padding: 20 }}>
            <div className="display-2" style={{ fontSize: 16, marginBottom: 4 }}>Card douce</div>
            <div style={{ fontSize: 12, color: 'var(--t-ink-2)' }}>Border 1px + ombre légère · pour blocs informatifs et listes</div>
          </div>
          <div style={{ fontSize: 11, color: 'var(--t-ink-3)', marginTop: 6, fontFamily: 'monospace' }}>.card-soft</div>
        </div>
        <div>
          <div className="card-flat" style={{ padding: 20 }}>
            <div className="display-2" style={{ fontSize: 16, marginBottom: 4 }}>Card plate</div>
            <div style={{ fontSize: 12, color: 'var(--t-ink-2)' }}>Border 1px sans ombre · pour grilles denses</div>
          </div>
          <div style={{ fontSize: 11, color: 'var(--t-ink-3)', marginTop: 6, fontFamily: 'monospace' }}>.card-flat</div>
        </div>
      </div>

      <div className="label" style={{ marginBottom: 12 }}>Surfaces flottantes</div>
      <div className="t-grid-2">
        <div className="card-soft" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--t-line)', display: 'flex', alignItems: 'center', gap: 10 }}>
            <div className="avatar avatar-sm avatar-2">L</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, fontSize: 13 }}>Léa a réservé un cadeau pour toi</div>
              <div style={{ fontSize: 11, color: 'var(--t-ink-3)' }}>il y a 2 min</div>
            </div>
            <span className="badge badge-dot" style={{ background: 'var(--t-rose)' }}></span>
          </div>
          <div style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 10 }}>
            <div className="avatar avatar-sm avatar-3">M</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 500, fontSize: 13, color: 'var(--t-ink-2)' }}>Marc a réagi à ton article</div>
              <div style={{ fontSize: 11, color: 'var(--t-ink-3)' }}>il y a 1 h</div>
            </div>
          </div>
          <div style={{ fontSize: 11, color: 'var(--t-ink-3)', padding: '6px 16px 12px', fontFamily: 'monospace' }}>Dropdown notifs</div>
        </div>
        <div>
          <div className="card" style={{ padding: '14px 18px', display: 'flex', gap: 12, alignItems: 'center' }}>
            <span style={{ width: 36, height: 36, borderRadius: 999, background: 'var(--t-success)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Icon name="check" size={20} />
            </span>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, fontSize: 14 }}>Article ajouté à Noël 2026 ✨</div>
              <div style={{ fontSize: 12, color: 'var(--t-ink-2)' }}>Tu peux modifier la note ou la priorité.</div>
            </div>
          </div>
          <div style={{ fontSize: 11, color: 'var(--t-ink-3)', padding: '6px 0', fontFamily: 'monospace' }}>Toast de succès</div>
        </div>
      </div>
    </TSection>
  </TBoard>
);

// === PATTERNS — Item card, Wishlist card ===
const SPatternsItems = () => (
  <TBoard>
    <TSection title="Patterns — Cartes produit & liste" eyebrow="Composants 03">
      <p style={{ fontSize: 14, color: 'var(--t-ink-2)', maxWidth: 600, marginTop: 0, marginBottom: 24 }}>
        Les deux objets centraux de l'app : l'<strong>article</strong> (une envie) et la <strong>wishlist</strong> (un regroupement d'envies).
      </p>

      <div className="label" style={{ marginBottom: 12 }}>Item card · états</div>
      <div className="t-grid-3" style={{ marginBottom: 28 }}>
        {[
          { state: 'Disponible (vue propriétaire)', sticker: null, reserved: false, hand: 'En taille S 🙏' },
          { state: 'Réservé (vue gift-giver)', sticker: 'Réservé', reserved: true, hand: null },
          { state: 'Réservé par moi (gift-giver)', sticker: 'Par moi ♥', reserved: 'me', hand: null },
        ].map((it, k) => (
          <div key={k}>
            <div className="card" style={{ position: 'relative' }}>
              <div className={`img img-${[1, 2, 3][k]}`} style={{ height: 180, position: 'relative' }}>
                {it.sticker && <span className={`sticker ${it.reserved === 'me' ? 'sticker-rose' : ''}`} style={{ position: 'absolute', top: 12, left: 12 }}>{it.sticker}</span>}
                <button className="btn btn-ghost" style={{ position: 'absolute', top: 12, right: 12, width: 32, height: 32, padding: 0, borderRadius: 999, background: 'rgba(255,255,255,.9)' }}>
                  <Icon name={it.reserved === 'me' ? 'heart' : 'plus'} size={16} stroke={2.2} />
                </button>
              </div>
              <div style={{ padding: 14 }}>
                <div className="label" style={{ color: 'var(--t-rose)', marginBottom: 4 }}>Sézane</div>
                <div className="display-2" style={{ fontSize: 17, marginBottom: 4 }}>Robe Liliana</div>
                {it.hand && <div className="hand" style={{ fontSize: 17, color: 'var(--t-rose)', marginBottom: 6 }}>« {it.hand} »</div>}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 6 }}>
                  <span style={{ fontSize: 15, fontWeight: 700 }}>89 €</span>
                  <span style={{ display: 'flex', gap: 2 }}>
                    {[1, 2, 3].map(i => <span key={i} className={`star ${i > 3 ? 'star-dim' : ''}`}></span>)}
                  </span>
                </div>
              </div>
            </div>
            <div style={{ fontSize: 11, color: 'var(--t-ink-3)', marginTop: 6 }}>{it.state}</div>
          </div>
        ))}
      </div>

      <div className="label" style={{ marginBottom: 12 }}>Item card · vue compacte (liste)</div>
      <div style={{ marginBottom: 28 }}>
        {[
          { t: 'Vase céramique beige', b: 'Maison Dada', p: 45, stars: 2, status: 'available', note: null },
          { t: 'Trench long cercle', b: 'Sézane', p: 189, stars: 3, status: 'reserved', note: 'Mon gros coup de cœur' },
          { t: 'Bougie Diptyque', b: 'Diptyque', p: 85, stars: 2, status: 'available', note: null },
        ].map((it, k) => (
          <div key={k} className="card-soft" style={{ padding: 12, display: 'flex', gap: 14, alignItems: 'center', marginBottom: 8, opacity: it.status === 'reserved' ? 0.65 : 1 }}>
            <div className={`img img-${k + 1}`} style={{ width: 60, height: 60, borderRadius: 12, flexShrink: 0 }}></div>
            <div style={{ flex: 1 }}>
              <div className="label" style={{ color: 'var(--t-rose)', marginBottom: 2 }}>{it.b}</div>
              <div style={{ fontWeight: 600, fontSize: 14 }}>{it.t}</div>
              {it.note && <div className="hand" style={{ fontSize: 15, color: 'var(--t-rose)' }}>« {it.note} »</div>}
            </div>
            <div style={{ display: 'flex', gap: 2 }}>
              {[1, 2, 3].map(i => <span key={i} className={`star ${i > it.stars ? 'star-dim' : ''}`}></span>)}
            </div>
            <div style={{ fontWeight: 700, fontSize: 14, minWidth: 60, textAlign: 'right' }}>{it.p} €</div>
            {it.status === 'reserved' ? (
              <span className="chip chip-mustard" style={{ minWidth: 80, justifyContent: 'center' }}>
                <span className="dot dot-reserved"></span>Réservé
              </span>
            ) : (
              <button className="btn btn-primary btn-stamp btn-sm">
                <Icon name="gift" size={14} /> Je l'offre
              </button>
            )}
          </div>
        ))}
      </div>

      <div className="label" style={{ marginBottom: 12 }}>Wishlist card · variantes</div>
      <div className="t-grid-3">
        {[
          { t: 'Noël 2026', n: 12, vis: 'Amis', cover: 1, latest: '5 articles cette semaine' },
          { t: 'Ma chambre idéale', n: 7, vis: 'Publique', cover: 2, latest: 'Léa a réagi à 2 articles' },
          { t: 'Anniversaire', n: 4, vis: 'Privée', cover: 4, latest: '14 juin — perso' },
        ].map((w, i) => (
          <div key={i} className="card">
            <div className={`img img-${w.cover}`} style={{ height: 110, position: 'relative' }}>
              <span className="chip" style={{ position: 'absolute', top: 12, right: 12, background: 'rgba(255,255,255,.9)' }}>
                <Icon name={w.vis === 'Privée' ? 'lock' : w.vis === 'Amis' ? 'friends' : 'eye'} size={12} />
                {w.vis}
              </span>
            </div>
            <div style={{ padding: 16 }}>
              <div className="display-2" style={{ fontSize: 19, marginBottom: 4 }}>{w.t}</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 12, color: 'var(--t-ink-2)', fontWeight: 600 }}>{w.n} articles</span>
                <span style={{ fontSize: 11, color: 'var(--t-rose)', fontWeight: 600 }}>{w.latest}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </TSection>
  </TBoard>
);

// === PATTERNS — Feed, comments, gift-giver, bookmarklet, empty ===
const SPatternsSocial = () => (
  <TBoard>
    <TSection title="Patterns — Social & moments clés" eyebrow="Composants 04">

      <div className="t-grid-2" style={{ marginBottom: 28 }}>
        <div>
          <div className="label" style={{ marginBottom: 10 }}>Feed post — style insta</div>
          <div className="card" style={{ maxWidth: 380 }}>
            <div style={{ padding: 12, display: 'flex', alignItems: 'center', gap: 10, borderBottom: '1px solid var(--t-line)' }}>
              <div className="avatar avatar-sm avatar-2">L</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: 13 }}>Léa Martin</div>
                <div style={{ fontSize: 11, color: 'var(--t-ink-3)' }}>ajouté à · Ma chambre idéale · il y a 2 h</div>
              </div>
              <button className="btn btn-ghost" style={{ width: 30, height: 30, padding: 0, borderRadius: 999 }}>
                <Icon name="menu" size={14} />
              </button>
            </div>
            <div className="img img-1" style={{ height: 240, position: 'relative' }}>
              <span className="sticker" style={{ position: 'absolute', bottom: 12, left: 12 }}>nouveau !</span>
            </div>
            <div style={{ padding: 14 }}>
              <div style={{ display: 'flex', gap: 12, marginBottom: 10 }}>
                <button className="btn btn-ghost" style={{ width: 36, height: 36, padding: 0, borderRadius: 999 }}>
                  <Icon name="heart" size={18} />
                </button>
                <button className="btn btn-ghost" style={{ width: 36, height: 36, padding: 0, borderRadius: 999 }}>
                  <Icon name="chat" size={18} />
                </button>
                <button className="btn btn-ghost" style={{ width: 36, height: 36, padding: 0, borderRadius: 999 }}>
                  <Icon name="share" size={18} />
                </button>
                <div style={{ flex: 1 }}></div>
                <button className="btn btn-primary btn-stamp btn-sm">
                  <Icon name="gift" size={14} /> Je l'offre
                </button>
              </div>
              <div style={{ fontSize: 12, color: 'var(--t-ink-2)', marginBottom: 6 }}><strong>3 j'adore</strong> · 2 commentaires</div>
              <div style={{ fontSize: 14, marginBottom: 4 }}>
                <strong>Vase céramique beige</strong> · <span style={{ color: 'var(--t-rose)' }}>45 €</span>
              </div>
              <div className="hand" style={{ fontSize: 17, color: 'var(--t-rose)' }}>« Pour mon salon, gros coup de cœur 🤍 »</div>
            </div>
          </div>
        </div>

        <div>
          <div className="label" style={{ marginBottom: 10 }}>Comments</div>
          <div className="card-soft" style={{ padding: 16 }}>
            {[
              { u: 'Marc', c: 'Trop joli ! T\'as un lien ?', t: '1 h' },
              { u: 'Amandine', c: 'On a le même goût ✨ je note', t: '32 min' },
              { u: 'Sophie', c: 'Coucou ! C\'est de chez qui ?', t: '5 min' },
            ].map((cm, i) => (
              <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 14 }}>
                <div className={`avatar avatar-sm avatar-${i + 2}`}>{cm.u[0]}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ background: 'var(--t-bg-2)', borderRadius: 14, padding: '8px 12px' }}>
                    <div style={{ fontWeight: 700, fontSize: 12 }}>{cm.u}</div>
                    <div style={{ fontSize: 13, color: 'var(--t-ink)' }}>{cm.c}</div>
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--t-ink-3)', marginTop: 4, paddingLeft: 4 }}>
                    {cm.t} · <span style={{ fontWeight: 600 }}>J'adore</span> · <span style={{ fontWeight: 600 }}>Répondre</span>
                  </div>
                </div>
              </div>
            ))}
            <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginTop: 8 }}>
              <div className="avatar avatar-sm avatar-1">C</div>
              <input className="input input-soft" placeholder="Écris un commentaire chaleureux…" />
              <button className="btn btn-primary btn-stamp btn-sm" style={{ flexShrink: 0 }}>Envoyer</button>
            </div>
          </div>
        </div>
      </div>

      <div className="t-grid-2" style={{ marginBottom: 28 }}>
        <div>
          <div className="label" style={{ marginBottom: 10 }}>Gift-giver banner</div>
          <div className="giver-banner">
            <span style={{ fontSize: 26 }}>🤫</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: 14 }}>Tu consultes la wishlist de Sophie.</div>
              <div style={{ fontSize: 12, color: 'var(--t-ink-2)' }}>Tes réservations sont invisibles pour elle. Promis 🤐</div>
            </div>
            <span className="chip" style={{ background: 'var(--t-paper)' }}>Mode invité</span>
          </div>
          <div style={{ fontSize: 11, color: 'var(--t-ink-3)', marginTop: 8 }}>S'affiche en haut de toute wishlist consultée depuis un lien partagé.</div>
        </div>
        <div>
          <div className="label" style={{ marginBottom: 10 }}>Bookmarklet CTA</div>
          <div className="card" style={{ padding: 18, display: 'flex', gap: 14, alignItems: 'center' }}>
            <span style={{ width: 44, height: 44, background: '#f5c948', border: '1.5px solid var(--t-ink)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>✨</span>
            <div style={{ flex: 1 }}>
              <div className="display-2" style={{ fontSize: 15, marginBottom: 2 }}>Le bouton magique</div>
              <div style={{ fontSize: 12, color: 'var(--t-ink-2)' }}>1 clic depuis n'importe quel site = 1 article ajouté.</div>
            </div>
            <span className="bookmarklet">+ Ajouter à Toml</span>
          </div>
          <div style={{ fontSize: 11, color: 'var(--t-ink-3)', marginTop: 8 }}>Le bouton est draggable vers la barre de favoris.</div>
        </div>
      </div>

      <div className="label" style={{ marginBottom: 12 }}>Empty states</div>
      <div className="t-grid-3">
        {[
          { e: '🎁', t: 'Pas encore d\'envie', s: 'Ajoute ta première idée, depuis un lien ou en saisie libre.', cta: '+ Ajouter mon 1er article' },
          { e: '👋', t: 'Personne pour le moment', s: 'Invite tes proches pour voir leurs wishlists et qu\'ils voient les tiennes.', cta: 'Inviter un proche' },
          { e: '🤫', t: 'Aucune réservation', s: 'Tes proches n\'ont rien réservé… pour l\'instant.', cta: 'Voir les wishlists' },
        ].map((es, i) => (
          <div key={i} className="card-soft" style={{ padding: 28, textAlign: 'center' }}>
            <div style={{ fontSize: 42, marginBottom: 10 }}>{es.e}</div>
            <div className="display-2" style={{ fontSize: 16, marginBottom: 6 }}>{es.t}</div>
            <div style={{ fontSize: 13, color: 'var(--t-ink-2)', marginBottom: 14, lineHeight: 1.4 }}>{es.s}</div>
            <button className="btn btn-primary btn-stamp btn-sm">{es.cta}</button>
          </div>
        ))}
      </div>
    </TSection>
  </TBoard>
);

// === MICROCOPY ===
const SMicrocopy = () => (
  <TBoard>
    <TSection title="Microcopy & ton" eyebrow="Identité 02">
      <p style={{ fontSize: 14, color: 'var(--t-ink-2)', maxWidth: 600, marginTop: 0, marginBottom: 24 }}>
        On parle comme à un proche : tutoiement, simplicité, chaleur, sans tomber dans l'infantilisant.
      </p>

      <div className="label" style={{ marginBottom: 12 }}>Principes</div>
      <div className="t-grid-3" style={{ marginBottom: 28 }}>
        {[
          { t: 'Tu, jamais vous', s: 'On vouvoie une banque, pas une famille. Le tutoiement crée la complicité.' },
          { t: 'Court & concret', s: 'Une phrase = une idée. On dit "Crée ta liste" pas "Initiez votre procédure".' },
          { t: 'Chaleureux, pas niais', s: 'Un peu d\'humour, des emojis ponctuels, jamais de "trop mignon" ou "magique".' },
        ].map((p, i) => (
          <div key={i} className="card-soft" style={{ padding: 18 }}>
            <div className="display-2" style={{ fontSize: 17, marginBottom: 6 }}>{p.t}</div>
            <div style={{ fontSize: 13, color: 'var(--t-ink-2)' }}>{p.s}</div>
          </div>
        ))}
      </div>

      <div className="label" style={{ marginBottom: 12 }}>Avant / après</div>
      <div className="card-soft" style={{ padding: 0, overflow: 'hidden', marginBottom: 28 }}>
        {[
          ['Contexte', '✗ À éviter', '✓ Préférer'],
          ['CTA principal', 'Soumettre le formulaire d\'inscription', 'Créer ma wishlist'],
          ['Bouton réserver', 'Confirmer la réservation de l\'article', 'Je l\'offre 🎁'],
          ['Empty state', 'Aucun élément trouvé.', 'Pas encore d\'envie… ajoute la première !'],
          ['Onboarding', 'Veuillez procéder à l\'identification de votre compte', 'Allez, on crée ta première liste'],
          ['Erreur', 'Une erreur est survenue. Réessayez.', 'Oups, on retente ?'],
          ['Confirmation', 'L\'élément a été ajouté avec succès', 'Hop, c\'est ajouté ✨'],
          ['Gift-giver hint', 'L\'utilisateur ne verra pas cette information', 'Promis, c\'est invisible pour Sophie 🤫'],
        ].map((row, i) => (
          <div key={i} style={{
            display: 'grid', gridTemplateColumns: '180px 1fr 1fr',
            padding: '12px 18px',
            background: i === 0 ? 'var(--t-bg-2)' : 'var(--t-paper)',
            borderBottom: i < 7 ? '1px solid var(--t-line)' : 'none',
            fontWeight: i === 0 ? 700 : 500,
            fontSize: i === 0 ? 12 : 13,
            color: i === 0 ? 'var(--t-ink-3)' : 'var(--t-ink)',
            textTransform: i === 0 ? 'uppercase' : 'none',
            letterSpacing: i === 0 ? '0.08em' : '0',
          }}>
            <div>{row[0]}</div>
            <div style={{ color: i === 0 ? 'inherit' : 'var(--t-ink-3)', fontStyle: i === 0 ? 'normal' : 'italic' }}>{row[1]}</div>
            <div style={{ color: i === 0 ? 'inherit' : 'var(--t-ink)' }}>{row[2]}</div>
          </div>
        ))}
      </div>

      <div className="label" style={{ marginBottom: 12 }}>Emojis · usage</div>
      <div className="card-soft" style={{ padding: 20 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
          <div>
            <div style={{ fontWeight: 700, fontSize: 13, color: 'var(--t-success)', marginBottom: 6 }}>✓ Oui</div>
            <ul style={{ fontSize: 13, color: 'var(--t-ink-2)', margin: 0, paddingLeft: 18, lineHeight: 1.6 }}>
              <li>1 emoji par message pour ponctuer (🎁 ✨ 🤫 🤍)</li>
              <li>Comme accent émotionnel : "Promis 🤐", "Hop, c'est ajouté ✨"</li>
              <li>Pour nommer les listes : "Noël 🎄"</li>
              <li>Dans les empty states pour adoucir</li>
            </ul>
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 13, color: 'var(--t-danger)', marginBottom: 6 }}>✗ Non</div>
            <ul style={{ fontSize: 13, color: 'var(--t-ink-2)', margin: 0, paddingLeft: 18, lineHeight: 1.6 }}>
              <li>Plusieurs emojis à la suite (🎉🎁✨💖)</li>
              <li>Emojis dans les boutons d'action critiques</li>
              <li>Emojis pour remplacer un mot ("clique 🔝")</li>
              <li>Skin-tone & smileys ambigus</li>
            </ul>
          </div>
        </div>
      </div>
    </TSection>
  </TBoard>
);

Object.assign(window, { SMolecules, SPatternsItems, SPatternsSocial, SMicrocopy });
