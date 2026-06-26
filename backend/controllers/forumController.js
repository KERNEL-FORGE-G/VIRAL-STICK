const { db } = require("../firebase");

const ForumController = {
  getMemes: async (req, res) => {
    try {
      if (!db) return res.json([]);
      const { sortBy = "createdAt" } = req.query; // createdAt, likes, remixes

      const snapshot = await db.collection("memes")
        .orderBy(sortBy, "desc")
        .limit(50)
        .get();

      const memes = [];
      snapshot.forEach(doc => { memes.push({ id: doc.id, ...doc.data() }); });
      res.json(memes);
    } catch (e) {
      console.error("[forumController.getMemes]", e.message);
      res.status(500).json({ error: e.message });
    }
  },

  likeMeme: async (req, res) => {
    try {
      const { id } = req.params;
      const admin = require("firebase-admin");
      await db.collection("memes").doc(id).update({
        likes: admin.firestore.FieldValue.increment(1)
      });
      res.json({ success: true });
    } catch (e) { res.status(500).json({ error: e.message }); }
  }
};

module.exports = ForumController;
