/**
 * providers/sticker.js — Viral Stick
 * ─────────────────────────────────────────────────────────────────────────────
 * Traitement local de stickers via Sharp.
 * Aucun appel IA externe nécessaire pour la composition de base.
 *
 * Fonctionnalités :
 *   - compositeSticker  : place un sticker PNG sur une photo (avec alpha)
 *   - addFaceToSticker  : détecte la zone visage dans le sticker et la remplace
 *   - exportSticker     : redimensionne + exporte en PNG transparent
 *   - applyMemeText     : ajoute topText / bottomText sur une image
 */

const sharp  = require("sharp");
const path   = require("path");
const fs     = require("fs");
const os     = require("os");
const { v4: uuid } = require("uuid");

const TMP_DIR = path.join(os.tmpdir(), "viral-stick-stickers");

// ─── Initialisation ───────────────────────────────────────────────────────────

function ensureDir() {
  if (!fs.existsSync(TMP_DIR)) fs.mkdirSync(TMP_DIR, { recursive: true });
}

// ─── Export sticker ───────────────────────────────────────────────────────────
// Prend n'importe quelle image, la redimensionne et l'exporte en PNG transparent.

async function exportSticker(inputBuffer, options = {}) {
  ensureDir();
  const {
    size      = 512,     // taille carrée max
    quality   = 90,
    removeBackground = false, // si true, tente une suppression de fond naïve
  } = options;

  const outPath = path.join(TMP_DIR, `sticker_${uuid()}.png`);

  let pipeline = sharp(inputBuffer)
    .resize(size, size, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } });

  // Suppression de fond naïve : rend le fond blanc/uniforme transparent
  // Pour une vraie suppression il faut rembg (Python) ou une API dédiée
  if (removeBackground) {
    pipeline = pipeline.flatten({ background: { r: 255, g: 255, b: 255 } });
  }

  await pipeline.png({ quality, compressionLevel: 6 }).toFile(outPath);

  const outBuffer = fs.readFileSync(outPath);
  cleanup(outPath);

  return {
    buffer:   outBuffer,
    base64:   outBuffer.toString("base64"),
    dataUrl:  `data:image/png;base64,${outBuffer.toString("base64")}`,
    width:    size,
    height:   size,
    provider: "sharp-local",
  };
}

// ─── Composite sticker sur photo ──────────────────────────────────────────────
// Prend une photo de base + un sticker PNG, positionne le sticker.

