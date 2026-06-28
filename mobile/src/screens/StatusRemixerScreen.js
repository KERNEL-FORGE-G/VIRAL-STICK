import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity, TextInput, Alert, Image, ActivityIndicator, StatusBar } from "react-native";
import Slider from '@react-native-community/slider';
import { launchImageLibrary, launchCamera } from 'react-native-image-picker';
import axios from "axios";
import { useTheme, spacing, radius, colors } from "../theme";
import AppIcon from "../components/AppIcon";
import { apiUrl } from "../config/api";
import { shareToWhatsApp, downloadImageToGallery } from "../utils/shareUtils";
import CompanionAvatar from "../components/CompanionAvatar";

const StatusRemixerScreen = ({ navigate, route }) => {
  const { theme, isDark } = useTheme();
  const params = route?.params || {};

  const [initialImage, setInitialImage] = useState(params.imageUrl || null);
  const [imageBase64, setImageBase64]   = useState(null);
  const [imagePicked, setImagePicked]   = useState(!!params.imageUrl);
  const [loading, setLoading]           = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const [topText, setTopText]       = useState("");
  const [bottomText, setBottomText] = useState(params.meme_text || "");
  const [topY, setTopY]             = useState(12);
  const [bottomY, setBottomY]       = useState(88);

  const pickImage = async (source) => {
    const options = { mediaType: 'photo', quality: 0.7, includeBase64: true };
    try {
      let result = source === 'camera' ? await launchCamera(options) : await launchImageLibrary(options);
      if (result.assets?.[0]) {
        const asset = result.assets[0];
        setInitialImage(asset.uri);
        setImageBase64(asset.base64);
        setImagePicked(true);
      }
    } catch (e) { Alert.alert('Erreur', 'Image inaccessible'); }
  };

  const generateAI = async () => {
    if (!initialImage) return;
    setLoading(true);
    try {
      const res = await axios.post(apiUrl("/api/memes/status-remixer"), {
        inputImageUrl: initialImage.startsWith('http') ? initialImage : null,
        inputImageBase64: imageBase64
      });
      setBottomText(res.data.meme_text || "");
    } catch (e) {
      Alert.alert("IA", "Impossible de générer une suggestion.");
    } finally { setLoading(false); }
  };

  const handleAction = async (type) => {
    if (isProcessing) return;
    setIsProcessing(true);
    try {
      const res = await axios.post(apiUrl("/api/memes/compose"), {
        imageUrl: initialImage.startsWith('http') ? initialImage : null,
        imageBase64: imageBase64,
        topText, bottomText, topY, bottomY
      });
      const finalUrl = res.data.composedImageUrl;
      if (type === 'whatsapp') await shareToWhatsApp(finalUrl, "");
      else {
        await downloadImageToGallery(finalUrl);
        Alert.alert("Succès", "Mème enregistré !");
      }
    } catch (e) {
      Alert.alert("Erreur", "La fusion a échoué.");
    } finally { setIsProcessing(false); }
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.snowWhite }]}>
      <StatusBar barStyle="dark-content" />
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">

        <View style={styles.header}>
          <View style={styles.headerContent}>
            <View>
              <Text style={styles.title}>Status <Text style={{ color: colors.brandSecondary }}>Remixer</Text></Text>
              <Text style={styles.subtitle}>Fusion automatique intelligente</Text>
            </View>
            <CompanionAvatar companion="bio" size={50} floating />
          </View>
        </View>

        {!imagePicked ? (
          <View style={styles.entryZone}>
            <TouchableOpacity style={[styles.bigBtn, { backgroundColor: colors.brandPrimary, borderColor: colors.brandPrimaryDark }]} onPress={() => pickImage('camera')}>
              <AppIcon name="camera" color="#fff" size={30} />
              <Text style={styles.bigBtnText}>APPAREIL PHOTO</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.bigBtn, { backgroundColor: colors.cloudGray, borderColor: '#b5b5b5', marginTop: 15 }]} onPress={() => pickImage('gallery')}>
              <AppIcon name="image" color={colors.almostBlack} size={30} />
              <Text style={[styles.bigBtnText, { color: colors.almostBlack }]}>GALERIE PHOTO</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.studio}>
            <View style={styles.canvas}>
              <Image source={{ uri: initialImage }} style={styles.baseImg} resizeMode="cover" />
              <View style={[styles.overlay, { top: `${topY}%` }]}><Text style={styles.memeText}>{topText}</Text></View>
              <View style={[styles.overlay, { top: `${bottomY}%` }]}><Text style={styles.memeText}>{bottomText}</Text></View>
              {loading && <View style={styles.loader}><ActivityIndicator color={colors.brandPrimary} size="large" /></View>}
            </View>

            <View style={styles.controls}>
              <View style={styles.inputHeader}>
                <Text style={styles.label}>ÉDITION DU TEXTE</Text>
                <TouchableOpacity onPress={generateAI} style={styles.aiBadge}>
                  <AppIcon name="sparkles" color={colors.brandPrimary} size={14} />
                  <Text style={styles.aiBadgeText}>IA</Text>
                </TouchableOpacity>
              </View>

              <TextInput
                style={styles.input}
                value={topText} onChangeText={setTopText} placeholder="Texte du haut..." placeholderTextColor={colors.silver}
              />
              <Slider style={styles.slider} minimumValue={5} maximumValue={45} value={topY} onValueChange={setTopY} minimumTrackTintColor={colors.brandPrimary} thumbTintColor={colors.brandPrimary} />

              <TextInput
                style={[styles.input, { marginTop: 10 }]}
                value={bottomText} onChangeText={setBottomText} placeholder="Texte du bas..." placeholderTextColor={colors.silver}
              />
              <Slider style={styles.slider} minimumValue={55} maximumValue={95} value={bottomY} onValueChange={setBottomY} minimumTrackTintColor={colors.brandSecondary} thumbTintColor={colors.brandSecondary} />
            </View>

            <View style={styles.actionFixedBar}>
              <TouchableOpacity style={[styles.actionBtn, { backgroundColor: '#25D366', borderColor: '#12b534' }]} onPress={() => handleAction('whatsapp')} disabled={isProcessing}>
                {isProcessing ? <ActivityIndicator color="#fff" /> : <AppIcon name="share-2" color="#fff" size={24} />}
              </TouchableOpacity>

              <TouchableOpacity style={[styles.actionBtn, { backgroundColor: colors.brandPrimary, borderColor: colors.brandPrimaryDark, flex: 2 }]} onPress={() => handleAction('download')}>
                <Text style={styles.actionText}>SAUVEGARDER</Text>
              </TouchableOpacity>

              <TouchableOpacity style={[styles.actionBtn, { backgroundColor: colors.cloudGray, borderColor: '#b5b5b5' }]} onPress={() => setImagePicked(false)}>
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
  header: { marginBottom: 15 },
  headerContent: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { fontSize: 28, fontWeight: '900' },
  subtitle: { fontSize: 13, color: colors.textMuted },
  entryZone: { marginTop: 20 },
  bigBtn: { height: 80, borderRadius: radius.md, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 15, borderWidth: 2, borderBottomWidth: 4 },
  bigBtnText: { color: '#fff', fontWeight: '900', fontSize: 16 },
  studio: { width: '100%' },
  canvas: { width: '100%', aspectRatio: 1, borderRadius: radius.md, overflow: 'hidden', backgroundColor: '#000', borderWidth: 2, borderColor: colors.cloudGray },
  baseImg: { width: '100%', height: '100%', opacity: 0.9 },
  overlay: { position: 'absolute', left: 0, right: 0, alignItems: 'center', paddingHorizontal: 12 },
  memeText: { color: '#fff', fontSize: 28, fontWeight: '900', textAlign: 'center', textShadowColor: '#000', textShadowOffset: { width: 2, height: 2 }, textShadowRadius: 4, textTransform: 'uppercase' },
  loader: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center' },
  controls: { marginTop: 15, padding: 15, backgroundColor: colors.snowWhite, borderWidth: 2, borderBottomWidth: 4, borderColor: colors.cloudGray, borderRadius: radius.md },
  inputHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  label: { fontSize: 11, fontWeight: '800', color: colors.textMuted },
  aiBadge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10, backgroundColor: colors.brandPrimary + '20' },
  aiBadgeText: { color: colors.brandPrimary, fontSize: 10, fontWeight: '900', marginLeft: 4 },
  input: { backgroundColor: '#f5f5f5', borderRadius: radius.sm, padding: 12, fontSize: 15, fontWeight: '700', borderWidth: 2, borderColor: colors.cloudGray, color: colors.almostBlack },
  slider: { width: '100%', height: 40 },
  actionFixedBar: { flexDirection: 'row', gap: 8, marginTop: 15, marginBottom: 50 },
  actionBtn: { flex: 1, height: 55, borderRadius: radius.md, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderBottomWidth: 4 },
  actionText: { color: '#fff', fontWeight: '900', fontSize: 14 }
});

export default StatusRemixerScreen;
