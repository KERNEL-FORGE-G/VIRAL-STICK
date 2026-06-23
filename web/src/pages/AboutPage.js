import React from "react";
import { Link } from "react-router-dom";
import CompanionAvatarWeb from "../components/CompanionAvatarWeb";

const TEAM = [
  { name: "Ravel", role: "Lead Developer", companion: "arch" },
  { name: "Membre 2", role: "Backend Developer", companion: "data" },
  { name: "Membre 3", role: "Frontend Developer", companion: "art" },
  { name: "Membre 4", role: "AI Engineer", companion: "para" },
];

const AboutPage = () => {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #0a0a1a 0%, #1a1a2e 100%)",
      }}
    >
      {/* Header */}
      <header
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          padding: "12px 40px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          background: "rgba(10, 10, 26, 0.8)",
          backdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
          zIndex: 1000,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <img
            src="/asset/logo/logo_sans_fond.png"
            alt="Viral Stick Logo"
            style={{ width: 50, height: 50, objectFit: "contain" }}
          />
          <Link
            to="/"
            style={{
              color: "rgba(255, 255, 255, 0.7)",
              textDecoration: "none",
              fontSize: "14px",
              fontWeight: "500",
            }}
          >
            ← Retour
          </Link>
        </div>
        <h1 style={{ margin: 0, fontSize: "20px", fontWeight: "800" }}>
          À propos
        </h1>
      </header>

      {/* Main Content */}
      <main
        style={{
          maxWidth: "1000px",
          margin: "0 auto",
          padding: "140px 40px 80px",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Project Info */}
        <div
          style={{
            background: "rgba(255, 255, 255, 0.03)",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            borderRadius: "24px",
            padding: "48px",
            marginBottom: "40px",
            textAlign: "center",
          }}
        >
          <CompanionAvatarWeb companion="arch" size={200} />
          <h2
            style={{
              fontSize: "36px",
              fontWeight: "900",
              marginBottom: "16px",
              background: "linear-gradient(135deg, #7c3aed, #3b82f6)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Viral Stick
          </h2>
          <p
            style={{
              fontSize: "18px",
              color: "rgba(255, 255, 255, 0.7)",
              lineHeight: "1.6",
              marginBottom: "32px",
              maxWidth: "600px",
              margin: "0 auto 32px",
            }}
          >
            Un générateur de mèmes et stickers multimodal propulsé par
            l'intelligence artificielle. Transformez vos textes, voix et images
            en contenu viral avec nos 7 compagnons IA uniques.
          </p>

          <a
            href="https://github.com/KERNEL-FORGE-G/VIRAL-STICK"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "12px",
              padding: "16px 32px",
              background: "linear-gradient(135deg, #7c3aed, #5b21b6)",
              color: "white",
              textDecoration: "none",
              borderRadius: "16px",
              fontSize: "16px",
              fontWeight: "700",
              boxShadow: "0 8px 32px rgba(124, 58, 237, 0.4)",
              transition: "all 0.3s",
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = "translateY(-2px)";
              e.target.style.boxShadow = "0 12px 40px rgba(124, 58, 237, 0.5)";
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = "translateY(0)";
              e.target.style.boxShadow = "0 8px 32px rgba(124, 58, 237, 0.4)";
            }}
          >
            <span>📦</span>
            Voir sur GitHub
          </a>
        </div>

        {/* Tech Stack */}
        <div
          style={{
            background: "rgba(255, 255, 255, 0.03)",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            borderRadius: "24px",
            padding: "40px",
            marginBottom: "40px",
          }}
        >
          <h3
            style={{
              fontSize: "24px",
              fontWeight: "800",
              marginBottom: "24px",
              textAlign: "center",
            }}
          >
            Stack Technique
          </h3>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "20px",
            }}
          >
            {[
              { name: "React Native", icon: "📱" },
              { name: "ReactJS", icon: "⚛️" },
              { name: "Node.js", icon: "🟢" },
              { name: "Express", icon: "🚂" },
              { name: "Google Gemini", icon: "🤖" },
              { name: "Mistral AI", icon: "🧠" },
              { name: "DeepSeek", icon: "🔍" },
              { name: "MongoDB", icon: "🍃" },
            ].map((tech, index) => (
              <div
                key={index}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  padding: "16px",
                  background: "rgba(255, 255, 255, 0.02)",
                  borderRadius: "12px",
                  border: "1px solid rgba(255, 255, 255, 0.05)",
                }}
              >
                <span style={{ fontSize: "24px" }}>{tech.icon}</span>
                <span style={{ fontSize: "15px", fontWeight: "500" }}>
                  {tech.name}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Team */}
        <div
          style={{
            background: "rgba(255, 255, 255, 0.03)",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            borderRadius: "24px",
            padding: "40px",
            marginBottom: "40px",
          }}
        >
          <h3
            style={{
              fontSize: "24px",
              fontWeight: "800",
              marginBottom: "32px",
              textAlign: "center",
            }}
          >
            Équipe de Développement
          </h3>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "24px",
            }}
          >
            {TEAM.map((member, index) => (
              <div
                key={index}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  padding: "32px",
                  background: "rgba(255, 255, 255, 0.02)",
                  borderRadius: "20px",
                  border: "1px solid rgba(255, 255, 255, 0.05)",
                  textAlign: "center",
                }}
              >
                <CompanionAvatarWeb companion={member.companion} size={160} />
                <h4
                  style={{
                    fontSize: "18px",
                    fontWeight: "700",
                    marginTop: "20px",
                    marginBottom: "8px",
                  }}
                >
                  {member.name}
                </h4>
                <p
                  style={{
                    fontSize: "14px",
                    color: "rgba(255, 255, 255, 0.5)",
                    marginBottom: "16px",
                  }}
                >
                  {member.role}
                </p>
                <div
                  style={{
                    display: "flex",
                    gap: "8px",
                    justifyContent: "center",
                  }}
                >
                  <a
                    href={`https://github.com/${member.name.toLowerCase()}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      padding: "8px 16px",
                      background: "rgba(255, 255, 255, 0.05)",
                      border: "1px solid rgba(255, 255, 255, 0.1)",
                      borderRadius: "8px",
                      color: "rgba(255, 255, 255, 0.7)",
                      textDecoration: "none",
                      fontSize: "13px",
                      transition: "all 0.3s",
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.background = "rgba(255, 255, 255, 0.1)";
                      e.target.style.color = "#fff";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = "rgba(255, 255, 255, 0.05)";
                      e.target.style.color = "rgba(255, 255, 255, 0.7)";
                    }}
                  >
                    GitHub
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Academic Info */}
        <div
          style={{
            background: "rgba(255, 255, 255, 0.03)",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            borderRadius: "24px",
            padding: "40px",
            textAlign: "center",
          }}
        >
          <h3
            style={{
              fontSize: "24px",
              fontWeight: "800",
              marginBottom: "16px",
            }}
          >
            Université de Yaoundé I
          </h3>
          <p
            style={{
              fontSize: "16px",
              color: "rgba(255, 255, 255, 0.6)",
              marginBottom: "24px",
            }}
          >
            Projet académique — ICT202
          </p>
          <p
            style={{
              fontSize: "14px",
              color: "rgba(255, 255, 255, 0.4)",
            }}
          >
            © 2026 Viral Stick. Tous droits réservés.
          </p>
        </div>
      </main>
    </div>
  );
};

export default AboutPage;
