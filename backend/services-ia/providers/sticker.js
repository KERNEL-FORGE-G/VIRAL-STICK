/**
 * providers/sticker.js — Viral Stick
 * ─────────────────────────────────────────────────────────────────────────────
 * Traitement local et IA pour stickers (Suppression de fond & Composition).
 */

const sharp  = require("sharp");
const axios  = require("axios");

/**
 * Supprime le fond d'une image pour en faire un sticker transparent.
 * Ordre de priorité : Eden AI > Puter > Fallback Sharp
 */
async function removeBackground(inputBuffer) {
  const edenKey = process.env.EDENAI_API_KEY;
  if (edenKey) {
    try {
      console.log("[Sticker] Tentative Eden AI...");
      const FormData = require("form-data");
      const form = new FormData();
      form.append("providers", "clipdrop,picsart,api4ai");
      form.append("file", inputBuffer, { filename: "image.png" });

      const res = await axios.post("https://api.edenai.run/v2/image/background_removal", form, {
        headers: {
          ...form.getHeaders(),
          Authorization: `Bearer ${edenKey}`
        },
        timeout: 30000
      });

      const result = res.data?.clipdrop || res.data?.picsart || res.data?.api4ai;
      if (result?.status === "success" && result.image_resource_url) {
        const imgRes = await axios.get(result.image_resource_url, { responseType: "arraybuffer" });
        return Buffer.from(imgRes.data);
      }
    } catch (e) {
      console.warn("[Sticker] Eden AI failed:", e.message);
    }
  }

  const puterToken = process.env.PUTER_TOKEN || process.env.PUTER_KEY;
  if (puterToken) {
    try {
      console.log("[Sticker] Tentative Puter segmentation...");
      const res = await axios.post("https://api.puter.com/drivers/call", {
        driver: "lib-ai",
        method: "segmentation",
        params: {
          image: inputBuffer.toString("base64"),
        }
      }, {
        headers: { Authorization: `Bearer ${puterToken}` },
        timeout: 30000
      });

      if (res.data?.image) {
        return Buffer.from(res.data.image, "base64");
      }
    } catch (e) {
      console.warn("[Sticker] Puter failed:", e.message);
    }
  }

  return sharp(inputBuffer).ensureAlpha().trim().toBuffer();
}

/**
 * Export sticker
 */
async function exportSticker(inputBuffer, options = {}) {
  const { size = 512, doRemoveBackground = true } = options;
  let processedBuffer = inputBuffer;
  if (doRemoveBackground) {
    try { processedBuffer = await removeBackground(inputBuffer); } catch (e) { processedBuffer = inputBuffer; }
  }
  const outBuffer = await sharp(processedBuffer)
    .resize(size, size, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();

  return {
    buffer: outBuffer,
    dataUrl: `data:image/png;base64,${outBuffer.toString("base64")}`,
  };
}

/**
 * Applique le texte de mème sur une image avec positionnement flexible
 */
async function applyMemeText(imageBuffer, options = {}) {
  const {
    topText = "",
    bottomText = "",
    topY = 12,
    bottomY = 92
  } = options;

  const info = await sharp(imageBuffer).metadata();
  const w = info.width || 1024;
  const h = info.height || 1024;

  const fontSize = Math.max(Math.round(w * 0.08), 32);
  const strokeW = Math.max(Math.round(fontSize * 0.15), 3);

  // SVG Overlay avec style Impact classique
  const svg = `
    <svg width="${w}" height="${h}">
      <style>
        .text {
          fill: white;
          stroke: black;
          stroke-width: ${strokeW}px;
          paint-order: stroke fill;
          font-family: Impact, Arial, sans-serif;
          font-weight: 900;
          text-transform: uppercase;
        }
      </style>
      ${topText ? `<text x="50%" y="${topY}%" text-anchor="middle" dominant-baseline="middle" class="text" font-size="${fontSize}">${topText}</text>` : ""}
      ${bottomText ? `<text x="50%" y="${bottomY}%" text-anchor="middle" dominant-baseline="middle" class="text" font-size="${fontSize}">${bottomText}</text>` : ""}
    </svg>
  `;

  const outBuffer = await sharp(imageBuffer)
    .composite([{ input: Buffer.from(svg), top: 0, left: 0 }])
    .jpeg({ quality: 90 })
    .toBuffer();

  return {
    buffer: outBuffer,
    dataUrl: `data:image/jpeg;base64,${outBuffer.toString("base64")}`,
    width: w,
    height: h,
  };
}

module.exports = {
  exportSticker,
  applyMemeText
};
