// Toml Hi-fi Desktop — Feed
// 3 colonnes : sidebar gauche (filtres + cercles) · stream centre · right rail (anniv + suggestions)

const HDEventRow = ({ avatar, who, verb, target, time, tone, body }) => (
  <div style={{
    display: 'flex', gap: 14, padding: '20px 24px',
    borderBottom: '1px solid var(--t-line-soft)',
    background: 'var(--t-paper)',
  }}>
    <TomlAvatar initial={avatar} tone={tone} size="md" />
    <div style={{ flex: 1, minWidth: 0 }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 2 }}>
        <div style={{ fontSize: 15, color: 'var(--t-ink)' }}>
          <strong style={{ fontWeight: 700 }}>{who}</strong>
          <span style={{ color: 'var(--t-ink-2)', fontWeight: 500 }}> {verb} </span>
          <strong style={{ fontWeight: 600 }}>{target}</strong>
        </div>
        <div style={{ fontSize: 12, color: 'var(--t-ink-3)', fontWeight: 600, flexShrink: 0 }}>· {time}</div>
      </div>
      {body && <div style={{ marginTop: 12 }}>{body}</div>}
    </div>
    <button className="btn btn-ghost btn-sm" style={{
      width: 32, height: 32, padding: 0, borderRadius: 999, background: 'transparent', flexShrink: 0,
    }}>
      <TomlIcon name="menu" size={14} />
    </button>
  </div>
);

const HDFeedItemCard = ({ brand, title, price, stars, tone, note }) => (
  <div style={{
    display: 'flex', gap: 16, padding: 16, borderRadius: 'var(--t-r-lg)',
    background: 'var(--t-bg)', border: '1px solid var(--t-line)',
  }}>
    <div className={`img img-${tone}`} style={{
      width: 140, height: 140, borderRadius: 'var(--t-r-md)', flexShrink: 0,
      border: '1.5px solid var(--t-ink)', position: 'relative', overflow: 'hidden',
    }}>
      {stars === 3 && (
        <span className="sticker" style={{
          position: 'absolute', top: 8, left: 8, fontSize: 11, padding: '2px 8px',
        }}>
          <TomlStars value={3} size={9} />
        </span>
      )}
    </div>
    <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
      <div className="label" style={{ color: 'var(--t-rose)', marginBottom: 4, fontSize: 10 }}>{brand}</div>
      <div className="display-2" style={{ fontSize: 18, marginBottom: 6 }}>{title}</div>
      {note && (
        <div className="voice" style={{ fontSize: 14, marginBottom: 8 }}>« {note} »</div>
      )}
      <div style={{ flex: 1 }}></div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontSize: 16, fontWeight: 700 }}>{price} €</div>
        <div style={{ display: 'flex', gap: 6 }}>
          <button className="btn btn-outline btn-sm">
            <TomlIcon name="heart" size={13} />
            J'aime
          </button>
          <button className="btn btn-primary btn-stamp btn-sm">
            <TomlIcon name="gift" size={13} />
            Réserver
          </button>
        </div>
      </div>
    </div>
  </div>
);

const HDFeedSidebar = () => {
  const filters = [
    { id: 'all', label: 'Toute l\'activité', count: 124, active: true },
    { id: 'family', label: 'Famille', count: 32 },
    { id: 'friends', label: 'Amis', count: 56 },
    { id: 'reserved', label: 'Réservations', count: 14 },
    { id: 'birthdays', label: 'Anniversaires', count: 3 },
  ];
  const circles = [
    { name: 'Famille', emoji: '🏡', count: 8, tone: 'rose' },
    { name: 'Crew', emoji: '✨', count: 12, tone: 'mustard' },
    { name: 'Cousins', emoji: '🎯', count: 6, tone: 'denim' },
  ];
  return (
    <aside style={{ width: 240, flexShrink: 0, padding: '24px 8px 24px 24px' }}>
      <div className="label" style={{ marginBottom: 10, padding: '0 12px' }}>Filtres</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2, marginBottom: 28 }}>
        {filters.map(f => (
          <button key={f.id} style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '10px 12px', borderRadius: 10, cursor: 'pointer',
            background: f.active ? 'var(--t-ink)' : 'transparent', border: 'none',
            color: f.active ? 'var(--t-bg)' : 'var(--t-ink)',
            fontFamily: 'var(--t-font-ui)', fontSize: 13.5,
            fontWeight: f.active ? 700 : 500,
          }}>
            <span>{f.label}</span>
            <span style={{
              fontSize: 11, fontWeight: 700,
              color: f.active ? 'var(--t-bg-3)' : 'var(--t-ink-3)',
            }}>{f.count}</span>
          </button>
        ))}
      </div>

      <div className="label" style={{ marginBottom: 10, padding: '0 12px' }}>Mes cercles</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {circles.map(c => (
          <button key={c.name} style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '8px 12px', borderRadius: 10, cursor: 'pointer',
            background: 'transparent', border: 'none',
            color: 'var(--t-ink)', fontFamily: 'var(--t-font-ui)', fontSize: 13.5, fontWeight: 500,
            textAlign: 'left',
          }}>
            <span style={{ fontSize: 18 }}>{c.emoji}</span>
            <span style={{ flex: 1 }}>{c.name}</span>
            <span style={{ fontSize: 11, color: 'var(--t-ink-3)', fontWeight: 600 }}>{c.count}</span>
          </button>
        ))}
        <button style={{
          display: 'flex', alignItems: 'center', gap: 10,
          padding: '8px 12px', borderRadius: 10, cursor: 'pointer',
          background: 'transparent', border: 'none',
          color: 'var(--t-ink-3)', fontFamily: 'var(--t-font-ui)', fontSize: 13.5, fontWeight: 500,
          textAlign: 'left', marginTop: 2,
        }}>
          <TomlIcon name="plus" size={16} />
          <span>Créer un cercle</span>
        </button>
      </div>
    </aside>
  );
};

