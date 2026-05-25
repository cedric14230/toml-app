// Toml Hi-fi Desktop — Profil
// Hero large · stats card stamp · 2-col contenu (gauche : bookmarklet desktop · droite : settings)

const HDStat = ({ value, label }) => (
  <div style={{ flex: 1, textAlign: 'center', padding: '8px 4px' }}>
    <div className="display" style={{ fontSize: 32, marginBottom: 4 }}>{value}</div>
    <div className="label" style={{ fontSize: 10 }}>{label}</div>
  </div>
);

const HDSettingRow = ({ icon, title, value, badge, danger, last, action }) => (
  <div style={{
    display: 'flex', alignItems: 'center', gap: 14,
    padding: '16px 20px',
    borderBottom: last ? 'none' : '1px solid var(--t-line-soft)',
    cursor: 'pointer',
  }}>
    <div style={{
      width: 40, height: 40, borderRadius: 10,
      background: danger ? 'var(--t-rose-soft)' : 'var(--t-bg-2)',
      border: '1px solid var(--t-line)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      flexShrink: 0,
      color: danger ? 'var(--t-danger)' : 'var(--t-ink)',
    }}>
      <TomlIcon name={icon} size={18} />
    </div>
    <div style={{ flex: 1, minWidth: 0 }}>
      <div style={{ fontSize: 14, fontWeight: 700, color: danger ? 'var(--t-danger)' : 'var(--t-ink)' }}>
        {title}
      </div>
      {value && <div style={{ fontSize: 12, color: 'var(--t-ink-3)', marginTop: 2 }}>{value}</div>}
    </div>
    {badge && <span className="chip chip-rose" style={{ fontSize: 10 }}>{badge}</span>}
    {action || (!danger && <TomlIcon name="arrow" size={14} style={{ color: 'var(--t-ink-3)', flexShrink: 0 }} />)}
  </div>
);

