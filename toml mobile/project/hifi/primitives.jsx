// TOML Hi-fi — Primitives & shared atoms

const TBrowser = ({ url, children }) => (
  <div className="toml-browser">
    <div className="toml-browser-bar">
      <div className="toml-browser-dots"><span></span><span></span><span></span></div>
      <div className="toml-browser-url">{url}</div>
      <div style={{ width: 60 }}></div>
    </div>
    <div className="toml-browser-body">{children}</div>
  </div>
);

const TLogo = ({ size = 22, light = false }) => (
  <div className="tlogo" style={{ fontSize: size, color: light ? 'var(--paper)' : 'var(--ink)' }}>
    <span className="tlogo-icon" style={{
      width: size * 1.25, height: size * 1.25, fontSize: size * 0.6,
      background: light ? 'var(--paper)' : 'var(--burgundy)',
      color: light ? 'var(--burgundy)' : 'var(--paper)',
    }}>★</span>
    <span>toml</span>
  </div>
);

const TNav = ({ authed = false, active = '' }) => (
  <div className="tnav">
    <div style={{ display: 'flex', alignItems: 'center', gap: 36 }}>
      <TLogo size={20} />
      {authed && (
        <div className="tnav-links">
          <span className={active === 'feed' ? 'active' : ''}>Feed</span>
          <span className={active === 'lists' ? 'active' : ''}>Mes listes</span>
          <span className={active === 'friends' ? 'active' : ''}>Amis</span>
          <span className={active === 'discover' ? 'active' : ''}>Découvrir</span>
        </div>
      )}
    </div>
    {authed ? (
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <div style={{ position: 'relative', width: 280 }}>
          <input className="tinput" placeholder="Rechercher un ami, un article…" style={{ paddingLeft: 36, fontSize: 13, padding: '8px 12px 8px 36px' }} readOnly />
          <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--ink-3)', fontSize: 14 }}>⌕</span>
        </div>
        <button className="tbtn tbtn-primary tbtn-sm">+ Ajouter</button>
        <span style={{ fontSize: 18, color: 'var(--ink-2)' }}>♡</span>
        <span style={{ fontSize: 18, color: 'var(--ink-2)' }}>✉</span>
        <div className="tavatar sm bg-1">C</div>
      </div>
    ) : (
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <span style={{ fontSize: 14, color: 'var(--ink-2)', fontWeight: 500 }}>Se connecter</span>
        <button className="tbtn tbtn-primary tbtn-sm">Créer ma wishlist</button>
      </div>
    )}
  </div>
);

const TStars = ({ n = 3, total = 3, sm = false }) => (
  <span style={{ display: 'inline-flex', gap: 2 }}>
    {Array.from({ length: total }).map((_, i) => (
      <span key={i} className={`tstar ${sm ? 'sm' : ''} ${i >= n ? 'dim' : ''}`}></span>
    ))}
  </span>
);

// Product image with optional silhouette/icon
const TImg = ({ tone = 1, h = 200, label, sticker, children, style }) => (
  <div className={`timg timg-${tone}`} style={{ height: h, position: 'relative', ...style }}>
    {children}
    {sticker && <div style={{ position: 'absolute', top: 10, left: 10 }}><span className="tsticker">{sticker}</span></div>}
    {label && (
      <div style={{
        position: 'absolute', bottom: 10, right: 10,
        background: 'rgba(31,24,18,0.85)', color: 'var(--paper)',
        padding: '3px 8px', borderRadius: 4,
        fontFamily: 'var(--font-serif)', fontSize: 11, fontStyle: 'italic',
      }}>{label}</div>
    )}
  </div>
);

Object.assign(window, { TBrowser, TLogo, TNav, TStars, TImg });
