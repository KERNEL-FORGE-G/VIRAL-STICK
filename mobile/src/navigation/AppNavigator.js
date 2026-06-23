import React from 'react';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import { View, StyleSheet, Text, StatusBar } from 'react-native';

import HomeScreen from '../screens/HomeScreen';
import StatusRemixerScreen from '../screens/StatusRemixerScreen';
import ContextReaderScreen from '../screens/ContextReaderScreen';
import VoiceToMemeScreen from '../screens/VoiceToMemeScreen';
import { theme } from '../theme/theme';

const Drawer = createDrawerNavigator();

// Composant personnalisé pour le design interne du tiroir de navigation
function CustomDrawerContent(props) {
  return (
    <View style={styles.drawerContainer}>
      <StatusBar barStyle="light-content" backgroundColor={theme.colors.background} />
      
      {/* En-tête du menu : Style KERNEL FORGE */}
      <View style={styles.drawerHeader}>
        <Text style={styles.headerTitle}>VIRAL STICK 🚀</Text>
        <Text style={styles.headerSubtitle}>Studio Multimodal IA</Text>
        <View style={styles.divider} />
      </View>

      {/* Liste des onglets avec défilement fluide géré nativement */}
      <DrawerContentScrollView {...props} contentContainerStyle={styles.scrollContainer}>
        <DrawerItemList {...props} />
      </DrawerContentScrollView>

      {/* Pied de page du menu */}
      <View style={styles.drawerFooter}>
        <Text style={styles.footerText}>Forge par KERNEL FORGE</Text>
        <Text style={styles.versionText}>v2.0 — UY1 Académique</Text>
      </View>
    </View>
  );
}

export default function AppNavigator({ navigationRef }) {
  return (
    <NavigationContainer ref={navigationRef}>
      <Drawer.Navigator
        drawerContent={(props) => <CustomDrawerContent {...props} />}
        screenOptions={{
          // Configuration du style général du bandeau supérieur (Header)
          headerStyle: { 
            backgroundColor: theme.colors.background,
            elevation: 0,
            shadowOpacity: 0,
          },
          headerTintColor: theme.colors.text,
          headerTitleStyle: { fontWeight: 'bold', fontSize: 16 },

          // Style du tiroir latéral (Drawer)
          drawerStyle: { 
            backgroundColor: '#16161a', 
            width: 280,
          },
          drawerType: 'slide', // Glissement fluide synchrone avec l'écran

          // Configuration visuelle des onglets du menu
          drawerActiveBackgroundColor: 'rgba(0, 230, 118, 0.15)', // Lueur verte de l'onglet actif
          drawerActiveTintColor: theme.colors.accent, // Couleur du texte de l'onglet actif
          drawerInactiveTintColor: theme.colors.textMuted,
          drawerLabelStyle: { 
            fontSize: 15, 
            fontWeight: '600',
            marginLeft: -10
          },
          drawerItemStyle: {
            borderRadius: 10,
            marginVertical: 4,
            paddingHorizontal: 8,
          },

          // 📐 COURBURE EN ARC DE L'ÉCRAN PRINCIPAL :
          // Applique des bords arrondis et un fond contrasté à l'écran actif lorsqu'il est poussé par le menu
          sceneContainerStyle: {
            backgroundColor: '#16161a',
          },
          overlayColor: 'rgba(0, 0, 0, 0.5)', // Ombre sur l'écran en arrière-plan
        }}
      >
        <Drawer.Screen name="Home" component={HomeScreen} options={{ title: '🏠  Accueil' }} />
        <Drawer.Screen name="ContextReader" component={ContextReaderScreen} options={{ title: '📝  Context Reader' }} />
        <Drawer.Screen name="VoiceToMeme" component={VoiceToMemeScreen} options={{ title: '🎙️  Voice-To-Meme' }} />
        <Drawer.Screen name="StatusRemixer" component={StatusRemixerScreen} options={{ title: '🖼️  Status Remixer' }} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  drawerContainer: { flex: 1, backgroundColor: '#16161a' },
  drawerHeader: {
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 15,
    
  },
  headerTitle: { fontSize: 22, fontWeight: '900', color: theme.colors.accent, letterSpacing: 1 },
  headerSubtitle: { fontSize: 12, color: theme.colors.textMuted, marginTop: 4 },
  divider: { height: 1, backgroundColor: '#2d2d30', marginTop: 15, width: '100%' },
  scrollContainer: { paddingTop: 10 },
  drawerFooter: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#2d2d30',
    backgroundColor: '#121214',
  },
  footerText: { color: theme.colors.text, fontSize: 12, fontWeight: '700' },
  versionText: { color: theme.colors.textMuted, fontSize: 10, marginTop: 2, fontStyle: 'italic' },
});


