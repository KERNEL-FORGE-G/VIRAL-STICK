import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, StatusBar, ActivityIndicator } from "react-native";
import BottomTabNavigator from "./BottomTabNavigator";
import Header from "../components/Header";
import { useTheme } from "../theme";
import authService from "../services/authService";

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
  Auth:          { comp: AuthScreen,          title: "Compte",        sub: "Connexion" },
  Profile:       { comp: ProfileScreen,       title: "Profil",        sub: "Tes stats" },
};

const RootNavigator = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentScreen, setCurrentScreen] = useState("Home");
  const { theme } = useTheme();

  useEffect(() => {
    loadSession();
  }, []);

  const loadSession = async () => {
    try {
      const loggedIn = await authService.isLoggedIn();
      setIsLoggedIn(loggedIn);
    } catch (error) {
      setIsLoggedIn(false);
    } finally {
      setIsLoading(false);
    }
  };

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

  const handleProfileClick = () => {
    if (isLoggedIn) {
      setCurrentScreen("Profile");
    } else {
      setCurrentScreen("Auth");
    }
  };

  if (isLoading) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background, justifyContent: 'center' }]}>
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    );
  }

  // Si pas connecté, forcer Auth
  if (!isLoggedIn && currentScreen !== "Auth" && currentScreen !== "About") {
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <Header title="Bienvenue" subtitle="Viral Stick Studio" onProfile={() => setCurrentScreen("Auth")} />
        <AuthScreen navigate={(s) => {
          if (s === 'Home') setIsLoggedIn(true);
          setCurrentScreen(s);
        }} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar barStyle={theme.isDark ? "light-content" : "dark-content"} />
      <Header
        title={screenInfo.title}
        subtitle={screenInfo.sub}
        onBack={showBack ? goBack : null}
        onProfile={handleProfileClick}
      />
      <BottomTabNavigator currentScreen={currentScreen} onNavigate={setCurrentScreen}>
        <ScreenComp navigate={setCurrentScreen} route={{ params: {} }} />
      </BottomTabNavigator>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
});

export default RootNavigator;
