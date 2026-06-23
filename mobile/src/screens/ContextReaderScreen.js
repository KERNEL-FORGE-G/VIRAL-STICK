import React, { useMemo, useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Animated,
  Alert,
  Keyboard,
  Image,
  ActivityIndicator,
} from "react-native";
import axios from "axios";
import { useTheme, spacing, radius, typography, createShadow } from "../theme";
import GlassCard from "../components/GlassCard";
import AnimatedButton from "../components/AnimatedButton";
import CompanionAvatar from "../components/CompanionAvatar";

const API_BASE = "https://viral-stick.vercel.app";

const QUICK_IDEAS = [
  "Le prof arrive en retard à son propre cours et nous gronde quand même.",
  "Je dis que je vais dormir tôt puis je finis à scroller des reels à 2h43.",
  "Je veux juste envoyer un message simple et ça devient un drama de 17 paragraphes.",
];

const ContextReaderScreen = ({ navigate }) => {
  const { theme } = useTheme();
  const [text, setText] = useState("");
  const [meme, setMeme] = useState(null);
  const [loading, setLoading] = useState(false);
  const [companionMsg, setCompanionMsg] = useState(
    "Je prends ton contexte brut et j'en fais un angle plus net, plus visuel, plus viral.",
  );
  const resultAnim = useRef(new Animated.Value(0)).current;

  const progress = useMemo(() => Math.min(text.trim().length / 220, 1), [text]);

  const animateResult = () => {
    resultAnim.setValue(0);
    Animated.spring(resultAnim, {
      toValue: 1,
      tension: 70,
      friction: 8,
      useNativeDriver: true,
    }).start();
  };

  const generateMeme = async () => {
    if (!text.trim()) {
      setCompanionMsg(
        "Il me faut une vraie situation. Même brève, mais concrète.",
      );
      Alert.alert("Viral Stick", "Entre une situation à transformer en mème.");
      return;
    }

    Keyboard.dismiss();
    setLoading(true);
    setMeme(null);
    setCompanionMsg(
      "Je cherche le sous-texte drôle, la tension, puis la meilleure scène mentale.",
    );

    try {
      const res = await axios.post(`${API_BASE}/api/memes/generate-from-text`, {
        text,
      });
      setMeme(res.data);
      setCompanionMsg(
        res.data?.companionComment ||
          "Angle trouvé. On tient un mème qui a une vraie lecture visuelle.",
      );
      animateResult();
    } catch (err) {
      setCompanionMsg(
        "Le studio n'a pas pu générer cette version. On peut relancer avec un contexte plus précis.",
      );
      Alert.alert(
        "Erreur",
        "Impossible de générer le mème pour le moment. Vérifie la connexion backend.",
      );
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setText("");
    setMeme(null);
    setCompanionMsg("Nouveau contexte. Nouvelle lecture. Nouveau mème.");
    resultAnim.setValue(0);
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <GlassCard animate style={styles.heroCard}>
          <View style={styles.heroTop}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.kicker, { color: theme.textMuted }]}>
                MODULE 01 · CONTEXT STUDIO
              </Text>
              <Text style={[styles.heroTitle, { color: theme.textPrimary }]}>
                Context{" "}
                <Text style={{ color: theme.primaryLight }}>Reader</Text>
              </Text>
              <Text
                style={[styles.heroSubtitle, { color: theme.textSecondary }]}
              >
                Transforme une situation écrite en mème plus propre, plus drôle
                et plus facile à poster.
              </Text>
            </View>
            <View style={styles.logoWrap}>
              <Image
                source={require("../../assets/logo/logo_sans_fond.png")}
                style={styles.logo}
                resizeMode="contain"
              />
            </View>
          </View>

          <View style={styles.heroBottom}>
            <CompanionAvatar
              companion="art"
              size={116}
              floating
              message={companionMsg}
            />
          </View>
        </GlassCard>

        <GlassCard animate delay={80} style={styles.briefCard}>
          <Text style={[styles.sectionTag, { color: theme.primaryLight }]}>
            BRIEF CRÉATIF
          </Text>
          <Text style={[styles.briefTitle, { color: theme.textPrimary }]}>
            Décris la scène, la galère ou la contradiction
          </Text>
          <Text style={[styles.briefText, { color: theme.textSecondary }]}>
            Plus ton contexte est concret, plus l'IA peut trouver une chute
            forte et une image mentale crédible.
          </Text>

          <TextInput
            style={[
              styles.input,
              {
                color: theme.textPrimary,
                borderColor: text.length > 0 ? theme.primary : theme.border,
                backgroundColor: theme.backgroundSecondary,
              },
            ]}
            value={text}
            onChangeText={setText}
            placeholder="Ex: Mon pote a demandé 5 minutes pour se préparer. 1h plus tard il n'a toujours pas choisi son t-shirt."
            placeholderTextColor={theme.textMuted}
            multiline
            numberOfLines={7}
            textAlignVertical="top"
            maxLength={500}
          />

          <View style={styles.metaRow}>
            <View
              style={[
                styles.progressTrack,
                { backgroundColor: theme.backgroundSecondary },
              ]}
            >
              <View
                style={[
                  styles.progressFill,
                  {
                    width: `${progress * 100}%`,
                    backgroundColor: theme.primary,
                  },
                ]}
              />
            </View>
            <Text style={[styles.counter, { color: theme.textMuted }]}>
              {text.length}/500
            </Text>
          </View>

          <View style={styles.quickIdeasRow}>
            {QUICK_IDEAS.map((idea) => (
              <Text
                key={idea}
                style={[
                  styles.quickIdea,
                  { color: theme.textSecondary, borderColor: theme.border },
                ]}
                onPress={() => setText(idea)}
              >
                {idea}
              </Text>
            ))}
          </View>
        </GlassCard>

        <View style={styles.actionRow}>
          <AnimatedButton
            title={loading ? "Analyse en cours..." : "Générer le mème"}
            onPress={generateMeme}
            loading={loading}
            disabled={loading}
            size="lg"
            style={{ flex: 1 }}
          />
          <AnimatedButton
            title="Réinitialiser"
            onPress={reset}
            variant="ghost"
            size="lg"
            style={{ flex: 1 }}
          />
        </View>

        {loading && (
          <GlassCard animate style={styles.loadingCard}>
            <ActivityIndicator color={theme.primary} size="large" />
            <Text style={[styles.loadingTitle, { color: theme.textPrimary }]}>
              Lecture du contexte en cours
            </Text>
            <Text style={[styles.loadingText, { color: theme.textMuted }]}>
              Détection de l'angle comique, du contraste et de la meilleure
              scène à visualiser.
            </Text>
          </GlassCard>
        )}

        {meme && (
          <Animated.View
            style={{
              opacity: resultAnim,
              transform: [
                {
                  translateY: resultAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [28, 0],
                  }),
                },
              ],
            }}
          >
            <GlassCard style={styles.resultCard}>
              <Text style={[styles.sectionTag, { color: theme.primaryLight }]}>
                RÉSULTAT IA
              </Text>
              <Text style={[styles.resultTitle, { color: theme.textPrimary }]}>
                Mème prêt à maqueter
              </Text>

              <View
                style={[
                  styles.memePreview,
                  {
                    backgroundColor: theme.backgroundSecondary,
                    borderColor: theme.border,
                  },
                ]}
              >
                <Text style={[styles.memeLine, { color: theme.textPrimary }]}>
                  {meme.topText || ""}
                </Text>
                <View
                  style={[
                    styles.memeScene,
                    { borderColor: theme.borderStrong || theme.border },
                  ]}
                >
                  <Text style={styles.sceneEmoji}>🎬</Text>
                  <Text
                    style={[styles.sceneText, { color: theme.textSecondary }]}
                  >
                    {meme.descriptionImage || "Scène en attente"}
                  </Text>
                </View>
                <Text style={[styles.memeLine, { color: theme.textPrimary }]}>
                  {meme.bottomText || ""}
                </Text>
              </View>

              <View style={styles.signalGrid}>
                <View
                  style={[
                    styles.signalCard,
                    { backgroundColor: theme.backgroundSecondary },
                  ]}
                >
                  <Text
                    style={[styles.signalLabel, { color: theme.textMuted }]}
                  >
                    TOP TEXT
                  </Text>
                  <Text
                    style={[styles.signalValue, { color: theme.textPrimary }]}
                  >
                    {meme.topText}
                  </Text>
                </View>
                <View
                  style={[
                    styles.signalCard,
                    { backgroundColor: theme.backgroundSecondary },
                  ]}
                >
                  <Text
                    style={[styles.signalLabel, { color: theme.textMuted }]}
                  >
                    BOTTOM TEXT
                  </Text>
                  <Text
                    style={[styles.signalValue, { color: theme.textPrimary }]}
                  >
                    {meme.bottomText}
                  </Text>
                </View>
              </View>
            </GlassCard>
          </Animated.View>
        )}

        <View style={{ height: 110 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1 },
  scroll: { paddingHorizontal: spacing.md, paddingTop: 80 },
  heroCard: { padding: spacing.lg, marginBottom: spacing.md },
  heroTop: { flexDirection: "row", gap: spacing.md, alignItems: "center" },
  heroBottom: { marginTop: spacing.md, alignItems: "center" },
  kicker: {
    fontSize: typography.fontSize.xs,
    fontWeight: "800",
    letterSpacing: 2,
  },
  heroTitle: {
    fontSize: typography.fontSize.xxxl,
    fontWeight: "900",
    letterSpacing: -0.8,
  },
  heroSubtitle: {
    marginTop: 8,
    fontSize: typography.fontSize.sm,
    lineHeight: 22,
  },
  logoWrap: {
    width: 138,
    height: 138,
    justifyContent: "center",
    alignItems: "center",
  },
  logo: { width: 132, height: 132 },
  briefCard: { marginBottom: spacing.md },
  sectionTag: {
    fontSize: typography.fontSize.xs,
    fontWeight: "800",
    letterSpacing: 2,
    marginBottom: 8,
  },
  briefTitle: { fontSize: typography.fontSize.xl, fontWeight: "800" },
  briefText: { marginTop: 8, lineHeight: 21, fontSize: typography.fontSize.sm },
  input: {
    marginTop: spacing.md,
    minHeight: 170,
    borderWidth: 1.5,
    borderRadius: radius.md,
    padding: spacing.md,
    fontSize: typography.fontSize.md,
  },
  metaRow: {
    marginTop: spacing.sm,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  progressTrack: { flex: 1, height: 8, borderRadius: 999, overflow: "hidden" },
  progressFill: { height: "100%", borderRadius: 999 },
  counter: { fontSize: typography.fontSize.xs, fontWeight: "700" },
  quickIdeasRow: { marginTop: spacing.md, gap: spacing.sm },
  quickIdea: {
    borderWidth: 1,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    fontSize: typography.fontSize.xs,
    overflow: "hidden",
  },
  actionRow: {
    flexDirection: "row",
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  loadingCard: {
    alignItems: "center",
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  loadingTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: "800",
    marginTop: spacing.sm,
  },
  loadingText: { textAlign: "center", lineHeight: 20 },
  resultCard: { marginBottom: spacing.md },
  resultTitle: {
    fontSize: typography.fontSize.xl,
    fontWeight: "800",
    marginBottom: spacing.md,
  },
  memePreview: {
    borderWidth: 1,
    borderRadius: radius.md,
    padding: spacing.md,
    alignItems: "center",
    marginBottom: spacing.md,
  },
  memeLine: {
    fontSize: typography.fontSize.lg,
    fontWeight: "900",
    textTransform: "uppercase",
    textAlign: "center",
    lineHeight: 24,
    letterSpacing: 0.5,
  },
  memeScene: {
    marginVertical: spacing.md,
    width: "100%",
    minHeight: 170,
    borderWidth: 1,
    borderRadius: radius.md,
    alignItems: "center",
    justifyContent: "center",
    padding: spacing.md,
    backgroundColor: "rgba(255,255,255,0.03)",
  },
  sceneEmoji: { fontSize: 52, marginBottom: 10 },
  sceneText: {
    textAlign: "center",
    lineHeight: 20,
    fontSize: typography.fontSize.sm,
  },
  signalGrid: { gap: spacing.sm },
  signalCard: { padding: spacing.md, borderRadius: radius.md },
  signalLabel: {
    fontSize: typography.fontSize.xs,
    fontWeight: "800",
    letterSpacing: 1.3,
    marginBottom: 6,
  },
  signalValue: {
    fontSize: typography.fontSize.sm,
    lineHeight: 20,
    fontWeight: "700",
  },
});

export default ContextReaderScreen;
