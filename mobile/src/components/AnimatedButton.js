import React, { useRef } from "react";
import {
  Animated,
  TouchableWithoutFeedback,
  Text,
  StyleSheet,
  View,
  ActivityIndicator,
} from "react-native";
import { colors, borderRadius, spacing } from "../theme/tokens";

const AnimatedButton = ({
  title,
  onPress,
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  icon = null,
  style,
  textStyle,
}) => {
  const scale = useRef(new Animated.Value(1)).current;
  const glow = useRef(new Animated.Value(0.92)).current;

  const onPressIn = () => {
    Animated.parallel([
      Animated.spring(scale, {
        toValue: 0.97,
        useNativeDriver: true,
        tension: 220,
        friction: 7,
      }),
      Animated.timing(glow, {
        toValue: 1,
        duration: 140,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const onPressOut = () => {
    Animated.parallel([
      Animated.spring(scale, {
        toValue: 1,
        useNativeDriver: true,
        tension: 220,
        friction: 7,
      }),
      Animated.timing(glow, {
        toValue: 0.92,
        duration: 160,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const variantStyle = {
    primary: {
      backgroundColor: colors.brandPrimary,
      borderColor: "rgba(255,255,255,0.12)",
      textColor: colors.white,
      shadowColor: colors.brandPrimary,
      innerHighlight: "rgba(255,255,255,0.16)",
    },
    secondary: {
      backgroundColor: colors.brandSecondary,
      borderColor: "rgba(255,255,255,0.12)",
      textColor: colors.white,
      shadowColor: colors.brandSecondary,
      innerHighlight: "rgba(255,255,255,0.12)",
    },
    ghost: {
      backgroundColor: "rgba(255,255,255,0.06)",
      borderColor: colors.border,
      textColor: colors.text,
      shadowColor: "#140A2C",
      innerHighlight: "rgba(255,255,255,0.08)",
    },
    danger: {
      backgroundColor: colors.danger,
      borderColor: "rgba(255,255,255,0.12)",
      textColor: colors.white,
      shadowColor: colors.danger,
      innerHighlight: "rgba(255,255,255,0.14)",
    },
  }[variant];

  const sizeStyles = {
    sm: {
      paddingVertical: 10,
      paddingHorizontal: 14,
      fontSize: 13,
      minHeight: 42,
    },
    md: {
      paddingVertical: 14,
      paddingHorizontal: 20,
      fontSize: 15,
      minHeight: 50,
    },
    lg: {
      paddingVertical: 18,
      paddingHorizontal: 24,
      fontSize: 16,
      minHeight: 58,
    },
  }[size];

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
            backgroundColor: disabled
              ? "rgba(255,255,255,0.10)"
              : variantStyle.backgroundColor,
            borderColor: variantStyle.borderColor,
            borderRadius: borderRadius.md,
            paddingVertical: sizeStyles.paddingVertical,
            paddingHorizontal: sizeStyles.paddingHorizontal,
            minHeight: sizeStyles.minHeight,
            transform: [{ scale }],
            opacity: disabled ? 0.58 : 1,
            shadowColor: disabled ? "#000" : variantStyle.shadowColor,
          },
          style,
        ]}
      >
        <Animated.View
          pointerEvents="none"
          style={[
            styles.highlight,
            {
              backgroundColor: variantStyle.innerHighlight,
              opacity: glow,
              transform: [{ scaleX: glow }],
            },
          ]}
        />

        {loading ? (
          <ActivityIndicator color={variantStyle.textColor} size="small" />
        ) : (
          <View style={styles.row}>
            {icon && <View style={styles.icon}>{icon}</View>}
            <Text
              style={[
                styles.label,
                {
                  color: variantStyle.textColor,
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
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    overflow: "hidden",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.28,
    shadowRadius: 20,
    elevation: 10,
  },
  highlight: {
    position: "absolute",
    top: -22,
    left: 12,
    right: 12,
    height: 30,
    borderRadius: 999,
  },
  label: {
    fontWeight: "900",
    letterSpacing: 0.35,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  icon: {
    marginRight: spacing.sm,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default AnimatedButton;
