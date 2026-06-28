import React, { useRef } from "react";
import { View, TouchableOpacity, StyleSheet, SafeAreaView, Platform, Animated } from "react-native";
import { useTheme, colors } from "../theme";
import AppIcon from "../components/AppIcon";

const TAB_ITEMS = [
  { key: "Home",           icon: "home",           accentKey: "primary" },
  { key: "Forum",          icon: "globe",          accentKey: "secondary" },
  { key: "ContextReader",  icon: "book",           accentKey: "warning" },
  { key: "StatusRemixer",  icon: "image",          accentKey: "danger" },
  { key: "Menu",           icon: "settings",       accentKey: "textPrimary" },
];

const TabButton = ({ item, active, accentColor, onPress }) => {
  const scale = useRef(new Animated.Value(1)).current;

  const onPressIn = () => Animated.spring(scale, { toValue: 0.85, useNativeDriver: true }).start();
  const onPressOut = () => Animated.spring(scale, { toValue: 1, friction: 3, tension: 40, useNativeDriver: true }).start();

  return (
    <TouchableOpacity
      onPress={onPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      activeOpacity={0.7}
      style={styles.tabItem}
    >
      <Animated.View style={{ transform: [{ scale }], alignItems: "center" }}>
        <AppIcon
          name={item.icon}
          color={active ? accentColor : colors.silver}
          size={24}
        />
        {active && <View style={[styles.activeIndicator, { backgroundColor: accentColor }]} />}
      </Animated.View>
    </TouchableOpacity>
  );
};

const BottomTabNavigator = ({ children, currentScreen, onNavigate }) => {
  const { theme } = useTheme();

  return (
    <View style={[styles.root, { backgroundColor: colors.snowWhite }]}>
      {/* Contenu de l'écran */}
      <View style={styles.content}>
        {children}
      </View>

      {/* Barre de navigation basse (Pill flottant) */}
      <SafeAreaView style={styles.safeArea}>
        <View style={[
          styles.tabBar,
          {
            backgroundColor: colors.snowWhite,
            borderColor: colors.cloudGray,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.1,
            shadowRadius: 12,
            elevation: 8,
          }
        ]}>
          {TAB_ITEMS.map((item) => {
            const active = currentScreen === item.key;
            const accentColor = active 
              ? (item.key === 'Home' || item.key === 'Menu' ? colors.duoGreen : 
                 item.key === 'Forum' ? colors.skyBlue : 
                 item.key === 'ContextReader' ? colors.sunshineYellow : colors.duoGreen) 
              : colors.silver;
            return (
              <TabButton
                key={item.key}
                item={item}
                active={active}
                accentColor={accentColor}
                onPress={() => onNavigate(item.key)}
              />
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
  },
  content: {
    flex: 1,
    paddingBottom: 100, // Add padding for the bottom tab bar!
  },
  safeArea: {
    position: "absolute",
    bottom: Platform.OS === 'ios' ? 24 : 16,
    left: 0,
    right: 0,
    alignItems: "center",
  },
  tabBar: {
    flexDirection: "row",
    height: 64,
    width: "90%",
    maxWidth: 420,
    borderRadius: 32,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "space-around",
    paddingHorizontal: 8,
  },
  tabItem: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    height: "100%",
  },
  activeIndicator: {
    marginTop: 4,
    width: 6,
    height: 6,
    borderRadius: 3,
  },
});

export default BottomTabNavigator;
