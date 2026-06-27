import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, SafeAreaView, StatusBar } from 'react-native';
import { useTheme, spacing, radius } from '../theme';
import GlassCard from '../components/GlassCard';
import AnimatedButton from '../components/AnimatedButton';
import CompanionAvatar from '../components/CompanionAvatar';
import { apiUrl } from '../config/api';
import axios from 'axios';

const ProfileScreen = ({ navigate }) => {
  const { theme, isDark } = useTheme();
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({ memes: 0, likes: 0, remixes: 0 });
  const [loading, setLoading] = useState(true);
  const [userId] = useState('demo_user'); // À remplacer par l'ID utilisateur réel

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      // Charger les stats du leaderboard depuis le backend
      const res = await axios.get(apiUrl('/api/forum/leaderboard'));
      const leaderboard = res.data;
      
      // Trouver les stats de l'utilisateur actuel
      const userStats = leaderboard.find(u => u.userId === userId);
      
      if (userStats) {
        setStats({
          memes: userStats.memesPosted || 0,
          likes: userStats.totalLikes || 0,
          remixes: userStats.totalRemixes || 0
        });
        setUser({
          username: userStats.username || 'ViralUser',
          email: 'user@viralstick.com',
          joinedAt: new Date().toLocaleDateString('fr-FR'),
          avatar: 'arch'
        });
      } else {
        // Fallback avec données simulées si utilisateur non trouvé
        setUser({
          username: 'ViralUser',
          email: 'user@viralstick.com',
          joinedAt: new Date().toLocaleDateString('fr-FR'),
          avatar: 'arch'
        });
        setStats({ memes: 0, likes: 0, remixes: 0 });
      }
    } catch (error) {
      console.error('Erreur chargement profil:', error);
      // Fallback avec données simulées
      setUser({
        username: 'ViralUser',
        email: 'user@viralstick.com',
        joinedAt: new Date().toLocaleDateString('fr-FR'),
        avatar: 'arch'
      });
      setStats({ memes: 0, likes: 0, remixes: 0 });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    navigate('Auth');
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]}>
        <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={theme.background} />
        <View style={[styles.center, { backgroundColor: theme.background }]}>
          <ActivityIndicator color={theme.primary} size="large" />
          <Text style={[styles.loadingText, { color: theme.textMuted }]}>Chargement...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={theme.background} />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <GlassCard style={styles.hero}>
          <View style={[styles.badge, { backgroundColor: theme.primaryLight }]}>
            <Text style={[styles.badgeText, { color: theme.primary }]}>MON PROFIL</Text>
          </View>
          <View style={styles.avatarSection}>
            <CompanionAvatar companion={user.avatar} size={96} floating showRing={false} />
          </View>
          <Text style={[styles.username, { color: theme.textPrimary }]}>{user.username}</Text>
          <Text style={[styles.email, { color: theme.textSecondary }]}>{user.email}</Text>
          <Text style={[styles.joined, { color: theme.textMuted }]}>Membre depuis le {user.joinedAt}</Text>
        </GlassCard>

        <GlassCard style={styles.card}>
          <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>📊 Statistiques</Text>
          <View style={styles.statsGrid}>
            <View style={[styles.statCard, { backgroundColor: theme.backgroundSecondary, borderColor: theme.border }]}>
              <Text style={[styles.statValue, { color: theme.primary }]}>{stats.memes}</Text>
              <Text style={[styles.statLabel, { color: theme.textMuted }]}>Mèmes créés</Text>
            </View>
            <View style={[styles.statCard, { backgroundColor: theme.backgroundSecondary, borderColor: theme.border }]}>
              <Text style={[styles.statValue, { color: theme.success }]}>{stats.likes}</Text>
              <Text style={[styles.statLabel, { color: theme.textMuted }]}>Likes reçus</Text>
            </View>
            <View style={[styles.statCard, { backgroundColor: theme.backgroundSecondary, borderColor: theme.border }]}>
              <Text style={[styles.statValue, { color: theme.secondary }]}>{stats.remixes}</Text>
              <Text style={[styles.statLabel, { color: theme.textMuted }]}>Remixes</Text>
            </View>
          </View>
        </GlassCard>

        <View style={styles.actions}>
          <AnimatedButton
            title="⚙️ Réglages"
            onPress={() => navigate('Settings')}
            size="lg"
            style={{ marginBottom: spacing.sm }}
          />
          <AnimatedButton
            title="🚪 Déconnexion"
            onPress={handleLogout}
            size="lg"
            variant="ghost"
            style={{ borderColor: theme.danger, color: theme.danger }}
          />
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1 },
  scroll: { padding: spacing.md },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: spacing.md, fontSize: 16 },
  hero: { alignItems: 'center', padding: spacing.xl, marginBottom: spacing.md },
  badge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: radius.pill, marginBottom: spacing.md },
  badgeText: { fontSize: 12, fontWeight: '800' },
  avatarSection: { marginBottom: spacing.md },
  username: { fontSize: 28, fontWeight: '900', marginBottom: spacing.xs },
  email: { fontSize: 16, marginBottom: spacing.xs },
  joined: { fontSize: 14 },
  card: { padding: spacing.xl, marginBottom: spacing.md },
  sectionTitle: { fontSize: 20, fontWeight: '900', marginBottom: spacing.md },
  statsGrid: { flexDirection: 'row', gap: spacing.sm },
  statCard: { flex: 1, padding: spacing.md, borderRadius: radius.lg, borderWidth: 1, alignItems: 'center' },
  statValue: { fontSize: 32, fontWeight: '900', marginBottom: spacing.xs },
  statLabel: { fontSize: 12, fontWeight: '700' },
  actions: { marginTop: spacing.md },
});

export default ProfileScreen;
