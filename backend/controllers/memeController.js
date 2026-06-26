const AIService = require("../services-ia/aiService");
const ShareService = require("../services-ia/shareService");

async function attachMemeShare(req, memeData) {
  const baseUrl = `${req.protocol}://${req.get("host")}`;
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
}

async function attachRemixShare(req, remix) {
  const baseUrl = `${req.protocol}://${req.get("host")}`;
  const sourceImage =
    remix.sourceImageUrl && String(remix.sourceImageUrl).startsWith("data:")
      ? remix.sourceImageUrl
      : remix.imageUrl;

  const share = await ShareService.buildShareBundle({
    caption: remix.meme_text,
    bottomText: remix.meme_text,
    imageUrl: sourceImage,
    baseUrl,
  });

  return {
    ...remix,
    composedImageUrl: share.imageDataUrl || sourceImage || null,
    share,
  };
}

function wantsCompanion(req) {
  return req.body?.companionComment === true || req.query?.companion === "true";
}

const MemeController = {
  createFromText: async (req, res) => {
    try {
      const { text, location } = req.body;
      if (!text) return res.status(400).json({ error: "Texte requis" });

      const memeData = await AIService.generateMemeFromText(text, location);

      let companionComment = null;
      if (wantsCompanion(req)) {
        try {
          companionComment = await AIService.chatWithCompanion(
            "art",
            `Mème généré pour "${text}": "${memeData.topText} / ${memeData.bottomText}". Commente brièvement en tant qu'Art.`
          );
        } catch {
          companionComment = "Art adore ce concept !";
        }
      }

      const withShare = await attachMemeShare(req, memeData);
      res.status(200).json({
        message: "Mème généré avec succès",
        ...withShare,
        companionComment,
        location: location || "international",
      });
    } catch (error) {
      console.error("[createFromText]", error);
      res.status(500).json({ error: "Erreur lors de la génération" });
    }
  },

  createFromVoice: async (req, res) => {
    try {
      let { transcription } = req.body;

      if (req.file) {
        try {
          transcription = await AIService.transcribeAudio(req.file.buffer, req.file.mimetype);
        } catch (e) {
          console.error("[createFromVoice][transcription]", e.message);
          return res.status(502).json({
            error: "Service de transcription indisponible. Réessaie dans un instant.",
          });
        }
      }

      if (!transcription) {
        return res.status(400).json({ error: "Audio (champ 'audio') ou transcription requis" });
      }

      const memeData = await AIService.generateMemeFromVoice(transcription);

      let companionComment = null;
      if (wantsCompanion(req)) {
        try {
          companionComment = await AIService.chatWithCompanion(
            "ubu",
            `L'utilisateur a dit : "${transcription}". Mème : "${memeData.topText} / ${memeData.bottomText}". Blague courte en tant qu'Ubu.`
          );
        } catch {
          companionComment = "Ubu trouve ça hilarant ! 🤖";
        }
      }

      const withShare = await attachMemeShare(req, memeData);
      res.status(200).json({
        message: "Mème vocal généré avec succès",
        transcription,
        ...withShare,
        companionComment,
      });
    } catch (error) {
      console.error("[createFromVoice]", error);
      res.status(500).json({ error: "Erreur lors de la génération vocale" });
    }
  },

  chat: async (req, res) => {
    try {
      const { companionId, message } = req.body;
      if (!message || !companionId) {
        return res.status(400).json({ error: "Message et companionId requis" });
      }
      const reply = await AIService.chatWithCompanion(companionId, message);
      res.status(200).json({ reply });
    } catch (error) {
      res.status(500).json({ error: "Erreur lors du chat" });
    }
  },

  getGreeting: async (req, res) => {
    try {
      const { companionId } = req.body;
      const reply = await AIService.chatWithCompanion(
        companionId,
        "Présente-toi brièvement selon ton rôle et souhaite-moi la bienvenue sur Viral Stick."
      );
      res.status(200).json({ reply });
    } catch (error) {
      res.status(500).json({ error: "Erreur lors du salut" });
    }
  },

  generateImage: async (req, res) => {
    try {
      const { prompt } = req.body;
      if (!prompt) return res.status(400).json({ error: "Prompt requis" });
      const imageResult = await AIService.generateImage(prompt);
      res.status(200).json(imageResult);
    } catch (error) {
      res.status(500).json({ error: "Erreur lors de la génération d'image" });
    }
  },

  transcribe: async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "Champ 'audio' requis" });
      }
      const transcription = await AIService.transcribeAudio(req.file.buffer, req.file.mimetype);
      res.status(200).json({ transcription });
    } catch (error) {
      console.error("[transcribe]", error);
      res.status(502).json({ error: "Transcription indisponible" });
    }
  },

  statusRemixer: async (req, res) => {
    try {
      const { text, location, imageContext, inputImageUrl, inputImageBase64 } = req.body;
      if (!text && !inputImageUrl && !inputImageBase64) {
        return res.status(400).json({ error: "Texte ou image requis" });
      }

      const remix = await AIService.generateStatusRemix({
        text: text || "Image utilisateur à transformer en mème premium",
        location,
        imageContext,
        inputImageUrl,
        inputImageBase64,
      });

      let companionComment = null;
      if (wantsCompanion(req)) {
        try {
          companionComment = await AIService.chatWithCompanion(
            "bio",
            `Remix: "${text}". Caption: "${remix.meme_text}". Court retour créatif en tant que Bio.`
          );
        } catch {
          companionComment = "Bio valide le rendu : plus lisible, plus postable.";
        }
      }

      const withShare = await attachRemixShare(req, remix);
      res.status(200).json({
        ...withShare,
        companionComment,
        location: location || "international",
      });
    } catch (error) {
      console.error("[statusRemixer]", error);
      res.status(500).json({ error: "Erreur lors du remix du status" });
    }
  },
};

module.exports = MemeController;
