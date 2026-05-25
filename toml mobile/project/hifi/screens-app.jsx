// TOML Hi-fi — Dashboard A + Wishlist masonry

const HiDashboard = () => {
  const lists = [
    { t: 'Noël 2026', n: 12, vis: 'Amis', sub: 'Ma liste de cette année', tone: 2, latest: '5 articles ajoutés cette semaine' },
    { t: 'Ma chambre idéale', n: 7, vis: 'Publique', sub: 'Déco douce & lumineuse', tone: 4, latest: 'Léa a réagi à 2 articles' },
    { t: 'Anniversaire', n: 4, vis: 'Privée', sub: '14 juin — petite liste perso', tone: 6, latest: 'Privée · uniquement toi' },
    { t: 'Lecture 2026', n: 9, vis: 'Publique', sub: 'Pour mon panier été', tone: 3, latest: '3 livres en attente' },
  ];
  return (
    <TBrowser url="toml.app/dashboard">
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <TNav authed active="lists" />
        <div style={{ flex: 1, overflow: 'auto', padding: '32px 40px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 28, gap: 20, flexWrap: 'wrap' }}>
            <div>
              <div className="tlabel" style={{ marginBottom: 8 }}>Bonjour Cédric ✦</div>
              <h1 className="toml-serif" style={{ fontSize: 38, fontWeight: 400, margin: 0, letterSpacing: '-0.02em' }}>
                Mes <span style={{ fontStyle: 'italic' }}>wishlists</span>
              </h1>
            </div>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <span className="tchip tchip-active">Toutes (4)</span>
              <span className="tchip">Publiques</span>
              <span className="tchip">Amis</span>
              <span className="tchip">Privées</span>
              <span className="tchip">Archivées</span>
              <button className="tbtn tbtn-primary tbtn-sm" style={{ marginLeft: 12 }}>+ Créer une liste</button>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 24 }}>
            {lists.slice(0, 3).map((w, i) => (
              <div key={i} className="tcard">
                <TImg tone={w.tone} h={150}>
                  <div style={{ position: 'absolute', top: 12, right: 12, display: 'flex', gap: 4 }}>
                    <span className="tchip" style={{ background: 'rgba(250,246,240,0.9)' }}>{w.vis}</span>
                  </div>
                </TImg>
                <div style={{ padding: 16 }}>
                  <h3 className="toml-serif" style={{ fontSize: 19, fontWeight: 500, margin: 0, marginBottom: 4 }}>{w.t}</h3>
                  <div style={{ fontSize: 13, color: 'var(--ink-3)', marginBottom: 10 }}>{w.sub}</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 12, color: 'var(--ink-2)', fontWeight: 600 }}>{w.n} articles</span>
                    <span style={{ fontSize: 11, color: 'var(--camel-d)', fontWeight: 500 }}>{w.latest}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 28 }}>
            <div className="tcard" style={{ display: 'flex', alignItems: 'center', padding: 0 }}>
              <TImg tone={lists[3].tone} h={120} style={{ width: 140, flexShrink: 0, borderRadius: 0 }} />
              <div style={{ padding: 16, flex: 1 }}>
                <h3 className="toml-serif" style={{ fontSize: 18, fontWeight: 500, margin: 0, marginBottom: 4 }}>{lists[3].t}</h3>
                <div style={{ fontSize: 12, color: 'var(--ink-3)', marginBottom: 8 }}>{lists[3].sub}</div>
                <div style={{ fontSize: 12, color: 'var(--camel-d)', fontWeight: 500 }}>{lists[3].latest}</div>
              </div>
            </div>
            <div style={{
              border: '2px dashed var(--line-2)', borderRadius: 'var(--r-lg)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexDirection: 'column', gap: 8, color: 'var(--ink-3)', minHeight: 120,
              background: 'var(--paper-2)',
            }}>
              <div style={{ fontSize: 28, color: 'var(--burgundy)' }}>+</div>
              <div className="toml-serif" style={{ fontSize: 16, fontStyle: 'italic' }}>Nouvelle wishlist</div>
            </div>
          </div>

          <div className="tcard" style={{ padding: 18, display: 'flex', alignItems: 'center', gap: 16, background: 'var(--paper-2)', border: '1px solid var(--camel)' }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: 'var(--ink)', color: 'var(--paper)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>★</div>
            <div style={{ flex: 1 }}>
              <div className="toml-serif" style={{ fontSize: 17, fontWeight: 500, marginBottom: 2 }}>Ajoute depuis n'importe quel site</div>
              <div style={{ fontSize: 13, color: 'var(--ink-2)' }}>Glisse ce bouton dans ta barre de favoris. 1 clic = 1 article ajouté.</div>
            </div>
            <div className="tbookmarklet">+ Ajouter à TOML</div>
            <button className="tbtn tbtn-outline tbtn-sm">En savoir plus</button>
          </div>
        </div>
      </div>
    </TBrowser>
  );
};

