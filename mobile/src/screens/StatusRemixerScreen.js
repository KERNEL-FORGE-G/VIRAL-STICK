import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity, TextInput, Alert, Image, ActivityIndicator, StatusBar, Platform } from "react-native";
import Slider from '@react-native-community/slider';
import { launchImageLibrary, launchCamera } from 'react-native-image-picker';
import axios from "axios";
import { useTheme, spacing, shadows, radius } from "../theme";
import GlassCard from "../components/GlassCard";
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

  // LIVE STUDIO STATES
  const [topText, setTopText]       = useState(params.topText || "");
  const [bottomText, setBottomText] = useState(params.bottomText || "");
  const [topY, setTopY]             = useState(12);
  const [bottomY, setBottomY]       = useState(88);

  useEffect(() => {
    if (params.imageUrl) {
      setInitialImage(params.imageUrl);
      setImagePicked(true);
      if (!topText) setTopText("REMIX VIRAL");
    }
  }, [params]);

  const pickImage = async (source) => {
    const options = {
      mediaType: 'photo',
      quality: 0.7,
      maxWidth: 1024,
      maxHeight: 1024,
      includeBase64: true
    };
    try {
      let result = source === 'camera' ? await launchCamera(options) : await launchImageLibrary(options);
      if (result.assets?.[0]) {
        const asset = result.assets[0];
        setInitialImage(asset.uri);
        setImageBase64(asset.base64);
        setImagePicked(true);
        setTopText("ÉCRIS ICI");
      }
    } catch (e) { Alert.alert('Erreur', 'Image inaccessible'); }
  };

  const generateAI = async () => {
    if (!initialImage) return;
    setLoading(true);
    try {
      // On envoie le base64 si dispo, sinon l'URL (pour le forum)
      const res = await axios.post(apiUrl("/api/memes/status-remixer"), {
        inputImageUrl: initialImage.startsWith('http') ? initialImage : null,
        inputImageBase64: imageBase64
      });
      setTopText(res.data.meme_text || "QUAND TU REMIXES...");
    } catch (e) {
      setTopText("ÉCRIS TON TEXTE");
    } finally { setLoading(false); }
  };

  const handleAction = async (type) => {
    if (isProcessing) return;
    setIsProcessing(true);
    try {
      // FUSION AUTOMATIQUE : On envoie tout au serveur pour graver le texte
      const res = await axios.post(apiUrl("/api/memes/compose"), {
        imageUrl: initialImage.startsWith('http') ? initialImage : null,
        imageBase64: imageBase64,
        topText, bottomText, topY, bottomY
      });

      const finalUrl = res.data.composedImageUrl;
      if (type === 'whatsapp') {
        await shareToWhatsApp(finalUrl, "");
      } else {
        await downloadImageToGallery(finalUrl);
        Alert.alert("Succès", "Mème enregistré dans la galerie !");
      }
    } catch (e) {
      console.error(e);
      Alert.alert("Erreur", "La fusion a échoué sur le serveur.");
    } finally { setIsProcessing(false); }
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">

        <GlassCard style={styles.header}>
          <View style={styles.headerContent}>
            <View>
              <Text style={[styles.title, { color: theme.textPrimary }]}>Status <Text style={{ color: theme.primary }}>Remixer</Text></Text>
              <Text style={[styles.subtitle, { color: theme.textSecondary }]}>Studio de fusion automatique</Text>
            </View>
            <CompanionAvatar companion="bio" size={50} floating />
          </View>
        </GlassCard>

        {!imagePicked ? (
          <View style={styles.entryZone}>
            <TouchableOpacity style={[styles.bigBtn, { backgroundColor: theme.primary }, shadows.card]} onPress={() => pickImage('camera')}>
              <AppIcon name="camera" color="#fff" size={30} />
              <Text style={styles.bigBtnText}>APPAREIL PHOTO</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.bigBtn, { backgroundColor: theme.backgroundCard, borderWidth: 1, borderColor: theme.border, marginTop: 15 }, shadows.card]} onPress={() => pickImage('gallery')}>
              <AppIcon name="image" color={theme.primary} size={30} />
              <Text style={[styles.bigBtnText, { color: theme.textPrimary }]}>GALERIE PHOTO</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.studio}>
            {/* 🖼️ LIVE CANVAS WITH OVERLAY */}
            <View style={[styles.canvas, shadows.card, { borderColor: theme.border, borderWidth: 1 }]}>
              <Image source={{ uri: initialImage }} style={styles.baseImg} resizeMode="cover" />
              <View style={[styles.overlay, { top: `${topY}%` }]}><Text style={styles.memeText}>{topText}</Text></View>
              <View style={[styles.overlay, { top: `${bottomY}%` }]}><Text style={styles.memeText}>{bottomText}</Text></View>
              {loading && <View style={styles.loader}><ActivityIndicator color={theme.primary} size="large" /></View>}
            </View>

            {/* 🎛️ CONTROLES STUDIO */}
            <GlassCard style={styles.controls}>
              <View style={styles.inputHeader}>
                <Text style={[styles.label, { color: theme.textMuted }]}>ÉDITION DU TEXTE</Text>
                <TouchableOpacity onPress={generateAI} style={styles.aiBadge}>
                  <AppIcon name="sparkles" color={theme.primary} size={14} />
                  <Text style={{ color: theme.primary, fontSize: 10, fontWeight: '900', marginLeft: 4 }}>IA</Text>
                </TouchableOpacity>
              </View>

              <TextInput
                style={[styles.input, { color: theme.textPrimary, backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)' }]}
                value={topText} onChangeText={setTopText} placeholder="Texte du haut..." placeholderTextColor="#666"
              />
              <Slider style={styles.slider} minimumValue={5} maximumValue={45} value={topY} onValueChange={setTopY} minimumTrackTintColor={theme.primary} thumbTintColor={theme.primary} />

              <View style={{ height: 10 }} />

              <TextInput
                style={[styles.input, { color: theme.textPrimary, backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)' }]}
                value={bottomText} onChangeText={setBottomText} placeholder="Texte du bas..." placeholderTextColor="#666"
              />
              <Slider style={styles.slider} minimumValue={55} maximumValue={95} value={bottomY} onValueChange={setBottomY} minimumTrackTintColor={theme.secondary} thumbTintColor={theme.secondary} />
            </GlassCard>

            {/* 🚀 BARRE D'ACTIONS BASSE */}
            <View style={styles.actionFixedBar}>
              <TouchableOpacity
                style={[styles.shareBtn, { backgroundColor: '#22C55E' }, shadows.card]}
                onPress={() => handleAction('whatsapp')}
                disabled={isProcessing}
              >
                {isProcessing ? <ActivityIndicator color="#fff" /> : <><AppIcon name="share-2" color="#fff" size={22} /><Text style={styles.actionText}>WHATSAPP</Text></>}
              </TouchableOpacity>

              <TouchableOpacity style={[styles.iconAction, { backgroundColor: theme.primary }, shadows.card]} onPress={() => handleAction('download')}>
                <AppIcon name="download" color="#fff" size={24} />
              </TouchableOpacity>

              <TouchableOpacity style={[styles.iconAction, { backgroundColor: 'rgba(150,150,150,0.2)' }]} onPress={() => setImagePicked(false)}>
                <AppIcon name="refresh-cw" color={theme.textPrimary} size={24} />
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
  header: { marginBottom: 15, padding: spacing.md },
  headerContent: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { fontSize: 28, fontWeight: '900', letterSpacing: -1 },
  subtitle: { fontSize: 13, fontWeight: '700' },
  entryZone: { marginTop: 20 },
  bigBtn: { height: 80, borderRadius: 24, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 15 },
  bigBtnText: { color: '#fff', fontWeight: '900', fontSize: 16, letterSpacing: 1 },
  studio: { width: '100%' },
  canvas: { width: '100%', aspectRatio: 1, borderRadius: 32, overflow: 'hidden', backgroundColor: '#000', position: 'relative' },
  baseImg: { width: '100%', height: '100%', opacity: 0.8 },
  overlay: { position: 'absolute', left: 0, right: 0, alignItems: 'center', paddingHorizontal: 20 },
  memeText: {
    color: '#fff', fontSize: 26, fontWeight: '900', textAlign: 'center',
    textShadowColor: '#000', textShadowOffset: { width: 2, height: 2 }, textShadowRadius: 4,
    textTransform: 'uppercase'
  },
  loader: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center' },
  controls: { marginTop: 15, padding: 18 },
  inputHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  label: { fontSize: 10, fontWeight: '900', letterSpacing: 1.5 },
  aiBadge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 10, backgroundColor: 'rgba(37,99,235,0.1)' },
  input: { borderRadius: 12, padding: 14, fontSize: 16, fontWeight: '800' },
  slider: { width: '100%', height: 45 },
  actionFixedBar: { flexDirection: 'row', gap: 10, marginTop: 15 },
  shareBtn: { flex: 3, height: 65, borderRadius: 22, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 10 },
  iconAction: { flex: 1, height: 65, borderRadius: 22, justifyContent: 'center', alignItems: 'center' },
  actionText: { color: '#fff', fontWeight: '900', fontSize: 17 }
});

export default StatusRemixerScreen;
