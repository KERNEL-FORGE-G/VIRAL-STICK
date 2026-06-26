/**
 * providers/text.js — Viral Stick
 * ─────────────────────────────────────────────────────────────────────────────
 * Tous les providers texte, chacun isolé dans sa propre fonction.
 * Chaque fonction a la même signature :
 *   callXxx(systemPrompt, userPrompt, schema) → Promise<string|object>
 *
 * schema : "text" | "json"
 *   - "text"  → retourne une string normalisée
 *   - "json"  → retourne un objet parsé
 */

const axios = require("axios");

// ─── URLs ─────────────────────────────────────────────────────────────────────

const GEMINI_BASE    = "https://generativelanguage.googleapis.com/v1/models";
const MISTRAL_URL    = "https://api.mistral.ai/v1/chat/completions";
const DEEPSEEK_URL   = "https://api.deepseek.com/chat/completions";
const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";
const PUTER_URL      = "https://api.puter.com/drivers/call";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function normalizeText(value) {
  return String(value || "")
    .replace(/\s+/g, " ")
    .replace(/[""]/g, '"')
    .replace(/['']/g, "'")
    .trim();
}

function parseJSON(text) {
  const raw = String(text || "")
    .replace(/```json|```/gi, "")
    .trim();

  const candidates = [raw];
  const obj = raw.match(/\{[\s\S]*\}/);
  if (obj) candidates.push(obj[0]);
  const arr = raw.match(/\[[\s\S]*\]/);
  if (arr) candidates.push(arr[0]);

  for (const c of candidates) {
    try { return JSON.parse(c); } catch { /* continue */ }
  }

  const repaired = raw
    .replace(/[""]/g, '"')
    .replace(/['']/g, "'")
    .replace(/,\s*([}\]])/g, "$1")
    .trim();

  for (const c of [repaired, repaired.match(/\{[\s\S]*\}/)?.[0]].filter(Boolean)) {
    try { return JSON.parse(c); } catch { /* continue */ }
  }

  throw new Error("Impossible de parser le JSON");
}

function format(text, schema) {
  return schema === "text" ? normalizeText(text) : parseJSON(text);
}

// ─── Gemini 2.5 Flash ─────────────────────────────────────────────────────────
// Primaire pour tout le texte. Excellent en créatif + français. Quota généreux.

async function callGemini(systemPrompt, userPrompt, schema) {
  const key = process.env.GEMINI_API_KEY;
  if (!key) throw new Error("Gemini: GEMINI_API_KEY manquant");

  const model = "gemini-1.5-flash";

  // Pour le JSON, on demande explicitement le mode JSON
  const generationConfig = schema === "json"
    ? { responseMimeType: "application/json" }
    : {};

  const systemInstruction = schema === "json"
    ? `${systemPrompt}\n\nIMPORTANT: réponds avec un JSON strict et valide, sans markdown, sans texte avant ou après.`
    : systemPrompt;

  const res = await axios.post(
    `${GEMINI_BASE}/${model}:generateContent?key=${key}`,
    {
      contents: [{ parts: [{ text: `${systemInstruction}\n\n${userPrompt}` }] }],
      generationConfig,
    },
    { timeout: 30000 }
  );

  const text = res.data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
  return format(text, schema);
}

// ─── Mistral ──────────────────────────────────────────────────────────────────
// Fallback 1. Très bon en français. Gratuit sur le tier free.

