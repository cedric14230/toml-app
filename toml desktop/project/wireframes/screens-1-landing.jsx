// Screen wireframes — Landing + Auth + Onboarding

const LandingHero = ({ variant = 'centered' }) => {
  if (variant === 'centered') {
    return (
      <Browser url="toml.app">
        <div style={{ height: '100%', overflow: 'auto' }}>
          <TopNav />
          <div style={{ padding: '60px 40px 40px', textAlign: 'center' }}>
            <div className="sk-label" style={{ marginBottom: 18 }}>Top On My List</div>
            <div style={{ fontFamily: 'var(--sketch-font)', fontWeight: 700, fontSize: 56, lineHeight: 1, marginBottom: 20 }}>
              <div>Vos envies.</div>
              <div style={{ color: 'var(--ink-4)' }}>Partagées.</div>
              <div>Offertes.</div>
            </div>
            <div style={{ maxWidth: 440, margin: '0 auto 26px', fontSize: 15, color: 'var(--ink-3)', lineHeight: 1.4 }}>
              Créez votre wishlist depuis n'importe quel site, partagez-la en un lien, et laissez vos proches vous offrir exactement ce qui vous fait envie.
            </div>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginBottom: 40 }}>
              <button className="sk-btn sk-btn-dark sk-btn-lg">Créer ma wishlist</button>
              <button className="sk-btn sk-btn-lg">Découvrir une wishlist</button>
            </div>
            <div style={{ maxWidth: 520, margin: '0 auto' }}>
              <div className="sk-box" style={{ padding: 20 }}>
                <div className="sk-img" style={{ height: 180, marginBottom: 12 }}></div>
                <div className="sk-line" style={{ width: '70%', marginBottom: 8 }}></div>
                <div className="sk-line-soft" style={{ width: '90%', marginBottom: 6 }}></div>
                <div className="sk-line-soft" style={{ width: '60%' }}></div>
              </div>
            </div>
          </div>
          <div className="annotation" style={{ top: 230, right: 30, maxWidth: 120, textAlign: 'right' }}>
            ← reprend le<br />proto actuel
          </div>
        </div>
      </Browser>
    );
  }
  if (variant === 'split') {
    return (
      <Browser url="toml.app">
        <div style={{ height: '100%' }}>
          <TopNav />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', height: 'calc(100% - 56px)' }}>
            <div style={{ padding: '56px 44px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <div className="sk-label" style={{ marginBottom: 14 }}>Top On My List</div>
              <div style={{ fontFamily: 'var(--sketch-font)', fontWeight: 700, fontSize: 52, lineHeight: 1, marginBottom: 18 }}>
                <div>Vos envies.</div>
                <div style={{ color: 'var(--ink-4)' }}>Partagées.</div>
                <div><span className="sk-underline">Offertes.</span></div>
              </div>
              <div style={{ fontSize: 15, color: 'var(--ink-3)', marginBottom: 24, lineHeight: 1.45, maxWidth: 380 }}>
                Créez votre wishlist depuis n'importe quel site, partagez-la en un lien, et laissez vos proches vous offrir exactement ce qui vous fait envie.
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                <button className="sk-btn sk-btn-dark sk-btn-lg">Créer ma wishlist</button>
                <button className="sk-btn sk-btn-lg">Découvrir une wishlist</button>
              </div>
              <div style={{ marginTop: 28, display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ display: 'flex' }}>
                  {['L','M','A','J'].map((c,i) => (
                    <div key={i} className="sk-avatar" style={{ marginLeft: i? -10:0, background: 'var(--paper-2)' }}>{c}</div>
                  ))}
                </div>
                <div style={{ fontSize: 13, color: 'var(--ink-3)' }}>+ 500 familles nous ont rejoint</div>
              </div>
            </div>
            <div style={{ background: 'var(--paper-2)', borderLeft: '1.5px dashed var(--ink-3)', padding: 30, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
              <div className="sk-box tilt-l" style={{ width: 240, padding: 14, position: 'absolute', top: 40, left: 30, background: 'var(--paper)' }}>
                <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 10 }}>
                  <div className="sk-avatar">S</div>
                  <div style={{ fontSize: 13, fontWeight: 700 }}>Sophie · Noël</div>
                </div>
                <div className="sk-img" style={{ height: 120, marginBottom: 8 }}></div>
                <div className="sk-line" style={{ width: '80%', marginBottom: 6 }}></div>
                <div className="sk-line-soft" style={{ width: '50%' }}></div>
              </div>
              <div className="sk-box tilt-r" style={{ width: 230, padding: 14, position: 'absolute', bottom: 30, right: 20, background: 'var(--paper)' }}>
                <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 10 }}>
                  <div className="sk-avatar">T</div>
                  <div style={{ fontSize: 13, fontWeight: 700 }}>Thomas · Anniv</div>
                </div>
                <div className="sk-img" style={{ height: 110, marginBottom: 8 }}></div>
                <div className="sk-chip"><span className="status-dot reserved"></span>Réservé</div>
              </div>
              <div className="annotation" style={{ top: 20, right: 20 }}>2 wishlists<br/>superposées</div>
            </div>
          </div>
        </div>
      </Browser>
    );
  }
  // variant 'editorial'
  return (
    <Browser url="toml.app">
      <div style={{ height: '100%', overflow: 'auto' }}>
        <TopNav />
        <div style={{ padding: '32px 40px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 20 }}>
            <div className="sk-label">Chapitre 01 — La wishlist moderne</div>
            <div className="sk-label">Avril 2026</div>
          </div>
          <div style={{ borderTop: '1.5px solid var(--ink)', borderBottom: '1.5px solid var(--ink)', padding: '28px 0' }}>
            <div style={{ fontFamily: 'var(--sketch-font)', fontWeight: 700, fontSize: 62, lineHeight: 0.98, marginBottom: 16 }}>
              Ce qui fait plaisir,<br/>
              <span style={{ fontStyle: 'italic', color: 'var(--ink-3)' }}>quand ça fait vraiment plaisir.</span>
            </div>
            <div style={{ fontSize: 15, color: 'var(--ink-3)', maxWidth: 520, marginBottom: 20 }}>
              TOML rassemble toutes vos envies, où qu'elles soient, en une seule liste que vos proches peuvent consulter et réserver — sans gâcher la surprise.
            </div>
            <button className="sk-btn sk-btn-dark sk-btn-lg">Commencer ma liste →</button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, marginTop: 22 }}>
            {['Capture depuis partout','Partage en 1 lien','Réserve en secret'].map((t,i) => (
              <div key={i} className="sk-box" style={{ padding: 14 }}>
                <div className="sk-label" style={{ marginBottom: 6 }}>0{i+1}</div>
                <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 6 }}>{t}</div>
                <div className="sk-line-soft" style={{ width: '90%', marginBottom: 4 }}></div>
                <div className="sk-line-soft" style={{ width: '70%' }}></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Browser>
  );
};

