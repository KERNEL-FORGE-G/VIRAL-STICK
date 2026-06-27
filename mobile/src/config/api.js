/**
 * Viral Stick — API Configuration
 * Gère automatiquement l'URL selon l'environnement :
 *   - Production Vercel : https://viral-stick.vercel.app
 *   - Dev local        : http://10.0.2.2:3000  (Android emulator)
 *                        http://localhost:3000  (iOS simulator)
 */

import { Platform } from "react-native";

// ──────────────────────────────────────────────
// Mets FORCE_LOCAL à true pour forcer le backend local
// Mets USE_PROD_IN_DEV à true pour forcer la production
// ──────────────────────────────────────────────
const FORCE_LOCAL = false; // Utiliser le backend local
const USE_PROD_IN_DEV = true; // Utiliser l'API de production en développement

const PRODUCTION_URL = "https://viral-stick.vercel.app";

const LOCAL_URL =
  Platform.OS === "android"
    ? "http://10.0.2.2:3000"
    : "http://localhost:3000";

export function apiUrl(path = "") {
  const isDev = __DEV__;
  let base;
  if (FORCE_LOCAL) {
    base = LOCAL_URL;
  } else if (isDev && !USE_PROD_IN_DEV) {
    base = LOCAL_URL;
  } else {
    base = PRODUCTION_URL;
  }

  // Évite les doubles slashes
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${base}${cleanPath}`;
}

export default apiUrl;
