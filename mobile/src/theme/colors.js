/**
 * Viral Stick — Design System Colors
 * KERNEL FORGE — 2026
 *
 * Dark theme: deep space purple/navy base with vivid neon accents
 * Light theme: clean white/lavender with electric purple & cyan accents
 */

export const darkTheme = {
  // Backgrounds
  background: '#0A0A1A',
  backgroundSecondary: '#12122A',
  backgroundCard: 'rgba(30, 30, 60, 0.6)',
  backgroundGlass: 'rgba(20, 20, 50, 0.45)',

  // Accents / Brand
  primary: '#7C3AED',       // Electric violet
  primaryLight: '#A78BFA',
  secondary: '#06B6D4',     // Neon cyan
  secondaryLight: '#67E8F9',
  accent: '#F59E0B',        // Amber for highlights
  danger: '#EF4444',
  success: '#10B981',

  // Text
  textPrimary: '#F3F4F6',
  textSecondary: '#A1A1B3',
  textMuted: '#6B7280',
  textOnAccent: '#FFFFFF',

  // Gradients (used as array for LinearGradient)
  gradientPrimary: ['#7C3AED', '#3B82F6'],
  gradientSecondary: ['#06B6D4', '#7C3AED'],
  gradientCard: ['rgba(124,58,237,0.3)', 'rgba(6,182,212,0.1)'],
  gradientDark: ['#0A0A1A', '#12122A'],

  // Borders & dividers
  border: 'rgba(124, 58, 237, 0.25)',
  borderLight: 'rgba(167, 139, 250, 0.15)',
  divider: 'rgba(255,255,255,0.06)',

  // Shadows
  shadowColor: '#7C3AED',

  // Glassmorphism
  glassBackground: 'rgba(255,255,255,0.05)',
  glassBorder: 'rgba(255,255,255,0.12)',

  // Companions accent colors
  arch: '#7C3AED',
  para: '#06B6D4',
  secu: '#EF4444',
  data: '#10B981',
  bio: '#F59E0B',
  ubu: '#EC4899',
  art: '#8B5CF6',

  isDark: true,
};

export const lightTheme = {
  // Backgrounds
  background: '#F5F3FF',
  backgroundSecondary: '#EDE9FE',
  backgroundCard: 'rgba(255,255,255,0.85)',
  backgroundGlass: 'rgba(255,255,255,0.6)',

  // Accents / Brand
  primary: '#7C3AED',
  primaryLight: '#A78BFA',
  secondary: '#0891B2',
  secondaryLight: '#22D3EE',
  accent: '#D97706',
  danger: '#DC2626',
  success: '#059669',

  // Text
  textPrimary: '#1E1B4B',
  textSecondary: '#4B5563',
  textMuted: '#9CA3AF',
  textOnAccent: '#FFFFFF',

  // Gradients
  gradientPrimary: ['#7C3AED', '#3B82F6'],
  gradientSecondary: ['#0891B2', '#7C3AED'],
  gradientCard: ['rgba(124,58,237,0.08)', 'rgba(6,182,212,0.04)'],
  gradientDark: ['#F5F3FF', '#EDE9FE'],

  // Borders & dividers
  border: 'rgba(124, 58, 237, 0.2)',
  borderLight: 'rgba(124, 58, 237, 0.1)',
  divider: 'rgba(0,0,0,0.06)',

  // Shadows
  shadowColor: '#7C3AED',

  // Glassmorphism
  glassBackground: 'rgba(255,255,255,0.7)',
  glassBorder: 'rgba(124,58,237,0.18)',

  // Companions accent colors
  arch: '#7C3AED',
  para: '#0891B2',
  secu: '#DC2626',
  data: '#059669',
  bio: '#D97706',
  ubu: '#DB2777',
  art: '#7C3AED',

  isDark: false,
};
