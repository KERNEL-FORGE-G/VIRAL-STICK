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
} from "react-native";
import { useTheme, spacing, radius, typography, createShadow } from "../theme";
import GlassCard from "../components/GlassCard";
import AnimatedButton from "../components/AnimatedButton";
import CompanionAvatar from "../components/CompanionAvatar";

const PROVIDERS = [
  {
    key: "gemini",
    label: "Gemini",
    desc: "Provider principal pour le texte et potentiellement l’image",
    color: "#7C3AED",
  },
  {
    key: "mistral",
    label: "Mistral",
    desc: "Fallback texte pour maintenir la génération",
    color: "#06B6D4",
  },
  {
    key: "deepseek",
    label: "DeepSeek",
    desc: "Deuxième fallback texte pour la continuité de service",
    color: "#84CC16",
  },
];

const SettingsScreen = ({ navigate }) => {
  const { theme } = useTheme();
  const [geminiKey, setGeminiKey] = useState("");
  const [mistralKey, setMistralKey] = useState("");
  const [deepseekKey, setDeepseekKey] = useState("");
  const [showSecret, setShowSecret] = useState(false);
  const [status, setStatus] = useState("");
  const contentAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(contentAnim, {
      toValue: 1,
      tension: 60,
      friction: 8,
      useNativeDriver: true,
    }).start();
  }, [contentAnim]);

  const saveKeys = () => {
    if (!geminiKey.trim() && !mistralKey.trim() && !deepseekKey.trim()) {
      Alert.alert(
        "Viral Stick",
        "Entre au moins une clé API avant d'enregistrer.",
      );
      return;
    }
    setStatus("Clés enregistrées localement pour la session (simulation UI).");
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View
          style={{
            opacity: contentAnim,
            transform: [
              {
                translateY: contentAnim.interpolate({
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
                  PARAMÈTRES IA
                </Text>
                <Text style={[styles.title, { color: theme.textPrimary }]}>
                  Con
                  <Text style={{ color: theme.secondaryLight }}>
                    figuration
                  </Text>
                </Text>
                <Text style={[styles.heroDesc, { color: theme.textSecondary }]}>
                  Ici, l’interface se comporte comme une vraie console produit :
                  présence de marque, hiérarchie claire et rappel du rôle de
                  chaque provider.
                </Text>
              </View>
              <View style={styles.logoShell}>
                <ImageLogo />
              </View>
            </View>
            <View style={{ marginTop: spacing.md, alignItems: "center" }}>
              <CompanionAvatar
                companion="para"
                size={108}
                floating
                message="Je garde les réglages lisibles, propres et prêts pour l’exploitation."
              />
            </View>
          </GlassCard>

          <GlassCard animate delay={120} style={{ marginTop: spacing.md }}>
            <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>
              🧠 Providers actifs
            </Text>
            {PROVIDERS.map((provider) => (
              <View
                key={provider.key}
                style={[
                  styles.providerRow,
                  {
                    borderColor: `${provider.color}55`,
                    backgroundColor: `${provider.color}12`,
                  },
                ]}
              >
                <View
                  style={[
                    styles.providerDot,
                    { backgroundColor: provider.color },
                  ]}
                />
                <View style={{ flex: 1 }}>
                  <Text
                    style={[styles.providerName, { color: theme.textPrimary }]}
                  >
                    {provider.label}
                  </Text>
                  <Text
                    style={[styles.providerDesc, { color: theme.textMuted }]}
                  >
                    {provider.desc}
                  </Text>
                </View>
              </View>
            ))}
          </GlassCard>

          <GlassCard animate delay={220} style={{ marginTop: spacing.md }}>
            <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>
              🔑 Clés API
            </Text>
            {[
              ["Gemini API Key", geminiKey, setGeminiKey, "AIza..."],
              ["Mistral API Key", mistralKey, setMistralKey, "mistral-..."],
              ["DeepSeek API Key", deepseekKey, setDeepseekKey, "sk-..."],
            ].map(([label, value, setter, placeholder]) => (
              <View key={label} style={{ marginBottom: 14 }}>
                <Text
                  style={[styles.fieldLabel, { color: theme.textSecondary }]}
                >
                  {label}
                </Text>
                <TextInput
                  style={[
                    styles.apiInput,
                    {
                      color: theme.textPrimary,
                      borderColor: theme.border,
                      backgroundColor: theme.backgroundSecondary,
                    },
                  ]}
                  value={value}
                  onChangeText={setter}
                  placeholder={placeholder}
                  placeholderTextColor={theme.textMuted}
                  secureTextEntry={!showSecret}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>
            ))}
            <TouchableOpacity
              onPress={() => setShowSecret((v) => !v)}
              style={[
                styles.toggleBtn,
                {
                  borderColor: theme.border,
                  backgroundColor: theme.backgroundCard,
                },
              ]}
            >
              <Text style={{ color: theme.textPrimary, fontWeight: "700" }}>
                {showSecret ? "Masquer les clés" : "Afficher les clés"}
              </Text>
            </TouchableOpacity>
            <AnimatedButton
              title="Enregistrer les clés"
              onPress={saveKeys}
              size="md"
              style={{ marginTop: spacing.md }}
            />
            <Text style={[styles.status, { color: theme.textMuted }]}>
              {status ||
                "Les clés sont gérées localement côté UI. La sécurisation serveur doit être faite côté backend."}
            </Text>
          </GlassCard>

          <GlassCard animate delay={320} style={{ marginTop: spacing.md }}>
            <TouchableOpacity
              onPress={() => navigate && navigate("About")}
              style={styles.aboutRow}
              activeOpacity={0.8}
            >
              <View>
                <Text style={[styles.aboutLabel, { color: theme.textPrimary }]}>
                  ℹ️ À propos du produit
                </Text>
                <Text style={[styles.aboutDesc, { color: theme.textMuted }]}>
                  Identité, stack, positionnement et vision
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

const ImageLogo = () => {
  const { theme } = useTheme();
  return (
    <View
      style={{
        width: 160,
        height: 160,
        borderRadius: 28,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(255,255,255,0.06)",
        ...createShadow(theme.primary, 18),
      }}
    >
      <Animated.Image
        source={require("../../assets/logo/logo_sans_fond.png")}
        style={{ width: 128, height: 128 }}
        resizeMode="contain"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1 },
  scroll: { paddingHorizontal: spacing.md, paddingTop: 82 },
  heroCard: { padding: spacing.lg },
  heroTop: { flexDirection: "row", gap: spacing.md, alignItems: "center" },
  logoShell: { justifyContent: "center", alignItems: "center" },
  screenTag: {
    fontSize: typography.fontSize.xs,
    letterSpacing: 2,
    textTransform: "uppercase",
    fontWeight: "800",
  },
  title: {
    fontSize: typography.fontSize.xxxl,
    fontWeight: "900",
    letterSpacing: -1,
  },
  heroDesc: { fontSize: typography.fontSize.sm, lineHeight: 22, marginTop: 8 },
  sectionTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: "800",
    marginBottom: spacing.md,
  },
  providerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    padding: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
    marginBottom: spacing.sm,
  },
  providerDot: { width: 12, height: 12, borderRadius: 6 },
  providerName: { fontSize: typography.fontSize.md, fontWeight: "800" },
  providerDesc: {
    fontSize: typography.fontSize.xs,
    marginTop: 3,
    lineHeight: 18,
  },
  fieldLabel: {
    fontSize: typography.fontSize.sm,
    fontWeight: "700",
    marginBottom: 8,
  },
  apiInput: {
    borderWidth: 1.5,
    borderRadius: radius.md,
    padding: spacing.md,
    fontSize: typography.fontSize.sm,
  },
  toggleBtn: {
    borderWidth: 1,
    borderRadius: radius.md,
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  status: {
    fontSize: typography.fontSize.xs,
    lineHeight: 18,
    marginTop: spacing.md,
  },
  aboutRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  aboutLabel: { fontSize: typography.fontSize.md, fontWeight: "800" },
  aboutDesc: { fontSize: typography.fontSize.xs, marginTop: 4 },
  arrow: { fontSize: 28, fontWeight: "300" },
});

export default SettingsScreen;
