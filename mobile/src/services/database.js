import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Viral Stick — Service de Persistance Locale
 * Utilise AsyncStorage pour la persistance entre les sessions.
 * Remplace l'ancien système en mémoire et évite SQLite pour plus de stabilité.
 */

const DB_KEYS = {
  USERS: 'ViralStick_users',
  MEMES: 'ViralStick_memes',
  STATS: 'ViralStick_stats',
};

// Helper générique pour lire des données
const getData = async (key) => {
  try {
    const data = await AsyncStorage.getItem(key);
    return data ? JSON.parse(data) : {};
  } catch (e) {
    console.error(`[DB] Erreur lecture ${key}:`, e);
    return {};
  }
};

// Helper générique pour écrire des données
const setData = async (key, value) => {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (e) {
    console.error(`[DB] Erreur écriture ${key}:`, e);
    return false;
  }
};

export const initDatabase = async () => {
  console.log('✅ Base de données locale (AsyncStorage) prête.');
  return true;
};

export const userDB = {
  saveUser: async (user) => {
    const users = await getData(DB_KEYS.USERS);
    users[user.id] = {
      ...user,
      joined_at: user.joinedAt || Date.now(),
      avatar: user.avatar || 'arch',
    };
    return await setData(DB_KEYS.USERS, users);
  },

  getUserById: async (userId) => {
    const users = await getData(DB_KEYS.USERS);
    return users[userId] || null;
  },
};

export const memeDB = {
  saveMeme: async (meme) => {
    const memes = await getData(DB_KEYS.MEMES);
    const id = meme.id || `meme_${Date.now()}`;
    memes[id] = {
      ...meme,
      id,
      created_at: Date.now(),
    };
    return await setData(DB_KEYS.MEMES, memes);
  },

  getUserMemes: async (userId) => {
    const memes = await getData(DB_KEYS.MEMES);
    return Object.values(memes)
      .filter(m => m.userId === userId || m.user_id === userId)
      .sort((a, b) => (b.created_at || 0) - (a.created_at || 0));
  },

  updateMemePublished: async (memeId, published) => {
    const memes = await getData(DB_KEYS.MEMES);
    if (memes[memeId]) {
      memes[memeId].published = published;
      return await setData(DB_KEYS.MEMES, memes);
    }
    return false;
  },

  deleteMeme: async (memeId) => {
    const memes = await getData(DB_KEYS.MEMES);
    delete memes[memeId];
    return await setData(DB_KEYS.MEMES, memes);
  },
};

export const statsDB = {
  getUserStats: async (userId) => {
    const stats = await getData(DB_KEYS.STATS);
    return stats[userId] || { memes_created: 0, likes_received: 0, remixes_count: 0 };
  },

  incrementMemesCreated: async (userId) => {
    const stats = await getData(DB_KEYS.STATS);
    if (!stats[userId]) {
      stats[userId] = { memes_created: 0, likes_received: 0, remixes_count: 0 };
    }
    stats[userId].memes_created++;
    return await setData(DB_KEYS.STATS, stats);
  },
};

export const resetDatabase = async () => {
  try {
    await AsyncStorage.clear();
    console.log('[DB] Base de données réinitialisée.');
    return true;
  } catch (error) {
    console.error('[DB] Erreur reset:', error);
    return false;
  }
};

export default { initDatabase, userDB, memeDB, statsDB, resetDatabase };
