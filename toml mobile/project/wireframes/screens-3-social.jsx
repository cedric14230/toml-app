// Screens — Feed, Friends, Profile, Settings

const Stories = () => (
  <div style={{ display: 'flex', gap: 14, padding: '12px 4px', overflowX: 'auto', borderBottom: '1.3px dashed var(--ink-4)', marginBottom: 16 }}>
    {[
      { c: '+', name: 'Ta liste', isNew: true },
      { c: 'L', name: 'Léa', hasNew: true },
      { c: 'M', name: 'Marc', hasNew: true },
      { c: 'A', name: 'Amandine', hasNew: true },
      { c: 'J', name: 'Julie' },
      { c: 'P', name: 'Papa' },
      { c: 'S', name: 'Sophie' },
      { c: 'T', name: 'Thomas' },
    ].map((s, i) => (
      <div key={i} style={{ textAlign: 'center', minWidth: 64 }}>
        <div className={s.hasNew ? 'sk-avatar story' : 'sk-avatar'} style={{ width: 56, height: 56, fontSize: 18, margin: '0 auto 4px', borderColor: s.hasNew ? 'var(--accent)' : (s.isNew ? 'var(--ink-4)' : 'var(--ink)'), borderStyle: s.isNew ? 'dashed' : 'solid' }}>
          {s.c}
        </div>
        <div style={{ fontSize: 11, color: 'var(--ink-3)' }}>{s.name}</div>
      </div>
    ))}
  </div>
);

// Feed variant A — event list (close to current proto)
const FeedList = () => (
  <Browser url="toml.app/dashboard/feed">
    <div style={{ height: '100%' }}>
      <TopNav authed active="feed" compact />
      <div style={{ padding: '18px 22px', overflow: 'auto' }}>
        <div style={{ fontFamily: 'var(--sketch-font)', fontWeight: 700, fontSize: 26, marginBottom: 14 }}>Feed</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {[
            ['Cédric', 'a ajouté un article à Noël 2026', 'Robe Liliana — Sézane', '5 j'],
            ['Léa', 'a créé une nouvelle liste', 'Ma chambre idéale (8 articles)', '1 j'],
            ['Marc', 'a ajouté un article', 'Chapeau bob — Courrèges', '3 j'],
            ['Amandine', 'a mis ★★★ sur', 'Trench long cercle', '4 j'],
            ['Cédric', 'a ajouté un article', 'Blouse Loanne — Ecru', '5 j'],
          ].map((e, i) => (
            <div key={i} className="sk-box" style={{ padding: 12, display: 'flex', gap: 12, alignItems: 'center' }}>
              <div className="sk-avatar">{e[0][0]}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, marginBottom: 3 }}>
                  <span style={{ fontWeight: 700 }}>{e[0]}</span> <span style={{ color: 'var(--ink-3)' }}>{e[1]}</span>
                </div>
                <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 2 }}>{e[2]}</div>
                <div style={{ fontSize: 11, color: 'var(--ink-4)' }}>il y a {e[3]}</div>
              </div>
              <div className="sk-img" style={{ width: 60, height: 60, flexShrink: 0 }}></div>
            </div>
          ))}
        </div>
      </div>
      <div className="annotation" style={{ top: 60, right: 20, maxWidth: 120 }}>liste d'événements<br/>(proto actuel)</div>
    </div>
  </Browser>
);

