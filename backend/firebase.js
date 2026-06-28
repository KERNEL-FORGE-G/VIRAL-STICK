const admin = require("firebase-admin");
const fs = require("fs");
const path = require("path");

let db = null;

try {
  if (!admin.apps.length) {
    let serviceAccount = null;
    const filePath = path.join(__dirname, "firebase-service-account.json");

    if (fs.existsSync(filePath)) {
      try {
        const fileContent = fs.readFileSync(filePath, "utf8");
        if (!fileContent.includes("TON_CONTENU_ICI")) {
          serviceAccount = JSON.parse(fileContent);
          console.log("[Firebase] Configuration chargée via fichier JSON.");
        } else {
          console.warn("[Firebase] ATTENTION : Le fichier JSON contient des valeurs d'exemple (TON_CONTENU_ICI).");
        }
      } catch (e) {
        console.warn("[Firebase] Erreur lecture JSON:", e.message);
      }
    }

    if (!serviceAccount) {
      const envVar = process.env.FIREBASE_SERVICE_ACCOUNT;
      if (envVar && envVar.includes("private_key")) {
        try {
          serviceAccount = JSON.parse(envVar);
          console.log("[Firebase] Configuration chargée via variable d'environnement.");
        } catch (e) {
          console.warn("[Firebase] Erreur parse variable ENV.");
        }
      }
    }

    if (serviceAccount && serviceAccount.private_key) {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        storageBucket: `${serviceAccount.project_id}.firebasestorage.app`
      });
      db = admin.firestore();
      console.log("✅ [Firebase] Firestore connecté avec succès.");
    } else {
      console.error("❌ [Firebase] ÉCHEC : Aucune clé privée valide trouvée. Le forum sera temporaire (mémoire).");
    }
  } else {
    db = admin.firestore();
  }
} catch (error) {
  console.error("❌ [Firebase] Erreur critique:", error.message);
}

module.exports = { db, admin };
