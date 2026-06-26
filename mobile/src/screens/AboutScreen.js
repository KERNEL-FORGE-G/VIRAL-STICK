
import React, { useRef, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, SafeAreaView, Animated, Linking, Image, StatusBar } from "react-native";
import { spacing, radius } from "../theme";
import { colors } from "../theme/tokens";
import GlassCard from "../components/GlassCard";
import AnimatedButton from "../components/AnimatedButton";
import CompanionAvatar from "../components/CompanionAvatar";

const PILLARS = [
  { emoji: "🎨", title: "Identité créative", text: "7 compagnons IA uniques avec personnalités et rôles distincts.", color: colors.art },
  { emoji: "🧠", title: "IA multimodale",    text: "Texte, voix, image — trois canaux vers les meilleurs modèles IA.", color: colors.data },
  { emoji: "🚀", title: "Contenu viral",     text: "Chaque outil produit du contenu prêt à poster, adapté à ta culture.", color: colors.duoGreen },
];

const TECH = ["React Native 0.75", "Node.js / Express", "Hugging Face API", "Google Gemini", "Mistral AI", "7 compagnons IA"];

const TEAM = [
  { name: "Ravel", role: "Lead Technique", companion: "arch", github: "@Archlord12345" },
  { name: "Kernel Forge", role: "Équipe de développement", companion: "data", github: "#KERNELFORGE" },
];

const AboutScreen = () => {
  const anim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.spring(anim, { toValue: 1, tension: 55, friction: 8, useNativeDriver: true }).start();
  }, [anim]);

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Animated.View style={{ opacity: anim, transform: [{ translateY: anim.interpolate({ inputRange: [0,1], outputRange: [-20,0] }) }] }}>

          {/* Hero */}
          <GlassCard animate style={[styles.hero, { backgroundColor: colors.duoGreenLight, borderColor: `${colors.duoGreen}44` }]}>
            <View style={styles.heroTop}>
              <View style={{ flex: 1 }}>
                <View style={styles.badge}><Text style={styles.badgeText}>À PROPOS · MANIFESTE</Text></View>
                <Text style={styles.title}>Viral <Text style={{ color: colors.duoGreen }}>Stick</Text></Text>
                <Text style={styles.sub}>Un studio de création IA complet, pensé pour les créateurs de contenu africains et francophones.</Text>
              </View>
              <Image source={require("../../assets/logo/logo_sans_fond.png")} style={styles.logo} resizeMode="contain" />
            </View>
            <View style={{ alignItems: "center", marginTop: spacing.md }}>
              <CompanionAvatar companion="arch" size={88} floating message="Le produit doit être cohérent, mémorable et techniquement crédible." />
            </View>
          </GlassCard>

          {/* Piliers */}
          <GlassCard animate delay={100} style={styles.card}>
            <Text style={styles.sectionTitle}>🧩 Vision du produit</Text>
            {PILLARS.map((p) => (
              <View key={p.title} style={[styles.pillar, { backgroundColor: `${p.color}10`, borderColor: `${p.color}33` }]}>
                <Text style={styles.pillarEmoji}>{p.emoji}</Text>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.pillarTitle, { color: p.color }]}>{p.title}</Text>
                  <Text style={styles.pillarText}>{p.text}</Text>
                </View>
              </View>
            ))}
          </GlassCard>

          {/* Stack */}
          <GlassCard animate delay={180} style={styles.card}>
            <Text style={styles.sectionTitle}>🔧 Stack technique</Text>
            <View style={styles.techGrid}>
              {TECH.map((t) => (
                <View key={t} style={styles.techItem}>
                  <Text style={styles.techCheck}>✅</Text>
                  <Text style={styles.techLabel}>{t}</Text>
                </View>
              ))}
            </View>
          </GlassCard>

          {/* Équipe */}
          <GlassCard animate delay={260} style={styles.card}>
            <Text style={styles.sectionTitle}>👥 Équipe</Text>
            {TEAM.map((m) => (
              <View key={m.name} style={styles.teamRow}>
                <CompanionAvatar companion={m.companion} size={56} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.teamName}>{m.name}</Text>
                  <Text style={styles.teamRole}>{m.role}</Text>
                  <Text style={[styles.teamGithub, { color: colors.skyBlue }]}>{m.github}</Text>
                </View>
              </View>
            ))}
          </GlassCard>

          {/* Liens */}
          <GlassCard animate delay={340} style={styles.card}>
            <Text style={styles.sectionTitle}>🔗 Liens</Text>
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
            <Text style={styles.footerMain}>KERNEL FORGE — 2026</Text>
            <Text style={styles.footerSub}>Université de Yaoundé I · ICT202</Text>
          </View>

          <View style={{ height: 80 }} />
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe:        { flex: 1, backgroundColor: "#ffffff" },
  scroll:      { paddingHorizontal: spacing.md, paddingTop: 80 },
  hero:        { padding: spacing.lg, marginBottom: spacing.md },
  heroTop:     { flexDirection: "row", gap: spacing.md, alignItems: "center" },
  badge:       { backgroundColor: colors.snowWhite, borderRadius: radius.pill, paddingHorizontal: 10, paddingVertical: 4, alignSelf: "flex-start", marginBottom: 10, borderWidth: 1, borderColor: `${colors.duoGreen}33` },
  badgeText:   { fontSize: 10, fontWeight: "800", color: colors.duoGreenDark, letterSpacing: 1 },
  title:       { fontSize: 32, fontWeight: "900", color: colors.almostBlack, letterSpacing: -0.5 },
  sub:         { fontSize: 13, color: colors.charcoal, marginTop: 6, lineHeight: 19 },
  logo:        { width: 80, height: 80 },
  card:        { marginBottom: spacing.md },
  sectionTitle:{ fontSize: 18, fontWeight: "800", color: colors.almostBlack, marginBottom: spacing.md },
  pillar:      { flexDirection: "row", alignItems: "flex-start", gap: 12, padding: 14, borderRadius: radius.md, borderWidth: 2, marginBottom: 8 },
  pillarEmoji: { fontSize: 22, marginTop: 1 },
  pillarTitle: { fontSize: 15, fontWeight: "800", marginBottom: 4 },
  pillarText:  { fontSize: 13, color: colors.graphite, lineHeight: 18 },
  techGrid:    { gap: 8 },
  techItem:    { flexDirection: "row", alignItems: "center", gap: 10, padding: 12, backgroundColor: colors.bgSecondary, borderRadius: radius.md, borderWidth: 2, borderColor: colors.cloudGray },
  techCheck:   { fontSize: 14 },
  techLabel:   { fontSize: 14, fontWeight: "700", color: colors.charcoal },
  teamRow:     { flexDirection: "row", alignItems: "center", gap: spacing.md, paddingVertical: spacing.sm, borderBottomWidth: 2, borderBottomColor: colors.cloudGray, marginBottom: spacing.sm },
  teamName:    { fontSize: 16, fontWeight: "800", color: colors.almostBlack },
  teamRole:    { fontSize: 13, color: colors.silver, marginTop: 2 },
  teamGithub:  { fontSize: 13, fontWeight: "800", marginTop: 3 },
  footer:      { alignItems: "center", paddingVertical: spacing.xl, gap: 4 },
  footerMain:  { fontSize: 13, fontWeight: "800", color: colors.silver, letterSpacing: 1 },
  footerSub:   { fontSize: 11, color: colors.silver },
});

export default AboutScreen;
