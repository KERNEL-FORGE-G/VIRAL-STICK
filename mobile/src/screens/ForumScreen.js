import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, ActivityIndicator, Alert, RefreshControl, SafeAreaView, StatusBar } from 'react-native';
import { apiUrl } from '../config/api';
import { shareToWhatsApp, downloadImageToGallery } from '../utils/shareUtils';
import { useTheme, spacing, radius, colors } from '../theme';
import AnimatedButton from '../components/AnimatedButton';
import authService from '../services/authService';
import AppIcon from '../components/AppIcon';
import Avatar from '../components/Avatar';

const TABS = [
  { id: 'createdAt', label: 'Récents', icon: 'clock' },
  { id: 'likes', label: 'Top', icon: 'flame' },
  { id: 'remixes', label: 'Viraux', icon: 'zap' },
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
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.userInfo}>
          <Avatar name={item.username || 'Anonyme'} size={36} />
          <Text style={styles.username}>{item.username || 'Anonyme'}</Text>
        </View>
      </View>

      <View style={styles.imageContainer}>
        <Image source={{ uri: item.imageUrl }} style={styles.image} resizeMode="contain" />
      </View>

      <View style={styles.cardFooter}>
        <View style={styles.statsRow}>
          <TouchableOpacity style={styles.statBtn} onPress={() => handleLike(item.id)}>
            <AppIcon name="heart" color={item.likedByUser ? colors.bubblegumPink : colors.charcoal} fill={item.likedByUser ? colors.bubblegumPink : 'none'} size={24} />
            <Text style={styles.statText}>{item.likes || 0}</Text>
          </TouchableOpacity>
          <View style={styles.statBtn}>
            <AppIcon name="zap" color={colors.sunshineYellow} size={20} />
            <Text style={styles.statText}>{item.remixes || 0}</Text>
          </View>
        </View>

        <View style={styles.actionsRow}>
          <TouchableOpacity
            style={[styles.actionBtn, styles.actionBtnWhatsapp, { backgroundColor: '#25D366' }]}
            onPress={() => shareToWhatsApp(item.imageUrl)}
          >
            <AppIcon name="share-2" color="#fff" size={18} />
            <Text style={styles.btnText}>WHATSAPP</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionBtn, styles.actionBtnRemix, { backgroundColor: colors.duoGreen }]}
            onPress={() => navigate('StatusRemixer', { imageUrl: item.imageUrl })}
          >
            <AppIcon name="refresh-cw" color="#fff" size={18} />
            <Text style={styles.btnText}>REMIXER</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.iconBtn, { backgroundColor: colors.cloudGray }]} onPress={() => downloadImageToGallery(item.imageUrl)}>
            <AppIcon name="download" color={colors.charcoal} size={22} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.snowWhite }]}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        {TABS.map(tab => (
          <TouchableOpacity
            key={tab.id}
            onPress={() => setSortBy(tab.id)}
            style={[styles.tab, sortBy === tab.id && { backgroundColor: colors.duoGreen, borderColor: colors.duoGreen }]}
          >
            <AppIcon name={tab.icon} color={sortBy === tab.id ? '#fff' : colors.charcoal} size={16} />
            <Text style={[styles.tabText, { color: sortBy === tab.id ? '#fff' : colors.charcoal }]}>{tab.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {loading ? (
        <View style={styles.center}><ActivityIndicator color={colors.duoGreen} size="large" /></View>
      ) : (
        <FlatList
          data={memes}
          renderItem={renderMeme}
          keyExtractor={m => m.id}
          contentContainerStyle={styles.list}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => fetchMemes(true)} tintColor={colors.duoGreen} />}
          ListEmptyComponent={<Text style={styles.empty}>Aucun mème trouvé sur le forum.</Text>}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', padding: 12, gap: 8, backgroundColor: colors.snowWhite },
  tab: { flex: 1, flexDirection: 'row', height: 42, borderRadius: radius.buttons, justifyContent: 'center', alignItems: 'center', gap: 6, backgroundColor: colors.cloudGray, borderWidth: 2, borderColor: 'rgba(0,0,0,0.1)' },
  tabText: { fontWeight: '900', fontSize: 13, fontFamily: 'Nunito' },
  list: { padding: spacing.md, paddingBottom: 100 },
  card: { borderRadius: radius.buttons, marginBottom: 25, padding: 0, overflow: 'hidden', backgroundColor: colors.snowWhite, borderWidth: 2, borderColor: colors.cloudGray },
  cardHeader: { flexDirection: 'row', alignItems: 'center', padding: 15, justifyContent: 'space-between' },
  userInfo: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  username: { fontSize: 14, fontWeight: '800', color: colors.almostBlack, fontFamily: 'Nunito' },
  imageContainer: { width: '100%', aspectRatio: 1, backgroundColor: '#000' },
  image: { width: '100%', height: '100%' },
  cardFooter: { padding: 18 },
  statsRow: { flexDirection: 'row', gap: 20, marginBottom: 15 },
  statBtn: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  statText: { fontWeight: '900', fontSize: 15, color: colors.almostBlack, fontFamily: 'Nunito' },
  actionsRow: { flexDirection: 'row', gap: 10 },
  actionBtn: {
    flex: 1,
    height: 55,
    borderRadius: radius.buttons,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    borderWidth: 2,
    borderColor: 'rgba(0,0,0,0.1)'
  },
  actionBtnWhatsapp: {
    shadowColor: '#12b534',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4
  },
  actionBtnRemix: {
    shadowColor: '#3f8f01',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4
  },
  iconBtn: {
    width: 55,
    height: 55,
    borderRadius: radius.buttons,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(0,0,0,0.1)',
    shadowColor: '#b5b5b5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4
  },
  btnText: { color: '#fff', fontWeight: '900', fontSize: 14, letterSpacing: 0.5, fontFamily: 'Nunito' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  empty: { textAlign: 'center', marginTop: 50, fontWeight: '700', color: colors.silver, fontFamily: 'Nunito' }
});

export default ForumScreen;
