const AIService = require("../services-ia/aiService");
const ShareService = require("../services-ia/shareService");
const ForumController = require("./forumController");

/**
 * Prépare l'image (Fusion + Upload Cloudinary)
 */
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
      composedImageUrl: share.publicUrl || share.imageDataUrl || memeData.imageUrl,
      share,
    };
  } catch (e) {
    console.error("[MemeController] Share failed:", e.message);
    return { ...memeData, share: null };
  }
}

/**
 * Publication automatique sur le forum (Non-bloquant)
 */
async function autoPublish(req, withShare, type) {
  try {
    const { userId, username } = req.body;
    const imageUrl = withShare.share?.publicUrl || withShare.composedImageUrl;

    if (!imageUrl || imageUrl.startsWith('data:')) {
      console.log(`[AutoPublish] Ignoré: Pas d'URL permanente pour ${type}`);
      return;
    }

    // On utilise une version simplifiée de req/res pour ne pas faire planter le serveur
    const fakeReq = {
      body: {
        shareId: withShare.share?.shareId || `auto_${Date.now()}`,
        imageUrl: imageUrl,
        topText: withShare.topText || "",
        bottomText: withShare.bottomText || "",
        userId: userId || "anon",
        username: username || "Viral Creator"
      }
    };

    // On appelle la logique de publication sans attendre (fire and forget)
    // On passe un objet res simulé qui ne fait rien
    ForumController.publishMeme(fakeReq, {
      json: () => {},
      status: () => ({ json: () => {} })
    }).catch(e => console.error("[AutoPublish] Error:", e.message));

  } catch (e) {
    console.error("[AutoPublish] Global Error:", e.message);
  }
}

const MemeController = {
  createFromText: async (req, res) => {
    try {
      const { text, location } = req.body;
      if (!text) return res.status(400).json({ error: "Texte manquant" });

      const memeData = await AIService.generateMemeFromText(text, location);
      const withShare = await attachMemeShare(req, memeData);

      autoPublish(req, withShare, "text");
      res.status(200).json(withShare);
    } catch (error) {
      console.error("[MemeController] createFromText Error full:", error);
      res.status(500).json({ error: "L'IA a eu un petit problème technique.", details: error.message });
    }
  },

  statusRemixer: async (req, res) => {
    try {
      const { text, location, inputImageUrl, inputImageBase64 } = req.body;
      const remix = await AIService.generateStatusRemix({
        text: text || "Remix",
        location,
        inputImageUrl,
        inputImageBase64
      });

      const baseUrl = `${req.protocol}://${req.get("host")}`;
      const share = await ShareService.buildShareBundle({
        caption: remix.meme_text,
        imageUrl: remix.imageUrl || inputImageUrl,
        imageBase64: inputImageBase64,
        baseUrl,
      });

      const withShare = {
        ...remix,
        share,
        composedImageUrl: share.publicUrl || share.imageDataUrl || remix.imageUrl
      };

      autoPublish(req, withShare, "remix");
      res.status(200).json(withShare);
    } catch (error) {
      console.error("[MemeController] statusRemixer Error full:", error);
      res.status(500).json({ error: "Impossible de remixer cette image.", details: error.message });
    }
  },

  compose: async (req, res) => {
    try {
      const { imageUrl, imageBase64, topText, bottomText, topY, bottomY } = req.body;
      const share = await ShareService.buildShareBundle({
        topText: topText || "",
        bottomText: bottomText || "",
        imageUrl,
        imageBase64,
        topY,
        bottomY
      });
      res.json({
        composedImageUrl: share.publicUrl || share.imageDataUrl || imageUrl || imageBase64,
        share
      });
    } catch (error) {
      console.error("[MemeController] compose Error full:", error);
      res.status(500).json({ error: "Erreur lors de la fusion de l'image." });
    }
  },

  createFromVoice: async (req, res) => {
    try {
      let { transcription } = req.body;
      if (!transcription) return res.status(400).json({ error: "Transcription manquante" });

      const memeData = await AIService.generateMemeFromVoice(transcription);
      const withShare = await attachMemeShare(req, memeData);

      autoPublish(req, withShare, "voice");
      res.status(200).json(withShare);
    } catch (error) {
      console.error("[MemeController] createFromVoice Error full:", error);
      res.status(500).json({ error: "Erreur lors du traitement de la voix." });
    }
  },

  chat: async (req, res) => {
    try {
      const { companionId, message } = req.body;
      if (!message) return res.status(400).json({ error: "Message vide" });

      const reply = await AIService.chatWithCompanion(companionId, message);
      res.json({ reply });
    } catch (error) {
      console.error("[MemeController] chat Error full:", error);
      res.status(500).json({ error: "Le compagnon ne répond pas." });
    }
  }
};

module.exports = MemeController;
