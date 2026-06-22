/**
 * AnimatedButton — Premium tap button with micro-animations
 * Viral Stick | KERNEL FORGE — 2026
 */

import React, { useRef } from 'react';
import {
  Animated,
  TouchableWithoutFeedback,
  Text,
  StyleSheet,
  View,
  ActivityIndicator,
} from 'react-native';
import { useTheme, radius, typography, spacing, createShadow } from '../theme';

const AnimatedButton = ({
  title,
  onPress,
  variant = 'primary', // 'primary' | 'secondary' | 'ghost' | 'danger'
  size = 'md',          // 'sm' | 'md' | 'lg'
  loading = false,
  disabled = false,
  icon = null,
  style,
  textStyle,
}) => {
  const { theme } = useTheme();
  const scale = useRef(new Animated.Value(1)).current;
  const glow = useRef(new Animated.Value(0)).current;

  const onPressIn = () => {
    Animated.parallel([
      Animated.spring(scale, {
        toValue: 0.94,
        useNativeDriver: true,
        tension: 200,
        friction: 5,
      }),
      Animated.timing(glow, {
        toValue: 1,
        duration: 150,
        useNativeDriver: false,
      }),
    ]).start();
  };

  const onPressOut = () => {
    Animated.parallel([
      Animated.spring(scale, {
        toValue: 1,
        useNativeDriver: true,
        tension: 200,
        friction: 5,
      }),
      Animated.timing(glow, {
        toValue: 0,
        duration: 200,
        useNativeDriver: false,
      }),
    ]).start();
  };

  const getBackground = () => {
    if (disabled) return theme.textMuted;
    switch (variant) {
      case 'secondary': return theme.secondary;
      case 'ghost':     return 'transparent';
      case 'danger':    return theme.danger;
      default:          return theme.primary;
    }
  };

  const getBorderColor = () => {
    if (variant === 'ghost') return theme.border;
    return 'transparent';
  };

  const getTextColor = () => {
    if (variant === 'ghost') return theme.primary;
    return theme.textOnAccent;
  };

  const sizeStyles = {
    sm: { paddingVertical: 8,  paddingHorizontal: 16, fontSize: typography.fontSize.sm },
    md: { paddingVertical: 14, paddingHorizontal: 24, fontSize: typography.fontSize.md },
    lg: { paddingVertical: 18, paddingHorizontal: 32, fontSize: typography.fontSize.lg },
  }[size];

  const shadow = disabled ? {} : createShadow(
    variant === 'danger' ? theme.danger : theme.primary,
    8,
  );

  return (
    <TouchableWithoutFeedback
      onPress={!disabled && !loading ? onPress : undefined}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
    >
      <Animated.View
        style={[
          styles.button,
          {
            backgroundColor: getBackground(),
            borderColor: getBorderColor(),
            borderRadius: radius.md,
            paddingVertical: sizeStyles.paddingVertical,
            paddingHorizontal: sizeStyles.paddingHorizontal,
            transform: [{ scale }],
            opacity: disabled ? 0.5 : 1,
            ...shadow,
          },
          style,
        ]}
      >
        {loading ? (
          <ActivityIndicator color="#fff" size="small" />
        ) : (
          <View style={styles.row}>
            {icon && <View style={styles.icon}>{icon}</View>}
            <Text
              style={[
                styles.label,
                {
                  color: getTextColor(),
                  fontSize: sizeStyles.fontSize,
                },
                textStyle,
              ]}
            >
              {title}
            </Text>
          </View>
        )}
      </Animated.View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
  },
  label: {
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  icon: {
    marginRight: 4,
  },
});

export default AnimatedButton;
