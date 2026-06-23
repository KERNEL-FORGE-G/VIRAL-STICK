import React, { useRef, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
  SafeAreaView,
  Image,
  StatusBar,
} from "react-native";
import { useTheme, spacing, radius, typography, createShadow } from "../theme";
import CompanionAvatar from "../components/CompanionAvatar";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const DRAWER_WIDTH = SCREEN_WIDTH * 0.8;

const NAV_ITEMS = [
  { key: "Home", label: "Accueil", icon: "🏠", companion: "bio" },
  {
    key: "ContextReader",
    label: "Context Reader",
    icon: "📖",
    companion: "art",
  },
  { key: "VoiceToMeme", label: "Voice → Mème", icon: "🎙️", companion: "ubu" },
  {
    key: "StatusRemixer",
    label: "Status Remixer",
    icon: "🎨",
    companion: "bio",
  },
  { key: "CompanionChat", label: "Compagnons", icon: "💬", companion: "data" },
  { key: "MultiChat", label: "Multi-Chat", icon: "👥", companion: "arch" },
  { key: "Settings", label: "Paramètres", icon: "⚙️", companion: "para" },
  { key: "About", label: "À propos", icon: "ℹ️", companion: "arch" },
];

const DrawerNavigator = ({ children, currentScreen, onNavigate }) => {
  const { theme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const translateX = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(1)).current;
  const borderR = useRef(new Animated.Value(0)).current;

  const openDrawer = () => {
    setIsOpen(true);
    Animated.parallel([
      Animated.timing(translateX, {
        toValue: DRAWER_WIDTH,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(scale, {
        toValue: 0.9,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(borderR, {
        toValue: 28,
        duration: 300,
        useNativeDriver: false,
      }),
    ]).start();
  };

  const closeDrawer = () => {
    Animated.parallel([
      Animated.timing(translateX, {
        toValue: 0,
        duration: 280,
        useNativeDriver: true,
      }),
      Animated.timing(scale, {
        toValue: 1,
        duration: 280,
        useNativeDriver: true,
      }),
      Animated.timing(borderR, {
        toValue: 0,
        duration: 280,
        useNativeDriver: false,
      }),
    ]).start(() => setIsOpen(false));
  };

  const handleNavItem = (key) => {
    closeDrawer();
    setTimeout(() => onNavigate(key), 280);
  };

  return (
    <View style={[styles.root, { backgroundColor: theme.backgroundSecondary }]}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />

      <View
        style={[
          styles.drawer,
          { width: DRAWER_WIDTH, backgroundColor: theme.background },
        ]}
      >
        <SafeAreaView style={styles.drawerInner}>
          <View
            style={[
              styles.brandPanel,
              {
                borderColor: theme.border,
                backgroundColor: theme.backgroundCard,
              },
            ]}
          >
            <View style={styles.logoShell}>
              <Image
                source={require("../../assets/logo/logo_sans_fond.png")}
                style={styles.drawerLogo}
                resizeMode="contain"
              />
            </View>
            <Text style={[styles.drawerTitle, { color: theme.textPrimary }]}>
              Viral Stick
            </Text>
            <Text
              style={[styles.drawerSubtitle, { color: theme.textSecondary }]}
            >
              Studio mobile de génération de mèmes
            </Text>
          </View>

          <View style={styles.navList}>
            {NAV_ITEMS.map((item) => {
              const active = currentScreen === item.key;
              return (
                <TouchableOpacity
                  key={item.key}
                  onPress={() => handleNavItem(item.key)}
                  style={[
                    styles.navItem,
                    {
                      borderColor: active ? theme.primary : theme.border,
                      backgroundColor: active
                        ? `${theme.primary}22`
                        : theme.backgroundCard,
                    },
                  ]}
                  activeOpacity={0.8}
                >
                  <Text style={styles.navIcon}>{item.icon}</Text>
                  <Text
                    style={[
                      styles.navLabel,
                      {
                        color: active ? theme.textPrimary : theme.textSecondary,
                      },
                    ]}
                  >
                    {item.label}
                  </Text>
                  <View
                    style={[
                      styles.navDot,
                      {
                        backgroundColor: active ? theme.primary : "transparent",
                      },
                    ]}
                  />
                </TouchableOpacity>
              );
            })}
          </View>

          <View style={styles.drawerFooter}>
            <CompanionAvatar
              companion="arch"
              size={120}
              floating
              message="Le noyau veille sur toute l'application."
            />
          </View>
        </SafeAreaView>
      </View>

      <Animated.View
        style={[
          styles.screenPanel,
          {
            backgroundColor: theme.background,
            transform: [{ translateX }, { scale }],
            borderRadius: borderR,
            overflow: "hidden",
          },
        ]}
      >
        <TouchableOpacity
          onPress={isOpen ? closeDrawer : openDrawer}
          style={[
            styles.menuBtn,
            {
              backgroundColor: theme.backgroundCard,
              borderColor: theme.border,
            },
          ]}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        >
          <View style={[styles.bar, { backgroundColor: theme.textPrimary }]} />
          <View
            style={[
              styles.bar,
              styles.barMid,
              { backgroundColor: theme.textPrimary },
            ]}
          />
          <View style={[styles.bar, { backgroundColor: theme.textPrimary }]} />
        </TouchableOpacity>

        {isOpen ? (
          <TouchableOpacity
            style={StyleSheet.absoluteFill}
            onPress={closeDrawer}
            activeOpacity={1}
          />
        ) : null}

        {children}
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1 },
  drawer: { position: "absolute", top: 0, left: 0, bottom: 0, paddingTop: 20 },
  drawerInner: {
    flex: 1,
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.lg,
  },
  brandPanel: {
    borderWidth: 1,
    borderRadius: radius.lg,
    padding: spacing.md,
    alignItems: "center",
    marginBottom: spacing.lg,
  },
  logoShell: {
    width: 180,
    height: 180,
    borderRadius: 32,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.06)",
    marginBottom: spacing.sm,
  },
  drawerLogo: { width: 150, height: 150 },
  drawerTitle: { fontSize: typography.fontSize.xl, fontWeight: "900" },
  drawerSubtitle: {
    fontSize: typography.fontSize.xs,
    textAlign: "center",
    marginTop: 4,
  },
  navList: { flex: 1, gap: 8 },
  navItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
  },
  navIcon: {
    fontSize: 20,
    marginRight: spacing.md,
    width: 28,
    textAlign: "center",
  },
  navLabel: { fontSize: typography.fontSize.md, flex: 1, fontWeight: "700" },
  navDot: { width: 8, height: 8, borderRadius: 4 },
  drawerFooter: { alignItems: "center", paddingTop: spacing.md },
  screenPanel: { flex: 1, ...StyleSheet.absoluteFillObject },
  menuBtn: {
    position: "absolute",
    top: 50,
    left: spacing.md,
    zIndex: 100,
    width: 48,
    height: 48,
    borderRadius: radius.md,
    justifyContent: "center",
    paddingHorizontal: 11,
    gap: 5,
    borderWidth: 1,
    ...createShadow("#7C3AED", 10),
  },
  bar: { height: 2.5, borderRadius: 2 },
  barMid: { width: "72%" },
});

export { NAV_ITEMS };
export default DrawerNavigator;
