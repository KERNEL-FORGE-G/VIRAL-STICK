import React, { useEffect, useRef, useState } from "react";
import {
  View, Text, StyleSheet, ScrollView, SafeAreaView, Animated, TouchableOpacity,
  Alert, ActivityIndicator, StatusBar, Platform,
} from "react-native";
import axios from "axios";
import { spacing, radius } from "../theme";
import { colors } from "../theme/tokens";
import GlassCard from "../components/GlassCard";
import AnimatedButton from "../components/AnimatedButton";
import CompanionAvatar from "../components/CompanionAvatar";
import { apiUrl } from "../config/api";

const WaveBar = ({ index, active }) => {
  const anim = useRef(new Animated.Value(0.25)).current;
  useEffect(() => {
    if (active) {
      const loop = Animated.loop(Animated.sequence([
        Animated.timing(anim, { toValue: 0.55 + (index % 5) * 0.08, duration: 200 + index * 15, useNativeDriver: true }),
        Animated.timing(anim, { toValue: 0.2, duration: 230, useNativeDriver: true }),
      ]));
      loop.start();
      return () => loop.stop();
    }
    Animated.timing(anim, { toValue: 0.25, duration: 160, useNativeDriver: true }).start();
  }, [active, anim, index]);
  return <Animated.View style={[styles.waveBar, { transform: [{ scaleY: anim }], backgroundColor: colors.duoGreen }]} />;
};

