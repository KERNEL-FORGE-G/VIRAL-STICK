const { v4: uuid } = require("uuid");
const { applyMemeText } = require("./providers/sticker");
const cloudinary = require("../cloudinary");
const axios = require("axios");

/**
 * Upload un buffer vers Cloudinary avec gestion d'erreurs détaillée
 */
async function uploadToCloudinary(buffer, fileName) {
  return new Promise((resolve) => {
    if (!cloudinary.config().cloud_name) {
      console.error("[Cloudinary] Erreur : cloud_name non configuré. Vérifiez vos variables d'environnement.");
      return resolve(null);
    }

    console.log(`[Cloudinary] Tentative d'upload de l'image fusionnée (${buffer.length} octets)...`);

    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "viral-stick/memes",
        public_id: fileName.split(".")[0],
        resource_type: "image",
        format: "jpg"
      },
      (error, result) => {
        if (error) {
          console.error("[Cloudinary] ❌ Échec d'upload:", error.message);
          resolve(null);
        } else {
          console.log("[Cloudinary] ✅ Upload réussi :", result.secure_url);
          resolve(result.secure_url);
        }
      }
    );
    uploadStream.end(buffer);
  });
}

/**
 * Fusionne le texte et l'image
 */
async function composeMemeImage({ imageUrl, imageBase64, topText = "", bottomText = "", topY = 10, bottomY = 90 }) {
  let buffer;
  try {
    if (imageBase64) {
      const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, "");
      buffer = Buffer.from(base64Data, "base64");
    } else if (imageUrl && imageUrl.startsWith("data:")) {
      const match = imageUrl.match(/^data:([^;]+);base64,(.+)$/s);
      if (match) buffer = Buffer.from(match[2], "base64");
    } else if (imageUrl && imageUrl.startsWith("http")) {
      const response = await axios.get(imageUrl, { responseType: 'arraybuffer', timeout: 15000 });
      buffer = Buffer.from(response.data, 'binary');
    }

    if (!buffer) {
      console.warn("[Compose] Aucun buffer image valide trouvé pour la fusion.");
      return null;
    }

    return await applyMemeText(buffer, { topText, bottomText, topY, bottomY });
  } catch (e) {
    console.error("[Compose] Erreur lors de la fusion Sharp:", e.message);
    return null;
  }
}

/**
 * Prépare le paquet de partage (Image fusionnée + Upload Cloudinary)
 */
async function buildShareBundle({ topText, bottomText, imageUrl, imageBase64, topY, bottomY, baseUrl }) {
  // 1. On fusionne
  const composed = await composeMemeImage({ imageUrl, imageBase64, topText, bottomText, topY, bottomY });

  let shareId = uuid().replace(/-/g, "").slice(0, 12);
  let publicUrl = null;

  if (composed && composed.buffer) {
    // 2. On upload sur Cloudinary pour la persistance
    publicUrl = await uploadToCloudinary(composed.buffer, `vs_${shareId}`);
  }

  // Si Cloudinary échoue, on renvoie au moins le base64 (imageDataUrl) pour l'app
  const finalUrl = publicUrl || (composed ? composed.dataUrl : (imageUrl || imageBase64));

  return {
    text: `${topText} ${bottomText}`.trim(),
    publicUrl: publicUrl, // Sera utilisé par le forum
    shareId,
    imageDataUrl: composed?.dataUrl || null,
    hasImage: !!composed,
    finalUrl: finalUrl
  };
}

module.exports = { buildShareBundle, composeMemeImage, uploadToCloudinary };
