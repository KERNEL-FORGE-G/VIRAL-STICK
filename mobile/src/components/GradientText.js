/**
 * GradientText — Text with gradient simulation via overlay
 * Viral Stick | KERNEL FORGE — 2026
 */

import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { useTheme, typography } from '../theme';

const GradientText = ({ children, style, size = 'xl', bold = true }) => {
  const { theme } = useTheme();
  return (
    <Text
      style={[
        styles.base,
        {
          fontSize: typography.fontSize[size],
          fontWeight: bold ? '800' : '400',
          color: theme.primaryLight,
        },
        style,
      ]}
    >
      {children}
    </Text>
  );
};

const styles = StyleSheet.create({
  base: {
    letterSpacing: 0.5,
  },
});

export default GradientText;
