/**
 * Viral Stick — Design Tokens — Duolingo Style
 */

export const colors = {
  // ── Duolingo Core Colors ──────────────────
  duoGreen:       "#58cc02",
  duoGreenDark:   "#3f8f01",
  duoGreenLight:  "#d7ffb8",
  skyBlue:        "#1cb0f6",
  skyBlueDark:    "#1899d6",
  sunshineYellow: "#ffc700",
  grapeSoda:      "#a570ff",
  bubblegumPink:  "#cc348d",

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
  panel:         "#ffffff",
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
  unit: 4,
  xs:   8,
  sm:   12,
  md:   16,
  lg:   24,
  xl:   32,
  xxl:  48,
  xxxl: 64,
  section: 80,
};

export const radius = {
  sm:   8,
  md:   12,
  lg:   16,
  xl:   20,
  xxl:  24,
  pill: 9999,
  cards: 12,
  inputs: 12,
  buttons: 12,
};

export const shadows = {
  btnPrimary:   "0 4px 0 #3f8f01",
  btnBlue:      "0 4px 0 #1899d6",
  btnGray:      "0 4px 0 #b5b5b5",
  card:         "0 2px 0 0 #e5e5e5",
  cardHover:    "0 4px 0 0 #d0d0d0",
};

export const typography = {
  display: { fontSize: 64, lineHeight: 1.2, letterSpacing: -1.28, weight: "700" },
  headingLg: { fontSize: 48, lineHeight: 1.2, letterSpacing: -0.96, weight: "700" },
  heading: { fontSize: 32, lineHeight: 1.2, letterSpacing: 1.7, weight: "700" },
  headingSm: { fontSize: 19, lineHeight: 1.2, letterSpacing: 1.01, weight: "700" },
  body: { fontSize: 15, lineHeight: 1.4, letterSpacing: 0.8, weight: "500" },
  caption: { fontSize: 13, lineHeight: 1.4, letterSpacing: 0.69, weight: "500" },
};
