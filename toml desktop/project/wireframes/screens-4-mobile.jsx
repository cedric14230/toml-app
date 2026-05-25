// Toml Wireframes — Mobile screens (low-fi B&W)
// 3 écrans retenus déclinés en mobile : Landing B, Dashboard A, Wishlist masonry

// =====================================================
// 1 · LANDING B en mobile
// Hero + 2 cards tiltées superposées sous le hero
// =====================================================
const MLanding = () => (
  <div style={{
    width: 390, height: 844,
    background: 'var(--paper)',
    border: '1.5px solid var(--ink)',
    borderRadius: 32,
    overflow: 'hidden',
    position: 'relative',
    fontFamily: 'var(--sketch-font)',
    color: 'var(--ink)',
  }}>
    <MStatusBar />

    {/* Top bar : logo + Se connecter */}
    <div style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      padding: '12px 18px', borderBottom: '1.5px solid var(--ink)',
    }}>
      <Logo size={18} />
      <span style={{
        fontFamily: 'var(--sketch-font)', fontWeight: 600,
        fontSize: 13, color: 'var(--ink-3)',
      }}>Se connecter</span>
    </div>

    {/* Hero */}
    <div style={{ padding: '28px 22px 18px' }}>
      <div className="sk-label" style={{ marginBottom: 10 }}>Top On My List</div>
      <div style={{
        fontFamily: 'var(--sketch-font)', fontWeight: 700,
        fontSize: 40, lineHeight: 1.02, marginBottom: 16,
      }}>
        <div>Vos envies</div>
        <div style={{ color: 'var(--ink-4)' }}>Partagées</div>
        <div><span className="sk-underline">Offertes</span></div>
      </div>
      <div style={{
        fontSize: 13.5, color: 'var(--ink-3)', lineHeight: 1.45,
        marginBottom: 18,
      }}>
        Créez votre wishlist depuis n'importe quel site, partagez-la en un lien, et laissez vos proches vous offrir exactement ce qui vous fait envie.
      </div>
      <button className="sk-btn sk-btn-dark sk-btn-lg" style={{ width: '100%', marginBottom: 10 }}>
        Créer ma wishlist
      </button>
      <button className="sk-btn sk-btn-lg" style={{ width: '100%' }}>
        Découvrir une wishlist
      </button>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 10, marginTop: 16,
        justifyContent: 'center',
      }}>
        <div style={{ display: 'flex' }}>
          {['L','M','A','J'].map((c,i) => (
            <div key={i} className="sk-avatar" style={{
              marginLeft: i ? -10 : 0, width: 24, height: 24,
              fontSize: 11, background: 'var(--paper-2)',
            }}>{c}</div>
          ))}
        </div>
        <div style={{ fontSize: 12, color: 'var(--ink-3)' }}>
          + 500 familles
        </div>
      </div>
    </div>

    {/* Stack de cards tiltées */}
    <div style={{
      position: 'relative', height: 280,
      background: 'var(--paper-2)',
      borderTop: '1.5px dashed var(--ink-3)',
      overflow: 'hidden',
    }}>
      {/* Card 1 — Sophie · Noël (tiltée gauche) */}
      <div className="sk-box tilt-l" style={{
        position: 'absolute',
        top: 28, left: 24, width: 200, padding: 12,
        background: 'var(--paper)', zIndex: 1,
      }}>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 8 }}>
          <div className="sk-avatar" style={{ width: 24, height: 24, fontSize: 11 }}>S</div>
          <div style={{ fontSize: 12, fontWeight: 700 }}>Sophie · Noël</div>
        </div>
        <div className="sk-img" style={{ height: 100, marginBottom: 8 }}></div>
        <div className="sk-line" style={{ width: '80%', marginBottom: 5 }}></div>
        <div className="sk-line-soft" style={{ width: '50%' }}></div>
      </div>

      {/* Card 2 — Thomas · Anniv (tiltée droite, plus bas) */}
      <div className="sk-box tilt-r" style={{
        position: 'absolute',
        bottom: 22, right: 18, width: 195, padding: 12,
        background: 'var(--paper)', zIndex: 2,
      }}>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 8 }}>
          <div className="sk-avatar" style={{ width: 24, height: 24, fontSize: 11 }}>T</div>
          <div style={{ fontSize: 12, fontWeight: 700 }}>Thomas · Anniv</div>
        </div>
        <div className="sk-img" style={{ height: 90, marginBottom: 8 }}></div>
        <div className="sk-chip" style={{ fontSize: 10 }}>
          <span className="status-dot reserved"></span>Réservé
        </div>
      </div>

      <div className="annotation" style={{ top: 12, right: 14, maxWidth: 110, textAlign: 'right' }}>
        2 cards<br/>superposées<br/>tiltées
      </div>
    </div>

    {/* Home indicator */}
    <div style={{
      position: 'absolute', bottom: 0, left: 0, right: 0,
      height: 28, display: 'flex', justifyContent: 'center', alignItems: 'flex-end',
      paddingBottom: 7,
    }}>
      <div style={{ width: 130, height: 4, borderRadius: 999, background: 'var(--ink-3)' }}></div>
    </div>
  </div>
);

