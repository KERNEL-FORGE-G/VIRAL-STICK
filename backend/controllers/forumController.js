const { db } = require("../firebase");

const ForumController = {
  /**
   * Liste les mèmes publics depuis Firestore
   */
  getMemes: async (req, res) => {
    try {
      if (!db) {
        console.error("[Forum] Firestore non initialisé (vérifiez FIREBASE_SERVICE_ACCOUNT)");
        return res.status(200).json([]); // On renvoie une liste vide au lieu d'une erreur 500
      }

      const snapshot = await db.collection("memes")
        .orderBy("createdAt", "desc")
        .limit(50)
        .get();

      const memes = [];
      snapshot.forEach(doc => {
        memes.push({ id: doc.id, ...doc.data() });
      });

      res.json(memes);
    } catch (e) {
      console.error("[forumController.getMemes] Erreur détaillée:", e.message);
      // Si l'erreur est liée à un index manquant, Firestore donne un lien dans le message d'erreur
      res.status(500).json({ error: e.message });
    }
  },

  /**
   * Like un mème dans Firestore
   */
  likeMeme: async (req, res) => {
    try {
      const { id } = req.params;
      if (!db) return res.status(500).json({ error: "DB error" });

      const memeRef = db.collection("memes").doc(id);
      const doc = await memeRef.get();

      if (!doc.exists) {
        return res.status(404).json({ error: "Mème introuvable" });
      }

      const admin = require("firebase-admin");
      await memeRef.update({
        likes: admin.firestore.FieldValue.increment(1)
      });

      res.json({ id, success: true });
    } catch (e) {
      console.error("[forumController.likeMeme]", e.message);
      res.status(500).json({ error: e.message });
    }
  }
};

module.exports = ForumController;