const AuthScreen = ({ variant = 'classic' }) => {
  if (variant === 'classic') {
    return (
      <Browser url="toml.app/signup">
        <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
          <TopNav compact />
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 30 }}>
            <div className="sk-box" style={{ width: 340, padding: 26 }}>
              <div style={{ fontFamily: 'var(--sketch-font)', fontWeight: 700, fontSize: 24, marginBottom: 6 }}>Créer mon compte</div>
              <div style={{ fontSize: 13, color: 'var(--ink-3)', marginBottom: 18 }}>Ta wishlist en 2 min.</div>
              <button className="sk-btn" style={{ width: '100%', marginBottom: 8, justifyContent: 'flex-start', padding: '10px 14px' }}>
                <span style={{ width: 18, height: 18, border: '1.3px solid var(--ink)', borderRadius: 4, display: 'inline-block', marginRight: 8 }}></span>
                Continuer avec Google
              </button>
              <button className="sk-btn sk-btn-ghost" style={{ width: '100%', marginBottom: 14, justifyContent: 'flex-start', padding: '10px 14px' }}>
                <span style={{ width: 18, height: 18, border: '1.3px solid var(--ink-3)', borderRadius: 4, display: 'inline-block', marginRight: 8 }}></span>
                Continuer avec Facebook
              </button>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                <div className="sk-line-soft" style={{ flex: 1 }}></div>
                <span className="sk-label">ou</span>
                <div className="sk-line-soft" style={{ flex: 1 }}></div>
              </div>
              <div className="input-box" style={{ marginBottom: 8 }}>Email</div>
              <div className="input-box" style={{ marginBottom: 14 }}>Mot de passe</div>
              <button className="sk-btn sk-btn-dark" style={{ width: '100%' }}>Créer mon compte</button>
              <div style={{ fontSize: 12, color: 'var(--ink-4)', marginTop: 14, textAlign: 'center' }}>Déjà un compte ? <span style={{ textDecoration: 'underline', color: 'var(--ink)' }}>Se connecter</span></div>
            </div>
          </div>
        </div>
      </Browser>
    );
  }
  // variant 'social-first' — huge google button, promise-led
  return (
    <Browser url="toml.app/signup">
      <div style={{ height: '100%', display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
        <div style={{ background: 'var(--ink)', color: 'var(--paper)', padding: 40, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <Logo size={22} />
          <div>
            <div style={{ fontFamily: 'var(--sketch-font)', fontWeight: 700, fontSize: 36, lineHeight: 1.05, marginBottom: 14 }}>
              Rejoindre<br/>ma famille<br/>sur TOML.
            </div>
            <div style={{ fontSize: 14, opacity: 0.7, maxWidth: 260 }}>
              3 proches de toi ont déjà une wishlist en attente.
            </div>
          </div>
          <div style={{ display: 'flex', gap: -10, alignItems: 'center' }}>
            {['L','M','A'].map((c,i) => (
              <div key={i} className="sk-avatar" style={{
                marginLeft: i? -10:0, background: 'var(--ink-2)', color: 'var(--paper)', borderColor: 'var(--paper)'
              }}>{c}</div>
            ))}
            <div style={{ marginLeft: 10, fontSize: 13, opacity: 0.7 }}>Léa, Marc, Amandine</div>
          </div>
        </div>
        <div style={{ padding: 40, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div className="sk-label" style={{ marginBottom: 10 }}>Inscription express</div>
          <div style={{ fontFamily: 'var(--sketch-font)', fontWeight: 700, fontSize: 26, marginBottom: 18 }}>
            3 secondes chrono.
          </div>
          <button className="sk-btn sk-btn-lg" style={{ marginBottom: 10, justifyContent: 'center' }}>G · Continuer avec Google</button>
          <button className="sk-btn sk-btn-ghost sk-btn-lg" style={{ marginBottom: 20, justifyContent: 'center' }}>✉︎ Continuer par email</button>
          <div style={{ fontSize: 12, color: 'var(--ink-4)', maxWidth: 260 }}>
            En continuant, tu acceptes les CGU et notre politique de confidentialité.
          </div>
        </div>
      </div>
    </Browser>
  );
};

const OnboardingScreen = ({ variant = 'guided' }) => {
  if (variant === 'guided') {
    return (
      <Browser url="toml.app/onboarding">
        <div style={{ height: '100%' }}>
          <TopNav compact />
          <div style={{ padding: 24 }}>
            <div style={{ display: 'flex', gap: 6, marginBottom: 22, justifyContent: 'center' }}>
              {[1,2,3,4].map(i => (
                <div key={i} style={{ width: 32, height: 4, borderRadius: 2, background: i <= 2 ? 'var(--ink)' : 'var(--ink-4)', opacity: i <= 2 ? 1 : 0.3 }}></div>
              ))}
            </div>
            <div style={{ maxWidth: 480, margin: '0 auto', textAlign: 'center' }}>
              <div className="sk-label" style={{ marginBottom: 8 }}>Étape 2 / 4</div>
              <div style={{ fontFamily: 'var(--sketch-font)', fontWeight: 700, fontSize: 28, marginBottom: 6 }}>
                Nommons ta première liste.
              </div>
              <div style={{ fontSize: 14, color: 'var(--ink-3)', marginBottom: 22 }}>
                Tu pourras en créer d'autres plus tard — anniversaire, Noël, déco…
              </div>
              <div className="input-box" style={{ marginBottom: 10, textAlign: 'left', fontSize: 18, padding: '12px 16px' }}>Mes envies du moment</div>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', justifyContent: 'center', marginBottom: 22 }}>
                {['🎂 Anniv','🎄 Noël','🏠 Déco','📚 Lecture','💭 Idées'].map(t => (
                  <span key={t} className="sk-chip">{t}</span>
                ))}
              </div>
              <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
                <button className="sk-btn sk-btn-ghost">← Retour</button>
                <button className="sk-btn sk-btn-dark">Continuer →</button>
              </div>
            </div>
          </div>
          <div className="annotation" style={{ top: 60, left: 30, maxWidth: 130 }}>
            ↑ progress bar<br/>type Insta stories
          </div>
        </div>
      </Browser>
    );
  }
  if (variant === 'capture') {
    return (
      <Browser url="toml.app/onboarding">
        <div style={{ height: '100%' }}>
          <TopNav compact />
          <div style={{ padding: 22 }}>
            <div style={{ display: 'flex', gap: 6, marginBottom: 18, justifyContent: 'center' }}>
              {[1,2,3,4].map(i => (
                <div key={i} style={{ width: 32, height: 4, borderRadius: 2, background: i <= 3 ? 'var(--ink)' : 'var(--ink-4)', opacity: i <= 3 ? 1 : 0.3 }}></div>
              ))}
            </div>
            <div style={{ maxWidth: 600, margin: '0 auto' }}>
              <div style={{ fontFamily: 'var(--sketch-font)', fontWeight: 700, fontSize: 24, marginBottom: 6, textAlign: 'center' }}>
                3 façons d'ajouter un article.
              </div>
              <div style={{ fontSize: 13, color: 'var(--ink-3)', textAlign: 'center', marginBottom: 20 }}>
                Essaie celle qui te va le mieux.
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
                <div className="sk-box" style={{ padding: 14 }}>
                  <div className="sk-label" style={{ marginBottom: 6 }}>① Si tu as un lien</div>
                  <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 6 }}>Coller l'URL</div>
                  <div style={{ fontSize: 11, color: 'var(--ink-3)', marginBottom: 8, lineHeight: 1.35 }}>
                    Copie l'adresse d'une page produit, on devine le reste (image, prix, titre).
                  </div>
                  <div className="input-box" style={{ fontSize: 11, padding: '6px 10px' }}>https://…</div>
                </div>
                <div className="sk-box" style={{ padding: 14, borderWidth: 2 }}>
                  <div className="sk-label" style={{ marginBottom: 6, color: 'var(--accent)' }}>② Recommandé</div>
                  <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 6 }}>Le bouton magique</div>
                  <div style={{ fontSize: 11, color: 'var(--ink-3)', marginBottom: 8, lineHeight: 1.35 }}>
                    Glisse ce bouton dans ta barre de favoris. Sur n'importe quel site, un clic et l'article rejoint ta liste.
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <div className="bookmarklet">+ Ajouter à TOML</div>
                    <span style={{ fontFamily: 'var(--hand-font)', fontSize: 13, color: 'var(--accent)' }}>← glisse-moi !</span>
                  </div>
                </div>
                <div className="sk-box" style={{ padding: 14 }}>
                  <div className="sk-label" style={{ marginBottom: 6 }}>③ Sans lien</div>
                  <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 6 }}>À la main</div>
                  <div style={{ fontSize: 11, color: 'var(--ink-3)', marginBottom: 8, lineHeight: 1.35 }}>
                    Une idée vue en boutique ? Note le titre, ajoute une photo, c'est tout.
                  </div>
                  <div className="sk-dashed" style={{ height: 38, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--ink-4)', fontSize: 12 }}>+ Saisie libre</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginTop: 22 }}>
                <button className="sk-btn sk-btn-ghost">Passer</button>
                <button className="sk-btn sk-btn-dark">Ajouter mon 1er article →</button>
              </div>
            </div>
          </div>
        </div>
      </Browser>
    );
  }
  // variant 'invite'
  return (
    <Browser url="toml.app/onboarding">
      <div style={{ height: '100%' }}>
        <TopNav compact />
        <div style={{ padding: 24, maxWidth: 520, margin: '0 auto', textAlign: 'center' }}>
          <div style={{ display: 'flex', gap: 6, marginBottom: 18, justifyContent: 'center' }}>
            {[1,2,3,4].map(i => (
              <div key={i} style={{ width: 32, height: 4, borderRadius: 2, background: 'var(--ink)', opacity: i <= 4 ? 1 : 0.3 }}></div>
            ))}
          </div>
          <div className="sk-label" style={{ marginBottom: 8 }}>Étape 4 / 4 — Dernière</div>
          <div style={{ fontFamily: 'var(--sketch-font)', fontWeight: 700, fontSize: 28, marginBottom: 10 }}>Qui va voir ta liste ?</div>
          <div style={{ fontSize: 13, color: 'var(--ink-3)', marginBottom: 20 }}>
            Invite au moins une personne pour que la magie opère.
          </div>
          <div className="sk-box" style={{ padding: 16, textAlign: 'left', marginBottom: 12 }}>
            <div className="sk-label" style={{ marginBottom: 8 }}>Partager le lien</div>
            <div style={{ display: 'flex', gap: 6 }}>
              <div className="input-box" style={{ flex: 1, fontFamily: 'var(--mono-font)', fontSize: 11 }}>toml.app/s/abc123</div>
              <button className="sk-btn sk-btn-sm">Copier</button>
            </div>
          </div>
          <div className="sk-box" style={{ padding: 16, textAlign: 'left', marginBottom: 12 }}>
            <div className="sk-label" style={{ marginBottom: 10 }}>Envoyer via…</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 6 }}>
              {[
                { i: 'W', l: 'WhatsApp' },
                { i: '💬', l: 'SMS' },
                { i: '✉', l: 'Email' },
                { i: '◉', l: 'Instagram' },
                { i: '👻', l: 'Snap' },
                { i: 'M', l: 'Messenger' },
              ].map((c, i) => (
                <div key={i} style={{
                  border: '1.3px solid var(--ink-3)',
                  borderRadius: 8,
                  padding: '8px 4px',
                  textAlign: 'center',
                  background: 'var(--paper)',
                }}>
                  <div style={{ fontSize: 16, marginBottom: 3, lineHeight: 1 }}>{c.i}</div>
                  <div style={{ fontSize: 10, color: 'var(--ink-3)' }}>{c.l}</div>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 10, fontSize: 11, color: 'var(--ink-4)' }}>
              <span style={{ fontSize: 14 }}>↗</span> Ouvre l'app native avec un message pré-rempli
            </div>
          </div>
          <div className="sk-box" style={{ padding: 16, textAlign: 'left', marginBottom: 18 }}>
            <div className="sk-label" style={{ marginBottom: 8 }}>Ou inviter par email (envoi groupé)</div>
            <div className="input-box" style={{ fontSize: 12, marginBottom: 6 }}>mamie@famille.fr, sophie@…</div>
            <button className="sk-btn sk-btn-sm">Envoyer les invitations</button>
          </div>
          <button className="sk-btn sk-btn-dark sk-btn-lg" style={{ width: '100%' }}>Terminer →</button>
          <div style={{ marginTop: 10, fontSize: 12, color: 'var(--ink-4)' }}>Je partagerai plus tard</div>
        </div>
      </div>
    </Browser>
  );
};

Object.assign(window, { LandingHero, AuthScreen, OnboardingScreen });
