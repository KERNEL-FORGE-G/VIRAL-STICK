/**
 * CompanionAvatar — Animated companion display component
 * Viral Stick | Design System — 2026
 */

import React, { useRef, useEffect, useState } from "react";
import {
  View,
  Image,
  Animated,
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native";
import { colors, borderRadius, spacing } from "../theme/tokens";

const COMPANIONS = {
  arch: require("../../assets/companions/arch_sans_fond.png"),
  para: require("../../assets/companions/para_sans_fond.png"),
  secu: require("../../assets/companions/secu_sans_fond.png"),
  data: require("../../assets/companions/data_sans_fond.png"),
  bio: require("../../assets/companions/bio_sans_fond.png"),
  ubu: require("../../assets/companions/ubu_sans_fond.png"),
  art: require("../../assets/companions/art_sans_fond.png"),
};

const COMPANION_NAMES = {
  arch: "Archlord",
  para: "Para",
  secu: "Secu",
  data: "Data",
  bio: "Bio",
  ubu: "Ubu",
  art: "Art",
};

const CompanionAvatar = ({
  companion = "arch",
  size = 160,
  message = null,
  floating = false,
  onPress,
}) => {
  const floatAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const [showBubble, setShowBubble] = useState(!!message);

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

  // Utilisation des tokens pour la couleur d'accent
  const accentColor = colors[companion] || colors.arch;

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
            transform: [{ translateY: floatAnim }, { scale: scaleAnim }],
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
        <View
          style={[
            styles.bubble,
            {
              backgroundColor: "rgba(255, 255, 255, 0.1)",
              borderColor: accentColor,
            },
          ]}
        >
          <Text style={[styles.bubbleName, { color: accentColor }]}>
            {COMPANION_NAMES[companion]}
          </Text>
          <Text style={[styles.bubbleText, { color: colors.text }]}>
            {message}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    alignItems: "center",
  },
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
  glowRing: {
    position: "absolute",
    borderWidth: 2,
    opacity: 0.5,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 12,
    elevation: 8,
  },
  bubble: {
    marginTop: spacing.sm,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    padding: spacing.md,
    maxWidth: 220,
    // Glassmorphism
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  bubbleName: {
    fontWeight: "700",
    fontSize: 12,
    marginBottom: 2,
    letterSpacing: 0.8,
    textTransform: "uppercase",
  },
  bubbleText: {
    fontSize: 14,
    lineHeight: 18,
  },
});

export { COMPANIONS, COMPANION_NAMES };
export default CompanionAvatar;
