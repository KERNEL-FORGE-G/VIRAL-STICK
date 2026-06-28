import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity, Alert, Keyboard, Image, StatusBar, ActivityIndicator } from "react-native";
import Slider from '@react-native-community/slider';
import axios from "axios";
import { useTheme, spacing, radius, colors } from "../theme";
import AnimatedButton from "../components/AnimatedButton";
import AppIcon from "../components/AppIcon";
import { apiUrl } from "../config/api";
import { shareToWhatsApp, downloadImageToGallery } from "../utils/shareUtils";
import authService from "../services/authService";

const ContextReaderScreen = ({ navigate }) => {
  const { theme, isDark } = useTheme();
  const [text, setText] = useState("");
  const [meme, setMeme] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const [topText, setTopText] = useState("");
  const [bottomText, setBottomText] = useState("");
  const [topY, setTopY] = useState(10);
  const [bottomY, setBottomY] = useState(88);

  const generateMeme = async () => {
    if (!text.trim()) return;
    Keyboard.dismiss();
    setLoading(true);
    setMeme(null);
    try {
      const res = await axios.post(apiUrl("/api/memes/generate-from-text"), { text });
      setMeme(res.data);
      setTopText(res.data.topText || "");
      setBottomText(res.data.bottomText || "");
    } catch (e) {
      Alert.alert("Erreur", "Le studio est momentanément indisponible.");
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
    if (isProcessing) return;
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
      Alert.alert("Export", "Erreur lors de la fusion finale.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.snowWhite }]}>
      <StatusBar barStyle="dark-content" />
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <Text style={styles.title}>Context <Text style={{ color: colors.sunshineYellow }}>Reader</Text></Text>
          <Text style={styles.subtitle}>Analyseur de situation IA</Text>
        </View>

        {!meme ? (
          <View style={styles.inputCard}>
            <Text style={styles.label}>DÉCRIS TA SITUATION</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: Mon pote m'a dit 'j'arrive' alors qu'il est au lit..."
              placeholderTextColor={colors.silver}
              multiline
              value={text}
              onChangeText={setText}
            />
            <AnimatedButton
              title="GÉNÉRER LE MÈME"
              onPress={generateMeme}
              loading={loading}
              disabled={loading}
            />
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
        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1 },
  scroll: { padding: spacing.md },
  header: { marginBottom: 20, padding: 10, alignItems: 'center' },
  title: { fontSize: 32, fontWeight: '900', color: colors.almostBlack, fontFamily: 'Nunito' },
  subtitle: { fontSize: 14, color: colors.charcoal, marginTop: 4, fontFamily: 'Nunito' },
  inputCard: { padding: 20, backgroundColor: colors.snowWhite, borderWidth: 2, borderColor: colors.cloudGray, borderRadius: radius.buttons },
  label: { fontSize: 12, fontWeight: '800', letterSpacing: 1.5, marginBottom: 10, color: colors.charcoal, fontFamily: 'Nunito' },
  input: {
    minHeight: 140,
    fontSize: 16,
    borderWidth: 2,
    borderColor: colors.cloudGray,
    borderRadius: radius.buttons,
    marginBottom: 20,
    padding: 16,
    textAlignVertical: 'top',
    color: colors.almostBlack,
    fontFamily: 'Nunito'
  },
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
  sliderContainer: {
    marginVertical: 10
  },
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

export default ContextReaderScreen;