const HiWishlistOwner = () => {
  const items = [
    { t: 'Robe Liliana', brand: 'Sézane', p: 89, stars: 3, h: 280, tone: 2, status: null, note: 'En taille 36 ✨' },
    { t: 'Vase céramique', brand: 'Maison Dada', p: 45, stars: 2, h: 220, tone: 3, status: null },
    { t: 'Trench long cercle', brand: 'Sézane', p: 189, stars: 3, h: 320, tone: 4, status: 'reserved', note: 'Mon gros coup de cœur' },
    { t: 'Bougie Diptyque', brand: 'Diptyque', p: 85, stars: 2, h: 200, tone: 6, status: null },
    { t: 'Lampe pliée', brand: 'HAY', p: 165, stars: 3, h: 260, tone: 8, status: null },
    { t: 'Livre cuisine', brand: 'Phaidon', p: 22, stars: 1, h: 190, tone: 7, status: null },
    { t: 'Sneakers blanches', brand: 'Veja', p: 95, stars: 3, h: 240, tone: 1, status: 'reserved' },
    { t: 'Chapeau bob coton', brand: 'Courrèges', p: 29, stars: 1, h: 180, tone: 5, status: null },
    { t: 'Carafe verre soufflé', brand: 'La Soufflerie', p: 58, stars: 2, h: 250, tone: 9, status: null },
  ];
  return (
    <TBrowser url="toml.app/dashboard/lists/noel-2026">
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <TNav authed active="lists" />
        <div style={{ flex: 1, overflow: 'auto' }}>
          <div style={{ padding: '24px 40px 8px' }}>
            <div style={{ fontSize: 13, color: 'var(--ink-3)', marginBottom: 16 }}>← Mes wishlists</div>
            <div style={{ display: 'flex', gap: 24, alignItems: 'flex-end', marginBottom: 22, flexWrap: 'wrap' }}>
              <TImg tone={2} h={120} style={{ width: 160, borderRadius: 12, flexShrink: 0 }} />
              <div style={{ flex: 1, minWidth: 280 }}>
                <div className="tlabel" style={{ marginBottom: 6 }}>Wishlist · 12 articles · Visibilité Amis</div>
                <h1 className="toml-serif" style={{ fontSize: 42, fontWeight: 400, margin: 0, letterSpacing: '-0.02em', marginBottom: 6 }}>
                  Noël <span style={{ fontStyle: 'italic' }}>2026</span>
                </h1>
                <p style={{ fontSize: 14, color: 'var(--ink-2)', margin: 0, maxWidth: 480 }}>
                  Ma liste de cette année, avec amour. Mix vêtements, déco et petits plaisirs.
                </p>
              </div>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                <button className="tbtn tbtn-outline tbtn-sm">↗ Partager</button>
                <button className="tbtn tbtn-ghost tbtn-sm">⋯ Modifier</button>
                <button className="tbtn tbtn-primary tbtn-sm">+ Ajouter un article</button>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 8, paddingBottom: 16, borderBottom: '1px solid var(--line)', flexWrap: 'wrap' }}>
              <span className="tchip tchip-active">Tout (12)</span>
              <span className="tchip">Disponible (10)</span>
              <span className="tchip">★★★ Priorité (5)</span>
              <span className="tchip">&lt; 50 €</span>
              <div style={{ flex: 1 }}></div>
              <div style={{ display: 'flex', gap: 4, padding: 3, background: 'var(--paper-2)', borderRadius: 999 }}>
                <span className="tchip" style={{ background: 'transparent', border: 'none' }}>Grille</span>
                <span className="tchip" style={{ background: 'transparent', border: 'none' }}>Liste</span>
                <span className="tchip tchip-active">Masonry</span>
              </div>
              <span className="tchip">Trier : Priorité ↓</span>
            </div>
          </div>

          <div style={{ padding: '20px 40px 40px' }}>
            <div style={{ columnCount: 3, columnGap: 16 }}>
              {items.map((it, i) => (
                <div key={i} className="tcard" style={{ breakInside: 'avoid', marginBottom: 16, position: 'relative' }}>
                  <TImg tone={it.tone} h={it.h} sticker={it.status === 'reserved' ? 'Réservé' : null}>
                    <div style={{ position: 'absolute', top: 10, right: 10, display: 'flex', gap: 4 }}>
                      <TStars n={it.stars} sm />
                    </div>
                    <button className="tbtn tbtn-ghost tbtn-sm" style={{
                      position: 'absolute', top: 10, left: 10,
                      background: 'rgba(250,246,240,0.9)', backdropFilter: 'blur(4px)',
                      width: 28, height: 28, padding: 0, borderRadius: 999, fontSize: 14,
                    }}>⋯</button>
                  </TImg>
                  <div style={{ padding: 14 }}>
                    <div style={{ fontSize: 11, color: 'var(--camel-d)', fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: 4 }}>{it.brand}</div>
                    <h4 className="toml-serif" style={{ fontSize: 16, fontWeight: 500, margin: 0, marginBottom: 6 }}>{it.t}</h4>
                    {it.note && (
                      <div className="toml-hand" style={{ fontSize: 14, color: 'var(--burgundy)', marginBottom: 8 }}>
                        « {it.note} »
                      </div>
                    )}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: 14, fontWeight: 600 }}>{it.p} €</span>
                      <span style={{ fontSize: 12, color: 'var(--ink-3)' }}>↗ Voir</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </TBrowser>
  );
};

Object.assign(window, { HiDashboard, HiWishlistOwner });
