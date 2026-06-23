import React, { useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Animated,
  Linking,
  Image,
} from "react-native";
import { useTheme, spacing, radius, typography, createShadow } from "../theme";
import GlassCard from "../components/GlassCard";
import AnimatedButton from "../components/AnimatedButton";
import CompanionAvatar from "../components/CompanionAvatar";

const TEAM = [
  {
    name: "NGHOMSI FEUKOUO Ravel",
    role: "Lead Technique & Fullstack",
    github: "@Archlord12345",
    companion: "arch",
  },
  {
    name: "KERNEL FORGE",
    role: "Équipe de développement",
    github: "#KERNELFORGE",
    companion: "data",
  },
];

const AboutScreen = () => {
  const { theme } = useTheme();
  const introAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(introAnim, {
      toValue: 1,
      tension: 55,
      friction: 8,
      useNativeDriver: true,
    }).start();
  }, [introAnim]);

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View
          style={{
            opacity: introAnim,
            transform: [
              {
                translateY: introAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [-24, 0],
                }),
              },
            ],
          }}
        >
          <GlassCard animate style={styles.heroCard}>
            <View style={styles.heroTop}>
              <View style={{ flex: 1 }}>
                <Text style={[styles.screenTag, { color: theme.textMuted }]}>
                  À PROPOS · MANIFESTE PRODUIT
                </Text>
                <Text style={[styles.title, { color: theme.textPrimary }]}>
                  Viral <Text style={{ color: theme.primaryLight }}>Stick</Text>
                </Text>
                <Text
                  style={[styles.aboutText, { color: theme.textSecondary }]}
                >
                  Une application pensée comme un studio professionnel de
                  génération et d’édition de mèmes texte + image, avec une
                  identité visuelle forte, des compagnons incarnés et une
                  orchestration IA plus sérieuse.
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
            <View style={{ marginTop: spacing.md, alignItems: "center" }}>
              <CompanionAvatar
                companion="arch"
                size={120}
                floating
                message="Le produit doit être cohérent, mémorable et techniquement crédible."
              />
            </View>
          </GlassCard>

          <GlassCard animate delay={120} style={{ marginTop: spacing.md }}>
            <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>
              🧩 Vision du produit
            </Text>
            {[
              "Génération de mèmes texte plus structurée et plus drôle",
              "Remix visuel et préparation d’un vrai pipeline image",
              "Compagnons intégrés à l’UX comme système d’incarnation produit",
            ].map((item) => (
              <Text
                key={item}
                style={[styles.bullet, { color: theme.textSecondary }]}
              >
                • {item}
              </Text>
            ))}
          </GlassCard>

          <GlassCard animate delay={220} style={{ marginTop: spacing.md }}>
            <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>
              👥 Équipe
            </Text>
            {TEAM.map((member, i) => (
              <View key={i} style={styles.teamRow}>
                <CompanionAvatar companion={member.companion} size={64} />
                <View style={{ flex: 1 }}>
                  <Text style={[styles.teamName, { color: theme.textPrimary }]}>
                    {member.name}
                  </Text>
                  <Text
                    style={[styles.teamRole, { color: theme.textSecondary }]}
                  >
                    {member.role}
                  </Text>
                  <Text
                    style={[styles.teamGithub, { color: theme.primaryLight }]}
                  >
                    {member.github}
                  </Text>
                </View>
              </View>
            ))}
          </GlassCard>

          <GlassCard animate delay={320} style={{ marginTop: spacing.md }}>
            <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>
              🔗 Liens
            </Text>
            <AnimatedButton
              title="GitHub — KERNEL FORGE"
              onPress={() =>
                Linking.openURL("https://github.com/KERNEL-FORGE-G/VIRAL-STICK")
              }
              variant="ghost"
              size="sm"
              style={{ marginBottom: spacing.sm }}
            />
            <AnimatedButton
              title="Documentation technique"
              onPress={() =>
                Linking.openURL(
                  "https://github.com/KERNEL-FORGE-G/VIRAL-STICK/tree/main/docs",
                )
              }
              variant="ghost"
              size="sm"
            />
          </GlassCard>

          <View style={styles.footer}>
            <Text style={[styles.footerText, { color: theme.textMuted }]}>
              KERNEL FORGE — 2026
            </Text>
            <Text style={[styles.footerSub, { color: theme.textMuted }]}>
              Université de Yaoundé I — ICT202
            </Text>
          </View>

          <View style={{ height: 80 }} />
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1 },
  scroll: { paddingHorizontal: spacing.md, paddingTop: 82 },
  heroCard: { padding: spacing.lg },
  heroTop: { flexDirection: "row", gap: spacing.md, alignItems: "center" },
  logoShell: {
    width: 180,
    height: 180,
    borderRadius: 34,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.06)",
    ...createShadow("#7C3AED", 20),
  },
  logo: { width: 145, height: 145 },
  screenTag: {
    fontSize: typography.fontSize.xs,
    fontWeight: "800",
    letterSpacing: 2,
  },
  title: {
    fontSize: typography.fontSize.xxxl,
    fontWeight: "900",
    letterSpacing: -1,
  },
  aboutText: { fontSize: typography.fontSize.sm, lineHeight: 22, marginTop: 8 },
  sectionTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: "800",
    marginBottom: spacing.md,
  },
  bullet: { fontSize: typography.fontSize.sm, lineHeight: 22, marginBottom: 8 },
  teamRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    paddingVertical: spacing.sm,
  },
  teamName: { fontSize: typography.fontSize.md, fontWeight: "800" },
  teamRole: { fontSize: typography.fontSize.xs, marginTop: 2 },
  teamGithub: {
    fontSize: typography.fontSize.xs,
    marginTop: 2,
    fontWeight: "700",
  },
  footer: { alignItems: "center", paddingVertical: spacing.xl, gap: 4 },
  footerText: {
    fontSize: typography.fontSize.xs,
    fontWeight: "700",
    letterSpacing: 1,
  },
  footerSub: { fontSize: 10 },
});

export default AboutScreen;