const VoiceToMemeScreen = () => {
  const [recording, setRecording] = useState(false);
  const [transcription, setTranscription] = useState("");
  const [meme, setMeme] = useState(null);
  const [loading, setLoading] = useState(false);
  const [duration, setDuration] = useState(0);
  const [msg, setMsg] = useState("Donne-moi une phrase dite à chaud. Je garde l'énergie.");
  const timerRef = useRef(null);
  const micScale = useRef(new Animated.Value(1)).current;
  const resultAnim = useRef(new Animated.Value(0)).current;
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const audioUriRef = useRef(null);

  useEffect(() => () => clearInterval(timerRef.current), []);

  const startRec = async () => {
    setRecording(true);
    setTranscription("");
    setMeme(null);
    setDuration(0);
    audioChunksRef.current = [];
    audioUriRef.current = null;
    setMsg("Parle comme tu le sens. Plus c'est spontané, mieux c'est.");

    Animated.loop(Animated.sequence([
      Animated.timing(micScale, { toValue: 1.12, duration: 500, useNativeDriver: true }),
      Animated.timing(micScale, { toValue: 1, duration: 500, useNativeDriver: true }),
    ])).start();
    timerRef.current = setInterval(() => setDuration((d) => d + 1), 1000);

    if (typeof MediaRecorder !== "undefined" && navigator?.mediaDevices?.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const mr = new MediaRecorder(stream);
        mediaRecorderRef.current = mr;
        mr.ondataavailable = (ev) => { if (ev.data.size) audioChunksRef.current.push(ev.data); };
        mr.onstop = () => stream.getTracks().forEach((t) => t.stop());
        mr.start();
        return;
      } catch {
        setMsg("Micro indisponible — utilise la transcription texte.");
      }
    }
  };

  const stopRec = async () => {
    setRecording(false);
    micScale.stopAnimation();
    micScale.setValue(1);
    clearInterval(timerRef.current);
    setMsg("Transcription en cours...");

    if (mediaRecorderRef.current?.state === "recording") {
      mediaRecorderRef.current.stop();
      await new Promise((r) => setTimeout(r, 400));
      const blob = new Blob(audioChunksRef.current, { type: "audio/webm" });
      try {
        const form = new FormData();
        form.append("audio", blob, "voice.webm");
        const res = await axios.post(apiUrl("/api/memes/transcribe"), form, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        setTranscription(res.data.transcription || "");
        setMsg("Transcription prête. Lance la transformation !");
        return;
      } catch {
        setMsg("Transcription échouée. Réessaie ou saisis le texte.");
      }
    }

    Alert.alert(
      "Mode texte",
      "Enregistrement natif non disponible sur cet appareil. Utilise le web ou saisis ta phrase.",
      [{ text: "OK" }]
    );
    setMsg("Enregistrement natif indisponible sur mobile. Utilise la version web pour la voix.");
  };

  const generate = async () => {
    if (!transcription.trim()) {
      Alert.alert("Viral Stick", "Enregistre d'abord une prise ou saisis une transcription.");
      return;
    }
    setLoading(true);
    setMeme(null);
    setMsg("Je construis la chute à partir de ton énergie vocale...");
    try {
      const res = await axios.post(apiUrl("/api/memes/voice-to-meme"), { transcription });
      setMeme(res.data);
      setMsg(res.data?.companionComment || "L'énergie est préservée. Mème prêt !");
      resultAnim.setValue(0);
      Animated.spring(resultAnim, { toValue: 1, tension: 70, friction: 8, useNativeDriver: true }).start();
    } catch {
      setMsg("Le module vocal n'a pas répondu. Relance.");
      Alert.alert("Erreur", "Connexion backend impossible.");
    } finally {
      setLoading(false);
    }
  };

  const fmt = (s) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <GlassCard animate style={styles.hero}>
          <View style={styles.badge}><Text style={styles.badgeText}>MODULE 02 · VOICE CAPTURE</Text></View>
          <Text style={styles.title}>Voice <Text style={{ color: colors.duoGreen }}>→ Mème</Text></Text>
          <Text style={styles.sub}>Transforme une parole spontanée en punchline mémorable.</Text>
          <View style={{ alignItems: "center", marginTop: spacing.md }}>
            <CompanionAvatar companion="ubu" size={96} floating message={msg} />
          </View>
        </GlassCard>

        <GlassCard animate delay={80} style={[styles.card, { alignItems: "center", gap: spacing.md }]}>
          <Text style={styles.label}>RECORDER STUDIO</Text>
          <View style={styles.wave}>
            {Array.from({ length: 26 }).map((_, i) => <WaveBar key={i} index={i} active={recording} />)}
          </View>
          <Text style={[styles.durationText, { color: recording ? colors.danger : colors.silver }]}>
            {recording ? `● REC ${fmt(duration)}` : fmt(duration)}
          </Text>
          <Animated.View style={{ transform: [{ scale: micScale }] }}>
            <TouchableOpacity
              onPress={recording ? stopRec : startRec}
              style={[styles.micBtn, { backgroundColor: recording ? colors.danger : colors.duoGreen, shadowColor: recording ? colors.danger : colors.duoGreenDark }]}
              activeOpacity={0.85}
            >
              <Text style={styles.micIcon}>{recording ? "⏹" : "🎙️"}</Text>
            </TouchableOpacity>
          </Animated.View>
          <Text style={styles.hint}>
            {Platform.OS === "web"
              ? "Appuie pour enregistrer avec le micro du navigateur."
              : "Voix complète sur web. Sur mobile, utilise la transcription backend via web."}
          </Text>
        </GlassCard>

        {transcription.length > 0 && (
          <GlassCard animate delay={100} style={styles.card}>
            <Text style={styles.label}>TRANSCRIPTION</Text>
            <Text style={styles.transcript}>"{transcription}"</Text>
            <AnimatedButton title={loading ? "Transformation..." : "Transformer en mème"} onPress={generate} loading={loading} disabled={loading} size="lg" style={{ marginTop: spacing.md }} />
          </GlassCard>
        )}

        {loading && (
          <GlassCard animate style={[styles.card, { alignItems: "center", gap: spacing.sm }]}>
            <ActivityIndicator color={colors.duoGreen} size="large" />
            <Text style={styles.loadTitle}>Remix vocal en cours</Text>
            <Text style={styles.loadSub}>1 appel texte + 1 appel image — pipeline optimisé.</Text>
          </GlassCard>
        )}

        {meme && (
          <Animated.View style={{ opacity: resultAnim, transform: [{ translateY: resultAnim.interpolate({ inputRange: [0, 1], outputRange: [24, 0] }) }] }}>
            <GlassCard style={styles.card}>
              <View style={styles.badge}><Text style={[styles.badgeText, { color: colors.duoGreenDark }]}>✅ MÈME VOCAL PRÊT</Text></View>
              {meme.imageUrl ? (
                <View style={styles.memeScene}>
                  <Text style={{ fontSize: 12, color: colors.silver }}>Image ({meme.imageProvider})</Text>
                </View>
              ) : null}
              <View style={styles.memeBox}>
                <Text style={styles.memeText}>{meme.topText}</Text>
                <Text style={styles.memeText}>{meme.bottomText}</Text>
              </View>
            </GlassCard>
          </Animated.View>
        )}
        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#ffffff" },
  scroll: { paddingHorizontal: spacing.md, paddingTop: 80 },
  hero: { padding: spacing.lg, marginBottom: spacing.md },
  badge: { backgroundColor: colors.duoGreenLight, borderRadius: radius.pill, paddingHorizontal: 10, paddingVertical: 4, alignSelf: "flex-start", marginBottom: 10 },
  badgeText: { fontSize: 10, fontWeight: "800", color: colors.duoGreenDark, letterSpacing: 1 },
  title: { fontSize: 32, fontWeight: "900", color: colors.almostBlack, letterSpacing: -0.5 },
  sub: { fontSize: 14, color: colors.graphite, marginTop: 6, lineHeight: 20 },
  card: { marginBottom: spacing.md, padding: spacing.md },
  label: { fontSize: 11, fontWeight: "800", color: colors.silver, letterSpacing: 1.5, marginBottom: 8 },
  wave: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 4, height: 60, width: "100%" },
  waveBar: { width: 5, height: 44, borderRadius: 5 },
  durationText: { fontSize: 18, fontWeight: "800", letterSpacing: 2 },
  micBtn: { width: 96, height: 96, borderRadius: 48, alignItems: "center", justifyContent: "center", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.35, shadowRadius: 0, elevation: 4 },
  micIcon: { fontSize: 38 },
  hint: { textAlign: "center", fontSize: 13, color: colors.silver, lineHeight: 19, paddingHorizontal: spacing.sm },
  transcript: { fontSize: 16, color: colors.almostBlack, fontStyle: "italic", lineHeight: 24, fontWeight: "600" },
  loadTitle: { fontSize: 17, fontWeight: "800", color: colors.almostBlack },
  loadSub: { textAlign: "center", fontSize: 13, color: colors.silver, lineHeight: 18 },
  memeBox: { borderWidth: 2, borderColor: colors.cloudGray, borderRadius: radius.md, padding: spacing.md, alignItems: "center", marginBottom: spacing.md, backgroundColor: colors.bgSecondary },
  memeText: { fontSize: 17, fontWeight: "900", textTransform: "uppercase", textAlign: "center", color: colors.almostBlack, lineHeight: 22 },
  memeScene: { marginVertical: spacing.md, width: "100%", minHeight: 60, alignItems: "center", justifyContent: "center" },
});

export default VoiceToMemeScreen;
