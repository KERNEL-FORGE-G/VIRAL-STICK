import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, StatusBar } from 'react-native';
import { theme } from '../theme/theme';

export default function HomeScreen({ navigation }) {
  return (
    <ScrollView 
      style={styles.container} 
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false} // Cache la barre pour un défilement plus propre
    >
      <StatusBar barStyle="light-content" backgroundColor={theme.colors.background} />

      {/* En-tête de la Forge */}
      <View style={styles.headerSection}>
        <Text style={styles.title}>VIRAL STICK 🚀</Text>
        <Text style={styles.subtitle}>Générateur de Mèmes Multimodal</Text>
      </View>

      {/* Cartes de Sélection Stylisées */}
      <View style={styles.menuGrid}>
        
        <TouchableOpacity 
          style={styles.card} 
          onPress={() => navigation.navigate('ContextReader')}
          activeOpacity={0.8}
        >
          <View style={styles.iconContainer}>
            <Text style={styles.cardIcon}>txt</Text>
          </View>
          <View style={styles.cardTextContainer}>
            <Text style={styles.cardTitle}>📝 Context Reader</Text>
            <Text style={styles.cardDescription}>Analyse le ton de tes discussions textuelles.</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.card, styles.cardAudio]} 
          onPress={() => navigation.navigate('VoiceToMeme')}
          activeOpacity={0.8}
        >
          <View style={[styles.iconContainer, styles.iconAudio]}>
            <Text style={styles.cardIcon}>voc</Text>
          </View>
          <View style={styles.cardTextContainer}>
            <Text style={styles.cardTitle}>🎙️ Voice-To-Meme</Text>
            <Text style={styles.cardDescription}>Transcrit et transforme tes notes vocales en mèmes.</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.card, styles.cardImage]} 
          onPress={() => navigation.navigate('StatusRemixer')}
          activeOpacity={0.8}
        >
          <View style={[styles.iconContainer, styles.iconImage]}>
            <Text style={styles.cardIcon}>img</Text>
          </View>
          <View style={styles.cardTextContainer}>
            <Text style={styles.cardTitle}>🖼️ Status Remixer</Text>
            <Text style={styles.cardDescription}>Incruste des punchlines IA sur tes photos locales.</Text>
          </View>
        </TouchableOpacity>

      </View>

      {/* Intégration Finale de la Mascotte Archy */}
      <View style={styles.companionBox}>
        <Text style={styles.companionTag}>COMPAGNON ACTIF</Text>
        <Text style={styles.companionText}>
          💬 Archy : "Le code est propre, la navigation est fluide et l'architecture est validée. Choisis un module pour lancer la démo !"
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: theme.colors.background 
  },
  contentContainer: { 
    padding: 24, 
    paddingBottom: 40 
  },
  headerSection: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 30
  },
  title: { 
    fontSize: 30, 
    fontWeight: '900', 
    color: theme.colors.accent, 
    letterSpacing: 1.5 
  },
  subtitle: { 
    fontSize: 14, 
    color: theme.colors.textMuted, 
    marginTop: 4,
    fontWeight: '500'
  },
  menuGrid: { 
    gap: 16,
    width: '100%'
  },
  card: { 
    backgroundColor: theme.colors.surface, 
    flexDirection: 'row',
    padding: 16, 
    borderRadius: 16, // Angles adoucis professionnels
    borderWidth: 1, 
    borderColor: '#2d2d30',
    alignItems: 'center',
    // Légère ombre pour donner du relief
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  // Variations subtiles de bordures gauches pour repérer les modules
  cardAudio: { borderLeftWidth: 4, borderLeftColor: '#ff9800' },
  cardImage: { borderLeftWidth: 4, borderLeftColor: theme.colors.primary },
  iconContainer: {
    width: 46,
    height: 46,
    borderRadius: 10,
    backgroundColor: 'rgba(0, 230, 118, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16
  },
  iconAudio: { backgroundColor: 'rgba(255, 152, 0, 0.1)' },
  iconImage: { backgroundColor: 'rgba(130, 87, 229, 0.1)' },
  cardIcon: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
    textTransform: 'uppercase'
  },
  cardTextContainer: {
    flex: 1
  },
  cardTitle: { 
    color: theme.colors.text, 
    fontSize: 17, 
    fontWeight: 'bold' 
  },
  cardDescription: { 
    color: theme.colors.textMuted, 
    fontSize: 12,
    marginTop: 4,
    lineHeight: 16
  },
  companionBox: { 
    marginTop: 35, 
    padding: 16, 
    backgroundColor: '#16161a', 
    borderRadius: 14, 
    borderWidth: 1,
    borderColor: '#2d2d30',
    width: '100%' 
  },
  companionTag: {
    color: theme.colors.accent,
    fontSize: 10,
    fontWeight: 'bold',
    marginBottom: 6,
    letterSpacing: 1
  },
  companionText: { 
    color: theme.colors.text, 
    fontStyle: 'italic', 
    fontSize: 13, 
    lineHeight: 18 
  }
});

