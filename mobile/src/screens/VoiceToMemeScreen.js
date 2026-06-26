import React, { useEffect, useRef, useState } from "react";
import { View, Text, StyleSheet, ScrollView, SafeAreaView, Animated, TouchableOpacity, Alert, ActivityIndicator, Image } from "react-native";
import axios from "axios";
import { spacing, radius } from "../theme/tokens";
import { colors } from "../theme/tokens";
import GlassCard from "../components/GlassCard";
import AnimatedButton from "../components/AnimatedButton";
import CompanionAvatar from "../components/CompanionAvatar";
import { apiUrl } from "../config/api";

const DEMOS = [
  "Je voulais juste faire une sieste et je me suis réveillé avec 43 appels manqués.",
  "J'ai dit à tous que j'avais fini le projet alors que j'avais juste renommé le dossier.",
  "Ma connexion coupe toujours quand je commence à avoir raison dans le débat.",
];

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
    } else {
      Animated.timing(anim, { toValue: 0.25, duration: 160, useNativeDriver: true }).start();
    }
  }, [active, anim, index]);
  return <Animated.View style={[styles.waveBar, { transform: [{ scaleY: anim }], backgroundColor: colors.duoGreen }]} />;
};

const VoiceToMemeScreen = ({ navigate }) => {
  const [recording, setRecording]     = useState(false);
  const [transcription, setTranscription] = useState("");
  const [meme, setMeme]               = useState(null);
  const [loading, setLoading]         = useState(false);
  const [duration, setDuration]       = useState(0);
  const [published, setPublished]     = useState(false);
  const [msg, setMsg]                 = useState("Donne-moi une phrase dite à chaud. Je garde l'énergie.");
  const timerRef                      = useRef(null);
  const micScale                      = useRef(new Animated.Value(1)).current;
  const resultAnim                    = useRef(new Animated.Value(0)).current;

  useEffect(() => () => clearInterval(timerRef.current), []);

  const startRec = () => {
    setRecording(true); setTranscription(""); setMeme(null); setDuration(0); setPublished(false);
    setMsg("Parle comme tu le sens. Plus c'est spontané, mieux c'est.");
    Animated.loop(Animated.sequence([
      Animated.timing(micScale, { toValue: 1.12, duration: 500, useNativeDriver: true }),
      Animated.timing(micScale, { toValue: 1,    duration: 500, useNativeDriver: true }),
    ])).start();
    timerRef.current = setInterval(() => setDuration((d) => d + 1), 1000);
  };

  const stopRec = () => {
    setRecording(false); micScale.stopAnimation(); micScale.setValue(1);
    clearInterval(timerRef.current);
    setMsg("Transcription en cours...");
    setTimeout(() => {
      const s = DEMOS[Math.floor(Math.random() * DEMOS.length)];
      setTranscription(s); setMsg("Transcription prête. Lance la transformation !");
    }, 1200);
  };

  const generate = async () => {
    if (!transcription.trim()) { Alert.alert("Viral Stick", "Enregistre d'abord une prise."); return; }
    setLoading(true); setMeme(null); setMsg("Je construis la chute à partir de ton énergie vocale...");
    try {
      const res = await axios.post(apiUrl("/api/memes/voice-to-meme"), { transcription });
      setMeme(res.data);
      setMsg(res.data?.companionComment || "L'énergie est préservée. Mème prêt !");
      resultAnim.setValue(0);
      Animated.spring(resultAnim, { toValue: 1, tension: 70, friction: 8, useNativeDriver: true }).start();
    } catch {
      setMsg("Le module vocal n'a pas répondu. Relance.");
      Alert.alert("Erreur", "Connexion backend impossible.");
    } finally { setLoading(false); }
  };

  const publishToForum = async () => {
    if (!meme || published) return;
    try {
      const res = await axios.post(apiUrl("/api/forum/publish"), {
        shareId: meme.share?.shareId,
        imageUrl: meme.share?.publicUrl || meme.imageUrl,
        topText: meme.topText,
        bottomText: meme.bottomText
      });
      setPublished(true);
      Alert.alert("Succès", "Mème vocal propulsé sur le Forum !");
    } catch (e) {
      const errorMsg = e.response?.data?.error || e.message;
      Alert.alert("Erreur publication", errorMsg);
    }
  };

  const fmt = (s) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  return (
    <SafeAreaView style={styles.safe}>
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
            {recording ? "Parle naturellement. Le mème naît de la spontanéité." : "Appuie pour démarrer une prise démo, puis transforme en mème."}
          </Text>
        </GlassCard>

        {transcription.length > 0 && (
          <GlassCard animate delay={100} style={styles.card}>
            <Text style={styles.label}>TRANSCRIPTION</Text>
            <Text style={[styles.transcript]}>"{transcription}"</Text>
            <AnimatedButton title={loading ? "Transformation..." : "Transformer en mème"} onPress={generate} loading={loading} disabled={loading} size="lg" style={{ marginTop: spacing.md }} />
          </GlassCard>
        )}

        {loading && (
          <View style={[styles.card, { alignItems: "center", gap: spacing.sm }]}>
            <ActivityIndicator color={colors.duoGreen} size="large" />
            <Text style={styles.loadTitle}>Remix vocal en cours</Text>
            <Text style={styles.loadSub}>Préservation de la spontanéité et recherche de la meilleure chute.</Text>
          </View>
        )}

        {meme && (
          <Animated.View style={{ opacity: resultAnim, transform: [{ translateY: resultAnim.interpolate({ inputRange: [0,1], outputRange: [24,0] }) }] }}>
            <GlassCard style={styles.card}>
              <View style={styles.badge}><Text style={[styles.badgeText, { color: colors.duoGreenDark }]}>✅ MÈME VOCAL PRÊT</Text></View>
              <View style={styles.memePreview}>
                <Image source={{ uri: meme.imageUrl }} style={styles.fullMeme} resizeMode="contain" />
              </View>
              {meme.original_transcript_subtitle ? (
                <View style={styles.subtitleCard}>
                  <Text style={styles.gridLabel}>SOUS-TITRE ORIGINAL</Text>
                  <Text style={styles.subtitleText}>"{meme.original_transcript_subtitle}"</Text>
                </View>
              ) : null}
              <View style={styles.actions}>
                <AnimatedButton title="Partager" onPress={() => Alert.alert("Partage", "Lien: " + meme.share?.publicUrl)} size="lg" style={{ flex: 1 }} />
                {!published ? (
                  <AnimatedButton title="Propulser 🌍" onPress={publishToForum} size="lg" variant="primary" style={{ flex: 1, backgroundColor: colors.duoGreen }} />
                ) : (
                  <View style={styles.publishedBadge}><Text style={styles.publishedText}>✅ PUBLIÉ</Text></View>
                )}
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
  safe:        { flex: 1, backgroundColor: "#ffffff" },
  scroll:      { paddingHorizontal: spacing.md, paddingTop: spacing.md },
  hero:        { padding: spacing.lg, marginBottom: spacing.md },
  badge:       { backgroundColor: colors.duoGreenLight, borderRadius: radius.pill, paddingHorizontal: 10, paddingVertical: 4, alignSelf: "flex-start", marginBottom: 10 },
  badgeText:   { fontSize: 10, fontWeight: "800", color: colors.duoGreenDark, letterSpacing: 1 },
  title:       { fontSize: 32, fontWeight: "900", color: colors.almostBlack, letterSpacing: -0.5 },
  sub:         { fontSize: 14, color: colors.graphite, marginTop: 6, lineHeight: 20 },
  card:        { marginBottom: spacing.md, padding: spacing.md },
  label:       { fontSize: 11, fontWeight: "800", color: colors.silver, letterSpacing: 1.5, marginBottom: 8 },
  wave:        { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 4, height: 60, width: "100%" },
  waveBar:     { width: 5, height: 44, borderRadius: 5 },
  durationText:{ fontSize: 18, fontWeight: "800", letterSpacing: 2 },
  micBtn:      { width: 96, height: 96, borderRadius: 48, alignItems: "center", justifyContent: "center", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.35, shadowRadius: 0, elevation: 4 },
  micIcon:     { fontSize: 38 },
  hint:        { textAlign: "center", fontSize: 13, color: colors.silver, lineHeight: 19, paddingHorizontal: spacing.sm },
  transcript:  { fontSize: 16, color: colors.almostBlack, fontStyle: "italic", lineHeight: 24, fontWeight: "600" },
  loadTitle:   { fontSize: 17, fontWeight: "800", color: colors.almostBlack },
  loadSub:     { textAlign: "center", fontSize: 13, color: colors.silver, lineHeight: 18 },
  memePreview: { borderWidth: 2, borderColor: colors.cloudGray, borderRadius: radius.md, overflow: 'hidden', marginBottom: spacing.md, backgroundColor: colors.almostBlack },
  fullMeme:    { width: '100%', aspectRatio: 1 },
  subtitleCard:{ padding: spacing.md, backgroundColor: colors.bgSecondary, borderRadius: radius.md, borderWidth: 2, borderColor: colors.cloudGray, marginBottom: spacing.md },
  gridLabel:   { fontSize: 11, fontWeight: "800", color: colors.silver, letterSpacing: 1, marginBottom: 6 },
  subtitleText:{ fontSize: 14, fontStyle: "italic", color: colors.charcoal, lineHeight: 19 },
  actions:     { flexDirection: "row", gap: spacing.sm },
  publishedBadge: { flex: 1, height: 54, borderRadius: radius.md, backgroundColor: colors.duoGreenLight, justifyContent: 'center', alignItems: 'center' },
  publishedText: { fontWeight: '900', color: colors.duoGreenDark }
});

export default VoiceToMemeScreen;
