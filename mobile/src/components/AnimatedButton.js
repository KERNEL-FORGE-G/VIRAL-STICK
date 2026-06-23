import React, { useRef } from "react";
import { Animated, TouchableWithoutFeedback, Text, StyleSheet, View, ActivityIndicator } from "react-native";
import { colors, borderRadius } from "../theme/tokens";

const VARIANTS = {
  primary: { bg: colors.duoBlue,   shadow: colors.duoBlueDark,  text: "#ffffff", border: colors.duoBlue },
  green:   { bg: colors.duoGreen,  shadow: colors.duoGreenDark, text: "#ffffff", border: colors.duoGreen },
  ghost:   { bg: "#ffffff",        shadow: "#b5b5b5",           text: colors.duoBlue, border: colors.cloudGray },
  danger:  { bg: colors.danger,    shadow: "#aa1d1d",           text: "#ffffff", border: colors.danger },
};

const AnimatedButton = ({ title, onPress, variant = "primary", size = "md", loading = false, disabled = false, style }) => {
  const pressed = useRef(new Animated.Value(0)).current;
  const v = VARIANTS[variant] || VARIANTS.primary;
  const pad = { sm: { v: 10, h: 16, fs: 13 }, md: { v: 14, h: 20, fs: 15 }, lg: { v: 16, h: 24, fs: 16 } }[size];

  const onIn  = () => Animated.spring(pressed, { toValue: 1, useNativeDriver: true, tension: 300, friction: 10 }).start();
  const onOut = () => Animated.spring(pressed, { toValue: 0, useNativeDriver: true, tension: 300, friction: 10 }).start();

  const translateY = pressed.interpolate({ inputRange: [0, 1], outputRange: [0, 4] });
  const shadowH    = pressed.interpolate({ inputRange: [0, 1], outputRange: [4, 0] });

  return (
    <TouchableWithoutFeedback
      onPress={!disabled && !loading ? onPress : undefined}
      onPressIn={onIn} onPressOut={onOut}
    >
      <Animated.View style={[
        styles.btn,
        {
          backgroundColor: disabled ? colors.cloudGray : v.bg,
          borderColor: disabled ? colors.cloudGray : v.border,
          paddingVertical: pad.v, paddingHorizontal: pad.h,
          borderRadius: borderRadius.md,
          shadowColor: disabled ? "#aaa" : v.shadow,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.9,
          shadowRadius: 0,
          elevation: 4,
          transform: [{ translateY }],
        },
        style,
      ]}>
        {loading
          ? <ActivityIndicator color={v.text} size="small" />
          : <Text style={[styles.label, { color: disabled ? colors.silver : v.text, fontSize: pad.fs }]}>{title}</Text>
        }
      </Animated.View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  btn:   { alignItems: "center", justifyContent: "center", borderWidth: 2, overflow: "hidden" },
  label: { fontWeight: "800", letterSpacing: 0.4 },
});

export default AnimatedButton;
