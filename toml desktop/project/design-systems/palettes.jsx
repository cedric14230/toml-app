// 8 palettes Snap Family — sans crème

const PalettePreview = ({ id, name, mood, colors }) => (
  <div className={`pal pal-${id}`}>
    <div className="label" style={{ marginBottom: 6, opacity: 0.7 }}>Palette {id}</div>
    <h1 className="display" style={{ fontSize: 30, marginBottom: 4 }}>{name}</h1>
    <p style={{ fontSize: 13, color: 'var(--ink)', opacity: 0.7, marginBottom: 22, marginTop: 0 }}>{mood}</p>

    <div className="swatch-row">
      {colors.map(([n, c, hex], i) => (
        <div key={i}>
          <div className="sw" style={{ background: c, border: '1.5px solid var(--ink)' }}></div>
          <div className="sw-label">{n}</div>
          <div className="sw-hex">{hex}</div>
        </div>
      ))}
    </div>

    <div className="preview" style={{ background: 'var(--bg)', border: '1.5px solid var(--ink)' }}>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 14 }}>
        <span className="chip" style={{ background: 'var(--ink)', color: 'var(--bg)' }}>Tout</span>
        <span className="chip" style={{ background: 'var(--c1l)' }}>★ Priorité</span>
        <span className="chip" style={{ background: 'var(--bg)' }}>Mode</span>
        <div style={{ flex: 1 }}></div>
        <span className="sticker" style={{ background: 'var(--c1)', color: 'var(--ink)' }}>Réservé !</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 14 }}>
        <div className="card-mini" style={{ background: 'var(--bg)' }}>
          <div style={{ height: 70, background: `linear-gradient(140deg, var(--c3l), var(--c3))` }}></div>
          <div style={{ padding: 8 }}>
            <div style={{ fontSize: 9, fontWeight: 700, color: 'var(--c3)', textTransform: 'uppercase' }}>par Léa</div>
            <div className="display" style={{ fontSize: 12 }}>Vase</div>
            <div style={{ fontSize: 11, fontWeight: 600 }}>45 €</div>
          </div>
        </div>
        <div className="card-mini" style={{ background: 'var(--bg)' }}>
          <div style={{ height: 70, background: `linear-gradient(140deg, var(--c2l), var(--c2))` }}></div>
          <div style={{ padding: 8 }}>
            <div style={{ fontSize: 9, fontWeight: 700, color: 'var(--c2)', textTransform: 'uppercase' }}>Sézane</div>
            <div className="display" style={{ fontSize: 12 }}>Robe</div>
            <div style={{ fontSize: 11, fontWeight: 600 }}>89 €</div>
          </div>
        </div>
        <div className="card-mini" style={{ background: 'var(--bg)' }}>
          <div style={{ height: 70, background: `linear-gradient(140deg, var(--c1l), var(--c1))` }}></div>
          <div style={{ padding: 8 }}>
            <div style={{ fontSize: 9, fontWeight: 700, color: 'var(--c4)', textTransform: 'uppercase' }}>HAY</div>
            <div className="display" style={{ fontSize: 12 }}>Lampe</div>
            <div style={{ fontSize: 11, fontWeight: 600 }}>165 €</div>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <button className="btn" style={{ background: 'var(--ink)', color: 'var(--bg)' }}>Créer ma wishlist</button>
        <button className="btn" style={{ background: 'var(--c1)', color: 'var(--ink)' }}>Réserver 🎁</button>
        <span className="hand" style={{ fontSize: 18, color: 'var(--c3)' }}>« coup de cœur »</span>
      </div>
    </div>
  </div>
);

