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
    title: "Session Vidéo",
    desc: "Regardez la démonstration complète de Viral Stick en action.",
    companion: "para",
    to: "/video",
    accent: colors.skyBlue,
    icon: "context",
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

const COMPANIONS_INFO = [
  { id: "arch", name: "Archlord", role: "Direction produit" },
  { id: "art",  name: "Art",      role: "Direction artistique" },
  { id: "bio",  name: "Bio",      role: "Énergie visuelle" },
  { id: "data", name: "Data",     role: "Analyse & structure" },
  { id: "para", name: "Para",     role: "Clarté & onboarding" },
  { id: "secu", name: "Secu",     role: "Sécurité & vigilance" },
  { id: "ubu",  name: "Ubu",      role: "Humour & imprévu" },
];

const LandingPage = () => {
  return (
    <WebShell companion="arch">
      <section style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 48,
        alignItems: "center",
        padding: "60px 0 80px",
        marginBottom: 8,
      }}>
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
          <div style={{
            width: 680,
            height: 680,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            animation: "floatSoft 4s ease-in-out infinite",
          }}>
            <img
              src="/asset/logo/logo.png"
              alt="Viral Stick"
              style={{ width: "100%", height: "100%", objectFit: "contain" }}
            />
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            background: colors.duoGreenLight,
            color: colors.duoGreenDark,
            padding: "6px 14px",
            borderRadius: radius.pill,
            fontSize: 13,
            fontWeight: 800,
            width: "fit-content",
          }}>
            <span>✨</span> Créez du contenu viral avec l'IA
          </div>

          <h1 style={{
            fontFamily: "'Fredoka One', cursive",
            fontSize: "clamp(36px, 5vw, 56px)",
            lineHeight: 1.15,
            color: colors.almostBlack,
            margin: 0,
          }}>
            Générez des mèmes{" "}
            <span style={{ color: colors.duoGreen }}>viraux</span>{" "}
            en quelques secondes
          </h1>

          <p style={{
            fontFamily: "'Nunito', sans-serif",
            fontSize: 18,
            color: colors.graphite,
            lineHeight: 1.6,
            margin: 0,
            maxWidth: 480,
          }}>
            Viral Stick combine des compagnons IA spécialisés et des outils de création
            pour transformer n'importe quelle idée en contenu prêt à l'emploi.
          </p>

          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 8 }}>
            <Link to="/context">
              <PremiumButton variant="primary" icon={<AppIcon name="context" size={18} color="#fff" />}>
                Commencer gratuitement
              </PremiumButton>
            </Link>
            <Link to="/video">
              <PremiumButton variant="ghost">
                Voir la démo vidéo
              </PremiumButton>
            </Link>
          </div>
        </div>
      </section>

      <section style={{ marginBottom: 80 }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <h2 style={{
            fontFamily: "'Fredoka One', cursive",
            fontSize: 36,
            color: colors.almostBlack,
            margin: "0 0 12px",
          }}>
            Tout ce dont tu as besoin
          </h2>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: 24,
        }}>
          {FEATURES.map((f) => (
            <Link key={f.to} to={f.to} style={{ textDecoration: "none" }}>
              <div
                className="duo-card"
                style={{
                  padding: 32,
                  display: "flex",
                  flexDirection: "column",
                  gap: 20,
                  height: "100%",
                  cursor: "pointer",
                  transition: "transform 0.15s ease",
                }}
              >
                <div style={{ display: "flex", justifyContent: "center" }}>
                  <CompanionAvatarWeb companion={f.companion} size={96} floating />
                </div>
                <div style={{ textAlign: "center" }}>
                  <h3 style={{ fontFamily: "'Fredoka One', cursive", fontSize: 22, color: colors.almostBlack, margin: "0 0 10px" }}>
                    {f.title}
                  </h3>
                  <p style={{ fontFamily: "'Nunito', sans-serif", fontSize: 15, color: colors.graphite, lineHeight: 1.5, margin: 0 }}>
                    {f.desc}
                  </p>
                </div>
                <div style={{ marginTop: "auto", display: "flex", justifyContent: "center" }}>
                  <span style={{ fontWeight: 800, fontSize: 14, color: f.accent, display: "flex", alignItems: "center", gap: 6 }}>
                    Explorer →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </WebShell>
  );
};

export default LandingPage;
