import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, ActivityIndicator, Alert, RefreshControl, SafeAreaView, StatusBar } from 'react-native';
import { apiUrl } from '../config/api';
import { shareToWhatsApp, downloadImageToGallery } from '../utils/shareUtils';
import { useTheme, spacing, radius, shadows } from '../theme';
import authService from '../services/authService';
import AppIcon from '../components/AppIcon';
import GlassCard from '../components/GlassCard';

const TABS = [
  { id: 'createdAt', label: 'Récents', icon: 'clock' },
  { id: 'likes',     label: 'Top', icon: 'flame' },
  { id: 'remixes',   label: 'Viraux', icon: 'zap' },
];

const ForumScreen = ({ navigate }) => {
  const { theme, isDark } = useTheme();
  const [memes, setMemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [sortBy, setSortBy] = useState('createdAt');
  const [userId, setUserId] = useState(null);

  const fetchMemes = useCallback(async (isRefresh = false) => {
    if (!isRefresh) setLoading(true);
    try {
      const id = await authService.getUserId();
      setUserId(id);
      const res = await fetch(apiUrl(`/api/forum/memes?sortBy=${sortBy}${id ? `&userId=${id}` : ''}`));
      if (!res.ok) throw new Error("Erreur serveur");
      const data = await res.json();
      setMemes(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error('[Forum] Fetch error:', e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [sortBy]);

  useEffect(() => { fetchMemes(); }, [fetchMemes]);

  const handleLike = async (id) => {
    if (!userId) return navigate('Auth');
    try {
      const res = await fetch(apiUrl(`/api/forum/like/${id}`), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId })
      });
      if (res.ok) {
        const result = await res.json();
        setMemes(prev => prev.map(m => m.id === id ? { ...m, likes: result.liked ? (m.likes || 0) + 1 : Math.max(0, (m.likes || 0) - 1), likedByUser: result.liked } : m));
      }
    } catch (e) { console.error(e); }
  };

  const renderMeme = ({ item }) => (
    <GlassCard style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.userInfo}>
           <View style={[styles.avatarCircle, { backgroundColor: theme.primaryLight }]}>
             <Text style={{ color: theme.primary, fontWeight: '900' }}>{item.username?.[0]?.toUpperCase() || 'V'}</Text>
           </View>
           <Text style={[styles.username, { color: theme.textPrimary }]}>{item.username || 'Anonyme'}</Text>
        </View>
        <TouchableOpacity onPress={() => shareToWhatsApp(item.imageUrl)}>
           <AppIcon name="more-horizontal" color={theme.textMuted} size={20} />
        </TouchableOpacity>
      </View>

      <View style={styles.imageContainer}>
        <Image source={{ uri: item.imageUrl }} style={styles.image} resizeMode="contain" />
      </View>

      <View style={styles.cardFooter}>
        <View style={styles.statsRow}>
          <TouchableOpacity style={styles.statBtn} onPress={() => handleLike(item.id)}>
            <AppIcon name="heart" color={item.likedByUser ? theme.danger : theme.textPrimary} fill={item.likedByUser ? theme.danger : 'none'} size={24} />
            <Text style={[styles.statText, { color: theme.textPrimary }]}>{item.likes || 0}</Text>
          </TouchableOpacity>
          <View style={styles.statBtn}>
            <AppIcon name="zap" color={theme.warning} size={20} />
            <Text style={[styles.statText, { color: theme.textPrimary }]}>{item.remixes || 0}</Text>
          </View>
        </View>

        <View style={styles.actionsRow}>
          <TouchableOpacity
            style={[styles.remixBtn, { backgroundColor: theme.primary }, shadows.card]}
            onPress={() => navigate('StatusRemixer', { imageUrl: item.imageUrl })}
          >
            <AppIcon name="refresh-cw" color="#fff" size={18} />
            <Text style={styles.btnText}>REMIXER CE MÈME</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.iconBtn, { backgroundColor: 'rgba(150,150,150,0.1)' }]} onPress={() => downloadImageToGallery(item.imageUrl)}>
            <AppIcon name="download" color={theme.textPrimary} size={22} />
          </TouchableOpacity>
        </View>
      </View>
    </GlassCard>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
      <View style={[styles.header, { borderBottomColor: theme.border }]}>
        {TABS.map(tab => (
          <TouchableOpacity
            key={tab.id}
            onPress={() => setSortBy(tab.id)}
            style={[styles.tab, sortBy === tab.id && { backgroundColor: theme.primary }]}
          >
            <AppIcon name={tab.icon} color={sortBy === tab.id ? '#fff' : theme.textMuted} size={16} />
            <Text style={[styles.tabText, { color: sortBy === tab.id ? '#fff' : theme.textMuted }]}>{tab.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {loading ? (
        <View style={styles.center}><ActivityIndicator color={theme.primary} size="large" /></View>
      ) : (
        <FlatList
          data={memes}
          renderItem={renderMeme}
          keyExtractor={m => m.id}
          contentContainerStyle={styles.list}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => fetchMemes(true)} tintColor={theme.primary} />}
          ListEmptyComponent={<Text style={[styles.empty, { color: theme.textMuted }]}>Aucun mème trouvé sur le forum.</Text>}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', padding: 12, borderBottomWidth: 1, gap: 8, backgroundColor: 'rgba(0,0,0,0.05)' },
  tab: { flex: 1, flexDirection: 'row', height: 42, borderRadius: 20, justifyContent: 'center', alignItems: 'center', gap: 6, backgroundColor: 'rgba(150,150,150,0.05)' },
  tabText: { fontWeight: '900', fontSize: 13 },
  list: { padding: 15, paddingBottom: 100 },
  card: { borderRadius: 32, marginBottom: 25, padding: 0, overflow: 'hidden' },
  cardHeader: { flexDirection: 'row', alignItems: 'center', padding: 15, justifyContent: 'space-between' },
  userInfo: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  avatarCircle: { width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center' },
  username: { fontSize: 14, fontWeight: '800' },
  imageContainer: { width: '100%', aspectRatio: 1, backgroundColor: '#000' },
  image: { width: '100%', height: '100%' },
  cardFooter: { padding: 18 },
  statsRow: { flexDirection: 'row', gap: 20, marginBottom: 15 },
  statBtn: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  statText: { fontWeight: '900', fontSize: 15 },
  actionsRow: { flexDirection: 'row', gap: 10 },
  remixBtn: { flex: 1, height: 55, borderRadius: 18, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 10 },
  iconBtn: { width: 55, height: 55, borderRadius: 18, justifyContent: 'center', alignItems: 'center' },
  btnText: { color: '#fff', fontWeight: '900', fontSize: 14, letterSpacing: 0.5 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  empty: { textAlign: 'center', marginTop: 50, fontWeight: '700' }
});

export default ForumScreen;
