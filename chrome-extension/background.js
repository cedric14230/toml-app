/**
 * TOML Chrome Extension — Service Worker (Manifest V3)
 *
 * Remarque : la popup est déclarée dans manifest.json via "default_popup",
 * ce qui signifie que chrome.action.onClicked ne se déclenche plus.
 * Toute la logique métier est désormais dans popup.js.
 *
 * Ce service worker reste déclaré pour permettre d'éventuelles extensions
 * futures (notifications, sync en arrière-plan, etc.).
 */
