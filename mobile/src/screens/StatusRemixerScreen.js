import React, { useMemo, useRef, useState } from "react";
import { View, Text, StyleSheet, ScrollView, SafeAreaView, Animated, TouchableOpacity, TextInput, Alert, Image, ActivityIndicator, StatusBar } from "react-native";
import axios from "axios";
import { spacing, radius } from "../theme";
import { colors } from "../theme/tokens";
import GlassCard from "../components/GlassCard";
import AnimatedButton from "../components/AnimatedButton";
import CompanionAvatar from "../components/CompanionAvatar";
import { apiUrl } from "../config/api";

const FILTERS = [
  { id: "none", label: "Original", emoji: "📷" },
  { id: "dramatic", label: "Dramatic", emoji: "🌑" },
  { id: "neon", label: "Neon", emoji: "💫" },
  { id: "vintage", label: "Vintage", emoji: "🎞️" },
  { id: "fire", label: "Fire", emoji: "🔥" },
];

const POSITIONS = ["top", "center", "bottom"];

const StatusRemixerScreen = ({ navigate }) => {
  const [filter, setFilter]       = useState("none");
  const [caption, setCaption]     = useState("");
  const [position, setPosition]   = useState("bottom");
  const [imagePicked, setImagePicked] = useState(false);
  const [loading, setLoading]     = useState(false);
  const [remix, setRemix]         = useState(null);
  const [msg, setMsg]             = useState("Envoie un visuel ou une intention. Je m'occupe du reste.");
  const previewAnim               = useRef(new Animated.Value(0)).current;

  const overlay = useMemo(() => ({
    dramatic: "rgba(0,0,0,0.55)", neon: "rgba(34,211,238,0.22)",
    vintage: "rgba(193,132,79,0.24)", fire: "rgba(239,68,68,0.28)",
  }[filter] || "transparent"), [filter]);

  const pickImage = () => {
    Alert.alert("Image source", "Choisir depuis :", [
      { text: "📷 Caméra", onPress: () => { setImagePicked(true); animatePreview(); } },
      { text: "🖼️ Galerie", onPress: () => { setImagePicked(true); animatePreview(); } },
      { text: "Annuler", style: "cancel" },
    ]);
  };

  const animatePreview = () => {
    setMsg("Base visuelle chargée. On va construire une vraie publication.");
    Animated.spring(previewAnim, { toValue: 1, tension: 70, friction: 8, useNativeDriver: true }).start();
  };

  const askRemix = async () => {
    if (!imagePicked && !caption.trim()) { Alert.alert("Viral Stick", "Charge une image ou décris une idée."); return; }
    setLoading(true); setRemix(null); setMsg("Je cherche une caption social-first...");
    try {
      const res = await axios.post(apiUrl("/api/memes/status-remixer"), {
        text: caption || "Image de réaction expressive à transformer en mème",
        imageContext: imagePicked ? `Filtre: ${filter}. Position: ${position}.` : undefined,
      });
      setRemix(res.data);
      if (res.data?.meme_text) setCaption(res.data.meme_text);
      setMsg(res.data?.companionComment || "Remix prêt. Caption et édition alignés.");
    } catch {
      setMsg("Le remix IA n'a pas répondu. Réessaie.");
      Alert.alert("Erreur", "Connexion backend impossible.");
    } finally { setLoading(false); }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <GlassCard animate style={styles.hero}>
          <View style={styles.badge}><Text style={styles.badgeText}>MODULE 03 · VISUAL REMIX</Text></View>
          <Text style={styles.title}>Status <Text style={{ color: colors.bio }}>Remixer</Text></Text>
          <Text style={styles.sub}>Passe d'un visuel brut à une publication mieux cadrée et plus lisible.</Text>
          <View style={{ alignItems: "center", marginTop: spacing.md }}>
            <CompanionAvatar companion="bio" size={96} floating message={msg} />
          </View>
        </GlassCard>

        {!imagePicked ? (
          <GlassCard animate delay={80} style={styles.card}>
            <Text style={styles.label}>SOURCE VISUELLE</Text>
            <Text style={styles.sectionTitle}>Charge une image à remixer</Text>
            <Text style={styles.sectionSub}>Caméra ou galerie — l'IA analyse le contexte et génère la meilleure caption.</Text>
            <AnimatedButton title="Choisir une image" onPress={pickImage} size="lg" style={{ marginTop: spacing.md }} />
            <AnimatedButton title="Utiliser une image démo" onPress={() => { setImagePicked(true); animatePreview(); }} variant="ghost" size="lg" style={{ marginTop: spacing.sm }} />
          </GlassCard>
        ) : (
          <>
            <Animated.View style={{ opacity: previewAnim, transform: [{ scale: previewAnim.interpolate({ inputRange: [0,1], outputRange: [0.93,1] }) }] }}>
              <GlassCard style={styles.card}>
                <Text style={styles.label}>CANVAS</Text>
                <View style={styles.canvas}>
                  <View style={[StyleSheet.absoluteFill, { backgroundColor: overlay, borderRadius: radius.md }]} pointerEvents="none" />
                  {remix?.imageUrl ? (
                    <Image source={{ uri: remix.imageUrl }} style={styles.canvasImg} resizeMode="cover" />
                  ) : (
                    <View style={styles.canvasPlaceholder}>
                      <Text style={{ fontSize: 56 }}>{filter === "fire" ? "🔥" : filter === "neon" ? "💫" : "📸"}</Text>
                      <Text style={styles.canvasLabel}>Visuel de démonstration</Text>
                    </View>
                  )}
                  {!!caption && (
                    <Text style={[styles.overlay, position === "top" ? styles.top : position === "center" ? styles.center : styles.bottom]}>
                      {caption.toUpperCase()}
                    </Text>
                  )}
                </View>
              </GlassCard>
            </Animated.View>

            <GlassCard animate delay={100} style={styles.card}>
              <Text style={styles.label}>ÉDITION</Text>
              <Text style={styles.sectionTitle}>Caption principale</Text>
              <TextInput
                style={styles.input} value={caption} onChangeText={setCaption}
                placeholder="Caption courte et percutante..."
                placeholderTextColor={colors.silver} multiline
              />

              <Text style={[styles.sectionTitle, { marginTop: spacing.md }]}>Filtre</Text>
              <View style={styles.filterRow}>
                {FILTERS.map((f) => (
                  <TouchableOpacity
                    key={f.id} onPress={() => setFilter(f.id)}
                    style={[styles.filterChip, { backgroundColor: filter === f.id ? colors.duoGreenLight : colors.bgSecondary, borderColor: filter === f.id ? colors.duoGreen : colors.cloudGray }]}
                  >
                    <Text>{f.emoji}</Text>
                    <Text style={[styles.filterLabel, { color: filter === f.id ? colors.duoGreenDark : colors.graphite }]}>{f.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={[styles.sectionTitle, { marginTop: spacing.md }]}>Position du texte</Text>
              <View style={styles.posRow}>
                {POSITIONS.map((p) => (
                  <TouchableOpacity
                    key={p} onPress={() => setPosition(p)}
                    style={[styles.posBtn, { backgroundColor: position === p ? `${colors.bio}18` : colors.bgSecondary, borderColor: position === p ? colors.bio : colors.cloudGray }]}
                  >
                    <Text style={[styles.posLabel, { color: position === p ? colors.bio : colors.charcoal }]}>
                      {p === "top" ? "Haut" : p === "center" ? "Centre" : "Bas"}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </GlassCard>

            <View style={styles.actions}>
              <AnimatedButton title={loading ? "Remix IA..." : "Remixer avec l'IA"} onPress={askRemix} loading={loading} disabled={loading} size="lg" style={{ flex: 1 }} />
              <AnimatedButton title="Exporter" onPress={() => Alert.alert("Viral Stick", "Export PNG à finaliser côté pipeline.")} variant="ghost" size="lg" style={{ flex: 1 }} />
            </View>

            {loading && (
              <GlassCard animate style={[styles.card, { alignItems: "center", gap: spacing.sm }]}>
                <ActivityIndicator color={colors.bio} size="large" />
                <Text style={styles.loadTitle}>Direction visuelle en cours</Text>
                <Text style={styles.loadSub}>Recherche caption social-first et améliorations de cadrage.</Text>
              </GlassCard>
            )}

            {remix && (
              <GlassCard style={styles.card}>
                <View style={styles.badge}><Text style={[styles.badgeText, { color: colors.duoGreenDark }]}>✅ RECOMMANDATIONS IA</Text></View>
                <Text style={[styles.sectionTitle, { marginBottom: spacing.md }]}>{remix.meme_text || caption || "Caption prête"}</Text>
                {(remix.visual_enhancements || []).map((item, i) => (
                  <View key={i} style={styles.enhancement}>
                    <Text style={[styles.enhIdx, { color: colors.bio }]}>{i + 1}</Text>
                    <Text style={styles.enhText}>{item}</Text>
                  </View>
                ))}
              </GlassCard>
            )}
          </>
        )}
        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe:         { flex: 1, backgroundColor: "#ffffff" },
  scroll:       { paddingHorizontal: spacing.md, paddingTop: 80 },
  hero:         { padding: spacing.lg, marginBottom: spacing.md },
  badge:        { backgroundColor: colors.duoGreenLight, borderRadius: radius.pill, paddingHorizontal: 10, paddingVertical: 4, alignSelf: "flex-start", marginBottom: 10 },
  badgeText:    { fontSize: 10, fontWeight: "800", color: colors.duoGreenDark, letterSpacing: 1 },
  title:        { fontSize: 32, fontWeight: "900", color: colors.almostBlack, letterSpacing: -0.5 },
  sub:          { fontSize: 14, color: colors.graphite, marginTop: 6, lineHeight: 20 },
  card:         { marginBottom: spacing.md },
  label:        { fontSize: 11, fontWeight: "800", color: colors.silver, letterSpacing: 1.5, marginBottom: 8 },
  sectionTitle: { fontSize: 16, fontWeight: "800", color: colors.almostBlack, marginBottom: 6 },
  sectionSub:   { fontSize: 13, color: colors.graphite, lineHeight: 19, marginBottom: spacing.sm },
  canvas:       { borderWidth: 2, borderColor: colors.cloudGray, borderRadius: radius.md, minHeight: 280, overflow: "hidden", justifyContent: "center", alignItems: "center", position: "relative" },
  canvasImg:    { ...StyleSheet.absoluteFillObject, width: "100%", height: "100%" },
  canvasPlaceholder: { alignItems: "center", justifyContent: "center" },
  canvasLabel:  { fontSize: 13, color: colors.silver, marginTop: 8 },
  overlay:      { position: "absolute", left: 16, right: 16, color: "#ffffff", fontSize: 20, fontWeight: "900", textAlign: "center", textTransform: "uppercase", textShadowColor: "rgba(0,0,0,0.8)", textShadowOffset: { width: 0, height: 2 }, textShadowRadius: 6 },
  top:          { top: 16 },
  center:       { top: "44%" },
  bottom:       { bottom: 16 },
  input:        { borderWidth: 2, borderColor: colors.cloudGray, borderRadius: radius.md, padding: spacing.md, fontSize: 15, color: colors.almostBlack, minHeight: 80, backgroundColor: colors.bgSecondary, textAlignVertical: "top" },
  filterRow:    { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm },
  filterChip:   { flexDirection: "row", alignItems: "center", gap: 6, borderWidth: 2, borderRadius: radius.md, paddingHorizontal: 12, paddingVertical: 9 },
  filterLabel:  { fontSize: 13, fontWeight: "700" },
  posRow:       { flexDirection: "row", gap: spacing.sm },
  posBtn:       { flex: 1, borderWidth: 2, borderRadius: radius.md, paddingVertical: 11, alignItems: "center" },
  posLabel:     { fontSize: 14, fontWeight: "800" },
  actions:      { flexDirection: "row", gap: spacing.sm, marginBottom: spacing.md },
  loadTitle:    { fontSize: 17, fontWeight: "800", color: colors.almostBlack },
  loadSub:      { textAlign: "center", fontSize: 13, color: colors.silver, lineHeight: 18 },
  enhancement:  { flexDirection: "row", alignItems: "flex-start", gap: spacing.sm, padding: spacing.md, backgroundColor: colors.bgSecondary, borderRadius: radius.md, marginBottom: spacing.sm },
  enhIdx:       { fontSize: 15, fontWeight: "900", minWidth: 18 },
  enhText:      { flex: 1, fontSize: 13, color: colors.charcoal, lineHeight: 19 },
});

export default StatusRemixerScreen;
