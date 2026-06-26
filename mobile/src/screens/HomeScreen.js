import React, { useRef, useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Animated, SafeAreaView, StatusBar, Image, Dimensions } from "react-native";
import { useTheme, spacing, radius, typography } from "../theme";
import GlassCard from "../components/GlassCard";
import AnimatedButton from "../components/AnimatedButton";
import CompanionAvatar from "../components/CompanionAvatar";
import { colors } from "../theme/tokens";

const { width } = Dimensions.get("window");

const MODULES = [
  { key: "ContextReader", title: "Context Reader", subtitle: "Texte → mème culturel adapté", icon: "📖", color: colors.art },
  { key: "VoiceToMeme",  title: "Voice → Mème",   subtitle: "Parole spontanée → punchline", icon: "🎙️", color: colors.duoGreen },
  { key: "StatusRemixer",title: "Status Remixer",  subtitle: "Visuel ou status → remix viral",icon: "🎨", color: colors.bio },
  { key: "StickerStudio",title: "Sticker Studio",  subtitle: "Face swap + export PNG/GIF",    icon: "🧩", color: colors.art },
];

const COMPANIONS = ["bio", "ubu", "art"];
const MESSAGES   = [
  "Le studio est prêt. On crée quelque chose de viral ?",
  "Un bon angle, une bonne image : voilà la méthode.",
  "Tes mèmes méritent une identité forte.",
];

const HomeScreen = ({ navigate }) => {
  const [companionIdx, setCompanionIdx] = useState(0);
  const headerY  = useRef(new Animated.Value(-30)).current;
  const headerOp = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(headerY, { toValue: 0, tension: 60, friction: 8, useNativeDriver: true }),
      Animated.timing(headerOp, { toValue: 1, duration: 600, useNativeDriver: true }),
    ]).start();
    const t = setInterval(() => setCompanionIdx((i) => (i + 1) % 3), 4500);
    return () => clearInterval(t);
  }, []);

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* Hero */}
        <Animated.View style={{ opacity: headerOp, transform: [{ translateY: headerY }] }}>
          <GlassCard animate style={styles.hero}>
            <View style={styles.heroTop}>
              <View style={{ flex: 1 }}>
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>STUDIO IA MULTIMODAL</Text>
                </View>
                <Text style={styles.heroTitle}>
                  Viral {"\n"}<Text style={{ color: colors.duoGreen }}>Stick</Text>
                </Text>
                <Text style={styles.heroSub}>Crée du contenu viral avec tes compagnons IA.</Text>
              </View>
              <Image source={require("../../assets/logo/logo_sans_fond.png")} style={styles.logo} resizeMode="contain" />
            </View>
            <View style={styles.heroBottom}>
              <CompanionAvatar companion={COMPANIONS[companionIdx]} size={96} floating message={MESSAGES[companionIdx]} />
            </View>
          </GlassCard>
        </Animated.View>

        {/* Modules */}
        <Text style={styles.section}>MODULES</Text>
        {MODULES.map((m, i) => (
          <GlassCard key={m.key} animate delay={100 + i * 80} style={styles.moduleCard}>
            <TouchableOpacity onPress={() => navigate?.(m.key)} activeOpacity={0.8} style={styles.moduleInner}>
              <View style={[styles.iconBadge, { backgroundColor: `${m.color}18`, borderColor: `${m.color}44` }]}>
                <Text style={styles.moduleIcon}>{m.icon}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.moduleName}>{m.title}</Text>
                <Text style={styles.moduleSub}>{m.subtitle}</Text>
              </View>
              <Text style={[styles.arrow, { color: m.color }]}>›</Text>
            </TouchableOpacity>
          </GlassCard>
        ))}

        {/* CTA */}
        <GlassCard animate delay={400} style={[styles.cta, { backgroundColor: colors.duoGreenLight, borderColor: `${colors.duoGreen}44` }]}>
          <Text style={styles.ctaTitle}>Prêt à créer du contenu viral ? 🚀</Text>
          <AnimatedButton title="Commencer avec Context Reader" onPress={() => navigate?.("ContextReader")} size="lg" style={{ marginTop: spacing.md }} />
        </GlassCard>

        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe:       { flex: 1, backgroundColor: "#ffffff" },
  scroll:     { paddingHorizontal: spacing.md, paddingTop: 80 },
  hero:       { padding: spacing.lg, marginBottom: spacing.lg },
  heroTop:    { flexDirection: "row", gap: spacing.md, alignItems: "center" },
  heroBottom: { marginTop: spacing.md, alignItems: "center" },
  badge:      { backgroundColor: colors.duoGreenLight, borderRadius: radius.pill, paddingHorizontal: 10, paddingVertical: 4, alignSelf: "flex-start", marginBottom: 8 },
  badgeText:  { fontSize: 10, fontWeight: "800", color: colors.duoGreenDark, letterSpacing: 1 },
  heroTitle:  { fontSize: 36, fontWeight: "900", color: colors.almostBlack, letterSpacing: -1, lineHeight: 40 },
  heroSub:    { fontSize: 14, color: colors.graphite, marginTop: 6, lineHeight: 20 },
  logo:       { width: 90, height: 90 },
  section:    { fontSize: 11, fontWeight: "800", color: colors.silver, letterSpacing: 2, marginBottom: spacing.sm },
  moduleCard: { marginBottom: spacing.sm, padding: 0 },
  moduleInner:{ flexDirection: "row", alignItems: "center", padding: spacing.md, gap: spacing.md },
  iconBadge:  { width: 52, height: 52, borderRadius: radius.md, borderWidth: 2, alignItems: "center", justifyContent: "center" },
  moduleIcon: { fontSize: 24 },
  moduleName: { fontSize: 16, fontWeight: "800", color: colors.almostBlack },
  moduleSub:  { fontSize: 13, color: colors.graphite, marginTop: 3 },
  arrow:      { fontSize: 28, fontWeight: "300" },
  cta:        { padding: spacing.lg, marginTop: spacing.md },
  ctaTitle:   { fontSize: 18, fontWeight: "800", color: colors.almostBlack, textAlign: "center" },
});

export default HomeScreen;
