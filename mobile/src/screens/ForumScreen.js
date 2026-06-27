import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { colors, radius, spacing } from '../theme/tokens';
import { apiUrl } from '../config/api';
import { shareToWhatsApp } from '../utils/shareUtils';
import { useTheme } from '../theme';
import authService from '../services/authService';

const TABS = [
  { id: 'createdAt', label: 'Récents', icon: '🕒' },
  { id: 'likes',     label: 'Populaires', icon: '🔥' },
  { id: 'remixes',   label: 'Viraux', icon: '🔄' },
];

const ForumScreen = ({ navigate }) => {
  const { theme, isDark } = useTheme();
  const [memes, setMemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('createdAt');
  const [userId, setUserId] = useState(null);
  const [likingId, setLikingId] = useState(null);

  useEffect(() => {
    loadUserId();
  }, []);

  useEffect(() => {
    fetchMemes();
  }, [sortBy, userId]);

  const loadUserId = async () => {
    try {
      const id = await authService.getUserId();
      console.log('[ForumScreen] userId chargé:', id);
      setUserId(id);
    } catch (error) {
      console.error('[ForumScreen] Erreur chargement userId:', error);
    }
  };

  const fetchMemes = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ sortBy });
      if (userId) params.append('userId', userId);
      const url = apiUrl(`/api/forum/memes?${params.toString()}`);
      console.log('[ForumScreen] Fetch memes URL:', url);
      const res = await fetch(url);
      const data = await res.json();
      console.log('[ForumScreen] Memes reçus:', data);
      console.log('[ForumScreen] Nombre de memes:', Array.isArray(data) ? data.length : 0);
      setMemes(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error('[ForumScreen] Erreur fetch memes:', e);
      setMemes([]);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (id) => {
    console.log('[ForumScreen] handleLike appelé, userId:', userId);
    
    // Si userId est null, essayer de le recharger
    if (!userId) {
      console.log('[ForumScreen] userId null, tentative de rechargement...');
      const reloadedId = await authService.getUserId();
      console.log('[ForumScreen] userId rechargé:', reloadedId);
      setUserId(reloadedId);
    }
    
    // Vérifier si l'utilisateur est connecté via authService
    const isLoggedIn = await authService.isLoggedIn();
    console.log('[ForumScreen] isLoggedIn:', isLoggedIn);
    
    if (!userId && !isLoggedIn) {
      console.log('[ForumScreen] Utilisateur non connecté, userId:', userId, 'isLoggedIn:', isLoggedIn);
      Alert.alert('Connexion nécessaire', 'Connectez-vous pour liker des mèmes !');
      navigate('Auth');
      return;
    }
    
    // Utiliser le userId rechargé si disponible
    const effectiveUserId = userId || await authService.getUserId();
    console.log('[ForumScreen] effectiveUserId:', effectiveUserId);
    
    if (!effectiveUserId) {
      console.log('[ForumScreen] Impossible de récupérer userId');
      Alert.alert('Erreur', 'Impossible de récupérer votre identifiant. Veuillez vous reconnecter.');
      navigate('Auth');
      return;
    }
    
    // Empêcher les clics multiples sur le même mème
    if (likingId === id) return;
    
    setLikingId(id);
    
    try {
      const res = await fetch(apiUrl(`/api/forum/like/${id}`), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: effectiveUserId })
      });
      if (res.ok) {
        const result = await res.json();
        setMemes(prev => prev.map(m => 
          m.id === id 
            ? { ...m, likes: result.liked ? (m.likes || 0) + 1 : Math.max(0, (m.likes || 0) - 1), likedByUser: result.liked }
            : m
        ));
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLikingId(null);
    }
  };

  const handleShareWhatsApp = async (imageUrl) => {
    await shareToWhatsApp(imageUrl, 'Regarde ce mème incroyable ! 🔥');
  };

  const renderMeme = ({ item, index }) => (
    <View style={[styles.card, { backgroundColor: theme.backgroundSecondary, borderColor: theme.border }]}>
      {sortBy !== 'createdAt' && index < 3 && (
        <View style={[styles.topBadge, { backgroundColor: colors.sunshineYellow }]}>
          <Text style={styles.topBadgeText}>#{index + 1} TOP</Text>
        </View>
      )}
      <View style={styles.imageContainer}>
        <Image source={{ uri: item.imageUrl }} style={styles.image} resizeMode="contain" />
      </View>
      <View style={styles.cardFooter}>
        <View style={styles.statsRow}>
          <View style={styles.stat}>
            <Text style={[styles.statValue, { color: theme.textPrimary }]}>{item.likes || 0}</Text>
            <Text style={[styles.statLabel, { color: theme.textMuted }]}>LIKES</Text>
          </View>
          <View style={styles.stat}>
            <Text style={[styles.statValue, { color: colors.skyBlue }]}>{item.remixes || 0}</Text>
            <Text style={[styles.statLabel, { color: theme.textMuted }]}>REMIX</Text>
          </View>
          {item.username && (
            <View style={{ flex: 1, alignItems: 'flex-end' }}>
              <Text style={{ fontSize: 10, color: theme.textMuted, fontWeight: '700' }}>par {item.username}</Text>
            </View>
          )}
        </View>
        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.likeBtn, { borderColor: theme.border }, item.likedByUser && styles.likedBtn]}
            onPress={() => handleLike(item.id)}
          >
            <Text style={[styles.btnText, { color: theme.textPrimary }, item.likedByUser && { color: '#fff' }]}>
              {item.likedByUser ? '❤️ Liké' : '❤️ Liker'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.remixBtn, { backgroundColor: colors.skyBlue }]}
            onPress={() => navigate('StatusRemixer', { imageUrl: item.imageUrl, sourceMemeId: item.id })}
          >
            <Text style={[styles.btnText, { color: '#fff' }]}>✨ Remix</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.whatsappBtn}
            onPress={() => handleShareWhatsApp(item.imageUrl)}
          >
            <Text style={[styles.btnText, { color: '#fff' }]}>📱 WhatsApp</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Tabs + Leaderboard */}
      <View style={[styles.header, { backgroundColor: theme.backgroundSecondary, borderBottomColor: theme.border }]}>
        <View style={styles.tabs}>
          {TABS.map(tab => (
          <TouchableOpacity
            key={tab.id}
            onPress={() => setSortBy(tab.id)}
            style={[styles.tab, sortBy === tab.id && styles.activeTab, sortBy === tab.id && { backgroundColor: colors.sapphireLight, borderColor: colors.sapphire }]}
          >
            <Text style={[styles.tabText, sortBy === tab.id && styles.activeTabText, sortBy === tab.id && { color: colors.sapphireDark }]}>
              {tab.icon} {tab.label}
            </Text>
          </TouchableOpacity>
          ))}
        </View>
        <TouchableOpacity style={[styles.leaderboardBtn, { backgroundColor: colors.successGreen }]} onPress={() => navigate('Leaderboard')}>
          <Text style={styles.leaderboardBtnText}>🏆 Classement</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.center}><ActivityIndicator color={colors.sapphire} size="large" /></View>
      ) : (
        <FlatList
          data={memes}
          renderItem={renderMeme}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          ListEmptyComponent={<Text style={[styles.empty, { color: theme.textMuted }]}>Aucun mème trouvé.</Text>}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    borderBottomWidth: 1,
    padding: spacing.sm,
    gap: spacing.sm,
  },
  tabs: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  leaderboardBtn: {
    paddingVertical: 12,
    paddingHorizontal: spacing.md,
    borderRadius: radius.md,
    alignItems: 'center',
  },
  leaderboardBtnText: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 14,
  },
  tab: {
    flex: 1, height: 40, justifyContent: 'center', alignItems: 'center',
    borderRadius: radius.md, backgroundColor: 'rgba(255,255,255,0.05)'
  },
  activeTab: { borderWidth: 1 },
  tabText: { fontWeight: '800', fontSize: 13 },
  activeTabText: {},
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  list: { padding: spacing.md },
  card: {
    borderRadius: radius.xl, marginBottom: 20,
    borderWidth: 1, overflow: 'hidden',
    position: 'relative'
  },
  topBadge: {
    position: 'absolute', top: 12, left: 12, zIndex: 10,
    paddingHorizontal: 10,
    paddingVertical: 4, borderRadius: radius.pill
  },
  topBadgeText: { fontWeight: '900', fontSize: 10 },
  imageContainer: { width: '100%', aspectRatio: 1, backgroundColor: '#000' },
  image: { width: '100%', height: '100%' },
  cardFooter: { padding: spacing.md },
  statsRow: { flexDirection: 'row', gap: 20, marginBottom: 16, alignItems: 'center' },
  stat: { alignItems: 'center' },
  statValue: { fontWeight: '900', fontSize: 18 },
  statLabel: { fontSize: 10, fontWeight: '800' },
  actions: { flexDirection: 'row', gap: 10 },
  likeBtn: {
    flex: 1, height: 44, borderRadius: radius.md,
    borderWidth: 1,
    justifyContent: 'center', alignItems: 'center'
  },
  likedBtn: {
    backgroundColor: colors.successGreen,
    borderColor: colors.successGreenDark
  },
  remixBtn: {
    flex: 1, height: 44, borderRadius: radius.md,
    justifyContent: 'center', alignItems: 'center'
  },
  whatsappBtn: {
    flex: 1, height: 44, borderRadius: radius.md,
    backgroundColor: '#25D366',
    justifyContent: 'center', alignItems: 'center'
  },
  btnText: { fontWeight: '800' },
  empty: { textAlign: 'center', marginTop: 40, fontWeight: '700' }
});

export default ForumScreen;