// Feed variant B — Instagram-like product cards, vertical, likes/comments
const FeedSocial = () => (
  <Browser url="toml.app/dashboard/feed">
    <div style={{ height: '100%' }}>
      <TopNav authed active="feed" compact />
      <div style={{ padding: '14px 22px', overflow: 'auto' }}>
        <Stories />
        <div style={{ maxWidth: 480, margin: '0 auto' }}>
          {[
            { u: 'Léa', sub: 'ajouté à · Ma chambre idéale', t: 'Vase céramique beige', p: 45, loves: 3, comments: 2, time: 'il y a 2 h' },
            { u: 'Marc', sub: 'ajouté à · Anniversaire Marc', t: 'Chapeau bob 100% coton', p: 29, loves: 1, comments: 0, time: 'il y a 5 h' },
          ].map((e, i) => (
            <div key={i} className="sk-box" style={{ marginBottom: 16 }}>
              <div style={{ padding: 10, display: 'flex', alignItems: 'center', gap: 10, borderBottom: '1.3px solid var(--ink-3)' }}>
                <div className="sk-avatar">{e.u[0]}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 700 }}>{e.u}</div>
                  <div style={{ fontSize: 11, color: 'var(--ink-3)' }}>{e.sub}</div>
                </div>
                <div style={{ fontSize: 18, color: 'var(--ink-4)' }}>⋯</div>
              </div>
              <div className="sk-img" style={{ height: 340, borderRadius: 0, border: 'none' }}></div>
              <div style={{ padding: 12 }}>
                <div style={{ display: 'flex', gap: 14, marginBottom: 8, fontSize: 18 }}>
                  <span>♡</span>
                  <span>✓</span>
                  <span>?</span>
                  <span style={{ flex: 1 }}></span>
                  <button className="sk-btn sk-btn-sm sk-btn-dark">🎁 Je l'offre</button>
                </div>
                <div style={{ fontSize: 12, color: 'var(--ink-3)', marginBottom: 6 }}>{e.loves} j'adore · {e.comments} commentaires</div>
                <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 2 }}>{e.t} · {e.p} €</div>
                <div style={{ fontSize: 12, color: 'var(--ink-3)', fontStyle: 'italic', marginBottom: 6 }}>« Pour mon salon, coup de cœur »</div>
                <div style={{ fontSize: 10, color: 'var(--ink-4)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{e.time}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="annotation" style={{ top: 180, right: 20, maxWidth: 130 }}>
        ↑ stories =<br/>wishlists récentes<br/>des amis
      </div>
    </div>
  </Browser>
);

// Feed variant C — mixed grid
const FeedGrid = () => (
  <Browser url="toml.app/dashboard/feed">
    <div style={{ height: '100%' }}>
      <TopNav authed active="feed" compact />
      <div style={{ padding: '16px 22px', overflow: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <div style={{ fontFamily: 'var(--sketch-font)', fontWeight: 700, fontSize: 24 }}>Découvrir</div>
          <div style={{ display: 'flex', gap: 6 }}>
            <span className="sk-chip" style={{ background: 'var(--ink)', color: 'var(--paper)', borderColor: 'var(--ink)' }}>Tout</span>
            <span className="sk-chip">Articles</span>
            <span className="sk-chip">Listes</span>
            <span className="sk-chip">Amis</span>
          </div>
        </div>
        <div style={{ columnCount: 3, columnGap: 10 }}>
          {[
            { type: 'item', u: 'Léa', t: 'Vase beige', h: 200 },
            { type: 'list', u: 'Marc', t: 'Anniversaire — 7 articles', h: 140 },
            { type: 'item', u: 'Amandine', t: 'Trench long', h: 280 },
            { type: 'item', u: 'Sophie', t: 'Blouse', h: 220 },
            { type: 'friend', t: 'Thomas veut te suivre', h: 120 },
            { type: 'item', u: 'Papa', t: 'Livre cuisine', h: 180 },
            { type: 'item', u: 'Léa', t: 'Lampe design', h: 240 },
            { type: 'list', u: 'Julie', t: 'Noël — 12 articles', h: 140 },
            { type: 'item', u: 'Marc', t: 'Bougie', h: 180 },
          ].map((c, i) => (
            <div key={i} className="sk-box" style={{ breakInside: 'avoid', marginBottom: 10, padding: 0, overflow: 'hidden' }}>
              {c.type === 'friend' ? (
                <div style={{ padding: 14, textAlign: 'center' }}>
                  <div className="sk-avatar md" style={{ margin: '0 auto 8px' }}>T</div>
                  <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 6 }}>{c.t}</div>
                  <div style={{ display: 'flex', gap: 4, justifyContent: 'center' }}>
                    <button className="sk-btn sk-btn-sm sk-btn-dark">Accepter</button>
                    <button className="sk-btn sk-btn-sm sk-btn-ghost">Refuser</button>
                  </div>
                </div>
              ) : c.type === 'list' ? (
                <div style={{ padding: 12, background: 'var(--paper-2)' }}>
                  <div className="sk-label" style={{ marginBottom: 4 }}>Nouvelle liste</div>
                  <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 4 }}>{c.t}</div>
                  <div style={{ fontSize: 12, color: 'var(--ink-3)' }}>par {c.u}</div>
                </div>
              ) : (
                <>
                  <div className="sk-img" style={{ height: c.h, borderRadius: 0, border: 'none' }}></div>
                  <div style={{ padding: 10 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                      <div className="sk-avatar" style={{ width: 20, height: 20, fontSize: 10 }}>{c.u[0]}</div>
                      <div style={{ fontSize: 12, fontWeight: 700 }}>{c.u}</div>
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--ink-3)' }}>{c.t}</div>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  </Browser>
);

// Variant A — Tabs en haut + alerte demandes en évidence
const FriendsTabs = () => {
  const friends = [
    { n: 'Léa Martin', e: '@lea', lists: 2 },
    { n: 'Marc Durand', e: '@marc', lists: 1 },
    { n: 'Amandine R.', e: '@amandine', lists: 3 },
    { n: 'Julie B.', e: '@julie', lists: 1 },
    { n: 'Papa', e: '@papatara', lists: 2 },
    { n: 'Maman', e: '@mamantara', lists: 1 },
    { n: 'Sophie', e: '@sophie', lists: 2 },
    { n: 'Thomas G.', e: '@thomasg', lists: 1 },
    { n: 'Élodie M.', e: '@elodie', lists: 0 },
    { n: 'Romain T.', e: '@romain', lists: 1 },
  ];
  return (
    <Browser url="toml.app/dashboard/friends">
      <div style={{ height: '100%' }}>
        <TopNav authed active="friends" compact />
        <div style={{ padding: '18px 26px', overflow: 'auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 14 }}>
            <div>
              <div style={{ fontFamily: 'var(--sketch-font)', fontWeight: 700, fontSize: 28 }}>Amis</div>
              <div style={{ fontSize: 13, color: 'var(--ink-3)' }}>32 amis · 3 demandes en attente</div>
            </div>
            <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
              {['W WhatsApp','💬 SMS','✉ Email','◉ Insta','👻 Snap'].map((c,i)=>(
                <button key={i} className="sk-btn sk-btn-sm" style={{ fontSize: 11, padding: '4px 8px' }}>{c}</button>
              ))}
              <button className="sk-btn sk-btn-dark sk-btn-sm">+ Inviter</button>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 0, borderBottom: '1.3px solid var(--ink-4)', marginBottom: 14 }}>
            <div style={{ padding: '8px 14px', borderBottom: '2.5px solid var(--ink)', fontWeight: 700, fontSize: 13, marginBottom: -1 }}>
              MES AMIS · 32
            </div>
            <div style={{ padding: '8px 14px', fontSize: 13, color: 'var(--ink-3)', display: 'flex', alignItems: 'center', gap: 6 }}>
              REÇUES
              <span style={{ background: 'var(--accent)', color: 'var(--paper)', borderRadius: 999, padding: '1px 7px', fontSize: 11, fontWeight: 700 }}>2</span>
            </div>
            <div style={{ padding: '8px 14px', fontSize: 13, color: 'var(--ink-3)' }}>
              ENVOYÉES · 1
            </div>
            <div style={{ padding: '8px 14px', fontSize: 13, color: 'var(--ink-3)' }}>
              SUGGESTIONS · 5
            </div>
          </div>

          {/* Bandeau demandes en évidence — visible quel que soit le nb d'amis */}
          <div className="sk-box" style={{ background: 'var(--accent-soft)', borderColor: 'var(--accent)', padding: 12, marginBottom: 16, display: 'flex', gap: 12, alignItems: 'center' }}>
            <div style={{ display: 'flex' }}>
              <div className="sk-avatar" style={{ borderColor: 'var(--accent)' }}>T</div>
              <div className="sk-avatar" style={{ marginLeft: -10, borderColor: 'var(--accent)' }}>N</div>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: 13 }}>2 personnes veulent t'ajouter</div>
              <div style={{ fontSize: 12, color: 'var(--ink-3)' }}>Thomas et Nathalie</div>
            </div>
            <button className="sk-btn sk-btn-sm">Voir tout →</button>
          </div>

          <div className="input-box" style={{ marginBottom: 14, display: 'flex', alignItems: 'center', gap: 6 }}>
            <span>🔍</span> Rechercher dans mes amis…
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
            {friends.map((f, i) => (
              <div key={i} className="sk-box" style={{ padding: 12, display: 'flex', gap: 10, alignItems: 'center' }}>
                <div className="sk-avatar md">{f.n[0]}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: 14 }}>{f.n}</div>
                  <div style={{ fontSize: 11, color: 'var(--ink-4)' }}>{f.e} · {f.lists} listes</div>
                </div>
                <button className="sk-btn sk-btn-sm sk-btn-ghost">Voir</button>
              </div>
            ))}
          </div>
        </div>
        <div className="annotation" style={{ top: 70, right: 22, maxWidth: 140 }}>
          tabs + bandeau alerte<br/>↓ demandes toujours<br/>visibles
        </div>
      </div>
    </Browser>
  );
};

// Variant B — Layout 2 colonnes : amis principal + sidebar droite avec demandes
const FriendsTwoCol = () => {
  const friends = [
    { n: 'Léa Martin', e: '@lea', lists: 2 },
    { n: 'Marc Durand', e: '@marc', lists: 1 },
    { n: 'Amandine R.', e: '@amandine', lists: 3 },
    { n: 'Julie B.', e: '@julie', lists: 1 },
    { n: 'Papa', e: '@papatara', lists: 2 },
    { n: 'Maman', e: '@mamantara', lists: 1 },
    { n: 'Sophie', e: '@sophie', lists: 2 },
    { n: 'Thomas G.', e: '@thomasg', lists: 1 },
  ];
  return (
    <Browser url="toml.app/dashboard/friends">
      <div style={{ height: '100%' }}>
        <TopNav authed active="friends" compact />
        <div style={{ padding: '18px 24px', overflow: 'auto', display: 'grid', gridTemplateColumns: '1fr 280px', gap: 20 }}>
          {/* MAIN — liste des amis */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 14 }}>
              <div>
                <div style={{ fontFamily: 'var(--sketch-font)', fontWeight: 700, fontSize: 26 }}>Mes amis</div>
                <div style={{ fontSize: 12, color: 'var(--ink-3)' }}>32 personnes</div>
              </div>
              <div style={{ display: 'flex', gap: 6 }}>
                <span className="sk-chip" style={{ background: 'var(--ink)', color: 'var(--paper)', borderColor: 'var(--ink)' }}>A-Z</span>
                <span className="sk-chip">Récents</span>
                <span className="sk-chip">Famille</span>
              </div>
            </div>
            <div className="input-box" style={{ marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
              <span>🔍</span> Rechercher…
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
              {friends.map((f, i) => (
                <div key={i} className="sk-box" style={{ padding: 10, display: 'flex', gap: 8, alignItems: 'center' }}>
                  <div className="sk-avatar md">{f.n[0]}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 700, fontSize: 13, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{f.n}</div>
                    <div style={{ fontSize: 11, color: 'var(--ink-4)' }}>{f.lists} listes</div>
                  </div>
                  <span style={{ fontSize: 16, color: 'var(--ink-4)' }}>⋯</span>
                </div>
              ))}
            </div>
          </div>

          {/* SIDEBAR DROITE — demandes & invitations */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {/* INVITATION — mis en avant en haut */}
            <div className="sk-box" style={{ padding: 14, background: 'var(--ink)', color: 'var(--paper)', borderColor: 'var(--ink)' }}>
              <div className="sk-label" style={{ marginBottom: 6, color: 'var(--paper)', opacity: 0.7 }}>Inviter un proche</div>
              <div style={{ fontFamily: 'var(--sketch-font)', fontWeight: 700, fontSize: 18, lineHeight: 1.1, marginBottom: 10 }}>
                Plus on est<br/>de fous… 🎁
              </div>
              <div style={{ display: 'flex', gap: 4, marginBottom: 10 }}>
                <div className="input-box" style={{ flex: 1, fontFamily: 'var(--mono-font)', fontSize: 11, padding: '5px 8px', color: 'var(--ink-3)', borderColor: 'var(--ink-4)' }}>toml.app/u/cedric</div>
                <button className="sk-btn sk-btn-sm" style={{ background: 'var(--paper)', color: 'var(--ink)', padding: '4px 8px', fontSize: 11 }}>Copier</button>
              </div>
              <div className="sk-label" style={{ color: 'var(--paper)', opacity: 0.6, marginBottom: 6, fontSize: 9 }}>Ou partager via</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 4 }}>
                {[
                  { i: 'W', l: 'WhatsApp' },
                  { i: '💬', l: 'SMS' },
                  { i: '✉', l: 'Email' },
                  { i: '◉', l: 'Insta' },
                  { i: '👻', l: 'Snap' },
                  { i: '⋯', l: 'Autre' },
                ].map((c, i) => (
                  <div key={i} style={{
                    border: '1.3px solid var(--paper)',
                    borderRadius: 6,
                    padding: '6px 4px',
                    textAlign: 'center',
                    background: 'transparent',
                  }}>
                    <div style={{ fontSize: 14, marginBottom: 2 }}>{c.i}</div>
                    <div style={{ fontSize: 10, opacity: 0.85 }}>{c.l}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Demandes reçues */}
            <div className="sk-box" style={{ padding: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <div className="sk-label">Demandes reçues</div>
                <span style={{ background: 'var(--accent)', color: 'var(--paper)', borderRadius: 999, padding: '1px 7px', fontSize: 11, fontWeight: 700 }}>2</span>
              </div>
              {[
                { n: 'Thomas', sub: 'mutuel : Léa' },
                { n: 'Nathalie', sub: 'par email' },
              ].map((r, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <div className="sk-avatar">{r.n[0]}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 700, fontSize: 13 }}>{r.n}</div>
                    <div style={{ fontSize: 10, color: 'var(--ink-4)' }}>{r.sub}</div>
                  </div>
                  <button className="sk-btn sk-btn-sm sk-btn-dark" style={{ padding: '3px 8px', fontSize: 11 }}>✓</button>
                  <button className="sk-btn sk-btn-sm sk-btn-ghost" style={{ padding: '3px 8px', fontSize: 11 }}>✕</button>
                </div>
              ))}
            </div>

            {/* Demandes envoyées */}
            <div className="sk-box" style={{ padding: 14 }}>
              <div className="sk-label" style={{ marginBottom: 10 }}>Envoyées · 1</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, opacity: 0.7 }}>
                <div className="sk-avatar">C</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: 13 }}>Cédric</div>
                  <div style={{ fontSize: 10, color: 'var(--ink-4)' }}>en attente · 2 j</div>
                </div>
                <button className="sk-btn sk-btn-sm sk-btn-ghost" style={{ fontSize: 11, padding: '3px 8px' }}>Annuler</button>
              </div>
            </div>

            {/* Suggestions */}
            <div className="sk-box" style={{ padding: 14 }}>
              <div className="sk-label" style={{ marginBottom: 10 }}>Suggestions</div>
              {[
                { n: 'Sophie', sub: '3 amis en commun' },
                { n: 'Pierre', sub: 'dans tes contacts' },
                { n: 'Marie', sub: '2 amis en commun' },
              ].map((s, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <div className="sk-avatar">{s.n[0]}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 700, fontSize: 13 }}>{s.n}</div>
                    <div style={{ fontSize: 10, color: 'var(--ink-4)' }}>{s.sub}</div>
                  </div>
                  <button className="sk-btn sk-btn-sm" style={{ fontSize: 11, padding: '3px 8px' }}>+ Ajouter</button>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="annotation" style={{ top: 90, right: 24, maxWidth: 110 }}>
          colonne dédiée<br/>aux demandes et<br/>suggestions
        </div>
      </div>
    </Browser>
  );
};

