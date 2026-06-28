
require("../loadEnv")();

console.log("🔍 TEST DE TOUS LES SERVICES VIRAL STICK 🔍");
console.log("=".repeat(60));

// Test 1: Vérification des variables d'environnement
console.log("\n1. VÉRIFICATION DES VARIABLES D'ENVIRONNEMENT");
console.log("-".repeat(60));

const requiredVars = [
  "GEMINI_API_KEY",
  "MISTRAL_API_KEY",
  "DEEPSEEK_API_KEY",
  "OPENROUTER_API_KEY",
  "CLOUDINARY_CLOUD_NAME",
  "CLOUDINARY_API_KEY",
  "CLOUDINARY_API_SECRET"
];

let allVarsOk = true;
requiredVars.forEach(varName => {
  if (process.env[varName]) {
    console.log(`✅ ${varName}: Présent (${process.env[varName].substring(0, 10)}...)`);
  } else {
    console.log(`❌ ${varName}: Manquant`);
    allVarsOk = false;
  }
});

if (process.env.PUTER_TOKEN || process.env.PUTER_KEY) {
  console.log("✅ PUTER_KEY/PUTER_TOKEN: Présent");
}

// Test 2: Initialisation Firebase
console.log("\n2. TEST FIREBASE");
console.log("-".repeat(60));
try {
  const Firebase = require("../firebase");
  console.log("✅ Firebase importé avec succès");
  
  if (Firebase.db) {
    console.log("✅ Firestore DB initialisée");
  } else {
    console.log("⚠️ Firestore DB non initialisée (mode démo)");
  }
} catch (e) {
  console.log("❌ Erreur Firebase:", e.message);
}

// Test 3: Initialisation Cloudinary
console.log("\n3. TEST CLOUDINARY");
console.log("-".repeat(60));
try {
  const cloudinary = require("../cloudinary");
  if (cloudinary.isReady()) {
    console.log("✅ Cloudinary prêt");
  } else {
    console.log("⚠️ Cloudinary non configuré");
  }
} catch (e) {
  console.log("❌ Erreur Cloudinary:", e.message);
}

// Test 4: Forum Controller (démo mode)
console.log("\n4. TEST FORUM CONTROLLER");
console.log("-".repeat(60));
try {
  const ForumController = require("../controllers/forumController");
  console.log("✅ ForumController importé");
  
  // Test getMemes with demo mode
  const mockReq = { query: { sortBy: "createdAt" } };
  const mockRes = {
    json: (data) => {
      console.log(`✅ getMemes() retourne ${data.length} memes`);
    },
    status: () => mockRes
  };
  
  ForumController.getMemes(mockReq, mockRes);
} catch (e) {
  console.log("❌ Erreur ForumController:", e.message);
}

// Test 5: AI Service
console.log("\n5. TEST AI SERVICE");
console.log("-".repeat(60));
try {
  const AIService = require("../services-ia/aiService");
  console.log("✅ AIService importé");
} catch (e) {
  console.log("❌ Erreur AIService:", e.message);
}

console.log("\n" + "=".repeat(60));
console.log("✅ TESTS TERMINÉS");
console.log("=".repeat(60));
