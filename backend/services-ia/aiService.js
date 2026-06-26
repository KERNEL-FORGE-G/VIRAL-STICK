/**
 * aiService.js — Viral Stick
 * Pipeline optimisé : 1 appel texte + 1 appel image par génération de mème.
 */

const { runText, runImage, runAudio } = require("./taskRouter");
const { normalizeText } = require("./providers/text");
const { imageFallbackResult, cleanImagePrompt } = require("./providers/image");
const { COMPANION_PERSONAS, MODULE_PROMPTS } = require("./prompts");

function getAxiosErrorDetails(error) {
  const status = error?.response?.status;
  let responseData = error?.response?.data;
  if (Buffer.isBuffer(responseData)) {
    try { responseData = JSON.parse(responseData.toString("utf8")); }
    catch { responseData = responseData.toString("utf8"); }
  }
  const providerMessage =
    responseData?.error?.message ||
    responseData?.message ||
    responseData?.error ||
    error?.message ||
    "Unknown error";
  return {
    status,
    providerMessage: typeof providerMessage === "string"
      ? providerMessage
      : JSON.stringify(providerMessage),
  };
}

function sanitizeMemePayload(payload, voice = false, imageResult = null) {
  return {
    topText: normalizeText(payload?.topText || "QUAND TOUT PART EN VRILLE"),
    bottomText: normalizeText(payload?.bottomText || "ET QUE TU FAIS SEMBLANT DE GÉRER"),
    descriptionImage: normalizeText(payload?.descriptionImage || "Une scène expressive, exagérée et très relatable"),
    imageUrl: imageResult?.imageUrl || null,
    imageProvider: imageResult?.provider,
    imageFallback: !!imageResult?.fallback,
    ...(voice ? {
      original_transcript_subtitle: normalizeText(
        payload?.original_transcript_subtitle || "Transcription indisponible"
      ),
    } : {}),
  };
}

function getLocationContext(location) {
  const contexts = {
    france: "Humour français: sarcasme, galère administrative, fatigue sociale, autodérision.",
    cameroun: "Humour camerounais: chaleur sociale, expressions locales, énergie communautaire.",
    senegal: "Humour sénégalais: convivialité, finesse, observation sociale.",
    coteivoire: "Humour ivoirien: énergie festive, confiance, débrouillardise.",
    mali: "Humour malien: observation posée, tradition, quotidien.",
    benin: "Humour béninois: philosophie du quotidien, détente.",
    congo: "Humour congolais: musicalité, énergie, style.",
    rdc: "Humour RDC: ambiance vibrante, culture populaire.",
    maroc: "Humour marocain: chaleur, famille, contradictions sociales.",
    algerie: "Humour algérien: franc, nerveux, direct.",
    tunisie: "Humour tunisien: léger, vif, méditerranéen.",
    belgique: "Humour belge: calme, absurde doux, autodérision.",
    suisse: "Humour suisse: précis, calme, contraste ordre/imprévu.",
    canada: "Humour québécois: oral, imagé, énergique.",
    international: "Humour international: références universelles, ton accessible.",
  };
  return contexts[location] || contexts.international;
}

function buildMemeContext({ text, location, transcription, imageContext, inputImageUrl }) {
  const locationContext = getLocationContext(location || "international");
  const parts = [
    `LOCALISATION: ${location || "international"}`,
    `CADRE CULTUREL: ${locationContext}`,
  ];
  if (transcription) {
    parts.push(`TRANSCRIPTION: ${normalizeText(transcription)}`);
    parts.push("OBJECTIF: mème issu d'une parole spontanée, garder l'énergie comique.");
  } else {
    parts.push(`CONTEXTE UTILISATEUR: ${normalizeText(text)}`);
    parts.push("OBJECTIF: créer un mème texte premium, social-first et drôle en une seule passe.");
  }
  if (imageContext) parts.push(`CONTEXTE IMAGE: ${normalizeText(imageContext)}`);
  if (inputImageUrl) parts.push(`IMAGE_UTILISATEUR: ${inputImageUrl}`);
  return parts.join("\n\n");
}

