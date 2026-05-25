// Toml Kit — composants React réutilisables
// Toujours wrapper l'app dans <TomlRoot> pour activer le scope CSS .toml-ds

// === Root wrapper ===
const TomlRoot = ({ children, style, className = '', ...rest }) => (
  <div className={`toml-ds ${className}`} style={style} {...rest}>
    {children}
  </div>
);

// === Buttons ===
const TomlButton = ({ variant = 'primary', size, stamp = true, icon, children, className = '', ...rest }) => {
  const cls = [
    'btn',
    `btn-${variant}`,
    size === 'sm' && 'btn-sm',
    size === 'lg' && 'btn-lg',
    stamp && (variant === 'primary' || variant === 'accent') && 'btn-stamp',
    className,
  ].filter(Boolean).join(' ');
  return (
    <button className={cls} {...rest}>
      {icon && <TomlIcon name={icon} size={size === 'sm' ? 14 : 16} />}
      {children}
    </button>
  );
};

const TomlIconButton = ({ icon, variant = 'outline', size = 42, stamp = false, ...rest }) => {
  const cls = ['btn', `btn-${variant}`, stamp && 'btn-stamp'].filter(Boolean).join(' ');
  return (
    <button
      className={cls}
      style={{ width: size, height: size, padding: 0, borderRadius: 999 }}
      {...rest}
    >
      <TomlIcon name={icon} size={Math.round(size * 0.45)} />
    </button>
  );
};

// === Input ===
const TomlInput = ({ soft = false, className = '', ...rest }) => (
  <input className={`input ${soft ? 'input-soft' : ''} ${className}`} {...rest} />
);

const TomlTextarea = ({ className = '', rows = 3, ...rest }) => (
  <textarea className={`input ${className}`} rows={rows} style={{ resize: 'none', fontFamily: 'var(--t-font-ui)' }} {...rest} />
);

// === Chip ===
const TomlChip = ({ variant, active = false, children, ...rest }) => {
  const cls = [
    'chip',
    active && 'chip-active',
    variant && `chip-${variant}`,
  ].filter(Boolean).join(' ');
  return <span className={cls} {...rest}>{children}</span>;
};

// === Badge ===
const TomlBadge = ({ dot = false, color, children, style, ...rest }) => (
  <span
    className={`badge ${dot ? 'badge-dot' : ''}`}
    style={{ ...(color ? { background: color } : {}), ...style }}
    {...rest}
  >
    {!dot && children}
  </span>
);

// === Sticker ===
const TomlSticker = ({ variant, children, style, ...rest }) => {
  const cls = ['sticker', variant && `sticker-${variant}`].filter(Boolean).join(' ');
  return <span className={cls} style={style} {...rest}>{children}</span>;
};

const TomlHand = ({ color, size = 20, children, style, ...rest }) => (
  <span
    style={{
      fontFamily: 'var(--t-font-display)',
      fontStyle: 'italic',
      fontWeight: 500,
      letterSpacing: '-0.005em',
      fontSize: size,
      color: color || 'var(--t-rose)',
      ...style,
    }}
    {...rest}
  >
    {children}
  </span>
);
// Back-compat alias
const TomlVoice = TomlHand;

// === Card ===
const TomlCard = ({ variant = 'soft', children, className = '', style, ...rest }) => {
  const map = { stamp: 'card', soft: 'card-soft', flat: 'card-flat' };
  return <div className={`${map[variant] || 'card-soft'} ${className}`} style={style} {...rest}>{children}</div>;
};

// === Avatar ===
const TomlAvatar = ({ initial = '?', size = 'md', tone, src, style, ...rest }) => {
  // tone 1..5 picks one of the 5 gradients
  const t = tone || ((initial.charCodeAt(0) % 5) + 1);
  const cls = `avatar avatar-${size} avatar-${t}`;
  if (src) {
    return <div className={cls} style={{ backgroundImage: `url(${src})`, backgroundSize: 'cover', backgroundPosition: 'center', ...style }} {...rest} />;
  }
  return <div className={cls} style={style} {...rest}>{initial}</div>;
};

