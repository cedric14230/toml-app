// Toml DS — Section 4 : Utilisation dans d'autres projets

const SUsage = () => {
  const CodeBlock = ({ children, lang }) => (
    <pre style={{
      background: 'var(--t-ink)', color: '#e6ecf2',
      borderRadius: 14, padding: '16px 18px',
      fontFamily: 'ui-monospace, Menlo, monospace', fontSize: 12.5,
      lineHeight: 1.55, margin: 0, overflow: 'auto',
      border: '1.5px solid var(--t-ink)', boxShadow: '3px 3px 0 var(--t-rose)',
      maxWidth: '100%', whiteSpace: 'pre',
    }}>
      {lang && <div style={{ color: 'var(--t-mustard)', fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>{lang}</div>}
      <code>{children}</code>
    </pre>
  );

  return (
    <TBoard>
      <TSection title="Utilisation dans un autre projet" eyebrow="Package · v1.0">
        <p style={{ fontSize: 14, color: 'var(--t-ink-2)', maxWidth: 680, marginTop: 0, marginBottom: 28 }}>
          Le design system est conditionné en 3 fichiers à copier dans n'importe quel projet Toml : un CSS de tokens, un fichier d'icônes, et un kit React. Tous les composants partagent le même scope <code style={{ background: 'var(--t-bg-2)', padding: '1px 6px', borderRadius: 4, fontFamily: 'monospace', fontSize: 12 }}>.toml-ds</code>.
        </p>

        {/* === 1. Contenu du package === */}
        <div className="label" style={{ marginBottom: 12 }}>01 · Ce qu'il faut copier</div>
        <div className="card-soft" style={{ padding: 0, overflow: 'hidden', marginBottom: 32 }}>
          {[
            { f: 'toml-ds/toml.css',         w: '~10 ko', d: 'Tokens (couleurs, typo, radii, ombres) + classes utilitaires. Scope .toml-ds.' },
            { f: 'toml-ds/toml-icons.jsx',   w: '~4 ko',  d: '27 icônes line · <TomlIcon name=… size=… />' },
            { f: 'toml-ds/toml-kit.jsx',     w: '~7 ko',  d: 'Composants React : Button, Card, Chip, Sticker, Avatar, …' },
            { f: 'toml-ds/README.md',        w: '–',      d: 'Doc complète : tokens, API composants, dos & don\'ts.' },
            { f: 'toml-ds/example.html',     w: '–',      d: 'Starter HTML minimal — copier comme point de départ.' },
          ].map((row, i) => (
            <div key={i} style={{
              display: 'grid', gridTemplateColumns: '260px 80px 1fr',
              alignItems: 'center', padding: '12px 18px',
              borderBottom: i < 4 ? '1px solid var(--t-line)' : 'none',
              background: 'var(--t-paper)',
            }}>
              <code style={{ fontSize: 12.5, color: 'var(--t-denim-d)', fontFamily: 'ui-monospace, Menlo, monospace' }}>{row.f}</code>
              <div style={{ fontSize: 11, color: 'var(--t-ink-3)', fontFamily: 'monospace' }}>{row.w}</div>
              <div style={{ fontSize: 13, color: 'var(--t-ink-2)' }}>{row.d}</div>
            </div>
          ))}
        </div>

        {/* === 2. Import via l'agent === */}
        <div className="label" style={{ marginBottom: 12 }}>02 · Importer dans un projet Toml (via l'agent)</div>
        <div style={{ marginBottom: 32 }}>
          <div className="card-soft" style={{ padding: 18, marginBottom: 14, background: 'var(--t-paper)' }}>
            <div style={{ fontSize: 13.5, color: 'var(--t-ink)', lineHeight: 1.55 }}>
              Dans le nouveau projet, demande à l'agent :
            </div>
            <div className="hand" style={{ fontSize: 22, color: 'var(--t-rose)', marginTop: 6, marginBottom: 8, lineHeight: 1.3 }}>
              « Copie le dossier <code style={{ fontFamily: 'monospace', fontSize: 14, color: 'var(--t-denim-d)', background: 'var(--t-bg)', padding: '1px 6px', borderRadius: 4 }}>/projects/019df861-3506-7e8c-8984-aae5a113556a/toml-ds/</code> dans <code style={{ fontFamily: 'monospace', fontSize: 14, color: 'var(--t-denim-d)', background: 'var(--t-bg)', padding: '1px 6px', borderRadius: 4 }}>toml-ds/</code> »
            </div>
            <div style={{ fontSize: 12, color: 'var(--t-ink-3)' }}>
              L'agent a accès en lecture aux projets que tu as ouverts. Une copie cross-projet récupère tout en un coup.
            </div>
          </div>
        </div>

        {/* === 3. Snippet HTML === */}
        <div className="label" style={{ marginBottom: 12 }}>03 · Le squelette HTML</div>
        <CodeBlock lang="index.html">{`<!doctype html>
<html lang="fr">
<head>
  <meta charset="utf-8" />
  <link rel="stylesheet" href="toml-ds/toml.css" />

  <script src="https://unpkg.com/react@18.3.1/umd/react.development.js"></script>
  <script src="https://unpkg.com/react-dom@18.3.1/umd/react-dom.development.js"></script>
  <script src="https://unpkg.com/@babel/standalone@7.29.0/babel.min.js"></script>
</head>
<body>
  <div id="root"></div>

  <!-- icons AVANT kit (kit utilise TomlIcon) -->
  <script type="text/babel" src="toml-ds/toml-icons.jsx"></script>
  <script type="text/babel" src="toml-ds/toml-kit.jsx"></script>

  <script type="text/babel">
    function App() {
      return (
        <TomlRoot style={{ padding: 40, minHeight: '100vh' }}>
          <h1 className="display" style={{ fontSize: 72 }}>Toml.</h1>
          <TomlButton variant="primary" icon="plus">
            Créer ma wishlist
          </TomlButton>
        </TomlRoot>
      );
    }
    ReactDOM.createRoot(document.getElementById('root')).render(<App />);
  </script>
</body>
</html>`}</CodeBlock>

        <div style={{ height: 32 }} />

        {/* === 4. API rapide === */}
        <div className="label" style={{ marginBottom: 12 }}>04 · API rapide</div>
        <div className="t-grid-2" style={{ marginBottom: 32 }}>
          <CodeBlock lang="composants">{`<TomlRoot>            wrapper obligatoire
<TomlButton>          variant primary|accent|rose
                      |outline|ghost · size sm|lg
<TomlIconButton>      rond, icône seule
<TomlInput>           champ texte (soft = bord léger)
<TomlTextarea>        multi-lignes
<TomlChip>            variant mustard|rose|denim
                      · active
<TomlBadge>           compteur ou dot
<TomlSticker>         manuscrit tilté
<TomlHand>            texte Caveat
<TomlCard>            variant stamp|soft|flat
<TomlAvatar>          initial · size xs..xl · tone 1-5
<TomlAvatarStack>     pile +N
<TomlStars>           priorité 0-3
<TomlDot>             available|reserved|gifted
<TomlImage>           placeholder (tone 1-6)
<TomlLabel>           eyebrow uppercase
<TomlToast>           notif succès
<TomlGiverBanner>     bandeau gift-giver
<TomlBookmarklet>     "+ Ajouter à Toml"
<TomlIcon>            27 icônes line`}</CodeBlock>

          <CodeBlock lang="tokens CSS">{`/* Couleurs */
var(--t-bg)        #e6ecf2  fond
var(--t-paper)     #ffffff  cards
var(--t-ink)       #1a1f2e  texte
var(--t-denim)     #5a6f9c
var(--t-rose)      #c47884
var(--t-mustard)   #d4a73c
var(--t-success)   #4a8a6e

/* Typo */
var(--t-font-display)  Sora
var(--t-font-ui)       Inter
var(--t-font-hand)     Sora italic (notes)

/* Radii */
var(--t-r-xs|sm|md|lg|xl|pill)

/* Spacing — base 4 */
var(--t-s-1) … var(--t-s-16)

/* Shadows */
var(--t-shadow-stamp)     3px noir
var(--t-shadow-stamp-lg)  5px noir
var(--t-shadow-sm)        doux`}</CodeBlock>
        </div>

        {/* === 5. Exemple live === */}
        <div className="label" style={{ marginBottom: 12 }}>05 · Le résultat</div>
        <div style={{
          background: 'var(--t-bg)', padding: 24,
          borderRadius: 18, border: '1.5px solid var(--t-ink)',
          boxShadow: 'var(--t-shadow-stamp)',
        }}>
          <h2 className="display" style={{ fontSize: 44, margin: 0, marginBottom: 6 }}>Bonjour Toml.</h2>
          <div style={{ fontSize: 13, color: 'var(--t-ink-2)', marginBottom: 18 }}>Ce bloc est rendu uniquement avec des composants du kit.</div>

          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center', marginBottom: 18 }}>
            <button className="btn btn-primary btn-stamp">
              <Icon name="plus" size={14} /> Créer
            </button>
            <button className="btn btn-accent btn-stamp">
              <Icon name="gift" size={14} /> Réserver
            </button>
            <button className="btn btn-outline">Découvrir</button>
            <span className="chip chip-active">Tout</span>
            <span className="chip chip-mustard">★ Priorité</span>
            <span className="sticker">Réservé !</span>
            <span className="hand" style={{ fontSize: 20, color: 'var(--t-rose)' }}>« coup de cœur »</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14 }}>
            <div className="card" style={{ overflow: 'hidden' }}>
              <div className="img img-1" style={{ height: 90 }}></div>
              <div style={{ padding: 12 }}>
                <div className="label" style={{ color: 'var(--t-rose)', marginBottom: 2 }}>Sézane</div>
                <div className="display-2" style={{ fontSize: 14, marginBottom: 4 }}>Robe Liliana</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, fontWeight: 700 }}>
                  <span>89 €</span>
                  <span style={{ display: 'flex', gap: 2 }}>{[1,2,3].map(i=><span key={i} className="star" />)}</span>
                </div>
              </div>
            </div>
            <div className="card-soft" style={{ padding: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                <div className="avatar avatar-sm avatar-2">L</div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 13 }}>Léa Martin</div>
                  <div style={{ fontSize: 11, color: 'var(--t-ink-3)' }}>3 wishlists</div>
                </div>
              </div>
              <hr className="divider" style={{ margin: '10px 0' }} />
              <div style={{ display: 'flex', gap: 6, alignItems: 'center', fontSize: 11 }}>
                <span className="dot dot-available" /> Dispo
                <span className="dot dot-reserved" style={{ marginLeft: 8 }} /> Réservé
              </div>
            </div>
            <div className="card-soft" style={{ padding: 14 }}>
              <div className="label" style={{ marginBottom: 8 }}>Inscription</div>
              <input className="input" placeholder="Email" style={{ marginBottom: 8 }} />
              <input className="input" type="password" placeholder="Mot de passe" style={{ marginBottom: 10 }} />
              <button className="btn btn-primary btn-stamp btn-sm" style={{ width: '100%' }}>Continuer</button>
            </div>
          </div>
        </div>

        <div style={{ marginTop: 28, padding: '18px 22px', background: 'linear-gradient(95deg, var(--t-rose-soft), var(--t-mustard-soft))', borderRadius: 14, border: '1.5px solid var(--t-ink)' }}>
          <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 4 }}>Voir aussi</div>
          <div style={{ fontSize: 13, color: 'var(--t-ink-2)' }}>
            <code style={{ fontFamily: 'monospace', background: 'rgba(255,255,255,.6)', padding: '1px 6px', borderRadius: 4 }}>toml-ds/example.html</code>  pour un starter complet ·
            <code style={{ fontFamily: 'monospace', background: 'rgba(255,255,255,.6)', padding: '1px 6px', borderRadius: 4, marginLeft: 6 }}>toml-ds/README.md</code>  pour la doc API détaillée.
          </div>
        </div>
      </TSection>
    </TBoard>
  );
};

Object.assign(window, { SUsage });
