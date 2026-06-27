import React, { useEffect, useRef, useState } from "react";
import { View, Text, StyleSheet, ScrollView, SafeAreaView, Animated, TouchableOpacity, Alert, ActivityIndicator, Image, StatusBar, Platform } from "react-native";
import Voice from '@react-native-community/voice';
import { PermissionsAndroid } from 'react-native';
import axios from "axios";
import { useTheme, spacing, radius } from "../theme";
import GlassCard from "../components/GlassCard";
import AnimatedButton from "../components/AnimatedButton";
import CompanionAvatar from "../components/CompanionAvatar";
import AppIcon from "../components/AppIcon";
import { apiUrl } from "../config/api";
import { shareToWhatsApp } from "../utils/shareUtils";
import { memeDB, statsDB } from "../services/database";

const DEMOS = [
  "Je voulais juste faire une sieste et je me suis réveillé avec 43 appels manqués.",
  "J'ai dit à tous que j'avais fini le projet alors que j'avais juste renommé le dossier.",
  "Ma connexion coupe toujours quand je commence à avoir raison dans le débat.",
];

const WaveBar = ({ index, active }) => {
  const { theme } = useTheme();
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
  return <Animated.View style={[styles.waveBar, { transform: [{ scaleY: anim }], backgroundColor: theme.secondary }]} />;
};

