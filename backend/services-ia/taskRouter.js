/**
 * taskRouter.js — Viral Stick
 * ─────────────────────────────────────────────────────────────────────────────
 * Routing intelligent : chaque type de tâche a son pipeline IA dédié.
 * Ordre de priorité : EXCELLENT (Grok, Gemini) > FALLBACKS > GRATUIT
 */

const textProviders  = require("./providers/text");
const imageProviders = require("./providers/image");
const audioProviders = require("./providers/audio");

// ─── Pipelines par type de tâche ─────────────────────────────────────────────

const PIPELINES = {
  /**
   * TEXT — Génération de mème, chat compagnon, remix de status
   * Pipeline : Grok (x.ai 4.3) > Gemini (Multi-modèles) > DeepSeek > Mistral > Puter > OpenRouter
   */
  text: [
    { name: "Grok-4.3",     fn: textProviders.callGrok },     // PRIORITÉ EXCELLENTE
    { name: "Gemini",       fn: textProviders.callGemini },   // EXCELLENT & STABLE
    { name: "DeepSeek",     fn: textProviders.callDeepSeek }, // HAUTE QUALITÉ
    { name: "Mistral",      fn: textProviders.callMistral },  // FIABLE
    { name: "Puter",        fn: textProviders.callPuter },    // ROBUSTE
    { name: "OpenRouter",   fn: textProviders.callOpenRouter }, // ULTIME SECOURS
  ],

  /**
   * IMAGE — Génération text-to-image
   * Priorité : Puter (Premium SDXL) > Pollinations (Gratuit en dernier)
   */
  image: [
    { name: "Puter-SDXL",       fn: imageProviders.callPuterImage },     // PREMIUM
    { name: "PollinationsFlux", fn: imageProviders.callPollinationsFlux }, // GRATUIT SECOURS
    { name: "Pollinations",     fn: imageProviders.callPollinations },     // GRATUIT SECOURS
  ],

  /**
   * AUDIO — Transcription Whisper
   * Priorité : Groq (Instant-Whisper) > Puter (Fallback)
   */
  audio: [
    { name: "Groq-Whisper",  fn: audioProviders.callGroqWhisper },  // ULTRA-RAPIDE
    { name: "Puter-Whisper", fn: audioProviders.callPuterWhisper }, // FALLBACK
  ],
};

async function runPipeline(taskType, callFn, fallback = null) {
  const pipeline = PIPELINES[taskType];
  let lastError;

  for (const { name, fn } of pipeline) {
    try {
      if (typeof fn !== 'function') continue;
      const result = await callFn(fn);
      console.log(`[Router] ${taskType.toUpperCase()} — ${name} OK`);
      return result;
    } catch (e) {
      lastError = e;
      console.warn(`[Router] ${name} failed: ${e.message}`);
    }
  }

  if (fallback !== null) return fallback;
  throw lastError || new Error(`[Router] Pipeline ${taskType} totalement échoué`);
}

module.exports = {
  runText: (callFn, fallback) => runPipeline("text", callFn, fallback),
  runImage: (callFn, fallback) => runPipeline("image", callFn, fallback),
  runAudio: (callFn, fallback) => runPipeline("audio", callFn, fallback),
  PIPELINES
};
