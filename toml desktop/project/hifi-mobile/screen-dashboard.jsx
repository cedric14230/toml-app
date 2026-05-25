// Toml Hi-fi Mobile — Dashboard (Mes wishlists)
// Vignette WhatsApp + cartes wishlist en 1 colonne

// WhatsApp glyph SVG (le DS n'en a pas)
const WhatsAppGlyph = ({ size = 22, color = '#fff' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <path d="M17.5 14.4c-.3-.1-1.6-.8-1.9-.9-.3-.1-.5-.1-.7.1-.2.3-.8.9-1 1.1-.2.2-.4.2-.7.1-.3-.2-1.2-.5-2.3-1.4-.8-.8-1.4-1.7-1.6-2-.2-.3 0-.5.1-.6.1-.1.3-.4.4-.5.1-.2.2-.3.3-.5.1-.2 0-.4 0-.5 0-.1-.7-1.7-1-2.3-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4s-1 1-1 2.5.7 2.8.7 3c.1.2 1.5 2.4 3.7 3.4.5.2.9.3 1.2.4.5.2 1 .1 1.4.1.4-.1 1.3-.5 1.5-1 .2-.6.2-1 .1-1.1-.1-.2-.3-.3-.6-.4zM12 2C6.5 2 2 6.5 2 12c0 1.7.5 3.4 1.3 4.8L2 22l5.3-1.4c1.4.8 3 1.2 4.7 1.2 5.5 0 10-4.5 10-10S17.5 2 12 2zm0 18c-1.5 0-3-.4-4.3-1.1l-.3-.2-3.1.8.8-3-.2-.3C4.4 15 4 13.5 4 12c0-4.4 3.6-8 8-8s8 3.6 8 8-3.6 8-8 8z"/>
  </svg>
);

const HMWhatsAppCard = ({ onDismiss }) => (
  <div className="card" style={{
    margin: '14px 18px 4px',
    padding: 14,
    display: 'flex', gap: 12, alignItems: 'flex-start',
    position: 'relative',
  }}>
    {/* Icône WhatsApp en pastille verte */}
    <div style={{
      width: 44, height: 44, borderRadius: 999,
      background: '#25D366',
      border: '1.5px solid var(--t-ink)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      flexShrink: 0,
    }}>
      <WhatsAppGlyph size={22} />
    </div>

    <div style={{ flex: 1, minWidth: 0, paddingRight: 12 }}>
      <div style={{
        fontFamily: 'var(--t-font-display)', fontWeight: 700,
        fontSize: 15, marginBottom: 3, letterSpacing: '-0.01em',
        lineHeight: 1.2,
      }}>
        Ajoute en 2 secondes <span style={{
          background: '#f5c948',
          padding: '0 4px', borderRadius: 4,
          fontStyle: 'italic', fontWeight: 600,
        }}>via WhatsApp</span>
      </div>
      <div style={{
        fontFamily: 'var(--t-font-ui)', fontWeight: 500,
        fontSize: 12.5, color: 'var(--t-ink-2)',
        lineHeight: 1.4, marginBottom: 10,
      }}>
        Envoie un lien produit à Toml sur WhatsApp → il apparait direct dans ta wishlist.
      </div>
      <button
        className="btn btn-stamp btn-sm"
        style={{
          background: '#25D366', color: '#fff',
          borderColor: 'var(--t-ink)',
        }}
      >
        <WhatsAppGlyph size={14} color="#fff" />
        Connecter WhatsApp
      </button>
    </div>

    {/* Bouton fermer */}
    <button
      onClick={onDismiss}
      aria-label="Masquer"
      style={{
        position: 'absolute', top: 8, right: 10,
        width: 28, height: 28, borderRadius: 999,
        background: 'transparent', border: 'none',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: 'var(--t-ink-3)', cursor: 'pointer', padding: 0,
      }}
    >
      <TomlIcon name="x" size={16} />
    </button>
  </div>
);

const HMDashboard = ({ whatsappConnected = false }) => {
  const lists = [
    { t: 'Noël 2026', n: 12, vis: 'Amis', icon: 'friends', latest: '5 ajouts cette semaine', tone: 1 },
    { t: 'Ma chambre idéale', n: 7, vis: 'Publique', icon: 'eye', latest: 'Léa a réagi à 2 articles', tone: 3 },
    { t: 'Anniversaire', n: 4, vis: 'Privée', icon: 'lock', latest: '14 juin — perso', tone: 4 },
  ];

  return (
    <HMShell active="lists">
      <HMTopBar
        left={<HMLogo size={20} />}
        right={
          <>
            <button className="btn btn-ghost" style={{
              width: 38, height: 38, padding: 0, borderRadius: 999,
              background: 'var(--t-paper)', border: '1px solid var(--t-line)',
            }}>
              <TomlIcon name="bell" size={18} />
            </button>
            <TomlAvatar initial="C" tone={5} size="sm" />
          </>
        }
      />

      {!whatsappConnected && <HMWhatsAppCard />}

      {/* Header section */}
      <div style={{
        padding: '20px 18px 14px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end',
      }}>
        <div>
          <div className="label" style={{ marginBottom: 4 }}>Tableau de bord</div>
          <h1 className="display-2" style={{ fontSize: 28 }}>Mes wishlists</h1>
        </div>
        <button className="btn btn-primary btn-stamp btn-sm">
          <TomlIcon name="plus" size={14} />
          Créer
        </button>
      </div>

      {/* Wishlist cards */}
      <div style={{ padding: '0 18px 24px', display: 'flex', flexDirection: 'column', gap: 14 }}>
        {lists.map((w, i) => (
          <div key={i} className="card">
            <div className={`img img-${w.tone}`} style={{ height: 130, position: 'relative' }}>
              <span className="chip" style={{
                position: 'absolute', top: 10, right: 10,
                background: 'rgba(255,255,255,0.92)',
                backdropFilter: 'blur(4px)',
                fontSize: 11,
              }}>
                <TomlIcon name={w.icon} size={11} />
                {w.vis}
              </span>
            </div>
            <div style={{ padding: '14px 16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                <div className="display-2" style={{ fontSize: 18 }}>{w.t}</div>
                <div style={{ fontSize: 13, color: 'var(--t-ink-2)', fontWeight: 600, flexShrink: 0, marginLeft: 8 }}>
                  {w.n} articles
                </div>
              </div>
              <div style={{
                fontSize: 12, color: 'var(--t-rose)', fontWeight: 600,
              }}>
                {w.latest}
              </div>
            </div>
          </div>
        ))}

        {/* Carte créer dashed */}
        <button style={{
          background: 'transparent',
          border: '1.5px dashed var(--t-ink-3)',
          borderRadius: 'var(--t-r-lg)',
          padding: '22px 16px',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          color: 'var(--t-ink-2)', cursor: 'pointer',
          fontFamily: 'var(--t-font-ui)', fontWeight: 600, fontSize: 14,
        }}>
          <TomlIcon name="plus" size={18} />
          Créer une nouvelle wishlist
        </button>
      </div>
    </HMShell>
  );
};

Object.assign(window, { HMDashboard, HMWhatsAppCard, WhatsAppGlyph });
