// Toml Hi-fi Desktop — Wishlist Noël 2026
// Hero avec thumb + meta + actions · filter bar · masonry 3-col

const HDWishlistItemCard = ({ brand, title, price, stars, tone, note, status, big }) => (
  <div className={big ? 'card' : 'card-soft'} style={{
    breakInside: 'avoid', marginBottom: 16,
    opacity: status === 'reserved' ? 0.6 : 1,
    position: 'relative',
  }}>
    <div className={`img img-${tone}`} style={{
      height: big ? 320 : 220, position: 'relative',
    }}>
      {stars === 3 && (
        <span className="sticker" style={{
          position: 'absolute', top: 12, left: 12,
        }}>
          <TomlStars value={3} size={11} />
          <span style={{ marginLeft: 4 }}>top wishlist</span>
        </span>
      )}
      {status === 'reserved' && (
        <span className="chip chip-mustard" style={{
          position: 'absolute', top: 12, left: 12, fontSize: 11,
        }}>
          <span className="dot dot-reserved"></span>
          Réservé
        </span>
      )}
      <button className="btn btn-ghost" style={{
        position: 'absolute', top: 10, right: 10,
        width: 32, height: 32, padding: 0, borderRadius: 999,
        background: 'rgba(255,255,255,0.92)',
        backdropFilter: 'blur(4px)',
        border: '1px solid var(--t-line)',
      }}>
        <TomlIcon name="menu" size={14} />
      </button>
    </div>
    <div style={{ padding: big ? '16px 18px' : '12px 14px' }}>
      <div className="label" style={{ color: 'var(--t-rose)', marginBottom: 4, fontSize: big ? 11 : 10 }}>{brand}</div>
      <div className="display-2" style={{ fontSize: big ? 20 : 15, marginBottom: note ? 6 : 8, lineHeight: 1.15 }}>{title}</div>
      {note && (
        <div className="voice" style={{ fontSize: big ? 15 : 13, marginBottom: 8 }}>
          « {note} »
        </div>
      )}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontSize: big ? 17 : 14, fontWeight: 700 }}>{price} €</div>
        {!big && <TomlStars value={stars} size={10} />}
        {big && (
          <button className="btn btn-outline btn-sm">
            <TomlIcon name="edit" size={12} />
            Modifier
          </button>
        )}
      </div>
    </div>
  </div>
);

