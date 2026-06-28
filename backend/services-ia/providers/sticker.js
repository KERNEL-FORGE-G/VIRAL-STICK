const sharp = require("sharp");

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
  if (!text) return [];
  const words = String(text).split(' ');
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
 */
async function applyMemeText(imageBuffer, options = {}) {
  const { topText = "", bottomText = "", topY = 10, bottomY = 90 } = options;

  try {
    if (!imageBuffer || imageBuffer.length === 0) {
      throw new Error("Buffer image vide ou invalide");
    }

    // 1. Charger l'image et normaliser (force RGB, enlève alpha si nécessaire pour JPEG)
    const pipeline = sharp(imageBuffer).rotate(); // Respecte l'orientation EXIF
    const metadata = await pipeline.metadata();

    const w = metadata.width || 1024;
    const h = metadata.height || 1024;

    const safeTop = escapeXml(topText).toUpperCase();
    const safeBottom = escapeXml(bottomText).toUpperCase();

    // 2. Paramètres de style (adaptés à la taille de l'image)
    const fontSize = Math.max(Math.round(w * 0.075), 24);
    const strokeWidth = Math.max(Math.round(fontSize * 0.15), 3);
    const maxChars = Math.max(Math.round(w / (fontSize * 0.6)), 10);
    const lineHeight = fontSize * 1.1;

    const topLines = wrapText(safeTop, maxChars);
    const bottomLines = wrapText(safeBottom, maxChars);

    // 3. Génération du SVG
    let svgContent = "";

    // Ajout du texte du haut
    if (topLines.length > 0) {
      topLines.forEach((line, i) => {
        const yPos = (topY / 100) * h + (i * lineHeight);
        // On dessine le contour (stroke) puis le remplissage (fill) en deux passes pour un rendu mème classique
        svgContent += `<text x="50%" y="${yPos}" text-anchor="middle" font-size="${fontSize}" font-family="sans-serif" font-weight="900" fill="none" stroke="black" stroke-width="${strokeWidth}" stroke-linejoin="round">${line}</text>`;
        svgContent += `<text x="50%" y="${yPos}" text-anchor="middle" font-size="${fontSize}" font-family="sans-serif" font-weight="900" fill="white">${line}</text>`;
      });
    }

    // Ajout du texte du bas
    if (bottomLines.length > 0) {
      const totalBottomHeight = (bottomLines.length - 1) * lineHeight;
      bottomLines.forEach((line, i) => {
        // Position ajustée pour que bottomY soit le bas du bloc de texte
        const yPos = (bottomY / 100) * h - totalBottomHeight + (i * lineHeight);
        svgContent += `<text x="50%" y="${yPos}" text-anchor="middle" font-size="${fontSize}" font-family="sans-serif" font-weight="900" fill="none" stroke="black" stroke-width="${strokeWidth}" stroke-linejoin="round">${line}</text>`;
        svgContent += `<text x="50%" y="${yPos}" text-anchor="middle" font-size="${fontSize}" font-family="sans-serif" font-weight="900" fill="white">${line}</text>`;
      });
    }

    const svgOverlay = Buffer.from(`
      <svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">
        ${svgContent}
      </svg>
    `);

    // 4. Fusion
    const resultBuffer = await pipeline
      .composite([{ input: svgOverlay, blend: 'over' }])
      .jpeg({ quality: 90 })
      .toBuffer();

    console.log(`[Sticker] Fusion réussie: ${topText.slice(0,15)}... (${resultBuffer.length} octets)`);

    return {
      buffer: resultBuffer,
      dataUrl: `data:image/jpeg;base64,${resultBuffer.toString("base64")}`,
      width: w,
      height: h,
    };

  } catch (error) {
    console.error("[applyMemeText] ❌ Erreur fusion Sharp:", error.message);
    return null;
  }
}

module.exports = { applyMemeText };
