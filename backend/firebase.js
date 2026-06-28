const admin = require("firebase-admin");
const fs = require("fs");
const path = require("path");

let db = null;

try {
  if (!admin.apps.length) {
    let serviceAccount = null;
    const filePath = path.join(__dirname, "firebase-service-account.json");

    // 1. Essayer de charger depuis le fichier local (autorisé dans .gitignore)
    if (fs.existsSync(filePath)) {
      try {
        serviceAccount = JSON.parse(fs.readFileSync(filePath, "utf8"));
        console.log("[Firebase] Chargement via fichier JSON local");
      } catch (e) {
        console.warn("[Firebase] Erreur lecture fichier JSON:", e.message);
      }
    }

    // 2. Si pas de fichier, essayer la variable d'environnement (Vercel)
    if (!serviceAccount || !serviceAccount.project_id) {
      const envServiceAccount = process.env.FIREBASE_SERVICE_ACCOUNT;
      if (envServiceAccount && envServiceAccount.includes('"type": "service_account"')) {
        try {
          serviceAccount = JSON.parse(envServiceAccount);
          console.log("[Firebase] Chargement via variable d'environnement");
        } catch (e) {
          console.warn("[Firebase] Erreur parse variable ENV:", e.message);
        }
      }
    }

    if (serviceAccount && serviceAccount.project_id && serviceAccount.private_key) {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        storageBucket: `${serviceAccount.project_id}.firebasestorage.app`
      });
      console.log("[Firebase] Initialisé avec succès");
    } else {
      console.warn("[Firebase] Aucune configuration valide trouvée. Mode démo activé.");
    }
  }

  if (admin.apps.length > 0) {
    db = admin.firestore();
    console.log("[Firebase] Firestore prêt.");
  }
} catch (error) {
  console.error("[Firebase] Erreur critique initialisation:", error.message);
  db = null;
}

module.exports = { db, admin };
