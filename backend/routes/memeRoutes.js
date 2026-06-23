const express = require("express");
const router = express.Router();
const MemeController = require("../controllers/memeController");

router.post("/generate-from-text", MemeController.createFromText);
router.post("/voice-to-meme", MemeController.createFromVoice);
router.post("/chat", MemeController.chat);
router.post("/chat/greeting", MemeController.getGreeting);
router.post("/generate-image", MemeController.generateImage);

module.exports = router;
