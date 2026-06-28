const admin = require("firebase-admin");
const fs = require("fs");
const path = require("path");

let _db = null;

/**
 * Viral Stick — Firebase Initialization
 * Gère le chargement sécurisé via JSON local ou variable d'environnement.
 */
function init() {
  if (admin.apps.length > 0) return admin.firestore();

  try {
    let serviceAccount = null;
    const filePath = path.join(__dirname, "firebase-service-account.json");

    // 1. Essai via le fichier JSON local
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, "utf8");
      if (content.includes("private_key") && !content.includes("TON_CONTENU_ICI")) {
        serviceAccount = JSON.parse(content);
        console.log("[Firebase] Initialisé via JSON local.");
      }
    }

    // 2. Essai via variable d'environnement (Vercel)
    if (!serviceAccount && process.env.FIREBASE_SERVICE_ACCOUNT) {
      serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
      console.log("[Firebase] Initialisé via ENV.");
    }

    if (serviceAccount && serviceAccount.private_key) {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        storageBucket: `${serviceAccount.project_id}.firebasestorage.app`
      });
      _db = admin.firestore();
      return _db;
    }
  } catch (e) {
    console.error("[Firebase] Erreur d'initialisation:", e.message);
  }

  console.warn("⚠️ [Firebase] Mode démo activé (aucune base de données connectée).");
  return null;
}

// On initialise une fois au chargement du module
_db = init();

module.exports = {
  // On utilise un getter pour s'assurer que si _db change (re-init), on l'ait
  get db() {
    if (!_db && admin.apps.length > 0) _db = admin.firestore();
    return _db;
  },
  admin
};