const AIService = {

  transcribeAudio: async (buffer, mimeType) => {
    return runAudio((call) => call(buffer, mimeType), null);
  },

  generateMemeFromText: async (text, location = "international") => {
    const context = buildMemeContext({ text, location });

    const raw = await runText(
      (call) => call(MODULE_PROMPTS.contextReader, context, "json"),
      {
        topText: "QUAND TU VEUX GÉRER TRANQUILLE",
        bottomText: "ET QUE LE CHAOS CHOISIT TON NOM",
        descriptionImage: "Une personne figée pendant que tout s'effondre autour d'elle",
      }
    );

    const imageResult = await AIService.generateImage(raw?.descriptionImage || text);
    return sanitizeMemePayload(raw, false, imageResult);
  },

  generateMemeFromVoice: async (transcription) => {
    const context = buildMemeContext({ text: transcription, transcription });

    const raw = await runText(
      (call) => call(MODULE_PROMPTS.voiceToMeme, context, "json"),
      {
        topText: "QUAND TU PARLES TROP VITE",
        bottomText: "MAIS QUE LE DRAME RESTE COMPRÉHENSIBLE",
        descriptionImage: "Un micro saturé devant quelqu'un très expressif",
        original_transcript_subtitle: normalizeText(transcription),
      }
    );

    const imageResult = await AIService.generateImage(raw?.descriptionImage || transcription);
    return sanitizeMemePayload(raw, true, imageResult);
  },

  generateStatusRemix: async ({ text, location = "international", imageContext, inputImageUrl, inputImageBase64 }) => {
    const context = buildMemeContext({ text, location, imageContext, inputImageUrl });

    const remixData = await runText(
      (call) => call(MODULE_PROMPTS.statusRemixer, context, "json"),
      {
        meme_text: "MOI QUI PENSAIS POSTER ÇA TRANQUILLE",
        visual_enhancements: ["Renforcer le contraste", "Ajouter une caption courte"],
        descriptionImage: "Une scène expressive, premium, mobile-first",
      }
    );

    let imageResult;
    if (inputImageBase64 || inputImageUrl) {
      imageResult = {
        imageUrl: inputImageBase64 || inputImageUrl,
        description: normalizeText(remixData?.descriptionImage || text),
        provider: "user-upload",
        fallback: false,
      };
    } else {
      const imagePrompt = [
        remixData?.descriptionImage,
        remixData?.meme_text,
        `SOURCE: ${normalizeText(text)}`,
      ].filter(Boolean).join(". ");
      imageResult = await AIService.generateImage(imagePrompt);
    }

    return {
      meme_text: normalizeText(remixData?.meme_text || text),
      visual_enhancements: Array.isArray(remixData?.visual_enhancements)
        ? remixData.visual_enhancements.map((i) => normalizeText(i)).filter(Boolean)
        : [],
      descriptionImage: normalizeText(remixData?.descriptionImage || imageResult?.description),
      sourceImageUrl: inputImageUrl || inputImageBase64 || null,
      imageUrl: imageResult?.imageUrl || null,
      imageProvider: imageResult?.provider,
      fallback: !!imageResult?.fallback,
    };
  },

  chatWithCompanion: async (companionId, message) => {
    const personaData = COMPANION_PERSONAS[companionId] || COMPANION_PERSONAS.arch;
    const systemPrompt = [
      `Tu es ${personaData.persona}`,
      `Ton ton est: ${personaData.tone}`,
      `Instructions: ${personaData.instructions.join(" ")}`,
    ].join("\n");

    return runText(
      (call) => call(systemPrompt, normalizeText(message), "text"),
      "Désolé, j'ai une petite perte de synchronisation. Réessaie dans un instant."
    );
  },

  generateImage: async (prompt) => {
    const imagePrompt = cleanImagePrompt(prompt);
    if (!imagePrompt) return imageFallbackResult(prompt, "prompt vide");

    try {
      return await runImage((call) => call(imagePrompt));
    } catch (e) {
      const { status, providerMessage } = getAxiosErrorDetails(e);
      console.warn(`[AI] Image failed (${status}): ${providerMessage}`);
      return imageFallbackResult(
        prompt,
        status === 402
          ? "Crédits image insuffisants."
          : "Génération image temporairement indisponible."
      );
    }
  },
};

module.exports = AIService;
