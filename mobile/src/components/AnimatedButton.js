import React, { useRef } from "react";
import { Animated, TouchableWithoutFeedback, Text, StyleSheet, ActivityIndicator } from "react-native";
import { useTheme, radius } from "../theme";

const AnimatedButton = ({ title, onPress, variant = "primary", size = "md", loading = false, disabled = false, style }) => {
  const { theme } = useTheme();
  const pressed = useRef(new Animated.Value(0)).current;

  // Duolingo-style variants!
  const VARIANTS = {
    primary: { bg: theme.primary, shadow: theme.primaryDark, text: "#ffffff", border: theme.primary },
    green: { bg: theme.primary, shadow: theme.primaryDark, text: "#ffffff", border: theme.primary },
    ghost: { bg: "#ffffff", shadow: "#b5b5b5", text: theme.secondary, border: theme.border },
    danger: { bg: theme.danger, shadow: "#aa1d1d", text: "#ffffff", border: theme.danger },
  };

  const v = VARIANTS[variant] || VARIANTS.primary;
  const pad = { 
    sm: { v: 10, h: 16, fs: 13 }, 
    md: { v: 12, h: 24, fs: 15 }, // Match web
    lg: { v: 14, h: 36, fs: 17 } 
  }[size];

  const onIn  = () => Animated.spring(pressed, { toValue: 1, useNativeDriver: true, tension: 300, friction: 10 }).start();
  const onOut = () => Animated.spring(pressed, { toValue: 0, useNativeDriver: true, tension: 300, friction: 10 }).start();

  // Animate translateY instead of scale to match web!
  const translateY = pressed.interpolate({ inputRange: [0, 1], outputRange: [0, 4] });
  const shadowHeight = pressed.interpolate({ inputRange: [0, 1], outputRange: [4, 0] });

  return (
    <TouchableWithoutFeedback
      onPress={!disabled && !loading ? onPress : undefined}
      onPressIn={onIn} onPressOut={onOut}
    >
      <Animated.View style={[
        styles.btn,
        {
          backgroundColor: disabled ? theme.backgroundSecondary : v.bg,
          borderColor: disabled ? theme.border : v.border,
          paddingVertical: pad.v, 
          paddingHorizontal: pad.h,
          borderRadius: radius.buttons, // 12px, match web
          shadowColor: disabled ? "transparent" : v.shadow,
          shadowOffset: { width: 0, height: shadowHeight }, // Animated shadow height!
          shadowOpacity: variant === 'ghost' ? 0 : 1, // Solid shadow!
          shadowRadius: 0, // No blur for solid shadow!
          elevation: variant === 'ghost' ? 0 : 2,
          transform: [{ translateY }],
        },
        style,
      ]}>
        {loading
          ? <ActivityIndicator color={v.text} size="small" />
          : <Text style={[
              styles.label, 
              { 
                color: disabled ? theme.textMuted : v.text, 
                fontSize: pad.fs,
                letterSpacing: 0.8 // Match web
              }
            ]}>
            {title}
          </Text>
        }
      </Animated.View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  btn: { 
    alignItems: "center", 
    justifyContent: "center", 
    borderWidth: 2, // Match web's 2px border
    overflow: "hidden",
    flexDirection: "row", // Allow for icons too!
    gap: 8 
  },
  label: { 
    fontWeight: "800", // Match web's 800 weight!
    letterSpacing: 0.8,
    fontFamily: "Nunito"
  },
});

export default AnimatedButton;
