import React, { useRef, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Animated, Dimensions, SafeAreaView, Image, StatusBar } from "react-native";
import { spacing, radius } from "../theme";
import CompanionAvatar from "../components/CompanionAvatar";
import { colors } from "../theme/tokens";

const { width: SW } = Dimensions.get("window");
const DW = SW * 0.78;

const NAV_ITEMS = [
  { key: "Home",           label: "Accueil",         icon: "🏠",  accent: colors.duoGreen },
  { key: "ContextReader",  label: "Context Reader",  icon: "📖",  accent: colors.art },
  { key: "VoiceToMeme",   label: "Voice → Mème",    icon: "🎙️",  accent: colors.duoGreen },
  { key: "StatusRemixer",  label: "Status Remixer",  icon: "🎨",  accent: colors.bio },
  { key: "StickerStudio",  label: "Sticker Studio",  icon: "🧩",  accent: colors.art },
  { key: "CompanionChat",  label: "Compagnons",      icon: "💬",  accent: colors.data },
  { key: "MultiChat",      label: "Multi-Chat",      icon: "👥",  accent: colors.para },
  { key: "Settings",       label: "Paramètres",      icon: "⚙️",  accent: colors.silver },
  { key: "About",          label: "À propos",        icon: "ℹ️",  accent: colors.skyBlue },
];

const DrawerNavigator = ({ children, currentScreen, onNavigate }) => {
  const [isOpen, setIsOpen] = useState(false);
  const translateX = useRef(new Animated.Value(0)).current;
  const scale      = useRef(new Animated.Value(1)).current;
  const borderR    = useRef(new Animated.Value(0)).current; // séparé — useNativeDriver: false

  const openDrawer = () => {
    setIsOpen(true);
    // Animations natives (transform)
    Animated.parallel([
      Animated.timing(translateX, { toValue: DW,  duration: 300, useNativeDriver: true }),
      Animated.timing(scale,      { toValue: 0.92, duration: 300, useNativeDriver: true }),
    ]).start();
    // borderRadius séparé (ne supporte pas nativeDriver)
    Animated.timing(borderR, { toValue: 20, duration: 300, useNativeDriver: false }).start();
  };

  const closeDrawer = () => {
    Animated.parallel([
      Animated.timing(translateX, { toValue: 0, duration: 280, useNativeDriver: true }),
      Animated.timing(scale,      { toValue: 1, duration: 280, useNativeDriver: true }),
    ]).start(() => setIsOpen(false));
    Animated.timing(borderR, { toValue: 0, duration: 280, useNativeDriver: false }).start();
  };

  const handleNav = (key) => {
    closeDrawer();
    setTimeout(() => onNavigate(key), 280);
  };

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      {/* Drawer fond blanc */}
      <View style={[styles.drawer, { width: DW }]}>
        <SafeAreaView style={styles.drawerInner}>
          {/* Brand */}
          <View style={styles.brand}>
            <Image source={require("../../assets/logo/logo_sans_fond.png")} style={styles.brandLogo} resizeMode="contain" />
            <Text style={styles.brandTitle}>Viral Stick</Text>
            <Text style={styles.brandSub}>Studio IA de mèmes</Text>
          </View>

          {/* Nav items */}
          <View style={styles.navList}>
            {NAV_ITEMS.map((item) => {
              const active = currentScreen === item.key;
              return (
                <TouchableOpacity
                  key={item.key}
                  onPress={() => handleNav(item.key)}
                  activeOpacity={0.7}
                  style={[styles.navItem, {
                    backgroundColor: active ? `${item.accent}18` : "transparent",
                    borderColor:     active ? `${item.accent}44` : colors.cloudGray,
                  }]}
                >
                  <Text style={styles.navIcon}>{item.icon}</Text>
                  <Text style={[styles.navLabel, { color: active ? item.accent : colors.charcoal, fontWeight: active ? "800" : "700" }]}>
                    {item.label}
                  </Text>
                  {active && <View style={[styles.activeDot, { backgroundColor: item.accent }]} />}
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Footer compagnon */}
          <View style={styles.drawerFooter}>
            <CompanionAvatar companion="arch" size={80} floating message="Le studio veille sur ton contenu." />
          </View>
        </SafeAreaView>
      </View>

      {/* Panneau principal */}
      <Animated.View style={[styles.screenPanel, { transform: [{ translateX }, { scale }], borderRadius: borderR, overflow: "hidden" }]}>
        {/* Bouton menu */}
        <TouchableOpacity
          onPress={isOpen ? closeDrawer : openDrawer}
          style={styles.menuBtn}
          hitSlop={{ top: 14, bottom: 14, left: 14, right: 14 }}
        >
          <View style={[styles.bar, { width: isOpen ? 22 : 26 }]} />
          <View style={[styles.bar, { width: 18 }]} />
          <View style={[styles.bar, { width: isOpen ? 22 : 24 }]} />
        </TouchableOpacity>

        {isOpen && (
          <TouchableOpacity style={StyleSheet.absoluteFill} onPress={closeDrawer} activeOpacity={1} />
        )}

        {children}
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  root:        { flex: 1, backgroundColor: colors.bgSecondary },
  drawer:      { position: "absolute", top: 0, left: 0, bottom: 0, backgroundColor: "#ffffff", paddingTop: 16, borderRightWidth: 2, borderRightColor: colors.cloudGray },
  drawerInner: { flex: 1, paddingHorizontal: spacing.md, paddingBottom: spacing.lg },
  brand:       { alignItems: "center", paddingVertical: spacing.lg, marginBottom: spacing.md, borderBottomWidth: 2, borderBottomColor: colors.cloudGray },
  brandLogo:   { width: 60, height: 60, marginBottom: 8 },
  brandTitle:  { fontSize: 22, fontWeight: "900", color: colors.duoBlue, letterSpacing: 0.5 },
  brandSub:    { fontSize: 11, fontWeight: "700", color: colors.silver, marginTop: 2 },
  navList:     { flex: 1, gap: 6 },
  navItem:     { flexDirection: "row", alignItems: "center", paddingVertical: 12, paddingHorizontal: spacing.md, borderRadius: radius.md, borderWidth: 2, gap: 10 },
  navIcon:     { fontSize: 18, width: 26, textAlign: "center" },
  navLabel:    { flex: 1, fontSize: 15 },
  activeDot:   { width: 8, height: 8, borderRadius: 4 },
  drawerFooter:{ alignItems: "center", paddingTop: spacing.md },
  screenPanel: { flex: 1, ...StyleSheet.absoluteFillObject, backgroundColor: "#ffffff" },
  menuBtn:     { position: "absolute", top: 52, left: spacing.md, zIndex: 100, width: 44, height: 44, borderRadius: radius.md, backgroundColor: "#ffffff", borderWidth: 2, borderColor: colors.cloudGray, justifyContent: "center", paddingHorizontal: 10, gap: 5, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 6, elevation: 3 },
  bar:         { height: 2.5, backgroundColor: colors.charcoal, borderRadius: 2 },
});

export { NAV_ITEMS };
export default DrawerNavigator;
