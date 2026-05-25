// Screens — Dashboard (Mes wishlists) with nav variations

const DashboardTopbar = ({ density = 'comfy' }) => {
  const gap = density === 'compact' ? 10 : 16;
  const pad = density === 'compact' ? 16 : 26;
  return (
    <Browser url="toml.app/dashboard">
      <div style={{ height: '100%' }}>
        <TopNav authed active="lists" compact={density === 'compact'} />
        <div style={{ padding: `${pad}px ${pad + 4}px` }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 18 }}>
            <div>
              <div className="sk-label" style={{ marginBottom: 4 }}>Tableau de bord</div>
              <div style={{ fontFamily: 'var(--sketch-font)', fontWeight: 700, fontSize: 28 }}>Mes wishlists</div>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <div className="sk-chip">Toutes</div>
              <div className="sk-chip">Publiques</div>
              <div className="sk-chip">Amis</div>
              <button className="sk-btn sk-btn-dark sk-btn-sm">+ Créer une wishlist</button>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap }}>
            {[
              { t: 'Noël 2026', n: 12, vis: 'Amis', cover: true },
              { t: 'Ma chambre idéale', n: 7, vis: 'Publique' },
              { t: 'Anniversaire', n: 4, vis: 'Privée' },
              { t: '+ Nouvelle liste', n: 0, vis: '', empty: true },
            ].map((w,i) => (
              <div key={i} className={w.empty ? 'sk-dashed' : 'sk-box'} style={{ padding: 0, overflow: 'hidden' }}>
                {w.empty ? (
                  <div style={{ height: 180, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--ink-4)', fontSize: 14 }}>
                    + Créer une wishlist
                  </div>
                ) : (
                  <>
                    <div className="sk-img" style={{ height: 110, borderRadius: 0, border: 'none', borderBottom: '1.3px solid var(--ink-3)' }}></div>
                    <div style={{ padding: 12 }}>
                      <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 4 }}>{w.t}</div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ fontSize: 12, color: 'var(--ink-3)' }}>{w.n} articles</div>
                        <div className="sk-chip">{w.vis}</div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
          <div className="sk-box" style={{ marginTop: 18, padding: 14, display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 32, height: 32, border: '1.3px solid var(--ink)', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>☰</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 2 }}>Le bouton magique — ajoute depuis n'importe quel site</div>
              <div style={{ fontSize: 12, color: 'var(--ink-3)' }}>Glisse-le dans ta barre de favoris. Un clic = un article ajouté.</div>
            </div>
            <div className="bookmarklet">+ Ajouter à TOML</div>
          </div>
        </div>
        <div className="annotation" style={{ top: 70, right: 20, maxWidth: 120 }}>↑ nav<br/>horizontale<br/>comme proto</div>
      </div>
    </Browser>
  );
};