const FriendsScreen = FriendsTabs;

const PublicProfile = () => (
  <Browser url="toml.app/u/lea-martin">
    <div style={{ height: '100%' }}>
      <TopNav authed active="" compact />
      <div style={{ overflow: 'auto' }}>
        <div style={{ padding: '24px 30px', display: 'flex', gap: 22, alignItems: 'center', borderBottom: '1.3px dashed var(--ink-4)' }}>
          <div className="sk-avatar xl">L</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: 'var(--sketch-font)', fontWeight: 700, fontSize: 26 }}>Léa Martin</div>
            <div style={{ fontSize: 13, color: 'var(--ink-3)', marginBottom: 6 }}>@lea · Paris · Anniv : 12 mars</div>
            <div style={{ fontSize: 13, color: 'var(--ink-2)', marginBottom: 10, maxWidth: 400 }}>
              « Je collectionne les envies depuis 2026. Amatrice de mode, déco, bons livres. »
            </div>
            <div style={{ display: 'flex', gap: 20, fontSize: 13 }}>
              <div><span style={{ fontWeight: 700 }}>3</span> <span style={{ color: 'var(--ink-3)' }}>listes</span></div>
              <div><span style={{ fontWeight: 700 }}>24</span> <span style={{ color: 'var(--ink-3)' }}>articles</span></div>
              <div><span style={{ fontWeight: 700 }}>12</span> <span style={{ color: 'var(--ink-3)' }}>amis</span></div>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <button className="sk-btn sk-btn-dark sk-btn-sm">+ Ajouter en ami</button>
            <button className="sk-btn sk-btn-ghost sk-btn-sm">↗ Partager</button>
          </div>
        </div>
        <div style={{ padding: '16px 30px' }}>
          <div style={{ display: 'flex', gap: 18, borderBottom: '1.3px solid var(--ink-4)', marginBottom: 14 }}>
            <div style={{ padding: '8px 0', borderBottom: '2.5px solid var(--ink)', fontWeight: 700, fontSize: 13 }}>LISTES (3)</div>
            <div style={{ padding: '8px 0', fontSize: 13, color: 'var(--ink-3)' }}>ARTICLES (24)</div>
            <div style={{ padding: '8px 0', fontSize: 13, color: 'var(--ink-3)' }}>RÉSERVÉ POUR ELLE</div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
            {[
              { t: 'Ma chambre idéale', n: 8, v: 'Publique' },
              { t: 'Anniversaire 2026', n: 12, v: 'Amis' },
              { t: 'Lecture', n: 4, v: 'Publique' },
            ].map((l, i) => (
              <div key={i} className="sk-box" style={{ padding: 0, overflow: 'hidden' }}>
                <div className="sk-img" style={{ height: 130, borderRadius: 0, border: 'none', borderBottom: '1.3px solid var(--ink-3)' }}></div>
                <div style={{ padding: 10 }}>
                  <div style={{ fontWeight: 700, fontSize: 14 }}>{l.t}</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--ink-3)', marginTop: 3 }}>
                    <span>{l.n} articles</span>
                    <span>{l.v}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="annotation" style={{ top: 30, right: 20, maxWidth: 130 }}>
        layout insta<br/>avatar + stats +<br/>grille de listes
      </div>
    </div>
  </Browser>
);

const Settings = () => (
  <Browser url="toml.app/settings">
    <div style={{ height: '100%' }}>
      <TopNav authed active="" compact />
      <div style={{ display: 'grid', gridTemplateColumns: '180px 1fr', height: 'calc(100% - 46px)' }}>
        <div style={{ borderRight: '1.3px solid var(--ink-4)', padding: 18 }}>
          <div className="sk-label" style={{ marginBottom: 12 }}>Paramètres</div>
          {['Profil', 'Compte', 'Confidentialité', 'Notifications', 'Amis bloqués', 'Supprimer'].map((s, i) => (
            <div key={i} style={{
              padding: '8px 10px',
              borderRadius: 6,
              background: i === 0 ? 'var(--paper-2)' : 'transparent',
              border: i === 0 ? '1.3px solid var(--ink)' : '1.3px solid transparent',
              fontSize: 13,
              marginBottom: 4,
              color: i === 5 ? '#c44' : 'var(--ink)',
            }}>{s}</div>
          ))}
        </div>
        <div style={{ padding: 22, overflow: 'auto' }}>
          <div style={{ fontFamily: 'var(--sketch-font)', fontWeight: 700, fontSize: 22, marginBottom: 16 }}>Profil</div>
          <div style={{ display: 'flex', gap: 16, alignItems: 'center', marginBottom: 22 }}>
            <div className="sk-avatar xl">C</div>
            <div>
              <button className="sk-btn sk-btn-sm">Changer la photo</button>
              <div style={{ fontSize: 11, color: 'var(--ink-4)', marginTop: 4 }}>JPG, PNG · max 2 Mo</div>
            </div>
          </div>
          {[
            { l: 'Prénom', v: 'Cédric' },
            { l: 'Nom d\'utilisateur', v: '@cedric' },
            { l: 'Email', v: 'ce.taravella@gmail.com' },
            { l: 'Date d\'anniversaire', v: '14 juin' },
          ].map((f, i) => (
            <div key={i} style={{ marginBottom: 12 }}>
              <div className="sk-label" style={{ marginBottom: 4 }}>{f.l}</div>
              <div className="input-box">{f.v}</div>
            </div>
          ))}
          <div className="sk-label" style={{ marginBottom: 4 }}>Bio</div>
          <div className="input-box" style={{ minHeight: 60, marginBottom: 20 }}>Amateur de cadeaux bien trouvés.</div>
          <button className="sk-btn sk-btn-dark">Enregistrer les modifications</button>
        </div>
      </div>
    </div>
  </Browser>
);

Object.assign(window, { FeedList, FeedSocial, FeedGrid, FriendsScreen, FriendsTabs, FriendsTwoCol, PublicProfile, Settings });
