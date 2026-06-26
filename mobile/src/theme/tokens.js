// Viral Stick Mobile — Design Tokens — Style Duo Blue
export const colors = {
  // ── Primary : Bleu Duo ─────────────────────
  duoBlue:       "#1cb0f6",
  duoBlueDark:   "#1899d6",
  duoBlueLight:  "#d0f0fd",

  // ── Success / validation ───────────────────
  duoGreen:      "#58cc02",
  duoGreenDark:  "#3f8f01",
  duoGreenLight: "#d7ffb8",

  // ── Accents illustration ───────────────────
  skyBlue:       "#1cb0f6",   // alias
  skyBlueDark:   "#1899d6",
  sunshineYellow:"#ffc700",
  grapeSoda:     "#a570ff",
  bubblegumPink: "#cc348d",

  // ── Neutrals ──────────────────────────────
  snowWhite:   "#ffffff",
  cloudGray:   "#e5e5e5",
  silver:      "#afafaf",
  graphite:    "#777777",
  charcoal:    "#4b4b4b",
  almostBlack: "#3c3c3c",

  // ── Semantic ──────────────────────────────
  bg:            "#ffffff",
  bgSecondary:   "#f7f7f7",
  border:        "#e5e5e5",
  text:          "#3c3c3c",
  textSecondary: "#4b4b4b",
  textMuted:     "#afafaf",
  success:       "#58cc02",
  warning:       "#ffc700",
  danger:        "#ee2a2a",

  // ── Compagnons ────────────────────────────
  arch: "#1cb0f6",   // bleu
  art:  "#ffc700",   // jaune
  bio:  "#a570ff",   // violet
  data: "#58cc02",   // vert
  para: "#ff9600",   // orange
  secu: "#cc348d",   // rose
  ubu:  "#ce82ff",   // lavande
};

export const spacing = {
  xs: 6, sm: 10, md: 16, lg: 24, xl: 32, xxl: 48,
};

export const borderRadius = {
  sm: 8, md: 12, lg: 16, xl: 20, pill: 999,
};

export const radius = borderRadius;

export const shadows = {
  card: { shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 3 },
  btn:  { shadowColor: "#1899d6", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 0, elevation: 0 },
};