// =====================================================
// 2 · DASHBOARD A — Mes wishlists
// Tab bar bas + topbar logo + (vignette WhatsApp si pas connecté) + grille 1 col cards
// =====================================================
const MDashboard = ({ whatsappConnected = false }) => (
  <MobileShell active="lists">
    <MTopBar />

    {/* Vignette "Connecter WhatsApp" — visible tant que non connecté */}
    {!whatsappConnected && (
      <div style={{ padding: '14px 18px 0' }}>
        <div className="sk-box" style={{
          padding: 14, display: 'flex', gap: 12, alignItems: 'flex-start',
          background: 'var(--paper-2)',
          borderColor: 'var(--ink)',
          position: 'relative',
        }}>
          {/* Icône WhatsApp — esquissée B&W */}
          <div style={{
            width: 38, height: 38, borderRadius: 999,
            border: '1.5px solid var(--ink)',
            background: 'var(--paper)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 18, flexShrink: 0,
          }}>💬</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{
              fontFamily: 'var(--sketch-font)', fontWeight: 700,
              fontSize: 14, marginBottom: 4, lineHeight: 1.25,
            }}>
              Ajoute en 2 secondes via WhatsApp ⚡
            </div>
            <div style={{
              fontSize: 11.5, color: 'var(--ink-3)',
              lineHeight: 1.4, marginBottom: 10,
            }}>
              Envoie un lien produit à Toml sur WhatsApp → il apparait direct dans ta wishlist.
            </div>
            <button className="sk-btn sk-btn-dark sk-btn-sm">
              📱 Connecter WhatsApp
            </button>
          </div>
          {/* Bouton fermer */}
          <span style={{
            position: 'absolute', top: 8, right: 10,
            fontSize: 16, color: 'var(--ink-4)',
            fontFamily: 'var(--sketch-font)', lineHeight: 1,
          }}>×</span>
        </div>
      </div>
    )}

    {/* Header section */}
    <div style={{ padding: whatsappConnected ? '18px 18px 12px' : '14px 18px 12px' }}>
      <div className="sk-label" style={{ marginBottom: 4 }}>Tableau de bord</div>
      <div style={{
        fontFamily: 'var(--sketch-font)', fontWeight: 700,
        fontSize: 26,
      }}>Mes wishlists</div>
    </div>

    {/* Cards en grille 1 colonne */}
    <div style={{ padding: '4px 18px 22px', display: 'flex', flexDirection: 'column', gap: 12 }}>
      {[
        { t: 'Noël 2026', n: 12, vis: 'Amis', latest: '5 ajouts cette semaine' },
        { t: 'Ma chambre idéale', n: 7, vis: 'Publique', latest: 'Léa a réagi à 2 articles' },
        { t: 'Anniversaire', n: 4, vis: 'Privée', latest: '14 juin' },
      ].map((w, i) => (
        <div key={i} className="sk-box" style={{ overflow: 'hidden' }}>
          <div className="sk-img" style={{
            height: 110, borderRadius: 0, border: 'none',
            borderBottom: '1.3px solid var(--ink-3)',
          }}></div>
          <div style={{ padding: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
              <div style={{ fontWeight: 700, fontSize: 16 }}>{w.t}</div>
              <span className="sk-chip" style={{ fontSize: 10 }}>{w.vis}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontSize: 12, color: 'var(--ink-3)' }}>{w.n} articles</div>
              <div style={{ fontSize: 11, color: 'var(--ink-4)' }}>{w.latest}</div>
            </div>
          </div>
        </div>
      ))}

      {/* Card "+ nouvelle" dashed */}
      <div className="sk-dashed" style={{
        padding: 22, display: 'flex', flexDirection: 'column', alignItems: 'center',
        gap: 4, color: 'var(--ink-4)',
      }}>
        <span style={{ fontSize: 24 }}>+</span>
        <span style={{ fontSize: 13 }}>Créer une nouvelle wishlist</span>
      </div>

      {/* Bookmarklet hint */}
      <div className="sk-box" style={{
        padding: 12, display: 'flex', gap: 10, alignItems: 'center',
        background: 'var(--paper-2)',
      }}>
        <div style={{
          width: 32, height: 32, border: '1.3px solid var(--ink)',
          borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 18,
        }}>✨</div>
        <div style={{ flex: 1, fontSize: 11.5, lineHeight: 1.3 }}>
          <div style={{ fontWeight: 700, marginBottom: 2 }}>Sur desktop : le bouton magique</div>
          <div style={{ color: 'var(--ink-3)' }}>Glisse-le dans tes favoris pour ajouter en 1 clic</div>
        </div>
      </div>
    </div>

    {/* Annotation */}
    <div className="annotation" style={{
      top: 70, right: 4, maxWidth: 86, textAlign: 'right',
    }}>
      vert WhatsApp<br/>en hi-fi →
    </div>
  </MobileShell>
);

