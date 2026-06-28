const express = require("express");
const multer = require("multer");
const router = express.Router();
const MemeController = require("../controllers/memeController");

// Upload en mémoire (pas de stockage disque) — limite 15 Mo, conforme au
// contrat d'API qui attend un champ "audio" en multipart/form-data.
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 15 * 1024 * 1024 },
});

router.post("/generate-from-text", MemeController.createFromText);
// Alias conforme au contrat d'API (docs/contrat-api.md) : POST /api/context-reader
router.post("/context-reader", MemeController.createFromText);
// Handle both cases: transcription JSON (mobile) and audio file (web)
router.post("/voice-to-meme", (req, res, next) => {
  // If it's JSON with transcription, skip multer
  if (req.headers['content-type']?.includes('application/json') && req.body.transcription) {
    return next();
  }
  // Otherwise use multer for audio file
  upload.single("audio")(req, res, next);
}, MemeController.createFromVoice);
router.post("/chat", MemeController.chat);
router.post("/chat/greeting", MemeController.getGreeting);
router.post("/generate-image", MemeController.generateImage);
router.post("/status-remixer", MemeController.statusRemixer);
router.post("/compose", MemeController.compose);

module.exports = router;
