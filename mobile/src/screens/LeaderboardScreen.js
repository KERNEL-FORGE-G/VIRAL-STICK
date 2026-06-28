import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity, SafeAreaView, StatusBar } from "react-native";
import axios from "axios";
import { useTheme, spacing, radius, shadows } from "../theme";
import GlassCard from "../components/GlassCard";
import AppIcon from "../components/AppIcon";
import { apiUrl } from "../config/api";

const LeaderboardScreen = () => {
  const { theme, isDark } = useTheme();
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchLeaderboard = async () => {
    try {
      const response = await axios.get(apiUrl("/api/forum/leaderboard"));
      setLeaderboard(response.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchLeaderboard(); }, []);

  const getRankColor = (index) => {
    if (index === 0) return theme.warning;
    if (index === 1) return "#C0C0C0";
    if (index === 2) return "#CD7F32";
    return theme.textMuted;
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.textPrimary }]}>🏆 Classement</Text>
          <Text style={[styles.subtitle, { color: theme.textSecondary }]}>Les Maîtres de la Viralité</Text>
        </View>

        {loading ? (
          <ActivityIndicator size="large" color={theme.primary} style={{ marginTop: 50 }} />
        ) : (
          <View style={styles.list}>
            {leaderboard.map((user, index) => (
              <GlassCard key={user.userId} style={[styles.item, index === 0 && { borderColor: theme.warning, borderWidth: 1.5 }]}>
                <View style={[styles.rankBox, { backgroundColor: getRankColor(index) + '33' }]}>
                  <Text style={[styles.rankText, { color: getRankColor(index) }]}>{index + 1}</Text>
                </View>

                <View style={styles.userInfo}>
                  <Text style={[styles.username, { color: theme.textPrimary }]}>{user.username}</Text>
                  <Text style={[styles.stats, { color: theme.textSecondary }]}>{user.memesPosted} mèmes créés</Text>
                </View>

                <View style={styles.scoreBox}>
                   <View style={styles.statLine}>
                      <AppIcon name="heart" color={theme.danger} size={14} fill={theme.danger} />
                      <Text style={[styles.statNum, { color: theme.textPrimary }]}>{user.totalLikes}</Text>
                   </View>
                   <View style={styles.statLine}>
                      <AppIcon name="refresh-cw" color={theme.primary} size={14} />
                      <Text style={[styles.statNum, { color: theme.textPrimary }]}>{user.totalRemixes}</Text>
                   </View>
                </View>
              </GlassCard>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1 },
  scroll: { padding: 15 },
  header: { alignItems: 'center', marginBottom: 25, marginTop: 10 },
  title: { fontSize: 30, fontWeight: '900' },
  subtitle: { fontSize: 14, fontWeight: '700', marginTop: 5 },
  list: { gap: 12, paddingBottom: 50 },
  item: { flexDirection: 'row', alignItems: 'center', padding: 15, borderRadius: 20 },
  rankBox: { width: 40, height: 40, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  rankText: { fontSize: 18, fontWeight: '900' },
  userInfo: { flex: 1, marginLeft: 15 },
  username: { fontSize: 16, fontWeight: '800' },
  stats: { fontSize: 11, fontWeight: '600' },
  scoreBox: { alignItems: 'flex-end', gap: 5 },
  statLine: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  statNum: { fontSize: 13, fontWeight: '900' }
});

export default LeaderboardScreen;
