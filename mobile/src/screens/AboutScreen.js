
import React, { useRef, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, SafeAreaView, Animated, Linking, Image, StatusBar } from "react-native";
import { useTheme, spacing, radius } from "../theme";
import GlassCard from "../components/GlassCard";
import AnimatedButton from "../components/AnimatedButton";
import CompanionAvatar from "../components/CompanionAvatar";
import AppIcon from "../components/AppIcon";
import { TEAM_MEMBERS } from "../data/teamData";

const AboutScreen = () => {
  const { theme, isDark } = useTheme();
  const anim = useRef(new Animated.Value(0)).current;

  const PILLARS = [
    { icon: "palette",    title: "Identité créative", text: "7 compagnons IA uniques avec personnalités et rôles distincts.", color: theme.primary },
    { icon: "cpu",        title: "IA multimodale",    text: "Texte, voix, image — trois canaux vers les meilleurs modèles IA.", color: theme.warning },
    { icon: "trending-up",title: "Contenu viral",     text: "Chaque outil produit du contenu prêt à poster, adapté à ta culture.", color: theme.secondary },
  ];

  const TECH = ["React Native 0.75", "Node.js / Express", "Hugging Face API", "Google Gemini", "Mistral AI", "7 compagnons IA"];

  useEffect(() => {
    Animated.spring(anim, { toValue: 1, tension: 55, friction: 8, useNativeDriver: true }).start();
  }, [anim]);

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} backgroundColor={theme.background} />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Animated.View style={{ opacity: anim, transform: [{ translateY: anim.interpolate({ inputRange: [0,1], outputRange: [-20,0] }) }] }}>

          {/* Hero */}
          <GlassCard style={[styles.hero, { backgroundColor: theme.secondaryLight, borderColor: `${theme.secondary}44` }]}>
            <View style={styles.heroTop}>
              <View style={{ flex: 1 }}>
                <View style={[styles.badge, { backgroundColor: theme.backgroundCard, borderColor: `${theme.secondary}33` }]}>
                  <Text style={[styles.badgeText, { color: theme.secondary }]}>À PROPOS · MANIFESTE</Text>
                </View>
                <Text style={[styles.title, { color: theme.textPrimary }]}>Viral <Text style={{ color: theme.secondary }}>Stick</Text></Text>
                <Text style={[styles.sub, { color: theme.textSecondary }]}>Un studio de création IA complet, pensé pour les créateurs de contenu africains et francophones.</Text>
              </View>
              <Image source={require("../../assets/logo/logo_sans_fond.png")} style={styles.logo} resizeMode="contain" />
            </View>
            <View style={{ alignItems: "center", marginTop: spacing.md }}>
              <CompanionAvatar companion="arch" size={88} floating message="Le produit doit être cohérent, mémorable et techniquement crédible." showRing={false} />
            </View>
          </GlassCard>

          {/* Piliers */}
          <GlassCard style={styles.card}>
            <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>Vision du produit</Text>
            {PILLARS.map((p) => (
              <View key={p.title} style={[styles.pillar, { backgroundColor: `${p.color}10`, borderColor: `${p.color}33` }]}>
                <AppIcon name={p.icon} color={p.color} size={22} />
                <View style={{ flex: 1 }}>
                  <Text style={[styles.pillarTitle, { color: p.color }]}>{p.title}</Text>
                  <Text style={[styles.pillarText, { color: theme.textSecondary }]}>{p.text}</Text>
                </View>
              </View>
            ))}
          </GlassCard>

          {/* Stack */}
          <GlassCard style={styles.card}>
            <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>Stack technique</Text>
            <View style={styles.techGrid}>
              {TECH.map((t) => (
                <View key={t} style={[styles.techItem, { backgroundColor: theme.backgroundSecondary, borderColor: theme.border }]}>
                  <AppIcon name="check" color={theme.secondary} size={14} />
                  <Text style={[styles.techLabel, { color: theme.textPrimary }]}>{t}</Text>
                </View>
              ))}
            </View>
          </GlassCard>

          {/* Équipe */}
          <GlassCard style={styles.card}>
            <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>Équipe</Text>
            {TEAM_MEMBERS.map((m) => (
              <View key={m.id} style={[styles.teamRow, { borderBottomColor: theme.border }]}>
                <CompanionAvatar companion={m.companion} size={56} />
                <View style={{ flex: 1 }}>
                  <Text style={[styles.teamName, { color: theme.textPrimary }]}>{m.name}</Text>
                  <Text style={[styles.teamRole, { color: theme.textSecondary }]}>{m.role}</Text>
                  <Text style={[styles.teamGithub, { color: theme.primary }]}>@{m.github}</Text>
                </View>
              </View>
            ))}
          </GlassCard>

          {/* Liens */}
          <GlassCard style={styles.card}>
            <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>Liens</Text>
            <AnimatedButton
              title="GitHub — KERNEL FORGE"
              onPress={() => Linking.openURL("https://github.com/KERNEL-FORGE-G/VIRAL-STICK")}
              variant="ghost" size="sm" style={{ marginBottom: spacing.sm }}
            />
            <AnimatedButton
              title="Documentation technique"
              onPress={() => Linking.openURL("https://github.com/KERNEL-FORGE-G/VIRAL-STICK/tree/main/docs")}
              variant="ghost" size="sm"
            />
          </GlassCard>

          <View style={styles.footer}>
            <Text style={[styles.footerMain, { color: theme.textMuted }]}>KERNEL FORGE — 2026</Text>
            <Text style={[styles.footerSub, { color: theme.textMuted }]}>Université de Yaoundé I · ICT202</Text>
          </View>

          <View style={{ height: 80 }} />
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe:        { flex: 1 },
  scroll:      { paddingHorizontal: spacing.md, paddingTop: spacing.md },
  hero:        { padding: spacing.lg, marginBottom: spacing.md },
  heroTop:     { flexDirection: "row", gap: spacing.md, alignItems: "center" },
  badge:       { borderRadius: radius.pill, paddingHorizontal: 10, paddingVertical: 4, alignSelf: "flex-start", marginBottom: 10, borderWidth: 1 },
  badgeText:   { fontSize: 10, fontWeight: "800", letterSpacing: 1 },
  title:       { fontSize: 32, fontWeight: "900", letterSpacing: -0.5 },
  sub:         { fontSize: 13, marginTop: 6, lineHeight: 19 },
  logo:        { width: 80, height: 80 },
  card:        { marginBottom: spacing.md },
  sectionTitle:{ fontSize: 18, fontWeight: "800", marginBottom: spacing.md },
  pillar:      { flexDirection: "row", alignItems: "flex-start", gap: 12, padding: 14, borderRadius: radius.md, borderWidth: 1, marginBottom: 8 },
  pillarTitle: { fontSize: 15, fontWeight: "800", marginBottom: 4 },
  pillarText:  { fontSize: 13, lineHeight: 18 },
  techGrid:    { gap: 8 },
  techItem:    { flexDirection: "row", alignItems: "center", gap: 10, padding: 12, borderRadius: radius.md, borderWidth: 1 },
  techLabel:   { fontSize: 14, fontWeight: "700" },
  teamRow:     { flexDirection: "row", alignItems: "center", gap: spacing.md, paddingVertical: spacing.sm, borderBottomWidth: 1, marginBottom: spacing.sm },
  teamName:    { fontSize: 16, fontWeight: "800" },
  teamRole:    { fontSize: 13, marginTop: 2 },
  teamGithub:  { fontSize: 13, fontWeight: "800", marginTop: 3 },
  footer:      { alignItems: "center", paddingVertical: spacing.xl, gap: 4 },
  footerMain:  { fontSize: 13, fontWeight: "800", letterSpacing: 1 },
  footerSub:   { fontSize: 11 },
});

export default AboutScreen;
