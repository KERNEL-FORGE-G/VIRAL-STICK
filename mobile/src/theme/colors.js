import { colors as sharedColors } from "./tokens";

export const colors = {
  primary: sharedColors.brandPrimary,
  primaryLight: "#A78BFA",
  primaryDark: "#5B21B6",
  secondary: sharedColors.brandSecondary,
  secondaryLight: "#67E8F9",
  accent1: sharedColors.bio,
  accent2: sharedColors.art,
  accent3: sharedColors.para,
  bg: sharedColors.background,
  bgCard: sharedColors.panel,
  bgCardHover: "rgba(255, 255, 255, 0.10)",
  text: sharedColors.text,
  textSecondary: sharedColors.textSecondary,
  textMuted: sharedColors.textMuted,
  border: sharedColors.border,
};

export const theme = {
  isDark: true,
  background: colors.bg,
  backgroundCard: colors.bgCard,
  backgroundSecondary: sharedColors.backgroundElevated,
  textPrimary: colors.text,
  textSecondary: colors.textSecondary,
  textMuted: colors.textMuted,
  textAccent: colors.primaryLight,
  primaryAction: colors.primary,
  secondaryAction: colors.secondary,
  primary: colors.primary,
  secondary: colors.secondary,
  secondaryLight: colors.secondaryLight,
  danger: sharedColors.danger,
  divider: "rgba(255,255,255,0.10)",
  border: colors.border,
};
