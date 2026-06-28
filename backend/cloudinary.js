const cloudinary = require("cloudinary").v2;

/**
 * Viral Stick — Cloudinary Configuration
 * Gère le stockage permanent des mèmes sur le cloud.
 */

const configure = () => {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey    = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (cloudName && apiKey && apiSecret) {
    cloudinary.config({
      cloud_name: cloudName,
      api_key:    apiKey,
      api_secret: apiSecret,
      secure:     true
    });
    console.log(`✅ [Cloudinary] Prêt. Compte : ${cloudName}`);
    return true;
  } else {
    console.warn("⚠️ [Cloudinary] Configuration manquante ! Les images du forum seront temporaires.");
    console.log("Détails attendus : CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET");
    return false;
  }
};

// Initialisation immédiate
configure();

// Ajout d'un helper de vérification
cloudinary.isReady = () => !!(process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY);

module.exports = cloudinary;
