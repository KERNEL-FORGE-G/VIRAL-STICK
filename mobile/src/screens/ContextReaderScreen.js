import React, { useMemo, useRef, useState } from "react";
import { View, Text, TextInput, StyleSheet, ScrollView, SafeAreaView, Animated, Alert, Keyboard, ActivityIndicator, Image, StatusBar } from "react-native";
import axios from "axios";
import { useTheme, spacing, radius } from "../theme";
import GlassCard from "../components/GlassCard";
import AnimatedButton from "../components/AnimatedButton";
import CompanionAvatar from "../components/CompanionAvatar";
import AppIcon from "../components/AppIcon";
import { apiUrl } from "../config/api";
import { shareToWhatsApp, downloadImageToGallery } from "../utils/shareUtils";
import { memeDB, statsDB } from "../services/database";

const QUICK_IDEAS = [
  "Le prof arrive en retard à son propre cours et nous gronde quand même.",
  "Je dis que je vais dormir tôt puis je finis à scroller des reels à 2h43.",
  "J'envoie un message «simple» qui devient un drama de 17 paragraphes.",
];

const ContextReaderScreen = ({ navigate }) => {
  const { theme, isDark } = useTheme();
  const [text, setText]       = useState("");
  const [meme, setMeme]       = useState(null);
  const [loading, setLoading] = useState(false);
  const [published, setPublished] = useState(false);
  const [msg, setMsg]         = useState("Décris une situation — je trouve l'angle le plus drôle.");
  const [userId] = useState('demo_user'); // À remplacer par l'ID utilisateur réel
  const [editMode, setEditMode] = useState(false);
  const [editTopText, setEditTopText] = useState("");
  const [editBottomText, setEditBottomText] = useState("");
  const [regenerating, setRegenerating] = useState(false);
  const resultAnim            = useRef(new Animated.Value(0)).current;
  const progress              = useMemo(() => Math.min(text.trim().length / 220, 1), [text]);

  const generateMeme = async () => {
    if (!text.trim()) { Alert.alert("Viral Stick", "Entre une situation à transformer."); return; }
    Keyboard.dismiss(); setLoading(true); setMeme(null); setPublished(false); setEditMode(false);
    setMsg("J'analyse le contexte et cherche la meilleure chute comique...");
    
    const url = apiUrl("/api/memes/generate-from-text");
    console.log('[ContextReader] URL API:', url);
    console.log('[ContextReader] Text envoyé:', text);
    
    try {
      const res = await axios.post(url, { text });
      console.log('[ContextReader] Réponse API:', res.data);
      setMeme(res.data);
      setEditTopText(res.data.topText || "");
      setEditBottomText(res.data.bottomText || "");
      setMsg(res.data?.companionComment || "Angle trouvé. Mème prêt !");
      resultAnim.setValue(0);
      Animated.spring(resultAnim, { toValue: 1, tension: 70, friction: 8, useNativeDriver: true }).start();
      
      // Sauvegarder le mème dans SQLite
      await saveMemeToDB(res.data);
    } catch (error) {
      console.error('[ContextReader] Erreur API:', error);
      console.error('[ContextReader] Détails erreur:', error.response?.data || error.message);
      setMsg("Le studio n'a pas pu générer. Relance avec plus de contexte.");
      Alert.alert("Erreur", `Connexion backend impossible: ${error.message}`);
    } finally { setLoading(false); }
  };

  const regenerateMeme = async () => {
    if (!meme) return;
    setRegenerating(true);
    setMsg("Je fusionne ton texte en pied de page de l'image...");
    
    try {
      const url = apiUrl("/api/memes/compose");
      const res = await axios.post(url, {
        imageUrl: meme.imageUrl,
        topText: "",
        bottomText: editBottomText || editTopText // Utiliser bottomText pour le pied de page
      });
      console.log('[ContextReader] Régénération:', res.data);
      setMeme({ 
        ...meme, 
        composedImageUrl: res.data.composedImageUrl,
        share: res.data.share,
        topText: "",
        bottomText: editBottomText || editTopText
      });
      setMsg("Image fusionnée prête !");
      resultAnim.setValue(0);
      Animated.spring(resultAnim, { toValue: 1, tension: 70, friction: 8, useNativeDriver: true }).start();
      
      // Mettre à jour la base de données
      await saveMemeToDB({ 
        ...meme, 
        composedImageUrl: res.data.composedImageUrl,
        share: res.data.share,
        topText: "",
        bottomText: editBottomText || editTopText
      });
    } catch (error) {
      console.error('[ContextReader] Erreur régénération:', error);
      setMsg("Échec de la régénération. Réessaie.");
      Alert.alert("Erreur", "Impossible de régénérer le mème.");
    } finally {
      setRegenerating(false);
    }
  };

  const saveMemeToDB = async (memeData) => {
    try {
      const memeRecord = {
        id: memeData.id || `meme_${Date.now()}`,
        userId: userId,
        imageUrl: memeData.imageUrl,
        topText: memeData.topText,
        bottomText: memeData.bottomText,
        sourceType: 'context',
        shareId: memeData.share?.shareId,
        publicUrl: memeData.share?.publicUrl,
        published: false,
        likes: 0,
      };
      await memeDB.saveMeme(memeRecord);
      await statsDB.incrementMemesCreated(userId);
    } catch (error) {
      console.error('Erreur sauvegarde mème:', error);
    }
  };

  const publishToForum = async () => {
    if (!meme || published) return;
    try {
      await axios.post(apiUrl("/api/forum/publish"), {
        shareId: meme.share?.shareId,
        imageUrl: meme.composedImageUrl || meme.share?.publicUrl || meme.imageUrl,
        topText: meme.topText,
        bottomText: meme.bottomText
      });
      setPublished(true);
      Alert.alert("Succès", "Mème propulsé sur le Forum !");
      
      // Mettre à jour la base de données
      await memeDB.updateMemePublished(meme.id, true);
    } catch (e) {
      const errorMsg = e.response?.data?.error || e.message;
      Alert.alert("Erreur publication", errorMsg);
    }
  };

  const handleShareWhatsApp = async () => {
    const imageUrl = meme.composedImageUrl || meme.share?.publicUrl || meme.imageUrl;
    if (imageUrl) {
      await shareToWhatsApp(imageUrl, ''); // Pas de texte séparé, l'image contient déjà le texte fusionné
    }
  };

  const handleDownload = async () => {
    const imageUrl = meme.composedImageUrl || meme.share?.publicUrl || meme.imageUrl;
    if (imageUrl) {
      try {
        const savedPath = await downloadImageToGallery(imageUrl);
        Alert.alert('Succès', 'Image sauvegardée dans votre galerie !');
      } catch (error) {
        console.error('Erreur téléchargement:', error);
        Alert.alert('Erreur', 'Impossible de télécharger l\'image.');
      }
    }
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} backgroundColor={theme.background} />
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        {/* Hero */}
        <GlassCard style={styles.hero}>
          <View style={[styles.badge, { backgroundColor: theme.secondaryLight }]}><Text style={[styles.badgeText, { color: theme.secondary }]}>MODULE 01 · CONTEXT READER</Text></View>
          <Text style={[styles.title, { color: theme.textPrimary }]}>Context <Text style={{ color: theme.warning }}>Reader</Text></Text>
          <Text style={[styles.sub, { color: theme.textSecondary }]}>Transforme une situation en mème drôle et postable.</Text>
          <View style={{ alignItems: "center", marginTop: spacing.md }}>
            <CompanionAvatar companion="art" size={96} floating message={msg} showRing={false} />
          </View>
        </GlassCard>

        {/* Formulaire */}
        <GlassCard style={styles.card}>
          <Text style={[styles.label, { color: theme.textSecondary }]}>Décris la scène ou la contradiction</Text>
          <TextInput
            style={[styles.input, { backgroundColor: theme.backgroundSecondary, borderColor: theme.border, color: theme.textPrimary }]}
            value={text} onChangeText={setText}
            placeholder="Ex: Mon pote dit «5 minutes» depuis 1h30…"
            placeholderTextColor={theme.textMuted}
            multiline numberOfLines={6} textAlignVertical="top" maxLength={500}
          />
          <View style={styles.meta}>
            <View style={[styles.progressTrack, { backgroundColor: theme.border }]}>
              <View style={[styles.progressFill, { width: `${progress * 100}%`, backgroundColor: theme.secondary }]} />
            </View>
            <Text style={[styles.counter, { color: theme.textMuted }]}>{text.length}/500</Text>
          </View>
          <View style={{ gap: 6, marginTop: spacing.sm }}>
            {QUICK_IDEAS.map((idea) => (
              <Text key={idea} style={[styles.quickIdea, { backgroundColor: theme.backgroundSecondary, borderColor: theme.border, color: theme.textSecondary }]} onPress={() => setText(idea)}>{idea}</Text>
            ))}
          </View>
        </GlassCard>

        <View style={styles.actions}>
          <AnimatedButton title={loading ? "Génération..." : "Générer le mème"} onPress={generateMeme} loading={loading} disabled={loading} size="lg" style={{ flex: 1 }} />
          <AnimatedButton title="Reset" onPress={() => { setText(""); setMeme(null); }} variant="ghost" size="lg" style={{ flex: 1 }} />
        </View>

        {loading && (
          <GlassCard style={styles.loadCard}>
            <ActivityIndicator color={theme.secondary} size="large" />
            <Text style={[styles.loadTitle, { color: theme.textPrimary }]}>Analyse en cours…</Text>
            <Text style={[styles.loadSub, { color: theme.textMuted }]}>Détection de l'angle comique et de la meilleure scène.</Text>
          </GlassCard>
        )}

        {meme && (
          <Animated.View style={{ opacity: resultAnim, transform: [{ translateY: resultAnim.interpolate({ inputRange: [0,1], outputRange: [24,0] }) }] }}>
            <GlassCard style={styles.card}>
              <View style={[styles.badge, { backgroundColor: theme.secondaryLight }]}><Text style={[styles.badgeText, { color: theme.secondary }]}>✅ RÉSULTAT IA</Text></View>
              
              {!editMode ? (
                // Mode affichage normal
                <>
                  <View style={[styles.memePreview, { backgroundColor: theme.backgroundSecondary, borderColor: theme.border }]}>
                    {meme.composedImageUrl || meme.share?.imageDataUrl || meme.imageUrl ? (
                      <Image
                        source={{ uri: meme.composedImageUrl || meme.share?.imageDataUrl || meme.imageUrl }}
                        style={styles.fullMeme}
                        resizeMode="contain"
                      />
                    ) : (
                      <>
                        <Text style={[styles.memeText, { color: theme.textPrimary }]}>{meme.topText || ""}</Text>
                        <View style={[styles.memeScene, { backgroundColor: theme.backgroundCard, borderColor: theme.border }]}>
                          <AppIcon name="image" color={theme.primary} size={36} />
                          <Text style={[styles.memeSceneText, { color: theme.textSecondary }]}>{meme.descriptionImage || "Scène en attente"}</Text>
                        </View>
                        <Text style={[styles.memeText, { color: theme.textPrimary }]}>{meme.bottomText || ""}</Text>
                      </>
                    )}
                  </View>
                  <View style={styles.grid}>
                    {[["TOP TEXT", meme.topText], ["BOTTOM TEXT", meme.bottomText]].map(([l, v]) => (
                      <View key={l} style={[styles.gridItem, { backgroundColor: theme.backgroundSecondary, borderColor: theme.border }]}>
                        <Text style={[styles.gridLabel, { color: theme.textMuted }]}>{l}</Text>
                        <Text style={[styles.gridValue, { color: theme.textPrimary }]}>{v}</Text>
                      </View>
                    ))}
                  </View>
                  <View style={styles.actions}>
                    <AnimatedButton
                      title="Éditer"
                      onPress={() => setEditMode(true)}
                      size="lg"
                      variant="ghost"
                      style={{ flex: 1 }}
                    />
                    <AnimatedButton
                      title="Télécharger"
                      onPress={handleDownload}
                      size="lg"
                      style={{ flex: 1, backgroundColor: theme.primary }}
                    />
                    <AnimatedButton
                      title="WhatsApp"
                      onPress={handleShareWhatsApp}
                      size="lg"
                      style={{ flex: 1, backgroundColor: '#25D366' }}
                    />
                    {!published ? (
                      <AnimatedButton
                        title="Propulser"
                        onPress={publishToForum}
                        size="lg"
                        variant="primary"
                        style={{ flex: 1, backgroundColor: theme.secondary }}
                      />
                    ) : (
                      <View style={[styles.publishedBadge, { backgroundColor: theme.secondaryLight }]}>
                        <Text style={[styles.publishedText, { color: theme.secondary }]}>PUBLIÉ</Text>
                      </View>
                    )}
                  </View>
                </>
              ) : (
                // Mode édition
                <>
                  <View style={[styles.memePreview, { backgroundColor: theme.backgroundSecondary, borderColor: theme.border }]}>
                    {meme.composedImageUrl || meme.share?.imageDataUrl || meme.imageUrl ? (
                      <Image
                        source={{ uri: meme.composedImageUrl || meme.share?.imageDataUrl || meme.imageUrl }}
                        style={styles.fullMeme}
                        resizeMode="contain"
                      />
                    ) : (
                      <>
                        <Text style={[styles.memeText, { color: theme.textPrimary }]}>{meme.topText || ""}</Text>
                        <View style={[styles.memeScene, { backgroundColor: theme.backgroundCard, borderColor: theme.border }]}>
                          <AppIcon name="image" color={theme.primary} size={36} />
                          <Text style={[styles.memeSceneText, { color: theme.textSecondary }]}>{meme.descriptionImage || "Scène en attente"}</Text>
                        </View>
                        <Text style={[styles.memeText, { color: theme.textPrimary }]}>{meme.bottomText || ""}</Text>
                      </>
                    )}
                  </View>
                  
                  <View style={styles.editSection}>
                    <Text style={[styles.editLabel, { color: theme.textSecondary }]}>Texte du haut</Text>
                    <TextInput
                      style={[styles.editInput, { backgroundColor: theme.backgroundSecondary, borderColor: theme.border, color: theme.textPrimary }]}
                      value={editTopText}
                      onChangeText={setEditTopText}
                      placeholder="Texte du haut..."
                      placeholderTextColor={theme.textMuted}
                      maxLength={100}
                    />
                    
                    <Text style={[styles.editLabel, { color: theme.textSecondary }]}>Texte du bas</Text>
                    <TextInput
                      style={[styles.editInput, { backgroundColor: theme.backgroundSecondary, borderColor: theme.border, color: theme.textPrimary }]}
                      value={editBottomText}
                      onChangeText={setEditBottomText}
                      placeholder="Texte du bas..."
                      placeholderTextColor={theme.textMuted}
                      maxLength={100}
                    />
                  </View>
                  
                  <View style={styles.actions}>
                    <AnimatedButton
                      title="Annuler"
                      onPress={() => setEditMode(false)}
                      size="lg"
                      variant="ghost"
                      style={{ flex: 1 }}
                      disabled={regenerating}
                    />
                    <AnimatedButton
                      title={regenerating ? "Régénération..." : "Régénérer"}
                      onPress={regenerateMeme}
                      size="lg"
                      style={{ flex: 1 }}
                      disabled={regenerating}
                      loading={regenerating}
                    />
                  </View>
                </>
              )}
            </GlassCard>
          </Animated.View>
        )}
        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe:        { flex: 1 },
  scroll:      { paddingHorizontal: spacing.md, paddingTop: spacing.md },
  hero:        { padding: spacing.lg, marginBottom: spacing.md },
  badge:       { borderRadius: radius.pill, paddingHorizontal: 10, paddingVertical: 4, alignSelf: "flex-start", marginBottom: 10 },
  badgeText:   { fontSize: 10, fontWeight: "800", letterSpacing: 1 },
  title:       { fontSize: 32, fontWeight: "900", letterSpacing: -0.5 },
  sub:         { fontSize: 14, marginTop: 6, lineHeight: 20 },
  card:        { marginBottom: spacing.md },
  label:       { fontSize: 14, fontWeight: "800", marginBottom: 8 },
  input:       { minHeight: 140, borderWidth: 1, borderRadius: radius.md, padding: spacing.md, fontSize: 15 },
  meta:        { flexDirection: "row", alignItems: "center", gap: spacing.sm, marginTop: 8 },
  progressTrack:{ flex: 1, height: 6, borderRadius: radius.pill, overflow: "hidden" },
  progressFill: { height: "100%", borderRadius: radius.pill },
  counter:     { fontSize: 12, fontWeight: "700" },
  quickIdea:   { borderWidth: 1, borderRadius: radius.md, padding: 10, fontSize: 13, fontWeight: "600" },
  actions:     { flexDirection: "row", gap: spacing.sm, marginBottom: spacing.md },
  loadCard:    { alignItems: "center", gap: spacing.sm, marginBottom: spacing.md, padding: spacing.md },
  loadTitle:   { fontSize: 17, fontWeight: "800", marginTop: spacing.sm },
  loadSub:     { textAlign: "center", fontSize: 13, lineHeight: 18 },
  memePreview: { borderWidth: 1, borderRadius: radius.md, padding: spacing.md, alignItems: "center", marginBottom: spacing.md, overflow: "hidden" },
  fullMeme:    { width: "100%", aspectRatio: 1 },
  memeText:    { fontSize: 17, fontWeight: "900", textTransform: "uppercase", textAlign: "center", lineHeight: 22 },
  memeScene:   { marginVertical: spacing.md, width: "100%", minHeight: 120, borderWidth: 1, borderRadius: radius.md, alignItems: "center", justifyContent: "center", padding: spacing.md },
  memeSceneText:{ textAlign: "center", fontSize: 13, lineHeight: 19, marginTop: 8 },
  grid:        { gap: spacing.sm },
  gridItem:    { padding: spacing.md, borderRadius: radius.md, borderWidth: 1 },
  gridLabel:   { fontSize: 11, fontWeight: "800", letterSpacing: 1, marginBottom: 6 },
  gridValue:   { fontSize: 14, fontWeight: "700", lineHeight: 19 },
  editSection: { marginTop: spacing.md, marginBottom: spacing.md },
  editLabel:   { fontSize: 13, fontWeight: "800", marginBottom: 8 },
  editInput:   { borderWidth: 1, borderRadius: radius.md, padding: spacing.md, fontSize: 15, marginBottom: spacing.md, minHeight: 50 },
  publishedBadge: { flex: 1, height: 54, borderRadius: radius.md, justifyContent: "center", alignItems: "center" },
  publishedText: { fontWeight: "900" },
});

export default ContextReaderScreen;
