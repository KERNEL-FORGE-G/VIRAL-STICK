import React from "react";
import { Link } from "react-router-dom";
import CompanionAvatarWeb from "../components/CompanionAvatarWeb";
import WebShell, { pageStyles } from "../components/WebShell";
import { colors, gradients, radius } from "../theme/tokens";

const FEATURES = [
  {
    title: "Context Reader",
    desc: "Analyse une situation, une conversation ou une anecdote et construit un mème plus net, plus drôle et plus partageable.",
    companion: "art",
    accent: colors.art,
    to: "/context",
  },
  {
    title: "Voice → Mème",
    desc: "Convertit une idée parlée ou une transcription en punchline propre, absurde, énergique ou ultra-relatable.",
    companion: "ubu",
    accent: colors.ubu,
    to: "/chat",
  },
  {
    title: "Status Remixer",
    desc: "Ajoute une vraie direction artistique à un visuel ou à une idée de sticker pour un rendu plus premium et viral.",
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
          padding: 38,
          overflow: "hidden",
          position: "relative",
          backdropFilter: "blur(24px)",
          animation: "orbitalTilt 14s ease-in-out infinite",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -120,
            right: -80,
            width: 360,
            height: 360,
            borderRadius: 999,
            background: gradients.brandSoft,
            filter: "blur(30px)",
            opacity: 0.95,
          }}
        />

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.05fr 0.95fr",
            gap: 36,
            alignItems: "center",
            position: "relative",
            zIndex: 1,
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
                Refonte orientée produit, branding, génération texte + image
              </span>
            </div>

            <h1 style={{ ...pageStyles.heroTitle, maxWidth: 760 }}>
              Le studio de mèmes où{" "}
              <span style={pageStyles.gradientText}>
                le logo devient le noyau de l’expérience
              </span>
            </h1>

            <p
              style={{
                fontSize: 18,
                lineHeight: 1.8,
                color: colors.textSecondary,
                maxWidth: 760,
                marginTop: 20,
                marginBottom: 28,
              }}
            >
              Viral Stick n’est pas juste un générateur. C’est une interface de
              création et d’édition de mèmes texte + image, pensée comme un
              produit créatif complet : identité forte, compagnons incarnés,
              moteur IA multi-provider et surfaces premium pour transformer une
              idée brute en contenu viral.
            </p>

            <div
              style={{
                display: "flex",
                gap: 14,
                flexWrap: "wrap",
                marginBottom: 24,
              }}
            >
              <Link to="/context" style={pageStyles.buttonPrimary}>
                Lancer une génération texte
              </Link>
              <Link to="/remix" style={pageStyles.buttonGhost}>
                Explorer le remix image
              </Link>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                gap: 12,
                maxWidth: 760,
              }}
            >
              {[
                ["3 modules cœur", "texte, voix, image"],
                ["7 compagnons", "identité et rôles distincts"],
                ["IA multi-provider", "Gemini · Mistral · DeepSeek"],
              ].map(([title, desc], index) => (
                <div
                  key={title}
                  style={{
                    ...pageStyles.softPanel,
                    padding: 16,
                    animation: `levitateCard ${8 + index}s ease-in-out infinite`,
                  }}
                >
                  <div style={{ fontWeight: 800, marginBottom: 6 }}>
                    {title}
                  </div>
                  <div style={{ color: colors.textMuted, fontSize: 14 }}>
                    {desc}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div
            style={{
              ...pageStyles.softPanel,
              minHeight: 540,
              padding: 28,
              display: "grid",
              placeItems: "center",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                position: "absolute",
                width: 420,
                height: 420,
                borderRadius: 999,
                background: gradients.brand,
                opacity: 0.18,
                filter: "blur(40px)",
              }}
            />

            <div
              style={{
                position: "relative",
                zIndex: 1,
                width: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 18,
              }}
            >
              <div
                style={{
                  width: 360,
                  height: 360,
                  display: "grid",
                  placeItems: "center",
                  boxShadow: `0 34px 90px rgba(139,92,246,0.34)`,
                  animation: "orbitalTilt 12s ease-in-out infinite",
                }}
              >
                <img
                  src="/asset/logo/logo_sans_fond.png"
                  alt="Viral Stick Logo"
                  style={{
                    width: 316,
                    height: 316,
                    objectFit: "contain",
                    filter: "drop-shadow(0 22px 34px rgba(139,92,246,0.32))",
                  }}
                />
              </div>

              <div style={{ textAlign: "center", maxWidth: 480 }}>
                <div style={{ fontSize: 30, fontWeight: 900, marginBottom: 8 }}>
                  Le noyau créatif de Viral Stick
                </div>
                <div style={{ color: colors.textSecondary, lineHeight: 1.7 }}>
                  Le logo devient ici une pièce centrale du produit : plus
                  grand, plus assumé, plus justifié visuellement, avec une
                  présence de marque qui structure toute l’interface.
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  gap: 12,
                  flexWrap: "wrap",
                  justifyContent: "center",
                }}
              >
                <CompanionAvatarWeb companion="bio" size={96} />
                <CompanionAvatarWeb companion="ubu" size={96} />
                <CompanionAvatarWeb companion="art" size={96} />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section style={{ marginTop: 30 }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: 18,
          }}
        >
          {FEATURES.map((feature) => (
            <Link
              key={feature.title}
              to={feature.to}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <div
                style={{
                  ...pageStyles.panel,
                  padding: 26,
                  minHeight: 290,
                  backdropFilter: "blur(20px)",
                  animation: "levitateCard 9s ease-in-out infinite",
                }}
              >
                <div
                  style={{
                    width: 58,
                    height: 58,
                    borderRadius: radius.md,
                    background: `${feature.accent}22`,
                    border: `1px solid ${feature.accent}55`,
                    marginBottom: 18,
                    boxShadow: `0 12px 34px ${feature.accent}22`,
                  }}
                />
                <h3 style={{ margin: 0, fontSize: 24 }}>{feature.title}</h3>
                <p style={{ color: colors.textSecondary, lineHeight: 1.75 }}>
                  {feature.desc}
                </p>
                <div
                  style={{
                    marginTop: 18,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <CompanionAvatarWeb companion={feature.companion} size={88} />
                  <span style={{ color: feature.accent, fontWeight: 800 }}>
                    Ouvrir →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section style={{ marginTop: 30 }}>
        <div style={{ ...pageStyles.panel, padding: 30 }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr auto",
              gap: 24,
              alignItems: "center",
              marginBottom: 24,
            }}
          >
            <div>
              <h2 style={{ margin: 0, fontSize: 36 }}>Écosystème compagnon</h2>
              <p
                style={{
                  color: colors.textSecondary,
                  marginTop: 10,
                  lineHeight: 1.7,
                  maxWidth: 820,
                }}
              >
                Chaque compagnon porte une fonction produit, une couleur
                d’accent et une manière de parler. Ils ne décorent pas seulement
                l’interface : ils structurent la génération, l’édition et le
                feedback créatif.
              </p>
            </div>
            <Link to="/multi-chat" style={pageStyles.buttonGhost}>
              Lancer le noyau social
            </Link>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
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
                <CompanionAvatarWeb companion={id} size={102} />
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
