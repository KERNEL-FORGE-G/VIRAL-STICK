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
 * Wrap text into multiple lines to fit within the image width
 */
function wrapText(text, maxCharsPerLine) {
  const words = text.split(' ');
  const lines = [];
  let currentLine = '';

  words.forEach(word => {
    const testLine = currentLine ? `${currentLine} ${word}` : word;
    if (testLine.length <= maxCharsPerLine) {
      currentLine = testLine;
    } else {
      if (currentLine) lines.push(currentLine);
      currentLine = word;
    }
  });
  if (currentLine) lines.push(currentLine);
  return lines;
}

/**
 * Applique le texte de mème sur une image avec positionnement flexible.
 * FIX : Évite les barres noires en utilisant un SVG simplifié et un rendu propre.
 */
async function applyMemeText(imageBuffer, options = {}) {
  const { topText = "", bottomText = "", topY = 8, bottomY = 92 } = options;
  const safeTopText = escapeXml(topText);
  const safeBottomText = escapeXml(bottomText);

  try {
    // Process the original image properly without adding bars
    const imageProcessor = sharp(imageBuffer)
      .rotate() // Auto-rotate based on EXIF data
      .flatten({ background: { r: 0, g: 0, b: 0 } }); // Ensure RGB format
    
    const info = await imageProcessor.metadata();
    const w = info.width || 1024;
    const h = info.height || 1024;

    // Adjust font size and max chars per line based on image width
    let fontSize = Math.max(Math.round(w * 0.07), 28);
    let maxCharsPerLine = Math.max(Math.round(w / (fontSize * 0.6)), 10);

    // Further reduce font size for long text
    if (safeTopText.length > 40 || safeBottomText.length > 40) {
      fontSize = Math.max(Math.round(w * 0.05), 22);
      maxCharsPerLine = Math.max(Math.round(w / (fontSize * 0.6)), 8);
    }
    const strokeW = Math.max(Math.round(fontSize * 0.18), 4);
    const lineHeight = fontSize * 1.3;

    // Wrap text into lines
    const topLines = safeTopText ? wrapText(safeTopText, maxCharsPerLine) : [];
    const bottomLines = safeBottomText ? wrapText(safeBottomText, maxCharsPerLine) : [];

    // Generate SVG text elements
    let topTextSvg = '';
    if (topLines.length > 0) {
      const totalTopHeight = (topLines.length - 1) * lineHeight;
      const topStartY = (topY / 100) * h - (totalTopHeight / 2);
      topLines.forEach((line, index) => {
        const y = topStartY + (index * lineHeight);
        topTextSvg += `<text x="50%" y="${y}" text-anchor="middle" class="txt top" font-size="${fontSize}">${line}</text>`;
      });
    }

    let bottomTextSvg = '';
    if (bottomLines.length > 0) {
      const totalBottomHeight = (bottomLines.length - 1) * lineHeight;
      const bottomStartY = (bottomY / 100) * h - (totalBottomHeight / 2);
      bottomLines.forEach((line, index) => {
        const y = bottomStartY + (index * lineHeight);
        bottomTextSvg += `<text x="50%" y="${y}" text-anchor="middle" class="txt bottom" font-size="${fontSize}">${line}</text>`;
      });
    }

    // SVG with proper text alignment (better visibility)
    const svgOverlay = Buffer.from(`
      <svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <filter id="textShadow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="0" dy="3" stdDeviation="2" flood-color="#000000" flood-opacity="1"/>
          </filter>
        </defs>
        <style>
          .txt {
            fill: white;
            stroke: black;
            stroke-width: ${strokeW}px;
            stroke-linejoin: round;
            font-family: Impact, Arial Black, sans-serif;
            font-weight: 900;
            text-transform: uppercase;
            letter-spacing: 2px;
            filter: url(#textShadow);
          }
          .top {
            dominant-baseline: middle;
          }
          .bottom {
            dominant-baseline: middle;
          }
        </style>
        ${topTextSvg}
        ${bottomTextSvg}
      </svg>
    `);

    const outBuffer = await imageProcessor
      .composite([{
        input: svgOverlay,
        blend: 'over'
      }])
      .jpeg({ quality: 95 })
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
