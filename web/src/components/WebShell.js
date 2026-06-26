/**
 * WebShell — Layout principal Viral Stick
 * Style Duolingo : fond blanc, nav verte, formes arrondies
 */
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { colors, radius, spacing } from "../theme/tokens";
import CompanionAvatarWeb from "./CompanionAvatarWeb";
import AppIcon from "./AppIcon";

const NAV = [
  ["/",           "Accueil",         "dashboard"],
  ["/context",    "Context Reader",  "context"],
  ["/remix",      "Remixer",         "remix"],
  ["/chat",       "Compagnons",      "chat"],
  ["/multi-chat", "Multi-Hub",       "multiChat"],
  ["/sticker-studio", "Sticker Studio", "remix"],
  ["/settings",   "Réglages",        "settings"],
  ["/about",      "À propos",        "about"],
];

const WebShell = ({ children, title, companion }) => {
  const { pathname } = useLocation();

  return (
    <div style={{ minHeight: "100vh", background: colors.bg, display: "flex", flexDirection: "column" }}>

      {/* ── HEADER ─────────────────────────────── */}
      <header style={{
        position: "sticky",
        top: 0,
        zIndex: 100,
        background: colors.snowWhite,
        borderBottom: `2px solid ${colors.cloudGray}`,
        padding: "0 24px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        height: 64,
        gap: 16,
      }}>
        {/* Logo */}
        <Link to="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none", flexShrink: 0 }}>
          <img src="/asset/logo/logo_sans_fond.png" alt="Viral Stick" style={{ width: 36, height: 36, objectFit: "contain" }} />
          <span style={{
            fontFamily: "'Fredoka One', cursive",
            fontSize: 22,
            color: colors.duoGreen,
            letterSpacing: 0.5,
            lineHeight: 1,
          }}>
            Viral Stick
          </span>
        </Link>

        {/* Nav */}
        <nav style={{ display: "flex", gap: 4, flex: 1, justifyContent: "center", flexWrap: "wrap" }}>
          {NAV.map(([to, label, icon]) => {
            const active = pathname === to;
            return (
              <Link
                key={to}
                to={to}
                className={`nav-item${active ? " active" : ""}`}
              >
                <AppIcon name={icon} size={16} color="currentColor" />
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Compagnon actif */}
        {companion && (
          <div style={{ flexShrink: 0 }}>
            <CompanionAvatarWeb companion={companion} size={36} ring={false} />
          </div>
        )}
      </header>

      {/* ── CONTENU ────────────────────────────── */}
      <main style={{ flex: 1, width: "100%", maxWidth: 1200, margin: "0 auto", padding: "32px 24px 80px" }}>
        {children}
      </main>

      {/* ── FOOTER ─────────────────────────────── */}
      <footer style={{
        borderTop: `2px solid ${colors.cloudGray}`,
        padding: "24px 32px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        fontSize: 13,
        color: colors.silver,
        fontWeight: 600,
      }}>
        <span style={{ color: colors.duoGreen, fontFamily: "'Fredoka One', cursive", fontSize: 16 }}>Viral Stick</span>
        <span>KERNEL FORGE — 2026</span>
      </footer>
    </div>
  );
};

export default WebShell;
