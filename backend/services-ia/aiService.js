/**
 * aiService.js — Viral Stick
 * ─────────────────────────────────────────────────────────────────────────────
 * Service IA principal. Orchestre les tâches via le TaskRouter.
 *
 * Chaque type de tâche utilise son propre pipeline IA :
 *   text  → Gemini > Mistral > Puter > DeepSeek > OpenRouter
 *   image → Pollinations > PollinationsFlux > Puter
 *   audio → Groq Whisper > Puter Whisper
 *
 * Ce fichier ne contient AUCUN appel HTTP direct.
 * Toute la logique réseau est dans services-ia/providers/*.js
 */

const { runText, runImage, runAudio } = require("./taskRouter");
const { normalizeText, parseJSON }    = require("./providers/text");
const { imageFallbackResult, cleanImagePrompt } = require("./providers/image");
const { COMPANION_PERSONAS, MODULE_PROMPTS, PROMPT_FACTORY } = require("./prompts");

// ─── Helpers ──────────────────────────────────────────────────────────────────

function truncateText(value, max = 1400) {
  const n = normalizeText(value);
  return n.length <= max ? n : n.slice(0, max).trim() + "...";
}

function getAxiosErrorDetails(error) {
  const status      = error?.response?.status;
  const statusText  = error?.response?.statusText;
  let   responseData = error?.response?.data;

  if (Buffer.isBuffer(responseData)) {
    try { responseData = JSON.parse(responseData.toString("utf8")); }
    catch { responseData = responseData.toString("utf8"); }
  }

  const providerMessage =
    responseData?.error?.message ||
    responseData?.message        ||
    responseData?.error          ||
    error?.message               ||
    "Unknown error";

  return {
    status,
    statusText,
    providerMessage: typeof providerMessage === "string"
      ? providerMessage
      : JSON.stringify(providerMessage),
  };
}

function sanitizeMemePayload(payload, voice = false, imageResult = null) {
  return {
    topText:          normalizeText(payload?.topText     || "QUAND TOUT PART EN VRILLE"),
    bottomText:       normalizeText(payload?.bottomText  || "ET QUE TU FAIS SEMBLANT DE GÉRER"),
    descriptionImage: normalizeText(payload?.descriptionImage || "Une scène expressive, exagérée et très relatable"),
    imageUrl:         imageResult?.imageUrl  || null,
    imageProvider:    imageResult?.provider,
    imageFallback:    !!imageResult?.fallback,
    ...(voice ? {
      original_transcript_subtitle: normalizeText(
        payload?.original_transcript_subtitle || "Transcription indisponible"
      ),
    } : {}),
  };
}

function getLocationContext(location) {
  const contexts = {
    france:        "Humour français: sarcasme, galère administrative, fatigue sociale, autodérision, références du quotidien.",
    cameroun:      "Humour camerounais: chaleur sociale, expressions locales, énergie communautaire, football et vie courante.",
    senegal:       "Humour sénégalais: convivialité, finesse, observation sociale, chaleur humaine.",
    coteivoire:    "Humour ivoirien: énergie festive, confiance, style, débrouillardise et punchlines populaires.",
    mali:          "Humour malien: observation posée, tradition, quotidien et contraste.",
    benin:         "Humour béninois: philosophie du quotidien, détente, débrouille.",
    congo:         "Humour congolais: musicalité, énergie, style, vie de groupe.",
    rdc:           "Humour RDC: ambiance vibrante, culture populaire, intensité expressive.",
    maroc:         "Humour marocain: chaleur, famille, contradictions sociales, hospitalité.",
    algerie:       "Humour algérien: franc, nerveux, direct, ancré dans le vécu.",
    tunisie:       "Humour tunisien: léger, vif, méditerranéen, urbain.",
    belgique:      "Humour belge: calme, absurde doux, autodérision.",
    suisse:        "Humour suisse: précis, calme, contraste entre ordre et imprévu.",
    canada:        "Humour québécois: oral, imagé, énergique, familier.",
    international: "Humour international: références universelles, ton accessible et partageable.",
  };
  return contexts[location] || contexts.international;
}

// ─── Construction du prompt de génération ─────────────────────────────────────
// Utilise le pipeline TEXTE pour fabriquer un prompt optimisé avant la vraie génération.