const HDProfile = () => (
  <HDShell url="toml.app/profile" active="">
    <div style={{ padding: '32px 40px 60px' }}>
      {/* Hero */}
      <div style={{
        background:
          'radial-gradient(80% 60% at 0% 0%, var(--t-rose-soft) 0%, transparent 60%),' +
          'radial-gradient(70% 60% at 100% 0%, var(--t-mustard-soft) 0%, transparent 60%),' +
          'var(--t-paper)',
        border: '1.5px solid var(--t-ink)',
        borderRadius: 'var(--t-r-xl)',
        boxShadow: 'var(--t-shadow-stamp-lg)',
        padding: 32,
        marginBottom: 28,
        display: 'flex', alignItems: 'center', gap: 32,
      }}>
        <div style={{ position: 'relative', flexShrink: 0 }}>
          <TomlAvatar initial="C" tone={1} size="xl" style={{ width: 120, height: 120, fontSize: 48 }} />
          <button style={{
            position: 'absolute', bottom: 4, right: 4,
            width: 36, height: 36, borderRadius: 999,
            background: 'var(--t-ink)', color: 'var(--t-bg)',
            border: '2px solid var(--t-bg)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', padding: 0,
          }}>
            <TomlIcon name="edit" size={16} />
          </button>
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="label" style={{ marginBottom: 6 }}>Membre depuis octobre 2025</div>
          <h1 className="display-2" style={{ fontSize: 36, marginBottom: 4, letterSpacing: '-0.02em' }}>
            Camille Chapon
          </h1>
          <div style={{ fontSize: 14, color: 'var(--t-ink-3)', fontWeight: 600, marginBottom: 12 }}>
            @camille · camille@chapon.com
          </div>
          <div className="voice" style={{ fontSize: 17, marginBottom: 18, lineHeight: 1.3, maxWidth: 480 }}>
            « Les jolies choses, l'art de vivre, et pas mal de céramique »
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button className="btn btn-primary btn-stamp">
              <TomlIcon name="share" size={14} />
              Partager mon profil
            </button>
            <button className="btn btn-outline">
              <TomlIcon name="edit" size={14} />
              Modifier
            </button>
          </div>
        </div>
        {/* Stats stamp */}
        <div style={{
          display: 'flex', flexDirection: 'column',
          background: 'var(--t-paper)', border: '1.5px solid var(--t-ink)',
          borderRadius: 'var(--t-r-lg)', boxShadow: 'var(--t-shadow-stamp)',
          minWidth: 220, overflow: 'hidden',
        }}>
          <HDStat value="3" label="Wishlists" />
          <div style={{ height: 1, background: 'var(--t-line)' }}></div>
          <HDStat value="24" label="Articles" />
          <div style={{ height: 1, background: 'var(--t-line)' }}></div>
          <HDStat value="18" label="Amis" />
        </div>
      </div>

      {/* 2-col content */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 24 }}>
        {/* LEFT */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Bookmarklet — desktop only */}
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{
              padding: 24, background: 'var(--t-ink)', color: 'var(--t-bg)',
              display: 'flex', alignItems: 'center', gap: 20,
            }}>
              <div style={{
                width: 56, height: 56, borderRadius: 14,
                background: 'var(--t-mustard)', color: 'var(--t-ink)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0, border: '1.5px solid var(--t-bg)',
              }}>
                <TomlIcon name="bookmark" size={26} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="display-2" style={{ fontSize: 20, marginBottom: 4, color: 'var(--t-bg)' }}>
                  Ajoute depuis n'importe où
                </div>
                <div style={{ fontSize: 13, color: 'var(--t-bg-2)', lineHeight: 1.4, marginBottom: 0 }}>
                  Glisse le bookmarklet dans ta barre de favoris, puis clique dessus sur n'importe quelle page produit.
                </div>
              </div>
              <span className="bookmarklet" style={{ flexShrink: 0 }}>+ Ajouter à Toml</span>
            </div>
            <div style={{
              padding: '12px 24px', background: 'var(--t-bg)',
              fontSize: 12, color: 'var(--t-ink-3)', fontWeight: 600,
              display: 'flex', alignItems: 'center', gap: 8,
            }}>
              <span style={{ color: 'var(--t-success)' }}>●</span>
              Compatible avec Chrome, Safari, Firefox, Edge
            </div>
          </div>

          {/* Connexions */}
          <div className="card-soft" style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--t-line-soft)' }}>
              <div className="label">Connexions</div>
            </div>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 14,
              padding: '14px 20px', borderBottom: '1px solid var(--t-line-soft)',
            }}>
              <div style={{
                width: 40, height: 40, borderRadius: 999,
                background: '#25D366', border: '1.5px solid var(--t-ink)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>
                <WhatsAppGlyph size={20} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 700 }}>WhatsApp</div>
                <div style={{ fontSize: 11, color: 'var(--t-success)', marginTop: 1, fontWeight: 600 }}>
                  <span className="dot" style={{ background: 'var(--t-success)', marginRight: 4 }}></span>
                  Connecté · +33 6 12 ••• •••
                </div>
              </div>
              <button className="btn btn-outline btn-sm">Gérer</button>
            </div>
            <HDSettingRow icon="link" title="Extension Chrome" value="Installée et activée" last />
          </div>

          {/* Adresses */}
          <div className="card-soft" style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--t-line-soft)', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <div className="label">Adresses de livraison</div>
              <button className="btn btn-ghost btn-sm" style={{ background: 'transparent', color: 'var(--t-rose)', fontSize: 12, fontWeight: 700, padding: 0 }}>
                + Ajouter
              </button>
            </div>
            <HDSettingRow icon="home" title="Maison" value="12 rue de Charonne · 75011 Paris" badge="Principale" />
            <HDSettingRow icon="gift" title="Chez Maman" value="8 av. des Tilleuls · 31000 Toulouse" last />
          </div>
        </div>

        {/* RIGHT — Settings */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div className="card-soft" style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--t-line-soft)' }}>
              <div className="label">Paramètres</div>
            </div>
            <HDSettingRow icon="bell" title="Notifications" value="Push · Email · Hebdo" badge="3 nouvelles" />
            <HDSettingRow icon="eye" title="Confidentialité" value="Listes par défaut : Amis" />
            <HDSettingRow icon="friends" title="Cercles & invitations" value="4 cercles · 18 amis" />
            <HDSettingRow icon="sparkle" title="Apparence" value="Clair · Sora + Inter" last />
          </div>

          <div className="card-soft" style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--t-line-soft)' }}>
              <div className="label">Compte</div>
            </div>
            <HDSettingRow icon="user" title="Données du compte" value="camille@chapon.com · FR" />
            <HDSettingRow icon="lock" title="Mot de passe & sécurité" value="2FA activée" />
            <HDSettingRow icon="x" title="Se déconnecter" danger last />
          </div>

          <div style={{ textAlign: 'center', padding: '8px 0' }}>
            <div style={{ fontSize: 11, color: 'var(--t-ink-3)', fontWeight: 600, letterSpacing: '0.04em' }}>
              TOML v1.0 · Made in France
            </div>
          </div>
        </div>
      </div>
    </div>
  </HDShell>
);

window.HDProfile = HDProfile;
