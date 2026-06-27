import React, { useRef, useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Animated, SafeAreaView, StatusBar, Image } from "react-native";
import { useTheme, spacing, radius } from "../theme";
import GlassCard from "../components/GlassCard";
import AccentCard from "../components/AccentCard";
import AnimatedButton from "../components/AnimatedButton";
import CompanionAvatar from "../components/CompanionAvatar";
import AppIcon from "../components/AppIcon";

const COMPANIONS = ["bio", "ubu", "art"];
const MESSAGES   = [
  "Le studio est prêt. On crée quelque chose de viral ?",
  "Un bon angle, une bonne image : voilà la méthode.",
  "Tes mèmes méritent une identité forte.",
];

const HomeScreen = ({ navigate }) => {
  const { theme, isDark } = useTheme();
  const [companionIdx, setCompanionIdx] = useState(0);
  const headerY  = useRef(new Animated.Value(-30)).current;
  const headerOp = useRef(new Animated.Value(0)).current;

  const MODULES = [
    { key: "ContextReader", title: "Context Reader", subtitle: "Texte → mème culturel", icon: "book",   color: theme.warning },
    { key: "VoiceToMeme",   title: "Voice → Mème",   subtitle: "Parole spontanée",       icon: "mic",    color: theme.secondary },
    { key: "StatusRemixer", title: "Status Remixer",  subtitle: "Visuel ou status",       icon: "image",  color: theme.primary },
    { key: "Forum",         title: "Forum Viral",     subtitle: "Flux communautaire",     icon: "globe",  color: theme.success },
  ];

  useEffect(() => {
    Animated.parallel([
      Animated.spring(headerY, { toValue: 0, tension: 60, friction: 8, useNativeDriver: true }),
      Animated.timing(headerOp, { toValue: 1, duration: 600, useNativeDriver: true }),
    ]).start();
    const t = setInterval(() => setCompanionIdx((i) => (i + 1) % 3), 4500);
    return () => clearInterval(t);
  }, []);

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} backgroundColor={theme.background} />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* Hero */}
        <Animated.View style={{ opacity: headerOp, transform: [{ translateY: headerY }] }}>
          <GlassCard style={styles.hero}>
            <View style={styles.heroTop}>
              <View style={{ flex: 1 }}>
                <View style={[styles.badge, { backgroundColor: theme.primaryLight }]}>
                  <Text style={[styles.badgeText, { color: theme.primary }]}>STUDIO IA</Text>
                </View>
                <Text style={[styles.heroTitle, { color: theme.textPrimary }]}>
                  Crée du contenu {"\n"}<Text style={{ color: theme.primary, fontStyle: 'italic' }}>viral.</Text>
                </Text>
                <Text style={[styles.heroSub, { color: theme.textSecondary }]}>Avec tes compagnons IA.</Text>
              </View>
              <Image source={require("../../assets/logo/logo_sans_fond.png")} style={styles.logo} resizeMode="contain" />
            </View>
            <View style={styles.heroBottom}>
              <CompanionAvatar companion={COMPANIONS[companionIdx]} size={96} floating message={MESSAGES[companionIdx]} showRing={false} />
            </View>
          </GlassCard>
        </Animated.View>

        {/* Modules */}
        <Text style={[styles.section, { color: theme.textMuted }]}>— MODULES —</Text>
        {MODULES.map((m, i) => (
          <AccentCard key={m.key} animate delay={100 + i * 80} style={styles.moduleCard} accentColor={m.color}>
            <TouchableOpacity onPress={() => navigate?.(m.key)} activeOpacity={0.8} style={styles.moduleInner}>
              <AppIcon name={m.icon} color={theme.textPrimary} size={24} />
              <View style={{ flex: 1 }}>
                <Text style={[styles.moduleName, { color: theme.textPrimary }]}>{m.title}</Text>
                <Text style={[styles.moduleSub, { color: theme.textSecondary }]}>{m.subtitle}</Text>
              </View>
              <AppIcon name="chevron-right" color={theme.textMuted} size={18} />
            </TouchableOpacity>
          </AccentCard>
        ))}

        {/* CTA */}
        <View style={{ marginTop: spacing.xl, marginBottom: 120 }}>
          <AnimatedButton title="Commencer avec Context Reader" onPress={() => navigate?.("ContextReader")} size="lg" />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe:       { flex: 1 },
  scroll:     { paddingHorizontal: spacing.md, paddingTop: spacing.md },
  hero:       { padding: spacing.lg, marginBottom: spacing.lg },
  heroTop:    { flexDirection: "row", gap: spacing.md, alignItems: "center" },
  heroBottom: { marginTop: spacing.md, alignItems: "center" },
  badge:      { borderRadius: radius.pill, paddingHorizontal: 12, paddingVertical: 6, alignSelf: "flex-start", marginBottom: 12 },
  badgeText:  { fontSize: 10, fontWeight: "800", letterSpacing: 1 },
  heroTitle:  { fontSize: 38, fontWeight: "800", letterSpacing: -1, lineHeight: 44 },
  heroSub:    { fontSize: 15, marginTop: 10, lineHeight: 22 },
  logo:       { width: 70, height: 70, opacity: 0.8 },
  section:    { fontSize: 11, fontWeight: "700", letterSpacing: 2, marginBottom: spacing.md, textAlign: "center" },
  moduleCard: { marginBottom: spacing.md, padding: 0 },
  moduleInner:{ flexDirection: "row", alignItems: "center", paddingVertical: spacing.lg, paddingHorizontal: spacing.md, gap: spacing.md },
  moduleName: { fontSize: 17, fontWeight: "700" },
  moduleSub:  { fontSize: 13, marginTop: 4 },
});

export default HomeScreen;
