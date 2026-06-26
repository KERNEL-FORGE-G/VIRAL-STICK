const admin = require("firebase-admin");

let db = null;

try {
  if (!admin.apps.length) {
    const serviceAccountVar = process.env.FIREBASE_SERVICE_ACCOUNT;

    // Check if the service account is a valid-looking JSON string (not just placeholder)
    if (serviceAccountVar && serviceAccountVar.includes('"type": "service_account"') && !serviceAccountVar.includes('...')) {
      try {
        const serviceAccount = JSON.parse(serviceAccountVar);
        admin.initializeApp({
          credential: admin.credential.cert(serviceAccount),
          storageBucket: "viral-stick-4320c.firebasestorage.app"
        });
        console.log("[Firebase] Initialized with service account");
      } catch (parseError) {
        console.warn("[Firebase] Failed to parse service account JSON, trying default credentials:", parseError.message);
        try {
          admin.initializeApp({
            credential: admin.credential.applicationDefault(),
            storageBucket: "viral-stick-4320c.firebasestorage.app"
          });
          console.log("[Firebase] Initialized with default credentials");
        } catch (defaultError) {
          console.warn("[Firebase] Default credentials failed, running in demo mode:", defaultError.message);
        }
      }
    } else {
      console.log("[Firebase] No valid service account provided, trying default credentials");
      try {
        admin.initializeApp({
          credential: admin.credential.applicationDefault(),
          storageBucket: "viral-stick-4320c.firebasestorage.app"
        });
        console.log("[Firebase] Initialized with default credentials");
      } catch (defaultError) {
        console.warn("[Firebase] Default credentials failed, running in demo mode:", defaultError.message);
      }
    }
  }
  // Try to get Firestore even if init had issues
  if (admin.apps.length > 0) {
    try {
      db = admin.firestore();
      console.log("[Firebase] Firestore initialized successfully");
    } catch (firestoreError) {
      console.warn("[Firebase] Firestore failed, running in demo mode:", firestoreError.message);
      db = null;
    }
  }
} catch (error) {
  console.error("[Firebase] Complete initialization error:", error.message);
  db = null;
}

module.exports = { db, admin };
