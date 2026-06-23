/**
 * Viral Stick — Design System Colors
 * Unified for Mobile and Web
 */

export const colors = {
  primary: '#7c3aed',
  primaryLight: '#a78bfa',
  primaryDark: '#5b21b6',
  secondary: '#3b82f6',
  accent1: '#06b6d4',
  accent2: '#f59e0b',
  accent3: '#ef4444',
  bg: '#0a0a1a',
  bgCard: 'rgba(255, 255, 255, 0.04)',
  bgCardHover: 'rgba(255, 255, 255, 0.08)',
  text: '#f3f4f6',
  textSecondary: 'rgba(255, 255, 255, 0.6)',
  textMuted: 'rgba(255, 255, 255, 0.35)',
  border: 'rgba(255, 255, 255, 0.08)',
};

export const theme = {
  // Surfaces & Backgrounds
  background: colors.bg,
  backgroundCard: colors.bgCard,
  backgroundSecondary: 'rgba(255, 255, 255, 0.08)', // Add this
  
  // Text
  textPrimary: colors.text,
  textSecondary: colors.textSecondary,
  textMuted: colors.textMuted,
  textAccent: colors.primaryLight,
  primaryLight: colors.primaryLight, // Add this
  
  // Accents / Actions
  primaryAction: colors.primary,
  secondaryAction: colors.secondary,
  primary: colors.primary, // Add this for consistency

  // Borders
  border: colors.border,
};
