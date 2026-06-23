import React from "react";
import { Link } from "react-router-dom";
import CompanionAvatarWeb from "../components/CompanionAvatarWeb";
import WebShell, { pageStyles } from "../components/WebShell";
import { colors, gradients, radius } from "../theme/tokens";

const FEATURES = [
  {
    title: "Context Reader",
    desc: "Analyse un texte, repère le vrai twist comique et fabrique une structure de mème claire, locale et partageable.",
    companion: "art",
    accent: colors.art,
    to: "/context",
  },
  {
    title: "Voice → Mème",
    desc: "Transforme une parole ou une transcription en punchline nette, vivante et visuelle avec l'énergie d'Ubu.",
    companion: "ubu",
    accent: colors.ubu,
    to: "/chat",
  },
  {
    title: "Status Remixer",
    desc: "Donne du relief à une scène ou une image avec une légende plus premium, plus virale et plus design.",
    companion: "bio",
    accent: colors.bio,
    to: "/remix",
  },
];

const COMPANIONS = ["arch", "data", "para", "secu", "bio", "ubu", "art"];

const LandingPage = () => {
  return (
    <WebShell title="Accueil" companion="arch">
      <section
        style={{
          ...pageStyles.panel,
          padding: 32,
          display: "grid",
          gridTemplateColumns: "1.25fr 0.95fr",
          gap: 28,
          alignItems: "center",
          background: `linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0.02)), ${colors.panel}`,
        }}
      >
        <div>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
              padding: "8px 14px",
              borderRadius: 999,
              background: gradients.brandSoft,
              border: `1px solid ${colors.border}`,
              color: colors.textSecondary,
              fontWeight: 700,
              marginBottom: 18,
            }}
          >
            <span>⚡</span>
            <span>
              Logo fort · compagnons vivants · esthétique néon premium
            </span>
          </div>

          <h1 style={pageStyles.heroTitle}>
            Crée des mèmes qui{" "}
            <span style={pageStyles.gradientText}>ont une vraie identité</span>
          </h1>

          <p
            style={{
              fontSize: 18,
              lineHeight: 1.7,
              color: colors.textSecondary,
              maxWidth: 760,
              marginTop: 18,
              marginBottom: 28,
            }}
          >
            Viral Stick mélange une direction artistique inspirée du logo, une
            escouade de compagnons illustrés et un moteur de prompts plus
            exigeant pour produire des mèmes plus nets, plus drôles et plus
            mémorables.
          </p>

          <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
            <Link to="/context" style={pageStyles.buttonPrimary}>
              Commencer avec Context Reader
            </Link>
            <Link to="/chat" style={pageStyles.buttonGhost}>
              Parler aux compagnons
            </Link>
          </div>
        </div>

        <div
          style={{
            ...pageStyles.softPanel,
            padding: 24,
            display: "grid",
            placeItems: "center",
            minHeight: 420,
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: "10% 12% auto 12%",
              height: 220,
              borderRadius: 999,
              background: gradients.brandSoft,
              filter: "blur(28px)",
            }}
          />
          <img
            src="/asset/logo/logo_sans_fond.png"
            alt="Viral Stick Logo"
            style={{
              width: 260,
              height: 260,
              objectFit: "contain",
              position: "relative",
              zIndex: 1,
            }}
          />
          <div
            style={{
              display: "flex",
              gap: 12,
              flexWrap: "wrap",
              justifyContent: "center",
              position: "relative",
              zIndex: 1,
            }}
          >
            <CompanionAvatarWeb companion="bio" size={92} />
            <CompanionAvatarWeb companion="ubu" size={92} />
            <CompanionAvatarWeb companion="art" size={92} />
          </div>
        </div>
      </section>

      <section style={{ marginTop: 28 }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: 18,
          }}
        >
          {FEATURES.map((feature) => (
            <Link
              key={feature.title}
              to={feature.to}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <div style={{ ...pageStyles.panel, padding: 24, minHeight: 260 }}>
                <div
                  style={{
                    width: 54,
                    height: 54,
                    borderRadius: radius.md,
                    background: `${feature.accent}22`,
                    border: `1px solid ${feature.accent}55`,
                    marginBottom: 18,
                  }}
                />
                <h3 style={{ margin: 0, fontSize: 24 }}>{feature.title}</h3>
                <p style={{ color: colors.textSecondary, lineHeight: 1.7 }}>
                  {feature.desc}
                </p>
                <div style={{ marginTop: 16 }}>
                  <CompanionAvatarWeb companion={feature.companion} size={86} />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section style={{ marginTop: 28 }}>
        <div style={{ ...pageStyles.panel, padding: 28 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 20,
              flexWrap: "wrap",
              marginBottom: 20,
            }}
          >
            <div>
              <h2 style={{ margin: 0, fontSize: 34 }}>
                Les 7 compagnons du noyau Viral Stick
              </h2>
              <p style={{ color: colors.textSecondary, marginTop: 10 }}>
                Chacun porte une couleur, un ton et une fonction alignés avec
                l'univers du logo.
              </p>
            </div>
            <Link to="/multi-chat" style={pageStyles.buttonGhost}>
              Lancer le multi-chat
            </Link>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
              gap: 18,
            }}
          >
            {COMPANIONS.map((id) => (
              <div
                key={id}
                style={{
                  ...pageStyles.softPanel,
                  padding: 18,
                  textAlign: "center",
                }}
              >
                <CompanionAvatarWeb companion={id} size={96} />
                <div
                  style={{
                    marginTop: 12,
                    fontWeight: 800,
                    textTransform: "uppercase",
                  }}
                >
                  {id}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </WebShell>
  );
};

export default LandingPage;
