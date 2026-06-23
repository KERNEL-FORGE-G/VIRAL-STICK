/**
 * Viral Stick — Theme System
 * Unified for Mobile
 */

import React, { createContext, useContext } from 'react';
import { theme } from './colors';

// ─── Spacing scale (4px base) ──────────────────────────────────────────────
export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  huge: 48,
};

// ─── Border radii ─────────────────────────────────────────────────────────
export const radius = {
  button: 4,
  md: 12,
  lg: 16,
  xl: 24,
};

// ─── Typography ────────────────────────────────────────────────────────────
export const typography = {
  fontSize: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    xxxl: 32,
  },
};

// ─── Theme Context ────────────────────────────────────────────────────────
const ThemeContext = createContext({ theme });

export const ThemeProvider = ({ children }) => {
  return (
    <ThemeContext.Provider value={{ theme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