const HDWishlist = () => {
  const items = [
    { brand:'Sézane',     title:'Robe Liliana',         price:89,  stars:3, tone:1, note:'En taille S si tu trouves ✨', big: true },
    { brand:'Sézane',     title:'Trench long cercle',   price:189, stars:3, tone:2, note:'Mon gros coup de cœur', big: true },
    { brand:'Veja',       title:'Sneakers blanches',    price:95,  stars:3, tone:3, big: true },
    { brand:'Maison Dada',title:'Vase céramique',       price:45,  stars:2, tone:4 },
    { brand:'Diptyque',   title:'Bougie Baies',         price:85,  stars:2, tone:5, status:'reserved' },
    { brand:'Kartell',    title:'Lampe Bourgie',        price:75,  stars:2, tone:6 },
    { brand:'HAY',        title:'Lampe pliée',          price:165, stars:3, tone:2, note:'Pour le coin lecture' },
    { brand:'Phaidon',    title:'Livre cuisine',        price:22,  stars:1, tone:3 },
    { brand:'COS',        title:'Chapeau bob',          price:29,  stars:1, tone:4 },
    { brand:'Marabout',   title:'Livre cuisine pasta',  price:22,  stars:1, tone:5, status:'reserved' },
    { brand:'La Soufflerie', title:'Carafe verre soufflé', price:58, stars:2, tone:6 },
  ];

  return (
    <HDShell url="toml.app/dashboard/lists/noel-2026" active="lists">
      <div style={{ padding: '24px 40px 60px' }}>
        {/* Breadcrumb */}
        <div style={{ fontSize: 13, color: 'var(--t-ink-3)', marginBottom: 18, display: 'flex', alignItems: 'center', gap: 6, fontWeight: 600 }}>
          <TomlIcon name="arrow" size={12} style={{ transform: 'rotate(180deg)' }} />
          Mes wishlists
        </div>

        {/* Hero */}
        <div style={{
          display: 'flex', alignItems: 'flex-end', gap: 28,
          marginBottom: 28, flexWrap: 'wrap',
        }}>
          <div className={`img img-1`} style={{
            width: 200, height: 160, borderRadius: 'var(--t-r-lg)',
            border: '1.5px solid var(--t-ink)', boxShadow: 'var(--t-shadow-stamp)',
            position: 'relative', flexShrink: 0,
          }}>
            <span className="sticker" style={{
              position: 'absolute', bottom: 12, left: 12,
            }}>
              🎄 Noël
            </span>
          </div>
          <div style={{ flex: 1, minWidth: 280 }}>
            <div className="label" style={{ marginBottom: 6, display: 'flex', alignItems: 'center', gap: 8 }}>
              <TomlIcon name="friends" size={11} />
              Wishlist · 12 articles · 8 disponibles · Amis
            </div>
            <h1 className="display-2" style={{
              fontSize: 48, letterSpacing: '-0.025em', marginBottom: 10,
            }}>
              Noël <span style={{ color: 'var(--t-rose)', fontStyle: 'italic', fontWeight: 600 }}>2026</span>
            </h1>
            <div className="voice" style={{ fontSize: 18, maxWidth: 520 }}>
              « Ma liste de cette année, avec amour 🎄 »
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', flexShrink: 0 }}>
            <button className="btn btn-outline">
              <TomlIcon name="share" size={14} />
              Partager
            </button>
            <button className="btn btn-ghost" style={{
              background: 'var(--t-paper)', border: '1px solid var(--t-line)',
            }}>
              <TomlIcon name="menu" size={14} />
              Modifier
            </button>
            <button className="btn btn-primary btn-stamp">
              <TomlIcon name="plus" size={14} />
              Ajouter un article
            </button>
          </div>
        </div>

        {/* Filter bar */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap',
          paddingBottom: 18, borderBottom: '1px solid var(--t-line)', marginBottom: 24,
        }}>
          <span className="chip chip-active">Tout (12)</span>
          <span className="chip">Disponibles (8)</span>
          <span className="chip">
            <TomlStars value={3} size={9} />
            Priorité 3★ (3)
          </span>
          <span className="chip">&lt; 50 €</span>
          <span className="chip">Réservés (2)</span>
          <div style={{ flex: 1 }}></div>
          <div style={{
            display: 'flex', gap: 2, padding: 3,
            background: 'var(--t-paper)', borderRadius: 999,
            border: '1px solid var(--t-line)',
          }}>
            <button className="btn btn-ghost btn-sm" style={{
              padding: '4px 12px', background: 'transparent', color: 'var(--t-ink-3)',
            }}>
              <TomlIcon name="grid" size={13} />
              Grille
            </button>
            <button className="btn btn-sm" style={{
              padding: '4px 12px', background: 'var(--t-ink)', color: 'var(--t-bg)',
              border: '1.5px solid var(--t-ink)',
            }}>
              <TomlIcon name="rows" size={13} />
              Masonry
            </button>
            <button className="btn btn-ghost btn-sm" style={{
              padding: '4px 12px', background: 'transparent', color: 'var(--t-ink-3)',
            }}>
              <TomlIcon name="list" size={13} />
              Liste
            </button>
          </div>
          <span className="chip">
            <TomlIcon name="filter" size={11} />
            Tri : Priorité ↓
          </span>
        </div>

        {/* Masonry */}
        <div style={{ columnCount: 3, columnGap: 18 }}>
          {items.map((it, i) => <HDWishlistItemCard key={i} {...it} />)}
        </div>
      </div>
    </HDShell>
  );
};

window.HDWishlist = HDWishlist;
