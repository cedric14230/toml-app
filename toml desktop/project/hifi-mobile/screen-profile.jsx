// Toml Hi-fi Mobile — Profil
// Hero avatar XL + voice · Stats · Bookmarklet · WhatsApp status · Settings list

const HMProfileStat = ({ value, label }) => (
  <div style={{ flex: 1, textAlign: 'center', padding: '4px 0' }}>
    <div className="display" style={{ fontSize: 24, marginBottom: 2 }}>{value}</div>
    <div className="label" style={{ fontSize: 10 }}>{label}</div>
  </div>
);

const HMSettingRow = ({ icon, title, value, badge, danger, last }) => (
  <div style={{
    display: 'flex', alignItems: 'center', gap: 14,
    padding: '14px 18px',
    borderBottom: last ? 'none' : '1px solid var(--t-line-soft)',
    cursor: 'pointer',
  }}>
    <div style={{
      width: 36, height: 36, borderRadius: 10,
      background: danger ? 'var(--t-rose-soft)' : 'var(--t-bg-2)',
      border: '1px solid var(--t-line)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      flexShrink: 0,
      color: danger ? 'var(--t-danger)' : 'var(--t-ink)',
    }}>
      <TomlIcon name={icon} size={18} />
    </div>
    <div style={{ flex: 1, minWidth: 0 }}>
      <div style={{ fontSize: 14, fontWeight: 600, color: danger ? 'var(--t-danger)' : 'var(--t-ink)' }}>
        {title}
      </div>
      {value && <div style={{ fontSize: 11, color: 'var(--t-ink-3)', marginTop: 1 }}>{value}</div>}
    </div>
    {badge && <span className="chip chip-rose" style={{ fontSize: 10 }}>{badge}</span>}
    {!danger && <TomlIcon name="arrow" size={14} style={{ color: 'var(--t-ink-3)', flexShrink: 0 }} />}
  </div>
);

