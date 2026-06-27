import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, SafeAreaView, StatusBar } from 'react-native';
import { useTheme, spacing, radius } from '../theme';
import GlassCard from '../components/GlassCard';
import AnimatedButton from '../components/AnimatedButton';
import CompanionAvatar from '../components/CompanionAvatar';
import { userDB, statsDB } from '../services/database';

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
      // Charger l'utilisateur depuis la base de données
      const userData = await userDB.getUserById(userId);
      
      if (userData) {
        setUser({
          username: userData.username,
          email: userData.email,
          joinedAt: new Date(userData.joined_at * 1000).toLocaleDateString('fr-FR'),
          avatar: userData.avatar
        });
      } else {
        // Utilisateur par défaut si non trouvé
        setUser({
          username: 'ViralUser',
          email: 'user@viralstick.com',
          joinedAt: new Date().toLocaleDateString('fr-FR'),
          avatar: 'arch'
        });
      }

      // Charger les statistiques
      const userStats = await statsDB.getUserStats(userId);
      setStats({
        memes: userStats.memes_created || 0,
        likes: userStats.likes_received || 0,
        remixes: userStats.remixes_count || 0
      });
    } catch (error) {
      console.error('Erreur chargement profil:', error);
      // Fallback avec données simulées
      setUser({
        username: 'ViralUser',
        email: 'user@viralstick.com',
        joinedAt: new Date().toLocaleDateString('fr-FR'),
        avatar: 'arch'
      });
      setStats({ memes: 12, likes: 156, remixes: 8 });
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
