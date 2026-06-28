const Firebase = require("../firebase");
const fs = require("fs");
const path = require("path");
const os = require("os");

const PERSISTENCE_FILE = path.join(os.tmpdir(), "forum_persistence.json");

let demoMemes = [];
let demoLikes = new Set();

function loadLocalPersistence() {
  try {
    if (fs.existsSync(PERSISTENCE_FILE)) {
      const data = fs.readFileSync(PERSISTENCE_FILE, "utf8");
      demoMemes = JSON.parse(data);
    }
  } catch (e) {
    console.warn("[Forum] Fallback local non chargé.");
  }
}
loadLocalPersistence();

async function isDbUsable() {
  const db = Firebase.db;
  if (!db) return false;
  try {
    await Promise.race([
      db.collection("memes").limit(1).get(),
      new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 2500))
    ]);
    return true;
  } catch (e) {
    return false;
  }
}

const ForumController = {
  publishMeme: async (req, res) => {
    try {
      const { shareId, imageUrl, topText, bottomText, userId, username, sourceMemeId } = req.body;
      const id = String(shareId || Date.now());
      const db = Firebase.db;
      const usable = await isDbUsable();

      const newMeme = {
        id, shareId: id,
        imageUrl: imageUrl || "https://placehold.co/600x600?text=Image+Missing",
        topText: topText || "",
        bottomText: bottomText || "",
        likes: 0, remixes: 0, createdAt: Date.now(),
        userId: userId || "anon",
        username: username || "Viral Creator"
      };

      if (!usable) {
        if (!demoMemes.find(m => m.id === id)) {
          demoMemes.unshift(newMeme);
        }
        if (res && res.json) return res.json({ success: true, mode: 'demo' });
        return;
      }

      await db.collection("memes").doc(id).set(newMeme);

      if (sourceMemeId && sourceMemeId !== "null") {
        try {
          await db.collection("memes").doc(String(sourceMemeId)).update({
            remixes: Firebase.admin.firestore.FieldValue.increment(1)
          });
        } catch (err) {}
      }

      if (res && res.json) res.json({ success: true });
    } catch (error) {
      console.error("[Forum Publish] Error:", error.message);
      if (res && res.status) res.status(500).json({ error: "Erreur publication" });
    }
  },

  getMemes: async (req, res) => {
    try {
      const allowedSortFields = ["createdAt", "likes", "remixes"];
      let { sortBy = "createdAt", userId, page = 1, limit = 20 } = req.query;
      page = Math.max(1, parseInt(page) || 1);
      limit = Math.max(1, Math.min(100, parseInt(limit) || 20));
      
      if (!allowedSortFields.includes(sortBy)) {
          console.warn(`[Forum Get] Invalid sortBy parameter: ${sortBy}. Defaulting to createdAt.`);
          sortBy = "createdAt";
      }

      const db = Firebase.db;
      const usable = await isDbUsable();

      if (!usable) {
        let sorted = [...demoMemes];
        if (sortBy === "likes") sorted.sort((a, b) => (b.likes || 0) - (a.likes || 0));
        else if (sortBy === "remixes") sorted.sort((a, b) => (b.remixes || 0) - (a.remixes || 0));
        else sorted.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));

        return res.json(sorted.map(m => ({
          ...m,
          likedByUser: demoLikes.has(`${userId}_${m.id}`)
        })));
      }

      console.log(`[Forum Get] Querying memes with sortBy: ${sortBy}`);
      const snapshot = await db.collection("memes").orderBy(sortBy, "desc").limit(50).get();

      let userLikedIds = new Set();
      if (userId && snapshot.docs.length > 0) {
        const memeIds = snapshot.docs.map(d => d.id);
        const chunkSize = 30;
        for (let i = 0; i < memeIds.length; i += chunkSize) {
          const chunk = memeIds.slice(i, i + chunkSize);
          const likesSnapshot = await db.collection("likes")
            .where("userId", "==", userId)
            .where("memeId", "in", chunk)
            .get();
          likesSnapshot.forEach(ldoc => userLikedIds.add(ldoc.data().memeId));
        }
      }

      const memes = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        likedByUser: userLikedIds.has(doc.id)
      }));

      res.json(memes);
    } catch (e) {
      console.error("[Forum Get] Error full object:", e);
      res.status(500).json({ error: "Erreur serveur forum", details: e.message });
    }
  },

  likeMeme: async (req, res) => {
    try {
      const { id } = req.params;
      const { userId } = req.body;
      if (!userId) return res.status(401).json({ error: "Connexion requise" });

      const db = Firebase.db;
      const usable = await isDbUsable();
      const likeKey = `${userId}_${id}`;

      if (!usable) {
        const meme = demoMemes.find(m => m.id === id);
        if (!meme) return res.status(404).json({ error: "Mème introuvable" });
        if (demoLikes.has(likeKey)) {
          demoLikes.delete(likeKey);
          meme.likes = Math.max(0, (meme.likes || 0) - 1);
          return res.json({ success: true, liked: false });
        } else {
          demoLikes.add(likeKey);
          meme.likes = (meme.likes || 0) + 1;
          return res.json({ success: true, liked: true });
        }
      }

      const likeRef = db.collection("likes").doc(likeKey);
      const memeRef = db.collection("memes").doc(id);

      const result = await db.runTransaction(async (t) => {
        const likeDoc = await t.get(likeRef);
        if (likeDoc.exists) {
          t.delete(likeRef);
          t.update(memeRef, { likes: Firebase.admin.firestore.FieldValue.increment(-1) });
          return { liked: false };
        } else {
          t.set(likeRef, { userId, memeId: id, createdAt: Date.now() });
          t.update(memeRef, { likes: Firebase.admin.firestore.FieldValue.increment(1) });
          return { liked: true };
        }
      });

      res.json({ success: true, liked: result.liked });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  },

  getLeaderboard: async (req, res) => {
    try {
      const db = Firebase.db;
      const usable = await isDbUsable();
      let source = usable ? (await db.collection("memes").limit(100).get()).docs.map(d => d.data()) : demoMemes;

      const stats = {};
      source.forEach(m => {
        const uid = m.userId || "anon";
        if (!stats[uid]) stats[uid] = { userId: uid, username: m.username || "Anonyme", totalLikes: 0, memesPosted: 0 };
        stats[uid].totalLikes += (m.likes || 0);
        stats[uid].memesPosted += 1;
      });
      res.json(Object.values(stats).sort((a,b) => b.totalLikes - a.totalLikes).slice(0, 10));
    } catch (e) {
      res.json([]);
    }
  }
};

module.exports = ForumController;
