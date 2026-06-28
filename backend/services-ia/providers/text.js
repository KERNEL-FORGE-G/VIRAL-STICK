/**
 * providers/text.js — Viral Stick
 * ─────────────────────────────────────────────────────────────────────────────
 * Gestion des IA textuelles avec chaînage de modèles pour la robustesse.
 */

const axios = require("axios");

const GEMINI_BASE    = "https://generativelanguage.googleapis.com/v1/models";
const MISTRAL_URL    = "https://api.mistral.ai/v1/chat/completions";
const DEEPSEEK_URL   = "https://api.deepseek.com/chat/completions";
const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";
const PUTER_URL      = "https://api.puter.com/drivers/call";
const XAI_CHAT_URL   = "https://api.x.ai/v1/chat/completions";
const XAI_RESP_URL   = "https://api.x.ai/v1/responses"; // Nouvel endpoint X.AI

const GEMINI_MODELS = [
  "gemini-2.0-flash",
  "gemini-1.5-flash",
  "gemini-1.5-pro",
  "gemini-pro"
];

function normalizeText(value) {
  return String(value || "")
    .replace(/\s+/g, " ")
    .replace(/[""]/g, '"')
    .replace(/['']/g, "'")
    .trim();
}

function parseJSON(text) {
  const raw = String(text || "").replace(/```json|```/gi, "").trim();
  const obj = raw.match(/\{[\s\S]*\}/);
  try { return JSON.parse(obj ? obj[0] : raw); } catch { throw new Error("JSON Parse Error"); }
}

function format(text, schema) {
  return schema === "json" ? parseJSON(text) : normalizeText(text);
}

// ─── Grok (x.ai) ──────────────────────────────────────────────────────────────
/**
 * callGrok — Utilise le nouveau modèle grok-4.3 et le nouvel endpoint
 */
async function callGrok(systemPrompt, userPrompt, schema) {
  // Sécurisé : Utilisation exclusive de la variable d'environnement
  const key = process.env.XAI_API_KEY;

  if (!key) {
    throw new Error("Grok: XAI_API_KEY non configurée");
  }

  try {
    console.log("[Text] Tentative Grok (x.ai)...");

    const res = await axios.post(XAI_RESP_URL, {
      model: "grok-4.3",
      input: [
        { role: "system", content: systemPrompt },
        { role: "user",   content: userPrompt },
      ],
    }, {
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json"
      },
      timeout: 20000
    });

    const text = res.data?.message?.content || res.data?.choices?.[0]?.message?.content || res.data?.output;
    return format(text, schema);
  } catch (e) {
    console.warn("[Text] Grok failed, fallback standard OpenAI compatible...");
    try {
      const res = await axios.post(XAI_CHAT_URL, {
        model: "grok-beta",
        messages: [{ role: "system", content: systemPrompt }, { role: "user", content: userPrompt }],
        response_format: schema === "json" ? { type: "json_object" } : undefined,
      }, {
        headers: { Authorization: `Bearer ${key}` },
        timeout: 20000
      });
      return format(res.data?.choices?.[0]?.message?.content, schema);
    } catch (err) {
       console.error("[Text] Grok fallback failed:", err.message);
       throw err;
    }
  }
}

// ─── Gemini (Multi-modèles) ───────────────────────────────────────────────────
async function callGemini(systemPrompt, userPrompt, schema) {
  const key = process.env.GEMINI_API_KEY;
  if (!key) throw new Error("Gemini: Clé manquante");

  let lastError;
  for (const model of GEMINI_MODELS) {
    try {
      const generationConfig = schema === "json" ? { responseMimeType: "application/json" } : {};
      const res = await axios.post(
        `${GEMINI_BASE}/${model}:generateContent?key=${key}`,
        {
          contents: [{ parts: [{ text: `${systemPrompt}\n\n${userPrompt}` }] }],
          generationConfig,
        },
        { timeout: 15000 }
      );
      const text = res.data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (text) {
        console.log(`[Text] Gemini ${model} OK`);
        return format(text, schema);
      }
    } catch (e) {
      lastError = e;
      console.warn(`[Text] Gemini ${model} failed, trying next...`);
    }
  }
  throw lastError || new Error("Gemini failed all models");
}

// ─── Puter (Text) ─────────────────────────────────────────────────────────────
async function callPuter(systemPrompt, userPrompt, schema) {
  const token = process.env.PUTER_TOKEN;
  if (!token) throw new Error("Puter: No token");

  const res = await axios.post(PUTER_URL, {
    driver: "lib-ai",
    method: "chat",
    params: {
      model: process.env.PUTER_TEXT_MODEL || "openai/gpt-4o-mini",
      messages: [{ role: "system", content: systemPrompt }, { role: "user", content: userPrompt }],
    }
  }, { headers: { Authorization: `Bearer ${token}` }, timeout: 25000 });

  return format(res.data?.message?.content, schema);
}

// ─── Mistral / DeepSeek / OpenRouter ──────────────────────────────────────────
async function callMistral(systemPrompt, userPrompt, schema) {
  const key = process.env.MISTRAL_API_KEY;
  if (!key) throw new Error("Mistral: No key");
  const res = await axios.post(MISTRAL_URL, {
    model: "mistral-small-latest",
    messages: [{ role: "system", content: systemPrompt }, { role: "user", content: userPrompt }],
  }, { headers: { Authorization: `Bearer ${key}` }, timeout: 20000 });
  return format(res.data?.choices?.[0]?.message?.content, schema);
}

async function callDeepSeek(systemPrompt, userPrompt, schema) {
  const key = process.env.DEEPSEEK_API_KEY;
  if (!key) throw new Error("DeepSeek: No key");
  const res = await axios.post(DEEPSEEK_URL, {
    model: "deepseek-chat",
    messages: [{ role: "system", content: systemPrompt }, { role: "user", content: userPrompt }],
  }, { headers: { Authorization: `Bearer ${key}` }, timeout: 25000 });
  return format(res.data?.choices?.[0]?.message?.content, schema);
}

async function callOpenRouter(systemPrompt, userPrompt, schema) {
  const key = process.env.OPENROUTER_API_KEY;
  if (!key) throw new Error("OpenRouter: Key missing");

  const res = await axios.post(OPENROUTER_URL, {
    model: process.env.OPENROUTER_MODEL || "openai/gpt-4o-mini",
    messages: [{ role: "system", content: systemPrompt }, { role: "user", content: userPrompt }]
  }, {
    headers: { Authorization: `Bearer ${key}` },
    timeout: 30000
  });
  return format(res.data?.choices?.[0]?.message?.content, schema);
}

module.exports = {
  callGrok,
  callGemini,
  callPuter,
  callMistral,
  callDeepSeek,
  callOpenRouter,
  normalizeText,
  parseJSON
};
