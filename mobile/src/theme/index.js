import React, { createContext, useContext, useState } from "react";
import { colors, spacing as tokenSpacing, radius as tokenRadius, shadows as tokenShadows } from "./tokens";

// Fallback shadows to prevent crashes if tokens are missing
const defaultShadows = {
  card: { shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 5 },
  btn:  { shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
};

export const spacing  = tokenSpacing || { xs: 4, sm: 8, md: 16, lg: 24, xl: 32 };
export const radius   = tokenRadius || { sm: 4, md: 8, lg: 12, xl: 16, pill: 999 };
export const shadows  = tokenShadows || defaultShadows;

export const lightTheme = {
  isDark: false,
  background:          colors?.snowWhite || "#FFFFFF",
  backgroundCard:      colors?.snowWhite || "#FFFFFF",
  backgroundSecondary: colors?.cloudGray || "#F3F4F6",
  textPrimary:         colors?.almostBlack || "#0D0D0D",
  textSecondary:       colors?.charcoal || "#374151",
  textMuted:           colors?.silver || "#9CA3AF",
  primary:             colors?.sapphire || "#2563EB",
  primaryLight:        colors?.sapphireLight || "#BFDBFE",
  secondary:           colors?.sapphireCyan || "#06B6D4",
  warning:             colors?.sunshineYellow || "#F59E0B",
  danger:              colors?.danger || "#EF4444",
  border:              colors?.cloudGray || "#F3F4F6",
  cardShadow:          shadows.card,
  btnShadow:           shadows.btn,
};

export const darkTheme = {
  isDark: true,
  background:          colors?.bg || "#0D0D0D",
  backgroundCard:      colors?.bgSecondary || "#141414",
  backgroundSecondary: colors?.almostBlack || "#0D0D0D",
  textPrimary:         colors?.text || "#FFFFFF",
  textSecondary:       colors?.textSecondary || "#A0A0A0",
  textMuted:           colors?.textMuted || "#6B7280",
  primary:             colors?.sapphire || "#2563EB",
  primaryLight:        "rgba(37,99,235,0.15)",
  secondary:           colors?.sapphireCyan || "#06B6D4",
  warning:             colors?.warning || "#F59E0B",
  danger:              colors?.danger || "#EF4444",
  border:              colors?.border || "rgba(255,255,255,0.06)",
  cardShadow:          shadows.card,
  btnShadow:           shadows.btn,
};

const ThemeContext = createContext({
  theme: darkTheme,
  isDark: true,
  toggleTheme: () => {},
});

export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(true);
  const theme = isDark ? darkTheme : lightTheme;
  const toggleTheme = () => setIsDark(!isDark);

  return (
    <ThemeContext.Provider value={{ theme, isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  return {
    ...context,
    shadows: shadows // Garantit que shadows est accessible via useTheme()
  };
};
