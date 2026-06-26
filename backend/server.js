
console.log("=== Starting Viral Stick Server ===");

const express = require("express");
const cors = require("cors");
require("./loadEnv")();

const app = express();
const PORT = process.env.PORT || 3000;

console.log("[Server] NODE_ENV =", process.env.NODE_ENV);
console.log("[Server] PORT =", PORT);

app.use(cors());
app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ extended: true, limit: "20mb" }));

// Routes
app.use("/api/memes",   require("./routes/memeRoutes"));
app.use("/api/sticker", require("./routes/stickerRoutes"));
app.use("/api/share",   require("./routes/shareRoutes"));
app.use("/api/forum",   require("./routes/forumRoutes"));

// Alias conforme à docs/contrat-api.md : POST /api/context-reader
const MemeController = require("./controllers/memeController");
app.post("/api/context-reader", MemeController.createFromText);

app.get("/api/debug/keys-status", (req, res) => {
  res.status(200).json({ updatable: process.env.NODE_ENV === "development" });
});

if (process.env.NODE_ENV === "development") {
  app.post("/api/debug/update-keys", (req, res) => {
    const {
      GEMINI_API_KEY,
      MISTRAL_API_KEY,
      DEEPSEEK_API_KEY,
      OPENROUTER_API_KEY,
      GROQ_API_KEY,
      PUTER_TOKEN,
      PUTER_KEY,
    } = req.body;

    if (GEMINI_API_KEY)    process.env.GEMINI_API_KEY    = GEMINI_API_KEY;
    if (MISTRAL_API_KEY)   process.env.MISTRAL_API_KEY   = MISTRAL_API_KEY;
    if (DEEPSEEK_API_KEY)  process.env.DEEPSEEK_API_KEY  = DEEPSEEK_API_KEY;
    if (OPENROUTER_API_KEY) process.env.OPENROUTER_API_KEY = OPENROUTER_API_KEY;
    if (GROQ_API_KEY)      process.env.GROQ_API_KEY      = GROQ_API_KEY;
    if (PUTER_TOKEN)       process.env.PUTER_TOKEN       = PUTER_TOKEN;
    if (PUTER_KEY)         process.env.PUTER_KEY         = PUTER_KEY;

    res.status(200).json({ message: "Keys updated (development only)" });
  });
}

app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK" });
});

app.get("/debug", (req, res) => {
  const envStatus = {
    GEMINI_API_KEY:    !!process.env.GEMINI_API_KEY,
    MISTRAL_API_KEY:   !!process.env.MISTRAL_API_KEY,
    DEEPSEEK_API_KEY:  !!process.env.DEEPSEEK_API_KEY,
    OPENROUTER_API_KEY:!!process.env.OPENROUTER_API_KEY,
    GROQ_API_KEY:      !!process.env.GROQ_API_KEY,
    PUTER_KEY:         !!(process.env.PUTER_KEY || process.env.PUTER_TOKEN),
    POLLINATIONS:      "gratuit — sans clé",
    NODE_ENV:          process.env.NODE_ENV,
    PORT:              process.env.PORT,
  };
  let depsStatus = {};
  try {
    require.resolve("axios");
    depsStatus.axios = true;
  } catch (e) {
    depsStatus.axios = false;
  }
  try {
    require.resolve("@mistralai/mistralai");
    depsStatus.mistral = true;
  } catch (e) {
    depsStatus.mistral = false;
  }
  res.json({ env: envStatus, deps: depsStatus });
});

app.listen(PORT, () => {
  console.log(`✅ Serveur Viral Stick en écoute sur le port ${PORT}`);
});

module.exports = app;
