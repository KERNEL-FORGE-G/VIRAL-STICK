import React, { createContext, useContext, useState } from "react";
import { colors as tokenColors, spacing as tokenSpacing, radius as tokenRadius, shadows as tokenShadows } from "./tokens";

// Fallback shadows to prevent crashes if tokens are missing
const defaultShadows = {
  card: { shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 5 },
  btn:  { shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
};

export const colors   = tokenColors || {};
export const spacing  = tokenSpacing || { xs: 4, sm: 8, md: 16, lg: 24, xl: 32 };
export const radius   = tokenRadius || { sm: 4, md: 8, lg: 12, xl: 16, pill: 999, buttons: 12 };
export const shadows  = tokenShadows || defaultShadows;

export const lightTheme = {
  isDark: false,
  background:          tokenColors?.snowWhite || "#FFFFFF",
  backgroundCard:      tokenColors?.snowWhite || "#FFFFFF",
  backgroundSecondary: tokenColors?.cloudGray || "#F3F4F6",
  textPrimary:         tokenColors?.almostBlack || "#3c3c3c",
  textSecondary:       tokenColors?.charcoal || "#4b4b4b",
  textMuted:           tokenColors?.graphite || "#777777",
  primary:             tokenColors?.duoGreen || "#58cc02",
  primaryLight:        tokenColors?.duoGreenLight || "#d7ffb8",
  primaryDark:         tokenColors?.duoGreenDark || "#3f8f01",
  secondary:           tokenColors?.skyBlue || "#1cb0f6",
  secondaryLight:      "#d0f0fd",
  secondaryDark:       tokenColors?.skyBlueDark || "#1899d6",
  success:             tokenColors?.duoGreen || "#58cc02",
  warning:             tokenColors?.sunshineYellow || "#ffc700",
  danger:              tokenColors?.danger || "#EF4444",
  border:              tokenColors?.cloudGray || "#e5e5e5",
  borderStrong:        "#b5b5b5",
  panelSoft:           "#f7f7f7",
  cardShadow:          shadows.card,
  btnShadow:           shadows.btn,
};

export const darkTheme = {
  isDark: true,
  background:          "#0D0D0D",
  backgroundCard:      "#141414",
  backgroundSecondary: "#141414",
  textPrimary:         "#FFFFFF",
  textSecondary:       "#A0A0A0",
  textMuted:           "#6B7280",
  primary:             tokenColors?.duoGreen || "#58cc02",
  primaryLight:        "#d7ffb8",
  primaryDark:         "#3f8f01",
  secondary:           tokenColors?.skyBlue || "#1cb0f6",
  secondaryLight:      "#d0f0fd",
  secondaryDark:       tokenColors?.skyBlueDark || "#1899d6",
  success:             tokenColors?.duoGreen || "#58cc02",
  warning:             tokenColors?.sunshineYellow || "#ffc700",
  danger:              tokenColors?.danger || "#EF4444",
  border:              "rgba(255,255,255,0.08)",
  borderStrong:        "rgba(255,255,255,0.15)",
  panelSoft:           "rgba(255,255,255,0.05)",
  cardShadow:          shadows.card,
  btnShadow:           shadows.btn,
};

const ThemeContext = createContext({
  theme: lightTheme,
  isDark: false,
  toggleTheme: () => {},
});

export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(false); // Default to light theme!
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
