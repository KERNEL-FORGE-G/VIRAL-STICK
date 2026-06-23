import React from "react";
import { Link } from "react-router-dom";
import { colors, gradients, radius, shadows } from "../theme/tokens";
import CompanionAvatarWeb from "./CompanionAvatarWeb";
import AppIcon from "./AppIcon";

const NAV = [
  ["/", "Accueil", "dashboard"],
  ["/context", "Context Reader", "context"],
  ["/remix", "Status Remixer", "remix"],
  ["/chat", "Compagnons", "chat"],
  ["/multi-chat", "Multi-Chat", "multiChat"],
  ["/about", "À propos", "about"],
  ["/settings", "Paramètres", "settings"],
];

export const pageStyles = {
  page: {
    minHeight: "100vh",
    background: gradients.page,
    color: colors.text,
  },
  header: {
    position: "sticky",
    top: 0,
    zIndex: 20,
    backdropFilter: "blur(22px)",
    background: "rgba(13, 13, 13, 0.82)",
    borderBottom: `1px solid ${colors.border}`,
    boxShadow: shadows.lift,
  },
  headerInner: {
    maxWidth: 1280,
    margin: "0 auto",
    padding: "16px 24px",
    display: "flex",
    gap: 18,
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: "wrap",
  },
  shell: {
    maxWidth: 1280,
    margin: "0 auto",
    padding: "36px 24px 80px",
  },
  panel: {
    position: "relative",
    background: colors.panel,
    border: `1px solid ${colors.border}`,
    borderRadius: radius.lg,
    boxShadow: shadows.card,
    overflow: "hidden",
    transformStyle: "preserve-3d",
  },
  softPanel: {
    background: colors.panelSoft,
    border: `1px solid ${colors.border}`,
    borderRadius: radius.md,
    boxShadow: shadows.lift,
    backdropFilter: "blur(20px)",
  },
  heroTitle: {
    fontSize: "clamp(2.5rem, 4vw, 4.8rem)",
    lineHeight: 1,
    fontWeight: 900,
    letterSpacing: "-0.05em",
    margin: 0,
  },
  gradientText: {
    background: gradients.brand,
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
  buttonPrimary: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    padding: "14px 22px",
    borderRadius: radius.pill,
    background: gradients.brand,
    color: colors.white,
    textDecoration: "none",
    border: "none",
    fontWeight: 800,
    boxShadow: shadows.glow,
    cursor: "pointer",
  },
  buttonGhost: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    padding: "14px 22px",
    borderRadius: radius.pill,
    background: "rgba(255,255,255,0.04)",
    color: colors.text,
    textDecoration: "none",
    border: `1px solid ${colors.border}`,
    fontWeight: 700,
    cursor: "pointer",
  },
  input: {
    width: "100%",
    padding: "16px 18px",
    borderRadius: radius.md,
    border: `1px solid ${colors.border}`,
    background: "rgba(255,255,255,0.04)",
    color: colors.text,
    outline: "none",
  },
  textarea: {
    width: "100%",
    minHeight: 160,
    padding: "18px 18px",
    borderRadius: radius.md,
    border: `1px solid ${colors.border}`,
    background: "rgba(255,255,255,0.04)",
    color: colors.text,
    outline: "none",
    resize: "vertical",
  },
};

export const BrandHeader = ({ title, companion }) => (
  <header style={pageStyles.header}>
    <div style={pageStyles.headerInner}>
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <div
          style={{
            width: 72,
            height: 72,
            display: "grid",
            placeItems: "center",
            boxShadow: shadows.glow,
            animation: "orbitalTilt 10s ease-in-out infinite",
          }}
        >
          <img
            src="/asset/logo/logo_sans_fond.png"
            alt="Viral Stick"
            style={{
              width: 68,
              height: 68,
              objectFit: "contain",
              filter: "drop-shadow(0 12px 24px rgba(232,73,15,0.28))",
            }}
          />
        </div>
        <div>
          <div
            style={{ fontWeight: 900, letterSpacing: "-0.03em", fontSize: 20 }}
          >
            Viral Stick
          </div>
          <div style={{ color: colors.textMuted, fontSize: 13 }}>
            Studio de génération et d’édition de mèmes texte + image
          </div>
        </div>
      </div>

      <nav style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {NAV.map(([to, label, icon]) => (
          <Link
            key={to}
            to={to}
            style={{
              padding: "10px 14px",
              borderRadius: radius.pill,
              textDecoration: "none",
              color: colors.textSecondary,
              background: "rgba(255,255,255,0.05)",
              border: `1px solid ${colors.border}`,
              fontSize: 14,
              fontWeight: 700,
              boxShadow: shadows.lift,
              backdropFilter: "blur(16px)",
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <AppIcon name={icon} size={16} color={colors.textSecondary} />
            {label}
          </Link>
        ))}
      </nav>

      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        {companion ? (
          <CompanionAvatarWeb companion={companion} size={64} />
        ) : null}
        <div style={{ fontWeight: 800 }}>{title}</div>
      </div>
    </div>
  </header>
);

const WebShell = ({ title, companion, children }) => {
  return (
    <div style={pageStyles.page}>
      <BrandHeader title={title} companion={companion} />
      <main style={pageStyles.shell}>{children}</main>
    </div>
  );
};

export default WebShell;
