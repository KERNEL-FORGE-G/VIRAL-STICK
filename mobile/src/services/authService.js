import AsyncStorage from '@react-native-async-storage/async-storage';

const USER_SESSION_KEY = '@viral_stick_user_session';
const USER_ID_KEY = '@viral_stick_user_id';
const USER_EMAIL_KEY = '@viral_stick_user_email';

const authService = {
  /**
   * Sauvegarde la session utilisateur
   */
  saveSession: async (userId, email) => {
    try {
      const session = {
        userId,
        email,
        isLoggedIn: true,
        timestamp: Date.now(),
      };
      await AsyncStorage.setItem(USER_SESSION_KEY, JSON.stringify(session));
      await AsyncStorage.setItem(USER_ID_KEY, userId);
      await AsyncStorage.setItem(USER_EMAIL_KEY, email);
      console.log('[AuthService] Session sauvegardée:', session);
      return true;
    } catch (error) {
      console.error('[AuthService] Erreur sauvegarde session:', error);
      return false;
    }
  },

  /**
   * Récupère la session utilisateur
   */
  getSession: async () => {
    try {
      const sessionJson = await AsyncStorage.getItem(USER_SESSION_KEY);
      if (sessionJson) {
        const session = JSON.parse(sessionJson);
        console.log('[AuthService] Session restaurée:', session);
        return session;
      }
      return null;
    } catch (error) {
      console.error('[AuthService] Erreur récupération session:', error);
      return null;
    }
  },

  /**
   * Récupère l'ID utilisateur
   */
  getUserId: async () => {
    try {
      return await AsyncStorage.getItem(USER_ID_KEY);
    } catch (error) {
      console.error('[AuthService] Erreur récupération userId:', error);
      return null;
    }
  },

  /**
   * Récupère l'email utilisateur
   */
  getUserEmail: async () => {
    try {
      return await AsyncStorage.getItem(USER_EMAIL_KEY);
    } catch (error) {
      console.error('[AuthService] Erreur récupération email:', error);
      return null;
    }
  },

  /**
   * Vérifie si l'utilisateur est connecté
   */
  isLoggedIn: async () => {
    try {
      const session = await authService.getSession();
      return session !== null && session.isLoggedIn;
    } catch (error) {
      console.error('[AuthService] Erreur vérification connexion:', error);
      return false;
    }
  },

  /**
   * Déconnecte l'utilisateur
   */
  logout: async () => {
    try {
      await AsyncStorage.removeItem(USER_SESSION_KEY);
      await AsyncStorage.removeItem(USER_ID_KEY);
      await AsyncStorage.removeItem(USER_EMAIL_KEY);
      console.log('[AuthService] Session supprimée');
      return true;
    } catch (error) {
      console.error('[AuthService] Erreur déconnexion:', error);
      return false;
    }
  },

  /**
   * Nettoie toutes les données (pour tests)
   */
  clearAll: async () => {
    try {
      await AsyncStorage.clear();
      console.log('[AuthService] Toutes les données supprimées');
      return true;
    } catch (error) {
      console.error('[AuthService] Erreur nettoyage:', error);
      return false;
    }
  },
};

export default authService;
