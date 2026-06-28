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
 * Découpe le texte en plusieurs lignes
 */
function wrapText(text, maxCharsPerLine) {
  if (!text) return [];
  const words = String(text).trim().split(/\s+/);
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
 * Version ultra-robuste avec double passe (contour + remplissage) pour compatibilité maximale.
 */
async function applyMemeText(imageBuffer, options = {}) {
  const { topText = "", bottomText = "", topY = 15, bottomY = 85 } = options;

  try {
    if (!imageBuffer || imageBuffer.length === 0) {
      throw new Error("Buffer image vide ou corrompu");
    }

    // 1. Lire les métadonnées sur une instance temporaire
    const meta = await sharp(imageBuffer).metadata();
    const w = meta.width;
    const h = meta.height;

    if (!w || !h) throw new Error("Impossible de lire les dimensions de l'image");

    const safeTop = escapeXml(topText).toUpperCase();
    const safeBottom = escapeXml(bottomText).toUpperCase();

    // 2. Paramètres de style adaptés
    const fontSize = Math.floor(w * 0.08);
    const strokeW = Math.floor(fontSize * 0.15);
    const maxChars = Math.floor(w / (fontSize * 0.6));
    const lineHeight = fontSize * 1.2;

    const topLines = wrapText(safeTop, maxChars);
    const bottomLines = wrapText(safeBottom, maxChars);

    // 3. Construction du contenu SVG (Double passe pour contour parfait)
    let svgTexts = "";

    // Texte du haut
    topLines.forEach((line, i) => {
      const y = (topY / 100) * h + (i * lineHeight);
      // Contour
      svgTexts += `<text x="50%" y="${y}" text-anchor="middle" font-size="${fontSize}" font-family="sans-serif" font-weight="900" fill="none" stroke="black" stroke-width="${strokeW}" stroke-linejoin="round">${line}</text>`;
      // Remplissage
      svgTexts += `<text x="50%" y="${y}" text-anchor="middle" font-size="${fontSize}" font-family="sans-serif" font-weight="900" fill="white">${line}</text>`;
    });

    // Texte du bas
    const totalBottomHeight = (bottomLines.length - 1) * lineHeight;
    bottomLines.forEach((line, i) => {
      const y = (bottomY / 100) * h - totalBottomHeight + (i * lineHeight);
      // Contour
      svgTexts += `<text x="50%" y="${y}" text-anchor="middle" font-size="${fontSize}" font-family="sans-serif" font-weight="900" fill="none" stroke="black" stroke-width="${strokeW}" stroke-linejoin="round">${line}</text>`;
      // Remplissage
      svgTexts += `<text x="50%" y="${y}" text-anchor="middle" font-size="${fontSize}" font-family="sans-serif" font-weight="900" fill="white">${line}</text>`;
    });

    const svgOverlay = Buffer.from(`
      <svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">
        <style> text { dominant-baseline: middle; } </style>
        ${svgTexts}
      </svg>
    `);

    // 4. Fusion finale sur une nouvelle instance
    const outBuffer = await sharp(imageBuffer)
      .composite([{ input: svgOverlay, blend: 'over' }])
      .jpeg({ quality: 90 })
      .toBuffer();

    console.log(`[Sticker] Fusion réussie: ${topText.slice(0, 15)}... (${outBuffer.length} octets)`);

    return {
      buffer: outBuffer,
      dataUrl: `data:image/jpeg;base64,${outBuffer.toString("base64")}`,
      width: w,
      height: h
    };

  } catch (error) {
    console.error("[applyMemeText] ❌ Erreur critique Sharp:", error.message);
    return null;
  }
}

module.exports = { applyMemeText };
