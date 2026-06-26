
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { colors, radius, spacing } from '../theme/tokens';
import CompanionAvatar from '../components/CompanionAvatar';

const TOOLS = [
  { id: 'context', title: 'Context Reader', icon: '📝', color: colors.art, screen: 'ContextReader' },
  { id: 'remix', title: 'Status Remixer', icon: '✨', color: colors.bio, screen: 'StatusRemixer' },
  { id: 'voice', title: 'Voice to Meme', icon: '🎙️', color: colors.ubu, screen: 'VoiceToMeme' },
  { id: 'forum', title: 'Forum Viral', icon: '🌍', color: colors.duoGreen, screen: 'Forum' },
];

const HomeScreen = ({ navigate }) => {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header Style Duolingo */}
      <View style={styles.hero}>
        <CompanionAvatar companion="arch" size={120} />
        <View style={styles.heroText}>
          <Text style={styles.title}>Viral Stick</Text>
          <Text style={styles.subtitle}>Crée du contenu viral en quelques secondes.</Text>
        </View>
      </View>

      {/* Grid de Outils */}
      <View style={styles.grid}>
        {TOOLS.map((tool) => (
          <TouchableOpacity
            key={tool.id}
            style={[styles.card, { borderColor: tool.color + '44' }]}
            onPress={() => navigate(tool.screen)}
          >
            <Text style={styles.cardIcon}>{tool.icon}</Text>
            <Text style={styles.cardTitle}>{tool.title}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* CTA Forum */}
      <TouchableOpacity
        style={styles.forumCta}
        onPress={() => navigate('Forum')}
      >
        <Text style={styles.forumCtaText}>Découvrir le Forum ❤️</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  content: { padding: spacing.lg },
  hero: {
    flexDirection: 'row', alignItems: 'center', gap: 20,
    marginBottom: 40, marginTop: 20
  },
  heroText: { flex: 1 },
  title: { fontSize: 32, fontWeight: '900', color: colors.almostBlack },
  subtitle: { fontSize: 16, color: colors.graphite, marginTop: 4 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 16 },
  card: {
    width: '47%', aspectRatio: 1, backgroundColor: '#fff',
    borderRadius: radius.xl, borderWidth: 2, padding: 20,
    justifyContent: 'center', alignItems: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05, elevation: 2
  },
  cardIcon: { fontSize: 40, marginBottom: 12 },
  cardTitle: { fontWeight: '800', color: colors.almostBlack, textAlign: 'center' },
  forumCta: {
    marginTop: 30, backgroundColor: colors.duoGreenLight,
    padding: 20, borderRadius: radius.xl, alignItems: 'center',
    borderWidth: 2, borderColor: colors.duoGreen + '33'
  },
  forumCtaText: { fontWeight: '900', color: colors.duoGreenDark, fontSize: 16 }
});

export default HomeScreen;