const TomlAvatarStack = ({ people = [], max = 4, size = 'sm' }) => {
  const shown = people.slice(0, max);
  const more = Math.max(0, people.length - max);
  return (
    <div style={{ display: 'flex' }}>
      {shown.map((p, i) => (
        <TomlAvatar
          key={i}
          initial={p.initial || p[0]}
          tone={p.tone || ((i % 5) + 1)}
          size={size}
          style={{ marginLeft: i ? -10 : 0, border: '2px solid var(--t-bg)' }}
        />
      ))}
      {more > 0 && (
        <div
          className={`avatar avatar-${size}`}
          style={{ marginLeft: -10, border: '2px solid var(--t-bg)', background: 'var(--t-bg-2)', color: 'var(--t-ink-2)', fontSize: 12 }}
        >+{more}</div>
      )}
    </div>
  );
};

// === Stars (priority) ===
const TomlStars = ({ value = 3, max = 3, size = 14 }) => (
  <span style={{ display: 'inline-flex', gap: 2 }}>
    {Array.from({ length: max }).map((_, i) => (
      <span key={i} className={`star ${i >= value ? 'star-dim' : ''}`} style={{ width: size, height: size }} />
    ))}
  </span>
);

// === Status dot ===
const TomlDot = ({ status = 'available' }) => <span className={`dot dot-${status}`} />;

// === Divider ===
const TomlDivider = ({ dashed = false, style }) => (
  <hr className={`divider ${dashed ? 'divider-dashed' : ''}`} style={style} />
);

// === Image placeholder ===
const TomlImage = ({ tone = 1, height = 180, label, style, ...rest }) => (
  <div className={`img img-${tone}`} style={{ height, position: 'relative', ...style }} {...rest}>
    {label && (
      <span style={{
        position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: 'rgba(26,31,46,.5)', fontFamily: 'monospace', fontSize: 12,
      }}>{label}</span>
    )}
  </div>
);

// === Label ===
const TomlLabel = ({ color, children, style, ...rest }) => (
  <div className="label" style={{ color, ...style }} {...rest}>{children}</div>
);

// === Toast ===
const TomlToast = ({ icon = 'check', title, body, color = 'var(--t-success)' }) => (
  <div className="card" style={{ padding: '14px 18px', display: 'flex', gap: 12, alignItems: 'center' }}>
    <span style={{ width: 36, height: 36, borderRadius: 999, background: color, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <TomlIcon name={icon} size={20} />
    </span>
    <div style={{ flex: 1 }}>
      <div style={{ fontWeight: 600, fontSize: 14 }}>{title}</div>
      {body && <div style={{ fontSize: 12, color: 'var(--t-ink-2)' }}>{body}</div>}
    </div>
  </div>
);

// === Gift-giver banner ===
const TomlGiverBanner = ({ emoji = '🤫', title, body, badge }) => (
  <div className="giver-banner">
    <span style={{ fontSize: 26 }}>{emoji}</span>
    <div style={{ flex: 1 }}>
      <div style={{ fontWeight: 700, fontSize: 14 }}>{title}</div>
      {body && <div style={{ fontSize: 12, color: 'var(--t-ink-2)' }}>{body}</div>}
    </div>
    {badge && <span className="chip" style={{ background: 'var(--t-paper)' }}>{badge}</span>}
  </div>
);

// === Bookmarklet ===
const TomlBookmarklet = ({ children = '+ Ajouter à Toml' }) => (
  <span className="bookmarklet">{children}</span>
);

Object.assign(window, {
  TomlRoot, TomlButton, TomlIconButton, TomlInput, TomlTextarea,
  TomlChip, TomlBadge, TomlSticker, TomlHand, TomlVoice,
  TomlCard, TomlAvatar, TomlAvatarStack,
  TomlStars, TomlDot, TomlDivider, TomlImage, TomlLabel,
  TomlToast, TomlGiverBanner, TomlBookmarklet,
});
