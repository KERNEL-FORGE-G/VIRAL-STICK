import React from "react";
import { Link } from "react-router-dom";
import CompanionAvatarWeb from "../components/CompanionAvatarWeb";

const LandingPage = () => {
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
          <h1
            style={{
              margin: 0,
              fontSize: "28px",
              fontWeight: "800",
              background: "linear-gradient(135deg, #7c3aed, #3b82f6)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Viral Stick
          </h1>
        </div>
        <nav style={{ display: "flex", gap: "8px" }}>
          {[
            { to: "/", label: "Accueil" },
            { to: "/context", label: "Context" },
            { to: "/remix", label: "Remix" },
            { to: "/chat", label: "Chat" },
            { to: "/multi-chat", label: "Multi-Chat" },
            { to: "/about", label: "À propos" },
            { to: "/settings", label: "Paramètres" },
          ].map((item) => (
            <Link
              key={item.to}
              to={item.to}
              style={{
                padding: "10px 20px",
                color: "rgba(255, 255, 255, 0.7)",
                textDecoration: "none",
                borderRadius: "8px",
                fontSize: "14px",
                fontWeight: "500",
                transition: "all 0.3s",
                background: "transparent",
              }}
              onMouseEnter={(e) => {
                e.target.style.background = "rgba(255, 255, 255, 0.1)";
                e.target.style.color = "#fff";
              }}
              onMouseLeave={(e) => {
                e.target.style.background = "transparent";
                e.target.style.color = "rgba(255, 255, 255, 0.7)";
              }}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </header>

      {/* Hero Section */}
      <section
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "120px 40px 80px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            maxWidth: "1200px",
            width: "100%",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "60px",
            alignItems: "center",
            position: "relative",
            zIndex: 1,
          }}
        >
          <div>
            <div
              style={{
                display: "inline-block",
                padding: "8px 16px",
                background: "rgba(124, 58, 237, 0.1)",
                border: "1px solid rgba(124, 58, 237, 0.3)",
                borderRadius: "20px",
                marginBottom: "24px",
              }}
            >
              <span
                style={{
                  fontSize: "12px",
                  fontWeight: "700",
                  color: "#a78bfa",
                  letterSpacing: "1px",
                  textTransform: "uppercase",
                }}
              >
                ✨ Nouvelle génération de mèmes IA
              </span>
            </div>

            <h1
              style={{
                fontSize: "56px",
                fontWeight: "900",
                lineHeight: "1.1",
                marginBottom: "24px",
                background:
                  "linear-gradient(135deg, #fff 0%, rgba(255, 255, 255, 0.8) 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Créez des mèmes
              <br />
              <span
                style={{
                  background: "linear-gradient(135deg, #7c3aed, #3b82f6)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                viraux avec l'IA
              </span>
            </h1>

            <p
              style={{
                fontSize: "18px",
                lineHeight: "1.6",
                color: "rgba(255, 255, 255, 0.6)",
                marginBottom: "40px",
                maxWidth: "480px",
              }}
            >
              Transformez vos textes, voix et images en stickers viraux grâce à
              nos 7 compagnons IA. Context Reader, Voice-to-Meme, Status Remixer
              — tout est possible.
            </p>

            <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
              <Link
                to="/context"
                style={{
                  padding: "16px 40px",
                  background: "linear-gradient(135deg, #7c3aed, #5b21b6)",
                  color: "#fff",
                  textDecoration: "none",
                  borderRadius: "12px",
                  fontSize: "16px",
                  fontWeight: "700",
                  boxShadow: "0 8px 32px rgba(124, 58, 237, 0.4)",
                  transition: "all 0.3s",
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = "translateY(-2px)";
                  e.target.style.boxShadow =
                    "0 12px 40px rgba(124, 58, 237, 0.5)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = "translateY(0)";
                  e.target.style.boxShadow =
                    "0 8px 32px rgba(124, 58, 237, 0.4)";
                }}
              >
                Commencer →
              </Link>
              <Link
                to="/chat"
                style={{
                  padding: "16px 40px",
                  background: "rgba(255, 255, 255, 0.05)",
                  color: "#fff",
                  textDecoration: "none",
                  borderRadius: "12px",
                  fontSize: "16px",
                  fontWeight: "600",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  transition: "all 0.3s",
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = "rgba(255, 255, 255, 0.1)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = "rgba(255, 255, 255, 0.05)";
                }}
              >
                Discuter avec les compagnons
              </Link>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              gap: "32px",
            }}
          >
            <img
              src="/asset/logo/logo_sans_fond.png"
              alt="Viral Stick Logo"
              style={{
                width: 240,
                height: 240,
                objectFit: "contain",
                filter: "drop-shadow(0 8px 32px rgba(124, 58, 237, 0.4))",
              }}
            />
            <CompanionAvatarWeb companion="arch" size={140} />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section style={{ padding: "100px 40px" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "60px" }}>
            <h2
              style={{
                fontSize: "40px",
                fontWeight: "900",
                marginBottom: "16px",
                background:
                  "linear-gradient(135deg, #fff 0%, rgba(255, 255, 255, 0.8) 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              3 outils puissants
            </h2>
            <p style={{ fontSize: "18px", color: "rgba(255, 255, 255, 0.6)" }}>
              Tout ce dont vous avez besoin pour créer des mèmes exceptionnels
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
              gap: "24px",
            }}
          >
            {[
              {
                icon: "📝",
                title: "Context Reader",
                tagline: "Texte → Mème",
                desc: "Collez un extrait de discussion et laissez l'IA générer le mème parfait.",
                companion: "art",
                color: "#7c3aed",
              },
              {
                icon: "🎙️",
                title: "Voice-to-Meme",
                tagline: "Audio → Mème",
                desc: "Enregistrez votre voix et transformez-la en mème avec transcription automatique.",
                companion: "ubu",
                color: "#3b82f6",
              },
              {
                icon: "🖼️",
                title: "Status Remixer",
                tagline: "Image → Mème",
                desc: "Importez une image et laissez l'IA ajouter le texte parfait.",
                companion: "bio",
                color: "#06b6d4",
              },
            ].map((feature, index) => (
              <div
                key={index}
                style={{
                  background: "rgba(255, 255, 255, 0.03)",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                  borderRadius: "20px",
                  padding: "32px",
                  position: "relative",
                  overflow: "hidden",
                  transition: "all 0.3s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background =
                    "rgba(255, 255, 255, 0.06)";
                  e.currentTarget.style.transform = "translateY(-4px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background =
                    "rgba(255, 255, 255, 0.03)";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                <div style={{ position: "relative", zIndex: 1 }}>
                  <div
                    style={{
                      width: "56px",
                      height: "56px",
                      borderRadius: "16px",
                      background: `${feature.color}20`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "28px",
                      marginBottom: "20px",
                    }}
                  >
                    {feature.icon}
                  </div>
                  <h3
                    style={{
                      fontSize: "24px",
                      fontWeight: "800",
                      marginBottom: "8px",
                    }}
                  >
                    {feature.title}
                  </h3>
                  <p
                    style={{
                      fontSize: "14px",
                      color: feature.color,
                      fontWeight: "600",
                      marginBottom: "12px",
                    }}
                  >
                    {feature.tagline}
                  </p>
                  <p
                    style={{
                      fontSize: "15px",
                      color: "rgba(255, 255, 255, 0.6)",
                      lineHeight: "1.6",
                      marginBottom: "20px",
                    }}
                  >
                    {feature.desc}
                  </p>
                  <div style={{ display: "flex", justifyContent: "center" }}>
                    <CompanionAvatarWeb
                      companion={feature.companion}
                      size={128}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Companions Section */}
      <section style={{ padding: "100px 40px" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "60px" }}>
            <h2
              style={{
                fontSize: "40px",
                fontWeight: "900",
                marginBottom: "16px",
                background:
                  "linear-gradient(135deg, #fff 0%, rgba(255, 255, 255, 0.8) 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Vos 7 Compagnons IA
            </h2>
            <p style={{ fontSize: "18px", color: "rgba(255, 255, 255, 0.6)" }}>
              Chacun avec sa personnalité unique pour vous accompagner
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
              gap: "24px",
            }}
          >
            {["arch", "para", "secu", "data", "bio", "ubu", "art"].map(
              (companion) => (
                <div
                  key={companion}
                  style={{
                    background: "rgba(255, 255, 255, 0.03)",
                    border: "1px solid rgba(255, 255, 255, 0.08)",
                    borderRadius: "16px",
                    padding: "24px",
                    textAlign: "center",
                    transition: "all 0.3s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background =
                      "rgba(255, 255, 255, 0.06)";
                    e.currentTarget.style.transform = "translateY(-4px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background =
                      "rgba(255, 255, 255, 0.03)";
                    e.currentTarget.style.transform = "translateY(0)";
                  }}
                >
                  <CompanionAvatarWeb companion={companion} size={160} />
                  <h3
                    style={{
                      fontSize: "18px",
                      fontWeight: "700",
                      marginTop: "16px",
                      marginBottom: "4px",
                      textTransform: "capitalize",
                    }}
                  >
                    {companion}
                  </h3>
                  <p
                    style={{
                      fontSize: "12px",
                      color: "rgba(255, 255, 255, 0.5)",
                    }}
                  >
                    Compagnon IA
                  </p>
                </div>
              ),
            )}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{ padding: "100px 40px" }}>
        <div
          style={{
            maxWidth: "800px",
            margin: "0 auto",
            textAlign: "center",
            padding: "60px",
            background:
              "linear-gradient(135deg, rgba(124, 58, 237, 0.1) 0%, rgba(59, 130, 246, 0.1) 100%)",
            border: "1px solid rgba(124, 58, 237, 0.2)",
            borderRadius: "24px",
          }}
        >
          <h2
            style={{
              fontSize: "36px",
              fontWeight: "900",
              marginBottom: "16px",
              background:
                "linear-gradient(135deg, #fff 0%, rgba(255, 255, 255, 0.8) 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Prêt à créer ?
          </h2>
          <p
            style={{
              fontSize: "18px",
              color: "rgba(255, 255, 255, 0.6)",
              marginBottom: "32px",
            }}
          >
            Rejoignez des milliers de créateurs et générez vos premiers mèmes IA
            maintenant
          </p>
          <Link
            to="/context"
            style={{
              display: "inline-block",
              padding: "16px 48px",
              background: "linear-gradient(135deg, #7c3aed, #5b21b6)",
              color: "#fff",
              textDecoration: "none",
              borderRadius: "12px",
              fontSize: "18px",
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
            Créer un mème →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer
        style={{
          padding: "60px 40px",
          borderTop: "1px solid rgba(255, 255, 255, 0.05)",
          background: "rgba(0, 0, 0, 0.3)",
        }}
      >
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "24px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <img
              src="/asset/logo/logo_sans_fond.png"
              alt="Viral Stick Logo"
              style={{ width: 45, height: 45, objectFit: "contain" }}
            />
            <h3 style={{ margin: 0, fontSize: "18px", fontWeight: "700" }}>
              Viral Stick
            </h3>
          </div>
          <div style={{ textAlign: "right" }}>
            <p
              style={{
                margin: 0,
                fontSize: "14px",
                color: "rgba(255, 255, 255, 0.6)",
              }}
            >
              Université de Yaoundé I — ICT202
            </p>
            <p
              style={{
                margin: "4px 0 0 0",
                fontSize: "12px",
                color: "rgba(255, 255, 255, 0.4)",
              }}
            >
              © 2026 Viral Stick. Tous droits réservés.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
