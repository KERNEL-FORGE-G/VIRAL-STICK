/**
 * AboutScreen — Project info, team, and links
 * Viral Stick | KERNEL FORGE — 2026
 *
 * Companion: arch
 */

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

const AboutScreen = ({ navigate }) => {
  const { theme } = useTheme();
  const headerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(headerAnim, {
      toValue: 1,
      tension: 50,
      friction: 7,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <Animated.View
          style={{
            opacity: headerAnim,
            transform: [
              {
                translateY: headerAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [-30, 0],
                }),
              },
            ],
          }}
        >
          <View style={styles.header}>
            <View>
              <Text style={[styles.screenTag, { color: theme.textMuted }]}>
                À PROPOS
              </Text>
              <Text style={[styles.title, { color: theme.textPrimary }]}>
                Viral <Text style={{ color: theme.primaryLight }}>Stick</Text>
              </Text>
            </View>
            <CompanionAvatar
              companion="arch"
              size={136}
              floating
              message="Bienvenue dans l'univers KERNEL FORGE. Je suis Archlord, le lead de ce projet."
            />
          </View>

          {/* Description */}
          <GlassCard animate delay={100}>
            <Text style={[styles.aboutEmoji]}>🚀</Text>
            <Text style={[styles.aboutTitle, { color: theme.textPrimary }]}>
              Générateur de Mèmes & Stickers IA
            </Text>
            <Text style={[styles.aboutText, { color: theme.textSecondary }]}>
              Viral Stick est une plateforme de création et de partage de
              contenus multimodaux (mèmes, stickers IA) propulsée par Google
              Gemini AI. Projet de l'équipe KERNEL FORGE pour ICT202 à
              l'Université de Yaoundé I.
            </Text>
          </GlassCard>

          {/* Modules */}
          <GlassCard animate delay={200} style={{ marginTop: spacing.md }}>
            <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>
              🧩 Modules
            </Text>
            {[
              {
                emoji: "📖",
                name: "Context Reader",
                desc: "Analyse un texte et génère un mème IA",
              },
              {
                emoji: "🎙️",
                name: "Voice → Mème",
                desc: "Transcription vocale → mème automatique",
              },
              {
                emoji: "🎨",
                name: "Status Remixer",
                desc: "Remixe tes images en stickers viraux",
              },
            ].map((mod, i) => (
              <View
                key={i}
                style={[styles.moduleRow, { borderBottomColor: theme.divider }]}
              >
                <Text style={styles.moduleEmoji}>{mod.emoji}</Text>
                <View style={{ flex: 1 }}>
                  <Text
                    style={[styles.moduleName, { color: theme.textPrimary }]}
                  >
                    {mod.name}
                  </Text>
                  <Text style={[styles.moduleDesc, { color: theme.textMuted }]}>
                    {mod.desc}
                  </Text>
                </View>
              </View>
            ))}
          </GlassCard>

          {/* Team */}
          <GlassCard animate delay={300} style={{ marginTop: spacing.md }}>
            <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>
              👥 Équipe
            </Text>
            {TEAM.map((member, i) => (
              <View key={i} style={styles.teamRow}>
                <CompanionAvatar companion={member.companion} size={48} />
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

          {/* Links */}
          <GlassCard animate delay={400} style={{ marginTop: spacing.md }}>
            <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>
              🔗 Liens
            </Text>
            <AnimatedButton
              title="⭐ GitHub — KERNEL FORGE"
              onPress={() =>
                Linking.openURL("https://github.com/KERNEL-FORGE-G/VIRAL-STICK")
              }
              variant="ghost"
              size="sm"
              style={{ marginBottom: spacing.sm }}
            />
            <AnimatedButton
              title="📄 Documentation technique"
              onPress={() =>
                Linking.openURL(
                  "https://github.com/KERNEL-FORGE-G/VIRAL-STICK/tree/main/docs",
                )
              }
              variant="ghost"
              size="sm"
            />
          </GlassCard>

          {/* Footer */}
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
  scroll: { paddingHorizontal: spacing.md, paddingTop: 80 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.lg,
  },
  screenTag: {
    fontSize: typography.fontSize.xs,
    letterSpacing: 2,
    textTransform: "uppercase",
    fontWeight: "600",
  },
  title: {
    fontSize: typography.fontSize.xxl,
    fontWeight: "900",
    letterSpacing: -0.5,
  },
  logo: { width: 60, height: 60 },
  aboutEmoji: { fontSize: 32, marginBottom: spacing.sm },
  aboutTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: "700",
    marginBottom: spacing.sm,
  },
  aboutText: { fontSize: typography.fontSize.sm, lineHeight: 22 },
  sectionTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: "700",
    marginBottom: spacing.md,
  },
  moduleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
  },
  moduleEmoji: { fontSize: 28 },
  moduleName: { fontSize: typography.fontSize.md, fontWeight: "600" },
  moduleDesc: { fontSize: typography.fontSize.xs, marginTop: 2 },
  teamRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    paddingVertical: spacing.sm,
  },
  teamName: { fontSize: typography.fontSize.md, fontWeight: "700" },
  teamRole: { fontSize: typography.fontSize.xs, marginTop: 1 },
  teamGithub: {
    fontSize: typography.fontSize.xs,
    marginTop: 1,
    fontWeight: "600",
  },
  footer: { alignItems: "center", paddingVertical: spacing.xxl, gap: 4 },
  footerText: {
    fontSize: typography.fontSize.xs,
    fontWeight: "600",
    letterSpacing: 1,
  },
  footerSub: { fontSize: 10 },
});

export default AboutScreen;
