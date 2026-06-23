const axios = require("axios");
const { COMPANION_PERSONAS, MODULE_PROMPTS } = require("./prompts");

const GEMINI_KEY = process.env.GEMINI_API_KEY;
const MISTRAL_KEY = process.env.MISTRAL_API_KEY;
const DEEPSEEK_KEY = process.env.DEEPSEEK_API_KEY;

const MISTRAL_URL = "https://api.mistral.ai/v1/chat/completions";
const DEEPSEEK_URL = "https://api.deepseek.com/chat/completions";
const GEMINI_URL = (model) =>
  `https://generativelanguage.googleapis.com/v1/models/${model}:generateContent?key=${GEMINI_KEY}`;

const SYSTEM_PROMPT_MEME =
  "Tu génères des mèmes humoristiques en français. Réponds UNIQUEMENT avec du JSON valide, sans markdown.";

async function callDeepSeek(systemPrompt, userPrompt, schema) {
  if (!DEEPSEEK_KEY) throw new Error("DeepSeek: no key");
  const res = await axios.post(
    DEEPSEEK_URL,
    {
      model: "deepseek-chat",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      max_tokens: 500,
      temperature: 0.8,
    },
    {
      headers: {
        Authorization: `Bearer ${DEEPSEEK_KEY}`,
        "Content-Type": "application/json",
      },
    },
  );
  return parseJSON(res.data.choices[0].message.content);
}

async function callMistral(systemPrompt, userPrompt, schema) {
  if (!MISTRAL_KEY) throw new Error("Mistral: no key");
  const res = await axios.post(
    MISTRAL_URL,
    {
      model: "mistral-small-latest",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      max_tokens: 500,
      temperature: 0.8,
    },
    {
      headers: {
        Authorization: `Bearer ${MISTRAL_KEY}`,
        "Content-Type": "application/json",
      },
    },
  );
  const text = res.data.choices[0].message.content;
  if (schema === "text") return text;
  return parseJSON(text);
}

async function callGemini(systemPrompt, userPrompt, schema) {
  if (!GEMINI_KEY) throw new Error("Gemini: no key");
  const model = schema === "text" ? "gemini-2.0-flash" : "gemini-2.5-flash";
  const res = await axios.post(GEMINI_URL(model), {
    contents: [{ parts: [{ text: `${systemPrompt}\n\n${userPrompt}` }] }],
  });
  const text = res.data.candidates[0].content.parts[0].text;
  if (schema === "text") return text;
  return parseJSON(text);
}

function parseJSON(text) {
  let cleaned = text.replace(/```json|```/gi, "").trim();
  try {
    return JSON.parse(cleaned);
  } catch (e) {
    const match = cleaned.match(/\{[\s\S]*\}/);
    if (match) return JSON.parse(match[0]);
    throw new Error("Impossible de parser le JSON");
  }
}

function getLocationContext(location) {
  const contexts = {
    france:
      "ADAPTE L'HUMOUR FRANÇAIS: Utilise des références culturelles françaises (métro parisien, administrations, grèves, fromages, vin, baguette, expressions françaises comme 'c'est la galère', 'c'est dingue', 'putain'). Le ton doit être sarcastique et auto-dérisoire typiquement français.",
    cameroun:
      "ADAPTE L'HUMOUR CAMEROUNAIS: Utilise des références culturelles camerounaises (ndolé, bobolo, mbolo, pirogue, football, Samuel Eto'o, expressions camerounaises comme 'ça na go', 'mbombo', 'tchop', 'na moki'). Le ton doit être chaleureux et communautaire.",
    senegal:
      "ADAPTE L'HUMOUR SÉNÉGALAIS: Utilise des références culturelles sénégalaises (thieboudienne, yassa, taxi brousse, football Sadio Mané, expressions sénégalaises comme 'damaay', 'sakh', 'toubab'). Le ton doit être spirituel et convivial.",
    coteivoire:
      "ADAPTE L'HUMOUR IVOIRIEN: Utilise des références culturelles ivoiriennes (attiéké, garba, zagba, Didier Drogba, expressions ivoiriennes comme 'chaud', 'ça va aller', 'n'gbo'). Le ton doit être optimiste et festif.",
    mali: "ADAPTE L'HUMOUR MALIEN: Utilise des références culturelles maliennes (tô, jollof, griots, désert, expressions maliennes comme 'i ni ce', 'c'est bon', 'bara'). Le ton doit être respectueux et traditionnel.",
    benin:
      "ADAPTE L'HUMOUR BÉNINOIS: Utilise des références culturelles béninoises (akassa, gari, zomi, vaudou, expressions béninoises comme 'c'est pas grave', 'on gère', 'ça va koi'). Le ton doit être détendu et philosophique.",
    congo:
      "ADAPTE L'HUMOUR CONGOLAIS: Utilise des références culturelles congolaises (saka saka, liboke, rumba, expressions congolaises comme 'mbote', 'lingala', 'soki'). Le ton doit être musical et dansant.",
    rdc: "ADAPTE L'HUMOUR CONGOLAIS (RDC): Utilise des références culturelles congolaises RDC (fufu, pondu, musique congolaise, expressions RDC comme 'mboka', 'sango', 'bana'). Le ton doit être vibrant et festif.",
    maroc:
      "ADAPTE L'HUMOUR MAROCAIN: Utilise des références culturelles marocaines (couscous, tagine, thé à la menthe, expressions marocaines comme 'wa l3ah', 'khouya', 'zwin'). Le ton doit être chaleureux et hospitalier.",
    algerie:
      "ADAPTE L'HUMOUR ALGÉRIEN: Utilise des références culturelles algériennes (couscous, chorba, expressions algériennes comme 'saha', 'wahed', 'hada'). Le ton doit être direct et franc.",
    tunisie:
      "ADAPTE L'HUMOUR TUNISIEN: Utilise des références culturelles tunisiennes (couscous, brik, expressions tunisiennes comme 'aywa', 'bslama', 'yess'). Le ton doit être enjoué et méditerranéen.",
    belgique:
      "ADAPTE L'HUMOUR BELGE: Utilise des références culturelles belges (frites, bière, chocolat, expressions belges comme 'une fois', 'non mais', 'tchiot'). Le ton doit être modéré et autodérision.",
    suisse:
      "ADAPTE L'HUMOUR SUISSE: Utilise des références culturelles suisses (chocolat, fromage, montagne, expressions suisses comme 'hopp', 'tschäss', 'merci vielmals'). Le ton doit être précis et calme.",
    canada:
      "ADAPTE L'HUMOUR QUÉBÉCOIS: Utilise des références culturelles québécoises (poutine, sirop d'érable, hockey, expressions québécoises comme 'tabarnak', 'osti', 'calice', 'environ'). Le ton doit être coloré et passionné.",
    international:
      "HUMOUR INTERNATIONAL: Utilise des références culturelles universelles et compréhensibles par tous. Évite les expressions trop locales. Le ton doit être accessible et globalement drôle.",
  };

  return contexts[location] || contexts.international;
}

