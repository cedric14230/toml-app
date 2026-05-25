// Toml Hi-fi Desktop — shell : browser chrome + top nav + page wrapper
// DS Snap Family (toml.css). Pas de Liquid Glass macOS — chrome minimal branded TOML.

// === Browser chrome ===
const HDBrowser = ({ url = 'toml.app', children }) => (
  <div style={{
    background: 'var(--t-paper)',
    border: '1.5px solid var(--t-ink)',
    borderRadius: 14,
    boxShadow: '0 20px 60px rgba(26,31,46,0.18), 0 0 0 1px var(--t-line)',
    overflow: 'hidden',
    display: 'flex', flexDirection: 'column',
    height: '100%',
  }}>
    <div style={{
      height: 42, padding: '0 14px',
      display: 'flex', alignItems: 'center', gap: 12,
      background: 'var(--t-bg)', borderBottom: '1px solid var(--t-line)',
      flexShrink: 0,
    }}>
      <div style={{ display: 'flex', gap: 6 }}>
        <span style={{ width: 12, height: 12, borderRadius: 999, background: '#ed6a5e', border: '1px solid rgba(0,0,0,0.1)' }}></span>
        <span style={{ width: 12, height: 12, borderRadius: 999, background: '#f4bf4f', border: '1px solid rgba(0,0,0,0.1)' }}></span>
        <span style={{ width: 12, height: 12, borderRadius: 999, background: '#61c554', border: '1px solid rgba(0,0,0,0.1)' }}></span>
      </div>
      <div style={{
        flex: 1, maxWidth: 480, margin: '0 auto',
        height: 28, padding: '0 14px',
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        background: 'var(--t-paper)', border: '1px solid var(--t-line)',
        borderRadius: 999, fontSize: 12, color: 'var(--t-ink-3)', fontWeight: 500,
      }}>
        <span style={{ color: 'var(--t-success)' }}>●</span>
        <span style={{ fontFamily: 'var(--t-font-ui)' }}>{url}</span>
      </div>
      <div style={{ width: 60 }}></div>
    </div>
    <div style={{ flex: 1, minHeight: 0, background: 'var(--t-bg)', overflow: 'hidden' }}>
      {children}
    </div>
  </div>
);

// === Top nav app ===
const HDTopNav = ({ active = 'feed', authed = true }) => {
  const links = [
    { id: 'feed',     label: 'Feed' },
    { id: 'lists',    label: 'Mes listes' },
    { id: 'friends',  label: 'Amis' },
    { id: 'discover', label: 'Découvrir' },
  ];
  return (
    <div style={{
      height: 64, padding: '0 32px',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 20,
      background: 'var(--t-paper)',
      borderBottom: '1.5px solid var(--t-ink)',
      flexShrink: 0,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
        <HMLogo size={22} />
        {authed && (
          <nav style={{ display: 'flex', gap: 4 }}>
            {links.map(l => {
              const isActive = l.id === active;
              return (
                <button key={l.id} style={{
                  background: 'transparent', border: 'none', cursor: 'pointer',
                  padding: '8px 14px', borderRadius: 999,
                  fontFamily: 'var(--t-font-ui)', fontSize: 14,
                  fontWeight: isActive ? 700 : 500,
                  color: isActive ? 'var(--t-ink)' : 'var(--t-ink-2)',
                  position: 'relative',
                }}>
                  {l.label}
                  {isActive && (
                    <span style={{
                      position: 'absolute', bottom: -22, left: '50%',
                      transform: 'translateX(-50%)',
                      width: 5, height: 5, borderRadius: 999,
                      background: 'var(--t-rose)',
                    }}></span>
                  )}
                </button>
              );
            })}
          </nav>
        )}
      </div>
      {authed ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ position: 'relative', width: 280 }}>
            <TomlIcon name="search" size={15} style={{
              position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)',
              color: 'var(--t-ink-3)', pointerEvents: 'none',
            }} />
            <input className="input input-soft" placeholder="Rechercher amis, articles…"
              style={{ paddingLeft: 38, padding: '8px 14px 8px 38px', fontSize: 13, height: 38 }} />
          </div>
          <button className="btn btn-primary btn-stamp btn-sm">
            <TomlIcon name="plus" size={14} />
            Ajouter
          </button>
          <button style={{
            width: 38, height: 38, padding: 0, borderRadius: 999, cursor: 'pointer',
            background: 'var(--t-bg)', border: '1px solid var(--t-line)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            position: 'relative',
          }}>
            <TomlIcon name="bell" size={18} />
            <span className="badge" style={{
              position: 'absolute', top: -3, right: -3, fontSize: 10,
              border: '1.5px solid var(--t-paper)',
            }}>3</span>
          </button>
          <TomlAvatar initial="C" tone={1} size="sm" />
        </div>
      ) : (
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button className="btn btn-ghost btn-sm" style={{ background: 'transparent' }}>Se connecter</button>
          <button className="btn btn-primary btn-stamp btn-sm">Créer ma wishlist</button>
        </div>
      )}
    </div>
  );
};

// === Page shell : browser + nav + scrollable content ===
const HDShell = ({ url, active, authed = true, children }) => (
  <HDBrowser url={url}>
    <div className="toml-ds" style={{ height: '100%', display: 'flex', flexDirection: 'column', background: 'var(--t-bg)' }}>
      <HDTopNav active={active} authed={authed} />
      <div style={{ flex: 1, minHeight: 0, overflow: 'auto' }}>
        {children}
      </div>
    </div>
  </HDBrowser>
);

Object.assign(window, { HDBrowser, HDTopNav, HDShell });
