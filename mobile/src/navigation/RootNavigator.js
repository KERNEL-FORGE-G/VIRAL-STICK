import React, { useState } from "react";
import { View, StyleSheet, StatusBar } from "react-native";
import BottomTabNavigator from "./BottomTabNavigator";
import Header from "../components/Header";
import { useTheme } from "../theme";

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
import ForumScreen from "../screens/ForumScreen";
import AuthScreen from "../screens/AuthScreen";
import LeaderboardScreen from "../screens/LeaderboardScreen";
import ProfileScreen from "../screens/ProfileScreen";

const SCREENS = {
  Home:          { comp: HomeScreen,          title: "Accueil",       sub: "Viral Stick Studio" },
  ContextReader: { comp: ContextReaderScreen, title: "Context Reader", sub: "Texte → Mème" },
  VoiceToMeme:   { comp: VoiceToMemeScreen,   title: "Voice → Mème",  sub: "Voix → Mème" },
  StatusRemixer: { comp: StatusRemixerScreen, title: "Status Remixer", sub: "Image → Mème" },
  CompanionChat: { comp: CompanionChatScreen, title: "Compagnons",    sub: "Discute avec l'IA" },
  MultiChat:     { comp: MultiChatScreen,     title: "Multi-Chat",    sub: "Débat IA" },
  Settings:      { comp: SettingsScreen,      title: "Paramètres",    sub: "Configuration" },
  About:         { comp: AboutScreen,         title: "À propos",      sub: "Manifeste" },
  Menu:          { comp: MenuScreen,          title: "Menu",          sub: "Options du Studio" },
  Forum:         { comp: ForumScreen,         title: "Forum",         sub: "Flux Viral" },
  Leaderboard:   { comp: LeaderboardScreen,   title: "Classement",    sub: "Top Créateurs" },
  Auth:          { comp: AuthScreen,          title: "Compte",        sub: "Connexion / Inscription" },
  Profile:       { comp: ProfileScreen,       title: "Profil",        sub: "Mon Compte" },
};

const RootNavigator = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentScreen, setCurrentScreen] = useState("Home");
  const { theme } = useTheme();

  const screenInfo = SCREENS[currentScreen] || SCREENS.Home;
  const ScreenComp = screenInfo.comp;

  const mainTabs = ["Home", "Forum", "ContextReader", "StatusRemixer", "Menu"];
  const showBack = !mainTabs.includes(currentScreen);

  const goBack = () => {
    const menuItems = ["CompanionChat", "MultiChat", "Settings", "About", "Leaderboard", "Profile"];
    if (menuItems.includes(currentScreen)) {
      setCurrentScreen("Menu");
    } else {
      setCurrentScreen("Home");
    }
  };

  if (!isLoggedIn && currentScreen !== "Auth") {
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <StatusBar barStyle={theme.isDark ? "light-content" : "dark-content"} backgroundColor={theme.backgroundSecondary} />
        <Header title="Bienvenue" subtitle="Viral Stick Studio" />
        <View style={styles.screenWrapper}>
          <AuthScreen navigate={(s) => {
            if (s === 'Home') setIsLoggedIn(true);
            setCurrentScreen(s);
          }} />
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar barStyle={theme.isDark ? "light-content" : "dark-content"} backgroundColor={theme.backgroundSecondary} />
      <Header
        title={screenInfo.title}
        subtitle={screenInfo.sub}
        onBack={showBack ? goBack : null}
        onProfile={() => setCurrentScreen("Auth")}
      />
      <BottomTabNavigator currentScreen={currentScreen} onNavigate={setCurrentScreen}>
        <ScreenComp navigate={setCurrentScreen} />
      </BottomTabNavigator>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  screenWrapper: {
    flex: 1,
  },
});

export default RootNavigator;