const HMProfile = ({ whatsappConnected = false }) => (
  <HMShell active="profile">
    <HMTopBar
      left={<div className="display-2" style={{ fontSize: 22 }}>Profil</div>}
      right={
        <button className="btn btn-ghost" style={{
          width: 38, height: 38, padding: 0, borderRadius: 999,
          background: 'var(--t-paper)', border: '1px solid var(--t-line)',
        }}>
          <TomlIcon name="settings" size={18} />
        </button>
      }
    />

    {/* Hero */}
    <div style={{
      padding: '20px 24px 24px',
      background:
        'radial-gradient(120% 70% at 0% 0%, var(--t-rose-soft) 0%, transparent 55%),' +
        'radial-gradient(110% 70% at 100% 0%, var(--t-mustard-soft) 0%, transparent 55%),' +
        'var(--t-bg)',
      borderBottom: '1px solid var(--t-line-soft)',
      position: 'relative',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <div style={{ position: 'relative' }}>
          <TomlAvatar initial="C" tone={1} size="xl" />
          <button style={{
            position: 'absolute', bottom: 0, right: 0,
            width: 30, height: 30, borderRadius: 999,
            background: 'var(--t-ink)', color: 'var(--t-bg)',
            border: '2px solid var(--t-bg)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', padding: 0,
          }}>
            <TomlIcon name="edit" size={14} />
          </button>
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="display-2" style={{ fontSize: 22, marginBottom: 2 }}>Camille Chapon</div>
          <div style={{ fontSize: 13, color: 'var(--t-ink-3)', fontWeight: 600 }}>@camille</div>
          <div className="voice" style={{ fontSize: 14, marginTop: 6, lineHeight: 1.3 }}>
            « Les jolies choses, l'art de vivre, et pas mal de céramique »
          </div>
        </div>
      </div>

      {/* Stats */}
      <div style={{
        display: 'flex', marginTop: 20,
        background: 'var(--t-paper)', border: '1.5px solid var(--t-ink)',
        borderRadius: 'var(--t-r-lg)', boxShadow: 'var(--t-shadow-stamp)',
        overflow: 'hidden',
      }}>
        <HMProfileStat value="3" label="Wishlists" />
        <div style={{ width: 1, background: 'var(--t-line)' }}></div>
        <HMProfileStat value="24" label="Articles" />
        <div style={{ width: 1, background: 'var(--t-line)' }}></div>
        <HMProfileStat value="18" label="Amis" />
      </div>

      <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
        <button className="btn btn-outline btn-sm" style={{ flex: 1 }}>
          <TomlIcon name="share" size={13} />
          Partager mon profil
        </button>
        <button className="btn btn-ghost btn-sm" style={{
          width: 38, height: 36, padding: 0,
          background: 'var(--t-paper)', border: '1px solid var(--t-line)',
        }}>
          <TomlIcon name="link" size={15} />
        </button>
      </div>
    </div>

    {/* WhatsApp onboarding — uniquement si pas encore connecté (le bookmarklet est desktop-only) */}
    {!whatsappConnected && (
      <div style={{ padding: '20px 18px 6px' }}>
        <HMWhatsAppCard />
      </div>
    )}

    {/* Connexions */}
    <div style={{ padding: '8px 18px 10px' }}>
      <div className="label">Connexions</div>
    </div>
    <div style={{ background: 'var(--t-paper)', borderTop: '1px solid var(--t-line-soft)', borderBottom: '1px solid var(--t-line-soft)' }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 14,
        padding: '14px 18px', borderBottom: '1px solid var(--t-line-soft)',
      }}>
        <div style={{
          width: 36, height: 36, borderRadius: 999,
          background: '#25D366', border: '1.5px solid var(--t-ink)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
        }}>
          <WhatsAppGlyph size={18} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 14, fontWeight: 600 }}>WhatsApp</div>
          {whatsappConnected ? (
            <div style={{ fontSize: 11, color: 'var(--t-success)', marginTop: 1, fontWeight: 600 }}>
              <span className="dot" style={{ background: 'var(--t-success)', marginRight: 4 }}></span>
              Connecté · +33 6 12 ••• •••
            </div>
          ) : (
            <div style={{ fontSize: 11, color: 'var(--t-ink-3)', marginTop: 1, fontWeight: 600 }}>
              Non connecté
            </div>
          )}
        </div>
        <button className="btn btn-ghost btn-sm" style={{ background: 'transparent', color: 'var(--t-ink-3)' }}>
          {whatsappConnected ? 'Gérer' : 'Connecter'}
        </button>
      </div>
      <HMSettingRow icon="link" title="Extension navigateur" value="Chrome · activée" last />
    </div>

    {/* Paramètres */}
    <div style={{ padding: '20px 18px 10px' }}>
      <div className="label">Paramètres</div>
    </div>
    <div style={{ background: 'var(--t-paper)', borderTop: '1px solid var(--t-line-soft)', borderBottom: '1px solid var(--t-line-soft)' }}>
      <HMSettingRow icon="bell" title="Notifications" value="Push · Email" badge="3 nouvelles" />
      <HMSettingRow icon="eye" title="Confidentialité" value="Listes par défaut : Amis" />
      <HMSettingRow icon="friends" title="Cercles & invitations" value="4 cercles · 18 amis" />
      <HMSettingRow icon="gift" title="Adresses de livraison" value="2 adresses enregistrées" />
      <HMSettingRow icon="sparkle" title="Apparence" value="Clair · Sora + Inter" last />
    </div>

    {/* Compte */}
    <div style={{ padding: '20px 18px 10px' }}>
      <div className="label">Compte</div>
    </div>
    <div style={{ background: 'var(--t-paper)', borderTop: '1px solid var(--t-line-soft)', borderBottom: '1px solid var(--t-line-soft)' }}>
      <HMSettingRow icon="user" title="Données du compte" value="camille@chapon.com" />
      <HMSettingRow icon="x" title="Se déconnecter" danger last />
    </div>

    <div style={{ padding: '24px 18px 30px', textAlign: 'center' }}>
      <div style={{ fontSize: 11, color: 'var(--t-ink-3)', fontWeight: 600, letterSpacing: '0.04em' }}>
        TOML v1.0 · Made in France
      </div>
    </div>
  </HMShell>
);

window.HMProfile = HMProfile;