const palettes = [
  { id: 1, name: 'Blanc cassé · Indigo · Corail', mood: 'Frais et net. Le blanc cassé apporte de la clarté sans froideur ; ambiance "appartement bien rangé".', colors: [
    ['Blanc cassé', '#f4f1ec', '#f4f1ec'], ['Encre', '#1a1a2e', '#1a1a2e'],
    ['Jaune doux', '#f5c948', '#f5c948'], ['Indigo', '#3d4a8c', '#3d4a8c'], ['Corail', '#e87358', '#e87358'],
  ]},
  { id: 2, name: 'Gris perle · Sapin · Brique', mood: 'Élégant, contemporain. Gris perle neutre + accents nature pour un rendu mature et sobre.', colors: [
    ['Gris perle', '#ebe8e3', '#ebe8e3'], ['Encre', '#1f2418', '#1f2418'],
    ['Miel', '#e8b942', '#e8b942'], ['Sapin', '#2e5945', '#2e5945'], ['Brique', '#c75a3c', '#c75a3c'],
  ]},
  { id: 3, name: 'Bleu glacé · Moutarde · Rose terre', mood: 'Édito magazine. Fond bleu très pâle qui donne une vibe scandinave moderne.', colors: [
    ['Bleu glacé', '#e6ecf2', '#e6ecf2'], ['Encre', '#1a1f2e', '#1a1f2e'],
    ['Moutarde', '#d4a73c', '#d4a73c'], ['Bleu denim', '#5a6f9c', '#5a6f9c'], ['Rose terre', '#c47884', '#c47884'],
  ]},
  { id: 4, name: 'Vert tilleul · Terracotta · Sauge', mood: 'Naturel solaire. Tilleul très pâle, vibe jardin du sud, doux mais vivant.', colors: [
    ['Tilleul', '#e8edd8', '#e8edd8'], ['Encre', '#1f2a18', '#1f2a18'],
    ['Soleil', '#f0c068', '#f0c068'], ['Sauge', '#4a7a6c', '#4a7a6c'], ['Terracotta', '#d87858', '#d87858'],
  ]},
  { id: 5, name: 'Lavande · Aubergine · Rose pâle', mood: 'Doux et féminin sans saccharine. Lavande pâle profonde, romantique discret.', colors: [
    ['Lavande', '#ebe6ef', '#ebe6ef'], ['Encre', '#2a1a2a', '#2a1a2a'],
    ['Or', '#d4a040', '#d4a040'], ['Aubergine', '#6b3a5c', '#6b3a5c'], ['Rose pâle', '#d89090', '#d89090'],
  ]},
  { id: 6, name: 'Sable rosé · Denim · Tomate', mood: 'Pop chaleureux. Fond rosé très subtil + denim profond, vibe famille moderne.', colors: [
    ['Sable rosé', '#f1e9e2', '#f1e9e2'], ['Encre', '#1a1f2e', '#1a1f2e'],
    ['Citron', '#f0b840', '#f0b840'], ['Denim', '#3a5878', '#3a5878'], ['Tomate', '#d85842', '#d85842'],
  ]},
  { id: 7, name: 'Gris chaud · Bordeaux · Olive', mood: 'Premium feutré. Gris légèrement chaud, vibe vintage feutré sans côté poussiéreux.', colors: [
    ['Gris chaud', '#e8e3dc', '#e8e3dc'], ['Encre', '#1f1a18', '#1f1a18'],
    ['Camel', '#d8a85c', '#d8a85c'], ['Bordeaux', '#6b1e2e', '#6b1e2e'], ['Olive', '#8a8a3c', '#8a8a3c'],
  ]},
  { id: 8, name: 'Jade pâle · Pétrole · Pêche', mood: 'Sophistiqué apaisant. Jade très pâle qui donne fraîcheur sans froideur.', colors: [
    ['Jade pâle', '#dee8e5', '#dee8e5'], ['Encre', '#1a2424', '#1a2424'],
    ['Miel', '#e8b85c', '#e8b85c'], ['Pétrole', '#1f4a52', '#1f4a52'], ['Pêche', '#e88a6a', '#e88a6a'],
  ]},
];

Object.assign(window, { PalettePreview, palettes });
