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

  const onPressIn = () => {
    Animated.spring(scale, {
      toValue: 0.97,
      useNativeDriver: true,
      tension: 220,
      friction: 7,
    }).start();
  };

  const onPressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
      tension: 220,
      friction: 7,
    }).start();
  };

  const variantStyle = {
    primary: {
      backgroundColor: colors.brandPrimary,
      borderColor: "transparent",
      textColor: colors.white,
    },
    secondary: {
      backgroundColor: colors.brandSecondary,
      borderColor: "transparent",
      textColor: colors.white,
    },
    ghost: {
      backgroundColor: "rgba(255,255,255,0.04)",
      borderColor: colors.border,
      textColor: colors.text,
    },
    danger: {
      backgroundColor: colors.danger,
      borderColor: "transparent",
      textColor: colors.white,
    },
  }[variant];

  const sizeStyles = {
    sm: { paddingVertical: 10, paddingHorizontal: 14, fontSize: 13 },
    md: { paddingVertical: 14, paddingHorizontal: 20, fontSize: 15 },
    lg: { paddingVertical: 18, paddingHorizontal: 24, fontSize: 16 },
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
            transform: [{ scale }],
            opacity: disabled ? 0.6 : 1,
            shadowColor: disabled
              ? "#000"
              : variant === "secondary"
                ? colors.brandSecondary
                : colors.brandPrimary,
          },
          style,
        ]}
      >
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
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.24,
    shadowRadius: 18,
    elevation: 8,
  },
  label: {
    fontWeight: "800",
    letterSpacing: 0.3,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    marginRight: spacing.sm,
  },
});

export default AnimatedButton;
