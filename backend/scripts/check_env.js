require("../loadEnv")();

console.log("Vérification des variables d'environnement :");
console.log(
  "GEMINI_API_KEY:",
  process.env.GEMINI_API_KEY ? "Chargée" : "NON CHARGÉE",
);
console.log(
  "MISTRAL_API_KEY:",
  process.env.MISTRAL_API_KEY ? "Chargée" : "NON CHARGÉE",
);
console.log(
  "DEEPSEEK_API_KEY:",
  process.env.DEEPSEEK_API_KEY ? "Chargée" : "NON CHARGÉE",
);
console.log(
  "OPENROUTER_API_KEY:",
  process.env.OPENROUTER_API_KEY ? "Chargée" : "NON CHARGÉE",
);
console.log(
  "HUGGING_FACE_KEY:",
  process.env.HUGGING_FACE_KEY || process.env.HF_TOKEN
    ? "Chargée"
    : "NON CHARGÉE",
);
console.log(
  "HUGGING_FACE_TEXT_MODEL:",
  process.env.HUGGING_FACE_TEXT_MODEL || "openai/gpt-oss-120b",
);
console.log(
  "HUGGING_FACE_CHAT_MODEL:",
  process.env.HUGGING_FACE_CHAT_MODEL || "zai-org/GLM-4.5V",
);
console.log(
  "HUGGING_FACE_PROMPT_MODEL:",
  process.env.HUGGING_FACE_PROMPT_MODEL || "openai/gpt-oss-120b",
);
console.log(
  "HUGGING_FACE_REASONING_MODEL:",
  process.env.HUGGING_FACE_REASONING_MODEL || "zai-org/GLM-4.5V",
);
console.log(
  "HUGGING_FACE_MODEL:",
  process.env.HUGGING_FACE_MODEL || "black-forest-labs/FLUX.1-schnell",
);
