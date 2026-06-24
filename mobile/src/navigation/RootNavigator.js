/**
 * RootNavigator — Application root with screen rendering
 * Viral Stick | KERNEL FORGE — 2026
 */

import React, { useState } from "react";
import { View, StyleSheet, StatusBar } from "react-native";
import BottomTabNavigator from "./BottomTabNavigator";
import Header from "../components/Header";
import { colors } from "../theme/tokens";

// Screens
import HomeScreen from "../screens/HomeScreen";
import ContextReaderScreen from "../screens/ContextReaderScreen";
import VoiceToMemeScreen from "../screens/VoiceToMemeScreen";
import StatusRemixerScreen from "../screens/StatusRemixerScreen";
import CompanionChatScreen from "../screens/CompanionChatScreen";
import MultiChatScreen from "../screens/MultiChatScreen";
import SettingsScreen from "../screens/SettingsScreen";
import AboutScreen from "../screens/AboutScreen";
import MenuScreen from "../screens/MenuScreen";

const SCREENS = {
  Home: { comp: HomeScreen, title: "Accueil", sub: "Viral Stick Studio" },
  ContextReader: { comp: ContextReaderScreen, title: "Context Reader", sub: "Texte → Mème" },
  VoiceToMeme: { comp: VoiceToMemeScreen, title: "Voice → Mème", sub: "Voix → Mème" },
  StatusRemixer: { comp: StatusRemixerScreen, title: "Status Remixer", sub: "Image → Mème" },
  CompanionChat: { comp: CompanionChatScreen, title: "Compagnons", sub: "Discute avec l'IA" },
  MultiChat: { comp: MultiChatScreen, title: "Multi-Chat", sub: "Débat IA" },
  Settings: { comp: SettingsScreen, title: "Paramètres", sub: "Configuration" },
  About: { comp: AboutScreen, title: "À propos", sub: "Manifeste" },
  Menu: { comp: MenuScreen, title: "Menu", sub: "Options du Studio" },
};

const RootNavigator = () => {
  const [currentScreen, setCurrentScreen] = useState("Home");

  const screenInfo = SCREENS[currentScreen] || SCREENS.Home;
  const ScreenComp = screenInfo.comp;

  // Si on est sur un écran qui n'est pas dans les onglets principaux, on pourrait vouloir un bouton retour
  const mainTabs = ["Home", "ContextReader", "VoiceToMeme", "StatusRemixer", "Menu"];
  const showBack = !mainTabs.includes(currentScreen);

  const goBack = () => {
    // Si on vient d'un écran secondaire accessible via le menu, on retourne au menu
    const menuItems = ["CompanionChat", "MultiChat", "Settings", "About"];
    if (menuItems.includes(currentScreen)) {
      setCurrentScreen("Menu");
    } else {
      setCurrentScreen("Home");
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <Header
        title={screenInfo.title}
        subtitle={screenInfo.sub}
        onBack={showBack ? goBack : null}
      />
      <BottomTabNavigator
        currentScreen={currentScreen}
        onNavigate={setCurrentScreen}
      >
        <View style={styles.screenWrapper}>
          <ScreenComp navigate={setCurrentScreen} />
        </View>
      </BottomTabNavigator>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  screenWrapper: {
    flex: 1,
  },
});

export default RootNavigator;