const HDFeedRightRail = () => {
  const bdays = [
    { initial: 'L', name: 'Léa',  when: '2 juin',  days: 8,  tone: 1 },
    { initial: 'P', name: 'Papa', when: '15 juin', days: 21, tone: 2 },
    { initial: 'I', name: 'Inès', when: '28 juin', days: 34, tone: 4 },
  ];
  const suggestions = [
    { initial: 'S', name: 'Sophie Vermeil', mutual: 3, tone: 2 },
    { initial: 'A', name: 'Alex Roy',       mutual: 1, tone: 4 },
    { initial: 'J', name: 'Julien Pétit',   mutual: 5, tone: 3 },
  ];
  return (
    <aside style={{ width: 300, flexShrink: 0, padding: '24px 24px 24px 8px' }}>
      {/* Anniversaires */}
      <div className="card" style={{ padding: 18, marginBottom: 18 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 12 }}>
          <div className="display-2" style={{ fontSize: 15 }}>🎂 Anniversaires</div>
          <span style={{ fontSize: 11, color: 'var(--t-ink-3)', fontWeight: 600 }}>3 prochains</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {bdays.map((b, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <TomlAvatar initial={b.initial} tone={b.tone} size="sm" />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 700 }}>{b.name}</div>
                <div style={{ fontSize: 11, color: 'var(--t-ink-3)' }}>{b.when}</div>
              </div>
              <span className="chip chip-mustard" style={{ fontSize: 10, padding: '2px 8px' }}>
                {b.days}j
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Bookmarklet onboarding — geste desktop */}
      <div className="card" style={{ padding: 16, marginBottom: 18, background: 'var(--t-ink)', color: 'var(--t-bg)' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: 'var(--t-mustard)', color: 'var(--t-ink)',
            border: '1.5px solid var(--t-bg)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>
            <TomlIcon name="bookmark" size={18} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontFamily: 'var(--t-font-display)', fontWeight: 700, fontSize: 14, marginBottom: 4, lineHeight: 1.2, color: 'var(--t-bg)' }}>
              Ajoute en 1 clic
            </div>
            <div style={{ fontSize: 12, color: 'var(--t-bg-2)', marginBottom: 12, lineHeight: 1.4 }}>
              Glisse ce bouton dans ta barre de favoris.
            </div>
            <span className="bookmarklet">+ Ajouter à Toml</span>
          </div>
        </div>
      </div>

      {/* Suggestions */}
      <div className="card-soft" style={{ padding: 16 }}>
        <div className="display-2" style={{ fontSize: 15, marginBottom: 12 }}>Tu connais peut-être</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {suggestions.map((s, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <TomlAvatar initial={s.initial} tone={s.tone} size="sm" />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 700 }}>{s.name}</div>
                <div style={{ fontSize: 11, color: 'var(--t-ink-3)' }}>{s.mutual} amis communs</div>
              </div>
              <button className="btn btn-outline btn-sm" style={{ padding: '4px 10px', fontSize: 11 }}>
                Ajouter
              </button>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
};

const HDFeed = () => (
  <HDShell url="toml.app/feed" active="feed">
    <div style={{ display: 'flex', minHeight: '100%' }}>
      <HDFeedSidebar />

      {/* Stream centre */}
      <main style={{ flex: 1, minWidth: 0, padding: '24px 0' }}>
        <div style={{ padding: '0 24px 16px', display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
          <div>
            <div className="label" style={{ marginBottom: 4 }}>Activité</div>
            <h1 className="display-2" style={{ fontSize: 28 }}>Feed</h1>
          </div>
          <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
            <span className="chip chip-active">Récent</span>
            <span className="chip">Coup de cœur</span>
            <span className="chip">Réservés</span>
          </div>
        </div>

        <div className="card" style={{ margin: '0 24px', padding: 0, overflow: 'hidden' }}>
          <HDEventRow
            avatar="L" who="Léa Moreau" verb="a ajouté un coup de cœur dans" target="Anniv 2026"
            time="il y a 12 min" tone={1}
            body={<HDFeedItemCard brand="Sézane" title="Robe Liliana — taille S" price={89} stars={3} tone={1} note="Si tu trouves en bleu nuit je meurs" />}
          />
          <HDEventRow
            avatar="T" who="Tom Bernard" verb="a réservé" target="Bougie Diptyque"
            time="il y a 1 h" tone={2}
            body={
              <div style={{
                display: 'flex', alignItems: 'center', gap: 14, padding: 12,
                background: 'var(--t-bg)', borderRadius: 'var(--t-r-md)', border: '1px solid var(--t-line)',
              }}>
                <div className={`img img-5`} style={{
                  width: 56, height: 56, borderRadius: 10, flexShrink: 0, border: '1.5px solid var(--t-ink)',
                }}></div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 700 }}>Bougie Baies — Diptyque · 85 €</div>
                  <div style={{ fontSize: 12, color: 'var(--t-ink-3)', marginTop: 2 }}>
                    Dans <strong style={{ color: 'var(--t-ink-2)' }}>Noël 2026</strong> de Camille
                  </div>
                </div>
                <span className="chip chip-mustard">
                  <span className="dot dot-reserved"></span>
                  Réservé
                </span>
              </div>
            }
          />
          <HDEventRow
            avatar="I" who="Inès Lambert" verb="a créé une nouvelle liste" target="Crémaillère 12 juin"
            time="il y a 3 h" tone={4}
            body={
              <div style={{
                padding: 14, background: 'var(--t-bg)', borderRadius: 'var(--t-r-md)', border: '1px solid var(--t-line)',
              }}>
                <div className="voice" style={{ fontSize: 15, marginBottom: 8 }}>« On pend la crémaillère ! Si vous voulez participer 🏠 »</div>
                <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                  <span className="chip" style={{ fontSize: 11 }}>0 articles</span>
                  <span className="chip" style={{ fontSize: 11 }}>
                    <TomlIcon name="friends" size={11} />
                    Amis
                  </span>
                  <div style={{ flex: 1 }}></div>
                  <button className="btn btn-outline btn-sm">Voir la liste</button>
                </div>
              </div>
            }
          />
          <HDEventRow
            avatar="M" who="Maman" verb="a réagi à" target="Trench long cercle" time="hier" tone={5}
            body={
              <div style={{
                padding: '10px 14px', background: 'var(--t-paper)',
                border: '1px solid var(--t-line)', borderRadius: 'var(--t-r-md)',
                display: 'inline-flex', alignItems: 'center', gap: 10,
              }}>
                <span style={{ fontSize: 20 }}>❤️</span>
                <span className="voice" style={{ fontSize: 14 }}>« Très joli ce trench, ça t'irait tellement bien »</span>
              </div>
            }
          />
          <HDEventRow
            avatar="P" who="Paul Durand" verb="a rejoint le cercle" target="Cousins" time="hier" tone={3}
          />
          <HDEventRow
            avatar="L" who="Léa Moreau" verb="a ajouté 3 articles dans" target="Anniv 2026"
            time="il y a 2 jours" tone={1}
            body={
              <div style={{ display: 'flex', gap: 10 }}>
                {[2, 3, 4].map(t => (
                  <div key={t} className={`img img-${t}`} style={{
                    width: 84, height: 84, borderRadius: 'var(--t-r-md)', border: '1.5px solid var(--t-ink)',
                  }}></div>
                ))}
                <div style={{
                  width: 84, height: 84, borderRadius: 'var(--t-r-md)',
                  border: '1.5px dashed var(--t-ink-3)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 13, fontWeight: 700, color: 'var(--t-ink-3)',
                }}>+5</div>
              </div>
            }
          />
        </div>

        <div style={{ padding: '20px 24px 30px', textAlign: 'center' }}>
          <button className="btn btn-outline btn-sm">Charger plus d'activité</button>
        </div>
      </main>

      <HDFeedRightRail />
    </div>
  </HDShell>
);

window.HDFeed = HDFeed;
