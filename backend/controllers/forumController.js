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
      console.log(`[Forum] Chargé ${demoMemes.length} memes depuis la persistance locale`);
    }
  } catch (e) {
    console.warn("[Forum] Fallback local non chargé:", e.message);
  }
}

try {
  loadLocalPersistence();
} catch (e) {
  console.warn("[Forum] Erreur loadLocalPersistence:", e.message);
}

async function isDbUsable() {
  try {
    const db = Firebase.db;
    if (!db) {
      console.log("[isDbUsable] DB not initialized");
      return false;
    }
    
    console.log("[isDbUsable] Testing Firestore connection...");
    await Promise.race([
      db.collection("memes").limit(1).get(),
      new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 15000))
    ]);
    console.log("[isDbUsable] Firestore is usable!");
    return true;
  } catch (e) {
    console.warn("[isDbUsable] Firestore not usable:", e.message);
    return false;
  }
}

const ForumController = {
  publishMeme: async (req, res) => {
    try {
      const { shareId, imageUrl, topText, bottomText, userId, username, sourceMemeId } = req.body;
      const id = String(shareId || Date.now());
      
      const newMeme = {
        id, shareId: id,
        imageUrl: imageUrl || "https://placehold.co/600x600?text=Image+Missing",
        topText: topText || "",
        bottomText: bottomText || "",
        likes: 0, remixes: 0, createdAt: Date.now(),
        userId: userId || "anon",
        username: username || "Viral Creator"
      };

      let usable = false;
      try {
        usable = await isDbUsable();
      } catch (e) {
        console.warn("[Forum Publish] isDbUsable failed, using demo:", e.message);
        usable = false;
      }

      if (!usable) {
        try {
          if (!demoMemes.find(m => m.id === id)) {
            demoMemes.unshift(newMeme);
          }
        } catch (e) {
          console.warn("[Forum Publish] Demo add failed:", e.message);
        }
        if (res && res.json) return res.json({ success: true, mode: 'demo' });
        return;
      }

      try {
        const db = Firebase.db;
        await db.collection("memes").doc(id).set(newMeme);

        if (sourceMemeId && sourceMemeId !== "null") {
          try {
            await db.collection("memes").doc(String(sourceMemeId)).update({
              remixes: Firebase.admin.firestore.FieldValue.increment(1)
            });
          } catch (err) {
            console.warn("[Forum Publish] Remix count update failed:", err.message);
          }
        }

        if (res && res.json) res.json({ success: true });
      } catch (dbError) {
        console.warn("[Forum Publish] Firestore failed, falling back to demo:", dbError.message);
        try {
          if (!demoMemes.find(m => m.id === id)) {
            demoMemes.unshift(newMeme);
          }
        } catch (e) {
          console.warn("[Forum Publish] Demo fallback failed:", e.message);
        }
        if (res && res.json) res.json({ success: true, mode: 'demo' });
      }
    } catch (error) {
      console.error("[Forum Publish] Global Error:", error);
      if (res && res.status && res.json) res.json({ success: true, mode: 'demo' });
    }
  },

  getMemes: async (req, res) => {
    try {
      const allowedSortFields = ["createdAt", "likes", "remixes"];
      let { sortBy = "createdAt", userId } = req.query;
      
      if (!allowedSortFields.includes(sortBy)) {
          console.warn(`[Forum Get] Invalid sortBy parameter: ${sortBy}. Defaulting to createdAt.`);
          sortBy = "createdAt";
      }

      let usable = false;
      try {
        usable = await isDbUsable();
      } catch (e) {
        console.warn("[Forum Get] isDbUsable failed, using demo:", e.message);
        usable = false;
      }

      if (!usable) {
        console.log("[Forum Get] Using demo mode");
        let sorted = [];
        try {
          sorted = [...demoMemes];
          if (sortBy === "likes") sorted.sort((a, b) => (b.likes || 0) - (a.likes || 0));
          else if (sortBy === "remixes") sorted.sort((a, b) => (b.remixes || 0) - (a.remixes || 0));
          else sorted.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
        } catch (e) {
          console.warn("[Forum Get] Sorting failed:", e.message);
          sorted = demoMemes;
        }
        
        return res.json(sorted.map(m => {
          try {
            return {
              ...m,
              likedByUser: userId ? demoLikes.has(`${userId}_${m.id}`) : false
            };
          } catch (e) {
            return m;
          }
        }));
      }

      console.log(`[Forum Get] Querying memes with sortBy: ${sortBy}`);
      let snapshot = null;
      try {
        const db = Firebase.db;
        snapshot = await db.collection("memes").orderBy(sortBy, "desc").limit(50).get();
      } catch (dbError) {
        console.warn("[Forum Get] Firestore query failed, falling back to demo:", dbError.message);
        let sorted = [];
        try {
          sorted = [...demoMemes];
          if (sortBy === "likes") sorted.sort((a, b) => (b.likes || 0) - (a.likes || 0));
          else if (sortBy === "remixes") sorted.sort((a, b) => (b.remixes || 0) - (a.remixes || 0));
          else sorted.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
        } catch (e) {
          console.warn("[Forum Get] Demo sorting failed:", e.message);
          sorted = demoMemes;
        }
        
        return res.json(sorted.map(m => {
          try {
            return {
              ...m,
              likedByUser: userId ? demoLikes.has(`${userId}_${m.id}`) : false
            };
          } catch (e) {
            return m;
          }
        }));
      }

      let userLikedIds = new Set();
      if (userId && snapshot.docs.length > 0) {
        try {
          const db = Firebase.db;
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
        } catch (likesError) {
          console.warn("[Forum Get] Likes query failed, continuing without likes:", likesError.message);
        }
      }

      const memes = snapshot.docs.map(doc => {
        try {
          return {
            id: doc.id,
            ...doc.data(),
            likedByUser: userLikedIds.has(doc.id)
          };
        } catch (e) {
          console.warn("[Forum Get] Doc mapping failed:", e.message);
          return {
            id: doc.id,
            likedByUser: false
          };
        }
      }).filter(Boolean);

      res.json(memes);
    } catch (e) {
      console.error("[Forum Get] Global Error:", e);
      // En cas d'erreur, renvoie toujours un tableau vide au lieu de 500
      res.json([]);
    }
  },

  likeMeme: async (req, res) => {
    try {
      const { id } = req.params;
      const { userId } = req.body;
      
      if (!userId) {
        return res.status(401).json({ error: "Connexion requise" });
      }

      let usable = false;
      try {
        usable = await isDbUsable();
      } catch (e) {
        console.warn("[Forum Like] isDbUsable failed, using demo:", e.message);
        usable = false;
      }

      const likeKey = `${userId}_${id}`;

      if (!usable) {
        const meme = demoMemes.find(m => m.id === id);
        if (!meme) {
          return res.status(404).json({ error: "Mème introuvable" });
        }
        
        try {
          if (demoLikes.has(likeKey)) {
            demoLikes.delete(likeKey);
            meme.likes = Math.max(0, (meme.likes || 0) - 1);
            return res.json({ success: true, liked: false });
          } else {
            demoLikes.add(likeKey);
            meme.likes = (meme.likes || 0) + 1;
            return res.json({ success: true, liked: true });
          }
        } catch (e) {
          console.warn("[Forum Like] Demo like failed:", e.message);
          return res.json({ success: true, liked: false });
        }
      }

      try {
        const db = Firebase.db;
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
      } catch (dbError) {
        console.warn("[Forum Like] Firestore failed, falling back to demo:", dbError.message);
        const meme = demoMemes.find(m => m.id === id);
        if (!meme) {
          return res.status(404).json({ error: "Mème introuvable" });
        }
        
        try {
          if (demoLikes.has(likeKey)) {
            demoLikes.delete(likeKey);
            meme.likes = Math.max(0, (meme.likes || 0) - 1);
            return res.json({ success: true, liked: false });
          } else {
            demoLikes.add(likeKey);
            meme.likes = (meme.likes || 0) + 1;
            return res.json({ success: true, liked: true });
          }
        } catch (e) {
          console.warn("[Forum Like] Demo fallback failed:", e.message);
          return res.json({ success: true, liked: false });
        }
      }
    } catch (e) {
      console.error("[Forum Like] Global Error:", e);
      res.status(200).json({ success: true, liked: false });
    }
  },

  getLeaderboard: async (req, res) => {
    try {
      let usable = false;
      try {
        usable = await isDbUsable();
      } catch (e) {
        console.warn("[Forum Leaderboard] isDbUsable failed, using demo:", e.message);
        usable = false;
      }

      let source = [];
      if (usable) {
        try {
          const db = Firebase.db;
          source = (await db.collection("memes").limit(100).get()).docs.map(d => d.data());
        } catch (dbError) {
          console.warn("[Forum Leaderboard] Firestore failed, falling back to demo:", dbError.message);
          source = demoMemes;
        }
      } else {
        source = demoMemes;
      }

      const stats = {};
      try {
        source.forEach(m => {
          const uid = m.userId || "anon";
          if (!stats[uid]) stats[uid] = { userId: uid, username: m.username || "Anonyme", totalLikes: 0, memesPosted: 0 };
          stats[uid].totalLikes += (m.likes || 0);
          stats[uid].memesPosted += 1;
        });
      } catch (e) {
        console.warn("[Forum Leaderboard] Stats calculation failed:", e.message);
      }
      
      res.json(Object.values(stats).sort((a,b) => (b.totalLikes || 0) - (a.totalLikes || 0)).slice(0, 10));
    } catch (e) {
      console.error("[Forum Leaderboard] Global Error:", e);
      res.json([]);
    }
  }
};

module.exports = ForumController;
