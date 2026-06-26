/**
 * stickerRoutes.js — Viral Stick
 * Routes pour la feature sticker / face-swap.
 *
 * Toutes les routes sont sous /api/sticker/
 *
 * POST /api/sticker/export      — resize + export PNG transparent
 * POST /api/sticker/composite   — colle sticker sur photo
 * POST /api/sticker/face        — face swap (sticker + photo visage)
 * POST /api/sticker/meme-text   — ajoute topText/bottomText sur image
 */

const express    = require("express");
const multer     = require("multer");
const router     = express.Router();
const StickerController = require("../controllers/stickerController");

const upload = multer({
  storage: multer.memoryStorage(),
  limits:  { fileSize: 15 * 1024 * 1024 }, // 15 Mo max
  fileFilter: (req, file, cb) => {
    const ok = /^image\/(jpeg|png|webp|gif|bmp)$/.test(file.mimetype);
    cb(ok ? null : new Error("Type de fichier non supporté"), ok);
  },
});

// Upload d'un seul fichier
const single = (field) => upload.single(field);

// Upload de plusieurs fichiers (pour composite et face-swap)
const multi  = upload.fields([
  { name: "photo",   maxCount: 1 },
  { name: "sticker", maxCount: 1 },
  { name: "face",    maxCount: 1 },
]);

router.post("/export",    single("sticker"), StickerController.export);
router.post("/composite", multi,             StickerController.composite);
router.post("/face",      multi,             StickerController.faceSwap);
router.post("/gif",       single("image"),   StickerController.exportGif);
router.post("/studio",    multi,             StickerController.studio);
router.post("/meme-text", single("image"),   StickerController.addMemeText);

module.exports = router;
