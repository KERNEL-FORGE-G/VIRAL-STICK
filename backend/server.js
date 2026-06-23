const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/memes", require("./routes/memeRoutes"));

app.post("/api/debug/update-keys", (req, res) => {
  const { GEMINI_API_KEY, MISTRAL_API_KEY, DEEPSEEK_API_KEY } = req.body;
  if (GEMINI_API_KEY) process.env.GEMINI_API_KEY = GEMINI_API_KEY;
  if (MISTRAL_API_KEY) process.env.MISTRAL_API_KEY = MISTRAL_API_KEY;
  if (DEEPSEEK_API_KEY) process.env.DEEPSEEK_API_KEY = DEEPSEEK_API_KEY;
  res.status(200).json({ message: "Keys updated" });
});

app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK" });
});

app.get("/debug", (req, res) => {
  const envStatus = {
    GEMINI_API_KEY: !!process.env.GEMINI_API_KEY,
    MISTRAL_API_KEY: !!process.env.MISTRAL_API_KEY,
    DEEPSEEK_API_KEY: !!process.env.DEEPSEEK_API_KEY,
    NODE_ENV: process.env.NODE_ENV,
    PORT: process.env.PORT,
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

if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log(`Serveur Viral Stick en écoute sur le port ${PORT}`);
  });
}

module.exports = app;
