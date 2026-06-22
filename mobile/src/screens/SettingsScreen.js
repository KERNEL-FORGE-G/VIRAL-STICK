/**
 * SettingsScreen — App settings with theme toggle, companion selection, API key
 * Viral Stick | KERNEL FORGE — 2026
 *
 * Companion: para
 */

import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Animated,
  TouchableOpacity,
  TextInput,
  Alert,
  Switch,
} from "react-native";
import { useTheme, spacing, radius, typography } from "../theme";
import GlassCard from "../components/GlassCard";
import AnimatedButton from "../components/AnimatedButton";
import CompanionAvatar from "../components/CompanionAvatar";

const COMPANIONS = [
  { id: "arch", name: "Archlord", role: "PDG & Admin", color: "#7C3AED" },
  { id: "para", name: "Para", role: "Paramètres", color: "#06B6D4" },
  { id: "secu", name: "Secu", role: "Sécurité", color: "#EF4444" },
  { id: "data", name: "Data", role: "Support", color: "#10B981" },
  { id: "bio", name: "Bio", role: "Artiste", color: "#F59E0B" },
  { id: "ubu", name: "Ubu", role: "Comique", color: "#EC4899" },
  { id: "art", name: "Art", role: "Visuel", color: "#8B5CF6" },
];

const PARA_MESSAGES = [
  "⚙️ Para ici ! Je t'aide à configurer tout ça.",
  "🔧 Paramètres en ordre ? Je vérifie tout !",
  "🎨 Change le thème selon ton humeur !",
  "💡 Un bon réglage = une meilleure expérience !",
];

