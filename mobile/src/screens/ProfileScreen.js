import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, SafeAreaView, StatusBar, Alert, TouchableOpacity } from 'react-native';
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
      const session = await authService.getSession();
      const currentUserId = session?.userId || 'guest';
      const currentUserEmail = session?.email || 'invité@viralstick.com';

      const res = await axios.get(apiUrl('/api/forum/leaderboard'));
      const leaderboard = res.data;
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
      console.error('Erreur profil:', error);
      const session = await authService.getSession();
      setUser({ username: 'Utilisateur', email: session?.email || 'non connecté', joinedAt: '---' });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await authService.logout();
    navigate('Auth');
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.safe, { backgroundColor: colors.snowWhite }]}>
        <View style={styles.center}><ActivityIndicator color={colors.brandPrimary} size="large" /></View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.snowWhite }]}>
      <StatusBar barStyle="dark-content" />
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.hero}>
          <Avatar name={user?.username || 'U'} size={80} />
          <Text style={styles.username}>{user?.username}</Text>
          <Text style={styles.email}>{user?.email}</Text>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statItem}><Text style={styles.statVal}>{stats.memes}</Text><Text style={styles.statLab}>Mèmes</Text></View>
          <View style={styles.statItem}><Text style={styles.statVal}>{stats.likes}</Text><Text style={styles.statLab}>Likes</Text></View>
          <View style={styles.statItem}><Text style={styles.statVal}>{stats.remixes}</Text><Text style={styles.statLab}>Remixes</Text></View>
        </View>

        <View style={{ marginTop: 30 }}>
          <AnimatedButton title="SE DÉCONNECTER" variant="danger" onPress={handleLogout} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1 },
  scroll: { padding: 20 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  hero: { alignItems: 'center', marginBottom: 30, padding: 20, backgroundColor: '#f9f9f9', borderRadius: 20, borderWidth: 2, borderColor: '#eee' },
  username: { fontSize: 22, fontWeight: '900', marginTop: 10, color: '#333' },
  email: { fontSize: 14, color: '#666' },
  statsRow: { flexDirection: 'row', gap: 10 },
  statItem: { flex: 1, padding: 15, backgroundColor: '#fff', borderWidth: 2, borderBottomWidth: 4, borderColor: '#eee', borderRadius: 15, alignItems: 'center' },
  statVal: { fontSize: 20, fontWeight: '900' },
  statLab: { fontSize: 10, fontWeight: '700', color: '#999' }
});

export default ProfileScreen;