const VoiceToMemeScreen = ({ navigate }) => {
  const { theme, isDark } = useTheme();
  const [recording, setRecording]     = useState(false);
  const [transcription, setTranscription] = useState("");
  const [meme, setMeme]               = useState(null);
  const [loading, setLoading]         = useState(false);
  const [duration, setDuration]       = useState(0);
  const [published, setPublished]     = useState(false);
  const [msg, setMsg]                 = useState("Donne-moi une phrase dite à chaud. Je garde l'énergie.");
  const [userId] = useState('demo_user'); // À remplacer par l'ID utilisateur réel
  const [editMode, setEditMode]       = useState(false);
  const [editTopText, setEditTopText] = useState("");
  const [editBottomText, setEditBottomText] = useState("");
  const [regenerating, setRegenerating] = useState(false);
  const timerRef                      = useRef(null);
  const micScale                      = useRef(new Animated.Value(1)).current;
  const resultAnim                    = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Initialiser Voice
    Voice.onSpeechStart = onSpeechStart;
    Voice.onSpeechEnd = onSpeechEnd;
    Voice.onSpeechResults = onSpeechResults;
    Voice.onSpeechError = onSpeechError;
    
    // Initialiser Voice au démarrage
    Voice.isAvailable().then(
      (available) => {
        console.log('Voice disponible:', available);
        if (!available) {
          setMsg("La reconnaissance vocale n'est pas disponible sur cet appareil.");
        }
      },
      (error) => {
        console.error('Erreur vérification Voice:', error);
        setMsg("Erreur lors de l'initialisation de la reconnaissance vocale.");
      }
    );
    
    return () => {
      Voice.destroy().then(Voice.removeAllListeners).catch(e => console.error('Erreur destruction Voice:', e));
      clearInterval(timerRef.current);
    };
  }, []);

  const onSpeechStart = () => {
    setMsg("Écoute en cours...");
  };

  const onSpeechEnd = () => {
    setRecording(false);
    micScale.stopAnimation();
    micScale.setValue(1);
    clearInterval(timerRef.current);
    setMsg("Traitement de la transcription...");
  };

  const onSpeechResults = (e) => {
    if (e.value && e.value.length > 0) {
      setTranscription(e.value[0]);
    }
  };

  const onSpeechError = (e) => {
    console.error('Erreur reconnaissance vocale:', e);
    setRecording(false);
    micScale.stopAnimation();
    micScale.setValue(1);
    clearInterval(timerRef.current);
    
    // Gestion spécifique des erreurs courantes
    if (e.error?.message === '7/No match') {
      setMsg("Aucune reconnaissance trouvée. Parle plus clairement ou réessaie.");
      Alert.alert("Reconnaissance", "Aucun texte reconnu. Essaie de parler plus lentement ou plus clairement.");
    } else if (e.error?.message === '9/No speech') {
      setMsg("Aucun son détecté. Vérifie ton micro.");
      Alert.alert("Micro", "Aucun son détecté. Vérifie que ton micro fonctionne.");
    } else {
      setMsg("Erreur de reconnaissance vocale. Réessaie.");
      Alert.alert("Erreur", `Impossible de reconnaître la voix: ${e.error?.message || 'Erreur inconnue'}. Vérifie les permissions.`);
    }
  };

  const requestMicrophonePermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
          {
            title: 'Permission de micro',
            message: 'Viral Stick a besoin d\'accéder à votre micro pour enregistrer votre voix.',
            buttonNeutral: 'Demander plus tard',
            buttonNegative: 'Refuser',
            buttonPositive: 'Autoriser',
          }
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log('Permission micro accordée');
          return true;
        } else {
          console.log('Permission micro refusée');
          Alert.alert('Permission requise', 'La permission du micro est nécessaire pour utiliser cette fonctionnalité.');
          return false;
        }
      } catch (err) {
        console.error('Erreur demande permission:', err);
        return false;
      }
    }
    return true; // iOS gère les permissions différemment
  };

  const startRec = async () => {
    const hasPermission = await requestMicrophonePermission();
    if (!hasPermission) return;

    try {
      setRecording(true);
      setTranscription("");
      setMeme(null);
      setDuration(0);
      setPublished(false);
      setMsg("Initialisation du micro...");
      
      console.log('Démarrage reconnaissance vocale en français...');
      await Voice.start('fr-FR');
      setMsg("Parle maintenant. Je capture ton énergie vocale.");
      
      Animated.loop(Animated.sequence([
        Animated.timing(micScale, { toValue: 1.12, duration: 500, useNativeDriver: true }),
        Animated.timing(micScale, { toValue: 1,    duration: 500, useNativeDriver: true }),
      ])).start();
      timerRef.current = setInterval(() => setDuration((d) => d + 1), 1000);
    } catch (error) {
      console.error('Erreur démarrage enregistrement:', error);
      setRecording(false);
      setMsg("Erreur lors du démarrage du micro. Vérifie les permissions.");
      Alert.alert("Erreur", `Impossible de démarrer l'enregistrement: ${error.message || 'Erreur inconnue'}`);
    }
  };

  const stopRec = async () => {
    try {
      await Voice.stop();
    } catch (error) {
      console.error('Erreur arrêt enregistrement:', error);
    }
  };

  const generate = async () => {
    if (!transcription.trim()) { Alert.alert("Viral Stick", "Enregistre d'abord une prise."); return; }
    setLoading(true); setMeme(null); setEditMode(false); setMsg("Je construis la chute à partir de ton énergie vocale...");
    
    const url = apiUrl("/api/memes/voice-to-meme");
    console.log('[VoiceToMeme] URL API:', url);
    console.log('[VoiceToMeme] Transcription:', transcription);
    
    try {
      const res = await axios.post(url, { transcription });
      console.log('[VoiceToMeme] Réponse API:', res.data);
      setMeme(res.data);
      setEditTopText(res.data.topText || "");
      setEditBottomText(res.data.bottomText || "");
      setMsg(res.data?.companionComment || "L'énergie est préservée. Mème prêt !");
      resultAnim.setValue(0);
      Animated.spring(resultAnim, { toValue: 1, tension: 70, friction: 8, useNativeDriver: true }).start();
      
      // Sauvegarder le mème dans SQLite
      await saveMemeToDB(res.data);
    } catch (error) {
      console.error('[VoiceToMeme] Erreur API:', error);
      console.error('[VoiceToMeme] Détails erreur:', error.response?.data || error.message);
      setMsg("Le module vocal n'a pas répondu. Relance.");
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
      console.log('[VoiceToMeme] Régénération:', res.data);
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
      console.error('[VoiceToMeme] Erreur régénération:', error);
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
        sourceType: 'voice',
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
      Alert.alert("Succès", "Mème vocal propulsé sur le Forum !");
      
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

  const fmt = (s) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} backgroundColor={theme.background} />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <GlassCard style={styles.hero}>
          <View style={[styles.badge, { backgroundColor: theme.secondaryLight }]}><Text style={[styles.badgeText, { color: theme.secondary }]}>MODULE 02 · VOICE CAPTURE</Text></View>
          <Text style={[styles.title, { color: theme.textPrimary }]}>Voice <Text style={{ color: theme.secondary }}>→ Mème</Text></Text>
          <Text style={[styles.sub, { color: theme.textSecondary }]}>Transforme une parole spontanée en punchline mémorable.</Text>
          <View style={{ alignItems: "center", marginTop: spacing.md }}>
            <CompanionAvatar companion="ubu" size={96} floating message={msg} showRing={false} />
          </View>
        </GlassCard>

        {/* Recorder */}
        <GlassCard animate delay={80} style={[styles.card, { alignItems: "center", gap: spacing.md }]}>
          <Text style={[styles.label, { color: theme.textMuted }]}>RECORDER STUDIO</Text>
          <View style={styles.wave}>
            {Array.from({ length: 26 }).map((_, i) => <WaveBar key={i} index={i} active={recording} />)}
          </View>
          <Text style={[styles.durationText, { color: recording ? theme.danger : theme.textMuted }]}>
            {recording ? `● REC ${fmt(duration)}` : fmt(duration)}
          </Text>
          <Animated.View style={{ transform: [{ scale: micScale }] }}>
            <TouchableOpacity
              onPress={recording ? stopRec : startRec}
              style={[styles.micBtn, {
                backgroundColor: recording ? theme.danger : theme.secondary,
                shadowColor: recording ? theme.danger : theme.secondaryLight
              }]}
              activeOpacity={0.85}
            >
              {recording ? (
                <View style={styles.stopIcon} />
              ) : (
                <AppIcon name="mic" color="#ffffff" size={32} />
              )}
            </TouchableOpacity>
          </Animated.View>
          <Text style={[styles.hint, { color: theme.textMuted }]}>
            {recording ? "Parle naturellement. Le mème naît de la spontanéité." : "Appuie pour démarrer une prise démo, puis transforme en mème."}
          </Text>
        </GlassCard>

        {transcription.length > 0 && (
          <GlassCard style={styles.card}>
            <Text style={[styles.label, { color: theme.textMuted }]}>TRANSCRIPTION</Text>
            <Text style={[styles.transcript, { color: theme.textPrimary }]}>"{transcription}"</Text>
            <AnimatedButton title={loading ? "Transformation..." : "Transformer en mème"} onPress={generate} loading={loading} disabled={loading} size="lg" style={{ marginTop: spacing.md }} />
          </GlassCard>
        )}

        {loading && (
          <GlassCard style={[styles.card, { alignItems: "center", gap: spacing.sm }]}>
            <ActivityIndicator color={theme.secondary} size="large" />
            <Text style={[styles.loadTitle, { color: theme.textPrimary }]}>Remix vocal en cours</Text>
            <Text style={[styles.loadSub, { color: theme.textMuted }]}>Préservation de la spontanéité et recherche de la meilleure chute.</Text>
          </GlassCard>
        )}

        {meme && (
          <Animated.View style={{ opacity: resultAnim, transform: [{ translateY: resultAnim.interpolate({ inputRange: [0,1], outputRange: [24,0] }) }] }}>
            <GlassCard style={styles.card}>
              <View style={[styles.badge, { backgroundColor: theme.secondaryLight }]}><Text style={[styles.badgeText, { color: theme.secondary }]}>✅ MÈME VOCAL PRÊT</Text></View>
              
              {!editMode ? (
                // Mode affichage normal
                <>
                  <View style={[styles.memePreview, { borderColor: theme.border }]}>
                    {meme.imageUrl ? (
                      <Image source={{ uri: meme.imageUrl }} style={styles.fullMeme} resizeMode="contain" />
                    ) : (
                      <View style={[styles.memeBox, { backgroundColor: theme.backgroundSecondary }]}>
                        <Text style={[styles.memeText, { color: theme.textPrimary }]}>{meme.topText}</Text>
                        <View style={styles.memeScene}>
                          <AppIcon name="mic" color={theme.secondary} size={36} />
                          <Text style={[styles.memeSceneText, { color: theme.textSecondary }]}>{meme.descriptionImage}</Text>
                        </View>
                        <Text style={[styles.memeText, { color: theme.textPrimary }]}>{meme.bottomText}</Text>
                      </View>
                    )}
                  </View>
                  {meme.original_transcript_subtitle ? (
                    <View style={[styles.subtitleCard, { backgroundColor: theme.backgroundSecondary, borderColor: theme.border }]}>
                      <Text style={[styles.gridLabel, { color: theme.textMuted }]}>SOUS-TITRE ORIGINAL</Text>
                      <Text style={[styles.subtitleText, { color: theme.textPrimary }]}>"{meme.original_transcript_subtitle}"</Text>
                    </View>
                  ) : null}
                  <View style={styles.actions}>
                    <AnimatedButton
                      title="Éditer"
                      onPress={() => setEditMode(true)}
                      size="lg"
                      variant="ghost"
                      style={{ flex: 1 }}
                    />
                    <AnimatedButton title="WhatsApp" onPress={handleShareWhatsApp} size="lg" style={{ flex: 1, backgroundColor: '#25D366' }} />
                    {!published ? (
                      <AnimatedButton title="Propulser" onPress={publishToForum} size="lg" variant="primary" style={{ flex: 1, backgroundColor: theme.secondary }} />
                    ) : (
                      <View style={[styles.publishedBadge, { backgroundColor: theme.secondaryLight }]}><Text style={[styles.publishedText, { color: theme.secondary }]}>PUBLIÉ</Text></View>
                    )}
                  </View>
                </>
              ) : (
                // Mode édition
                <>
                  <View style={[styles.memePreview, { borderColor: theme.border }]}>
                    {meme.imageUrl ? (
                      <Image source={{ uri: meme.imageUrl }} style={styles.fullMeme} resizeMode="contain" />
                    ) : (
                      <View style={[styles.memeBox, { backgroundColor: theme.backgroundSecondary }]}>
                        <Text style={[styles.memeText, { color: theme.textPrimary }]}>{meme.topText}</Text>
                        <View style={styles.memeScene}>
                          <AppIcon name="mic" color={theme.secondary} size={36} />
                          <Text style={[styles.memeSceneText, { color: theme.textSecondary }]}>{meme.descriptionImage}</Text>
                        </View>
                        <Text style={[styles.memeText, { color: theme.textPrimary }]}>{meme.bottomText}</Text>
                      </View>
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
  card:        { marginBottom: spacing.md, padding: spacing.md },
  label:       { fontSize: 11, fontWeight: "800", letterSpacing: 1.5, marginBottom: 8 },
  wave:        { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 4, height: 60, width: "100%" },
  waveBar:     { width: 5, height: 44, borderRadius: 5 },
  durationText:{ fontSize: 18, fontWeight: "800", letterSpacing: 2 },
  micBtn:      { width: 96, height: 96, borderRadius: 48, alignItems: "center", justifyContent: "center", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.35, shadowRadius: 0, elevation: 4 },
  stopIcon:    { width: 22, height: 22, borderRadius: 4, backgroundColor: "#ffffff" },
  hint:        { textAlign: "center", fontSize: 13, lineHeight: 19, paddingHorizontal: spacing.sm },
  transcript:  { fontSize: 16, fontStyle: "italic", lineHeight: 24, fontWeight: "600" },
  loadTitle:   { fontSize: 17, fontWeight: "800" },
  loadSub:     { textAlign: "center", fontSize: 13, lineHeight: 18 },
  memePreview: { borderWidth: 1, borderRadius: radius.md, overflow: "hidden", marginBottom: spacing.md, backgroundColor: "#000000" },
  fullMeme:    { width: "100%", aspectRatio: 1 },
  memeBox:     { borderWidth: 1, padding: spacing.md, alignItems: "center" },
  memeText:    { fontSize: 17, fontWeight: "900", textTransform: "uppercase", textAlign: "center", lineHeight: 22 },
  memeScene:   { marginVertical: spacing.md, width: "100%", minHeight: 100, alignItems: "center", justifyContent: "center", padding: spacing.md },
  memeSceneText:{ textAlign: "center", fontSize: 13, lineHeight: 19, marginTop: 8 },
  subtitleCard:{ padding: spacing.md, borderRadius: radius.md, borderWidth: 1, marginBottom: spacing.md },
  gridLabel:   { fontSize: 11, fontWeight: "800", letterSpacing: 1, marginBottom: 6 },
  subtitleText:{ fontSize: 14, fontStyle: "italic", lineHeight: 19 },
  actions:     { flexDirection: "row", gap: spacing.sm },
  editSection: { marginTop: spacing.md, marginBottom: spacing.md },
  editLabel:   { fontSize: 13, fontWeight: "800", marginBottom: 8 },
  editInput:   { borderWidth: 1, borderRadius: radius.md, padding: spacing.md, fontSize: 15, marginBottom: spacing.md, minHeight: 50 },
  publishedBadge: { flex: 1, height: 54, borderRadius: radius.md, justifyContent: "center", alignItems: "center" },
  publishedText: { fontWeight: "900" },
});

export default VoiceToMemeScreen;
