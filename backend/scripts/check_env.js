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
  "PUTER_KEY:",
  process.env.PUTER_KEY || process.env.PUTER_TOKEN
    ? "Chargée"
    : "NON CHARGÉE",
);
console.log(
  "PUTER_TEXT_MODEL:",
  process.env.PUTER_TEXT_MODEL || "openai/gpt-oss-120b",
);
console.log(
  "PUTER_CHAT_MODEL:",
  process.env.PUTER_CHAT_MODEL || "zai-org/GLM-4.5V",
);
console.log(
  "PUTER_PROMPT_MODEL:",
  process.env.PUTER_PROMPT_MODEL || "openai/gpt-oss-120b",
);
console.log(
  "PUTER_REASONING_MODEL:",
  process.env.PUTER_REASONING_MODEL || "zai-org/GLM-4.5V",
);
console.log(
  "PUTER_MODEL:",
  process.env.PUTER_MODEL || "black-forest-labs/FLUX.1-schnell",
);
