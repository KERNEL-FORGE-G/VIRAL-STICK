import React, { useEffect, useRef, useState } from "react";
import { View, Text, StyleSheet, ScrollView, SafeAreaView, Animated, TouchableOpacity, Alert, ActivityIndicator, Image, StatusBar, TextInput } from "react-native";
import Slider from '@react-native-community/slider';
import Voice from '@react-native-community/voice';
import axios from "axios";
import { useTheme, spacing, shadows } from "../theme";
import GlassCard from "../components/GlassCard";
import AppIcon from "../components/AppIcon";
import { apiUrl } from "../config/api";
import { shareToWhatsApp, downloadImageToGallery } from "../utils/shareUtils";
import CompanionAvatar from "../components/CompanionAvatar";

const VoiceToMemeScreen = ({ navigate }) => {
  const { theme, isDark } = useTheme();
  const [recording, setRecording]     = useState(false);
  const [transcription, setTranscription] = useState("");
  const [meme, setMeme]               = useState(null);
  const [loading, setLoading]         = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // STUDIO STATES (Automatic)
  const [topText, setTopText]       = useState("");
  const [bottomText, setBottomText] = useState("");
  const [topY, setTopY]             = useState(12);
  const [bottomY, setBottomY]       = useState(88);

  useEffect(() => {
    Voice.onSpeechResults = (e) => { if (e.value?.[0]) setTranscription(e.value[0]); };
    Voice.onSpeechEnd = () => setRecording(false);
    return () => { Voice.destroy().then(Voice.removeAllListeners); };
  }, []);

  const startRec = async () => {
    try {
      setRecording(true); setTranscription(""); setMeme(null);
      await Voice.start('fr-FR');
    } catch (e) { setRecording(false); Alert.alert("Erreur", "Micro inaccessible"); }
  };

  const generate = async () => {
    if (!transcription.trim()) return;
    setLoading(true);
    try {
      const res = await axios.post(apiUrl("/api/memes/voice-to-meme"), { transcription });
      setMeme(res.data);
      setTopText(res.data.topText || "");
      setBottomText(res.data.bottomText || "");
    } catch (e) { Alert.alert("Erreur", "Studio vocal indisponible."); }
    finally { setLoading(false); }
  };

  const handleAction = async (type) => {
    setIsProcessing(true);
    try {
      const res = await axios.post(apiUrl("/api/memes/compose"), {
        imageUrl: meme.imageUrl,
        topText, bottomText, topY, bottomY
      });
      const finalUrl = res.data.composedImageUrl;
      if (type === 'whatsapp') await shareToWhatsApp(finalUrl, "");
      else await downloadImageToGallery(finalUrl);
    } catch (e) { Alert.alert("Export", "Erreur fusion."); }
    finally { setIsProcessing(false); }
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">

        <GlassCard style={styles.header}>
          <Text style={[styles.title, { color: theme.textPrimary }]}>Voice <Text style={{ color: theme.secondary }}>→ Mème</Text></Text>
          <CompanionAvatar companion="ubu" size={55} floating message={meme ? "Ajuste ton texte !" : "Parle, je m'occupe du reste."} />
        </GlassCard>

        {!meme ? (
          <GlassCard style={styles.micCard}>
            <TouchableOpacity
              onPress={recording ? () => Voice.stop() : startRec}
              style={[styles.micBtn, { backgroundColor: recording ? theme.danger : theme.secondary }, shadows.btn]}
            >
              <AppIcon name="mic" color="#fff" size={36} />
            </TouchableOpacity>
            <Text style={[styles.micHint, { color: theme.textMuted }]}>{recording ? "Lâche pour générer" : "Appuie pour parler"}</Text>

            {transcription !== "" && (
               <View style={styles.transZone}>
                 <Text style={[styles.transcript, { color: theme.textPrimary }]}>"{transcription}"</Text>
                 <TouchableOpacity style={[styles.goBtn, { backgroundColor: theme.primary }]} onPress={generate} disabled={loading}>
                   {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.goBtnText}>GÉNÉRER LE MÈME</Text>}
                 </TouchableOpacity>
               </View>
            )}
          </GlassCard>
        ) : (
          <View style={styles.studio}>
            <View style={[styles.canvas, shadows.card]}>
              <Image source={{ uri: meme.imageUrl }} style={styles.baseImg} resizeMode="cover" />
              <View style={[styles.overlay, { top: `${topY}%` }]}><Text style={styles.memeText}>{topText}</Text></View>
              <View style={[styles.overlay, { top: `${bottomY}%` }]}><Text style={styles.memeText}>{bottomText}</Text></View>
            </View>

            <GlassCard style={styles.controls}>
              <Text style={styles.label}>TEXTE HAUT</Text>
              <TextInput style={styles.input} value={topText} onChangeText={setTopText} color="#fff" />
              <Slider style={styles.slider} minimumValue={5} maximumValue={45} value={topY} onValueChange={setTopY} minimumTrackTintColor={theme.primary} thumbTintColor={theme.primary} />

              <View style={{ height: 10 }} />

              <Text style={styles.label}>TEXTE BAS</Text>
              <TextInput style={styles.input} value={bottomText} onChangeText={setBottomText} color="#fff" />
              <Slider style={styles.slider} minimumValue={55} maximumValue={95} value={bottomY} onValueChange={setBottomY} minimumTrackTintColor={theme.secondary} thumbTintColor={theme.secondary} />
            </GlassCard>

            <View style={styles.actionFixedBar}>
              <TouchableOpacity style={[styles.shareBtn, { backgroundColor: '#22C55E' }]} onPress={() => handleAction('whatsapp')} disabled={isProcessing}>
                {isProcessing ? <ActivityIndicator color="#fff" /> : <><AppIcon name="share-2" color="#fff" size={22} /><Text style={styles.actionText}>WHATSAPP</Text></>}
              </TouchableOpacity>
              <TouchableOpacity style={[styles.iconAction, { backgroundColor: theme.primary }]} onPress={() => handleAction('download')}>
                <AppIcon name="download" color="#fff" size={24} />
              </TouchableOpacity>
              <TouchableOpacity style={[styles.iconAction, { backgroundColor: 'rgba(150,150,150,0.2)' }]} onPress={() => setMeme(null)}>
                <AppIcon name="refresh-cw" color={theme.textPrimary} size={24} />
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1 },
  scroll: { padding: 15 },
  header: { alignItems: 'center', marginBottom: 15, padding: 15 },
  title: { fontSize: 26, fontWeight: '900' },
  micCard: { padding: 30, alignItems: 'center' },
  micBtn: { width: 85, height: 85, borderRadius: 45, justifyContent: 'center', alignItems: 'center' },
  micHint: { marginTop: 15, fontWeight: '700', fontSize: 11, letterSpacing: 1 },
  transZone: { width: '100%', marginTop: 25, alignItems: 'center' },
  transcript: { fontSize: 16, fontStyle: 'italic', textAlign: 'center', marginBottom: 20 },
  goBtn: { width: '100%', height: 60, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  goBtnText: { color: '#fff', fontWeight: '900', letterSpacing: 1 },
  studio: { width: '100%' },
  canvas: { width: '100%', aspectRatio: 1, borderRadius: 32, overflow: 'hidden', backgroundColor: '#000' },
  baseImg: { width: '100%', height: '100%', opacity: 0.8 },
  overlay: { position: 'absolute', left: 0, right: 0, alignItems: 'center', paddingHorizontal: 20 },
  memeText: { color: '#fff', fontSize: 24, fontWeight: '900', textAlign: 'center', textShadowColor: '#000', textShadowOffset: { width: 2, height: 2 }, textShadowRadius: 4, textTransform: 'uppercase' },
  controls: { marginTop: 15, padding: 18 },
  label: { fontSize: 10, fontWeight: '900', color: '#666', marginBottom: 6 },
  input: { backgroundColor: 'rgba(150,150,150,0.1)', borderRadius: 12, padding: 12, fontSize: 15, fontWeight: 'bold' },
  slider: { width: '100%', height: 40 },
  actionFixedBar: { flexDirection: 'row', gap: 10, marginTop: 15, paddingBottom: 80 },
  shareBtn: { flex: 3, height: 65, borderRadius: 22, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 10 },
  iconAction: { flex: 1, height: 65, borderRadius: 22, justifyContent: 'center', alignItems: 'center' },
  actionText: { color: '#fff', fontWeight: '900', fontSize: 17 }
});

export default VoiceToMemeScreen;