const SettingsScreen = ({ navigate }) => {
  const { theme, toggleTheme, isDark } = useTheme();
  const [selectedCompanion, setSelectedCompanion] = useState("para");
  const [apiKey, setApiKey] = useState("");
  const [showApiKey, setShowApiKey] = useState(false);
  const [msgIdx, setMsgIdx] = useState(0);
  const contentAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const t = setInterval(
      () => setMsgIdx((i) => (i + 1) % PARA_MESSAGES.length),
      5000,
    );
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    Animated.spring(contentAnim, {
      toValue: 1,
      tension: 60,
      friction: 8,
      useNativeDriver: true,
    }).start();
  }, []);

  const saveApiKey = () => {
    if (!apiKey.trim()) {
      Alert.alert("Viral Stick", "Entre une clé API valide");
      return;
    }
    Alert.alert(
      "✅ Clé sauvegardée",
      "Ta clé API Gemini a été enregistrée (simulation).",
    );
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <Animated.View
          style={{
            opacity: contentAnim,
            transform: [
              {
                translateY: contentAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [-20, 0],
                }),
              },
            ],
          }}
        >
          <View style={styles.header}>
            <View>
              <Text style={[styles.screenTag, { color: theme.textMuted }]}>
                PARAMÈTRES
              </Text>
              <Text style={[styles.title, { color: theme.textPrimary }]}>
                Ré<Text style={{ color: theme.secondary }}>glages</Text>
              </Text>
            </View>
            <CompanionAvatar
              companion="para"
              size={68}
              floating
              message={PARA_MESSAGES[msgIdx]}
            />
          </View>

          {/* Apparence */}
          <GlassCard animate delay={100}>
            <Text style={[styles.sectionIcon]}>🎨</Text>
            <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>
              Apparence
            </Text>
            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <Text
                  style={[styles.settingLabel, { color: theme.textPrimary }]}
                >
                  Thème sombre
                </Text>
                <Text style={[styles.settingDesc, { color: theme.textMuted }]}>
                  {isDark ? "Mode nuit activé" : "Mode jour activé"}
                </Text>
              </View>
              <Switch
                value={isDark}
                onValueChange={toggleTheme}
                trackColor={{ false: theme.border, true: `${theme.primary}66` }}
                thumbColor={isDark ? theme.primary : theme.textMuted}
              />
            </View>
          </GlassCard>

          {/* Companion selection */}
          <GlassCard animate delay={200} style={{ marginTop: spacing.md }}>
            <Text style={[styles.sectionIcon]}>🤖</Text>
            <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>
              Compagnon par défaut
            </Text>
            <Text style={[styles.sectionDesc, { color: theme.textMuted }]}>
              Choisis ton compagnon principal
            </Text>
            <View style={styles.companionGrid}>
              {COMPANIONS.map((c, idx) => {
                const active = selectedCompanion === c.id;
                return (
                  <TouchableOpacity
                    key={c.id}
                    onPress={() => setSelectedCompanion(c.id)}
                    style={[
                      styles.companionItem,
                      {
                        borderColor: active ? c.color : theme.border,
                        backgroundColor: active
                          ? `${c.color}22`
                          : "transparent",
                      },
                    ]}
                    activeOpacity={0.7}
                  >
                    <CompanionAvatar companion={c.id} size={44} />
                    <Text
                      style={[
                        styles.companionName,
                        { color: active ? c.color : theme.textSecondary },
                      ]}
                    >
                      {c.name}
                    </Text>
                    <Text
                      style={[styles.companionRole, { color: theme.textMuted }]}
                    >
                      {c.role}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </GlassCard>

          {/* API Key */}
          <GlassCard animate delay={300} style={{ marginTop: spacing.md }}>
            <Text style={[styles.sectionIcon]}>🔑</Text>
            <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>
              Clé API Gemini
            </Text>
            <Text style={[styles.sectionDesc, { color: theme.textMuted }]}>
              Requise pour la génération IA (stockée localement)
            </Text>
            <View style={styles.apiRow}>
              <TextInput
                style={[
                  styles.apiInput,
                  {
                    color: theme.textPrimary,
                    borderColor: theme.border,
                    backgroundColor: theme.backgroundSecondary,
                  },
                ]}
                value={apiKey}
                onChangeText={setApiKey}
                placeholder="AIzaSy..."
                placeholderTextColor={theme.textMuted}
                secureTextEntry={!showApiKey}
                autoCapitalize="none"
                autoCorrect={false}
              />
              <TouchableOpacity
                onPress={() => setShowApiKey(!showApiKey)}
                style={[
                  styles.eyeBtn,
                  { backgroundColor: theme.backgroundCard },
                ]}
              >
                <Text>{showApiKey ? "🙈" : "👁️"}</Text>
              </TouchableOpacity>
            </View>
            <AnimatedButton
              title="💾 Sauvegarder la clé"
              onPress={saveApiKey}
              size="sm"
              style={{ marginTop: spacing.sm }}
            />
          </GlassCard>

          {/* About */}
          <GlassCard animate delay={400} style={{ marginTop: spacing.md }}>
            <TouchableOpacity
              onPress={() => navigate && navigate("About")}
              style={styles.aboutRow}
              activeOpacity={0.7}
            >
              <View>
                <Text style={[styles.aboutLabel, { color: theme.textPrimary }]}>
                  ℹ️ À propos
                </Text>
                <Text style={[styles.aboutDesc, { color: theme.textMuted }]}>
                  Version 1.0.0 — KERNEL FORGE
                </Text>
              </View>
              <Text style={[styles.arrow, { color: theme.primary }]}>›</Text>
            </TouchableOpacity>
          </GlassCard>

          <View style={{ height: 100 }} />
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
    alignItems: "flex-start",
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
  sectionIcon: { fontSize: 24, marginBottom: spacing.xs },
  sectionTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: "700",
    marginBottom: 2,
  },
  sectionDesc: { fontSize: typography.fontSize.xs, marginBottom: spacing.md },
  settingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: spacing.sm,
  },
  settingInfo: { flex: 1 },
  settingLabel: { fontSize: typography.fontSize.md, fontWeight: "600" },
  settingDesc: { fontSize: typography.fontSize.xs, marginTop: 2 },
  companionGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  companionItem: {
    alignItems: "center",
    padding: spacing.sm,
    borderRadius: radius.md,
    borderWidth: 1.5,
    width: "30%",
    gap: 4,
  },
  companionName: {
    fontSize: typography.fontSize.xs,
    fontWeight: "700",
    textAlign: "center",
  },
  companionRole: { fontSize: 9, textAlign: "center" },
  apiRow: { flexDirection: "row", alignItems: "center", gap: spacing.sm },
  apiInput: {
    flex: 1,
    borderWidth: 1.5,
    borderRadius: radius.md,
    padding: spacing.md,
    fontSize: typography.fontSize.sm,
  },
  eyeBtn: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    justifyContent: "center",
    alignItems: "center",
  },
  aboutRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  aboutLabel: { fontSize: typography.fontSize.md, fontWeight: "600" },
  aboutDesc: { fontSize: typography.fontSize.xs, marginTop: 2 },
  arrow: { fontSize: 28, fontWeight: "300" },
});

export default SettingsScreen;
