/**
 * shareService.js — Viral Stick
 * Compose les mèmes finaux (image + texte) et persiste des assets partageables.
 */

const fs = require("fs");
const path = require("path");
const axios = require("axios");
const { v4: uuid } = require("uuid");
const { applyMemeText } = require("./providers/sticker");

const STORAGE_DIR = path.join(__dirname, "..", "storage", "shares");
const SHARE_TTL_MS = 7 * 24 * 60 * 60 * 1000;

function ensureStorageDir() {
  if (!fs.existsSync(STORAGE_DIR)) {
    fs.mkdirSync(STORAGE_DIR, { recursive: true });
  }
}

function dataUrlToBuffer(dataUrl) {
  if (!dataUrl || !String(dataUrl).startsWith("data:")) return null;
  const match = String(dataUrl).match(/^data:([^;]+);base64,(.+)$/s);
  if (!match) return null;
  return { mimeType: match[1], buffer: Buffer.from(match[2], "base64") };
}

async function resolveImageBuffer({ imageUrl, imageBase64 }) {
  if (imageBase64) {
    return { buffer: Buffer.from(imageBase64, "base64"), mimeType: "image/jpeg" };
  }
  if (imageUrl) {
    const parsed = dataUrlToBuffer(imageUrl);
    if (parsed) return parsed;

    const url = String(imageUrl);
    if (/^https?:\/\//i.test(url)) {
      try {
        const res = await axios.get(url, { responseType: "arraybuffer", timeout: 30000 });
        const mimeType = res.headers["content-type"] || "image/jpeg";
        return { buffer: Buffer.from(res.data), mimeType };
      } catch (e) {
        console.warn("[Share] Impossible de télécharger l'image distante:", e.message);
      }
    }
  }
  return null;
}

async function composeMemeImage({ imageUrl, imageBase64, topText = "", bottomText = "" }) {
  const resolved = await resolveImageBuffer({ imageUrl, imageBase64 });
  if (!resolved) return null;

  const top = String(topText || "").trim();
  const bottom = String(bottomText || "").trim();

  if (!top && !bottom) {
    const base64 = resolved.buffer.toString("base64");
    const mime = resolved.mimeType || "image/jpeg";
    return {
      dataUrl: `data:${mime};base64,${base64}`,
      base64,
      mimeType: mime,
      provider: "raw",
    };
  }

  const result = await applyMemeText(resolved.buffer, { topText: top, bottomText: bottom });
  return {
    dataUrl: result.dataUrl,
    base64: result.base64,
    mimeType: "image/jpeg",
    provider: result.provider,
  };
}

function buildShareText({ topText, bottomText, caption, publicUrl }) {
  const parts = [topText, bottomText, caption].filter((v) => String(v || "").trim());
  const unique = [...new Set(parts.map((p) => String(p).trim()))];
  let text = unique.join("\n\n");
  if (publicUrl) {
    text += `\n\n📸 Voir le mème : ${publicUrl}`;
  }
  text += "\n\nCréé avec Viral Stick";
  return text.trim();
}

function getPublicUrl(baseUrl, shareId) {
  const base = (baseUrl || process.env.PUBLIC_BASE_URL || "http://localhost:3000").replace(/\/$/, "");
  return `${base}/api/share/${shareId}`;
}

function cleanupExpiredShares() {
  ensureStorageDir();
  const now = Date.now();
  for (const file of fs.readdirSync(STORAGE_DIR)) {
    if (!file.endsWith(".json")) continue;
    try {
      const meta = JSON.parse(fs.readFileSync(path.join(STORAGE_DIR, file), "utf8"));
      if (meta.expiresAt && meta.expiresAt < now) {
        const imagePath = path.join(STORAGE_DIR, `${meta.shareId}.${meta.ext || "jpg"}`);
        if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);
        fs.unlinkSync(path.join(STORAGE_DIR, file));
      }
    } catch {
      /* non-bloquant */
    }
  }
}

function persistShareAsset(buffer, mimeType = "image/jpeg") {
  ensureStorageDir();
  cleanupExpiredShares();

  const shareId = uuid().replace(/-/g, "").slice(0, 12);
  const ext = mimeType.includes("png") ? "png" : "jpg";
  const filePath = path.join(STORAGE_DIR, `${shareId}.${ext}`);
  const metaPath = path.join(STORAGE_DIR, `${shareId}.json`);

  fs.writeFileSync(filePath, buffer);
  fs.writeFileSync(
    metaPath,
    JSON.stringify({
      shareId,
      mimeType,
      ext,
      createdAt: Date.now(),
      expiresAt: Date.now() + SHARE_TTL_MS,
    }),
  );

  return { shareId, filePath, mimeType, ext };
}

function getShareAsset(shareId) {
  if (!shareId || !/^[a-z0-9]{8,16}$/i.test(shareId)) return null;

  ensureStorageDir();
  const metaPath = path.join(STORAGE_DIR, `${shareId}.json`);
  if (!fs.existsSync(metaPath)) return null;

  const meta = JSON.parse(fs.readFileSync(metaPath, "utf8"));
  if (meta.expiresAt && meta.expiresAt < Date.now()) {
    try {
      fs.unlinkSync(path.join(STORAGE_DIR, `${shareId}.${meta.ext || "jpg"}`));
      fs.unlinkSync(metaPath);
    } catch {
      /* non-bloquant */
    }
    return null;
  }

  const imagePath = path.join(STORAGE_DIR, `${shareId}.${meta.ext || "jpg"}`);
  if (!fs.existsSync(imagePath)) return null;

  return {
    buffer: fs.readFileSync(imagePath),
    mimeType: meta.mimeType || "image/jpeg",
    meta,
  };
}

async function buildShareBundle({ topText, bottomText, caption, imageUrl, imageBase64, baseUrl }) {
  const composed = await composeMemeImage({
    imageUrl,
    imageBase64,
    topText,
    bottomText: bottomText || caption,
  });

  let shareId = null;
  let publicUrl = null;

  if (composed?.base64) {
    const buffer = Buffer.from(composed.base64, "base64");
    const persisted = persistShareAsset(buffer, composed.mimeType || "image/jpeg");
    shareId = persisted.shareId;
    publicUrl = getPublicUrl(baseUrl, shareId);
  }

  const text = buildShareText({ topText, bottomText, caption, publicUrl });

  return {
    text,
    publicUrl,
    shareId,
    imageDataUrl: composed?.dataUrl || null,
    hasImage: !!composed,
  };
}

module.exports = {
  buildShareBundle,
  composeMemeImage,
  getShareAsset,
  getPublicUrl,
  persistShareAsset,
  buildShareText,
};
