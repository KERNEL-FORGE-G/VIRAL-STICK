const sharp = require("sharp");
const axios = require("axios");

/**
 * Applique le texte de mème sur une image avec positionnement flexible.
 * FIX : Évite les barres noires en utilisant un SVG simplifié et un rendu propre.
 */
async function applyMemeText(imageBuffer, options = {}) {
  const { topText = "", bottomText = "", topY = 12, bottomY = 92 } = options;

  try {
    const info = await sharp(imageBuffer).metadata();
    const w = info.width || 1024;
    const h = info.height || 1024;

    const fontSize = Math.max(Math.round(w * 0.085), 32);
    const strokeW = Math.max(Math.round(fontSize * 0.15), 3);

    // On utilise une police standard et on simplifie le SVG
    const svgOverlay = Buffer.from(`
      <svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">
        <style>
          .txt {
            fill: white;
            stroke: black;
            stroke-width: ${strokeW}px;
            font-family: sans-serif;
            font-weight: 900;
            text-transform: uppercase;
          }
        </style>
        ${topText ? `<text x="50%" y="${topY}%" text-anchor="middle" dominant-baseline="middle" class="txt" font-size="${fontSize}">${topText}</text>` : ""}
        ${bottomText ? `<text x="50%" y="${bottomY}%" text-anchor="middle" dominant-baseline="middle" class="txt" font-size="${fontSize}">${bottomText}</text>` : ""}
      </svg>
    `);

    const outBuffer = await sharp(imageBuffer)
      .composite([{
        input: svgOverlay,
        blend: 'over'
      }])
      .jpeg({ quality: 90 })
      .toBuffer();

    return {
      buffer: outBuffer,
      dataUrl: `data:image/jpeg;base64,${outBuffer.toString("base64")}`,
      width: w,
      height: h,
    };
  } catch (error) {
    console.error("[applyMemeText] Erreur Sharp:", error.message);
    return null;
  }
}

module.exports = { applyMemeText };
