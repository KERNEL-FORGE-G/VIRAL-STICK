// Service de persistance simplifié avec localStorage-like storage
// Utilise un simple objet en mémoire pour éviter les conflits de dépendances

const DB_PREFIX = 'ViralStick_';

let users = {};
let memes = {};
let stats = {};

/**
 * Initialise la base de données (mémoire)
 */
export const initDatabase = async () => {
  try {
    console.log('Base de données en mémoire initialisée avec succès');
    return true;
  } catch (error) {
    console.error('Erreur initialisation DB:', error);
    throw error;
  }
};

/**
 * Opérations sur les utilisateurs
 */
export const userDB = {
  saveUser: async (user) => {
    try {
      users[user.id] = {
        ...user,
        joined_at: user.joinedAt || Date.now(),
        avatar: user.avatar || 'arch',
      };
      return true;
    } catch (error) {
      console.error('Erreur sauvegarde utilisateur:', error);
      throw error;
    }
  },

  getUserById: async (userId) => {
    try {
      return users[userId] || null;
    } catch (error) {
      console.error('Erreur récupération utilisateur:', error);
      throw error;
    }
  },

  getUserByEmail: async (email) => {
    try {
      return Object.values(users).find(u => u.email === email) || null;
    } catch (error) {
      console.error('Erreur récupération utilisateur par email:', error);
      throw error;
    }
  },

  deleteUser: async (userId) => {
    try {
      delete users[userId];
      return true;
    } catch (error) {
      console.error('Erreur suppression utilisateur:', error);
      throw error;
    }
  },
};

/**
 * Opérations sur les mèmes locaux
 */
export const memeDB = {
  saveMeme: async (meme) => {
    try {
      memes[meme.id] = {
        ...meme,
        created_at: Date.now(),
      };
      return true;
    } catch (error) {
      console.error('Erreur sauvegarde mème:', error);
      throw error;
    }
  },

  getUserMemes: async (userId) => {
    try {
      return Object.values(memes)
        .filter(m => m.user_id === userId)
        .sort((a, b) => b.created_at - a.created_at);
    } catch (error) {
      console.error('Erreur récupération mèmes utilisateur:', error);
      throw error;
    }
  },

  getMemeById: async (memeId) => {
    try {
      return memes[memeId] || null;
    } catch (error) {
      console.error('Erreur récupération mème:', error);
      throw error;
    }
  },

  updateMemePublished: async (memeId, published) => {
    try {
      if (memes[memeId]) {
        memes[memeId].published = published;
      }
      return true;
    } catch (error) {
      console.error('Erreur mise à jour publication:', error);
      throw error;
    }
  },

  deleteMeme: async (memeId) => {
    try {
      delete memes[memeId];
      return true;
    } catch (error) {
      console.error('Erreur suppression mème:', error);
      throw error;
    }
  },
};

/**
 * Opérations sur les statistiques
 */
export const statsDB = {
  incrementMemesCreated: async (userId) => {
    try {
      if (!stats[userId]) {
        stats[userId] = { memes_created: 0, likes_received: 0, remixes_count: 0 };
      }
      stats[userId].memes_created = (stats[userId].memes_created || 0) + 1;
      return true;
    } catch (error) {
      console.error('Erreur incrémentation mèmes créés:', error);
      throw error;
    }
  },

  incrementLikesReceived: async (userId) => {
    try {
      if (!stats[userId]) {
        stats[userId] = { memes_created: 0, likes_received: 0, remixes_count: 0 };
      }
      stats[userId].likes_received = (stats[userId].likes_received || 0) + 1;
      return true;
    } catch (error) {
      console.error('Erreur incrémentation likes:', error);
      throw error;
    }
  },

  incrementRemixes: async (userId) => {
    try {
      if (!stats[userId]) {
        stats[userId] = { memes_created: 0, likes_received: 0, remixes_count: 0 };
      }
      stats[userId].remixes_count = (stats[userId].remixes_count || 0) + 1;
      return true;
    } catch (error) {
      console.error('Erreur incrémentation remixes:', error);
      throw error;
    }
  },

  getUserStats: async (userId) => {
    try {
      return stats[userId] || { memes_created: 0, likes_received: 0, remixes_count: 0 };
    } catch (error) {
      console.error('Erreur récupération statistiques:', error);
      throw error;
    }
  },
};

export const closeDatabase = async () => {
  console.log('Base de données fermée');
};

export const resetDatabase = async () => {
  try {
    users = {};
    memes = {};
    stats = {};
    console.log('Base de données réinitialisée');
    return true;
  } catch (error) {
    console.error('Erreur réinitialisation DB:', error);
    throw error;
  }
};

export default { initDatabase, userDB, memeDB, statsDB, closeDatabase, resetDatabase };
