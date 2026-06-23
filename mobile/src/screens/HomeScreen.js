/**
 * HomeScreen — Main dashboard
 * Viral Stick | KERNEL FORGE — 2026
 *
 * Companions: bio, ubu, art (les 3 artistes)
 */

import React, { useRef, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  Dimensions,
  SafeAreaView,
  StatusBar,
  Image,
} from "react-native";
import { useTheme, spacing, radius, typography, createShadow } from "../theme";
import GlassCard from "../components/GlassCard";
import AnimatedButton from "../components/AnimatedButton";
import CompanionAvatar from "../components/CompanionAvatar";

const { width } = Dimensions.get("window");

const MODULES = [
  {
    key: "ContextReader",
    title: "Context Reader",
    subtitle: "Analyse un texte et génère un mème IA",
    icon: "📖",
    gradient: ["#7C3AED", "#3B82F6"],
    companion: "art",
  },
  {
    key: "VoiceToMeme",
    title: "Voice → Mème",
    subtitle: "Parle, ton mème se génère automatiquement",
    icon: "🎙️",
    gradient: ["#06B6D4", "#7C3AED"],
    companion: "ubu",
  },
  {
    key: "StatusRemixer",
    title: "Status Remixer",
    subtitle: "Remixe tes images en stickers viraux",
    icon: "🎨",
    gradient: ["#F59E0B", "#EF4444"],
    companion: "bio",
  },
];

const COMPANION_MESSAGES = [
  "Salut ! Je suis Bio 🌿 Prêt à créer quelque chose de viral ?",
  "Ubu ici ! 🤖 Dis-moi un truc drôle, je le transforme en mème !",
  "Art au micro 🎨 Tes idées méritent d'être immortalisées !",
  "La créativité n'a pas de limites ici 🚀",
];