async function callMistral(systemPrompt, userPrompt, schema) {
  const key = process.env.MISTRAL_API_KEY;
  if (!key) throw new Error("Mistral: MISTRAL_API_KEY manquant");

  const body = {
    model: "mistral-small-latest",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user",   content: userPrompt },
    ],
    max_tokens:  600,
    temperature: schema === "text" ? 0.85 : 0.35,
  };

  if (schema === "json") {
    body.response_format = { type: "json_object" };
  }

  const res = await axios.post(MISTRAL_URL, body, {
    headers: {
      Authorization:  `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    timeout: 30000,
  });

  const text = res.data?.choices?.[0]?.message?.content || "";
  return format(text, schema);
}

// ─── Puter ────────────────────────────────────────────────────────────────────
// Fallback 2. Accès à plusieurs modèles OpenAI-compat.

const PUTER_TEXT_MODELS = [
  process.env.PUTER_TEXT_MODEL || "openai/gpt-oss-120b",
  "zai-org/GLM-4.5V",
  "moonshotai/Kimi-K2-Instruct-0905",
];

async function callPuter(systemPrompt, userPrompt, schema) {
  const key = process.env.PUTER_KEY || process.env.PUTER_TOKEN;
  if (!key) throw new Error("Puter: PUTER_KEY manquant");

  // Déduplique les modèles configurés
  const models = [...new Set(PUTER_TEXT_MODELS.filter(Boolean))];
  let lastError;

  for (const model of models) {
    for (const jsonMode of schema === "json" ? [true, false] : [false]) {
      try {
        const sysContent = schema === "json" && !jsonMode
          ? `${systemPrompt}\n\nIMPORTANT: réponds avec un JSON strict, sans markdown, sans commentaire.`
          : systemPrompt;

        const res = await axios.post(PUTER_URL, {
          model,
          messages: [
            { role: "system", content: sysContent },
            { role: "user",   content: userPrompt },
          ],
          max_tokens:      600,
          temperature:     schema === "text" ? 0.8 : 0.35,
          response_format: schema === "json" && jsonMode ? { type: "json_object" } : undefined,
        }, {
          headers: {
            Authorization:  `Bearer ${key}`,
            "Content-Type": "application/json",
          },
          timeout: 60000,
        });

        const text = res.data?.choices?.[0]?.message?.content || "";
        return format(text, schema);
      } catch (e) {
        lastError = e;
        const msg  = e?.response?.data?.error?.message || e?.message || "";
        const skip = e?.response?.status === 400 &&
                     String(msg).includes("not supported by any provider");
        const parseErr = !e?.response?.status &&
                         String(msg).includes("Impossible de parser");

        if (parseErr && jsonMode) continue; // retry without json_object
        if (!skip && !parseErr) throw e;
      }
    }
  }

  throw lastError || new Error("Puter: aucun modèle disponible");
}

// ─── DeepSeek ─────────────────────────────────────────────────────────────────
// Fallback 3. Fort en raisonnement structuré.

async function callDeepSeek(systemPrompt, userPrompt, schema) {
  const key = process.env.DEEPSEEK_API_KEY;
  if (!key) throw new Error("DeepSeek: DEEPSEEK_API_KEY manquant");

  const res = await axios.post(DEEPSEEK_URL, {
    model:    "deepseek-chat",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user",   content: userPrompt },
    ],
    max_tokens:  600,
    temperature: 0.9,
  }, {
    headers: {
      Authorization:  `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    timeout: 30000,
  });

  const text = res.data?.choices?.[0]?.message?.content || "";
  return format(text, schema);
}

// ─── OpenRouter ───────────────────────────────────────────────────────────────
// Fallback 4. Filet de sécurité ultime. Accès à des dizaines de modèles.

async function callOpenRouter(systemPrompt, userPrompt, schema) {
  const key   = process.env.OPENROUTER_API_KEY;
  if (!key) throw new Error("OpenRouter: OPENROUTER_API_KEY manquant");

  const model    = process.env.OPENROUTER_MODEL || "openai/gpt-4o-mini";
  const siteUrl  = process.env.OPENROUTER_SITE_URL  || "https://viral-stick.local";
  const siteName = process.env.OPENROUTER_SITE_NAME || "VIRAL STICK";

  const res = await axios.post(OPENROUTER_URL, {
    model,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user",   content: userPrompt },
    ],
    max_tokens:      600,
    temperature:     schema === "text" ? 0.8 : 0.65,
    response_format: schema === "json" ? { type: "json_object" } : undefined,
  }, {
    headers: {
      Authorization:  `Bearer ${key}`,
      "HTTP-Referer": siteUrl,
      "X-Title":      siteName,
      "Content-Type": "application/json",
    },
    timeout: 30000,
  });

  const text = res.data?.choices?.[0]?.message?.content || "";
  return format(text, schema);
}

module.exports = { callGemini, callMistral, callPuter, callDeepSeek, callOpenRouter, normalizeText, parseJSON };