// =====================================================
// 3 · WISHLIST MASONRY — vue propriétaire
// Header + filtres + grille 2 colonnes Pinterest-style
// =====================================================
const MWishlistMasonry = () => {
  const items = [
    { t: 'Robe Liliana',       p: 89,  stars: 3, h: 220, status: null,       brand: 'Sézane' },
    { t: 'Trench long',        p: 189, stars: 3, h: 260, status: null,       brand: 'Sézane',     note: 'Mon gros coup de cœur' },
    { t: 'Sneakers blanches',  p: 95,  stars: 3, h: 200, status: null,       brand: 'Veja' },
    { t: 'Vase céramique',     p: 45,  stars: 2, h: 160, status: null,       brand: 'Maison Dada' },
    { t: 'Bougie Diptyque',    p: 85,  stars: 2, h: 140, status: 'reserved', brand: 'Diptyque' },
    { t: 'Lampe design',       p: 75,  stars: 2, h: 170, status: null,       brand: 'HAY' },
    { t: 'Chapeau bob',        p: 29,  stars: 1, h: 130, status: null,       brand: 'COS' },
    { t: 'Livre cuisine',      p: 22,  stars: 1, h: 200, status: 'reserved', brand: 'Marabout' },
  ];

  const featured = items.filter(it => it.stars === 3);
  const others = items.filter(it => it.stars < 3);

  // Répartit les "autres" en 2 colonnes pour effet masonry
  const col1 = others.filter((_, i) => i % 2 === 0);
  const col2 = others.filter((_, i) => i % 2 === 1);

  const ItemCard = ({ it, featured = false }) => (
    <div className="sk-box" style={{
      padding: 0, overflow: 'hidden', marginBottom: 8,
      opacity: it.status === 'reserved' ? 0.55 : 1,
      position: 'relative',
    }}>
      <div className="sk-img" style={{
        height: it.h, borderRadius: 0, border: 'none',
        borderBottom: '1.3px solid var(--ink-3)',
      }}></div>
      {it.status === 'reserved' && (
        <span className="sk-chip" style={{
          position: 'absolute', top: 6, left: 6, fontSize: 9,
          background: 'var(--paper)',
        }}>
          <span className="status-dot reserved"></span>Réservé
        </span>
      )}
      {featured && (
        <div style={{
          position: 'absolute', top: 8, right: 8,
          display: 'flex', gap: 2,
          background: 'var(--paper)',
          border: '1.3px solid var(--ink)',
          borderRadius: 999, padding: '3px 7px',
        }}>
          <StarRow n={3} />
        </div>
      )}
      <div style={{ padding: featured ? 12 : 8 }}>
        <div style={{ fontWeight: 700, fontSize: featured ? 15 : 12, marginBottom: 2 }}>{it.t}</div>
        <div style={{ fontSize: featured ? 11 : 10, color: 'var(--ink-4)', marginBottom: 4 }}>{it.brand}</div>
        {it.note && (
          <div className="sk-hand" style={{
            fontSize: featured ? 15 : 12, color: 'var(--accent)', marginBottom: 6, lineHeight: 1.2,
          }}>« {it.note} »</div>
        )}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: featured ? 14 : 12, fontWeight: 700 }}>{it.p} €</div>
          {!featured && <StarRow n={it.stars} />}
        </div>
      </div>
    </div>
  );

  return (
    <MobileShell active="lists">
      {/* Top bar : back + title + actions */}
      <MTopBar
        back
        title="Noël 2026"
        right={<>
          <span style={{ fontSize: 16 }}>↗</span>
          <span style={{ fontSize: 18, fontWeight: 700 }}>⋯</span>
        </>}
      />

      {/* Hero compact */}
      <div style={{ padding: '14px 18px 8px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
          <div style={{ flex: 1 }}>
            <div className="sk-label" style={{ marginBottom: 2 }}>Amis · 12 articles</div>
            <div style={{ fontSize: 12, color: 'var(--ink-3)', lineHeight: 1.35 }}>
              « Ma liste de cette année, avec amour 🎄 »
            </div>
          </div>
        </div>
      </div>

      {/* Grille : 3★ pleine largeur, le reste en 2 colonnes */}
      <div style={{ padding: '8px 12px 80px' }}>
        {/* Featured 3★ — pleine largeur */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {featured.map((it, i) => <ItemCard key={'f' + i} it={it} featured />)}
        </div>

        {/* Reste en 2 colonnes */}
        <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            {col1.map((it, i) => <ItemCard key={'a' + i} it={it} />)}
          </div>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            {col2.map((it, i) => <ItemCard key={'b' + i} it={it} />)}
          </div>
        </div>
      </div>

      <div className="annotation" style={{ top: 90, right: 14, maxWidth: 100, textAlign: 'right' }}>
        3★ pleine largeur,<br/>reste en 2 col
      </div>
      <div className="annotation" style={{ bottom: 96, left: '50%', transform: 'translateX(-50%)', maxWidth: 180, textAlign: 'center' }}>
        ↓ le + central ajoute<br/>directement à cette liste
      </div>
    </MobileShell>
  );
};

Object.assign(window, { MLanding, MDashboard, MWishlistMasonry });
