import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Animated,
  TouchableOpacity,
  Alert,
  Image,
  ActivityIndicator,
} from "react-native";
import axios from "axios";
import { useTheme, spacing, radius, typography, createShadow } from "../theme";
import GlassCard from "../components/GlassCard";
import AnimatedButton from "../components/AnimatedButton";
import CompanionAvatar from "../components/CompanionAvatar";

const API_BASE = "https://viral-stick.vercel.app";

const DEMO_LINES = [
  "Je voulais juste faire une petite sieste et je me suis réveillé avec 43 appels manqués.",
  "J'ai dit à tout le monde que j'avais fini le projet alors que j'avais juste renommé le dossier final_final_v2.",
  "Ma connexion coupe toujours exactement quand je commence à avoir raison dans le débat.",
];

const WaveBar = ({ index, isRecording, theme }) => {
  const anim = useRef(new Animated.Value(0.25)).current;

  useEffect(() => {
    let loop;
    if (isRecording) {
      loop = Animated.loop(
        Animated.sequence([
          Animated.timing(anim, {
            toValue: 0.5 + ((index % 5) + 2) / 10,
            duration: 220 + index * 18,
            useNativeDriver: true,
          }),
          Animated.timing(anim, {
            toValue: 0.18,
            duration: 240,
            useNativeDriver: true,
          }),
        ]),
      );
      loop.start();
    } else {
      Animated.timing(anim, {
        toValue: 0.25,
        duration: 180,
        useNativeDriver: true,
      }).start();
    }
    return () => loop?.stop();
  }, [anim, index, isRecording]);

  return (
    <Animated.View
      style={[
        styles.waveBar,
        {
          backgroundColor: theme.secondary,
          transform: [{ scaleY: anim }],
        },
      ]}
    />
  );
};