const HomeScreen = ({ navigate }) => {
  const { theme } = useTheme();
  const headerAnim = useRef(new Animated.Value(-60)).current;
  const headerOpacity = useRef(new Animated.Value(0)).current;
  const [currentCompanion, setCurrentCompanion] = useState(0);
  const [msgIndex, setMsgIndex] = useState(0);

  useEffect(() => {
    Animated.parallel([
      Animated.spring(headerAnim, {
        toValue: 0,
        tension: 60,
        friction: 8,
        useNativeDriver: true,
      }),
      Animated.timing(headerOpacity, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();

    // Rotate companions every 6 seconds
    const interval = setInterval(() => {
      setCurrentCompanion((c) => (c + 1) % 3);
      setMsgIndex((m) => (m + 1) % COMPANION_MESSAGES.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const companions = ["bio", "ubu", "art"];
  const currentKey = companions[currentCompanion];

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]}>
      <StatusBar barStyle="light-content" translucent />
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Header ──────────────────────────────────────────── */}
        <Animated.View
          style={[
            styles.header,
            { opacity: headerOpacity, transform: [{ translateY: headerAnim }] },
          ]}
        >
          <View>
            <Text style={[styles.greeting, { color: theme.textMuted }]}>
              Bienvenue sur
            </Text>
            <Text style={[styles.title, { color: theme.textPrimary }]}>
              Viral <Text style={{ color: theme.textAccent }}>Stick</Text>
            </Text>
            <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
              Générateur IA Multimodal
            </Text>
          </View>
          <Image
            source={require("../../assets/logo/logo_sans_fond.png")}
            style={styles.logo}
            resizeMode="contain"
          />
        </Animated.View>

        {/* ── Companion Banner ─────────────────────────────────── */}
        <GlassCard animate style={styles.companionCard} delay={100}>
          <CompanionAvatar
            companion={currentKey}
            size={90}
            floating
            message={COMPANION_MESSAGES[msgIndex]}
          />
        </GlassCard>

        {/* ── Module Cards ─────────────────────────────────────── */}
        <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>
          🚀 MODULES PRINCIPAUX
        </Text>

        {MODULES.map((mod, i) => (
          <GlassCard
            key={mod.key}
            animate
            delay={200 + i * 100}
            style={styles.moduleCard}
          >
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => navigate && navigate(mod.key)}
              style={styles.moduleInner}
            >
              {/* Icon badge */}
              <View
                style={[
                  styles.iconBadge,
                  {
                    backgroundColor: `${theme.primary}22`,
                    borderColor: theme.border,
                  },
                ]}
              >
                <Text style={styles.moduleIcon}>{mod.icon}</Text>
              </View>

              <View style={styles.moduleText}>
                <Text style={[styles.moduleName, { color: theme.textPrimary }]}>
                  {mod.title}
                </Text>
                <Text
                  style={[
                    styles.moduleSubtitle,
                    { color: theme.textSecondary },
                  ]}
                >
                  {mod.subtitle}
                </Text>
              </View>

              <Text style={[styles.arrow, { color: theme.primary }]}>›</Text>
            </TouchableOpacity>
          </GlassCard>
        ))}

        {/* ── Quick Stats ──────────────────────────────────────── */}
        <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>
          📊 STATISTIQUES
        </Text>
        <GlassCard animate delay={600} style={styles.statsRow}>
          {[
            { label: "Mèmes générés", value: "0", icon: "🔥" },
            { label: "Stickers crées", value: "0", icon: "✨" },
            { label: "Partages", value: "0", icon: "📤" },
          ].map((stat, i) => (
            <View key={i} style={styles.statItem}>
              <Text style={styles.statIcon}>{stat.icon}</Text>
              <Text style={[styles.statValue, { color: theme.primaryLight }]}>
                {stat.value}
              </Text>
              <Text style={[styles.statLabel, { color: theme.textMuted }]}>
                {stat.label}
              </Text>
            </View>
          ))}
        </GlassCard>

        {/* ── CTA ──────────────────────────────────────────────── */}
        <GlassCard animate delay={700} style={{ marginTop: spacing.md }}>
          <Text style={[styles.ctaTitle, { color: theme.textPrimary }]}>
            Prêt à créer du contenu viral ? 🚀
          </Text>
          <AnimatedButton
            title="Commencer maintenant"
            onPress={() => navigate && navigate("ContextReader")}
            size="lg"
            style={{ marginTop: spacing.md }}
          />
        </GlassCard>

        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1 },
  scroll: {
    paddingHorizontal: spacing.md,
    paddingTop: 80,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.lg,
  },
  greeting: {
    fontSize: typography.fontSize.sm,
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  title: {
    fontSize: typography.fontSize.xxxl,
    fontWeight: "900",
    letterSpacing: -1,
  },
  subtitle: {
    fontSize: typography.fontSize.sm,
    marginTop: 2,
  },
  logo: {
    width: 192,
    height: 192,
  },
  companionCard: {
    marginBottom: spacing.lg,
    alignItems: "center",
    paddingVertical: spacing.lg,
  },
  sectionTitle: {
    fontSize: typography.fontSize.xs,
    fontWeight: "700",
    letterSpacing: 2,
    textTransform: "uppercase",
    marginBottom: spacing.sm,
    marginTop: spacing.md,
  },
  moduleCard: {
    marginBottom: spacing.sm,
    padding: 0,
    overflow: "hidden",
  },
  moduleInner: {
    flexDirection: "row",
    alignItems: "center",
    padding: spacing.md,
    gap: spacing.md,
  },
  iconBadge: {
    width: 52,
    height: 52,
    borderRadius: radius.md,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  moduleIcon: {
    fontSize: 26,
  },
  moduleText: {
    flex: 1,
  },
  moduleName: {
    fontSize: typography.fontSize.md,
    fontWeight: "700",
  },
  moduleSubtitle: {
    fontSize: typography.fontSize.xs,
    marginTop: 2,
  },
  arrow: {
    fontSize: 28,
    fontWeight: "300",
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  statItem: {
    alignItems: "center",
    gap: 4,
  },
  statIcon: { fontSize: 22 },
  statValue: {
    fontSize: typography.fontSize.xxl,
    fontWeight: "800",
  },
  statLabel: {
    fontSize: typography.fontSize.xs,
    textAlign: "center",
  },
  ctaTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: "700",
    textAlign: "center",
  },
});

export default HomeScreen;
