import React, { useMemo, useRef, useState } from "react";
import { View, Text, TextInput, StyleSheet, ScrollView, SafeAreaView, Animated, Alert, Keyboard, ActivityIndicator, StatusBar } from "react-native";
import axios from "axios";
import { spacing, radius, typography } from "../theme";
import { colors } from "../theme/tokens";
import GlassCard from "../components/GlassCard";
import AnimatedButton from "../components/AnimatedButton";
import CompanionAvatar from "../components/CompanionAvatar";
import { apiUrl } from "../config/api";

const QUICK_IDEAS = [
  "Le prof arrive en retard à son propre cours et nous gronde quand même.",
  "Je dis que je vais dormir tôt puis je finis à scroller des reels à 2h43.",
  "J'envoie un message «simple» qui devient un drama de 17 paragraphes.",
];

const ContextReaderScreen = ({ navigate }) => {
  const [text, setText]       = useState("");
  const [meme, setMeme]       = useState(null);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg]         = useState("Décris une situation — je trouve l'angle le plus drôle.");
  const resultAnim            = useRef(new Animated.Value(0)).current;
  const progress              = useMemo(() => Math.min(text.trim().length / 220, 1), [text]);

  const generateMeme = async () => {
    if (!text.trim()) { Alert.alert("Viral Stick", "Entre une situation à transformer."); return; }
    Keyboard.dismiss(); setLoading(true); setMeme(null);
    setMsg("J'analyse le contexte et cherche la meilleure chute comique...");
    try {
      const res = await axios.post(apiUrl("/api/memes/generate-from-text"), { text });
      setMeme(res.data);
      setMsg(res.data?.companionComment || "Angle trouvé. Mème prêt !");
      resultAnim.setValue(0);
      Animated.spring(resultAnim, { toValue: 1, tension: 70, friction: 8, useNativeDriver: true }).start();
    } catch {
      setMsg("Le studio n'a pas pu générer. Relance avec plus de contexte.");
      Alert.alert("Erreur", "Connexion backend impossible.");
    } finally { setLoading(false); }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        {/* Hero */}
        <GlassCard animate style={styles.hero}>
          <View style={styles.badge}><Text style={styles.badgeText}>MODULE 01 · CONTEXT READER</Text></View>
          <Text style={styles.title}>Context <Text style={{ color: colors.art }}>Reader</Text></Text>
          <Text style={styles.sub}>Transforme une situation en mème drôle et postable.</Text>
          <View style={{ alignItems: "center", marginTop: spacing.md }}>
            <CompanionAvatar companion="art" size={96} floating message={msg} />
          </View>
        </GlassCard>

        {/* Formulaire */}
        <GlassCard animate delay={80} style={styles.card}>
          <Text style={styles.label}>Décris la scène ou la contradiction</Text>
          <TextInput
            style={styles.input}
            value={text} onChangeText={setText}
            placeholder="Ex: Mon pote dit «5 minutes» depuis 1h30…"
            placeholderTextColor={colors.silver}
            multiline numberOfLines={6} textAlignVertical="top" maxLength={500}
          />
          <View style={styles.meta}>
            <View style={styles.progressTrack}>
              <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
            </View>
            <Text style={styles.counter}>{text.length}/500</Text>
          </View>
          {/* Quick ideas */}
          <View style={{ gap: 6, marginTop: spacing.sm }}>
            {QUICK_IDEAS.map((idea) => (
              <Text key={idea} style={styles.quickIdea} onPress={() => setText(idea)}>{idea}</Text>
            ))}
          </View>
        </GlassCard>

        {/* Actions */}
        <View style={styles.actions}>
          <AnimatedButton title={loading ? "Génération..." : "Générer le mème"} onPress={generateMeme} loading={loading} disabled={loading} size="lg" style={{ flex: 1 }} />
          <AnimatedButton title="Reset" onPress={() => { setText(""); setMeme(null); }} variant="ghost" size="lg" style={{ flex: 1 }} />
        </View>

        {loading && (
          <GlassCard animate style={styles.loadCard}>
            <ActivityIndicator color={colors.duoGreen} size="large" />
            <Text style={styles.loadTitle}>Analyse en cours…</Text>
            <Text style={styles.loadSub}>Détection de l'angle comique et de la meilleure scène.</Text>
          </GlassCard>
        )}

        {meme && (
          <Animated.View style={{ opacity: resultAnim, transform: [{ translateY: resultAnim.interpolate({ inputRange: [0,1], outputRange: [24,0] }) }] }}>
            <GlassCard style={styles.card}>
              <View style={styles.badge}><Text style={[styles.badgeText, { color: colors.duoGreenDark }]}>✅ RÉSULTAT IA</Text></View>
              <View style={styles.memePreview}>
                <Text style={styles.memeText}>{meme.topText || ""}</Text>
                <View style={styles.memeScene}>
                  <Text style={{ fontSize: 40 }}>🎬</Text>
                  <Text style={styles.memeSceneText}>{meme.descriptionImage || "Scène en attente"}</Text>
                </View>
                <Text style={styles.memeText}>{meme.bottomText || ""}</Text>
              </View>
              <View style={styles.grid}>
                {[["TOP TEXT", meme.topText], ["BOTTOM TEXT", meme.bottomText]].map(([l, v]) => (
                  <View key={l} style={styles.gridItem}>
                    <Text style={styles.gridLabel}>{l}</Text>
                    <Text style={styles.gridValue}>{v}</Text>
                  </View>
                ))}
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
  scroll:      { paddingHorizontal: spacing.md, paddingTop: 80 },
  hero:        { padding: spacing.lg, marginBottom: spacing.md },
  badge:       { backgroundColor: colors.duoGreenLight, borderRadius: radius.pill, paddingHorizontal: 10, paddingVertical: 4, alignSelf: "flex-start", marginBottom: 10 },
  badgeText:   { fontSize: 10, fontWeight: "800", color: colors.duoGreenDark, letterSpacing: 1 },
  title:       { fontSize: 32, fontWeight: "900", color: colors.almostBlack, letterSpacing: -0.5 },
  sub:         { fontSize: 14, color: colors.graphite, marginTop: 6, lineHeight: 20 },
  card:        { marginBottom: spacing.md },
  label:       { fontSize: 14, fontWeight: "800", color: colors.charcoal, marginBottom: 8 },
  input:       { minHeight: 140, borderWidth: 2, borderColor: colors.cloudGray, borderRadius: radius.md, padding: spacing.md, fontSize: 15, color: colors.almostBlack, backgroundColor: colors.bgSecondary },
  meta:        { flexDirection: "row", alignItems: "center", gap: spacing.sm, marginTop: 8 },
  progressTrack:{ flex: 1, height: 6, backgroundColor: colors.cloudGray, borderRadius: radius.pill, overflow: "hidden" },
  progressFill: { height: "100%", backgroundColor: colors.duoGreen, borderRadius: radius.pill },
  counter:     { fontSize: 12, fontWeight: "700", color: colors.silver },
  quickIdea:   { borderWidth: 2, borderColor: colors.cloudGray, borderRadius: radius.md, padding: 10, fontSize: 13, color: colors.charcoal, backgroundColor: colors.bgSecondary },
  actions:     { flexDirection: "row", gap: spacing.sm, marginBottom: spacing.md },
  loadCard:    { alignItems: "center", gap: spacing.sm, marginBottom: spacing.md },
  loadTitle:   { fontSize: 17, fontWeight: "800", color: colors.almostBlack, marginTop: spacing.sm },
  loadSub:     { textAlign: "center", fontSize: 13, color: colors.silver, lineHeight: 18 },
  memePreview: { borderWidth: 2, borderColor: colors.cloudGray, borderRadius: radius.md, padding: spacing.md, alignItems: "center", marginBottom: spacing.md, backgroundColor: colors.bgSecondary },
  memeText:    { fontSize: 17, fontWeight: "900", textTransform: "uppercase", textAlign: "center", color: colors.almostBlack, lineHeight: 22 },
  memeScene:   { marginVertical: spacing.md, width: "100%", minHeight: 120, borderWidth: 2, borderColor: colors.cloudGray, borderRadius: radius.md, alignItems: "center", justifyContent: "center", padding: spacing.md, backgroundColor: "#ffffff" },
  memeSceneText:{ textAlign: "center", fontSize: 13, color: colors.graphite, lineHeight: 19, marginTop: 8 },
  grid:        { gap: spacing.sm },
  gridItem:    { padding: spacing.md, backgroundColor: colors.bgSecondary, borderRadius: radius.md, borderWidth: 2, borderColor: colors.cloudGray },
  gridLabel:   { fontSize: 11, fontWeight: "800", color: colors.silver, letterSpacing: 1, marginBottom: 6 },
  gridValue:   { fontSize: 14, fontWeight: "700", color: colors.almostBlack, lineHeight: 19 },
});

export default ContextReaderScreen;
