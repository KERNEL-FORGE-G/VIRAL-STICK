const admin = require("firebase-admin");
const fs = require("fs");
const path = require("path");

let _db = null;
let _initialized = false;

/**
 * Viral Stick — Firebase Initialization
 * Gère le chargement sécurisé via JSON local ou variable d'environnement.
 */
function init() {
  if (_initialized) {
    return _db;
  }
  _initialized = true;

  try {
    // Si une app existe déjà, utiliser ça
    if (admin.apps.length > 0) {
      _db = admin.firestore();
      console.log("[Firebase] Utilisation de l'app Firebase existante.");
      return _db;
    }

    let serviceAccount = null;
    const filePath = path.join(__dirname, "firebase-service-account.json");

    // 1. Essai via le fichier JSON local
    if (fs.existsSync(filePath)) {
      try {
        const content = fs.readFileSync(filePath, "utf8");
        if (content.includes("private_key") && !content.includes("TON_CONTENU_ICI")) {
          serviceAccount = JSON.parse(content);
          console.log("[Firebase] Initialisé via JSON local.");
        }
      } catch (e) {
        console.error("[Firebase] Erreur lecture fichier JSON local:", e.message);
      }
    }

    // 2. Essai via variable d'environnement (Vercel)
    if (!serviceAccount && process.env.FIREBASE_SERVICE_ACCOUNT) {
      try {
        serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
        console.log("[Firebase] Initialisé via ENV.");
      } catch (e) {
        console.error("[Firebase] Erreur parsing ENV:", e.message);
      }
    }

    if (serviceAccount && serviceAccount.private_key) {
      try {
        admin.initializeApp({
          credential: admin.credential.cert(serviceAccount),
          storageBucket: `${serviceAccount.project_id || ""}.firebasestorage.app`
        });
        _db = admin.firestore();
        console.log("[Firebase] Initialisation réussie !");
        return _db;
      } catch (e) {
        console.error("[Firebase] Erreur initializeApp:", e.message);
      }
    }
  } catch (e) {
    console.error("[Firebase] Erreur globale d'initialisation:", e.message);
  }

  console.warn("⚠️ [Firebase] Mode démo activé (aucune base de données connectée).");
  _db = null;
  return null;
}

// On initialise immédiatement
try {
  _db = init();
} catch (e) {
  console.error("[Firebase] Crash initialisation:", e);
  _db = null;
}

module.exports = {
  // On utilise un getter pour garantir l'accès à la DB même après initialisation asynchrone éventuelle
  get db() {
    try {
      if (!_db && admin.apps.length > 0) {
        _db = admin.firestore();
      }
    } catch (e) {
      console.error("[Firebase] Erreur getter db:", e);
      return null;
    }
    return _db;
  },
  admin
};
