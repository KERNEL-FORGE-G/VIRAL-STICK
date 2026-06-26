import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { colors, radius, spacing } from '../theme/tokens';
import { apiUrl } from '../config/api';

const TABS = [
  { id: 'createdAt', label: 'Récents', icon: '🕒' },
  { id: 'likes',     label: 'Populaires', icon: '🔥' },
  { id: 'remixes',   label: 'Viraux', icon: '🔄' },
];

const ForumScreen = ({ navigate }) => {
  const [memes, setMemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('createdAt');
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    fetchMemes();
  }, [sortBy, userId]);

  const fetchMemes = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ sortBy });
      if (userId) params.append('userId', userId);
      const res = await fetch(apiUrl(`/api/forum/memes?${params.toString()}`));
      const data = await res.json();
      setMemes(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
      setMemes([]);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (id) => {
    if (!userId) {
      Alert.alert('Connexion nécessaire', 'Connectez-vous pour liker des mèmes !');
      navigate('Auth');
      return;
    }
    try {
      const res = await fetch(apiUrl(`/api/forum/like/${id}`), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId })
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
    }
  };

  const renderMeme = ({ item, index }) => (
    <View style={styles.card}>
      {sortBy !== 'createdAt' && index < 3 && (
        <View style={styles.topBadge}>
          <Text style={styles.topBadgeText}>#{index + 1} TOP</Text>
        </View>
      )}
      <View style={styles.imageContainer}>
        <Image source={{ uri: item.imageUrl }} style={styles.image} resizeMode="contain" />
      </View>
      <View style={styles.cardFooter}>
        <View style={styles.statsRow}>
          <View style={styles.stat}>
            <Text style={styles.statValue}>{item.likes || 0}</Text>
            <Text style={styles.statLabel}>LIKES</Text>
          </View>
          <View style={styles.stat}>
            <Text style={[styles.statValue, { color: colors.duoBlue }]}>{item.remixes || 0}</Text>
            <Text style={styles.statLabel}>REMIX</Text>
          </View>
          {item.username && (
            <View style={{ flex: 1, alignItems: 'flex-end' }}>
              <Text style={{ fontSize: 10, color: colors.silver, fontWeight: '700' }}>par {item.username}</Text>
            </View>
          )}
        </View>
        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.likeBtn, item.likedByUser && styles.likedBtn]}
            onPress={() => handleLike(item.id)}
          >
            <Text style={[styles.btnText, item.likedByUser && { color: '#fff' }]}>
              {item.likedByUser ? '❤️ Liked' : '❤️ Liker'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.remixBtn}
            onPress={() => navigate('StatusRemixer', { imageUrl: item.imageUrl, sourceMemeId: item.id })}
          >
            <Text style={[styles.btnText, { color: '#fff' }]}>✨ Remix</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Tabs + Leaderboard */}
      <View style={styles.header}>
        <View style={styles.tabs}>
          {TABS.map(tab => (
          <TouchableOpacity
            key={tab.id}
            onPress={() => setSortBy(tab.id)}
            style={[styles.tab, sortBy === tab.id && styles.activeTab]}
          >
            <Text style={[styles.tabText, sortBy === tab.id && styles.activeTabText]}>
              {tab.icon} {tab.label}
            </Text>
          </TouchableOpacity>
          ))}
        </View>
        <TouchableOpacity style={styles.leaderboardBtn} onPress={() => navigate('Leaderboard')}>
          <Text style={styles.leaderboardBtnText}>🏆 Classement</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.center}><ActivityIndicator color={colors.duoGreen} size="large" /></View>
      ) : (
        <FlatList
          data={memes}
          renderItem={renderMeme}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          ListEmptyComponent={<Text style={styles.empty}>Aucun mème trouvé.</Text>}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f7f7f7' },
  header: {
    backgroundColor: '#fff',
    borderBottomWidth: 2,
    borderColor: colors.cloudGray,
    padding: 8,
    gap: 8,
  },
  tabs: {
    flexDirection: 'row',
    gap: 8,
  },
  leaderboardBtn: {
    backgroundColor: colors.duoGreen,
    paddingVertical: 12,
    paddingHorizontal: 16,
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
    borderRadius: radius.md, backgroundColor: '#f0f0f0'
  },
  activeTab: { backgroundColor: colors.duoGreenLight, borderWidth: 1, borderColor: colors.duoGreen },
  tabText: { fontWeight: '800', fontSize: 13, color: colors.silver },
  activeTabText: { color: colors.duoGreenDark },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  list: { padding: spacing.md },
  card: {
    backgroundColor: '#fff', borderRadius: radius.xl, marginBottom: 20,
    borderWidth: 2, borderColor: colors.cloudGray, overflow: 'hidden',
    position: 'relative'
  },
  topBadge: {
    position: 'absolute', top: 12, left: 12, zIndex: 10,
    backgroundColor: colors.sunshineYellow, paddingHorizontal: 10,
    paddingVertical: 4, borderRadius: radius.pill
  },
  topBadgeText: { fontWeight: '900', fontSize: 10 },
  imageContainer: { width: '100%', aspectRatio: 1, backgroundColor: '#000' },
  image: { width: '100%', height: '100%' },
  cardFooter: { padding: 16 },
  statsRow: { flexDirection: 'row', gap: 20, marginBottom: 16, alignItems: 'center' },
  stat: { alignItems: 'center' },
  statValue: { fontWeight: '900', fontSize: 18, color: colors.duoGreen },
  statLabel: { fontSize: 10, color: colors.silver, fontWeight: '800' },
  actions: { flexDirection: 'row', gap: 10 },
  likeBtn: {
    flex: 1, height: 44, borderRadius: radius.md,
    borderWidth: 2, borderColor: colors.cloudGray,
    justifyContent: 'center', alignItems: 'center'
  },
  likedBtn: {
    backgroundColor: colors.duoGreen,
    borderColor: colors.duoGreenDark
  },
  remixBtn: {
    flex: 1, height: 44, borderRadius: radius.md,
    backgroundColor: colors.duoBlue,
    justifyContent: 'center', alignItems: 'center'
  },
  btnText: { fontWeight: '800', color: colors.charcoal },
  empty: { textAlign: 'center', marginTop: 40, color: colors.silver, fontWeight: '700' }
});

export default ForumScreen;
