/**
 * LandingPage — Style Duolingo
 * Hero asymétrique : grand compagnon arch à gauche, titre + CTA à droite
 * Section features 3 colonnes, section compagnons grid
 */
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
      {/* ── HERO ASYMÉTRIQUE ─────────────────────────── */}
      <section style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 48,
        alignItems: "center",
        padding: "60px 0 80px",
        marginBottom: 8,
      }}>
        {/* Colonne gauche — Grand Logo */}
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

        {/* Colonne droite — Titre + CTA */}
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
            <Link to="/about">
              <PremiumButton variant="ghost">
                En savoir plus
              </PremiumButton>
            </Link>
          </div>

          {/* Stats rapides */}
          <div style={{ display: "flex", gap: 32, marginTop: 16 }}>
            {[
              ["7", "compagnons IA"],
              ["3", "outils créatifs"],
              ["∞", "idées virales"],
            ].map(([val, label]) => (
              <div key={label}>
                <div style={{
                  fontFamily: "'Fredoka One', cursive",
                  fontSize: 28,
                  color: colors.duoGreen,
                  lineHeight: 1,
                }}>
                  {val}
                </div>
                <div style={{
                  fontFamily: "'Nunito', sans-serif",
                  fontSize: 13,
                  color: colors.silver,
                  fontWeight: 600,
                  marginTop: 2,
                }}>
                  {label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES 3 COLONNES ──────────────────────── */}
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
          <p style={{
            fontFamily: "'Nunito', sans-serif",
            fontSize: 16,
            color: colors.graphite,
            margin: 0,
          }}>
            Trois outils puissants, un seul objectif : créer du contenu viral.
          </p>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
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
                  transition: "transform 0.15s ease, box-shadow 0.15s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-3px)";
                  e.currentTarget.style.boxShadow = "0 6px 0 0 #d0d0d0";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 2px 0 0 #e5e5e5";
                }}
              >
                {/* Icône compagnon */}
                <div style={{ display: "flex", justifyContent: "center" }}>
                  <CompanionAvatarWeb companion={f.companion} size={96} floating />
                </div>

                {/* Contenu */}
                <div style={{ textAlign: "center" }}>
                  <h3 style={{
                    fontFamily: "'Fredoka One', cursive",
                    fontSize: 22,
                    color: colors.almostBlack,
                    margin: "0 0 10px",
                  }}>
                    {f.title}
                  </h3>
                  <p style={{
                    fontFamily: "'Nunito', sans-serif",
                    fontSize: 15,
                    color: colors.graphite,
                    lineHeight: 1.5,
                    margin: 0,
                  }}>
                    {f.desc}
                  </p>
                </div>

                {/* CTA */}
                <div style={{
                  marginTop: "auto",
                  display: "flex",
                  justifyContent: "center",
                }}>
                  <span style={{
                    fontFamily: "'Nunito', sans-serif",
                    fontWeight: 800,
                    fontSize: 14,
                    color: f.accent,
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                  }}>
                    <AppIcon name={f.icon} size={16} color={f.accent} />
                    Utiliser cet outil →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── SECTION COMPAGNONS GRID ───────────────────── */}
      <section style={{
        background: colors.bgSecondary,
        borderRadius: radius.xl,
        border: `2px solid ${colors.cloudGray}`,
        padding: "60px 48px",
        marginBottom: 80,
      }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <h2 style={{
            fontFamily: "'Fredoka One', cursive",
            fontSize: 36,
            color: colors.almostBlack,
            margin: "0 0 12px",
          }}>
            Rencontre l'équipe
          </h2>
          <p style={{
            fontFamily: "'Nunito', sans-serif",
            fontSize: 16,
            color: colors.graphite,
            margin: 0,
          }}>
            7 compagnons IA, chacun avec sa personnalité et sa spécialité.
          </p>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(7, 1fr)",
          gap: 16,
        }}>
          {COMPANIONS_INFO.map((c) => (
            <div
              key={c.id}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 10,
                padding: 16,
                background: "#ffffff",
                borderRadius: radius.lg,
                border: `2px solid ${colors.cloudGray}`,
                boxShadow: "0 2px 0 #e5e5e5",
                transition: "transform 0.15s ease",
                cursor: "default",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-4px)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; }}
            >
              <CompanionAvatarWeb companion={c.id} size={64} />
              <div style={{
                fontFamily: "'Fredoka One', cursive",
                fontSize: 14,
                color: colors.almostBlack,
                textAlign: "center",
                lineHeight: 1.2,
              }}>
                {c.name}
              </div>
              <div style={{
                fontFamily: "'Nunito', sans-serif",
                fontSize: 11,
                color: colors.silver,
                fontWeight: 700,
                textAlign: "center",
                lineHeight: 1.3,
              }}>
                {c.role}
              </div>
            </div>
          ))}
        </div>

        <div style={{ textAlign: "center", marginTop: 40 }}>
          <Link to="/chat">
            <PremiumButton variant="primary" icon={<AppIcon name="chat" size={18} color="#fff" />}>
              Parler aux compagnons
            </PremiumButton>
          </Link>
        </div>
      </section>

      {/* ── SECTION CTA FINAL ────────────────────────── */}
      <section style={{
        textAlign: "center",
        padding: "60px 32px 80px",
        background: colors.duoGreenLight,
        borderRadius: radius.xl,
        border: `2px solid ${colors.duoGreen}44`,
        marginBottom: 40,
      }}>
        <div style={{ animation: "floatSoft 3s ease-in-out infinite", display: "inline-block", marginBottom: 24 }}>
          <CompanionAvatarWeb companion="arch" size={100} />
        </div>
        <h2 style={{
          fontFamily: "'Fredoka One', cursive",
          fontSize: 40,
          color: colors.almostBlack,
          margin: "0 0 16px",
        }}>
          Prêt à créer ?
        </h2>
        <p style={{
          fontFamily: "'Nunito', sans-serif",
          fontSize: 18,
          color: colors.charcoal,
          margin: "0 0 32px",
          maxWidth: 480,
          marginLeft: "auto",
          marginRight: "auto",
          lineHeight: 1.6,
        }}>
          Lance le Context Reader et génère ton premier mème viral en moins de 30 secondes.
        </p>
        <Link to="/context">
          <PremiumButton variant="primary" style={{ fontSize: 17, padding: "14px 36px" }}>
            C'est parti ! 🚀
          </PremiumButton>
        </Link>
      </section>
    </WebShell>
  );
};

export default LandingPage;