const DashboardSidebar = ({ mini = false }) => (
  <Browser url="toml.app/dashboard">
    <div style={{ height: '100%', display: 'flex' }}>
      <SideNav active="lists" mini={mini} toggleable={true} />
      <div style={{ flex: 1, padding: 22, overflow: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
          <div style={{ fontFamily: 'var(--sketch-font)', fontWeight: 700, fontSize: 26 }}>Mes wishlists</div>
          <button className="sk-btn sk-btn-dark sk-btn-sm">+ Créer</button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
          {[
            { t: 'Noël 2026', n: 12, status: 'public' },
            { t: 'Chambre idéale', n: 7, status: 'friends' },
            { t: 'Anniversaire', n: 4, status: 'private' },
            { t: '+ Nouvelle', empty: true },
          ].map((w,i) => (
            <div key={i} className={w.empty ? 'sk-dashed' : 'sk-box'} style={{ padding: 0, overflow: 'hidden', minHeight: 150 }}>
              {w.empty ? (
                <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--ink-4)', fontSize: 13, minHeight: 150 }}>+ Créer</div>
              ) : (
                <>
                  <div className="sk-img" style={{ height: 90, borderRadius: 0, border: 'none' }}></div>
                  <div style={{ padding: 10 }}>
                    <div style={{ fontWeight: 700, fontSize: 14 }}>{w.t}</div>
                    <div style={{ fontSize: 11, color: 'var(--ink-3)' }}>{w.n} articles</div>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
      <div className="annotation" style={{ top: 20, left: mini ? 80 : 210, maxWidth: 130 }}>
        ← clique sur ‹ / ›<br/>pour replier/déplier
      </div>
    </div>
  </Browser>
);

// Wishlist OWNER view with layout variations
const WishlistOwner = ({ layout = 'grid' }) => {
  const items = Array.from({ length: 9 }).map((_, i) => ({
    t: ['Blouse Loanne','Robe Liliana','Chapeau bob','Trench long','Vase céramique','Livre cuisine','Lampe design','Bougie parfumée','Sneakers blanches'][i],
    p: [34,89,29,189,45,22,75,18,95][i],
    status: [null, null, 'reserved', null, null, null, null, null, 'reserved'][i],
    stars: [2,3,1,3,2,1,2,2,3][i],
    h: [220, 260, 200, 300, 240, 200, 260, 220, 280][i],
  }));
  return (
    <Browser url="toml.app/dashboard/wishlists/noel-2026">
      <div style={{ height: '100%' }}>
        <TopNav authed active="lists" compact />
        <div style={{ padding: '20px 26px', overflow: 'auto' }}>
          <div style={{ fontSize: 12, color: 'var(--ink-3)', marginBottom: 10 }}>← Mes wishlists</div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 18, flexWrap: 'wrap', gap: 10 }}>
            <div>
              <div className="sk-label" style={{ marginBottom: 4 }}>Publique · 12 articles</div>
              <div style={{ fontFamily: 'var(--sketch-font)', fontWeight: 700, fontSize: 32 }}>Noël 2026</div>
              <div style={{ fontSize: 13, color: 'var(--ink-3)', marginTop: 4 }}>Ma liste de cette année, avec amour 🎄</div>
            </div>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <div className="sk-chip">👁 Visibilité : Amis</div>
              <button className="sk-btn sk-btn-sm">Partager</button>
              <button className="sk-btn sk-btn-dark sk-btn-sm">+ Ajouter un article</button>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 6, marginBottom: 14, alignItems: 'center' }}>
            <span className="sk-chip" style={{ background: 'var(--ink)', color: 'var(--paper)', borderColor: 'var(--ink)' }}>Grille</span>
            <span className="sk-chip">Liste</span>
            <span className="sk-chip">Masonry</span>
            <div style={{ flex: 1 }}></div>
            <span className="sk-chip">Trier : priorité</span>
          </div>

          {layout === 'grid' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
              {items.map((it,i) => (
                <div key={i} className="sk-box" style={{ padding: 0, overflow: 'hidden' }}>
                  <div className="sk-img" style={{ height: 160, borderRadius: 0, border: 'none', borderBottom: '1.3px solid var(--ink-3)' }}></div>
                  <div style={{ padding: 10 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                      <div style={{ fontWeight: 700, fontSize: 13 }}>{it.t}</div>
                      <StarRow n={it.stars} />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ fontSize: 12, color: 'var(--ink-3)' }}>{it.p} €</div>
                      {it.status === 'reserved' && <span className="sk-chip"><span className="status-dot reserved"></span>Réservé</span>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {layout === 'list' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {items.slice(0,6).map((it,i) => (
                <div key={i} className="sk-box" style={{ display: 'flex', padding: 10, gap: 14, alignItems: 'center' }}>
                  <div className="sk-img" style={{ width: 80, height: 80, flexShrink: 0 }}></div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 4 }}>{it.t}</div>
                    <div style={{ fontSize: 12, color: 'var(--ink-3)', marginBottom: 4 }}>Zara · {it.p} €</div>
                    <div className="sk-line-soft" style={{ width: '70%' }}></div>
                  </div>
                  <StarRow n={it.stars} />
                  {it.status === 'reserved' && <span className="sk-chip"><span className="status-dot reserved"></span>Réservé</span>}
                  <div style={{ fontSize: 18, color: 'var(--ink-4)' }}>⋯</div>
                </div>
              ))}
            </div>
          )}

          {layout === 'masonry' && (
            <div style={{ columnCount: 3, columnGap: 10 }}>
              {items.map((it,i) => (
                <div key={i} className="sk-box" style={{ breakInside: 'avoid', marginBottom: 10, padding: 0, overflow: 'hidden' }}>
                  <div className="sk-img" style={{ height: it.h, borderRadius: 0, border: 'none', borderBottom: '1.3px solid var(--ink-3)' }}></div>
                  <div style={{ padding: 10 }}>
                    <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 3 }}>{it.t}</div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ fontSize: 12, color: 'var(--ink-3)' }}>{it.p} €</div>
                      <StarRow n={it.stars} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Browser>
  );
};

// Gift-Giver view (shared link, no account or with)
const WishlistGiver = ({ variant = 'public' }) => {
  const items = [
    { t: 'Blouse Loanne - Ecru', p: 34, stars: 2, status: null, note: 'En taille S s\'il te plaît 🙏' },
    { t: 'Robe Liliana', p: 89, stars: 3, status: 'reserved' },
    { t: 'Trench long cercle', p: 189, stars: 3, status: null, note: 'Mon gros coup de cœur' },
    { t: 'Chapeau bob coton', p: 29, stars: 1, status: null },
    { t: 'Vase céramique', p: 45, stars: 2, status: null },
    { t: 'Bougie Diptyque', p: 85, stars: 2, status: 'reserved' },
  ];
  return (
    <Browser url="toml.app/s/sophie-noel-2026">
      <div style={{ height: '100%' }}>
        <div style={{ padding: '12px 22px', borderBottom: '1.5px solid var(--ink)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Logo size={18} />
          {variant === 'public' ? (
            <button className="sk-btn sk-btn-sm sk-btn-dark">Se connecter pour réserver</button>
          ) : (
            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              <div className="sk-avatar" style={{ width: 28, height: 28, fontSize: 11 }}>T</div>
            </div>
          )}
        </div>
        <div style={{ padding: '20px 26px', overflow: 'auto' }}>
          <div className="giver-banner" style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <span style={{ fontWeight: 700 }}>Tu consultes la wishlist de Sophie.</span> Les réservations sont invisibles pour elle.
            </div>
            <div className="sk-chip" style={{ background: 'var(--paper)' }}>Mode invité</div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 18 }}>
            <div className="sk-avatar xl">S</div>
            <div style={{ flex: 1 }}>
              <div className="sk-label" style={{ marginBottom: 2 }}>Wishlist de Sophie · 12 articles</div>
              <div style={{ fontFamily: 'var(--sketch-font)', fontWeight: 700, fontSize: 28 }}>Noël 2026</div>
              <div style={{ fontSize: 13, color: 'var(--ink-3)' }}>« Ma liste de cette année, avec amour 🎄 »</div>
            </div>
            <button className="sk-btn sk-btn-sm">↗ Partager</button>
          </div>

          <div style={{ display: 'flex', gap: 6, marginBottom: 14, alignItems: 'center' }}>
            <span className="sk-chip" style={{ background: 'var(--ink)', color: 'var(--paper)', borderColor: 'var(--ink)' }}>Tout ({items.length})</span>
            <span className="sk-chip">★★★ Priorité</span>
            <span className="sk-chip">Disponible (4)</span>
            <span className="sk-chip">&lt; 50 €</span>
            <div style={{ flex: 1 }}></div>
            <span className="sk-chip">Masquer réservés</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
            {items.map((it,i) => (
              <div key={i} className="sk-box" style={{ padding: 12, display: 'flex', gap: 12, alignItems: 'center', opacity: it.status === 'reserved' ? 0.55 : 1 }}>
                <div className="sk-img" style={{ width: 80, height: 80, flexShrink: 0 }}></div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <div style={{ fontWeight: 700, fontSize: 14 }}>{it.t}</div>
                    <StarRow n={it.stars} />
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--ink-3)', marginBottom: 6 }}>{it.p} €</div>
                  {it.note && <div style={{ fontSize: 12, color: 'var(--ink-3)', fontStyle: 'italic', marginBottom: 6 }}>« {it.note} »</div>}
                  <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                    {it.status === 'reserved' ? (
                      <span className="sk-chip"><span className="status-dot reserved"></span>Déjà réservé</span>
                    ) : (
                      <button className="sk-btn sk-btn-dark sk-btn-sm">🎁 Je l'offre</button>
                    )}
                    <span className="sk-chip">↗ Voir le site</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="annotation" style={{ top: 60, right: 20, maxWidth: 140 }}>
          bandeau orange<br/>= mode GIVER
        </div>
      </div>
    </Browser>
  );
};

// Add/edit item modal — 3 flavors
const AddItemModal = ({ variant = 'url' }) => (
  <Browser url="toml.app/dashboard/wishlists/noel-2026">
    <div style={{ height: '100%', position: 'relative', background: 'var(--paper-2)' }}>
      <div style={{ opacity: 0.3 }}>
        <TopNav authed active="lists" compact />
        <div style={{ padding: 20 }}>
          <div style={{ fontSize: 22, fontWeight: 700 }}>Noël 2026</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8, marginTop: 14 }}>
            {[0,1,2,3,4,5].map(i => (
              <div key={i} className="sk-box" style={{ height: 130 }}></div>
            ))}
          </div>
        </div>
      </div>
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(20,20,20,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="sk-box" style={{ width: 420, padding: 22, background: 'var(--paper)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <div style={{ fontFamily: 'var(--sketch-font)', fontWeight: 700, fontSize: 20 }}>Ajouter un article</div>
            <div style={{ fontSize: 18, color: 'var(--ink-4)' }}>×</div>
          </div>
          <div style={{ display: 'flex', gap: 4, marginBottom: 14, borderBottom: '1.3px solid var(--ink-4)' }}>
            {[
              ['url','🔗 URL'], ['manual','✎ Manuel'], ['book','✨ Bouton magique']
            ].map(([id, label]) => (
              <div key={id} style={{
                padding: '6px 10px',
                fontSize: 12,
                fontWeight: 700,
                borderBottom: variant === id ? '2.5px solid var(--ink)' : '2.5px solid transparent',
                color: variant === id ? 'var(--ink)' : 'var(--ink-3)',
                marginBottom: -1,
              }}>{label}</div>
            ))}
          </div>
          {variant === 'url' && (
            <>
              <div className="sk-label" style={{ marginBottom: 4 }}>URL du produit</div>
              <div className="input-box" style={{ fontFamily: 'var(--mono-font)', fontSize: 11, marginBottom: 12 }}>https://www.sezane.com/…</div>
              <div className="sk-dashed" style={{ padding: 12, display: 'flex', gap: 10, marginBottom: 12 }}>
                <div className="sk-img" style={{ width: 70, height: 70 }}></div>
                <div style={{ flex: 1 }}>
                  <div className="sk-label">Aperçu détecté</div>
                  <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 4 }}>Blouse Loanne - Ecru</div>
                  <div style={{ fontSize: 12, color: 'var(--ink-3)' }}>34 € · Sézane</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 6, marginBottom: 12 }}>
                <div className="input-box" style={{ flex: 1, fontSize: 12 }}>Liste : Noël 2026 ▾</div>
                <div className="input-box" style={{ width: 100, fontSize: 12 }}>Priorité ★★</div>
              </div>
              <div className="input-box" style={{ fontSize: 12, marginBottom: 14, minHeight: 50 }}>Note (optionnel)…</div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                <button className="sk-btn sk-btn-ghost">Annuler</button>
                <button className="sk-btn sk-btn-dark">Ajouter</button>
              </div>
            </>
          )}
          {variant === 'manual' && (
            <>
              <div className="sk-label" style={{ marginBottom: 4 }}>Titre *</div>
              <div className="input-box" style={{ marginBottom: 10 }}>Blouse blanche</div>
              <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
                <div style={{ flex: 1 }}>
                  <div className="sk-label" style={{ marginBottom: 4 }}>Image</div>
                  <div className="sk-dashed" style={{ height: 80, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, color: 'var(--ink-4)' }}>+ Uploader</div>
                </div>
                <div style={{ width: 120 }}>
                  <div className="sk-label" style={{ marginBottom: 4 }}>Prix</div>
                  <div className="input-box">34 €</div>
                  <div className="sk-label" style={{ marginTop: 8, marginBottom: 4 }}>Priorité</div>
                  <div className="input-box" style={{ fontSize: 12 }}>★★☆</div>
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                <button className="sk-btn sk-btn-ghost">Annuler</button>
                <button className="sk-btn sk-btn-dark">Enregistrer</button>
              </div>
            </>
          )}
          {variant === 'book' && (
            <>
              <div style={{ fontSize: 13, color: 'var(--ink-2)', marginBottom: 8, fontWeight: 700 }}>Le bouton magique : ajouter en 1 clic depuis n'importe quel site.</div>
              <div style={{ fontSize: 12, color: 'var(--ink-3)', marginBottom: 14, lineHeight: 1.4 }}>
                <b>1.</b> Glisse le bouton ci-dessous dans ta barre de favoris (en haut de ton navigateur).<br/>
                <b>2.</b> Sur Sézane, Amazon, Etsy… clique dessus depuis n'importe quelle page produit.<br/>
                <b>3.</b> L'article rejoint automatiquement la liste de ton choix. ✨
              </div>
              <div style={{ textAlign: 'center', padding: 20, background: 'var(--paper-2)', border: '1.3px dashed var(--ink-3)', borderRadius: 8, marginBottom: 12 }}>
                <div className="bookmarklet" style={{ marginBottom: 8, fontSize: 15, padding: '10px 18px' }}>+ Ajouter à TOML</div>
                <div style={{ fontSize: 11, color: 'var(--ink-4)' }}>← Glisse-moi vers tes favoris</div>
              </div>
              <div style={{ fontSize: 12, color: 'var(--ink-3)', marginBottom: 14 }}>
                Compatible avec Amazon, Zara, Sézane, ASOS, Etsy, Zalando, Fnac, et 1000+ sites.
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button className="sk-btn sk-btn-dark">Compris, merci</button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  </Browser>
);

Object.assign(window, { DashboardTopbar, DashboardSidebar, WishlistOwner, WishlistGiver, AddItemModal });
