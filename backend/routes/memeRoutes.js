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
router.post("/voice-to-meme", upload.single("audio"), MemeController.createFromVoice);
router.post("/chat", MemeController.chat);
router.post("/chat/greeting", MemeController.getGreeting);
router.post("/generate-image", MemeController.generateImage);
router.post("/status-remixer", MemeController.statusRemixer);

module.exports = router;
