import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, SafeAreaView, StatusBar, Alert } from 'react-native';
import { useTheme, spacing, radius, colors } from '../theme';
import AnimatedButton from '../components/AnimatedButton';
import Avatar from '../components/Avatar';
import { apiUrl } from '../config/api';
import axios from 'axios';
import authService from '../services/authService';

const ProfileScreen = ({ navigate }) => {
  const { theme, isDark } = useTheme();
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({ memes: 0, likes: 0, remixes: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      // 1. Récupérer les infos de session réelles
      const session = await authService.getSession();
      const currentUserId = session?.userId || 'guest';
      const currentUserEmail = session?.email || 'invité@viralstick.com';

      // 2. Charger les stats du leaderboard depuis le backend
      const res = await axios.get(apiUrl('/api/forum/leaderboard'));
      const leaderboard = res.data;
      
      // Trouver les stats de l'utilisateur actuel
      const userStats = leaderboard.find(u => u.userId === currentUserId);
      
      if (userStats) {
        setStats({
          memes: userStats.memesPosted || 0,
          likes: userStats.totalLikes || 0,
          remixes: userStats.totalRemixes || 0
        });
      }

      setUser({
        username: userStats?.username || currentUserId.split('_')[1]?.toUpperCase() || 'Utilisateur Viral',
        email: currentUserEmail,
        joinedAt: session?.timestamp ? new Date(session.timestamp).toLocaleDateString('fr-FR') : new Date().toLocaleDateString('fr-FR'),
      });

    } catch (error) {
      console.error('Erreur chargement profil:', error);
      // Fallback si erreur serveur
      const session = await authService.getSession();
      setUser({
        username: 'Utilisateur',
        email: session?.email || 'non connecté',
        joinedAt: '---',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    const success = await authService.logout();
    if (success) {
      navigate('Auth');
    } else {
      Alert.alert("Erreur", "Impossible de se déconnecter proprement.");
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.safe, { backgroundColor: colors.snowWhite }]}>
        <View style={styles.center}>
          <ActivityIndicator color={colors.duoGreen} size="large" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.snowWhite }]}>
      <StatusBar barStyle="dark-content" />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.hero}>
          <View style={[styles.badge, { backgroundColor: colors.duoGreenLight }]}>
            <Text style={[styles.badgeText, { color: colors.duoGreen }]}>MON COMPTE VÉRIFIÉ</Text>
          </View>
          <View style={styles.avatarSection}>
            <Avatar name={user?.username || 'Viral User'} size={96} />
          </View>
          <Text style={styles.username}>{user?.username}</Text>
          <Text style={styles.email}>{user?.email}</Text>
          <Text style={styles.joined}>Propulsé par Kernel Forge • {user?.joinedAt}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>📊 Performances Virales</Text>
          <View style={styles.statsGrid}>
            <View style={[styles.statCard, { backgroundColor: colors.duoGreenLight + '55', borderColor: colors.duoGreen }]}>
              <Text style={[styles.statValue, { color: colors.duoGreen }]}>{stats.memes}</Text>
              <Text style={styles.statLabel}>Créations</Text>
            </View>
            <View style={[styles.statCard, { backgroundColor: colors.sunshineYellow + '33', borderColor: colors.sunshineYellow }]}>
              <Text style={[styles.statValue, { color: colors.sunshineYellow }]}>{stats.likes}</Text>
              <Text style={styles.statLabel}>Impact</Text>
            </View>
            <View style={[styles.statCard, { backgroundColor: colors.skyBlue + '33', borderColor: colors.skyBlue }]}>
              <Text style={[styles.statValue, { color: colors.skyBlue }]}>{stats.remixes}</Text>
              <Text style={styles.statLabel}>Remixes</Text>
            </View>
          </View>
        </View>

        <View style={styles.actions}>
          <AnimatedButton
            title="Rafraîchir les stats"
            onPress={loadProfile}
            variant="ghost"
            size="sm"
            style={{ marginBottom: spacing.sm }}
          />
          <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
            <Text style={styles.logoutText}>🚪 Déconnexion sécurisée</Text>
          </TouchableOpacity>
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
  hero: { alignItems: 'center', padding: spacing.xl, marginBottom: spacing.md, backgroundColor: colors.snowWhite, borderRadius: radius.buttons, borderWidth: 2, borderColor: colors.cloudGray },
  badge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: radius.pill, marginBottom: spacing.md },
  badgeText: { fontSize: 10, fontWeight: '800', letterSpacing: 1, fontFamily: 'Nunito' },
  avatarSection: { marginBottom: spacing.md },
  username: { fontSize: 24, fontWeight: '900', marginBottom: spacing.xs, textAlign: 'center', color: colors.almostBlack, fontFamily: 'Nunito' },
  email: { fontSize: 14, marginBottom: spacing.xs, opacity: 0.7, color: colors.charcoal, fontFamily: 'Nunito' },
  joined: { fontSize: 12, fontStyle: 'italic', color: colors.silver, fontFamily: 'Nunito' },
  card: { padding: spacing.lg, marginBottom: spacing.md, backgroundColor: colors.snowWhite, borderRadius: radius.buttons, borderWidth: 2, borderColor: colors.cloudGray },
  sectionTitle: { fontSize: 17, fontWeight: '900', marginBottom: spacing.md, textAlign: 'center', color: colors.almostBlack, fontFamily: 'Nunito' },
  statsGrid: { flexDirection: 'row', gap: spacing.sm },
  statCard: { flex: 1, padding: spacing.md, borderRadius: radius.buttons, borderWidth: 2, alignItems: 'center' },
  statValue: { fontSize: 24, fontWeight: '900', marginBottom: 2, fontFamily: 'Nunito' },
  statLabel: { fontSize: 10, fontWeight: '700', textTransform: 'uppercase', color: colors.charcoal, fontFamily: 'Nunito' },
  actions: { marginTop: spacing.md },
  logoutBtn: { alignItems: 'center', padding: 16, borderRadius: radius.buttons },
  logoutText: { fontWeight: '800', color: colors.bubblegumPink, fontFamily: 'Nunito' }
});

export default ProfileScreen;
