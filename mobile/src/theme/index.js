/**
 * Viral Stick — Theme System
 * KERNEL FORGE — 2026
 *
 * Exports spacing, typography, shadows, and theme context helpers.
 */

import React, { createContext, useContext, useState } from 'react';
import { darkTheme, lightTheme } from './colors';

// ─── Spacing scale ─────────────────────────────────────────────────────────
export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
};

// ─── Border radii ─────────────────────────────────────────────────────────
export const radius = {
  sm: 8,
  md: 14,
  lg: 20,
  xl: 28,
  full: 999,
};

// ─── Typography ────────────────────────────────────────────────────────────
export const typography = {
  fontFamily: {
    regular: 'System',
    medium: 'System',
    bold: 'System',
  },
  fontSize: {
    xs: 11,
    sm: 13,
    md: 15,
    lg: 18,
    xl: 22,
    xxl: 28,
    xxxl: 36,
    hero: 44,
  },
  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
  },
};

// ─── Shadow presets ───────────────────────────────────────────────────────
export const createShadow = (color = '#7C3AED', elevation = 12) => ({
  shadowColor: color,
  shadowOffset: { width: 0, height: elevation / 3 },
  shadowOpacity: 0.35,
  shadowRadius: elevation,
  elevation,
});

// ─── Theme Context ────────────────────────────────────────────────────────
const ThemeContext = createContext({ theme: darkTheme, toggleTheme: () => {} });

export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(true);
  const theme = isDark ? darkTheme : lightTheme;

  const toggleTheme = () => setIsDark(prev => !prev);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, isDark }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);

// ─── Glassmorphism card style helper ─────────────────────────────────────
export const glassStyle = (theme) => ({
  backgroundColor: theme.glassBackground,
  borderWidth: 1,
  borderColor: theme.glassBorder,
  borderRadius: radius.lg,
  ...createShadow(theme.shadowColor),
});
