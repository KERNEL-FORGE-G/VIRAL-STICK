/**
 * StatusRemixerScreen — Image picker + text overlay + sticker generator
 * Viral Stick | KERNEL FORGE — 2026
 *
 * Companion: bio
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Animated,
  TouchableOpacity,
  TextInput,
  Alert,
  Image,
} from 'react-native';
import { useTheme, spacing, radius, typography, createShadow } from '../theme';
import GlassCard from '../components/GlassCard';
import AnimatedButton from '../components/AnimatedButton';
import CompanionAvatar from '../components/CompanionAvatar';

const BIO_MESSAGES = [
  '🌿 Bio ici ! Remixons ton status en chef-d\'œuvre !',
  '🎭 Un sticker = mille mots. Laisse-moi t\'aider !',
  '🌟 Ta photo + ma magie = contenu viral garanti !',
  '🎨 Donne-moi une image et transforme-la !',
];

const FILTERS = [
  { id: 'none',     label: 'Original',   emoji: '📷' },
  { id: 'dramatic', label: 'Dramatic',   emoji: '🌑' },
  { id: 'neon',     label: 'Neon',       emoji: '💫' },
  { id: 'vintage',  label: 'Vintage',    emoji: '🎞️' },
  { id: 'fire',     label: 'Fire',       emoji: '🔥' },
];

const TEXT_POSITIONS = ['top', 'center', 'bottom'];

const StatusRemixerScreen = ({ navigate }) => {
  const { theme } = useTheme();
  const [selectedFilter, setSelectedFilter] = useState('none');
  const [overlayText, setOverlayText] = useState('');
  const [textPosition, setTextPosition] = useState('bottom');
  const [imagePicked, setImagePicked] = useState(false);
  const [msgIdx, setMsgIdx] = useState(0);
  const previewAnim = useRef(new Animated.Value(0)).current;
  const filterScales = useRef(FILTERS.map(() => new Animated.Value(1))).current;

  useEffect(() => {
    const t = setInterval(() => setMsgIdx(i => (i + 1) % BIO_MESSAGES.length), 5500);
    return () => clearInterval(t);
  }, []);

  const pickImage = () => {
    // In production: use react-native-image-picker
    Alert.alert(
      'Sélectionner une image',
      'Choisir depuis:',
      [
        { text: '📷 Caméra', onPress: () => simulatePickImage() },
        { text: '🖼️ Galerie', onPress: () => simulatePickImage() },
        { text: 'Annuler', style: 'cancel' },
      ],
    );
  };

  const simulatePickImage = () => {
    setImagePicked(true);
    Animated.spring(previewAnim, {
      toValue: 1,
      tension: 70,
      friction: 7,
      useNativeDriver: true,
    }).start();
  };

  const selectFilter = (filterId, index) => {
    setSelectedFilter(filterId);
    Animated.sequence([
      Animated.timing(filterScales[index], { toValue: 0.85, duration: 100, useNativeDriver: true }),
      Animated.spring(filterScales[index], { toValue: 1, tension: 150, friction: 5, useNativeDriver: true }),
    ]).start();
  };

  const getFilterOverlay = () => {
    switch (selectedFilter) {
      case 'dramatic': return 'rgba(0,0,0,0.6)';
      case 'neon':     return 'rgba(124,58,237,0.4)';
      case 'vintage':  return 'rgba(180,120,60,0.4)';
      case 'fire':     return 'rgba(239,68,68,0.35)';
      default:         return 'transparent';
    }
  };

  const exportSticker = () => {
    Alert.alert('Viral Stick', '✨ Sticker exporté ! (En développement — la génération PNG sera disponible dans v1.1)');
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={[styles.screenTag, { color: theme.textMuted }]}>MODULE 3</Text>
            <Text style={[styles.title, { color: theme.textPrimary }]}>
              Status{' '}
              <Text style={{ color: '#F59E0B' }}>Remixer</Text>
            </Text>
          </View>
          <CompanionAvatar companion="bio" size={68} floating message={BIO_MESSAGES[msgIdx]} />
        </View>

        {/* Image picker */}
        {!imagePicked ? (
          <GlassCard animate delay={100} style={styles.pickCard}>
            <TouchableOpacity onPress={pickImage} activeOpacity={0.8} style={styles.pickBtn}>
              <Text style={styles.pickIcon}>🖼️</Text>
              <Text style={[styles.pickTitle, { color: theme.textPrimary }]}>
                Choisir une image
              </Text>
              <Text style={[styles.pickSubtitle, { color: theme.textMuted }]}>
                Caméra ou galerie photo
              </Text>
            </TouchableOpacity>
            <View style={[styles.pickDivider, { backgroundColor: theme.divider }]} />
            <Text style={[styles.pickOr, { color: theme.textMuted }]}>ou</Text>
            <AnimatedButton
              title="📋 Utiliser une image démo"
              onPress={simulatePickImage}
              variant="ghost"
              size="sm"
            />
          </GlassCard>
        ) : (
          <>
            {/* Preview Canvas */}
            <Animated.View
              style={{
                opacity: previewAnim,
                transform: [{ scale: previewAnim.interpolate({ inputRange: [0, 1], outputRange: [0.85, 1] }) }],
              }}
            >
              <GlassCard style={styles.canvasCard}>
                <View style={[styles.canvas, { backgroundColor: theme.backgroundSecondary, borderColor: theme.border }]}>
                  {/* Filter overlay */}
                  <View
                    style={[StyleSheet.absoluteFill, { backgroundColor: getFilterOverlay(), borderRadius: radius.md }]}
                    pointerEvents="none"
                  />

                  {/* Demo image placeholder */}
                  <View style={styles.imagePlaceholder}>
                    <Text style={{ fontSize: 72 }}>
                      {selectedFilter === 'fire'     ? '🔥' :
                       selectedFilter === 'neon'     ? '💫' :
                       selectedFilter === 'dramatic' ? '🌑' :
                       selectedFilter === 'vintage'  ? '🎞️' : '📸'}
                    </Text>
                    <Text style={[styles.demoLabel, { color: theme.textMuted }]}>Image sélectionnée</Text>
                  </View>

                  {/* Overlay text */}
                  {overlayText.length > 0 && (
                    <Text
                      style={[
                        styles.overlayText,
                        { color: '#FFFFFF' },
                        textPosition === 'top'    ? styles.textTop    :
                        textPosition === 'center' ? styles.textCenter :
                                                    styles.textBottom,
                      ]}
                    >
                      {overlayText.toUpperCase()}
                    </Text>
                  )}
                </View>
              </GlassCard>
            </Animated.View>

            {/* Filters */}
            <GlassCard animate delay={100} style={styles.filterCard}>
              <Text style={[styles.sectionLabel, { color: theme.textSecondary }]}>🎨 Filtres</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterRow}>
                {FILTERS.map((f, idx) => (
                  <Animated.View key={f.id} style={{ transform: [{ scale: filterScales[idx] }] }}>
                    <TouchableOpacity
                      onPress={() => selectFilter(f.id, idx)}
                      style={[
                        styles.filterChip,
                        {
                          backgroundColor: selectedFilter === f.id ? `${theme.primary}33` : theme.backgroundSecondary,
                          borderColor: selectedFilter === f.id ? theme.primary : theme.border,
                        },
                      ]}
                    >
                      <Text style={styles.filterEmoji}>{f.emoji}</Text>
                      <Text style={[styles.filterLabel, { color: selectedFilter === f.id ? theme.primaryLight : theme.textSecondary }]}>
                        {f.label}
                      </Text>
                    </TouchableOpacity>
                  </Animated.View>
                ))}
              </ScrollView>
            </GlassCard>

            {/* Text overlay */}
            <GlassCard animate delay={150} style={styles.textCard}>
              <Text style={[styles.sectionLabel, { color: theme.textSecondary }]}>✏️ Texte overlay</Text>
              <TextInput
                style={[
                  styles.textInput,
                  {
                    color: theme.textPrimary,
                    borderColor: overlayText.length > 0 ? theme.primary : theme.border,
                    backgroundColor: theme.backgroundSecondary,
                  },
                ]}
                value={overlayText}
                onChangeText={setOverlayText}
                placeholder="Entre ton texte..."
                placeholderTextColor={theme.textMuted}
              />

              {/* Position selector */}
              <View style={styles.posRow}>
                {TEXT_POSITIONS.map(pos => (
                  <TouchableOpacity
                    key={pos}
                    onPress={() => setTextPosition(pos)}
                    style={[
                      styles.posBtn,
                      {
                        backgroundColor: textPosition === pos ? `${theme.primary}22` : 'transparent',
                        borderColor: textPosition === pos ? theme.primary : theme.border,
                      },
                    ]}
                  >
                    <Text style={[styles.posLabel, { color: textPosition === pos ? theme.primaryLight : theme.textSecondary }]}>
                      {pos === 'top' ? '⬆️ Haut' : pos === 'center' ? '↕️ Centre' : '⬇️ Bas'}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </GlassCard>

            {/* Actions */}
            <View style={styles.actions}>
              <AnimatedButton title="🔄 Changer image" onPress={pickImage} variant="ghost" size="sm" style={{ flex: 1 }} />
              <AnimatedButton title="💾 Exporter sticker" onPress={exportSticker} size="sm" style={{ flex: 1 }} />
            </View>
          </>
        )}

        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1 },
  scroll: { paddingHorizontal: spacing.md, paddingTop: 80 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.lg,
  },
  screenTag: { fontSize: typography.fontSize.xs, letterSpacing: 2, textTransform: 'uppercase', fontWeight: '600' },
  title: { fontSize: typography.fontSize.xxl, fontWeight: '900', letterSpacing: -0.5 },
  pickCard: { alignItems: 'center', paddingVertical: spacing.xxl, gap: spacing.sm, marginBottom: spacing.md },
  pickBtn: { alignItems: 'center', gap: spacing.sm },
  pickIcon: { fontSize: 64 },
  pickTitle: { fontSize: typography.fontSize.xl, fontWeight: '700' },
  pickSubtitle: { fontSize: typography.fontSize.sm },
  pickDivider: { width: '60%', height: 1, marginVertical: spacing.sm },
  pickOr: { fontSize: typography.fontSize.sm },
  canvasCard: { marginBottom: spacing.md, padding: 0, overflow: 'hidden' },
  canvas: {
    height: 280,
    borderRadius: radius.lg,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  imagePlaceholder: { alignItems: 'center', gap: 8 },
  demoLabel: { fontSize: typography.fontSize.xs },
  overlayText: {
    position: 'absolute',
    width: '100%',
    textAlign: 'center',
    fontSize: typography.fontSize.xl,
    fontWeight: '900',
    letterSpacing: 1,
    paddingHorizontal: spacing.md,
    textShadowColor: 'rgba(0,0,0,0.9)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 4,
  },
  textTop:    { top: 16 },
  textCenter: { top: '45%' },
  textBottom: { bottom: 16 },
  filterCard: { marginBottom: spacing.sm },
  sectionLabel: { fontSize: typography.fontSize.xs, fontWeight: '700', letterSpacing: 2, textTransform: 'uppercase', marginBottom: spacing.sm },
  filterRow: { gap: spacing.sm, paddingBottom: 4 },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: radius.full,
    borderWidth: 1.5,
    gap: 6,
  },
  filterEmoji: { fontSize: 16 },
  filterLabel: { fontSize: typography.fontSize.sm, fontWeight: '600' },
  textCard: { marginBottom: spacing.md },
  textInput: {
    borderWidth: 1.5,
    borderRadius: radius.md,
    padding: spacing.md,
    fontSize: typography.fontSize.md,
    marginBottom: spacing.md,
  },
  posRow: { flexDirection: 'row', gap: spacing.sm },
  posBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: radius.md,
    borderWidth: 1.5,
    alignItems: 'center',
  },
  posLabel: { fontSize: typography.fontSize.xs, fontWeight: '600' },
  actions: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.sm },
});

export default StatusRemixerScreen;
