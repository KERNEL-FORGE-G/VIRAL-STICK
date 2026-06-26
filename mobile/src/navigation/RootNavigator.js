import React, { useState } from "react";
import { View, StyleSheet, StatusBar, Text } from "react-native";
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
import ForumScreen from "../screens/ForumScreen";
import AuthScreen from "../screens/AuthScreen";
import LeaderboardScreen from "../screens/LeaderboardScreen";

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
  Forum: { comp: ForumScreen, title: "Forum", sub: "Flux Viral" },
  Leaderboard: { comp: LeaderboardScreen, title: "Classement", sub: "Top Créateurs" },
  Auth: { comp: AuthScreen, title: "Compte", sub: "Connexion / Inscription" },
};

const RootNavigator = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentScreen, setCurrentScreen] = useState("Home");

  const screenInfo = SCREENS[currentScreen] || SCREENS.Home;
  const ScreenComp = screenInfo.comp;

  const mainTabs = ["Home", "Forum", "ContextReader", "StatusRemixer", "Menu"];
  const showBack = !mainTabs.includes(currentScreen);

  const goBack = () => {
    const menuItems = ["CompanionChat", "MultiChat", "Settings", "About"];
    if (menuItems.includes(currentScreen)) {
      setCurrentScreen("Menu");
    } else {
      setCurrentScreen("Home");
    }
  };

  if (!isLoggedIn && currentScreen !== "Auth") {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
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
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <Header
        title={screenInfo.title}
        subtitle={screenInfo.sub}
        onBack={showBack ? goBack : null}
        onProfile={() => setCurrentScreen("Auth")}
      />
      <View style={styles.screenWrapper}>
        <ScreenComp navigate={setCurrentScreen} />
      </View>
      {/* Footer navigation simple */}
      <View style={styles.tabBar}>
        {["Home", "Forum", "ContextReader", "StatusRemixer", "Menu"].map((tab) => (
          <View key={tab} style={{ flex: 1, alignItems: 'center' }}>
            <Text
              onPress={() => setCurrentScreen(tab)}
              style={{
                color: currentScreen === tab ? colors.duoGreen : colors.silver,
                fontWeight: '900',
                fontSize: 12
              }}
            >
              {tab === "Home" ? "🏠" : tab === "Forum" ? "🌍" : tab === "ContextReader" ? "📝" : tab === "StatusRemixer" ? "✨" : "☰"}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#ffffff" },
  screenWrapper: { flex: 1 },
  tabBar: {
    height: 60,
    flexDirection: 'row',
    borderTopWidth: 2,
    borderColor: colors.cloudGray,
    alignItems: 'center',
    paddingBottom: 5
  }
});

export default RootNavigator;
