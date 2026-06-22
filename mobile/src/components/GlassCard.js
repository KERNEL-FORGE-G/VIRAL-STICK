/**
 * GlassCard — Glassmorphism container component
 * Viral Stick | KERNEL FORGE — 2026
 */

import React, { useRef, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Animated,
  Platform,
} from 'react-native';
import { useTheme, radius, createShadow } from '../theme';

const GlassCard = ({
  children,
  style,
  animate = false,
  delay = 0,
  pressable = false,
  onPress,
}) => {
  const { theme } = useTheme();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    if (animate) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 500,
          delay,
          useNativeDriver: true,
        }),
        Animated.spring(translateY, {
          toValue: 0,
          delay,
          tension: 80,
          friction: 10,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      fadeAnim.setValue(1);
      translateY.setValue(0);
    }
  }, [animate, delay]);

  const containerStyle = [
    styles.card,
    {
      backgroundColor: theme.glassBackground,
      borderColor: theme.glassBorder,
      ...createShadow(theme.shadowColor, 16),
    },
    style,
  ];

  return (
    <Animated.View
      style={[
        containerStyle,
        { opacity: fadeAnim, transform: [{ translateY }] },
      ]}
    >
      {children}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.lg,
    borderWidth: 1,
    padding: 16,
    overflow: 'hidden',
  },
});

export default GlassCard;
