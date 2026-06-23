import React, { useRef, useEffect } from "react";
import { View, StyleSheet, Animated } from "react-native";
import { borderRadius, spacing } from "../theme/tokens";

const GlassCard = ({ children, style, animate = false, delay = 0 }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(18)).current;

  useEffect(() => {
    if (animate) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 420,
          delay,
          useNativeDriver: true,
        }),
        Animated.spring(translateY, {
          toValue: 0,
          delay,
          tension: 90,
          friction: 11,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      fadeAnim.setValue(1);
      translateY.setValue(0);
    }
  }, [animate, delay, fadeAnim, translateY]);

  return (
    <Animated.View
      style={[
        styles.card,
        style,
        { opacity: fadeAnim, transform: [{ translateY }] },
      ]}
    >
      <View style={styles.highlight} pointerEvents="none" />
      {children}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "rgba(12, 18, 35, 0.86)",
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
    padding: spacing.md,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.22,
    shadowRadius: 22,
    elevation: 10,
  },
  highlight: {
    position: "absolute",
    top: -40,
    left: -10,
    right: -10,
    height: 90,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 999,
  },
});

export default GlassCard;
