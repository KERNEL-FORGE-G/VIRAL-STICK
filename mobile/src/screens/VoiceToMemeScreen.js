import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity, Alert, ActivityIndicator, Image, StatusBar, TextInput } from "react-native";
import Slider from '@react-native-community/slider';
import Voice from '@react-native-community/voice';
import axios from "axios";
import { useTheme, spacing, radius, colors } from "../theme";
import AnimatedButton from "../components/AnimatedButton";
import AppIcon from "../components/AppIcon";
import { apiUrl } from "../config/api";
import { shareToWhatsApp, downloadImageToGallery } from "../utils/shareUtils";
import authService from "../services/authService";

const VoiceToMemeScreen = ({ navigate }) => {
  const { theme, isDark } = useTheme();
  const [recording, setRecording] = useState(false);
  const [transcription, setTranscription] = useState("");
  const [meme, setMeme] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const [topText, setTopText] = useState("");
  const [bottomText, setBottomText] = useState("");
  const [topY, setTopY] = useState(10);
  const [bottomY, setBottomY] = useState(88);

  useEffect(() => {
    Voice.onSpeechResults = (e) => { if (e.value?.[0]) setTranscription(e.value[0]); };
    Voice.onSpeechEnd = () => setRecording(false);
    return () => { Voice.destroy().then(Voice.removeAllListeners); };
  }, []);

  const startRec = async () => {
    try {
      setRecording(true);
      setTranscription("");
      setMeme(null);
      await Voice.start('fr-FR');
    } catch (e) {
      setRecording(false);
      Alert.alert("Erreur", "Micro inaccessible");
    }
  };

  const generate = async () => {
    if (!transcription.trim()) return;
    setLoading(true);
    try {
      const res = await axios.post(apiUrl("/api/memes/voice-to-meme"), { transcription });
      setMeme(res.data);
      setTopText(res.data.topText || "");
      setBottomText(res.data.bottomText || "");
    } catch (e) {
      Alert.alert("Erreur", "Studio vocal indisponible.");
    } finally {
      setLoading(false);
    }
  };

  const saveToForum = async (composedImageUrl) => {
    try {
      const user = await authService.getUser();
      const username = user?.email?.split('@')[0] || "Anonyme";
      await axios.post(apiUrl("/api/forum/memes"), {
        imageUrl: composedImageUrl,
        topText,
        bottomText,
        userId: user?.id || "anon",
        username
      });
      Alert.alert("Succès", "Mème ajouté au forum !");
    } catch (e) {
      Alert.alert("Erreur", "Impossible d'ajouter au forum.");
    }
  };

  const handleAction = async (type) => {
    setIsProcessing(true);
    try {
      const res = await axios.post(apiUrl("/api/memes/compose"), {
        imageUrl: meme.imageUrl,
        topText, bottomText, topY, bottomY
      });
      const finalUrl = res.data.composedImageUrl;

      if (type === 'whatsapp') {
        await shareToWhatsApp(finalUrl, "");
      } else if (type === 'download') {
        await downloadImageToGallery(finalUrl);
      } else if (type === 'forum') {
        await saveToForum(finalUrl);
      }
    } catch (e) {
      Alert.alert("Export", "Erreur fusion.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.snowWhite }]}>
      <StatusBar barStyle="dark-content" />
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <Text style={styles.title}>Voice <Text style={{ color: colors.skyBlue }}>→ Mème</Text></Text>
        </View>

        {!meme ? (
          <View style={styles.micCard}>
            <TouchableOpacity
              onPress={recording ? () => Voice.stop() : startRec}
              style={[styles.micBtn, { backgroundColor: recording ? colors.grapeSoda : colors.skyBlue }]}
            >
              <AppIcon name="mic" color="#fff" size={36} />
            </TouchableOpacity>
            <Text style={styles.micHint}>{recording ? "Lâche pour générer" : "Appuie pour parler"}</Text>

            {transcription !== "" && (
              <View style={styles.transZone}>
                <Text style={styles.transcript}>"{transcription}"</Text>
                <AnimatedButton
                  title="GÉNÉRER LE MÈME"
                  onPress={generate}
                  loading={loading}
                  disabled={loading}
                />
              </View>
            )}
          </View>
        ) : (
          <View style={styles.studio}>
            <View style={styles.canvas}>
              <Image source={{ uri: meme.imageUrl }} style={styles.baseImg} resizeMode="cover" />
              <View style={[styles.overlay, { top: `${topY}%` }]}>
                <Text style={styles.memeText}>{topText}</Text>
              </View>
              <View style={[styles.overlay, { top: `${bottomY}%` }]}>
                <Text style={styles.memeText}>{bottomText}</Text>
              </View>
            </View>

            <View style={styles.controls}>
              <Text style={styles.label}>ÉDITION DU TEXTE</Text>
              <TextInput
                style={styles.studioInput}
                value={topText}
                onChangeText={setTopText}
                placeholder="Texte du haut"
                placeholderTextColor={colors.silver}
              />
              <View style={styles.sliderContainer}>
                <Text style={styles.sliderLabel}>Position haut: {Math.round(topY)}%</Text>
                <Slider
                  style={styles.slider}
                  minimumValue={5}
                  maximumValue={45}
                  value={topY}
                  onValueChange={setTopY}
                  minimumTrackTintColor={colors.duoGreen}
                  thumbTintColor={colors.duoGreen}
                  maximumTrackTintColor={colors.cloudGray}
                />
              </View>

              <TextInput
                style={styles.studioInput}
                value={bottomText}
                onChangeText={setBottomText}
                placeholder="Texte du bas"
                placeholderTextColor={colors.silver}
              />
              <View style={styles.sliderContainer}>
                <Text style={styles.sliderLabel}>Position bas: {Math.round(bottomY)}%</Text>
                <Slider
                  style={styles.slider}
                  minimumValue={55}
                  maximumValue={95}
                  value={bottomY}
                  onValueChange={setBottomY}
                  minimumTrackTintColor={colors.skyBlue}
                  thumbTintColor={colors.skyBlue}
                  maximumTrackTintColor={colors.cloudGray}
                />
              </View>
            </View>

            <View style={styles.actionFixedBar}>
              <TouchableOpacity
                style={[styles.actionBtn, { backgroundColor: '#25D366' }]}
                onPress={() => handleAction('whatsapp')}
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <>
                    <AppIcon name="share-2" color="#fff" size={20} />
                    <Text style={styles.actionText}>WHATSAPP</Text>
                  </>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.actionBtn, { backgroundColor: colors.duoGreen }]}
                onPress={() => handleAction('download')}
              >
                <AppIcon name="download" color="#fff" size={20} />
                <Text style={styles.actionText}>SAUVEGARDER</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.actionBtn, { backgroundColor: colors.skyBlue }]}
                onPress={() => handleAction('forum')}
              >
                <AppIcon name="globe" color="#fff" size={20} />
                <Text style={styles.actionText}>FORUM</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.actionBtn, { backgroundColor: colors.cloudGray }]}
                onPress={() => setMeme(null)}
              >
                <AppIcon name="refresh-cw" color={colors.charcoal} size={20} />
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
  scroll: { padding: spacing.md },
  header: { marginBottom: 20, padding: 10, alignItems: 'center' },
  title: { fontSize: 32, fontWeight: '900', color: colors.almostBlack, fontFamily: 'Nunito' },
  micCard: { padding: 30, alignItems: 'center', backgroundColor: colors.snowWhite, borderWidth: 2, borderColor: colors.cloudGray, borderRadius: radius.buttons },
  micBtn: { width: 85, height: 85, borderRadius: 45, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: 'rgba(0,0,0,0.1)' },
  micHint: { marginTop: 15, fontWeight: '800', fontSize: 12, letterSpacing: 1.5, color: colors.charcoal, fontFamily: 'Nunito' },
  transZone: { width: '100%', marginTop: 25, alignItems: 'center' },
  transcript: { fontSize: 16, fontStyle: 'italic', textAlign: 'center', marginBottom: 20, color: colors.almostBlack, fontFamily: 'Nunito' },
  studio: { width: '100%' },
  canvas: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: radius.buttons,
    overflow: 'hidden',
    backgroundColor: '#000',
    position: 'relative',
    borderWidth: 2,
    borderColor: colors.cloudGray
  },
  baseImg: { width: '100%', height: '100%' },
  overlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingHorizontal: 16
  },
  memeText: {
    color: '#fff',
    fontSize: 26,
    fontWeight: '900',
    textAlign: 'center',
    textShadowColor: '#000',
    textShadowOffset: { width: 3, height: 3 },
    textShadowRadius: 6,
    textTransform: 'uppercase',
    fontFamily: 'Nunito'
  },
  controls: {
    marginTop: 18,
    padding: 20,
    backgroundColor: colors.snowWhite,
    borderWidth: 2,
    borderColor: colors.cloudGray,
    borderRadius: radius.buttons
  },
  label: { fontSize: 12, fontWeight: '800', letterSpacing: 1.5, marginBottom: 10, color: colors.charcoal, fontFamily: 'Nunito' },
  sliderContainer: { marginVertical: 10 },
  sliderLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.charcoal,
    marginBottom: 4,
    fontFamily: 'Nunito'
  },
  studioInput: {
    backgroundColor: colors.duoGreenLight + '40',
    borderRadius: radius.buttons,
    padding: 16,
    fontSize: 16,
    fontWeight: '800',
    borderWidth: 2,
    borderColor: colors.cloudGray,
    color: colors.almostBlack,
    fontFamily: 'Nunito'
  },
  slider: { width: '100%', height: 45 },
  actionFixedBar: { flexDirection: 'row', gap: 10, marginTop: 18 },
  actionBtn: {
    flex: 1,
    height: 60,
    borderRadius: radius.buttons,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    borderWidth: 2,
    borderColor: 'rgba(0,0,0,0.1)'
  },
  actionText: {
    color: '#fff',
    fontWeight: '900',
    fontSize: 14,
    fontFamily: 'Nunito'
  }
});

export default VoiceToMemeScreen;
