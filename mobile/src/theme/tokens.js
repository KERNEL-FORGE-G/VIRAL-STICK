// Viral Stick Mobile — Design Tokens — Duolingo Style
export const colors = {
  // ── Duolingo Core Colors ──────────────────
  brandPrimary: "#58cc02",
  brandPrimaryDark: "#3f8f01",
  brandPrimaryLight: "#d7ffb8",
  brandSecondary: "#1cb0f6",
  brandSecondaryDark: "#1899d6",

  // ── Accent Colors for Illustrations ───────
  sunshineYellow: "#ffc700",
  grapeSoda: "#a570ff",
  bubblegumPink: "#cc348d",

  // ── Neutrals (Light Theme) ────────────────
  snowWhite:   "#ffffff",
  cloudGray:   "#e5e5e5",
  silver:      "#afafaf",
  graphite:    "#777777",
  charcoal:    "#4b4b4b",
  almostBlack: "#3c3c3c",

  // ── Semantic ───────────────────────────────
  bg:            "#ffffff",
  bgSecondary:   "#ffffff",
  backgroundElevated: "#ffffff",
  border:        "#e5e5e5",
  text:          "#3c3c3c",
  textSecondary: "#4b4b4b",
  textMuted:     "#777777",
  textPlaceholder: "#afafaf",
  success:       "#58cc02",
  warning:       "#ffc700",
  danger:        "#ef4444",
  
  // ── Compagnons ─────────────────────────────
  arch: "#1cb0f6",
  art:  "#ffc700",
  bio:  "#a570ff",
  data: "#58cc02",
  para: "#ff9600",
  secu: "#cc348d",
  ubu:  "#ce82ff",
};

export const spacing = {
  xs: 8, sm: 12, md: 16, lg: 24, xl: 32, xxl: 48,
};

export const borderRadius = {
  sm: 8, md: 12, lg: 16, pill: 999,
  cards: 12, inputs: 12, buttons: 12,
};

export const radius = borderRadius;

export const shadows = {
  card: { shadowColor: "#e5e5e5", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 1, shadowRadius: 0, elevation: 1 },
  btn: { shadowColor: "#3f8f01", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 1, shadowRadius: 0, elevation: 2 },
};
