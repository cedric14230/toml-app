# Toml Design System

Design system Toml v1 — palette « Bleu glacé · Denim · Rose terre ».
Pensé pour des produits chaleureux, familiaux, à mi-chemin entre Snap et un carnet personnel.

---

## 📦 Contenu du package

```
toml-ds/
├── toml.css          ← tokens (couleurs, typo, radii, ombres) + classes utilitaires
├── toml-icons.jsx    ← <TomlIcon name=… size=… />   (27 icônes line)
├── toml-kit.jsx      ← Composants React : Button, Card, Chip, Sticker, Avatar, …
├── README.md         ← (vous y êtes)
└── example.html      ← starter minimal copiable
```

Les sections-1/2/3.jsx + styles.css sont l'app de showcase, **pas** le package.
Pour utiliser le DS, vous n'avez besoin que des 3 fichiers ci-dessus.

---

## 🚀 Importer dans un nouveau projet

### 1. Copier les fichiers

Depuis ce projet, copier le dossier `toml-ds/` (au minimum `toml.css`, `toml-kit.jsx`, `toml-icons.jsx`) à la racine du projet cible.

Via l'agent : *« copie `/projects/019df861-3506-7e8c-8984-aae5a113556a/toml-ds/` dans `toml-ds/` »*.

### 2. Ajouter les script tags

```html
<!doctype html>
<html lang="fr">
<head>
  <meta charset="utf-8" />
  <link rel="stylesheet" href="toml-ds/toml.css" />

  <!-- React + Babel (versions pinned) -->
  <script src="https://unpkg.com/react@18.3.1/umd/react.development.js"></script>
  <script src="https://unpkg.com/react-dom@18.3.1/umd/react-dom.development.js"></script>
  <script src="https://unpkg.com/@babel/standalone@7.29.0/babel.min.js"></script>
</head>
<body>
  <div id="root"></div>

  <!-- Kit Toml (icons AVANT kit, car kit utilise <TomlIcon>) -->
  <script type="text/babel" src="toml-ds/toml-icons.jsx"></script>
  <script type="text/babel" src="toml-ds/toml-kit.jsx"></script>

  <script type="text/babel">
    function App() {
      return (
        <TomlRoot style={{ padding: 40, minHeight: '100vh' }}>
          <h1 className="display" style={{ fontSize: 64 }}>Toml.</h1>
          <TomlButton>Créer ma wishlist</TomlButton>
        </TomlRoot>
      );
    }
    ReactDOM.createRoot(document.getElementById('root')).render(<App />);
  </script>
</body>
</html>
```

⚠️ **Toujours wrapper votre UI dans `<TomlRoot>`** (= `<div class="toml-ds">`).
C'est ce wrapper qui active le scope CSS : police, fond, couleur d'encre, *box-sizing*.

---

## 🎨 Design tokens (variables CSS)

Toutes les valeurs sont exposées en custom properties — utilisables aussi en CSS pur.

```css
/* Couleurs */
var(--t-bg)      /* #e6ecf2  fond principal      */
var(--t-paper)   /* #ffffff  cards, inputs        */
var(--t-ink)     /* #1a1f2e  texte, bordures      */
var(--t-denim)   /* #5a6f9c  CTA secondaire        */
var(--t-rose)    /* #c47884  accent émotionnel    */
var(--t-mustard) /* #d4a73c  priorité, étoiles    */

/* Typo */
var(--t-font-display)  /* Sora                 */
var(--t-font-ui)       /* Inter                */
var(--t-font-hand)     /* Sora italic (notes)  */

/* Radii */
var(--t-r-xs / sm / md / lg / xl / pill)

/* Espacements (échelle base 4) */
var(--t-s-1 … --t-s-16)

/* Ombres */
var(--t-shadow-stamp)   /* 3px noir plein — signature */
var(--t-shadow-stamp-lg)
var(--t-shadow-sm)
```

---

## 🧱 Composants disponibles

| Composant            | Usage rapide                                       |
| -------------------- | -------------------------------------------------- |
| `<TomlRoot>`         | Wrapper obligatoire à la racine de l'app           |
| `<TomlButton>`       | `variant`: primary / accent / rose / outline / ghost · `size`: sm / lg · `stamp` |
| `<TomlIconButton>`   | Rond, icône seule                                  |
| `<TomlInput>`        | Champ texte (`soft` = bord léger)                  |
| `<TomlTextarea>`     | Multi-lignes                                       |
| `<TomlChip>`         | `variant`: mustard / rose / denim · `active`        |
| `<TomlBadge>`        | Compteur ou point (`dot`)                          |
| `<TomlSticker>`      | Tampon italique tilté · `variant`: rose / denim / soft |
| `<TomlHand>`         | Note en Sora italique rose terre                   |
| `<TomlCard>`         | `variant`: stamp / soft / flat                     |
| `<TomlAvatar>`       | `initial`, `size`: xs/sm/md/lg/xl, `tone` 1-5      |
| `<TomlAvatarStack>`  | Pile d'avatars avec `+N`                           |
| `<TomlStars>`        | Priorité 1-3                                       |
| `<TomlDot>`          | `status`: available / reserved / gifted            |
| `<TomlDivider>`      | Trait fin (option `dashed`)                        |
| `<TomlImage>`        | Placeholder dégradé (`tone` 1-6)                   |
| `<TomlLabel>`        | Eyebrow uppercase 11px                             |
| `<TomlToast>`        | Notif succès                                       |
| `<TomlGiverBanner>`  | Bandeau « tu consultes la wishlist de … »          |
| `<TomlBookmarklet>`  | Pastille « + Ajouter à Toml »                      |
| `<TomlIcon>`         | 27 icônes line — `name`, `size`, `stroke`          |

Voir `example.html` pour les snippets complets.

---

## ✅ À faire / ❌ À éviter

- ✅ Encre `#1a1f2e` pour les CTAs principaux, **toujours** avec ombre stamp.
- ✅ Soleil `#f5c948` réservé aux stickers / highlights / étoiles — **jamais** en fond.
- ✅ Rose terre = ce qui est personnel (notes manuscrites, auteur).
- ✅ Sora italique colorée (rose terre) pour les notes personnelles — **jamais** d'UI structurelle.
- ✅ Pas de fausse écriture manuscrite : on assume le geste typographique.
- ❌ Pas d'emojis dans les CTAs critiques.
- ❌ Pas de saturations vives en fond plein.
- ❌ Pas plus de 2 polices d'affichage par écran.

---

## 🗣️ Microcopy — règles d'or

- **Tu**, jamais vous.
- Court, concret : « Crée ta liste » > « Initiez votre procédure ».
- 1 emoji max par message, et seulement comme accent.

Voir la section *Identité éditoriale* dans `Toml Design System.html` pour les tableaux avant/après.

---

## 🆔 Versioning

**v1.0** — Mai 2026 · palette Snap Family · 1ère exposition publique du système.
