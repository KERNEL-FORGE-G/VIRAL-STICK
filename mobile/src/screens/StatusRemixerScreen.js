import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { useRoute } from '@react-navigation/native'; 
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { theme } from '../theme/theme';
import { apiService } from '../services/api'; 

export default function StatusRemixerScreen() {
  const route = useRoute();
  
  // États de l'image et de l'IA
  const [selectedImage, setSelectedImage] = useState(null);
  const [aiPunchlines, setAiPunchlines] = useState([]);
  const [selectedPunchline, setSelectedPunchline] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // États du AdjustmentPanel (Style du calque de texte)
  const [textSize, setTextSize] = useState(16);
  const [textColor, setTextColor] = useState('#ffffff');

  // INTERCEPTION DU SHARE INTENT (JOUR 3)
  useEffect(() => {
    if (route.params?.sharedImageUri) {
      const uriReçue = route.params.sharedImageUri;
      setSelectedImage(uriReçue);
      triggerAIGeneration(uriReçue); 
    }
  }, [route.params?.sharedImageUri]);

  // Gestion de la sélection d'image classique via Galerie/Caméra
  const handleImagePick = (response) => {
    if (response.didCancel || response.errorMessage) return;
    if (response.assets && response.assets.length > 0) {
      const uri = response.assets[0].uri; // Correction de l'index d'asset
      setSelectedImage(uri);
      triggerAIGeneration(uri); 
    }
  };

  // Déclenchement de l'analyse IA (Mixy)
  const triggerAIGeneration = async (uri) => {
    setIsLoading(true);
    setSelectedPunchline("");
    
    // Appel au service réseau configuré au J3
    const punchlines = await apiService.analyzeImageForMeme(uri);
    
    if (punchlines && punchlines.length > 0) {
      setAiPunchlines(punchlines);
      Alert.alert("Succès ✨", "Mixy a forgé des punchlines personnalisées avec le serveur !");
    } else {
      // Mode dégradé / Secours local si le backend est absent/injoignable
      setAiPunchlines([
        "Quand le code compile du premier coup à l'UY1 🤯",
        "Tu veux l'argent de quoi ? C'est le mbeng ? 🇨🇲",
        "POV: Quand le prof d'ICT202 prolonge le TP d'une semaine"
      ]);
      Alert.alert(
        "Mode Hors-Ligne 🔌", 
        "Le serveur de la Forge est injoignable. Mixy passe en mode de secours avec des expressions locales !"
      );
    }
    setIsLoading(false);
  };

  const handleReset = () => {
    setSelectedImage(null);
    setSelectedPunchline("");
    setAiPunchlines([]);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <Text style={styles.title}>🖼️ STATUS REMIXER</Text>
      <Text style={styles.subtitle}>Génération de calques et mèmes automatiques par IA</Text>

      {/* Éditeur visuel & Aperçu du mème */}
      <View style={styles.imagePreviewContainer}>
        {selectedImage ? (
          <View style={styles.memeContainer}>
            <Image source={{ uri: selectedImage }} style={styles.previewImage} />
            {selectedPunchline !== "" && (
              <View style={styles.textOverlayContainer}>
                <Text style={[styles.memeText, { fontSize: textSize, color: textColor }]}>
                  {selectedPunchline.toUpperCase()}
                </Text>
              </View>
            )}
          </View>
        ) : (
          <Text style={styles.placeholderText}>Sélectionnez un visuel</Text>
        )}
      </View>

      {/* Boutons d'action matériels */}
      <View style={styles.buttonGroup}>
        <TouchableOpacity 
          style={styles.actionButton} 
          onPress={() => launchImageLibrary({ mediaType: 'photo', quality: 1 }, handleImagePick)}
        >
          <Text style={styles.buttonText}>📂 Galerie</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.actionButton, styles.cameraButton]} 
          onPress={() => launchCamera({ mediaType: 'photo', quality: 1, saveToPhotos: true }, handleImagePick)}
        >
          <Text style={styles.buttonText}>📸 Caméra</Text>
        </TouchableOpacity>
      </View>

      {/* Indicateur de chargement IA */}
      {isLoading && <ActivityIndicator size="large" color={theme.colors.accent} style={{ marginTop: 20 }} />}

      {/* AdjustmentPanel (Contrôle du texte en temps réel - TextOverlayEditor) */}
      {selectedImage && selectedPunchline !== "" && (
        <View style={styles.adjustmentPanel}>
          <Text style={styles.panelTitle}>⚙️ Ajustement du Calque (TextOverlayEditor)</Text>
          <View style={styles.controlRow}>
            <TouchableOpacity style={styles.panelBtn} onPress={() => setTextSize(prev => Math.max(12, prev - 2))}>
              <Text style={styles.btnText}>A-</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.panelBtn} onPress={() => setTextSize(prev => Math.min(32, prev + 2))}>
              <Text style={styles.btnText}>A+</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.panelBtn, { backgroundColor: '#e74c3c' }]} onPress={() => setTextColor('#e74c3c')}>
              <View style={styles.colorIndicator} />
            </TouchableOpacity>
            <TouchableOpacity style={[styles.panelBtn, { backgroundColor: '#f1c40f' }]} onPress={() => setTextColor('#f1c40f')}>
              <View style={styles.colorIndicator} />
            </TouchableOpacity>
            <TouchableOpacity style={[styles.panelBtn, { backgroundColor: '#ffffff' }]} onPress={() => setTextColor('#ffffff')}>
              <View style={styles.colorIndicator} />
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Choix des punchlines IA (Visible uniquement après traitement) */}
      {selectedImage && !isLoading && aiPunchlines.length > 0 && (
        <View style={styles.punchlineSection}>
          <Text style={styles.sectionTitle}>✨ Propositions de l'IA (Mixy) :</Text>
          {aiPunchlines.map((p, i) => (
            <TouchableOpacity 
              key={i} 
              style={[styles.punchlineCard, selectedPunchline === p && styles.punchlineCardSelected]}
              onPress={() => setSelectedPunchline(p)}
            >
              <Text style={styles.punchlineText}>{p}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Bouton de nettoyage */}
      {selectedImage && (
        <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
          <Text style={styles.resetButtonText}>Retirer l'image</Text>
        </TouchableOpacity>
      )}

      {/* Compagnon Mixy */}
      <View style={styles.companionBox}>
        <Text style={styles.companionText}>
          💬 Mixy : "Clique sur une de mes punchlines pour l'incruster sur l'image, puis ajuste sa taille et sa couleur avec mon panneau !"
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  contentContainer: { padding: 20, alignItems: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', color: theme.colors.accent, marginVertical: 5 },
  subtitle: { fontSize: 13, color: theme.colors.textMuted, textAlign: 'center', marginBottom: 20 },
  imagePreviewContainer: { width: '100%', height: 280, backgroundColor: theme.colors.surface, borderRadius: 12, borderWidth: 2, borderColor: theme.colors.primary, overflow: 'hidden', justifyContent: 'center', alignItems: 'center', marginBottom: 15 },
  memeContainer: { width: '100%', height: '100%', justifyContent: 'flex-end' },
  previewImage: { width: '100%', height: '100%', position: 'absolute', resizeMode: 'cover' },
  textOverlayContainer: { width: '100%', backgroundColor: 'rgba(0, 0, 0, 0.6)', paddingVertical: 12, paddingHorizontal: 10 },
  memeText: { fontWeight: '900', textAlign: 'center', textShadowColor: '#000', textShadowOffset: { width: 1, height: 1 }, textShadowRadius: 2 },
  placeholderText: { color: theme.colors.textMuted, fontStyle: 'italic' },
  buttonGroup: { flexDirection: 'row', gap: 10, width: '100%', marginBottom: 10 },
  actionButton: { flex: 1, backgroundColor: theme.colors.primary, paddingVertical: 12, borderRadius: 10, alignItems: 'center' },
  cameraButton: { backgroundColor: '#34495e' },
  buttonText: { color: theme.colors.text, fontWeight: 'bold' },

  adjustmentPanel: { 
    width: '100%', 
    backgroundColor: '#1c1c1e', // Surface légèrement surélevée
    padding: 16, 
    borderRadius: 14, 
    marginTop: 15, 
    borderWidth: 1, 
    borderColor: 'rgba(130, 87, 229, 0.25)', // Lueur subtile violet KERNEL FORGE
    
    // Ombre portée optimisée pour Android natif (Jour 4 Polish)
    elevation: 6, 
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 5,
  },

  //adjustmentPanel: { width: '100%', backgroundColor: theme.colors.surface, padding: 12, borderRadius: 10, marginTop: 10, borderWidth: 1, borderColor: '#2d2d30' },
  panelTitle: { color: theme.colors.textMuted, fontSize: 11, fontWeight: 'bold', marginBottom: 8 },
  controlRow: { flexDirection: 'row', gap: 10, alignItems: 'center' },

  panelBtn: { 
    backgroundColor: '#2c2c2e', 
    paddingHorizontal: 14, 
    paddingVertical: 10, 
    borderRadius: 8, 
    justifyContent: 'center', 
    minWidth: 46, 
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#3a3a3c'
  },

  //panelBtn: { backgroundColor: '#2d2d30', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 6, justifyContent: 'center', minWidth: 44, alignItems: 'center' },
  btnText: { color: '#fff', fontWeight: 'bold', fontSize: 12 },
  colorIndicator: { width: 12, height: 12, borderRadius: 6 },
  punchlineSection: { width: '100%', marginTop: 15 },
  sectionTitle: { color: theme.colors.accent, fontWeight: 'bold', marginBottom: 8, fontSize: 14 },
  punchlineCard: { backgroundColor: theme.colors.surface, padding: 12, borderRadius: 8, marginBottom: 8, borderWidth: 1, borderColor: '#2d2d30' },
  punchlineCardSelected: { borderColor: theme.colors.accent, backgroundColor: '#1f2d24' },
  punchlineText: { color: theme.colors.text, fontSize: 13 },
  resetButton: { marginTop: 15, padding: 10 },
  resetButtonText: { color: '#ff5252', fontWeight: 'bold' },
  companionBox: { marginTop: 25, padding: 15, backgroundColor: '#1c1c1e', borderRadius: 12, borderLeftWidth: 4, borderLeftColor: theme.colors.accent, width: '100%' },
  companionText: { color: theme.colors.text, fontStyle: 'italic', fontSize: 13, lineHeight: 18 }
});


