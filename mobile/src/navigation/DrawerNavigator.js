/**
 * DrawerNavigator — Advanced animated drawer navigation
 * Viral Stick | KERNEL FORGE — 2026
 *
 * Animation: translate + scale + borderRadius on screen while drawer slides in
 * Duration: 300ms ease-in-out
 */

import React, { useRef, useState } from 'react';
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
} from 'react-native';
import { useTheme, spacing, radius, typography, createShadow } from '../theme';
import CompanionAvatar from '../components/CompanionAvatar';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const DRAWER_WIDTH = SCREEN_WIDTH * 0.75;

// Navigation items
const NAV_ITEMS = [
  { key: 'Home',          label: 'Accueil',           icon: '🏠', companion: 'bio'  },
  { key: 'ContextReader', label: 'Context Reader',    icon: '📖', companion: 'art'  },
  { key: 'VoiceToMeme',  label: 'Voice → Mème',      icon: '🎙️', companion: 'ubu'  },
  { key: 'StatusRemixer',label: 'Status Remixer',     icon: '🎨', companion: 'bio'  },
  { key: 'CompanionChat',label: 'Compagnons',         icon: '💬', companion: 'data' },
  { key: 'Settings',     label: 'Paramètres',         icon: '⚙️', companion: 'para' },
  { key: 'About',        label: 'À propos',           icon: 'ℹ️', companion: 'arch' },
];

const DrawerNavigator = ({ children, currentScreen, onNavigate }) => {
  const { theme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  const translateX = useRef(new Animated.Value(0)).current;
  const scale      = useRef(new Animated.Value(1)).current;
  const borderR    = useRef(new Animated.Value(0)).current;

  const openDrawer = () => {
    setIsOpen(true);
    Animated.parallel([
      Animated.timing(translateX, {
        toValue: DRAWER_WIDTH,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(scale, {
        toValue: 0.88,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(borderR, {
        toValue: 24,
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
    setTimeout(() => onNavigate(key), 300);
  };

  return (
    <View style={[styles.root, { backgroundColor: theme.backgroundSecondary }]}>
      <StatusBar
        barStyle={theme.isDark ? 'light-content' : 'dark-content'}
        backgroundColor="transparent"
        translucent
      />

      {/* ── Drawer Panel ──────────────────────────────────────── */}
      <View style={[styles.drawer, { width: DRAWER_WIDTH }]}>
        <SafeAreaView style={styles.drawerInner}>
          {/* Logo & brand */}
          <View style={styles.drawerHeader}>
            <Image
              source={require('../../assets/logo/logo_sans_fond.png')}
              style={styles.drawerLogo}
              resizeMode="contain"
            />
            <Text style={[styles.drawerTitle, { color: theme.textPrimary }]}>
              Viral Stick
            </Text>
            <Text style={[styles.drawerSubtitle, { color: theme.textSecondary }]}>
              KERNEL FORGE — 2026
            </Text>
          </View>

          {/* Navigation items */}
          <View style={styles.navList}>
            {NAV_ITEMS.map((item) => {
              const active = currentScreen === item.key;
              return (
                <TouchableOpacity
                  key={item.key}
                  onPress={() => handleNavItem(item.key)}
                  style={[
                    styles.navItem,
                    active && {
                      backgroundColor: `${theme.primary}22`,
                      borderLeftColor: theme.primary,
                    },
                  ]}
                  activeOpacity={0.7}
                >
                  <Text style={styles.navIcon}>{item.icon}</Text>
                  <Text
                    style={[
                      styles.navLabel,
                      {
                        color: active ? theme.primaryLight : theme.textSecondary,
                        fontWeight: active ? '700' : '500',
                      },
                    ]}
                  >
                    {item.label}
                  </Text>
                  {active && (
                    <View style={[styles.activeDot, { backgroundColor: theme.primary }]} />
                  )}
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Bottom companion */}
          <View style={styles.drawerFooter}>
            <CompanionAvatar companion="arch" size={56} floating />
            <Text style={[styles.footerText, { color: theme.textMuted }]}>
              Archlord vous surveille 👁️
            </Text>
          </View>
        </SafeAreaView>
      </View>

      {/* ── Animated screen panel ─────────────────────────────── */}
      <Animated.View
        style={[
          styles.screenPanel,
          { backgroundColor: theme.background },
          {
            transform: [{ translateX }, { scale }],
            borderRadius: borderR,
            overflow: 'hidden',
          },
        ]}
      >
        {/* Hamburger button */}
        <TouchableOpacity
          onPress={isOpen ? closeDrawer : openDrawer}
          style={[styles.menuBtn, { backgroundColor: theme.backgroundCard }]}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        >
          <View style={[styles.bar, { backgroundColor: theme.textPrimary }]} />
          <View style={[styles.bar, styles.barMid, { backgroundColor: theme.textPrimary }]} />
          <View style={[styles.bar, { backgroundColor: theme.textPrimary }]} />
        </TouchableOpacity>

        {/* Overlay when drawer open */}
        {isOpen && (
          <TouchableOpacity
            style={StyleSheet.absoluteFill}
            onPress={closeDrawer}
            activeOpacity={1}
          />
        )}

        {children}
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  drawer: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    paddingTop: 20,
  },
  drawerInner: {
    flex: 1,
    paddingHorizontal: spacing.md,
  },
  drawerHeader: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.08)',
    marginBottom: spacing.md,
  },
  drawerLogo: {
    width: 60,
    height: 60,
    marginBottom: spacing.sm,
  },
  drawerTitle: {
    fontSize: typography.fontSize.xl,
    fontWeight: '800',
    letterSpacing: 1,
  },
  drawerSubtitle: {
    fontSize: typography.fontSize.xs,
    letterSpacing: 2,
    marginTop: 2,
    textTransform: 'uppercase',
  },
  navList: {
    flex: 1,
  },
  navItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: spacing.md,
    borderRadius: radius.md,
    marginVertical: 2,
    borderLeftWidth: 3,
    borderLeftColor: 'transparent',
  },
  navIcon: {
    fontSize: 20,
    marginRight: spacing.md,
    width: 28,
    textAlign: 'center',
  },
  navLabel: {
    fontSize: typography.fontSize.md,
    flex: 1,
  },
  activeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  drawerFooter: {
    alignItems: 'center',
    paddingBottom: spacing.xl,
    gap: 8,
  },
  footerText: {
    fontSize: typography.fontSize.xs,
    textAlign: 'center',
  },
  screenPanel: {
    flex: 1,
    ...StyleSheet.absoluteFillObject,
  },
  menuBtn: {
    position: 'absolute',
    top: 50,
    left: spacing.md,
    zIndex: 100,
    width: 44,
    height: 44,
    borderRadius: radius.md,
    justifyContent: 'center',
    paddingHorizontal: 10,
    gap: 5,
    ...createShadow('#7C3AED', 8),
  },
  bar: {
    height: 2.5,
    borderRadius: 2,
  },
  barMid: {
    width: '70%',
  },
});

export { NAV_ITEMS };
export default DrawerNavigator;
