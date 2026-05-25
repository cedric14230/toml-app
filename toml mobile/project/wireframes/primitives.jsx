// Shared sketchy primitives for Toml wireframes

const Browser = ({ url, children, tab = "TOML — Top On My List" }) => (
  <div className="browser">
    <div className="browser-bar">
      <div className="browser-dots"><span></span><span></span><span></span></div>
      <div className="browser-url">{url}</div>
      <div style={{ fontFamily: 'var(--sketch-font)', fontSize: 12, color: 'var(--ink-4)' }}>{tab}</div>
    </div>
    <div className="browser-body">{children}</div>
  </div>
);

const Logo = ({ size = 22 }) => (
  <div style={{
    fontFamily: 'var(--sketch-font)',
    fontWeight: 700,
    fontSize: size,
    letterSpacing: '0.04em',
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
  }}>
    <span style={{
      width: size * 0.9,
      height: size * 0.9,
      border: '1.8px solid var(--ink)',
      borderRadius: 4,
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: size * 0.5,
    }}>★</span>
    TOML
  </div>
);

const TopNav = ({ authed = false, active = 'feed', compact = false }) => (
  <div style={{
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: compact ? '10px 20px' : '14px 28px',
    borderBottom: '1.5px solid var(--ink)',
    background: 'var(--paper)',
    gap: 20,
  }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 28 }}>
      <Logo size={compact ? 18 : 22} />
      {authed && (
        <div style={{ display: 'flex', gap: 18, fontFamily: 'var(--sketch-font)', fontWeight: 600, fontSize: 14 }}>
          <span className={active === 'feed' ? 'sk-underline' : ''} style={{ color: active === 'feed' ? 'var(--ink)' : 'var(--ink-3)' }}>Feed</span>
          <span className={active === 'lists' ? 'sk-underline' : ''} style={{ color: active === 'lists' ? 'var(--ink)' : 'var(--ink-3)' }}>Mes listes</span>
          <span className={active === 'friends' ? 'sk-underline' : ''} style={{ color: active === 'friends' ? 'var(--ink)' : 'var(--ink-3)' }}>Amis</span>
        </div>
      )}
    </div>
    {authed ? (
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <div className="sk-chip">+ Ajouter un article</div>
        <span style={{ fontSize: 18 }}>🔔</span>
        <div className="sk-avatar">C</div>
      </div>
    ) : (
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <span style={{ fontFamily: 'var(--sketch-font)', fontSize: 14, color: 'var(--ink-3)' }}>Se connecter</span>
        <button className="sk-btn sk-btn-dark sk-btn-sm">Créer un compte</button>
      </div>
    )}
  </div>
);

const SideNav = ({ active = 'feed', mini: miniProp = false, toggleable = false }) => {
  const [mini, setMini] = React.useState(miniProp);
  React.useEffect(() => setMini(miniProp), [miniProp]);
  const items = [
    { id: 'feed', label: 'Feed', icon: '⌂' },
    { id: 'lists', label: 'Mes listes', icon: '☰' },
    { id: 'friends', label: 'Amis', icon: '◎' },
    { id: 'explore', label: 'Découvrir', icon: '✦' },
    { id: 'notif', label: 'Notifs', icon: '♡' },
    { id: 'profile', label: 'Profil', icon: '◉' },
  ];
  return (
    <div style={{
      width: mini ? 72 : 200,
      borderRight: '1.5px solid var(--ink)',
      padding: mini ? '16px 10px' : '18px 16px',
      display: 'flex',
      flexDirection: 'column',
      gap: 12,
      background: 'var(--paper)',
      flexShrink: 0,
      height: '100%',
      transition: 'width .25s ease',
      position: 'relative',
    }}>
      <button onClick={() => toggleable && setMini(m => !m)} title={mini ? 'Déplier' : 'Replier'} style={{
        position: 'absolute',
        top: 22,
        right: -12,
        width: 24,
        height: 24,
        borderRadius: 999,
        border: '1.5px solid var(--ink)',
        background: 'var(--paper)',
        cursor: toggleable ? 'pointer' : 'default',
        fontFamily: 'var(--sketch-font)',
        fontWeight: 700,
        fontSize: 12,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 0,
        zIndex: 4,
        boxShadow: '1px 1px 0 var(--ink)',
      }}>{mini ? '›' : '‹'}</button>
      <div style={{ marginBottom: 14, display: 'flex', justifyContent: mini ? 'center' : 'flex-start' }}>
        {mini ? <span style={{
          width: 28, height: 28, border: '1.8px solid var(--ink)', borderRadius: 4,
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: 'var(--sketch-font)', fontWeight: 700, fontSize: 14,
        }}>T</span> : <Logo size={20} />}
      </div>
      {items.map(it => (
        <div key={it.id} style={{
          display: 'flex',
          alignItems: 'center',
          gap: mini ? 0 : 12,
          justifyContent: mini ? 'center' : 'flex-start',
          padding: mini ? '10px 0' : '8px 10px',
          border: active === it.id ? '1.3px solid var(--ink)' : '1.3px solid transparent',
          borderRadius: 8,
          background: active === it.id ? 'var(--paper-2)' : 'transparent',
          fontFamily: 'var(--sketch-font)',
          fontWeight: 600,
          fontSize: 14,
        }}>
          <span style={{ fontSize: 18 }}>{it.icon}</span>
          {!mini && <span>{it.label}</span>}
        </div>
      ))}
      <div style={{ marginTop: 'auto', borderTop: '1.3px dashed var(--ink-4)', paddingTop: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, justifyContent: mini ? 'center' : 'flex-start' }}>
          <div className="sk-avatar">C</div>
          {!mini && <div>
            <div style={{ fontSize: 13, fontWeight: 700 }}>Cédric</div>
            <div style={{ fontSize: 11, color: 'var(--ink-4)' }}>@cedric</div>
          </div>}
        </div>
      </div>
    </div>
  );
};

const Annotation = ({ top, left, right, bottom, text, arrow = 'down-left', maxWidth = 140 }) => (
  <div className="annotation" style={{ top, left, right, bottom, maxWidth }}>
    <div>{text}</div>
  </div>
);

// Arrow from note to element
const ScribbleArrow = ({ d, style }) => (
  <svg style={{ position: 'absolute', overflow: 'visible', ...style }}>
    <path d={d} stroke="var(--accent)" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeDasharray="0" />
    <path d={d.split(' ').slice(-6).join(' ')} stroke="var(--accent)" strokeWidth="1.8" fill="none" />
  </svg>
);

const StarRow = ({ n = 3, total = 3 }) => (
  <span style={{ display: 'inline-flex', gap: 2 }}>
    {Array.from({ length: total }).map((_, i) => (
      <span key={i} className={`sk-star ${i >= n ? 'dim' : ''}`} style={{ width: 11, height: 11 }}></span>
    ))}
  </span>
);

const ReactionBar = ({ counts = { love: 0, useful: 0, int: 0 } }) => (
  <div style={{ display: 'flex', gap: 10, fontFamily: 'var(--sketch-font)', fontSize: 12, color: 'var(--ink-3)' }}>
    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>♥ {counts.love}</span>
    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>✓ {counts.useful}</span>
    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>? {counts.int}</span>
  </div>
);

Object.assign(window, { Browser, Logo, TopNav, SideNav, Annotation, ScribbleArrow, StarRow, ReactionBar });
