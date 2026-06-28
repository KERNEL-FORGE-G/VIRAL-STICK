import React, { useState, useEffect } from "react";
import { View, Text, TextInput, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity, Alert, Keyboard, Image, StatusBar, ActivityIndicator } from "react-native";
import Slider from '@react-native-community/slider';
import axios from "axios";
import { useTheme, spacing, shadows, radius } from "../theme";
import GlassCard from "../components/GlassCard";
import AppIcon from "../components/AppIcon";
import { apiUrl } from "../config/api";
import { shareToWhatsApp, downloadImageToGallery } from "../utils/shareUtils";
import CompanionAvatar from "../components/CompanionAvatar";

const ContextReaderScreen = ({ navigate }) => {
  const { theme, isDark } = useTheme();
  const [text, setText]       = useState("");
  const [meme, setMeme]       = useState(null);
  const [loading, setLoading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const [topText, setTopText]       = useState("");
  const [bottomText, setBottomText] = useState("");
  const [topY, setTopY]             = useState(12);
  const [bottomY, setBottomY]       = useState(88);

  const generateMeme = async () => {
    if (!text.trim()) return;
    Keyboard.dismiss(); setLoading(true); setMeme(null);
    try {
      const res = await axios.post(apiUrl("/api/memes/generate-from-text"), { text });
      setMeme(res.data);
      setTopText(res.data.topText || "");
      setBottomText(res.data.bottomText || "");
    } catch (e) {
      Alert.alert("Erreur", "Le studio est momentanément indisponible.");
    } finally { setLoading(false); }
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
      if (type === 'whatsapp') await shareToWhatsApp(finalUrl, "");
      else await downloadImageToGallery(finalUrl);
    } catch (e) {
      Alert.alert("Export", "Erreur lors de la fusion finale.");
    } finally { setIsProcessing(false); }
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">

        <GlassCard style={styles.header}>
          <View style={styles.headerTop}>
            <View>
              <Text style={[styles.title, { color: theme.textPrimary }]}>Context <Text style={{ color: theme.warning }}>Reader</Text></Text>
              <Text style={[styles.subtitle, { color: theme.textSecondary }]}>Analyseur de situation IA</Text>
            </View>
            <CompanionAvatar companion="art" size={50} floating />
          </View>
        </GlassCard>

        {!meme ? (
          <GlassCard style={styles.inputCard}>
            <TextInput
              style={[styles.input, { color: theme.textPrimary, borderColor: theme.border }]}
              placeholder="Décris ta situation..."
              placeholderTextColor={theme.textMuted}
              multiline value={text} onChangeText={setText}
            />
            <TouchableOpacity style={[styles.mainBtn, { backgroundColor: theme.primary }, shadows.btn]} onPress={generateMeme} disabled={loading}>
              {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnLabel}>GÉNÉRER LE MÈME</Text>}
            </TouchableOpacity>
          </GlassCard>
        ) : (
          <View style={styles.studio}>
            <View style={[styles.canvas, shadows.card, { borderColor: theme.border, borderWidth: 1 }]}>
              <Image source={{ uri: meme.imageUrl }} style={styles.baseImg} resizeMode="cover" />
              <View style={[styles.overlay, { top: `${topY}%` }]}><Text style={styles.memeText}>{topText}</Text></View>
              <View style={[styles.overlay, { top: `${bottomY}%` }]}><Text style={styles.memeText}>{bottomText}</Text></View>
            </View>

            <GlassCard style={styles.controls}>
              <Text style={[styles.label, { color: theme.textMuted }]}>ÉDITION DU TEXTE</Text>
              <TextInput style={[styles.studioInput, { color: theme.textPrimary }]} value={topText} onChangeText={setTopText} />
              <Slider style={styles.slider} minimumValue={5} maximumValue={45} value={topY} onValueChange={setTopY} minimumTrackTintColor={theme.primary} thumbTintColor={theme.primary} />

              <View style={{ height: 10 }} />

              <TextInput style={[styles.studioInput, { color: theme.textPrimary }]} value={bottomText} onChangeText={setBottomText} />
              <Slider style={styles.slider} minimumValue={55} maximumValue={95} value={bottomY} onValueChange={setBottomY} minimumTrackTintColor={theme.secondary} thumbTintColor={theme.secondary} />
            </GlassCard>

            <View style={styles.actionFixedBar}>
              <TouchableOpacity style={[styles.shareBtn, { backgroundColor: '#22C55E' }, shadows.btn]} onPress={() => handleAction('whatsapp')} disabled={isProcessing}>
                {isProcessing ? <ActivityIndicator color="#fff" /> : <><AppIcon name="share-2" color="#fff" size={22} /><Text style={styles.actionText}>WHATSAPP</Text></>}
              </TouchableOpacity>

              <TouchableOpacity style={[styles.iconAction, { backgroundColor: theme.primary }, shadows.btn]} onPress={() => handleAction('download')}>
                <AppIcon name="download" color="#fff" size={24} />
              </TouchableOpacity>

              <TouchableOpacity style={[styles.iconAction, { backgroundColor: 'rgba(150,150,150,0.2)' }]} onPress={() => setMeme(null)}>
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
  header: { marginBottom: 20, padding: 15 },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { fontSize: 28, fontWeight: '900', letterSpacing: -1 },
  subtitle: { fontSize: 13, fontWeight: '600', marginTop: 2 },
  inputCard: { padding: 20 },
  input: { minHeight: 120, fontSize: 18, borderBottomWidth: 1, marginBottom: 25, textAlignVertical: 'top' },
  mainBtn: { height: 65, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  btnLabel: { color: '#fff', fontWeight: '900', fontSize: 16, letterSpacing: 1 },
  studio: { width: '100%' },
  canvas: { width: '100%', aspectRatio: 1, borderRadius: 32, overflow: 'hidden', backgroundColor: '#000', position: 'relative' },
  baseImg: { width: '100%', height: '100%', opacity: 0.8 },
  overlay: { position: 'absolute', left: 0, right: 0, alignItems: 'center', paddingHorizontal: 20 },
  memeText: { color: '#fff', fontSize: 26, fontWeight: '900', textAlign: 'center', textShadowColor: '#000', textShadowOffset: { width: 2, height: 2 }, textShadowRadius: 4, textTransform: 'uppercase' },
  controls: { marginTop: 15, padding: 18 },
  label: { fontSize: 10, fontWeight: '900', letterSpacing: 1.5, marginBottom: 8 },
  studioInput: { backgroundColor: 'rgba(150,150,150,0.1)', borderRadius: 12, padding: 14, fontSize: 16, fontWeight: '800' },
  slider: { width: '100%', height: 45 },
  actionFixedBar: { flexDirection: 'row', gap: 10, marginTop: 15 },
  shareBtn: { flex: 3, height: 65, borderRadius: 22, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 10 },
  iconAction: { flex: 1, height: 65, borderRadius: 22, justifyContent: 'center', alignItems: 'center' },
  actionText: { color: '#fff', fontWeight: '900', fontSize: 17 }
});

export default ContextReaderScreen;
