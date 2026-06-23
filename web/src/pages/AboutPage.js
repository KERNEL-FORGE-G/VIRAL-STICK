import React from "react";
import WebShell, { pageStyles } from "../components/WebShell";
import CompanionAvatarWeb from "../components/CompanionAvatarWeb";
import { colors, gradients } from "../theme/tokens";

const TEAM = [
  { name: "Ravel", role: "Lead Developer", companion: "arch" },
  { name: "Membre 2", role: "Backend Developer", companion: "data" },
  { name: "Membre 3", role: "Frontend Developer", companion: "art" },
  { name: "Membre 4", role: "AI Engineer", companion: "para" },
];

const PILLARS = [
  {
    title: "Identité visuelle forte",
    text: "Le logo n’est plus un simple repère de navigation : il devient une signature de marque pleinement assumée.",
  },
  {
    title: "Produit créatif multimodal",
    text: "Le projet vise la génération et l’édition de mèmes texte + image avec une vraie logique de studio de création.",
  },
  {
    title: "IA orchestrée",
    text: "La couche backend agrège plusieurs fournisseurs pour sécuriser la génération de texte et préparer une stack image plus robuste.",
  },
];

const AboutPage = () => {
  return (
    <WebShell title="À propos" companion="arch">
      <section style={{ display: "grid", gap: 26 }}>
        <div
          style={{
            ...pageStyles.panel,
            padding: 38,
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: -120,
              left: -60,
              width: 340,
              height: 340,
              borderRadius: 999,
              background: gradients.brandSoft,
              filter: "blur(36px)",
            }}
          />

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "0.95fr 1.05fr",
              gap: 34,
              alignItems: "center",
              position: "relative",
              zIndex: 1,
            }}
          >
            <div style={{ display: "grid", placeItems: "center" }}>
              <div
                style={{
                  width: 360,
                  height: 360,
                  borderRadius: 42,
                  display: "grid",
                  placeItems: "center",
                  background:
                    "linear-gradient(180deg, rgba(255,255,255,0.14), rgba(255,255,255,0.03))",
                  border: `1px solid ${colors.borderStrong}`,
                  boxShadow: `0 30px 80px rgba(124,58,237,0.24)`,
                }}
              >
                <img
                  src="/asset/logo/logo_sans_fond.png"
                  alt="Viral Stick Logo"
                  style={{ width: 290, height: 290, objectFit: "contain" }}
                />
              </div>
            </div>

            <div>
              <div
                style={{
                  color: colors.textMuted,
                  textTransform: "uppercase",
                  letterSpacing: 2,
                  fontWeight: 800,
                  marginBottom: 12,
                }}
              >
                Manifesto produit
              </div>
              <h1 style={{ margin: 0, fontSize: 46, lineHeight: 1.02 }}>
                Viral Stick, repensé comme un studio professionnel de création
                de mèmes
              </h1>
              <p
                style={{
                  color: colors.textSecondary,
                  lineHeight: 1.8,
                  marginTop: 18,
                  fontSize: 17,
                }}
              >
                Cette refonte repositionne le projet sur ce qu’il veut vraiment
                devenir : une application sérieuse de génération et d’édition de
                mèmes, où branding, UX, compagnons et moteur IA travaillent
                ensemble au lieu d’exister séparément.
              </p>
              <div
                style={{
                  display: "flex",
                  gap: 12,
                  flexWrap: "wrap",
                  marginTop: 20,
                }}
              >
                <CompanionAvatarWeb companion="arch" size={88} />
                <CompanionAvatarWeb companion="data" size={88} />
                <CompanionAvatarWeb companion="art" size={88} />
              </div>
            </div>
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: 18,
          }}
        >
          {PILLARS.map((pillar) => (
            <div
              key={pillar.title}
              style={{ ...pageStyles.panel, padding: 24 }}
            >
              <h3 style={{ marginTop: 0, marginBottom: 10 }}>{pillar.title}</h3>
              <p style={{ color: colors.textSecondary, lineHeight: 1.75 }}>
                {pillar.text}
              </p>
            </div>
          ))}
        </div>

        <div style={{ ...pageStyles.panel, padding: 30 }}>
          <h2 style={{ marginTop: 0 }}>Stack & vision technique</h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: 14,
            }}
          >
            {[
              "React Native pour le mobile",
              "React Web pour la vitrine et l’interface desktop",
              "Express pour l’orchestration backend",
              "Gemini comme provider principal texte",
              "Mistral et DeepSeek comme fallback",
              "Compagnons IA comme système d’incarnation produit",
            ].map((item) => (
              <div
                key={item}
                style={{
                  ...pageStyles.softPanel,
                  padding: 16,
                  lineHeight: 1.6,
                }}
              >
                {item}
              </div>
            ))}
          </div>
        </div>

        <div style={{ ...pageStyles.panel, padding: 30 }}>
          <h2 style={{ marginTop: 0 }}>Équipe</h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: 16,
            }}
          >
            {TEAM.map((member) => (
              <div
                key={member.name}
                style={{
                  ...pageStyles.softPanel,
                  padding: 22,
                  textAlign: "center",
                }}
              >
                <CompanionAvatarWeb companion={member.companion} size={128} />
                <div style={{ fontWeight: 800, marginTop: 10 }}>
                  {member.name}
                </div>
                <div style={{ color: colors.textMuted }}>{member.role}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </WebShell>
  );
};

export default AboutPage;
