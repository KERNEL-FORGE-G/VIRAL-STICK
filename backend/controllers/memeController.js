const AIService = require("../services-ia/aiService");
const ShareService = require("../services-ia/shareService");
const ForumController = require("./forumController");

async function attachMemeShare(req, memeData) {
  const baseUrl = `${req.protocol}://${req.get("host")}`;
  try {
    const share = await ShareService.buildShareBundle({
      topText: memeData.topText,
      bottomText: memeData.bottomText,
      imageUrl: memeData.imageUrl,
      baseUrl,
    });
    return {
      ...memeData,
      composedImageUrl: share.imageDataUrl || memeData.imageUrl || null,
      share,
    };
  } catch (e) {
    console.warn("[MemeController] Share bundle failed, returning raw data:", e.message);
    return { ...memeData, share: null };
  }
}

/**
 * Publication automatique sur le forum (Non-bloquant)
 */
async function autoPublish(req, memeData, type) {
  try {
    const { userId, username } = req.body;
    const fakeReq = {
      body: {
        shareId: memeData.share?.shareId || `auto_${Date.now()}`,
        imageUrl: memeData.composedImageUrl || memeData.imageUrl,
        topText: memeData.topText || "",
        bottomText: memeData.bottomText || "",
        userId: userId || "anon",
        username: username || "Viral Creator"
      }
    };
    // On ne bloque pas la réponse principale
    ForumController.publishMeme(fakeReq, { json: () => {} }).catch(() => {});
  } catch (e) {
    console.error("[AutoPublish] Error:", e.message);
  }
}

const MemeController = {
  createFromText: async (req, res) => {
    try {
      const { text, location } = req.body;
      if (!text) return res.status(400).json({ error: "Texte manquant" });

      console.log(`[MemeController] Generating from text: "${text.substring(0, 30)}..."`);

      const memeData = await AIService.generateMemeFromText(text, location);
      const withShare = await attachMemeShare(req, memeData);

      // Publish in background
      autoPublish(req, withShare, "text");

      res.status(200).json({
        ...withShare,
        companionComment: "Ton concept est maintenant viral !",
      });
    } catch (error) {
      console.error("[MemeController] Error:", error.message);
      res.status(500).json({
        error: "Le studio IA est temporairement indisponible.",
        details: error.message
      });
    }
  },

  createFromVoice: async (req, res) => {
    try {
      let { transcription } = req.body;
      if (req.file) {
        transcription = await AIService.transcribeAudio(req.file.buffer, req.file.mimetype);
      }
      if (!transcription) return res.status(400).json({ error: "Contenu audio ou transcription manquant" });

      const memeData = await AIService.generateMemeFromVoice(transcription);
      const withShare = await attachMemeShare(req, memeData);

      autoPublish(req, withShare, "voice");

      res.status(200).json({
        transcription,
        ...withShare,
        companionComment: "J'ai capturé l'essence de ton message !",
      });
    } catch (error) {
      console.error("[MemeController] Voice Error:", error.message);
      res.status(500).json({ error: "Échec du traitement vocal" });
    }
  },

  statusRemixer: async (req, res) => {
    try {
      const { text, location, inputImageUrl, inputImageBase64 } = req.body;
      const remix = await AIService.generateStatusRemix({
        text,
        location,
        inputImageUrl,
        inputImageBase64,
      });

      // Simple wrapper for remix share
      const baseUrl = `${req.protocol}://${req.get("host")}`;
      const share = await ShareService.buildShareBundle({
        caption: remix.meme_text,
        imageUrl: remix.imageUrl,
        baseUrl,
      });

      const withShare = { ...remix, share };
      autoPublish(req, withShare, "remix");

      res.status(200).json(withShare);
    } catch (error) {
      console.error("[MemeController] Remix Error:", error.message);
      res.status(500).json({ error: "Impossible de remixer ce contenu" });
    }
  },

  compose: async (req, res) => {
    try {
      const { imageUrl, topText, bottomText } = req.body;
      const baseUrl = `${req.protocol}://${req.get("host")}`;
      const share = await ShareService.buildShareBundle({
        topText,
        bottomText,
        imageUrl,
        baseUrl,
      });
      res.json({
        composedImageUrl: share.imageDataUrl,
        share
      });
    } catch (error) {
      res.status(500).json({ error: "Erreur de composition" });
    }
  },

  chat: async (req, res) => {
    try {
      const { companionId, message } = req.body;
      const response = await AIService.chatWithCompanion(companionId, message);
      res.json({ response });
    } catch (error) {
      res.status(500).json({ error: "Le compagnon ne répond pas" });
    }
  }
};

module.exports = MemeController;