const VoiceToMemeScreen = ({ navigate }) => {
  const { theme } = useTheme();
  const [isRecording, setIsRecording] = useState(false);
  const [transcription, setTranscription] = useState("");
  const [meme, setMeme] = useState(null);
  const [loading, setLoading] = useState(false);
  const [duration, setDuration] = useState(0);
  const [companionMsg, setCompanionMsg] = useState(
    "Donne-moi une phrase dite à chaud. Je garde l'énergie et je fabrique la chute.",
  );
  const timerRef = useRef(null);
  const micScale = useRef(new Animated.Value(1)).current;
  const resultAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => () => clearInterval(timerRef.current), []);

  const startRecording = () => {
    setIsRecording(true);
    setTranscription("");
    setMeme(null);
    setDuration(0);
    resultAnim.setValue(0);
    setCompanionMsg(
      "Parle comme tu le sens. Plus c'est spontané, mieux c'est.",
    );

    Animated.loop(
      Animated.sequence([
        Animated.timing(micScale, {
          toValue: 1.14,
          duration: 520,
          useNativeDriver: true,
        }),
        Animated.timing(micScale, {
          toValue: 1,
          duration: 520,
          useNativeDriver: true,
        }),
      ]),
    ).start();

    timerRef.current = setInterval(() => setDuration((d) => d + 1), 1000);
  };

  const stopRecording = () => {
    setIsRecording(false);
    micScale.stopAnimation();
    micScale.setValue(1);
    clearInterval(timerRef.current);
    setCompanionMsg(
      "J'extrais l'intention, le rythme et le meilleur moment de bascule.",
    );

    setTimeout(() => {
      const sample = DEMO_LINES[Math.floor(Math.random() * DEMO_LINES.length)];
      setTranscription(sample);
      setCompanionMsg(
        "Transcription prête. On peut maintenant la transformer en mème.",
      );
    }, 1200);
  };

  const generateMeme = async () => {
    if (!transcription.trim()) {
      setCompanionMsg("Il me faut d'abord une parole à remixer.");
      Alert.alert(
        "Viral Stick",
        "Enregistre ou génère d'abord une transcription.",
      );
      return;
    }

    setLoading(true);
    setMeme(null);
    setCompanionMsg(
      "Je garde le ton de la voix et j'écris une vraie chute, pas une copie plate.",
    );

    try {
      const res = await axios.post(`${API_BASE}/api/memes/voice-to-meme`, {
        transcription,
      });
      setMeme(res.data);
      setCompanionMsg(
        res.data?.companionComment ||
          "L'énergie est préservée. Le rendu est plus net et plus postable.",
      );
      resultAnim.setValue(0);
      Animated.spring(resultAnim, {
        toValue: 1,
        tension: 70,
        friction: 8,
        useNativeDriver: true,
      }).start();
    } catch {
      setCompanionMsg(
        "Le module vocal n'a pas répondu. On peut retenter immédiatement.",
      );
      Alert.alert(
        "Erreur",
        "Connexion au serveur impossible pour la génération du mème.",
      );
    } finally {
      setLoading(false);
    }
  };

  const formatDuration = (s) =>
    `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <GlassCard animate style={styles.heroCard}>
          <View style={styles.heroTop}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.kicker, { color: theme.textMuted }]}>
                MODULE 02 · VOICE CAPTURE
              </Text>
              <Text style={[styles.heroTitle, { color: theme.textPrimary }]}>
                Voice{" "}
                <Text style={{ color: theme.secondaryLight }}>→ Mème</Text>
              </Text>
              <Text
                style={[styles.heroSubtitle, { color: theme.textSecondary }]}
              >
                Transforme un moment parlé en punchline exploitable, tout en
                gardant la nervosité de l'oral.
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
              companion="ubu"
              size={116}
              floating
              message={companionMsg}
            />
          </View>
        </GlassCard>

        <GlassCard animate delay={80} style={styles.recorderCard}>
          <Text style={[styles.sectionTag, { color: theme.secondaryLight }]}>
            RECORDER STUDIO
          </Text>
          <View style={styles.waveform}>
            {Array.from({ length: 28 }).map((_, i) => (
              <WaveBar
                key={i}
                index={i}
                isRecording={isRecording}
                theme={theme}
              />
            ))}
          </View>

          <Text
            style={[
              styles.duration,
              { color: isRecording ? theme.danger : theme.textMuted },
            ]}
          >
            {isRecording
              ? `● REC ${formatDuration(duration)}`
              : formatDuration(duration)}
          </Text>

          <Animated.View style={{ transform: [{ scale: micScale }] }}>
            <TouchableOpacity
              onPress={isRecording ? stopRecording : startRecording}
              style={[
                styles.micBtn,
                {
                  backgroundColor: isRecording ? theme.danger : theme.primary,
                  ...createShadow(
                    isRecording ? theme.danger : theme.primary,
                    18,
                  ),
                },
              ]}
              activeOpacity={0.85}
            >
              <Text style={styles.micIcon}>{isRecording ? "⏹" : "🎙️"}</Text>
            </TouchableOpacity>
          </Animated.View>

          <Text style={[styles.helper, { color: theme.textSecondary }]}>
            {isRecording
              ? "Parle normalement. L'objectif est de capturer le naturel, pas la perfection."
              : "Appuie pour lancer une prise vocale démo, puis transforme la transcription en mème."}
          </Text>
        </GlassCard>

        {transcription.length > 0 && (
          <GlassCard animate delay={120} style={styles.transcriptCard}>
            <Text style={[styles.sectionTag, { color: theme.secondaryLight }]}>
              TRANSCRIPTION
            </Text>
            <Text style={[styles.transcriptText, { color: theme.textPrimary }]}>
              “{transcription}”
            </Text>
            <AnimatedButton
              title={loading ? "Transformation..." : "Transformer en mème"}
              onPress={generateMeme}
              loading={loading}
              disabled={loading}
              size="lg"
              style={{ marginTop: spacing.md }}
            />
          </GlassCard>
        )}

        {loading && (
          <GlassCard animate style={styles.loadingCard}>
            <ActivityIndicator color={theme.secondary} size="large" />
            <Text style={[styles.loadingTitle, { color: theme.textPrimary }]}>
              Remix vocal en cours
            </Text>
            <Text style={[styles.loadingText, { color: theme.textMuted }]}>
              Préservation de la spontanéité, nettoyage léger et recherche de la
              meilleure chute.
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
              <Text
                style={[styles.sectionTag, { color: theme.secondaryLight }]}
              >
                SORTIE IA
              </Text>
              <Text style={[styles.resultTitle, { color: theme.textPrimary }]}>
                Mème vocal prêt à poser
              </Text>

              <View
                style={[
                  styles.memeBox,
                  {
                    backgroundColor: theme.backgroundSecondary,
                    borderColor: theme.border,
                  },
                ]}
              >
                <Text style={[styles.memeTop, { color: theme.textPrimary }]}>
                  {meme.topText}
                </Text>
                <View style={styles.voiceScene}>
                  <Text style={styles.voiceEmoji}>🎤</Text>
                  <Text
                    style={[
                      styles.voiceDescription,
                      { color: theme.textSecondary },
                    ]}
                  >
                    {meme.descriptionImage}
                  </Text>
                </View>
                <Text style={[styles.memeBottom, { color: theme.textPrimary }]}>
                  {meme.bottomText}
                </Text>
              </View>

              <View
                style={[
                  styles.subtitleCard,
                  { backgroundColor: theme.backgroundSecondary },
                ]}
              >
                <Text
                  style={[styles.subtitleLabel, { color: theme.textMuted }]}
                >
                  SOUS-TITRE ORIGINAL NETTOYÉ
                </Text>
                <Text
                  style={[styles.subtitleText, { color: theme.textPrimary }]}
                >
                  {meme.original_transcript_subtitle}
                </Text>
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
  sectionTag: {
    fontSize: typography.fontSize.xs,
    fontWeight: "800",
    letterSpacing: 2,
    marginBottom: 8,
  },
  recorderCard: {
    alignItems: "center",
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  waveform: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    width: "100%",
    height: 72,
  },
  waveBar: { width: 5, height: 52, borderRadius: 6 },
  duration: {
    fontSize: typography.fontSize.lg,
    fontWeight: "800",
    letterSpacing: 2,
  },
  micBtn: {
    width: 108,
    height: 108,
    borderRadius: 54,
    justifyContent: "center",
    alignItems: "center",
  },
  micIcon: { fontSize: 42 },
  helper: {
    textAlign: "center",
    lineHeight: 20,
    paddingHorizontal: spacing.sm,
  },
  transcriptCard: { marginBottom: spacing.md },
  transcriptText: {
    fontSize: typography.fontSize.md,
    lineHeight: 24,
    fontStyle: "italic",
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
  memeBox: {
    borderWidth: 1,
    borderRadius: radius.md,
    padding: spacing.md,
    alignItems: "center",
    marginBottom: spacing.md,
  },
  memeTop: {
    fontSize: typography.fontSize.lg,
    fontWeight: "900",
    textTransform: "uppercase",
    textAlign: "center",
    lineHeight: 24,
  },
  voiceScene: {
    width: "100%",
    minHeight: 160,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: spacing.md,
    borderRadius: radius.md,
    backgroundColor: "rgba(255,255,255,0.03)",
    padding: spacing.md,
  },
  voiceEmoji: { fontSize: 56, marginBottom: 10 },
  voiceDescription: {
    textAlign: "center",
    fontSize: typography.fontSize.sm,
    lineHeight: 20,
  },
  memeBottom: {
    fontSize: typography.fontSize.lg,
    fontWeight: "900",
    textTransform: "uppercase",
    textAlign: "center",
    lineHeight: 24,
  },
  subtitleCard: { borderRadius: radius.md, padding: spacing.md },
  subtitleLabel: {
    fontSize: typography.fontSize.xs,
    fontWeight: "800",
    letterSpacing: 1.4,
    marginBottom: 6,
  },
  subtitleText: {
    fontSize: typography.fontSize.sm,
    lineHeight: 20,
    fontStyle: "italic",
  },
});

export default VoiceToMemeScreen;
