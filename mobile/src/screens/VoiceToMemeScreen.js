/**
 * VoiceToMemeScreen — Audio recorder → Gemini transcription → Meme
 * Viral Stick | KERNEL FORGE — 2026
 *
 * Companion: ubu
 * Note: Audio recording uses react-native-audio-recorder-player (to be installed)
 * Fallback simulation mode included for demo without native module.
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
  Alert,
  Platform,
} from "react-native";
import axios from "axios";
import { useTheme, spacing, radius, typography, createShadow } from "../theme";
import GlassCard from "../components/GlassCard";
import AnimatedButton from "../components/AnimatedButton";
import CompanionAvatar from "../components/CompanionAvatar";

const UBU_MESSAGES = [
  "🤖 Parle ! Je transforme ta voix en légende !",
  "🎙️ Appuie sur le micro et dis quelque chose de drôle...",
  "💥 Ta voix = mème explosif garanti !",
  "🎤 Ubu à l'écoute, 24/7 !",
];

// Waveform bar component
const WaveBar = ({ index, isRecording, theme }) => {
  const anim = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    if (isRecording) {
      const delay = index * 80;
      const loop = Animated.loop(
        Animated.sequence([
          Animated.timing(anim, {
            toValue: Math.random() * 0.7 + 0.3,
            duration: 300 + Math.random() * 200,
            delay,
            useNativeDriver: true,
          }),
          Animated.timing(anim, {
            toValue: 0.2,
            duration: 300,
            useNativeDriver: true,
          }),
        ]),
      );
      loop.start();
      return () => loop.stop();
    } else {
      Animated.timing(anim, {
        toValue: 0.3,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [isRecording]);

  return (
    <Animated.View
      style={[
        styles.waveBar,
        {
          backgroundColor: theme.secondary,
          scaleY: anim,
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
  const [companionMsg, setCompanionMsg] = useState(UBU_MESSAGES[0]);
  const timerRef = useRef(null);
  const micScale = useRef(new Animated.Value(1)).current;
  const resultAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!isRecording && !loading && !meme) {
      const t = setInterval(() => {
        setCompanionMsg(
          UBU_MESSAGES[Math.floor(Math.random() * UBU_MESSAGES.length)],
        );
      }, 5500);
      return () => clearInterval(t);
    }
  }, [isRecording, loading, meme]);

  const startRecording = () => {
    setIsRecording(true);
    setTranscription("");
    setMeme(null);
    setDuration(0);
    resultAnim.setValue(0);
    setCompanionMsg("🎙️ Je t'écoute attentivement !");

    // Pulse mic animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(micScale, {
          toValue: 1.15,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(micScale, {
          toValue: 1,
          duration: 600,
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
    setCompanionMsg("⌛ Analyse de ta voix en cours...");

    // Simulate transcription (in real app, this would be an API call with audio file)
    setTimeout(() => {
      const demo = [
        "Mon prof a confondu Python et le serpent, il a appelé le zoo !",
        "La WiFi de la fac est tellement lente que les mails arrivent à la semaine suivante.",
        "J'ai codé toute la nuit et mon programme dit 'Hello World' en 3 jours.",
      ];
      setTranscription(demo[Math.floor(Math.random() * demo.length)]);
      setCompanionMsg("✅ J'ai tout compris ! On crée le mème ?");
    }, 1200);
  };

  const generateMeme = async () => {
    if (!transcription.trim()) {
      setCompanionMsg("⚠️ Dis-moi quelque chose d'abord !");
      Alert.alert("Viral Stick", "Enregistre d'abord ta voix !");
      return;
    }
    setLoading(true);
    setMeme(null);
    setCompanionMsg("🤖 Ubu transforme tes paroles en légende épique...");
    try {
      const res = await axios.post(
        "https://viral-stick.vercel.app/api/memes/voice-to-meme",
        {
          transcription: transcription,
        },
      );
      setMeme(res.data);
      if (res.data.companionComment) {
        setCompanionMsg(res.data.companionComment);
      } else {
        setCompanionMsg(
          "🔥 Boom ! Voilà un mème vocal qui va briser internet !",
        );
      }
      Animated.spring(resultAnim, {
        toValue: 1,
        tension: 70,
        friction: 7,
        useNativeDriver: true,
      }).start();
    } catch {
      setCompanionMsg("❌ Zut, petit problème technique. On réessaie ?");
      Alert.alert("Erreur", "Connexion au serveur impossible.");
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
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={[styles.screenTag, { color: theme.textMuted }]}>
              MODULE 2
            </Text>
            <Text style={[styles.title, { color: theme.textPrimary }]}>
              Voice <Text style={{ color: theme.secondaryLight }}>→ Mème</Text>
            </Text>
          </View>
          <CompanionAvatar
            companion="ubu"
            size={136}
            floating
            message={companionMsg}
          />
        </View>

        {/* Recorder Card */}
        <GlassCard animate delay={100} style={styles.recorderCard}>
          {/* Waveform */}
          <View style={styles.waveform}>
            {Array.from({ length: 24 }).map((_, i) => (
              <WaveBar
                key={i}
                index={i}
                isRecording={isRecording}
                theme={theme}
              />
            ))}
          </View>

          {/* Duration */}
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

          {/* Mic button */}
          <Animated.View style={{ transform: [{ scale: micScale }] }}>
            <TouchableOpacity
              onPress={isRecording ? stopRecording : startRecording}
              style={[
                styles.micBtn,
                {
                  backgroundColor: isRecording ? theme.danger : theme.primary,
                  ...createShadow(
                    isRecording ? theme.danger : theme.primary,
                    16,
                  ),
                },
              ]}
              activeOpacity={0.8}
            >
              <Text style={styles.micIcon}>{isRecording ? "⏹" : "🎙️"}</Text>
            </TouchableOpacity>
          </Animated.View>

          <Text style={[styles.micLabel, { color: theme.textMuted }]}>
            {isRecording ? "Appuie pour arrêter" : "Appuie pour enregistrer"}
          </Text>
        </GlassCard>

        {/* Transcription */}
        {transcription.length > 0 && (
          <GlassCard animate style={styles.transcriptCard}>
            <Text style={[styles.transcriptLabel, { color: theme.secondary }]}>
              📝 TRANSCRIPTION
            </Text>
            <Text style={[styles.transcriptText, { color: theme.textPrimary }]}>
              "{transcription}"
            </Text>
            <AnimatedButton
              title={loading ? "Génération..." : "✨ Transformer en mème"}
              onPress={generateMeme}
              loading={loading}
              disabled={loading}
              size="md"
              style={{ marginTop: spacing.md }}
            />
          </GlassCard>
        )}

        {/* Result */}
        {meme && (
          <Animated.View
            style={{
              opacity: resultAnim,
              transform: [
                {
                  translateY: resultAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [30, 0],
                  }),
                },
              ],
            }}
          >
            <GlassCard style={styles.resultCard}>
              <Text
                style={[styles.resultTitle, { color: theme.secondaryLight }]}
              >
                💥 Mème Vocal Généré !
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
                <View style={styles.memeImage}>
                  <Text style={{ fontSize: 52 }}>🎙️</Text>
                </View>
                <Text style={[styles.memeBottom, { color: theme.textPrimary }]}>
                  {meme.bottomText}
                </Text>
              </View>
              <AnimatedButton
                title="🔁 Recréer"
                onPress={generateMeme}
                variant="ghost"
                size="sm"
                style={{ marginTop: spacing.sm }}
              />
            </GlassCard>
          </Animated.View>
        )}

        <View style={{ height: 100 }} />
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
  recorderCard: {
    alignItems: "center",
    paddingVertical: spacing.xl,
    marginBottom: spacing.md,
    gap: spacing.md,
  },
  waveform: { flexDirection: "row", alignItems: "center", height: 60, gap: 4 },
  waveBar: { width: 4, height: 50, borderRadius: 4 },
  duration: {
    fontSize: typography.fontSize.lg,
    fontWeight: "700",
    letterSpacing: 2,
  },
  micBtn: {
    width: 90,
    height: 90,
    borderRadius: 45,
    justifyContent: "center",
    alignItems: "center",
  },
  micIcon: { fontSize: 38 },
  micLabel: { fontSize: typography.fontSize.xs, letterSpacing: 1 },
  transcriptCard: { marginBottom: spacing.md },
  transcriptLabel: {
    fontSize: typography.fontSize.xs,
    fontWeight: "700",
    letterSpacing: 2,
    marginBottom: spacing.sm,
  },
  transcriptText: {
    fontSize: typography.fontSize.md,
    lineHeight: 24,
    fontStyle: "italic",
  },
  resultCard: { marginBottom: spacing.md },
  resultTitle: {
    fontSize: typography.fontSize.xl,
    fontWeight: "800",
    textAlign: "center",
    marginBottom: spacing.md,
  },
  memeBox: {
    borderRadius: radius.md,
    borderWidth: 1,
    padding: spacing.md,
    alignItems: "center",
  },
  memeTop: {
    fontSize: typography.fontSize.lg,
    fontWeight: "800",
    textTransform: "uppercase",
    textAlign: "center",
    marginBottom: spacing.sm,
  },
  memeImage: {
    width: "100%",
    height: 140,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.1)",
    borderRadius: radius.md,
  },
  memeBottom: {
    fontSize: typography.fontSize.lg,
    fontWeight: "800",
    textTransform: "uppercase",
    textAlign: "center",
    marginTop: spacing.sm,
  },
});

export default VoiceToMemeScreen;
