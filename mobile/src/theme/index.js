import React, { createContext, useContext } from "react";
import { theme } from "./colors";

export const spacing = {
  xs: 6,
  sm: 10,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 40,
  xxxl: 56,
  huge: 72,
};

export const radius = {
  button: 16,
  md: 18,
  lg: 28,
  xl: 36,
};

export const typography = {
  fontSize: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 22,
    xxl: 28,
    xxxl: 36,
  },
};

export const createShadow = (color = "#7C3AED", elevation = 16) => ({
  shadowColor: color,
  shadowOffset: { width: 0, height: Math.max(6, elevation / 2) },
  shadowOpacity: 0.24,
  shadowRadius: elevation,
  elevation: Math.max(6, Math.round(elevation / 2)),
});

const ThemeContext = createContext({ theme });

export const ThemeProvider = ({ children }) => (
  <ThemeContext.Provider value={{ theme }}>{children}</ThemeContext.Provider>
);

export const useTheme = () => useContext(ThemeContext);
