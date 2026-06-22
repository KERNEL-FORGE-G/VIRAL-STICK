/**
 * CompanionAvatar — Animated companion display component
 * Viral Stick | KERNEL FORGE — 2026
 *
 * Companions:
 *  arch  → Archlord: PDG / Admin système
 *  para  → Para: Paramètres & Accueil
 *  secu  → Secu: Sécurité & Erreurs
 *  data  → Data: Données & Support
 *  bio   → Bio: Pages créatives
 *  ubu   → Ubu: Pages créatives
 *  art   → Art: Pages créatives
 */

import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  Image,
  Animated,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';
import { useTheme, radius, typography } from '../theme';

const COMPANIONS = {
  arch: require('../../assets/companions/arch_sans_fond.png'),
  para: require('../../assets/companions/para_sans_fond.png'),
  secu: require('../../assets/companions/secu_sans_fond.png'),
  data: require('../../assets/companions/data_sans_fond.png'),
  bio:  require('../../assets/companions/bio_sans_fond.png'),
  ubu:  require('../../assets/companions/ubu_sans_fond.png'),
  art:  require('../../assets/companions/art_sans_fond.png'),
};

const COMPANION_NAMES = {
  arch: 'Archlord',
  para: 'Para',
  secu: 'Secu',
  data: 'Data',
  bio:  'Bio',
  ubu:  'Ubu',
  art:  'Art',
};

const CompanionAvatar = ({
  companion = 'arch',
  size = 80,
  message = null,
  floating = false,
  onPress,
}) => {
  const { theme } = useTheme();
  const floatAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const [showBubble, setShowBubble] = useState(!!message);

  // Floating animation
  useEffect(() => {
    if (floating) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(floatAnim, {
            toValue: -8,
            duration: 1800,
            useNativeDriver: true,
          }),
          Animated.timing(floatAnim, {
            toValue: 0,
            duration: 1800,
            useNativeDriver: true,
          }),
        ]),
      ).start();
    }

    // Entrance
    Animated.spring(scaleAnim, {
      toValue: 1,
      tension: 80,
      friction: 6,
      useNativeDriver: true,
    }).start();
  }, [floating]);

  useEffect(() => {
    setShowBubble(!!message);
  }, [message]);

  const accentColor = theme[companion] || theme.primary;

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.85}
      style={styles.wrapper}
    >
      <Animated.View
        style={[
          styles.container,
          {
            transform: [
              { translateY: floatAnim },
              { scale: scaleAnim },
            ],
          },
        ]}
      >
        {/* Glow ring */}
        <View
          style={[
            styles.glowRing,
            {
              width: size + 16,
              height: size + 16,
              borderRadius: (size + 16) / 2,
              borderColor: accentColor,
              shadowColor: accentColor,
            },
          ]}
        />

        {/* Avatar image */}
        <Image
          source={COMPANIONS[companion]}
          style={{
            width: size,
            height: size,
            borderRadius: size / 2,
          }}
          resizeMode="contain"
        />
      </Animated.View>

      {/* Speech bubble */}
      {showBubble && message && (
        <Animated.View
          style={[
            styles.bubble,
            {
              backgroundColor: theme.backgroundCard,
              borderColor: accentColor,
            },
          ]}
        >
          <Text style={[styles.bubbleName, { color: accentColor }]}>
            {COMPANION_NAMES[companion]}
          </Text>
          <Text style={[styles.bubbleText, { color: theme.textPrimary }]}>
            {message}
          </Text>
        </Animated.View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
  },
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  glowRing: {
    position: 'absolute',
    borderWidth: 2,
    opacity: 0.5,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 12,
    elevation: 8,
  },
  bubble: {
    marginTop: 8,
    borderRadius: radius.md,
    borderWidth: 1,
    padding: 10,
    maxWidth: 220,
  },
  bubbleName: {
    fontWeight: '700',
    fontSize: typography.fontSize.xs,
    marginBottom: 2,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  bubbleText: {
    fontSize: typography.fontSize.sm,
    lineHeight: 18,
  },
});

export { COMPANIONS, COMPANION_NAMES };
export default CompanionAvatar;
