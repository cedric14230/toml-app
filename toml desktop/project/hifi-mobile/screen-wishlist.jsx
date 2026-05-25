// Toml Hi-fi Mobile — Wishlist masonry (vue propriétaire)
// 3★ pleine largeur en cards stamp + 1-2★ en 2 colonnes soft

const HMWishlistMasonry = () => {
  const items = [
    { t: 'Robe Liliana',      brand: 'Sézane',     p: 89,  stars: 3, tone: 1, status: null,       note: null },
    { t: 'Trench long cercle', brand: 'Sézane',    p: 189, stars: 3, tone: 2, status: null,       note: 'Mon gros coup de cœur' },
    { t: 'Sneakers blanches',  brand: 'Veja',      p: 95,  stars: 3, tone: 3, status: null,       note: null },
    { t: 'Vase céramique',     brand: 'Maison Dada', p: 45, stars: 2, tone: 4, status: null,       note: null },
    { t: 'Bougie',             brand: 'Diptyque',  p: 85,  stars: 2, tone: 5, status: 'reserved', note: null },
    { t: 'Lampe Bourgie',      brand: 'Kartell',   p: 75,  stars: 2, tone: 6, status: null,       note: null },
    { t: 'Chapeau bob',        brand: 'COS',       p: 29,  stars: 1, tone: 3, status: null,       note: null },
    { t: 'Livre cuisine',      brand: 'Marabout',  p: 22,  stars: 1, tone: 4, status: 'reserved', note: null },
  ];

  const featured = items.filter(it => it.stars === 3);
  const others = items.filter(it => it.stars < 3);

  // Répartit les "autres" en 2 colonnes alternées
  const heights = [180, 200, 160, 220, 170];
  const col1 = others.filter((_, i) => i % 2 === 0);
  const col2 = others.filter((_, i) => i % 2 === 1);

  const FeaturedCard = ({ it }) => (
    <div className="card" style={{
      opacity: it.status === 'reserved' ? 0.55 : 1, position: 'relative',
    }}>
      <div className={`img img-${it.tone}`} style={{ height: 280, position: 'relative' }}>
        {/* Badge ★★★ en sticker mustard */}
        <span className="sticker" style={{
          position: 'absolute', top: 14, left: 14,
        }}>
          <TomlStars value={3} size={11} />
          <span style={{ marginLeft: 4 }}>top wishlist</span>
        </span>

        {/* Action heart en haut à droite */}
        <button className="btn btn-ghost" style={{
          position: 'absolute', top: 12, right: 12,
          width: 36, height: 36, padding: 0, borderRadius: 999,
          background: 'rgba(255,255,255,0.92)',
          backdropFilter: 'blur(4px)',
          border: '1px solid var(--t-line)',
        }}>
          <TomlIcon name="heart" size={16} />
        </button>
      </div>
      <div style={{ padding: '14px 16px' }}>
        <div className="label" style={{ color: 'var(--t-rose)', marginBottom: 4 }}>{it.brand}</div>
        <div className="display-2" style={{ fontSize: 18, marginBottom: it.note ? 6 : 8 }}>{it.t}</div>
        {it.note && (
          <div className="voice" style={{ fontSize: 15, marginBottom: 8 }}>
            « {it.note} »
          </div>
        )}
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          <div style={{ fontSize: 17, fontWeight: 700, letterSpacing: '-0.01em' }}>{it.p} €</div>
          <button className="btn btn-outline btn-sm">
            <TomlIcon name="edit" size={13} />
            Modifier
          </button>
        </div>
      </div>
    </div>
  );

  const SmallCard = ({ it, h }) => (
    <div className="card-soft" style={{
      opacity: it.status === 'reserved' ? 0.55 : 1, position: 'relative',
      marginBottom: 10,
    }}>
      <div className={`img img-${it.tone}`} style={{ height: h, position: 'relative' }}>
        {it.status === 'reserved' && (
          <span className="chip chip-mustard" style={{
            position: 'absolute', top: 8, left: 8, fontSize: 10, padding: '2px 8px',
          }}>
            <span className="dot dot-reserved"></span>
            Réservé
          </span>
        )}
      </div>
      <div style={{ padding: 10 }}>
        <div className="label" style={{ color: 'var(--t-rose)', marginBottom: 2, fontSize: 9 }}>{it.brand}</div>
        <div className="display-2" style={{ fontSize: 13, marginBottom: 6, lineHeight: 1.2 }}>{it.t}</div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: 13, fontWeight: 700 }}>{it.p} €</div>
          <TomlStars value={it.stars} size={9} />
        </div>
      </div>
    </div>
  );

  return (
    <HMShell active="lists">
      <HMTopBar
        back
        title="Noël 2026"
        right={
          <>
            <button className="btn btn-ghost" style={{
              width: 36, height: 36, padding: 0, borderRadius: 999,
              background: 'var(--t-paper)', border: '1px solid var(--t-line)',
            }}>
              <TomlIcon name="share" size={16} />
            </button>
            <button className="btn btn-ghost" style={{
              width: 36, height: 36, padding: 0, borderRadius: 999,
              background: 'var(--t-paper)', border: '1px solid var(--t-line)',
            }}>
              <TomlIcon name="menu" size={16} />
            </button>
          </>
        }
      />

      {/* Hero / contexte */}
      <div style={{ padding: '14px 18px 8px' }}>
        <div className="label" style={{ marginBottom: 4 }}>
          <TomlIcon name="friends" size={11} style={{ verticalAlign: '-1px', marginRight: 4 }} />
          Amis · 12 articles · 8 disponibles
        </div>
        <div className="voice" style={{ fontSize: 17, lineHeight: 1.35 }}>
          « Ma liste de cette année, avec amour 🎄 »
        </div>
      </div>

      {/* Featured 3★ — pleine largeur */}
      <div style={{ padding: '12px 18px 0', display: 'flex', flexDirection: 'column', gap: 16 }}>
        {featured.map((it, i) => <FeaturedCard key={'f' + i} it={it} />)}
      </div>

      {/* Section header reste */}
      <div style={{ padding: '20px 18px 8px' }}>
        <div className="label">Le reste de ma liste</div>
      </div>

      {/* Reste en 2 colonnes masonry */}
      <div style={{ padding: '0 14px 24px', display: 'flex', gap: 10 }}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          {col1.map((it, i) => <SmallCard key={'a' + i} it={it} h={heights[i % heights.length]} />)}
        </div>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          {col2.map((it, i) => <SmallCard key={'b' + i} it={it} h={heights[(i + 1) % heights.length]} />)}
        </div>
      </div>
    </HMShell>
  );
};

window.HMWishlistMasonry = HMWishlistMasonry;
