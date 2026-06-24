/**
 * Viral Stick — API Configuration
 * Gère automatiquement l'URL selon l'environnement :
 *   - Production Vercel : https://viral-stick.vercel.app
 *   - Dev local        : http://10.0.2.2:3000  (Android emulator)
 *                        http://localhost:3000  (iOS simulator)
 */

import { Platform } from "react-native";

// ──────────────────────────────────────────────
// Mets à true pour forcer le backend de production
// même en mode développement local.
// ──────────────────────────────────────────────
const USE_PROD_IN_DEV = true;

const PRODUCTION_URL = "https://viral-stick.vercel.app";

// Sur Android l'emulateur mappe 10.0.2.2 → localhost machine hôte
const LOCAL_URL =
  Platform.OS === "android"
    ? "http://10.0.2.2:3000"
    : "http://localhost:3000";

/**
 * Retourne l'URL complète d'un endpoint.
 * @param {string} path  - ex: "/api/memes/generate-from-text"
 * @returns {string}
 */
export function apiUrl(path = "") {
  const isDev = __DEV__;
  const base = (isDev && !USE_PROD_IN_DEV) ? LOCAL_URL : PRODUCTION_URL;

  // Évite les doubles slashes
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${base}${cleanPath}`;
}

export default apiUrl;
