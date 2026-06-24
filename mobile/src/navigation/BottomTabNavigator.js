import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Dimensions, Platform } from "react-native";
import { colors, spacing, borderRadius } from "../theme/tokens";

const { width: SW } = Dimensions.get("window");

const TAB_ITEMS = [
  { key: "Home",           label: "Accueil",   icon: "🏠", accent: colors.duoGreen },
  { key: "ContextReader",  label: "Context",   icon: "📖", accent: colors.art },
  { key: "VoiceToMeme",    label: "Voice",     icon: "🎙️", accent: colors.duoGreen },
  { key: "StatusRemixer",  label: "Remix",     icon: "🎨", accent: colors.bio },
  { key: "Menu",           label: "Menu",      icon: "☰",  accent: colors.silver },
];

const BottomTabNavigator = ({ children, currentScreen, onNavigate }) => {
  return (
    <View style={styles.root}>
      {/* Contenu de l'écran */}
      <View style={styles.content}>
        {children}
      </View>

      {/* Barre de navigation basse */}
      <SafeAreaView style={styles.tabBarContainer}>
        <View style={styles.tabBar}>
          {TAB_ITEMS.map((item) => {
            const active = currentScreen === item.key;
            return (
              <TouchableOpacity
                key={item.key}
                onPress={() => onNavigate(item.key)}
                activeOpacity={0.7}
                style={styles.tabItem}
              >
                <View style={[
                  styles.iconBox,
                  active && { backgroundColor: `${item.accent}18`, borderColor: item.accent, borderWidth: 2 }
                ]}>
                  <Text style={[styles.tabIcon, active && { transform: [{ scale: 1.1 }] }]}>
                    {item.icon}
                  </Text>
                </View>
                <Text style={[
                  styles.tabLabel,
                  { color: active ? item.accent : colors.silver, fontWeight: active ? "900" : "700" }
                ]}>
                  {item.label}
                </Text>
                {active && <View style={[styles.activeIndicator, { backgroundColor: item.accent }]} />}
              </TouchableOpacity>
            );
          })}
        </View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  content: {
    flex: 1,
  },
  tabBarContainer: {
    backgroundColor: "#ffffff",
    borderTopWidth: 2,
    borderTopColor: colors.cloudGray,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  tabBar: {
    flexDirection: "row",
    height: 65,
    alignItems: "center",
    justifyContent: "space-around",
    paddingHorizontal: 8,
  },
  tabItem: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    height: "100%",
    paddingTop: 8,
  },
  iconBox: {
    width: 40,
    height: 32,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
    borderWidth: 2,
    borderColor: "transparent",
  },
  tabIcon: {
    fontSize: 20,
  },
  tabLabel: {
    fontSize: 10,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  activeIndicator: {
    width: 4,
    height: 4,
    borderRadius: 2,
    marginTop: 4,
  },
});

export default BottomTabNavigator;
