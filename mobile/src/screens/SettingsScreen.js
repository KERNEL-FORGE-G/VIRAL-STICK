
import React, { useState, useRef, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, SafeAreaView, Animated, TouchableOpacity, StatusBar, Alert, ActivityIndicator } from "react-native";
import { useTheme, spacing, radius } from "../theme";
import GlassCard from "../components/GlassCard";
import AnimatedButton from "../components/AnimatedButton";
import CompanionAvatar from "../components/CompanionAvatar";
import AppIcon from "../components/AppIcon";
import { apiUrl } from "../config/api";
import axios from "axios";
import authService from "../services/authService";

const SettingsScreen = ({ navigate }) => {
  const { theme, isDark, toggleTheme } = useTheme();
  const [pingStatus, setPingStatus] = useState(null);
  const [pingLoading, setPingLoading] = useState(false);
  const anim = useRef(new Animated.Value(0)).current;

  const PROVIDERS = [
    { key: "gemini",   label: "Gemini",   icon: "sparkles", color: "#7C3AED", desc: "Provider principal — texte et image." },
    { key: "mistral",  label: "Mistral",  icon: "wind",     color: "#06B6D4", desc: "Fallback texte — garantit la génération." },
    { key: "deepseek", label: "DeepSeek", icon: "search",   color: theme.secondary, desc: "Deuxième fallback texte." },
  ];

  useEffect(() => {
    Animated.spring(anim, { toValue: 1, tension: 60, friction: 8, useNativeDriver: true }).start();
  }, [anim]);

  const testPing = async () => {
    setPingLoading(true);
    setPingStatus(null);
    try {
      const url = apiUrl('/health');
      const res = await axios.get(url, { timeout: 5000 });
      if (res.status === 200) {
        setPingStatus({ success: true, message: '✅ Serveur accessible' });
      } else {
        setPingStatus({ success: false, message: '⚠️ Réponse inattendue du serveur' });
      }
    } catch (error) {
      console.error('Ping error:', error);
      setPingStatus({ success: false, message: '❌ Impossible de joindre le serveur' });
    } finally {
      setPingLoading(false);
    }
  };

  const handleLogout = async () => {
    Alert.alert(
      'Déconnexion',
      'Voulez-vous vraiment vous déconnecter ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Déconnecter',
          style: 'destructive',
          onPress: async () => {
            const loggedOut = await authService.logout();
            if (loggedOut) {
              Alert.alert('Déconnexion réussie', 'Vous avez été déconnecté.');
              navigate?.('Auth');
            } else {
              Alert.alert('Erreur', 'Impossible de se déconnecter.');
            }
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} backgroundColor={theme.background} />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Animated.View style={{ opacity: anim, transform: [{ translateY: anim.interpolate({ inputRange: [0,1], outputRange: [-20,0] }) }] }}>

          {/* Hero */}
          <GlassCard style={styles.hero}>
            <View style={[styles.badge, { backgroundColor: theme.secondaryLight }]}><Text style={[styles.badgeText, { color: theme.secondary }]}>PARAMÈTRES IA</Text></View>
            <Text style={[styles.title, { color: theme.textPrimary }]}>Configu<Text style={{ color: theme.primary }}>ration</Text></Text>
            <Text style={[styles.sub, { color: theme.textSecondary }]}>Configure l'interface du studio. Les clés API sont gérées par le serveur.</Text>
            <View style={{ alignItems: "center", marginTop: spacing.md }}>
              <CompanionAvatar companion="para" size={88} floating message="Je garde les réglages clairs et prêts pour l'exploitation." showRing={false} />
            </View>
          </GlassCard>

          {/* Thème */}
          <GlassCard animate delay={50} style={styles.card}>
            <View style={styles.sectionHeader}>
              <AppIcon name="sun" color={theme.primary} size={20} />
              <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>Préférences d'affichage</Text>
            </View>
            <View style={styles.themeRow}>
              <View style={{ flex: 1 }}>
                <Text style={[styles.themeLabel, { color: theme.textPrimary }]}>Thème Sombre</Text>
                <Text style={[styles.themeDesc, { color: theme.textSecondary }]}>Activer l'ambiance nocturne pour l'application.</Text>
              </View>
              <TouchableOpacity
                onPress={toggleTheme}
                activeOpacity={0.8}
                style={[styles.switchContainer, { backgroundColor: isDark ? theme.primary : theme.border }]}
              >
                <View style={[styles.switchPin, {
                  alignSelf: isDark ? "flex-end" : "flex-start",
                  backgroundColor: "#ffffff"
                }]} />
              </TouchableOpacity>
            </View>
          </GlassCard>

          {/* Providers actifs */}
          <GlassCard animate delay={100} style={styles.card}>
            <View style={styles.sectionHeader}>
              <AppIcon name="zap" color={theme.primary} size={20} />
              <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>Providers actifs</Text>
            </View>
            {PROVIDERS.map((p) => (
              <View key={p.key} style={[styles.providerRow, { backgroundColor: `${p.color}10`, borderColor: `${p.color}33` }]}>
                <View style={[styles.providerDot, { backgroundColor: p.color }]} />
                <AppIcon name={p.icon} color={p.color} size={18} />
                <View style={{ flex: 1 }}>
                  <Text style={[styles.providerName, { color: theme.textPrimary }]}>{p.label}</Text>
                  <Text style={[styles.providerDesc, { color: theme.textSecondary }]}>{p.desc}</Text>
                </View>
              </View>
            ))}
          </GlassCard>

          {/* Test de connexion */}
          <GlassCard animate delay={150} style={styles.card}>
            <View style={styles.sectionHeader}>
              <AppIcon name="wifi" color={theme.primary} size={20} />
              <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>Test de connexion</Text>
            </View>
            <TouchableOpacity
              onPress={testPing}
              disabled={pingLoading}
              style={[styles.pingBtn, { backgroundColor: theme.backgroundSecondary, borderColor: pingLoading ? theme.textMuted : theme.secondary }]}
            >
              {pingLoading ? (
                <ActivityIndicator size="small" color={theme.textSecondary} />
              ) : (
                <Text style={[styles.pingBtnText, { color: theme.textPrimary }]}>Tester le ping</Text>
              )}
            </TouchableOpacity>
            {pingStatus && (
              <View style={[styles.statusBox, { backgroundColor: pingStatus.success ? theme.secondaryLight : "#fee2e2", borderColor: pingStatus.success ? `${theme.secondary}44` : "#fecaca" }]}>
                <Text style={[styles.statusText, { color: pingStatus.success ? theme.secondary : "#b91c1c" }]}>{pingStatus.message}</Text>
              </View>
            )}
          </GlassCard>

          {/* Lien à propos */}
          <GlassCard animate delay={200} style={styles.card}>
            <TouchableOpacity onPress={() => navigate?.("About")} activeOpacity={0.8} style={styles.aboutRow}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                <AppIcon name="info" color={theme.primary} size={20} />
                <View>
                  <Text style={[styles.aboutLabel, { color: theme.textPrimary }]}>À propos du produit</Text>
                  <Text style={[styles.aboutDesc, { color: theme.textSecondary }]}>Identité, stack, équipe et vision.</Text>
                </View>
              </View>
              <AppIcon name="chevron-right" color={theme.primary} size={18} />
            </TouchableOpacity>
          </GlassCard>

          {/* Déconnexion */}
          <GlassCard animate delay={250} style={styles.card}>
            <TouchableOpacity onPress={handleLogout} activeOpacity={0.8} style={[styles.logoutBtn, { backgroundColor: "#fee2e2", borderColor: "#fecaca" }]}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                <AppIcon name="log-out" color="#b91c1c" size={20} />
                <Text style={[styles.logoutText, { color: "#b91c1c" }]}>Se déconnecter</Text>
              </View>
            </TouchableOpacity>
          </GlassCard>

          <View style={{ height: 100 }} />
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe:        { flex: 1 },
  scroll:      { paddingHorizontal: spacing.md, paddingTop: spacing.md },
  hero:        { padding: spacing.lg, marginBottom: spacing.md },
  badge:       { borderRadius: radius.pill, paddingHorizontal: 10, paddingVertical: 4, alignSelf: "flex-start", marginBottom: 10 },
  badgeText:   { fontSize: 10, fontWeight: "800", letterSpacing: 1 },
  title:       { fontSize: 32, fontWeight: "900", letterSpacing: -0.5 },
  sub:         { fontSize: 14, marginTop: 6, lineHeight: 20 },
  card:        { marginBottom: spacing.md },
  sectionHeader:{ flexDirection: "row", alignItems: "center", gap: 8, marginBottom: spacing.md },
  sectionTitle:{ fontSize: 18, fontWeight: "800" },
  themeRow:    { flexDirection: "row", alignItems: "center", paddingVertical: 4 },
  themeLabel:  { fontSize: 15, fontWeight: "800" },
  themeDesc:   { fontSize: 12, marginTop: 2 },
  switchContainer:{ width: 50, height: 28, borderRadius: 14, padding: 3, justifyContent: "center" },
  switchPin:   { width: 22, height: 22, borderRadius: 11 },
  providerRow: { flexDirection: "row", alignItems: "center", gap: 12, padding: 14, borderRadius: radius.md, borderWidth: 1, marginBottom: 8 },
  providerDot: { width: 8, height: 8, borderRadius: 4 },
  providerName:{ fontSize: 15, fontWeight: "800" },
  providerDesc:{ fontSize: 12, marginTop: 2, lineHeight: 16 },
  keyHeader:   { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: spacing.md },
  toggleBtn:   { borderWidth: 1, borderRadius: radius.md, paddingHorizontal: 12, paddingVertical: 7 },
  toggleText:  { fontSize: 13, fontWeight: "700" },
  fieldLabel:  { fontSize: 14, fontWeight: "800", marginBottom: 8 },
  input:       { borderWidth: 1, borderRadius: radius.md, padding: spacing.md, fontSize: 14 },
  actions:     { flexDirection: "row", gap: spacing.sm, marginTop: spacing.sm },
  testBtn:     { flex: 1, borderWidth: 1, borderRadius: radius.md, justifyContent: "center", alignItems: "center" },
  testBtnText: { fontSize: 14, fontWeight: "800" },
  statusBox:   { borderWidth: 1, borderRadius: radius.md, padding: 12, marginTop: spacing.md },
  statusText:  { fontSize: 14, fontWeight: "700", lineHeight: 19 },
  aboutRow:    { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  aboutLabel:  { fontSize: 16, fontWeight: "800" },
  aboutDesc:   { fontSize: 13, marginTop: 4 },
  logoutBtn:   { flexDirection: "row", alignItems: "center", justifyContent: "center", padding: 16, borderRadius: radius.md, borderWidth: 1 },
  logoutText:  { fontSize: 16, fontWeight: "800" },
});

export default SettingsScreen;
