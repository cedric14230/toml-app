// Toml Hi-fi Desktop — Amis
// Hero search · 4 cercles cards · anniv horizontal · demandes · grid tous amis

const HDCircleCard = ({ name, emoji, count, tone, people, lastActive }) => (
  <div className="card" style={{
    padding: 18, display: 'flex', flexDirection: 'column', gap: 14,
    background: tone === 'rose' ? 'var(--t-rose-soft)' :
                tone === 'mustard' ? 'var(--t-mustard-soft)' :
                tone === 'denim' ? 'var(--t-denim-soft)' : 'var(--t-paper)',
    minHeight: 180,
  }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
      <div style={{ fontSize: 28 }}>{emoji}</div>
      <button className="btn btn-ghost btn-sm" style={{
        width: 30, height: 30, padding: 0, borderRadius: 999, background: 'rgba(255,255,255,0.5)',
      }}>
        <TomlIcon name="menu" size={13} />
      </button>
    </div>
    <div style={{ flex: 1 }}>
      <div className="display-2" style={{ fontSize: 20, marginBottom: 4 }}>{name}</div>
      <div style={{ fontSize: 12, color: 'var(--t-ink-2)', fontWeight: 600 }}>
        {count} membres · {lastActive}
      </div>
    </div>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <TomlAvatarStack people={people} max={4} size="sm" />
      <button className="btn btn-outline btn-sm" style={{ padding: '4px 12px', fontSize: 12 }}>
        Voir
      </button>
    </div>
  </div>
);

const HDBirthdayCard = ({ initial, name, when, days, tone, year }) => (
  <div style={{
    flexShrink: 0, width: 200,
    background: 'var(--t-paper)', border: '1.5px solid var(--t-ink)',
    borderRadius: 'var(--t-r-lg)', padding: 16,
    boxShadow: 'var(--t-shadow-stamp)',
    display: 'flex', flexDirection: 'column', gap: 10,
  }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
      <TomlAvatar initial={initial} tone={tone} size="md" />
      <span style={{ fontSize: 22 }}>🎂</span>
    </div>
    <div>
      <div style={{ fontSize: 16, fontWeight: 700, lineHeight: 1.2 }}>{name}</div>
      <div style={{ fontSize: 12, color: 'var(--t-ink-3)', marginTop: 2, fontWeight: 600 }}>{when} · {year} ans</div>
    </div>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <span className="chip chip-mustard" style={{ fontSize: 11 }}>Dans {days}j</span>
      <button className="btn btn-outline btn-sm" style={{ padding: '4px 10px', fontSize: 11 }}>
        Sa liste
      </button>
    </div>
  </div>
);

const HDFriendCard = ({ initial, name, handle, tone, listsCount, mutual, lastActive }) => (
  <div className="card-soft" style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <TomlAvatar initial={initial} tone={tone} size="md" />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 14, fontWeight: 700 }}>{name}</div>
        <div style={{ fontSize: 11, color: 'var(--t-ink-3)' }}>@{handle}</div>
      </div>
      <button className="btn btn-ghost btn-sm" style={{
        width: 30, height: 30, padding: 0, borderRadius: 999, background: 'transparent',
      }}>
        <TomlIcon name="menu" size={13} />
      </button>
    </div>
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 11.5, color: 'var(--t-ink-2)', flexWrap: 'wrap' }}>
      <span><strong style={{ color: 'var(--t-ink)' }}>{listsCount}</strong> listes</span>
      <span style={{ color: 'var(--t-ink-4)' }}>·</span>
      <span>{mutual} amis communs</span>
    </div>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 2 }}>
      <span style={{ fontSize: 11, color: 'var(--t-ink-3)', fontWeight: 600 }}>{lastActive}</span>
      <div style={{ display: 'flex', gap: 6 }}>
        <button className="btn btn-outline btn-sm" style={{ padding: '4px 10px', fontSize: 11 }}>
          <TomlIcon name="chat" size={11} />
          Message
        </button>
        <button className="btn btn-primary btn-stamp btn-sm" style={{ padding: '4px 10px', fontSize: 11 }}>
          Profil
        </button>
      </div>
    </div>
  </div>
);

const HDPendingRow = ({ initial, name, handle, tone, mutual }) => (
  <div className="card-soft" style={{
    padding: 14, display: 'flex', alignItems: 'center', gap: 12,
  }}>
    <TomlAvatar initial={initial} tone={tone} size="md" />
    <div style={{ flex: 1, minWidth: 0 }}>
      <div style={{ fontSize: 14, fontWeight: 700 }}>{name}</div>
      <div style={{ fontSize: 11, color: 'var(--t-ink-3)' }}>@{handle} · {mutual} amis communs</div>
    </div>
    <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
      <button className="btn btn-primary btn-stamp btn-sm">
        <TomlIcon name="check" size={13} />
        Accepter
      </button>
      <button className="btn btn-ghost btn-sm" style={{ background: 'transparent' }}>
        <TomlIcon name="x" size={13} />
      </button>
    </div>
  </div>
);

