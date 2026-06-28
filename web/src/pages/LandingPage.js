import React from "react";
import { Link } from "react-router-dom";
import CompanionAvatarWeb from "../components/CompanionAvatarWeb";
import WebShell from "../components/WebShell";
import PremiumButton from "../components/PremiumButton";
import AppIcon from "../components/AppIcon";
import { colors, radius, spacing } from "../theme/tokens";

const FEATURES = [
  {
    title: "Context Reader",
    desc: "Analyse le contexte culturel et génère un mème adapté à ton audience en un clic.",
    companion: "art",
    to: "/context",
    accent: colors.art,
    icon: "context",
  },
  {
    title: "Status Remixer",
    desc: "Transforme n'importe quel texte ou image en contenu viral prêt à partager.",
    companion: "bio",
    to: "/remix",
    accent: colors.bio,
    icon: "remix",
  },
  {
    title: "Chat Compagnons",
    desc: "Discute avec tes compagnons IA spécialisés pour booster ta créativité.",
    companion: "ubu",
    to: "/chat",
    accent: colors.ubu,
    icon: "chat",
  },
];

const LandingPage = () => {
  return (
    <WebShell companion="arch">
      {/* HERO SECTION */}
      <section style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 48,
        alignItems: "center",
        padding: "60px 0 80px",
      }}>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <div style={{ width: 600, height: 600, animation: "floatSoft 4s ease-in-out infinite" }}>
            <img src="/asset/logo/logo.png" alt="Logo" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <h1 style={{ fontFamily: "'Fredoka One', cursive", fontSize: 52, color: colors.almostBlack, lineHeight: 1.1 }}>
            Générez des mèmes <span style={{ color: colors.duoGreen }}>viraux</span> en un éclair
          </h1>
          <p style={{ fontSize: 18, color: colors.graphite, lineHeight: 1.6, maxWidth: 500 }}>
            L'IA qui comprend votre culture et transforme vos idées en contenu prêt pour WhatsApp et les réseaux sociaux.
          </p>
          <div style={{ display: "flex", gap: 16 }}>
            <Link to="/context"><PremiumButton variant="primary">Essayer maintenant</PremiumButton></Link>
            <Link to="/video"><PremiumButton variant="ghost">Voir la démo</PremiumButton></Link>
          </div>
        </div>
      </section>

      {/* SESSION VIDÉO HIGHLIGHT */}
      <section style={{
        background: colors.duoGreenLight,
        borderRadius: radius.xl,
        padding: "60px 40px",
        marginBottom: 80,
        textAlign: "center",
        border: `2px solid ${colors.duoGreen}33`
      }}>
        <h2 style={{ fontFamily: "'Fredoka One', cursive", fontSize: 32, marginBottom: 16 }}>Session Démo Live</h2>
        <p style={{ fontSize: 16, color: colors.charcoal, marginBottom: 32, maxWidth: 600, marginLeft: "auto", marginRight: "auto" }}>
          Regardez comment Viral Stick transforme une simple idée en un mème explosif.
        </p>
        <div style={{
          maxWidth: 700,
          margin: "0 auto",
          borderRadius: radius.lg,
          overflow: "hidden",
          boxShadow: `0 10px 0 0 ${colors.duoGreen}44`,
          border: `4px solid #fff`,
          background: "#000"
        }}>
          <video
            src="/video/whatsapp-video-2026-06-28-at-135933_ZNbdb5i5.mp4"
            controls
            style={{ width: "100%", display: "block" }}
          />
        </div>
      </section>

      {/* FEATURES GRID */}
      <section style={{ marginBottom: 80 }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
          {FEATURES.map((f) => (
            <Link key={f.to} to={f.to} style={{ textDecoration: "none" }}>
              <div className="duo-card" style={{ padding: 32, textAlign: "center", height: "100%" }}>
                <CompanionAvatarWeb companion={f.companion} size={80} floating />
                <h3 style={{ fontFamily: "'Fredoka One', cursive", fontSize: 20, marginTop: 20, marginBottom: 10 }}>{f.title}</h3>
                <p style={{ fontSize: 14, color: colors.graphite }}>{f.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </WebShell>
  );
};

export default LandingPage;
