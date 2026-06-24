const express = require("express");
const cors = require("cors");
require("./loadEnv")();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ extended: true, limit: "20mb" }));

// Routes
app.use('/api/memes', require('./routes/memeRoutes'));
app.use('/api/context-reader', require('./routes/contextReader'));

if (process.env.NODE_ENV === "development") {
  app.post("/api/debug/update-keys", (req, res) => {
    const {
      GEMINI_API_KEY,
      MISTRAL_API_KEY,
      DEEPSEEK_API_KEY,
      OPENROUTER_API_KEY,
      HF_TOKEN,
      HUGGING_FACE_KEY,
    } = req.body;

    if (GEMINI_API_KEY) process.env.GEMINI_API_KEY = GEMINI_API_KEY;
    if (MISTRAL_API_KEY) process.env.MISTRAL_API_KEY = MISTRAL_API_KEY;
    if (DEEPSEEK_API_KEY) process.env.DEEPSEEK_API_KEY = DEEPSEEK_API_KEY;
    if (OPENROUTER_API_KEY) process.env.OPENROUTER_API_KEY = OPENROUTER_API_KEY;
    if (HF_TOKEN) process.env.HF_TOKEN = HF_TOKEN;
    if (HUGGING_FACE_KEY) process.env.HUGGING_FACE_KEY = HUGGING_FACE_KEY;

    res.status(200).json({ message: "Keys updated (development only)" });
  });
}

app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK" });
});

// Route 404 generique pour les endpoints inconnus
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint introuvable' });
});

// Gestionnaire d'erreurs centralise — garantit du JSON, jamais de page HTML
// (utile pour Multer notamment : Voice-to-Meme et Status Remixer en dependent)
app.use((err, req, res, next) => {
  console.error('[errorHandler]', err.message);

  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(413).json({ error: 'Fichier trop volumineux.' });
  }
  if (err.message && err.message.includes('non supporte')) {
    return res.status(400).json({ error: err.message });
  }
  return res.status(500).json({ error: 'Erreur interne du serveur.' });
});

app.listen(PORT, () => {
  console.log(`Serveur Viral Stick en écoute sur le port ${PORT}`);
});
