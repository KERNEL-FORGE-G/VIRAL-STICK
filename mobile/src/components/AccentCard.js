import React, { useRef, useEffect } from "react";
import { View, StyleSheet, Animated } from "react-native";
import { useTheme, colors, radius } from "../theme";

const AccentCard = ({ children, style, accentColor, animate = false, delay = 0 }) => {
  const { theme } = useTheme();
  const fade = useRef(new Animated.Value(animate ? 0 : 1)).current;
  const ty   = useRef(new Animated.Value(animate ? 16 : 0)).current;

  useEffect(() => {
    if (!animate) return;
    Animated.parallel([
      Animated.timing(fade, { toValue: 1, duration: 400, delay, useNativeDriver: true }),
      Animated.spring(ty,   { toValue: 0, delay, tension: 90, friction: 11, useNativeDriver: true }),
    ]).start();
  }, [animate, delay, fade, ty]);

  return (
    <Animated.View style={[
      styles.card,
      {
        backgroundColor: colors.snowWhite,
        borderColor: colors.cloudGray,
        opacity: fade,
        transform: [{ translateY: ty }]
      },
      style
    ]}>
      {/* Accent color bar on the left */}
      {accentColor && (
        <View style={[styles.accent, { backgroundColor: accentColor }]} />
      )}
      <View style={styles.content}>
        {children}
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.md || 16,
    borderWidth: 2,
    borderBottomWidth: 4, // Design 3D Duolingo style
    flexDirection: "row",
    overflow: "hidden",
    elevation: 0,
    shadowOpacity: 0
  },
  accent: {
    width: 6,
    height: "100%",
  },
  content: {
    flex: 1,
    padding: 16,
  },
});

export default AccentCard;
