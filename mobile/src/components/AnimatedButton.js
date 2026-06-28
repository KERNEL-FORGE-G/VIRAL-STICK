import React, { useRef } from "react";
import { Animated, TouchableWithoutFeedback, Text, StyleSheet, ActivityIndicator, View } from "react-native";
import { useTheme, radius } from "../theme";

const AnimatedButton = ({ title, onPress, variant = "primary", size = "md", loading = false, disabled = false, style }) => {
  const { theme } = useTheme();
  const pressed = useRef(new Animated.Value(0)).current;

  const VARIANTS = {
    primary:   { bg: theme.primary,   text: "#ffffff", border: theme.primaryDark },
    secondary: { bg: theme.secondary, text: "#ffffff", border: theme.secondaryDark },
    ghost:     { bg: "transparent",  text: theme.textPrimary, border: theme.border },
    danger:    { bg: theme.danger,    text: "#ffffff", border: theme.danger },
  };

  if (variant === 'green') variant = 'primary';

  const v = VARIANTS[variant] || VARIANTS.primary;
  const pad = {
    sm: { v: 8, h: 16, fs: 13, b: 3 },
    md: { v: 12, h: 20, fs: 15, b: 4 },
    lg: { v: 14, h: 24, fs: 16, b: 5 }
  }[size];

  const onIn  = () => Animated.spring(pressed, { toValue: 1, useNativeDriver: true, tension: 300, friction: 10 }).start();
  const onOut = () => Animated.spring(pressed, { toValue: 0, useNativeDriver: true, tension: 300, friction: 10 }).start();

  const translateY = pressed.interpolate({
    inputRange: [0, 1],
    outputRange: [0, pad.b - 1]
  });

  return (
    <View style={[style, { paddingBottom: pad.b }]}>
      <TouchableWithoutFeedback
        onPress={!disabled && !loading ? onPress : undefined}
        onPressIn={onIn} onPressOut={onOut}
      >
        <Animated.View style={[
          styles.btn,
          {
            backgroundColor: disabled ? theme.backgroundSecondary : v.bg,
            borderColor: disabled ? theme.border : v.border,
            borderWidth: 2,
            borderBottomWidth: disabled ? 2 : (variant === 'ghost' ? 2 : pad.b),
            paddingVertical: pad.v, paddingHorizontal: pad.h,
            borderRadius: radius.md,
            transform: [{ translateY }],
            elevation: 0,
            shadowOpacity: 0,
          }
        ]}>
          {loading
            ? <ActivityIndicator color={v.text} size="small" />
            : <Text style={[styles.label, { color: disabled ? theme.textMuted : v.text, fontSize: pad.fs }]}>{title}</Text>
          }
        </Animated.View>
      </TouchableWithoutFeedback>
    </View>
  );
};

const styles = StyleSheet.create({
  btn:   { alignItems: "center", justifyContent: "center" },
  label: { fontWeight: "700", letterSpacing: 0.2, textTransform: "uppercase" },
});

export default AnimatedButton;
