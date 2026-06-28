import React, { useEffect, useState, useRef } from "react";
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity, Alert, ActivityIndicator, Image, StatusBar, TextInput, Animated } from "react-native";
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
  const [topY, setTopY] = useState(12);
  const [bottomY, setBottomY] = useState(88);

  const micPress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Voice.onSpeechResults = (e) => { if (e.value?.[0]) setTranscription(e.value[0]); };
    Voice.onSpeechEnd = () => {
      setRecording(false);
      Animated.spring(micPress, { toValue: 0, useNativeDriver: true }).start();
    };
    return () => { Voice.destroy().then(Voice.removeAllListeners); };
  }, []);

  const startRec = async () => {
    try {
      setRecording(true);
      setTranscription("");
      setMeme(null);
      Animated.spring(micPress, { toValue: 1, useNativeDriver: true }).start();
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

  const handleAction = async (type) => {
    if (isProcessing) return;
    setIsProcessing(true);
    try {
      const res = await axios.post(apiUrl("/api/memes/compose"), {
        imageUrl: meme.rawImageUrl || meme.imageUrl,
        topText, bottomText, topY, bottomY
      });
      const finalUrl = res.data.composedImageUrl;
      if (type === 'whatsapp') await shareToWhatsApp(finalUrl, "");
      else if (type === 'download') {
        await downloadImageToGallery(finalUrl);
        Alert.alert("Succès", "Image enregistrée !");
      } else if (type === 'forum') {
        const user = await authService.getUser();
        await axios.post(apiUrl("/api/forum/publish"), {
          imageUrl: finalUrl, topText, bottomText,
          userId: user?.id || "anon", username: user?.email?.split('@')[0] || "Anonyme"
        });
        Alert.alert("Succès", "Mème publié sur le forum !");
      }
    } catch (e) {
      Alert.alert("Export", "Erreur fusion.");
    } finally {
      setIsProcessing(false);
    }
  };

  const micTranslateY = micPress.interpolate({ inputRange: [0, 1], outputRange: [0, 4] });

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.snowWhite }]}>
      <StatusBar barStyle="dark-content" />
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <Text style={styles.title}>Voice <Text style={{ color: colors.brandSecondary }}>→ Mème</Text></Text>
        </View>

        {!meme ? (
          <View style={styles.micCard}>
            <Animated.View style={{ transform: [{ translateY: micTranslateY }] }}>
              <TouchableOpacity
                activeOpacity={1}
                onPress={recording ? () => Voice.stop() : startRec}
                style={[styles.micBtn, {
                  backgroundColor: recording ? colors.danger : colors.brandSecondary,
                  borderColor: recording ? "#b91c1c" : colors.brandSecondaryDark
                }]}
              >
                <AppIcon name="mic" color="#fff" size={36} />
              </TouchableOpacity>
            </Animated.View>
            <Text style={styles.micHint}>{recording ? "Lâche pour générer" : "Appuie pour parler"}</Text>

            {transcription !== "" && (
              <View style={styles.transZone}>
                <Text style={styles.transcript}>"{transcription}"</Text>
                <AnimatedButton
                  title="GÉNÉRER LE MÈME"
                  onPress={generate}
                  loading={loading}
                />
              </View>
            )}
          </View>
        ) : (
          <View style={styles.studio}>
            <View style={styles.canvas}>
              <Image source={{ uri: meme.rawImageUrl || meme.imageUrl }} style={styles.baseImg} resizeMode="cover" />
              <View style={[styles.overlay, { top: `${topY}%` }]}><Text style={styles.memeText}>{topText}</Text></View>
              <View style={[styles.overlay, { top: `${bottomY}%` }]}><Text style={styles.memeText}>{bottomText}</Text></View>
            </View>

            <View style={styles.controls}>
              <Text style={styles.label}>ÉDITION DU TEXTE</Text>
              <TextInput style={styles.studioInput} value={topText} onChangeText={setTopText} placeholder="Texte du haut" />
              <Slider style={styles.slider} minimumValue={5} maximumValue={45} value={topY} onValueChange={setTopY} minimumTrackTintColor={colors.brandPrimary} thumbTintColor={colors.brandPrimary} />
              <TextInput style={[styles.studioInput, { marginTop: 10 }]} value={bottomText} onChangeText={setBottomText} placeholder="Texte du bas" />
              <Slider style={styles.slider} minimumValue={55} maximumValue={95} value={bottomY} onValueChange={setBottomY} minimumTrackTintColor={colors.brandSecondary} thumbTintColor={colors.brandSecondary} />
            </View>

            <View style={styles.actionFixedBar}>
              <TouchableOpacity style={[styles.actionBtn, { backgroundColor: '#25D366', borderColor: '#12b534' }]} onPress={() => handleAction('whatsapp')}>
                {isProcessing ? <ActivityIndicator color="#fff" /> : <AppIcon name="share-2" color="#fff" size={24} />}
              </TouchableOpacity>
              <TouchableOpacity style={[styles.actionBtn, { backgroundColor: colors.brandPrimary, borderColor: colors.brandPrimaryDark, flex: 2 }]} onPress={() => handleAction('download')}>
                <Text style={styles.actionText}>SAUVEGARDER</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.actionBtn, { backgroundColor: colors.brandSecondary, borderColor: colors.brandSecondaryDark }]} onPress={() => handleAction('forum')}>
                <AppIcon name="globe" color="#fff" size={24} />
              </TouchableOpacity>
              <TouchableOpacity style={[styles.actionBtn, { backgroundColor: colors.cloudGray, borderColor: '#b5b5b5' }]} onPress={() => setMeme(null)}>
                <AppIcon name="refresh-cw" color={colors.charcoal} size={22} />
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
  header: { marginBottom: 20, alignItems: 'center' },
  title: { fontSize: 28, fontWeight: '900' },
  micCard: {
    padding: 30, alignItems: 'center', backgroundColor: colors.snowWhite,
    borderWidth: 2, borderBottomWidth: 4, borderColor: colors.cloudGray, borderRadius: radius.md
  },
  micBtn: {
    width: 85, height: 85, borderRadius: 45, justifyContent: 'center', alignItems: 'center',
    borderWidth: 2, borderBottomWidth: 6, elevation: 0, shadowOpacity: 0
  },
  micHint: { marginTop: 15, fontWeight: '800', fontSize: 12, color: colors.textMuted },
  transZone: { width: '100%', marginTop: 25, alignItems: 'center' },
  transcript: { fontSize: 16, fontStyle: 'italic', textAlign: 'center', marginBottom: 20, color: colors.almostBlack },
  studio: { width: '100%' },
  canvas: { width: '100%', aspectRatio: 1, borderRadius: radius.md, overflow: 'hidden', backgroundColor: '#000', borderWidth: 2, borderColor: colors.cloudGray },
  baseImg: { width: '100%', height: '100%' },
  overlay: { position: 'absolute', left: 0, right: 0, alignItems: 'center', paddingHorizontal: 12 },
  memeText: { color: '#fff', fontSize: 28, fontWeight: '900', textAlign: 'center', textShadowColor: '#000', textShadowOffset: { width: 2, height: 2 }, textShadowRadius: 4, textTransform: 'uppercase' },
  controls: { marginTop: 15, padding: 15, backgroundColor: colors.snowWhite, borderWidth: 2, borderBottomWidth: 4, borderColor: colors.cloudGray, borderRadius: radius.md },
  label: { fontSize: 11, fontWeight: '800', color: colors.textMuted },
  studioInput: { backgroundColor: '#f5f5f5', borderRadius: radius.sm, padding: 12, fontSize: 15, fontWeight: '700', borderWidth: 2, borderColor: colors.cloudGray, color: colors.almostBlack },
  slider: { width: '100%', height: 40 },
  actionFixedBar: { flexDirection: 'row', gap: 8, marginTop: 15, marginBottom: 50 },
  actionBtn: { flex: 1, height: 55, borderRadius: radius.md, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderBottomWidth: 4, elevation: 0, shadowOpacity: 0 },
  actionText: { color: '#fff', fontWeight: '900', fontSize: 14 }
});

export default VoiceToMemeScreen;
