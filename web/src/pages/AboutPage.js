import React from "react";
import WebShell, { pageStyles } from "../components/WebShell";
import CompanionAvatarWeb from "../components/CompanionAvatarWeb";
import { colors } from "../theme/tokens";

const TEAM = [
  { name: "Ravel", role: "Lead Developer", companion: "arch" },
  { name: "Membre 2", role: "Backend Developer", companion: "data" },
  { name: "Membre 3", role: "Frontend Developer", companion: "art" },
  { name: "Membre 4", role: "AI Engineer", companion: "para" },
];

const AboutPage = () => {
  return (
    <WebShell title="À propos" companion="arch">
      <section style={{ display: "grid", gap: 24 }}>
        <div style={{ ...pageStyles.panel, padding: 32, textAlign: "center" }}>
          <CompanionAvatarWeb companion="arch" size={170} />
          <h1 style={{ fontSize: 42, marginBottom: 10 }}>Viral Stick</h1>
          <p
            style={{
              color: colors.textSecondary,
              maxWidth: 760,
              margin: "0 auto",
              lineHeight: 1.7,
            }}
          >
            Une machine à mèmes multimodale avec une identité visuelle forte,
            une logique de compagnons assumée et un ton créatif plus cohérent
            entre backend, web et mobile.
          </p>
        </div>

        <div style={{ ...pageStyles.panel, padding: 28 }}>
          <h2 style={{ marginTop: 0 }}>Stack & vision</h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: 14,
            }}
          >
            {[
              "React Native",
              "React Web",
              "Express",
              "Gemini",
              "Mistral",
              "DeepSeek",
              "Compagnons IA",
            ].map((item) => (
              <div key={item} style={{ ...pageStyles.softPanel, padding: 16 }}>
                {item}
              </div>
            ))}
          </div>
        </div>

        <div style={{ ...pageStyles.panel, padding: 28 }}>
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
                <CompanionAvatarWeb companion={member.companion} size={120} />
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
