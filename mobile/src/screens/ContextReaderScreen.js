/**
 * ContextReaderScreen — Text-to-Meme via Gemini AI
 * Viral Stick | KERNEL FORGE — 2026
 *
 * Companion: art
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Animated,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Keyboard,
} from 'react-native';
import axios from 'axios';
import { useTheme, spacing, radius, typography, createShadow } from '../theme';
import GlassCard from '../components/GlassCard';
import AnimatedButton from '../components/AnimatedButton';
import CompanionAvatar from '../components/CompanionAvatar';

const API_BASE = 'http://10.0.2.2:3000'; // Android emulator → localhost

const ART_MESSAGES = [
  '🎨 Donne-moi un contexte et je crée la légende !',
  '📖 Je lis entre les lignes pour toi...',
  '💡 Un bon mème, ça se construit sur une bonne idée !',
  '🔥 Tape quelque chose de viral !',
];

const ContextReaderScreen = ({ navigate }) => {
  const { theme } = useTheme();
  const [text, setText] = useState('');
  const [meme, setMeme] = useState(null);
  const [loading, setLoading] = useState(false);
  const [msgIdx, setMsgIdx] = useState(0);
  const resultAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim  = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const t = setInterval(() => setMsgIdx(i => (i + 1) % ART_MESSAGES.length), 5000);
    return () => clearInterval(t);
  }, []);

  // Pulse loading animation
  useEffect(() => {
    if (loading) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, { toValue: 1.08, duration: 600, useNativeDriver: true }),
          Animated.timing(pulseAnim, { toValue: 1,    duration: 600, useNativeDriver: true }),
        ]),
      ).start();
    } else {
      pulseAnim.stopAnimation();
      pulseAnim.setValue(1);
    }
  }, [loading]);

  const generateMeme = async () => {
    if (!text.trim()) {
      Alert.alert('Viral Stick', 'Entre un texte de contexte !');
      return;
    }
    Keyboard.dismiss();
    setLoading(true);
    setMeme(null);
    try {
      const res = await axios.post(`${API_BASE}/api/memes/generate-from-text`, { text });
      setMeme(res.data);
      Animated.spring(resultAnim, {
        toValue: 1,
        tension: 70,
        friction: 7,
        useNativeDriver: true,
      }).start();
    } catch (err) {
      Alert.alert('Erreur', 'Impossible de générer le mème. Vérifie ta connexion.');
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setText('');
    setMeme(null);
    resultAnim.setValue(0);
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={[styles.screenTag, { color: theme.textMuted }]}>MODULE 1</Text>
            <Text style={[styles.title, { color: theme.textPrimary }]}>
              Context <Text style={{ color: theme.primaryLight }}>Reader</Text>
            </Text>
          </View>
          <CompanionAvatar companion="art" size={68} floating message={ART_MESSAGES[msgIdx]} />
        </View>

        {/* Input */}
        <GlassCard animate delay={100} style={styles.inputCard}>
          <Text style={[styles.label, { color: theme.textSecondary }]}>
            📝 Contexte ou situation
          </Text>
          <TextInput
            style={[
              styles.input,
              {
                color: theme.textPrimary,
                borderColor: text.length > 0 ? theme.primary : theme.border,
                backgroundColor: theme.backgroundSecondary,
              },
            ]}
            value={text}
            onChangeText={setText}
            placeholder="Ex: Mon prof est arrivé en retard à son propre cours..."
            placeholderTextColor={theme.textMuted}
            multiline
            numberOfLines={5}
            textAlignVertical="top"
            maxLength={400}
          />
          <Text style={[styles.charCount, { color: theme.textMuted }]}>
            {text.length}/400
          </Text>
        </GlassCard>

        {/* Generate Button */}
        <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
          <AnimatedButton
            title={loading ? 'Génération...' : '✨ Générer le mème'}
            onPress={generateMeme}
            loading={loading}
            disabled={loading}
            size="lg"
            style={styles.btn}
          />
        </Animated.View>

        {/* Loading indicator */}
        {loading && (
          <GlassCard animate style={styles.loadingCard}>
            <ActivityIndicator color={theme.primary} size="large" />
            <Text style={[styles.loadingText, { color: theme.textSecondary }]}>
              Art analyse ton contexte...
            </Text>
            <Text style={[styles.loadingSubtext, { color: theme.textMuted }]}>
              Gemini IA en action 🤖
            </Text>
          </GlassCard>
        )}

        {/* Result */}
        {meme && (
          <Animated.View
            style={{
              opacity: resultAnim,
              transform: [{ translateY: resultAnim.interpolate({ inputRange: [0, 1], outputRange: [30, 0] }) }],
            }}
          >
            <GlassCard style={styles.resultCard}>
              <Text style={[styles.resultTitle, { color: theme.primaryLight }]}>
                🔥 Mème Généré !
              </Text>

              {/* Meme preview */}
              <View style={[styles.memePreview, { backgroundColor: theme.backgroundSecondary, borderColor: theme.border }]}>
                <Text style={[styles.memeTopText, { color: theme.textPrimary }]}>
                  {meme.topText || ''}
                </Text>
                <View style={styles.memePlaceholder}>
                  <Text style={styles.memeEmoji}>🖼️</Text>
                  <Text style={[styles.memeDesc, { color: theme.textMuted }]}>
                    {meme.descriptionImage || 'Image de mème'}
                  </Text>
                </View>
                <Text style={[styles.memeBottomText, { color: theme.textPrimary }]}>
                  {meme.bottomText || ''}
                </Text>
              </View>

              <View style={styles.resultActions}>
                <AnimatedButton title="🔁 Régénérer" onPress={generateMeme} variant="ghost" size="sm" style={{ flex: 1 }} />
                <AnimatedButton title="🗑️ Effacer" onPress={reset} variant="ghost" size="sm" style={{ flex: 1 }} />
              </View>
            </GlassCard>
          </Animated.View>
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
  screenTag: {
    fontSize: typography.fontSize.xs,
    letterSpacing: 2,
    textTransform: 'uppercase',
    fontWeight: '600',
  },
  title: {
    fontSize: typography.fontSize.xxl,
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  inputCard: { marginBottom: spacing.md },
  label: {
    fontSize: typography.fontSize.sm,
    fontWeight: '600',
    marginBottom: spacing.sm,
  },
  input: {
    borderWidth: 1.5,
    borderRadius: radius.md,
    padding: spacing.md,
    fontSize: typography.fontSize.md,
    minHeight: 130,
  },
  charCount: {
    textAlign: 'right',
    fontSize: typography.fontSize.xs,
    marginTop: 4,
  },
  btn: { marginBottom: spacing.md },
  loadingCard: {
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  loadingText: {
    fontSize: typography.fontSize.md,
    fontWeight: '600',
    marginTop: spacing.sm,
  },
  loadingSubtext: {
    fontSize: typography.fontSize.xs,
  },
  resultCard: { marginBottom: spacing.md },
  resultTitle: {
    fontSize: typography.fontSize.xl,
    fontWeight: '800',
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  memePreview: {
    borderRadius: radius.md,
    borderWidth: 1,
    padding: spacing.md,
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  memeTopText: {
    fontSize: typography.fontSize.lg,
    fontWeight: '800',
    textTransform: 'uppercase',
    textAlign: 'center',
    marginBottom: spacing.sm,
    letterSpacing: 0.5,
  },
  memePlaceholder: {
    width: '100%',
    height: 160,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.1)',
    borderRadius: radius.md,
    marginVertical: spacing.sm,
  },
  memeEmoji: { fontSize: 48 },
  memeDesc: {
    fontSize: typography.fontSize.xs,
    textAlign: 'center',
    marginTop: 8,
    maxWidth: '80%',
  },
  memeBottomText: {
    fontSize: typography.fontSize.lg,
    fontWeight: '800',
    textTransform: 'uppercase',
    textAlign: 'center',
    marginTop: spacing.sm,
    letterSpacing: 0.5,
  },
  resultActions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
});

export default ContextReaderScreen;
