const AIService = require('../services-ia/aiService');

const MAX_TEXTE_LENGTH = 500;

async function handleContextReader(req, res) {
  try {
    const { texte } = req.body;

    if (!texte || typeof texte !== 'string' || texte.trim() === '') {
      return res.status(400).json({ error: 'Le champ "texte" est requis.' });
    }
    if (texte.length > MAX_TEXTE_LENGTH) {
      return res.status(400).json({
        error: `Le texte depasse la limite de ${MAX_TEXTE_LENGTH} caracteres.`,
      });
    }

    const raw = await AIService.generateMemeFromText(texte.trim());

    // Adaptation contrat : aiService renvoie topText/bottomText/descriptionImage,
    // le contrat (docs/contrat-api.md) attend memeTexte/imageUrl.
    return res.json({
      memeTexte: [raw.topText, raw.bottomText].filter(Boolean).join(' — '),
      imageUrl: null,
    });
  } catch (err) {
    console.error('[contextReaderController]', err);
    return res.status(500).json({ error: 'Erreur lors de la generation du meme.' });
  }
}

module.exports = { handleContextReader };