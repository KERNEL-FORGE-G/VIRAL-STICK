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
  const [topY, setTopY] = useState(12);
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
      await axios.post(apiUrl("/api/forum/publish"), {
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
        imageUrl: meme.rawImageUrl || meme.imageUrl,
        topText, bottomText, topY, bottomY
      });
      const finalUrl = res.data.composedImageUrl;

      if (type === 'whatsapp') {
        await shareToWhatsApp(finalUrl, "");
      } else if (type === 'download') {
        await downloadImageToGallery(finalUrl);
        Alert.alert("Export", "Image enregistrée dans la galerie.");
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
          <Text style={styles.title}>Context <Text style={{ color: colors.brandPrimary }}>Reader</Text></Text>
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
              <Image source={{ uri: meme.rawImageUrl || meme.imageUrl }} style={styles.baseImg} resizeMode="cover" />
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
                  minimumTrackTintColor={colors.brandPrimary}
                  thumbTintColor={colors.brandPrimary}
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
                  minimumTrackTintColor={colors.brandSecondary}
                  thumbTintColor={colors.brandSecondary}
                  maximumTrackTintColor={colors.cloudGray}
                />
              </View>
            </View>

            <View style={styles.actionFixedBar}>
              <TouchableOpacity
                style={[styles.actionBtn, { backgroundColor: '#25D366', borderColor: '#12b534' }]}
                onPress={() => handleAction('whatsapp')}
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <AppIcon name="share-2" color="#fff" size={24} />
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.actionBtn, { backgroundColor: colors.brandPrimary, borderColor: colors.brandPrimaryDark, flex: 2 }]}
                onPress={() => handleAction('download')}
              >
                <Text style={styles.actionText}>SAUVEGARDER</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.actionBtn, { backgroundColor: colors.brandSecondary, borderColor: colors.brandSecondaryDark }]}
                onPress={() => handleAction('forum')}
              >
                <AppIcon name="globe" color="#fff" size={24} />
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.actionBtn, { backgroundColor: colors.cloudGray, borderColor: '#b5b5b5' }]}
                onPress={() => setMeme(null)}
              >
                <AppIcon name="refresh-cw" color={colors.charcoal} size={22} />
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
  header: { marginBottom: 20, alignItems: 'center' },
  title: { fontSize: 28, fontWeight: '900', color: colors.almostBlack },
  subtitle: { fontSize: 13, color: colors.textMuted, marginTop: 4 },
  inputCard: {
    padding: 20,
    backgroundColor: colors.snowWhite,
    borderWidth: 2,
    borderBottomWidth: 4,
    borderColor: colors.cloudGray,
    borderRadius: radius.md
  },
  label: { fontSize: 11, fontWeight: '800', letterSpacing: 1.5, marginBottom: 10, color: colors.textMuted },
  input: {
    minHeight: 120,
    fontSize: 16,
    borderWidth: 2,
    borderColor: colors.cloudGray,
    borderRadius: radius.md,
    marginBottom: 20,
    padding: 16,
    textAlignVertical: 'top',
    color: colors.almostBlack,
    backgroundColor: '#f9f9f9'
  },
  studio: { width: '100%' },
  canvas: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: radius.md,
    overflow: 'hidden',
    backgroundColor: '#000',
    borderWidth: 2,
    borderColor: colors.cloudGray
  },
  baseImg: { width: '100%', height: '100%' },
  overlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingHorizontal: 12
  },
  memeText: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '900',
    textAlign: 'center',
    textShadowColor: '#000',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
    textTransform: 'uppercase',
  },
  controls: {
    marginTop: 15,
    padding: 15,
    backgroundColor: colors.snowWhite,
    borderWidth: 2,
    borderBottomWidth: 4,
    borderColor: colors.cloudGray,
    borderRadius: radius.md
  },
  sliderContainer: { marginVertical: 10 },
  sliderLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.almostBlack,
    marginBottom: 4,
  },
  studioInput: {
    backgroundColor: '#f5f5f5',
    borderRadius: radius.sm,
    padding: 12,
    fontSize: 15,
    fontWeight: '700',
    borderWidth: 2,
    borderColor: colors.cloudGray,
    color: colors.almostBlack
  },
  slider: { width: '100%', height: 40 },
  actionFixedBar: { flexDirection: 'row', gap: 8, marginTop: 15, marginBottom: 50 },
  actionBtn: {
    flex: 1,
    height: 55,
    borderRadius: radius.md,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderBottomWidth: 4,
  },
  actionText: {
    color: '#fff',
    fontWeight: '900',
    fontSize: 14,
  }
});

export default ContextReaderScreen;