async function buildGenerationPrompt(factoryPrompt, rawContext, mode = "text") {
  try {
    const prepared = await runText(
      (call) => call(factoryPrompt, rawContext, "json"),
      null
    );

    if (!prepared) return normalizeText([rawContext, "SOURCE_CONTEXT:", rawContext].join("\n\n"));

    const generatedPrompt = normalizeText(prepared?.generation_prompt || rawContext);
    return normalizeText([generatedPrompt, "SOURCE_CONTEXT:", rawContext].join("\n\n"));
  } catch (e) {
    const { providerMessage } = getAxiosErrorDetails(e);
    console.warn(`[AI] buildGenerationPrompt fallback: ${providerMessage}`);
    return normalizeText([rawContext, "SOURCE_CONTEXT:", rawContext].join("\n\n"));
  }
}

// ─── AIService ────────────────────────────────────────────────────────────────

const AIService = {

  // ── Transcription audio ──────────────────────────────────────────────────
  // Pipeline : Groq Whisper > Puter Whisper

  transcribeAudio: async (buffer, mimeType) => {
    return runAudio(
      (call) => call(buffer, mimeType),
      null // pas de fallback texte : si ça échoue, on remonte l'erreur au controller
    );
  },

  // ── Génération de mème depuis texte ──────────────────────────────────────
  // Pipeline texte : Gemini > Mistral > Puter > DeepSeek > OpenRouter
  // Pipeline image : Pollinations > PollinationsFlux > Puter

  generateMemeFromText: async (text, location = "international") => {
    const locationContext = getLocationContext(location);
    const rawContext = [
      `LOCALISATION: ${location}`,
      `CADRE CULTUREL: ${locationContext}`,
      `CONTEXTE UTILISATEUR: ${normalizeText(text)}`,
      "OBJECTIF: créer un mème texte premium, social-first et drôle.",
    ].join("\n\n");

    // Étape 1 — Utiliser DIRECTEMENT le contexte utilisateur sans transformation
    const raw = await runText(
      (call) => call(MODULE_PROMPTS.contextReader, rawContext, "json"),
      {
        topText:          "QUAND TU VEUX GÉRER TRANQUILLE",
        bottomText:       "ET QUE LE CHAOS CHOISIT TON NOM",
        descriptionImage: "Une personne figée pendant que tout s'effondre autour d'elle",
      }
    );

    // Étape 2 — Génère l'image via le pipeline image
    const imageResult = await AIService.generateImage(raw?.descriptionImage || text);

    return sanitizeMemePayload(raw, false, imageResult);
  },

  // ── Génération de mème depuis voix ───────────────────────────────────────

  generateMemeFromVoice: async (transcription) => {
    const rawContext = [
      `TRANSCRIPTION: ${normalizeText(transcription)}`,
      "OBJECTIF: créer un mème issu d'une parole spontanée, garder l'énergie et la chute comique.",
    ].join("\n\n");

    // Utiliser DIRECTEMENT la transcription sans transformation
    const raw = await runText(
      (call) => call(MODULE_PROMPTS.voiceToMeme, rawContext, "json"),
      {
        topText:          "QUAND TU PARLES TROP VITE",
        bottomText:       "MAIS QUE LE DRAME RESTE COMPRÉHENSIBLE",
        descriptionImage: "Un micro saturé devant quelqu'un très expressif",
        original_transcript_subtitle: normalizeText(transcription),
      }
    );

    const imageResult = await AIService.generateImage(raw?.descriptionImage || transcription);

    return sanitizeMemePayload(raw, true, imageResult);
  },

  // ── Status Remixer ───────────────────────────────────────────────────────

  generateStatusRemix: async ({ text, location = "international", imageContext, inputImageUrl, inputImageBase64 }) => {
    const locationContext = getLocationContext(location);
    const rawContext = [
      `LOCALISATION: ${location}`,
      `CADRE CULTUREL: ${locationContext}`,
      `CONTEXTE SOURCE: ${normalizeText(text)}`,
      imageContext     ? `CONTEXTE IMAGE: ${normalizeText(imageContext)}`     : null,
      inputImageUrl    ? `IMAGE_UTILISATEUR_URL: ${inputImageUrl}`            : null,
      inputImageBase64 ? `IMAGE_UTILISATEUR_BASE64: image base64 fournie`     : null,
      "OBJECTIF: fabriquer une caption mème premium et des améliorations visuelles.",
    ].filter(Boolean).join("\n\n");

    // Utiliser DIRECTEMENT le contexte sans transformation
    const remixData = await runText(
      (call) => call(MODULE_PROMPTS.statusRemixer, rawContext, "json"),
      {
        meme_text:           "MOI QUI PENSAIS POSTER ÇA TRANQUILLE",
        visual_enhancements: ["Renforcer le contraste", "Ajouter une caption courte", "Recadrer sur la réaction"],
        descriptionImage:    "Une scène expressive, premium, mobile-first",
      }
    );

    let imageResult;
    if (inputImageBase64 || inputImageUrl) {
      imageResult = {
        imageUrl:    inputImageBase64 || inputImageUrl,
        description: normalizeText(remixData?.descriptionImage || text),
        provider:    "user-upload",
        fallback:    false,
      };
    } else {
      const imagePrompt = [
        remixData?.descriptionImage,
        remixData?.meme_text,
        `SOURCE_CONTEXT: ${normalizeText(text)}`,
        imageContext ? `IMAGE_CONTEXT: ${normalizeText(imageContext)}` : null,
      ].filter(Boolean).join("\n\n");

      imageResult = await AIService.generateImage(imagePrompt);
    }

    return {
      meme_text:           normalizeText(remixData?.meme_text || text),
      visual_enhancements: Array.isArray(remixData?.visual_enhancements)
        ? remixData.visual_enhancements.map((i) => normalizeText(i)).filter(Boolean)
        : [],
      descriptionImage: normalizeText(remixData?.descriptionImage || imageResult?.description),
      sourceImageUrl:   inputImageUrl || inputImageBase64 || null,
      imageUrl:         imageResult?.imageUrl  || null,
      imageProvider:    imageResult?.provider,
      fallback:         !!imageResult?.fallback,
    };
  },

  // ── Chat compagnon ───────────────────────────────────────────────────────
  // Utilise le pipeline TEXTE, mode "chat" — Gemini > Mistral > Puter > ...

  chatWithCompanion: async (companionId, message) => {
    const personaData = COMPANION_PERSONAS[companionId] || COMPANION_PERSONAS.arch;
    const systemPrompt = [
      `Tu es ${personaData.persona}`,
      `Ton ton est: ${personaData.tone}`,
      `Instructions: ${personaData.instructions.join(" ")}`,
    ].join("\n");

    const fallbackMessage = "Désolé, j'ai une petite perte de synchronisation. Réessaie dans un instant.";

    // On essaie d'abord de construire un prompt optimisé pour le chat
    let finalPrompt = normalizeText(message);
    try {
      const chatContext = [
        `COMPAGNON: ${companionId}`,
        `SYSTEM_PROMPT: ${systemPrompt}`,
        `MESSAGE_UTILISATEUR: ${normalizeText(message)}`,
      ].join("\n\n");

      const prepared = await buildGenerationPrompt(PROMPT_FACTORY.chat, chatContext, "text");
      finalPrompt = prepared || finalPrompt;
    } catch {
      // Pas grave — on continue avec le message brut
    }

    return runText(
      (call) => call(systemPrompt, finalPrompt, "text"),
      fallbackMessage
    );
  },

  // ── Génération d'image ───────────────────────────────────────────────────
  // Pipeline image : Pollinations > PollinationsFlux > Puter
  // Construit d'abord un prompt optimisé via le pipeline texte.

  generateImage: async (prompt) => {
    const cleanedPrompt = cleanImagePrompt(prompt);
    if (!cleanedPrompt) return imageFallbackResult(prompt, "prompt vide");

    // Étape 1 — Optimise le prompt image via le pipeline texte
    let imagePrompt = cleanedPrompt;
    try {
      const prepared = await runText(
        (call) => call(PROMPT_FACTORY.image, cleanedPrompt, "json"),
        null
      );
      if (prepared?.generation_prompt) {
        imagePrompt = cleanImagePrompt(prepared.generation_prompt);
      }
    } catch (e) {
      console.warn("[AI] Image prompt builder échoué, utilise le prompt brut");
    }

    // Étape 2 — Génère l'image via le pipeline image
    try {
      return await runImage((call) => call(imagePrompt || cleanedPrompt));
    } catch (e) {
      const { status, providerMessage } = getAxiosErrorDetails(e);
      console.warn(`[AI] Tous les providers image ont échoué (${status}): ${providerMessage}`);
      return imageFallbackResult(
        prompt,
        status === 402
          ? "Crédits image insuffisants sur tous les providers."
          : "Génération image temporairement indisponible."
      );
    }
  },
};

module.exports = AIService;
