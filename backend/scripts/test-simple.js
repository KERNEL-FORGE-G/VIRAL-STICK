
console.log("Starting test...");

require("../loadEnv")();
console.log("ENV loaded");

console.log("GEMINI_API_KEY present:", !!process.env.GEMINI_API_KEY);

const Firebase = require("../firebase");
console.log("Firebase loaded, db present:", !!Firebase.db);

const cloudinary = require("../cloudinary");
console.log("Cloudinary loaded, isReady:", cloudinary.isReady());

console.log("All tests done!");
