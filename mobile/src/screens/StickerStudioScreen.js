import React, { useState } from "react";
import {
  View, Text, StyleSheet, ScrollView, SafeAreaView, TextInput,
  TouchableOpacity, Image, ActivityIndicator, Alert, StatusBar,
} from "react-native";
import axios from "axios";
import { spacing, radius } from "../theme";
import { colors } from "../theme/tokens";
import GlassCard from "../components/GlassCard";
import AnimatedButton from "../components/AnimatedButton";
import CompanionAvatar from "../components/CompanionAvatar";
import { apiUrl } from "../config/api";

const pickImage = () =>
  new Promise((resolve) => {
    Alert.alert(
      "Choisir une image",
      "Colle l'URL d'une image (hébergée en ligne)",
      [
        { text: "Annuler", style: "cancel", onPress: () => resolve(null) },
        {
          text: "URL exemple",
          onPress: () => resolve("https://via.placeholder.com/512/58CC02/ffffff?text=Sticker"),
        },
      ]
    );
  });

const StickerStudioScreen = () => {
  const [stickerUri, setStickerUri] = useState(null);
  const [faceUri, setFaceUri] = useState(null);
  const [instruction, setInstruction] = useState("");
  const [topText, setTopText] = useState("");
  const [bottomText, setBottomText] = useState("");
  const [outputFormat, setOutputFormat] = useState("png");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const selectSticker = async () => {
    const uri = await pickImage();
    if (uri) setStickerUri(uri);
  };

  const selectFace = async () => {
    const uri = await pickImage();
    if (uri) setFaceUri(uri);
  };

  const generate = async () => {
    if (!stickerUri) {
      Alert.alert("Viral Stick", "Sélectionne d'abord un sticker.");
      return;
    }
    setLoading(true);
    setResult(null);
    try {
      const form = new FormData();
      form.append("sticker", { uri: stickerUri, type: "image/png", name: "sticker.png" });
      if (faceUri) {
        form.append("face", { uri: faceUri, type: "image/jpeg", name: "face.jpg" });
      }
      form.append("instruction", instruction);
      form.append("topText", topText);
      form.append("bottomText", bottomText);
      form.append("outputFormat", outputFormat);
      form.append("animation", "bounce");

      const res = await axios.post(apiUrl("/api/sticker/studio"), form, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setResult(res.data);
    } catch (e) {
      Alert.alert("Erreur", e.response?.data?.error || "Studio sticker indisponible.");
    }
    setLoading(false);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <GlassCard animate style={styles.hero}>
          <View style={styles.badge}><Text style={styles.badgeText}>MODULE 04 · STICKER STUDIO</Text></View>
          <Text style={styles.title}>Sticker <Text style={{ color: colors.duoGreen }}>Studio</Text></Text>
          <Text style={styles.sub}>Colle un visage sur ton sticker et exporte en PNG ou GIF.</Text>
          <CompanionAvatar companion="art" size={80} floating message="Art t'aide à composer le sticker parfait." />
        </GlassCard>

        <GlassCard style={styles.card}>
          <Text style={styles.label}>STICKER DE BASE</Text>
          <AnimatedButton title={stickerUri ? "Changer le sticker" : "Choisir un sticker"} onPress={selectSticker} />
          {stickerUri ? <Image source={{ uri: stickerUri }} style={styles.preview} /> : null}
        </GlassCard>

        <GlassCard style={styles.card}>
          <Text style={styles.label}>VISAGE (OPTIONNEL)</Text>
          <AnimatedButton title={faceUri ? "Changer le visage" : "Ajouter un visage"} onPress={selectFace} variant="secondary" />
          {faceUri ? <Image source={{ uri: faceUri }} style={styles.preview} /> : null}
        </GlassCard>

        <GlassCard style={styles.card}>
          <Text style={styles.label}>INSTRUCTIONS</Text>
          <TextInput
            value={instruction}
            onChangeText={setInstruction}
            placeholder="Décris ce que le modèle doit faire..."
            style={styles.input}
            multiline
          />
          <TextInput value={topText} onChangeText={setTopText} placeholder="Texte haut" style={[styles.input, { marginTop: 8 }]} />
          <TextInput value={bottomText} onChangeText={setBottomText} placeholder="Texte bas" style={[styles.input, { marginTop: 8 }]} />
        </GlassCard>

        <GlassCard style={styles.card}>
          <Text style={styles.label}>FORMAT D'EXPORT</Text>
          <View style={styles.formatRow}>
            {["png", "gif"].map((f) => (
              <TouchableOpacity
                key={f}
                onPress={() => setOutputFormat(f)}
                style={[styles.formatBtn, outputFormat === f && styles.formatBtnActive]}
              >
                <Text style={[styles.formatText, outputFormat === f && { color: "#fff" }]}>{f.toUpperCase()}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <AnimatedButton
            title={loading ? "Génération..." : `Exporter en ${outputFormat.toUpperCase()}`}
            onPress={generate}
            loading={loading}
            disabled={loading}
            size="lg"
            style={{ marginTop: spacing.md }}
          />
        </GlassCard>

        {loading && (
          <GlassCard style={[styles.card, { alignItems: "center" }]}>
            <ActivityIndicator color={colors.duoGreen} size="large" />
            <Text style={styles.loadText}>Composition en cours...</Text>
          </GlassCard>
        )}

        {result?.dataUrl && (
          <GlassCard style={styles.card}>
            <Text style={styles.label}>RÉSULTAT</Text>
            <Image source={{ uri: result.dataUrl }} style={styles.result} />
            <Text style={styles.resultMeta}>
              {result.width}×{result.height} · {result.format?.toUpperCase()}
              {result.frames ? ` · ${result.frames} frames` : ""}
            </Text>
          </GlassCard>
        )}
        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#ffffff" },
  scroll: { paddingHorizontal: spacing.md, paddingTop: 80 },
  hero: { padding: spacing.lg, marginBottom: spacing.md, alignItems: "center" },
  badge: { backgroundColor: colors.duoGreenLight, borderRadius: radius.pill, paddingHorizontal: 10, paddingVertical: 4, alignSelf: "flex-start", marginBottom: 10 },
  badgeText: { fontSize: 10, fontWeight: "800", color: colors.duoGreenDark, letterSpacing: 1 },
  title: { fontSize: 32, fontWeight: "900", color: colors.almostBlack },
  sub: { fontSize: 14, color: colors.graphite, marginTop: 6, lineHeight: 20, textAlign: "center" },
  card: { marginBottom: spacing.md, padding: spacing.md },
  label: { fontSize: 11, fontWeight: "800", color: colors.silver, letterSpacing: 1.5, marginBottom: 10 },
  input: { borderWidth: 2, borderColor: colors.cloudGray, borderRadius: radius.md, padding: spacing.md, fontSize: 15, color: colors.almostBlack, backgroundColor: colors.bgSecondary, minHeight: 44 },
  preview: { width: "100%", height: 180, marginTop: spacing.md, borderRadius: radius.md, backgroundColor: colors.bgSecondary },
  formatRow: { flexDirection: "row", gap: spacing.sm },
  formatBtn: { flex: 1, padding: 12, borderRadius: radius.md, borderWidth: 2, borderColor: colors.cloudGray, alignItems: "center" },
  formatBtnActive: { backgroundColor: colors.duoGreen, borderColor: colors.duoGreenDark },
  formatText: { fontWeight: "800", color: colors.charcoal },
  loadText: { marginTop: spacing.sm, fontWeight: "700", color: colors.silver },
  result: { width: "100%", height: 280, borderRadius: radius.md, backgroundColor: colors.bgSecondary },
  resultMeta: { marginTop: 8, fontSize: 12, color: colors.silver, fontWeight: "700", textAlign: "center" },
});

export default StickerStudioScreen;
