import React, { createContext, useContext } from "react";
import { colors } from "./tokens";

export const spacing  = { xs: 6, sm: 10, md: 16, lg: 24, xl: 32, xxl: 48 };
export const radius   = { sm: 8, md: 12, lg: 16, xl: 20, pill: 999 };
export const typography = {
  fontSize: { xs: 12, sm: 14, md: 16, lg: 18, xl: 22, xxl: 28, xxxl: 36 },
};

export const createShadow = (color = "#1899d6", elevation = 4) => ({
  shadowColor: color,
  shadowOffset: { width: 0, height: elevation },
  shadowOpacity: 0.22,
  shadowRadius: 2,
  elevation: Math.max(2, elevation),
});

export const theme = {
  background:          colors.snowWhite,
  backgroundCard:      colors.snowWhite,
  backgroundSecondary: colors.bgSecondary,
  textPrimary:         colors.almostBlack,
  textSecondary:       colors.charcoal,
  textMuted:           colors.silver,
  // Bleu comme couleur principale
  primary:             colors.duoBlue,
  primaryLight:        colors.duoBlueLight,
  primaryDark:         colors.duoBlueDark,
  secondary:           colors.duoGreen,
  secondaryLight:      colors.duoGreenLight,
  warning:             colors.sunshineYellow,
  danger:              colors.danger,
  border:              colors.cloudGray,
  divider:             colors.cloudGray,
};

const ThemeContext = createContext({ theme });

export const ThemeProvider = ({ children }) => (
  <ThemeContext.Provider value={{ theme }}>{children}</ThemeContext.Provider>
);

export const useTheme = () => useContext(ThemeContext);
