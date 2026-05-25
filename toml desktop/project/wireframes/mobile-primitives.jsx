// Toml Wireframes — Mobile primitives (low-fi B&W)
// Réutilisent les classes .sk-* + .browser de wireframes/styles.css
// Largeur cible : 390 (iPhone std) — contenu, hors bezel

// === Status bar minimaliste pour wireframe ===
const MStatusBar = () => (
  <div style={{
    height: 28, padding: '6px 22px',
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    fontFamily: 'var(--sketch-font)', fontWeight: 700, fontSize: 13,
    background: 'var(--paper)',
  }}>
    <span>9:41</span>
    <span style={{ display: 'inline-flex', gap: 5, alignItems: 'center', fontSize: 12 }}>
      <span>•••</span>
      <span>◐</span>
      <span style={{
        border: '1.2px solid var(--ink)', borderRadius: 3,
        padding: '0 4px', fontSize: 9,
      }}>87</span>
    </span>
  </div>
);

// === Top app bar (logo + actions) ===
const MTopBar = ({ title, back = false, right = null, sticky = false }) => (
  <div style={{
    position: sticky ? 'sticky' : 'static', top: 0, zIndex: 5,
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '10px 16px', borderBottom: '1.5px solid var(--ink)',
    background: 'var(--paper)',
    gap: 10,
  }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
      {back && <span style={{ fontSize: 22, fontFamily: 'var(--sketch-font)' }}>‹</span>}
      {title
        ? <span style={{ fontFamily: 'var(--sketch-font)', fontWeight: 700, fontSize: 16, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{title}</span>
        : <Logo size={17} />}
    </div>
    <div style={{ display: 'flex', gap: 14, alignItems: 'center', flexShrink: 0 }}>
      {right || (
        <>
          <span style={{ fontSize: 16 }}>🔍</span>
          <span style={{ fontSize: 16 }}>🔔</span>
        </>
      )}
    </div>
  </div>
);

// === Tab bar bas — toujours visible ===
const MTabBar = ({ active = 'lists' }) => {
  const items = [
    { id: 'feed',    label: 'Feed',     icon: '⌂' },
    { id: 'lists',   label: 'Mes listes', icon: '☰' },
    { id: 'add',     label: '',         icon: '+', cta: true },
    { id: 'friends', label: 'Amis',     icon: '◎' },
    { id: 'profile', label: 'Profil',   icon: '◉' },
  ];
  return (
    <div style={{
      position: 'absolute', bottom: 0, left: 0, right: 0,
      borderTop: '1.5px solid var(--ink)',
      background: 'var(--paper)',
      padding: '8px 8px 22px',
      display: 'flex', justifyContent: 'space-around', alignItems: 'center',
      zIndex: 10,
    }}>
      {items.map(it => {
        if (it.cta) {
          return (
            <div key={it.id} style={{
              width: 48, height: 48, borderRadius: 999,
              background: 'var(--ink)', color: 'var(--paper)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 26, fontFamily: 'var(--sketch-font)', fontWeight: 700,
              boxShadow: '2px 2px 0 var(--ink-3)',
              marginTop: -16,
            }}>{it.icon}</div>
          );
        }
        const isActive = it.id === active;
        return (
          <div key={it.id} style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
            color: isActive ? 'var(--ink)' : 'var(--ink-4)',
            fontFamily: 'var(--sketch-font)', fontWeight: 600,
          }}>
            <span style={{ fontSize: 19, lineHeight: 1 }}>{it.icon}</span>
            <span style={{ fontSize: 10 }}>{it.label}</span>
            {isActive && <span style={{
              width: 16, height: 2, background: 'var(--ink)',
              borderRadius: 2, marginTop: 1,
            }} />}
          </div>
        );
      })}
    </div>
  );
};

// === Mobile shell ===
// Used inside <DCArtboard> at 390×844
const MobileShell = ({ children, statusBar = true, withTabBar = true, active = 'lists' }) => (
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
    {statusBar && <MStatusBar />}
    <div style={{
      position: 'absolute',
      top: statusBar ? 28 : 0, left: 0, right: 0,
      bottom: withTabBar ? 76 : 0,
      overflow: 'auto',
      background: 'var(--paper)',
    }}>
      {children}
    </div>
    {withTabBar && <MTabBar active={active} />}
  </div>
);

Object.assign(window, { MStatusBar, MTopBar, MTabBar, MobileShell });
