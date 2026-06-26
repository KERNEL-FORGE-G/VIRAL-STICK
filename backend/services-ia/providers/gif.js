/**
 * providers/gif.js — Génération et export GIF
 * Utilise gifenc + sharp (local, pas d'IA externe).
 */

const sharp = require("sharp");
const { GIFEncoder, quantize, applyPalette } = require("gifenc");

const ANIMATIONS = {
  bounce: (frame, total, size) => {
    const t = frame / total;
    const y = Math.round(Math.sin(t * Math.PI * 2) * size * 0.04);
    return { scale: 1, offsetY: y, rotation: 0 };
  },
  pulse: (frame, total) => {
    const t = frame / total;
    const scale = 1 + Math.sin(t * Math.PI * 2) * 0.06;
    return { scale, offsetY: 0, rotation: 0 };
  },
  wiggle: (frame, total) => {
    const t = frame / total;
    return { scale: 1, offsetY: 0, rotation: Math.sin(t * Math.PI * 4) * 4 };
  },
};

async function bufferToRgba(buffer, size) {
  const { data, info } = await sharp(buffer)
    .resize(size, size, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  return { rgba: data, width: info.width, height: info.height };
}

async function renderFrame(baseBuffer, size, { scale, offsetY, rotation }) {
  const meta = await sharp(baseBuffer).metadata();
  const w = meta.width || size;
  const h = meta.height || size;
  const newW = Math.round(w * scale);
  const newH = Math.round(h * scale);

  let img = sharp(baseBuffer).resize(newW, newH, {
    fit: "contain",
    background: { r: 0, g: 0, b: 0, alpha: 0 },
  });

  if (rotation) {
    img = img.rotate(rotation, { background: { r: 0, g: 0, b: 0, alpha: 0 } });
  }

  const resized = await img.png().toBuffer();
  const left = Math.round((size - newW) / 2);
  const top = Math.round((size - newH) / 2 + offsetY);

  const { data, info } = await sharp({
    create: { width: size, height: size, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } },
  })
    .composite([{ input: resized, left: Math.max(0, left), top: Math.max(0, top), blend: "over" }])
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  return { rgba: data, width: info.width, height: info.height };
}

async function createAnimatedGif(inputBuffer, options = {}) {
  const {
    size = 512,
    frames = 12,
    delay = 80,
    animation = "bounce",
  } = options;

  const animFn = ANIMATIONS[animation] || ANIMATIONS.bounce;
  const gif = GIFEncoder();
  let width = size;
  let height = size;

  for (let i = 0; i < frames; i++) {
    const transform = animFn(i, frames, size);
    const { rgba, width: w, height: h } = await renderFrame(inputBuffer, size, transform);
    width = w;
    height = h;
    const palette = quantize(rgba, 256);
    const index = applyPalette(rgba, palette);
    gif.writeFrame(index, width, height, { palette, delay });
  }

  gif.finish();
  const outBuffer = Buffer.from(gif.bytes());

  return {
    buffer: outBuffer,
    base64: outBuffer.toString("base64"),
    dataUrl: `data:image/gif;base64,${outBuffer.toString("base64")}`,
    width,
    height,
    frames,
    provider: "gifenc-local",
    animation,
  };
}

async function optimizeGif(inputBuffer, options = {}) {
  const { size = 512 } = options;
  const meta = await sharp(inputBuffer, { animated: true }).metadata();
  const pages = meta.pages || 1;

  if (pages > 1) {
    const outBuffer = await sharp(inputBuffer, { animated: true })
      .resize(size, size, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .gif()
      .toBuffer();

    return {
      buffer: outBuffer,
      base64: outBuffer.toString("base64"),
      dataUrl: `data:image/gif;base64,${outBuffer.toString("base64")}`,
      width: size,
      height: size,
      frames: pages,
      provider: "sharp-gif-optimize",
    };
  }

  return createAnimatedGif(inputBuffer, options);
}

async function createGifFromFrames(buffers, options = {}) {
  const { delay = 100, size = 512 } = options;
  const gif = GIFEncoder();
  let width = size;
  let height = size;

  for (const buf of buffers) {
    const { rgba, width: w, height: h } = await bufferToRgba(buf, size);
    width = w;
    height = h;
    const palette = quantize(rgba, 256);
    const index = applyPalette(rgba, palette);
    gif.writeFrame(index, width, height, { palette, delay });
  }

  gif.finish();
  const outBuffer = Buffer.from(gif.bytes());

  return {
    buffer: outBuffer,
    base64: outBuffer.toString("base64"),
    dataUrl: `data:image/gif;base64,${outBuffer.toString("base64")}`,
    width,
    height,
    frames: buffers.length,
    provider: "gifenc-frames",
  };
}

module.exports = { createAnimatedGif, optimizeGif, createGifFromFrames, ANIMATIONS };
