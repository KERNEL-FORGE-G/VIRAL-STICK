const sharp = require("sharp");
const axios = require("axios");

/**
 * Échappe les caractères spéciaux pour le SVG (évite les erreurs de rendu)
 */
function escapeXml(unsafe) {
  if (typeof unsafe !== 'string') return '';
  return unsafe.replace(/[<>&'"]/g, function (c) {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '\'': return '&apos;';
      case '"': return '&quot;';
      default: return c;
    }
  });
}

/**
 * Applique le texte de mème sur une image avec positionnement flexible.
 * FIX : Évite les barres noires en utilisant un SVG simplifié et un rendu propre.
 */
async function applyMemeText(imageBuffer, options = {}) {
  const { topText = "", bottomText = "", topY = 10, bottomY = 88 } = options;
  const safeTopText = escapeXml(topText);
  const safeBottomText = escapeXml(bottomText);

  try {
    // First ensure the original image is in a consistent RGB format
    const normalizedImage = await sharp(imageBuffer)
      .toFormat('jpeg')
      .jpeg({ quality: 90 })
      .toBuffer();

    const info = await sharp(normalizedImage).metadata();
    const w = info.width || 1024;
    const h = info.height || 1024;

    // Adjust font size to be responsive
    let fontSize = Math.max(Math.round(w * 0.075), 28);
    // Reduce font size if text is long
    if (safeTopText.length > 25 || safeBottomText.length > 25) {
      fontSize = Math.max(Math.round(w * 0.055), 22);
    }
    const strokeW = Math.max(Math.round(fontSize * 0.18), 4);

    // SVG with proper text alignment
    const svgOverlay = Buffer.from(`
      <svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">
        <style>
          .txt {
            fill: white;
            stroke: black;
            stroke-width: ${strokeW}px;
            font-family: Impact, Arial Black, sans-serif;
            font-weight: bold;
            text-transform: uppercase;
            letter-spacing: 1px;
          }
          .top {
            dominant-baseline: hanging;
          }
          .bottom {
            dominant-baseline: auto;
          }
        </style>
        ${safeTopText ? `<text x="50%" y="${topY}%" text-anchor="middle" class="txt top" font-size="${fontSize}">${safeTopText}</text>` : ""}
        ${safeBottomText ? `<text x="50%" y="${bottomY}%" text-anchor="middle" class="txt bottom" font-size="${fontSize}">${safeBottomText}</text>` : ""}
      </svg>
    `);

    const outBuffer = await sharp(normalizedImage)
      .composite([{
        input: svgOverlay,
        blend: 'over',
        gravity: 'center'
      }])
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
