/**
 * Viral Stick — API Configuration
 * Gère automatiquement l'URL selon l'environnement :
 *   - Production Vercel : https://viral-stick.vercel.app
 *   - Dev local        : http://10.0.2.2:3000  (Android emulator)
 *                        http://localhost:3000  (iOS simulator)
 */

import { Platform } from "react-native";

// ──────────────────────────────────────────────
// Mets à true si tu veux forcer le backend local
// même quand l'app est buildée en mode release.
// ──────────────────────────────────────────────
const FORCE_LOCAL = false;

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
  const base = __DEV__ || FORCE_LOCAL ? LOCAL_URL : PRODUCTION_URL;
  // Évite les doubles slashes
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${base}${cleanPath}`;
}

export default apiUrl;
