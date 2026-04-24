# TOML Chrome Extension

Extension Chrome (Manifest V3) qui ajoute l'article affiché sur la page active à votre wishlist TOML en un seul clic.

## Comment ça marche

1. Vous naviguez sur n'importe quelle page produit (Zara, Amazon, Sézane…)
2. Vous cliquez sur l'icône **T** dans la barre Chrome
3. Un nouvel onglet s'ouvre sur `toml-app.vercel.app/add-item`, pré-rempli avec le titre, l'image, le prix et l'URL source détectés automatiquement (via les OG tags et le schema JSON-LD de la page)

## Installation (mode développeur)

> Aucun passage par le Chrome Web Store requis.

1. **Téléchargez** ce dossier `chrome-extension/` sur votre machine (ou clonez le dépôt entier)
2. Ouvrez Chrome et allez sur **`chrome://extensions`**
3. Activez le **Mode développeur** (interrupteur en haut à droite)
4. Cliquez sur **"Charger l'extension non empaquetée"**
5. Sélectionnez le dossier `chrome-extension/`

L'icône TOML apparaît alors dans votre barre d'outils Chrome.

> **Conseil** : épinglez l'icône via le menu puzzle (🧩) pour y accéder facilement.

## Régénérer les icônes

Les icônes PNG sont incluses dans `icons/`. Pour les régénérer depuis zéro :

```bash
node generate-icons.js
```

Requiert uniquement Node.js (modules natifs, aucune dépendance externe).

## Contenu du dossier

```
chrome-extension/
├── manifest.json         Déclaration Manifest V3
├── background.js         Service worker — lecture OG + JSON-LD, ouverture onglet
├── generate-icons.js     Utilitaire Node.js pour (re)générer les PNG
├── icons/
│   ├── icon16.png
│   ├── icon48.png
│   └── icon128.png
└── README.md
```

## Permissions requises

| Permission    | Raison |
|---------------|--------|
| `activeTab`   | Lire l'URL de l'onglet actif |
| `scripting`   | Injecter le script de lecture des OG tags dans la page |
