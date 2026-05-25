// Toml Hi-fi Mobile — shell components (status bar, top bar, tab bar)
// Conforme au DS Toml : tokens var(--t-*), Sora/Inter, stamp shadow signature

// === Status bar iOS (clair) ===
const HMStatusBar = () => (
  <div style={{
    height: 44, padding: '14px 24px 0',
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    fontFamily: 'var(--t-font-ui)', fontWeight: 600, fontSize: 15,
    color: 'var(--t-ink)',
    background: 'var(--t-bg)',
    position: 'relative', zIndex: 4,
  }}>
    <span style={{ letterSpacing: '-0.01em' }}>9:41</span>
    <span style={{ display: 'inline-flex', gap: 6, alignItems: 'center' }}>
      {/* Signal */}
      <svg width="18" height="11" viewBox="0 0 18 11" fill="currentColor">
        <rect x="0" y="7" width="3" height="4" rx="0.5"/>
        <rect x="5" y="5" width="3" height="6" rx="0.5"/>
        <rect x="10" y="3" width="3" height="8" rx="0.5"/>
        <rect x="15" y="0" width="3" height="11" rx="0.5"/>
      </svg>
      {/* Wifi */}
      <svg width="16" height="11" viewBox="0 0 16 11" fill="currentColor">
        <path d="M8 3 C 11 3 13 4 14.5 5.5 L 15.7 4.3 C 13.7 2.4 11 1.3 8 1.3 S 2.3 2.4 0.3 4.3 L 1.5 5.5 C 3 4 5 3 8 3 Z"/>
        <path d="M8 6 C 9.5 6 10.7 6.5 11.5 7.3 L 12.7 6.1 C 11.4 4.9 9.8 4.3 8 4.3 S 4.6 4.9 3.3 6.1 L 4.5 7.3 C 5.3 6.5 6.5 6 8 6 Z"/>
        <circle cx="8" cy="9" r="1.4"/>
      </svg>
      {/* Battery */}
      <span style={{ display: 'inline-flex', alignItems: 'center' }}>
        <span style={{
          width: 24, height: 12, border: '1.2px solid var(--t-ink)',
          borderRadius: 3, padding: 1.5, display: 'inline-flex',
        }}>
          <span style={{ width: '85%', background: 'var(--t-ink)', borderRadius: 1.5 }}></span>
        </span>
        <span style={{ width: 1.5, height: 5, background: 'var(--t-ink)', marginLeft: 1, borderRadius: 1 }}></span>
      </span>
    </span>
  </div>
);

// === Logo wordmark TOML ===
const HMLogo = ({ size = 18 }) => (
  <span style={{
    fontFamily: 'var(--t-font-display)', fontWeight: 700,
    fontSize: size, letterSpacing: '0.02em',
    color: 'var(--t-ink)',
  }}>TOML</span>
);

// === Top bar app ===
const HMTopBar = ({ left, right, title, back = false, transparent = false }) => (
  <div style={{
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '12px 18px 14px',
    background: transparent ? 'transparent' : 'var(--t-bg)',
    borderBottom: transparent ? 'none' : '1px solid var(--t-line-soft)',
    gap: 12, minHeight: 56,
  }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0, flex: 1 }}>
      {back && (
        <button className="btn btn-ghost" style={{
          width: 36, height: 36, padding: 0, borderRadius: 999,
          background: 'var(--t-paper)', border: '1px solid var(--t-line)',
        }}>
          <TomlIcon name="arrow" size={16} style={{ transform: 'rotate(180deg)' }} />
        </button>
      )}
      {left || (title ? (
        <div style={{
          fontFamily: 'var(--t-font-display)', fontWeight: 700,
          fontSize: 17, letterSpacing: '-0.01em',
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
        }}>{title}</div>
      ) : <HMLogo size={20} />)}
    </div>
    <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexShrink: 0 }}>
      {right}
    </div>
  </div>
);

// === Tab bar bas ===
const HMTabBar = ({ active = 'lists' }) => {
  const items = [
    { id: 'feed',    label: 'Feed',     icon: 'home' },
    { id: 'lists',   label: 'Mes listes', icon: 'list' },
    { id: 'add',     cta: true },
    { id: 'friends', label: 'Amis',     icon: 'friends' },
    { id: 'profile', label: 'Profil',   icon: 'user' },
  ];
  return (
    <div style={{
      position: 'absolute', bottom: 0, left: 0, right: 0,
      background: 'var(--t-paper)',
      borderTop: '1px solid var(--t-line)',
      padding: '8px 6px 24px',
      display: 'flex', justifyContent: 'space-around', alignItems: 'center',
      zIndex: 10,
    }}>
      {items.map(it => {
        if (it.cta) {
          return (
            <button key={it.id} className="btn btn-primary btn-stamp" style={{
              width: 52, height: 52, padding: 0, borderRadius: 999,
              marginTop: -18,
            }}>
              <TomlIcon name="plus" size={22} />
            </button>
          );
        }
        const isActive = it.id === active;
        return (
          <button key={it.id} style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
            background: 'transparent', border: 'none',
            color: isActive ? 'var(--t-ink)' : 'var(--t-ink-3)',
            padding: '4px 10px', cursor: 'pointer',
          }}>
            <TomlIcon name={it.icon} size={22} stroke={isActive ? 2.2 : 1.8} />
            <span style={{
              fontFamily: 'var(--t-font-ui)',
              fontSize: 10, fontWeight: isActive ? 700 : 500,
              letterSpacing: '0.01em',
            }}>{it.label}</span>
          </button>
        );
      })}
    </div>
  );
};

// === Home indicator iOS ===
const HMHomeIndicator = () => (
  <div style={{
    position: 'absolute', bottom: 0, left: 0, right: 0,
    height: 24, display: 'flex', justifyContent: 'center', alignItems: 'flex-end',
    paddingBottom: 8, pointerEvents: 'none', zIndex: 20,
  }}>
    <div style={{
      width: 134, height: 5, borderRadius: 999,
      background: 'var(--t-ink)', opacity: 0.85,
    }}></div>
  </div>
);

// === Mobile shell ===
const HMShell = ({ children, withTabBar = true, active = 'lists', bg }) => (
  <TomlRoot style={{
    width: 390, height: 844,
    background: bg || 'var(--t-bg)',
    borderRadius: 44,
    overflow: 'hidden',
    position: 'relative',
    boxShadow: '0 20px 60px rgba(26, 31, 46, 0.18), 0 0 0 1.5px var(--t-ink)',
  }}>
    {/* Notch / dynamic island */}
    <div style={{
      position: 'absolute', top: 11, left: '50%', transform: 'translateX(-50%)',
      width: 120, height: 35, borderRadius: 999, background: 'var(--t-ink)',
      zIndex: 50,
    }}></div>
    <HMStatusBar />
    <div style={{
      position: 'absolute',
      top: 44, left: 0, right: 0,
      bottom: withTabBar ? 84 : 0,
      overflow: 'auto',
      background: bg || 'var(--t-bg)',
    }}>
      {children}
    </div>
    {withTabBar && <HMTabBar active={active} />}
    <HMHomeIndicator />
  </TomlRoot>
);

Object.assign(window, { HMStatusBar, HMLogo, HMTopBar, HMTabBar, HMHomeIndicator, HMShell });
