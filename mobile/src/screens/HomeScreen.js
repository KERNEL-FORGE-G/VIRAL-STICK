import React, { useRef, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  SafeAreaView,
  StatusBar,
  Image,
} from "react-native";
import { useTheme, spacing, radius, typography, createShadow } from "../theme";
import GlassCard from "../components/GlassCard";
import AnimatedButton from "../components/AnimatedButton";
import CompanionAvatar from "../components/CompanionAvatar";

const MODULES = [
  {
    key: "ContextReader",
    title: "Context Reader",
    subtitle: "Transforme une situation écrite en mème plus net et plus drôle",
    icon: "📖",
    accent: "#FB923C",
  },
  {
    key: "VoiceToMeme",
    title: "Voice → Mème",
    subtitle: "Convertit une idée parlée en punchline mémorable",
    icon: "🎙️",
    accent: "#84CC16",
  },
  {
    key: "StatusRemixer",
    title: "Status Remixer",
    subtitle: "Remixe un visuel, un status ou une idée de sticker",
    icon: "🎨",
    accent: "#A855F7",
  },
];

const COMPANION_MESSAGES = [
  "Le noyau créatif est prêt. On fabrique quelque chose de viral ?",
  "Une bonne idée, un bon angle, un bon visuel : voilà la méthode.",
  "Tes mèmes méritent une identité plus forte que du texte posé au hasard.",
];

const HomeScreen = ({ navigate }) => {
  const { theme } = useTheme();
  const headerAnim = useRef(new Animated.Value(-40)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const [currentCompanion, setCurrentCompanion] = useState(0);

  useEffect(() => {
    Animated.parallel([
      Animated.spring(headerAnim, {
        toValue: 0,
        tension: 60,
        friction: 8,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 650,
        useNativeDriver: true,
      }),
    ]).start();

    const interval = setInterval(() => {
      setCurrentCompanion((c) => (c + 1) % 3);
    }, 4500);
    return () => clearInterval(interval);
  }, [headerAnim, opacityAnim]);

  const companions = ["bio", "ubu", "art"];
  const companion = companions[currentCompanion];

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]}>
      <StatusBar barStyle="light-content" translucent />
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View
          style={{
            opacity: opacityAnim,
            transform: [{ translateY: headerAnim }],
          }}
        >
          <GlassCard animate style={styles.heroCard}>
            <View style={styles.heroTop}>
              <View style={{ flex: 1 }}>
                <Text style={[styles.tag, { color: theme.textMuted }]}>
                  STUDIO DE GÉNÉRATION & ÉDITION
                </Text>
                <Text style={[styles.title, { color: theme.textPrimary }]}>
                  Viral <Text style={{ color: theme.primaryLight }}>Stick</Text>
                </Text>
                <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
                  Le logo devient le noyau du produit mobile, et les compagnons
                  structurent toute l’expérience créative.
                </Text>
              </View>
              <View style={styles.logoShell}>
                <Image
                  source={require("../../assets/logo/logo_sans_fond.png")}
                  style={styles.logo}
                  resizeMode="contain"
                />
              </View>
            </View>

            <View style={styles.heroBottom}>
              <CompanionAvatar
                companion={companion}
                size={104}
                floating
                message={COMPANION_MESSAGES[currentCompanion]}
              />
            </View>
          </GlassCard>
        </Animated.View>

        <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>
          MODULES PRINCIPAUX
        </Text>
        {MODULES.map((mod, i) => (
          <GlassCard
            key={mod.key}
            animate
            delay={120 + i * 90}
            style={styles.moduleCard}
          >
            <TouchableOpacity
              onPress={() => navigate && navigate(mod.key)}
              activeOpacity={0.85}
              style={styles.moduleInner}
            >
              <View
                style={[
                  styles.iconBadge,
                  {
                    backgroundColor: `${mod.accent}22`,
                    borderColor: `${mod.accent}88`,
                  },
                ]}
              >
                <Text style={styles.moduleIcon}>{mod.icon}</Text>
              </View>
              <View style={{ flex: 1 }}>
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
              <Text style={[styles.arrow, { color: mod.accent }]}>›</Text>
            </TouchableOpacity>
          </GlassCard>
        ))}

        <GlassCard animate delay={420} style={styles.ctaCard}>
          <Text style={[styles.ctaTitle, { color: theme.textPrimary }]}>
            Prêt à transformer une idée brute en contenu viral ?
          </Text>
          <AnimatedButton
            title="Commencer avec Context Reader"
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
  scroll: { paddingHorizontal: spacing.md, paddingTop: 82 },
  heroCard: { padding: spacing.lg, marginBottom: spacing.lg },
  heroTop: { flexDirection: "row", gap: spacing.md, alignItems: "center" },
  heroBottom: { marginTop: spacing.md, alignItems: "center" },
  logoShell: {
    width: 170,
    height: 170,
    justifyContent: "center",
    alignItems: "center",
  },
  logo: { width: 164, height: 164 },
  tag: {
    fontSize: typography.fontSize.xs,
    fontWeight: "800",
    letterSpacing: 2,
  },
  title: {
    fontSize: typography.fontSize.xxxl,
    fontWeight: "900",
    letterSpacing: -1,
  },
  subtitle: { fontSize: typography.fontSize.sm, lineHeight: 22, marginTop: 8 },
  sectionTitle: {
    fontSize: typography.fontSize.xs,
    fontWeight: "800",
    letterSpacing: 2,
    textTransform: "uppercase",
    marginBottom: spacing.sm,
  },
  moduleCard: { marginBottom: spacing.sm, padding: 0, overflow: "hidden" },
  moduleInner: {
    flexDirection: "row",
    alignItems: "center",
    padding: spacing.md,
    gap: spacing.md,
  },
  iconBadge: {
    width: 56,
    height: 56,
    borderRadius: radius.md,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  moduleIcon: { fontSize: 28 },
  moduleName: { fontSize: typography.fontSize.md, fontWeight: "800" },
  moduleSubtitle: {
    fontSize: typography.fontSize.xs,
    marginTop: 4,
    lineHeight: 18,
  },
  arrow: { fontSize: 30, fontWeight: "300" },
  ctaCard: { marginTop: spacing.md },
  ctaTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: "800",
    textAlign: "center",
  },
});

export default HomeScreen;
