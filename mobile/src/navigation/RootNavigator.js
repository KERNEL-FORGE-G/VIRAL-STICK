/**
 * RootNavigator — Application root with screen rendering
 * Viral Stick | KERNEL FORGE — 2026
 */

import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import DrawerNavigator from "./DrawerNavigator";

// Screens
import HomeScreen from "../screens/HomeScreen";
import ContextReaderScreen from "../screens/ContextReaderScreen";
import VoiceToMemeScreen from "../screens/VoiceToMemeScreen";
import StatusRemixerScreen from "../screens/StatusRemixerScreen";
import CompanionChatScreen from "../screens/CompanionChatScreen";
import MultiChatScreen from "../screens/MultiChatScreen";
import SettingsScreen from "../screens/SettingsScreen";
import AboutScreen from "../screens/AboutScreen";

const SCREENS = {
  Home: HomeScreen,
  ContextReader: ContextReaderScreen,
  VoiceToMeme: VoiceToMemeScreen,
  StatusRemixer: StatusRemixerScreen,
  CompanionChat: CompanionChatScreen,
  MultiChat: MultiChatScreen,
  Settings: SettingsScreen,
  About: AboutScreen,
};

const RootNavigator = () => {
  const [currentScreen, setCurrentScreen] = useState("Home");

  const Screen = SCREENS[currentScreen] || HomeScreen;

  return (
    <DrawerNavigator
      currentScreen={currentScreen}
      onNavigate={setCurrentScreen}
    >
      <View style={StyleSheet.absoluteFill}>
        <Screen navigate={setCurrentScreen} />
      </View>
    </DrawerNavigator>
  );
};

export default RootNavigator;
