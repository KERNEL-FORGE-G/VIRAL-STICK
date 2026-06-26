const fs = require("fs");
const { v4: uuid } = require("uuid");
const { applyMemeText } = require("./providers/sticker");
const { db, admin } = require("../firebase");
const cloudinary = require("../cloudinary");

async function uploadToCloudinary(buffer, fileName) {
  return new Promise((resolve) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: "viral-stick/memes", public_id: fileName.split(".")[0], resource_type: "image" },
      (error, result) => {
        if (error) { resolve(null); }
        else { resolve(result.secure_url); }
      }
    );
    uploadStream.end(buffer);
  });
}

async function composeMemeImage({ imageUrl, imageBase64, topText = "", bottomText = "" }) {
  let buffer;
  if (imageBase64) {
    const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, "");
    buffer = Buffer.from(base64Data, "base64");
  } else if (imageUrl && imageUrl.startsWith("data:")) {
    const match = imageUrl.match(/^data:([^;]+);base64,(.+)$/s);
    if (match) { buffer = Buffer.from(match[2], "base64"); }
  } else if (imageUrl && imageUrl.startsWith("http")) {
    const axios = require("axios");
    try {
      const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
      buffer = Buffer.from(response.data, 'binary');
    } catch (e) { return null; }
  }

  if (!buffer) return null;
  const result = await applyMemeText(buffer, { topText, bottomText });
  return result;
}

async function buildShareBundle({ topText, bottomText, caption, imageUrl, imageBase64, shareToForum = false, sourceMemeId = null }) {
  const composed = await composeMemeImage({ imageUrl, imageBase64, topText, bottomText: bottomText || caption });
  let shareId = uuid().replace(/-/g, "").slice(0, 12);
  let publicUrl = null;

  if (composed) {
    publicUrl = await uploadToCloudinary(composed.buffer, `${shareId}.jpg`);

    if (db && shareToForum) {
      try {
        await db.collection("memes").doc(shareId).set({
          shareId,
          imageUrl: publicUrl || composed.dataUrl,
          topText: topText || "",
          bottomText: bottomText || caption || "",
          likes: 0,
          remixes: 0,
          createdAt: Date.now(),
        });

        // Si c'est un remix, on incrémente le compteur du mème d'origine
        if (sourceMemeId) {
          await db.collection("memes").doc(sourceMemeId).update({
            remixes: admin.firestore.FieldValue.increment(1)
          });
        }
      } catch (e) { console.error("[Firestore] Save error:", e.message); }
    }
  }

  return {
    text: `${topText}\n${bottomText || caption}\n\nCréé avec Viral Stick`,
    publicUrl,
    shareId,
    imageDataUrl: composed?.dataUrl || null,
    hasImage: !!composed,
  };
}

module.exports = { buildShareBundle };
