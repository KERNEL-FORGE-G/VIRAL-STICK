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

    // On donne la priorité à l'URL Cloudinary pour la persistance
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
 * Publication automatique sur le forum (URL Cloudinary uniquement)
 */
async function autoPublish(req, withShare, type) {
  try {
    const { userId, username } = req.body;
    const imageUrl = withShare.share?.publicUrl || withShare.composedImageUrl;

    // On refuse de publier du base64 sur Firestore (limite de taille)
    if (!imageUrl || imageUrl.startsWith('data:')) {
      console.log(`[AutoPublish] En attente d'URL permanente pour ${type}...`);
      return;
    }

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

    await ForumController.publishMeme(fakeReq, { json: () => {} });
    console.log(`[AutoPublish] Mème ${type} publié sur Firestore via Cloudinary.`);
  } catch (e) {
    console.error("[AutoPublish] Erreur:", e.message);
  }
}

const MemeController = {
  createFromText: async (req, res) => {
    try {
      const { text, location } = req.body;
      const memeData = await AIService.generateMemeFromText(text, location);
      const withShare = await attachMemeShare(req, memeData);
      autoPublish(req, withShare, "text");
      res.status(200).json(withShare);
    } catch (error) {
      res.status(500).json({ error: "Erreur IA" });
    }
  },

  statusRemixer: async (req, res) => {
    try {
      const { text, location, inputImageUrl, inputImageBase64 } = req.body;
      const remix = await AIService.generateStatusRemix({ text: text || "Remix", location, inputImageUrl, inputImageBase64 });

      const baseUrl = `${req.protocol}://${req.get("host")}`;
      const share = await ShareService.buildShareBundle({
        caption: remix.meme_text,
        imageUrl: remix.imageUrl || inputImageUrl,
        imageBase64: inputImageBase64,
        baseUrl,
      });

      const withShare = { ...remix, share, composedImageUrl: share.publicUrl || share.imageDataUrl };
      autoPublish(req, withShare, "remix");
      res.status(200).json(withShare);
    } catch (error) {
      res.status(500).json({ error: "Erreur Remix" });
    }
  },

  compose: async (req, res) => {
    try {
      const { imageUrl, imageBase64, topText, bottomText, topY, bottomY } = req.body;
      const share = await ShareService.buildShareBundle({
        topText, bottomText, imageUrl, imageBase64, topY, bottomY
      });
      res.json({ composedImageUrl: share.finalUrl || share.publicUrl || share.imageDataUrl, share });
    } catch (error) {
      res.status(500).json({ error: "Erreur de fusion" });
    }
  },

  createFromVoice: async (req, res) => {
    try {
      let { transcription } = req.body;
      const memeData = await AIService.generateMemeFromVoice(transcription);
      const withShare = await attachMemeShare(req, memeData);
      autoPublish(req, withShare, "voice");
      res.status(200).json(withShare);
    } catch (e) { res.status(500).json({ error: "Erreur Voice" }); }
  }
};

module.exports = MemeController;