async function withFallback(fn, fallbackData) {
  const providers = [
    { name: "Gemini", call: () => fn(callGemini) },
    { name: "Mistral", call: () => fn(callMistral) },
    { name: "DeepSeek", call: () => fn(callDeepSeek) },
  ];
  for (const p of providers) {
    try {
      const result = await p.call();
      console.log(`[AI] ${p.name} OK`);
      return result;
    } catch (e) {
      console.warn(`[AI] ${p.name} failed: ${e.message}`);
    }
  }
  console.warn("[AI] All providers failed, using fallback");
  return fallbackData;
}

const AIService = {
  generateMemeFromText: async (text, location = "international") => {
    const locationContext = getLocationContext(location);
    const enhancedPrompt = `${MODULE_PROMPTS.contextReader}\n\n${locationContext}`;
    return withFallback(
      async (call) =>
        call(enhancedPrompt, `CONTEXTE UTILISATEUR (${location}): "${text}"`),
      {
        topText: "QUAND L'IA BUGUE...",
        bottomText: "...MAIS QUE TU GARDES LE SOURIRE",
        descriptionImage: "Un robot confus avec un panneau Error 500",
      },
    );
  },

  generateMemeFromVoice: async (transcription) => {
    return withFallback(
      async (call) =>
        call(
          MODULE_PROMPTS.voiceToMeme,
          `TRANSCRIPTION VOCALE: "${transcription}"`,
        ),
      {
        topText: "QUAND LA VOIX NE PASSE PAS...",
        bottomText: "...MAIS QUE LE MESSAGE EST CLAIR",
        descriptionImage: "Un micro qui fume avec des ondes sonores",
        original_transcript_subtitle: transcription,
      },
    );
  },

  chatWithCompanion: async (companionId, message) => {
    const personaData =
      COMPANION_PERSONAS[companionId] || COMPANION_PERSONAS.arch;
    const systemPrompt = `Tu es ${personaData.persona}
Ton ton est : ${personaData.tone}
Instructions : ${personaData.instructions.join(" ")}
Réponds en 2-3 phrases maximum, reste dans ton personnage.`;

    const result = await withFallback(
      async (call) => call(systemPrompt, `Message: "${message}"`, "text"),
      "Désolé, j'ai une petite perte de connexion avec mon noyau central. Peux-tu répéter ?",
    );
    return result;
  },

  generateImage: async (prompt) => {
    if (GEMINI_KEY) {
      try {
        const res = await axios.post(
          `https://generativelanguage.googleapis.com/v1/models/imagen-4.0-generate-001:predict?key=${GEMINI_KEY}`,
          { prompt },
          { headers: { "Content-Type": "application/json" } },
        );
        return {
          imageUrl: res.data?.predictions?.[0]?.bytesBase64Encoded
            ? `data:image/png;base64,${res.data.predictions[0].bytesBase64Encoded}`
            : null,
          description: prompt,
        };
      } catch (e) {
        console.warn("[AI] Imagen failed, returning description:", e.message);
      }
    }
    return {
      imageUrl: null,
      description: `Image générée : ${prompt}`,
      fallback: true,
    };
  },
};

module.exports = AIService;
