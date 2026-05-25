// Toml DS — Section 5 : Alternatives au manuscrit
// Suite au feedback : remplacer Caveat (imitation d'écriture) par des
// traitements typographiques honnêtes qui gardent la chaleur sans le cliché.

const SVoiceAlternatives = () => {
  // Fonts utilisées dans les variantes
  // Newsreader italic = serif éditorial chaud
  // IBM Plex Mono italic = note tapée
  // Sora italic = même famille display
  // Pas de nouvelle famille pour D : on retire l'inline, on structure

  const fontImports = `@import url('https://fonts.googleapis.com/css2?family=Newsreader:ital,wght@1,400;1,500;1,600&family=IBM+Plex+Mono:ital,wght@0,400;0,500;1,400;1,500&display=swap');`;

  const variants = [
    {
      id: 'A',
      name: 'Italique éditorial',
      font: 'Newsreader, serif',
      style: { fontStyle: 'italic', fontWeight: 500 },
      tagline: 'Un serif italique. Référence aux marginalia & dédicaces de livres.',
      pros: ['Reste chaleureux & personnel', 'Famille typographique honnête (vraie italique, pas mimée)', 'Contraste fort avec Inter/Sora sans-serif'],
      cons: ['Demande une 3e famille (Newsreader)', 'Moins joueur, plus posé'],
    },
    {
      id: 'B',
      name: 'Mono italique',
      font: 'IBM Plex Mono, monospace',
      style: { fontStyle: 'italic', fontWeight: 400 },
      tagline: 'Monospace italique. La note qu\'on tape en marge, assumée digitale.',
      pros: ['Honnête : c\'est tapé, ça se voit', 'Petit clin d\'œil au bookmarklet / dev', 'Très distinctif'],
      cons: ['Demande une 3e famille (Plex Mono)', 'Peut sembler froid si mal dosé'],
    },
    {
      id: 'C',
      name: 'Sora italique colorée',
      font: 'Sora, sans-serif',
      style: { fontStyle: 'italic', fontWeight: 500 },
      tagline: 'Même famille display, juste en italique rose. Zéro nouvelle police.',
      pros: ['Aucune nouvelle famille à charger', 'Cohésion typographique maximale', 'Repose sur la couleur rose pour signaler "personnel"'],
      cons: ['Moins de contraste — peut se fondre dans le reste', 'Repose lourdement sur la couleur'],
    },
    {
      id: 'D',
      name: 'Pas de voix typo — bloc structuré',
      font: 'Inter, sans-serif',
      style: { fontWeight: 500 },
      tagline: 'On retire l\'inline « ». La note devient un bloc avec auteur, avatar, contexte.',
      pros: ['Aucune ambigüité : c\'est de l\'UI', 'Réutilisable pour notes longues', 'Pas de risque "kitsch"'],
      cons: ['Plus de place visuelle', 'Perd la légèreté du clin d\'œil inline'],
    },
  ];

  // Mini-sticker pour chaque variante — réutilise les classes mais override la police
  const VariantSticker = ({ v, children, variant }) => (
    <span
      className={`sticker ${variant ? 'sticker-' + variant : ''}`}
      style={{
        fontFamily: v.font, ...v.style,
        // sticker par défaut a transform rotate(-3), on garde
      }}
    >
      {children}
    </span>
  );

  const VariantNote = ({ v, children, color = 'var(--t-rose)' }) => {
    if (v.id === 'D') {
      // bloc structuré, pas d'inline
      return (
        <div style={{
          display: 'flex', gap: 8, alignItems: 'flex-start',
          background: 'var(--t-rose-soft)',
          border: '1px solid var(--t-rose)',
          padding: '8px 10px', borderRadius: 10,
          fontSize: 12, color: 'var(--t-ink)',
          maxWidth: 260,
        }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--t-rose-d)', letterSpacing: '0.06em', textTransform: 'uppercase', marginRight: 2 }}>Note de Camille</span>
          <span style={{ fontWeight: 500 }}>{children}</span>
        </div>
      );
    }
    return (
      <span style={{
        fontFamily: v.font, ...v.style,
        color,
        fontSize: 17,
      }}>
        « {children} »
      </span>
    );
  };

  // Mini-card produit pour montrer en contexte
  const ProductCard = ({ v }) => (
    <div className="card" style={{ position: 'relative', boxShadow: '3px 3px 0 var(--t-ink)' }}>
      <div className="img img-1" style={{ height: 130, position: 'relative' }}>
        <VariantSticker v={v} style={{ position: 'absolute', top: 10, left: 10 }}>
          {v.id === 'D' ? 'Réservé' : 'Réservé !'}
        </VariantSticker>
      </div>
      <div style={{ padding: 12 }}>
        <div className="label" style={{ color: 'var(--t-rose)', marginBottom: 2 }}>Sézane</div>
        <div className="display-2" style={{ fontSize: 15, marginBottom: 4 }}>Robe Liliana</div>
        <div style={{ marginBottom: 8 }}>
          <VariantNote v={v}>En taille S s'il te plaît</VariantNote>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 13, fontWeight: 700 }}>
          <span>89 €</span>
          <span style={{ display: 'flex', gap: 2 }}>{[1, 2, 3].map(i => <span key={i} className="star" />)}</span>
        </div>
      </div>
    </div>
  );

  return (
    <TBoard>
      <style>{fontImports}</style>
      <TSection title="Notes personnelles — alternatives" eyebrow="Identité 02 · Voix">
        <p style={{ fontSize: 14, color: 'var(--t-ink-2)', maxWidth: 700, marginTop: 0, marginBottom: 8 }}>
          Le traitement actuel (police manuscrite Caveat) <strong>imite</strong> l'écriture à la main — c'est un cliché « chaleureux » très répandu et un peu daté. Voici 4 alternatives qui gardent la chaleur en assumant leur typographie.
        </p>
        <p style={{ fontSize: 13, color: 'var(--t-ink-3)', maxWidth: 700, marginBottom: 28, fontStyle: 'italic' }}>
          Comparaison sur 3 contextes : sticker rotation, note inline sur un article, citation isolée.
        </p>

        {/* === Rappel : l'existant === */}
        <div className="label" style={{ marginBottom: 10 }}>État actuel · à remplacer</div>
        <div className="card-soft" style={{ padding: 18, marginBottom: 32, background: 'var(--t-paper)', borderColor: 'var(--t-danger)', borderWidth: 1, borderStyle: 'dashed' }}>
          <div style={{ display: 'flex', gap: 24, alignItems: 'center', flexWrap: 'wrap' }}>
            <span className="sticker">Réservé !</span>
            <span className="hand" style={{ fontSize: 22, color: 'var(--t-rose)' }}>« En taille S s'il te plaît »</span>
            <div style={{ flex: 1, minWidth: 220, fontSize: 12, color: 'var(--t-ink-2)' }}>
              Caveat italique. Marque trop fortement « j'essaie d'avoir l'air manuscrit ». À retirer du système.
            </div>
          </div>
        </div>

        {/* === Tableau récap des 4 variantes === */}
        <div className="label" style={{ marginBottom: 12 }}>4 directions proposées</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 20, marginBottom: 32 }}>
          {variants.map(v => (
            <div key={v.id} className="card-soft" style={{ padding: 0, overflow: 'hidden', background: 'var(--t-paper)' }}>
              {/* en-tête */}
              <div style={{
                padding: '12px 16px',
                background: 'var(--t-bg)',
                borderBottom: '1px solid var(--t-line)',
                display: 'flex', alignItems: 'center', gap: 10,
              }}>
                <div style={{
                  width: 26, height: 26, borderRadius: 999,
                  background: 'var(--t-ink)', color: 'var(--t-bg)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: 'var(--t-font-display)', fontWeight: 700, fontSize: 13,
                }}>{v.id}</div>
                <div style={{ flex: 1 }}>
                  <div className="display-2" style={{ fontSize: 15 }}>{v.name}</div>
                  <div style={{ fontSize: 11, color: 'var(--t-ink-3)' }}>{v.tagline}</div>
                </div>
              </div>

              {/* contexte 1 : sticker + note inline (ou bloc pour D) */}
              <div style={{ padding: 16, background: 'var(--t-bg)', borderBottom: '1px solid var(--t-line)' }}>
                <div style={{ fontSize: 10, color: 'var(--t-ink-3)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 10 }}>1 · Inline</div>
                <div style={{ display: 'flex', gap: 14, alignItems: 'center', flexWrap: 'wrap' }}>
                  <VariantSticker v={v}>{v.id === 'D' ? 'Réservé' : 'Réservé !'}</VariantSticker>
                  <VariantNote v={v}>En taille S s'il te plaît</VariantNote>
                </div>
              </div>

              {/* contexte 2 : carte produit */}
              <div style={{ padding: 16, background: 'var(--t-paper)' }}>
                <div style={{ fontSize: 10, color: 'var(--t-ink-3)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 10 }}>2 · En contexte produit</div>
                <ProductCard v={v} />
              </div>

              {/* pros / cons */}
              <div style={{ padding: 16, background: 'var(--t-surface)', borderTop: '1px solid var(--t-line)' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--t-success)', marginBottom: 4 }}>✓ Forces</div>
                    <ul style={{ margin: 0, paddingLeft: 14, fontSize: 12, color: 'var(--t-ink-2)', lineHeight: 1.5 }}>
                      {v.pros.map((p, i) => <li key={i}>{p}</li>)}
                    </ul>
                  </div>
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--t-danger)', marginBottom: 4 }}>✗ Tensions</div>
                    <ul style={{ margin: 0, paddingLeft: 14, fontSize: 12, color: 'var(--t-ink-2)', lineHeight: 1.5 }}>
                      {v.cons.map((p, i) => <li key={i}>{p}</li>)}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* === Comparaison côte à côte sur citation longue === */}
        <div className="label" style={{ marginBottom: 12 }}>Citation longue · même contenu, 4 traitements</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16, marginBottom: 28 }}>
          {variants.map(v => (
            <div key={v.id} className="card-soft" style={{ padding: 22, background: 'var(--t-paper)' }}>
              <div style={{ fontSize: 10, color: 'var(--t-ink-3)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 10 }}>
                {v.id} · {v.name}
              </div>
              {v.id === 'D' ? (
                <div style={{
                  background: 'var(--t-rose-soft)',
                  border: '1px solid var(--t-rose)',
                  padding: '12px 14px', borderRadius: 12,
                }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--t-rose-d)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 4 }}>Note de Camille</div>
                  <div style={{ fontSize: 14, color: 'var(--t-ink)', lineHeight: 1.45 }}>
                    Si quelqu'un veut me l'offrir, je le mets sur ma table de chevet — j'en rêve depuis longtemps.
                  </div>
                </div>
              ) : (
                <div style={{
                  fontFamily: v.font, ...v.style,
                  fontSize: 18, color: 'var(--t-rose)', lineHeight: 1.45,
                }}>
                  « Si quelqu'un veut me l'offrir, je le mets sur ma table de chevet — j'en rêve depuis longtemps. »
                </div>
              )}
            </div>
          ))}
        </div>

        {/* === Recommandation === */}
        <div style={{
          padding: '20px 24px',
          background: 'linear-gradient(95deg, var(--t-rose-soft), var(--t-mustard-soft))',
          borderRadius: 14, border: '1.5px solid var(--t-ink)',
          boxShadow: '3px 3px 0 var(--t-ink)',
        }}>
          <div className="label" style={{ marginBottom: 6 }}>Recommandation</div>
          <div className="display-2" style={{ fontSize: 18, marginBottom: 8 }}>
            Direction <strong>A — Italique éditorial (Newsreader)</strong> ou <strong>C — Sora italique</strong>
          </div>
          <div style={{ fontSize: 13.5, color: 'var(--t-ink)', lineHeight: 1.55 }}>
            <strong>A</strong> si on veut un vrai contraste typographique et une référence éditoriale (le carnet, la dédicace).
            <strong> C</strong> si on veut tenir un système économe (2 familles) — la couleur rose porte alors le signal « note personnelle ».
            <br/>
            <strong>D</strong> reste utile pour les notes longues (≥ 2 lignes), même si on garde A ou C en inline court.
          </div>
        </div>
      </TSection>
    </TBoard>
  );
};

Object.assign(window, { SVoiceAlternatives });