async function compositeSticker(baseImageBuffer, stickerBuffer, options = {}) {
  ensureDir();

  const {
    position  = "center",  // "center" | "face" | "top-left" | "top-right" | "bottom-left" | "bottom-right"
    scale     = 0.4,       // taille du sticker en % de la photo (0-1)
    offsetX   = 0,         // décalage horizontal en pixels
    offsetY   = 0,         // décalage vertical en pixels
  } = options;

  // Récupère les dimensions de la photo de base
  const baseInfo = await sharp(baseImageBuffer).metadata();
  const baseW    = baseInfo.width  || 1024;
  const baseH    = baseInfo.height || 1024;

  // Calcule la taille du sticker
  const stickerSize = Math.round(Math.min(baseW, baseH) * scale);

  // Redimensionne le sticker
  const resizedSticker = await sharp(stickerBuffer)
    .resize(stickerSize, stickerSize, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();

  // Calcule la position
  const { left, top } = computePosition(position, baseW, baseH, stickerSize, offsetX, offsetY);

  // Composite
  const outBuffer = await sharp(baseImageBuffer)
    .composite([{ input: resizedSticker, left, top, blend: "over" }])
    .jpeg({ quality: 92 })
    .toBuffer();

  return {
    buffer:   outBuffer,
    base64:   outBuffer.toString("base64"),
    dataUrl:  `data:image/jpeg;base64,${outBuffer.toString("base64")}`,
    width:    baseW,
    height:   baseH,
    provider: "sharp-composite",
    stickerPosition: { left, top, size: stickerSize },
  };
}

// ─── Face swap simplifié ──────────────────────────────────────────────────────
// Détecte une zone "visage" dans le sticker (partie haute centrale) et la remplace
// par la photo du visage fournie. Pas de détection IA — zone heuristique.
// Pour une vraie détection : intégrer @vladmandic/face-api.

async function addFaceToSticker(stickerBuffer, faceBuffer, options = {}) {
  ensureDir();

  const {
    faceRegionY    = 0.08,  // Le visage commence à 8% du haut du sticker
    faceRegionH    = 0.38,  // Le visage occupe 38% de la hauteur
    faceRegionX    = 0.20,  // Commence à 20% de la largeur
    faceRegionW    = 0.60,  // Occupe 60% de la largeur
    outputSize     = 512,
  } = options;

  // Info sticker
  const stickerInfo = await sharp(stickerBuffer).metadata();
  const sw = stickerInfo.width  || 512;
  const sh = stickerInfo.height || 512;

  // Redimensionne le sticker à la taille de sortie
  const resizedSticker = await sharp(stickerBuffer)
    .resize(outputSize, outputSize, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();

  // Zone face en pixels (sur outputSize)
  const faceX = Math.round(faceRegionX * outputSize);
  const faceY = Math.round(faceRegionY * outputSize);
  const faceW = Math.round(faceRegionW * outputSize);
  const faceH = Math.round(faceRegionH * outputSize);

  // Prépare le visage : redimensionne, arrondit (masque ellipse)
  const resizedFace = await sharp(faceBuffer)
    .resize(faceW, faceH, { fit: "cover", position: "top" })
    .png()
    .toBuffer();

  // Crée un masque elliptique pour adoucir les bords du visage
  const ellipseMask = Buffer.from(
    `<svg width="${faceW}" height="${faceH}">
      <ellipse cx="${faceW/2}" cy="${faceH/2}" rx="${faceW/2 - 2}" ry="${faceH/2 - 2}" fill="white"/>
    </svg>`
  );

  const maskedFace = await sharp(resizedFace)
    .composite([{ input: ellipseMask, blend: "dest-in" }])
    .png()
    .toBuffer();

  // Composite : sticker + visage
  const result = await sharp(resizedSticker)
    .composite([{ input: maskedFace, left: faceX, top: faceY, blend: "over" }])
    .png({ quality: 90 })
    .toBuffer();

  return {
    buffer:   result,
    base64:   result.toString("base64"),
    dataUrl:  `data:image/png;base64,${result.toString("base64")}`,
    width:    outputSize,
    height:   outputSize,
    provider: "sharp-face-composite",
    faceRegion: { x: faceX, y: faceY, w: faceW, h: faceH },
  };
}

// ─── Helpers for text wrapping ─────────────────────────────────────────────────

function wrapText(text, maxWidth, fontSize, w) {
  const words = String(text || "").toUpperCase().split(/\s+/);
  const lines = [];
  let currentLine = "";

  const approxCharWidth = fontSize * 0.55; // Approximate width per character
  const maxCharsPerLine = Math.floor((w * 0.9) / approxCharWidth);

  for (const word of words) {
    if (!word) continue;
    const testLine = currentLine ? `${currentLine} ${word}` : word;
    if (testLine.length > maxCharsPerLine && currentLine) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = testLine;
    }
  }
  if (currentLine) lines.push(currentLine);
  return lines;
}

// ─── Ajoute un texte mème sur une image (topText / bottomText) ────────────────

async function applyMemeText(imageBuffer, options = {}) {
  ensureDir();

  const { topText = "", bottomText = "", quality = 90 } = options;
  const info = await sharp(imageBuffer).metadata();
  const w    = info.width  || 1024;
  const h    = info.height || 1024;

  const fontSize = Math.max(Math.round(w * 0.08), 32);
  const strokeW  = Math.max(Math.round(fontSize * 0.08), 3);
  const lineHeight = fontSize * 1.2;

  const escXml = (s) =>
    (s || "").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");

  const attrs = (y) =>
    `x="50%" y="${y}" font-family="Impact, Arial Black, sans-serif"
     font-size="${fontSize}px" font-weight="900" fill="white"
     stroke="black" stroke-width="${strokeW}" stroke-linejoin="round"
     text-anchor="middle" dominant-baseline="middle"
     paint-order="stroke fill" letter-spacing="1"`;

  // Render top text
  let topSvg = "";
  if (topText) {
    const lines = wrapText(topText, w, fontSize, w);
    const startY = Math.round(h * 0.06) + lineHeight / 2;
    for (let i = 0; i < lines.length; i++) {
      const y = startY + i * lineHeight;
      topSvg += `<text ${attrs(y)}>${escXml(lines[i])}</text>`;
    }
  }

  // Render bottom text
  let bottomSvg = "";
  if (bottomText) {
    const lines = wrapText(bottomText, w, fontSize, w);
    const startY = h - Math.round(h * 0.06) - ((lines.length - 1) * lineHeight) - lineHeight / 2;
    for (let i = 0; i < lines.length; i++) {
      const y = startY + i * lineHeight;
      bottomSvg += `<text ${attrs(y)}>${escXml(lines[i])}</text>`;
    }
  }

  const svg = Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">
      ${topSvg}
      ${bottomSvg}
    </svg>`
  );

  const outBuffer = await sharp(imageBuffer)
    .composite([{ input: svg, top: 0, left: 0 }])
    .jpeg({ quality })
    .toBuffer();

  return {
    buffer:   outBuffer,
    base64:   outBuffer.toString("base64"),
    dataUrl:  `data:image/jpeg;base64,${outBuffer.toString("base64")}`,
    provider: "sharp-meme-text",
  };
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function computePosition(position, baseW, baseH, stickerSize, offsetX, offsetY) {
  const positions = {
    "center":       { left: Math.round((baseW - stickerSize) / 2),      top: Math.round((baseH - stickerSize) / 2) },
    "top-left":     { left: 20,                                          top: 20 },
    "top-right":    { left: baseW - stickerSize - 20,                    top: 20 },
    "bottom-left":  { left: 20,                                          top: baseH - stickerSize - 20 },
    "bottom-right": { left: baseW - stickerSize - 20,                    top: baseH - stickerSize - 20 },
    "face":         { left: Math.round((baseW - stickerSize) / 2),       top: Math.round(baseH * 0.1) },
  };
  const base = positions[position] || positions["center"];
  return { left: base.left + offsetX, top: base.top + offsetY };
}

function cleanup(filePath) {
  try { if (filePath && fs.existsSync(filePath)) fs.unlinkSync(filePath); }
  catch { /* non-bloquant */ }
}

module.exports = { exportSticker, compositeSticker, addFaceToSticker, applyMemeText };