const HDFriends = () => {
  const circles = [
    { name: 'Famille', emoji: '🏡', count: 8,  tone: 'rose',    lastActive: 'actif',
      people: [{initial:'M',tone:5},{initial:'P',tone:2},{initial:'C',tone:1},{initial:'A',tone:3},{initial:'J',tone:4}] },
    { name: 'Crew', emoji: '✨', count: 12, tone: 'mustard', lastActive: 'actif',
      people: [{initial:'L',tone:1},{initial:'T',tone:2},{initial:'I',tone:4},{initial:'S',tone:3}] },
    { name: 'Cousins', emoji: '🎯', count: 6,  tone: 'denim',   lastActive: 'hier',
      people: [{initial:'P',tone:3},{initial:'J',tone:1},{initial:'M',tone:5}] },
    { name: 'Bureau', emoji: '☕', count: 4,  tone: null,      lastActive: 'la sem.',
      people: [{initial:'V',tone:2},{initial:'R',tone:4}] },
  ];
  const bdays = [
    { initial: 'L', name: 'Léa Moreau',   when: '2 juin',  days: 8,  tone: 1, year: 32 },
    { initial: 'P', name: 'Papa',         when: '15 juin', days: 21, tone: 2, year: 65 },
    { initial: 'I', name: 'Inès Lambert', when: '28 juin', days: 34, tone: 4, year: 29 },
    { initial: 'T', name: 'Tom Bernard',  when: '8 juil.', days: 44, tone: 2, year: 30 },
    { initial: 'M', name: 'Maman',        when: '20 juil.', days: 56, tone: 5, year: 62 },
  ];
  const pending = [
    { initial:'S', name:'Sophie Vermeil', handle:'sosolavie', tone:2, mutual:3 },
    { initial:'A', name:'Alex Roy',       handle:'alex_r',    tone:4, mutual:1 },
  ];
  const friends = [
    { initial:'L', name:'Léa Moreau',    handle:'leam',     tone:1, listsCount:3, mutual:8,  lastActive:'actif maintenant' },
    { initial:'T', name:'Tom Bernard',   handle:'tomb',     tone:2, listsCount:2, mutual:4,  lastActive:'actif hier' },
    { initial:'I', name:'Inès Lambert',  handle:'ineslam',  tone:4, listsCount:5, mutual:12, lastActive:'actif maintenant' },
    { initial:'M', name:'Maman',         handle:'mum',      tone:5, listsCount:1, mutual:0,  lastActive:'il y a 2 jours' },
    { initial:'P', name:'Paul Durand',   handle:'pdurand',  tone:3, listsCount:0, mutual:6,  lastActive:'la sem. dernière' },
    { initial:'J', name:'Julien Pétit',  handle:'jpetit',   tone:1, listsCount:4, mutual:5,  lastActive:'hier' },
  ];

  return (
    <HDShell url="toml.app/friends" active="friends">
      <div style={{ padding: '32px 40px 60px' }}>
        {/* Hero */}
        <div style={{
          display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between',
          marginBottom: 24, gap: 24, flexWrap: 'wrap',
        }}>
          <div>
            <div className="label" style={{ marginBottom: 6 }}>Mes cercles · 4 · 18 amis</div>
            <h1 className="display-2" style={{ fontSize: 40, letterSpacing: '-0.02em' }}>
              Amis & <span style={{ color: 'var(--t-rose)', fontStyle: 'italic', fontWeight: 600 }}>cercles</span>
            </h1>
          </div>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <div style={{ position: 'relative', width: 320 }}>
              <TomlIcon name="search" size={15} style={{
                position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)',
                color: 'var(--t-ink-3)', pointerEvents: 'none',
              }} />
              <input className="input input-soft" placeholder="Chercher un ami, un cercle…"
                style={{ paddingLeft: 38, padding: '10px 14px 10px 38px', fontSize: 13 }} />
            </div>
            <button className="btn btn-accent btn-stamp">
              <TomlIcon name="plus" size={14} />
              Inviter un ami
            </button>
          </div>
        </div>

        {/* Cercles */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 14 }}>
          <h2 className="display-2" style={{ fontSize: 20 }}>Cercles</h2>
          <button className="btn btn-outline btn-sm">
            <TomlIcon name="plus" size={12} />
            Nouveau cercle
          </button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 36 }}>
          {circles.map((c, i) => <HDCircleCard key={i} {...c} />)}
        </div>

        {/* Anniversaires */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 14 }}>
          <h2 className="display-2" style={{ fontSize: 20 }}>Anniversaires à venir</h2>
          <span style={{ fontSize: 12, color: 'var(--t-ink-3)', fontWeight: 600 }}>5 prochains · 2 mois</span>
        </div>
        <div style={{ display: 'flex', gap: 14, overflowX: 'auto', paddingBottom: 8, marginBottom: 36 }}>
          {bdays.map((b, i) => <HDBirthdayCard key={i} {...b} />)}
        </div>

        {/* Demandes */}
        {pending.length > 0 && (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 14 }}>
              <h2 className="display-2" style={{ fontSize: 20 }}>
                Demandes en attente
                <span className="badge" style={{ marginLeft: 8, fontSize: 11, position: 'relative', top: -2 }}>{pending.length}</span>
              </h2>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 36 }}>
              {pending.map((p, i) => <HDPendingRow key={i} {...p} />)}
            </div>
          </>
        )}

        {/* Tous mes amis */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 14 }}>
          <h2 className="display-2" style={{ fontSize: 20 }}>Tous mes amis</h2>
          <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
            <span className="chip chip-active">Tous</span>
            <span className="chip">Famille</span>
            <span className="chip">Crew</span>
            <span className="chip">Cousins</span>
            <span style={{ fontSize: 12, color: 'var(--t-ink-3)', fontWeight: 600, marginLeft: 8 }}>
              {friends.length} contacts
            </span>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
          {friends.map((f, i) => <HDFriendCard key={i} {...f} />)}
        </div>
      </div>
    </HDShell>
  );
};

window.HDFriends = HDFriends;
