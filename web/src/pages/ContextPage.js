import React, { useState } from "react";
import { Link } from "react-router-dom";
import CompanionAvatarWeb from "../components/CompanionAvatarWeb";

const ContextPage = () => {
  const [inputType, setInputType] = useState("text");
  const [context, setContext] = useState("");
  const [location, setLocation] = useState("france");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const generateMeme = async () => {
    if (!context.trim()) return;
    setLoading(true);
    try {
      const response = await fetch("/api/memes/generate-from-text", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: context,
          inputType,
          location,
        }),
      });
      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error("Error:", error);
    }
    setLoading(false);
  };

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
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <CompanionAvatarWeb companion="art" size={96} />
          <h1 style={{ margin: 0, fontSize: "20px", fontWeight: "800" }}>
            Context Reader
          </h1>
        </div>
      </header>

      {/* Main Content */}
      <main
        style={{
          maxWidth: "800px",
          margin: "0 auto",
          padding: "140px 40px 80px",
          position: "relative",
          zIndex: 1,
        }}
      >
        <div
          style={{
            background: "rgba(255, 255, 255, 0.03)",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            borderRadius: "24px",
            padding: "40px",
            backdropFilter: "blur(20px)",
            position: "relative",
            zIndex: 1,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "16px",
              marginBottom: "24px",
            }}
          >
            <CompanionAvatarWeb companion="art" size={128} />
            <div>
              <h2
                style={{
                  margin: 0,
                  fontSize: "24px",
                  fontWeight: "800",
                  marginBottom: "4px",
                }}
              >
                Art
              </h2>
              <p
                style={{
                  margin: 0,
                  fontSize: "14px",
                  color: "rgba(255, 255, 255, 0.6)",
                }}
              >
                Expert visuel et créatif
              </p>
            </div>
          </div>

          <p
            style={{
              fontSize: "16px",
              color: "rgba(255, 255, 255, 0.6)",
              lineHeight: "1.6",
              marginBottom: "32px",
            }}
          >
            Collez un extrait de discussion ou un texte et laissez l'IA générer
            le mème parfait. Art analysera le contexte pour créer quelque chose
            d'unique.
          </p>

          {/* Input Type Selector */}
          <div style={{ marginBottom: "24px" }}>
            <label
              style={{
                display: "block",
                marginBottom: "12px",
                fontSize: "14px",
                fontWeight: "600",
                color: "#f3f4f6",
              }}
            >
              Type d'entrée
            </label>
            <div style={{ display: "flex", gap: "12px" }}>
              <button
                onClick={() => setInputType("text")}
                style={{
                  flex: 1,
                  padding: "14px 20px",
                  background:
                    inputType === "text"
                      ? "rgba(124, 58, 237, 0.2)"
                      : "rgba(255, 255, 255, 0.02)",
                  border:
                    inputType === "text"
                      ? "1px solid rgba(124, 58, 237, 0.4)"
                      : "1px solid rgba(255, 255, 255, 0.1)",
                  borderRadius: "12px",
                  color:
                    inputType === "text"
                      ? "#a78bfa"
                      : "rgba(255, 255, 255, 0.7)",
                  fontSize: "14px",
                  fontWeight: "600",
                  cursor: "pointer",
                  transition: "all 0.3s",
                }}
              >
                📝 Texte
              </button>
              <button
                onClick={() => setInputType("image")}
                style={{
                  flex: 1,
                  padding: "14px 20px",
                  background:
                    inputType === "image"
                      ? "rgba(124, 58, 237, 0.2)"
                      : "rgba(255, 255, 255, 0.02)",
                  border:
                    inputType === "image"
                      ? "1px solid rgba(124, 58, 237, 0.4)"
                      : "1px solid rgba(255, 255, 255, 0.1)",
                  borderRadius: "12px",
                  color:
                    inputType === "image"
                      ? "#a78bfa"
                      : "rgba(255, 255, 255, 0.7)",
                  fontSize: "14px",
                  fontWeight: "600",
                  cursor: "pointer",
                  transition: "all 0.3s",
                }}
              >
                🖼️ Image
              </button>
            </div>
          </div>

          {/* Location Selector */}
          <div style={{ marginBottom: "24px" }}>
            <label
              style={{
                display: "block",
                marginBottom: "12px",
                fontSize: "14px",
                fontWeight: "600",
                color: "#f3f4f6",
              }}
            >
              Localisation (pour adapter l'humour)
            </label>
            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              style={{
                width: "100%",
                padding: "16px 20px",
                background: "rgba(255, 255, 255, 0.02)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                borderRadius: "16px",
                color: "#f3f4f6",
                fontSize: "15px",
                outline: "none",
                cursor: "pointer",
              }}
            >
              <option value="france">🇫🇷 France</option>
              <option value="cameroun">🇨🇲 Cameroun</option>
              <option value="senegal">🇸🇳 Sénégal</option>
              <option value="coteivoire">🇨🇮 Côte d'Ivoire</option>
              <option value="mali">🇲🇱 Mali</option>
              <option value="benin">🇧🇯 Bénin</option>
              <option value="congo">🇨🇩 Congo</option>
              <option value="rdc">🇨🇩 RDC</option>
              <option value="maroc">🇲🇦 Maroc</option>
              <option value="algerie">🇩🇿 Algérie</option>
              <option value="tunisie">🇹🇳 Tunisie</option>
              <option value="belgique">🇧🇪 Belgique</option>
              <option value="suisse">🇨🇭 Suisse</option>
              <option value="canada">🇨🇦 Canada (Québec)</option>
              <option value="international">🌍 International</option>
            </select>
          </div>

          <textarea
            value={context}
            onChange={(e) => setContext(e.target.value)}
            placeholder="Collez votre texte de contexte ici..."
            style={{
              width: "100%",
              height: "200px",
              padding: "20px",
              background: "rgba(255, 255, 255, 0.02)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              borderRadius: "16px",
              color: "#f3f4f6",
              fontSize: "16px",
              resize: "vertical",
              marginBottom: "24px",
              outline: "none",
              transition: "border-color 0.3s",
            }}
            onFocus={(e) =>
              (e.target.style.borderColor = "rgba(124, 58, 237, 0.5)")
            }
            onBlur={(e) =>
              (e.target.style.borderColor = "rgba(255, 255, 255, 0.1)")
            }
          />

          <button
            onClick={generateMeme}
            disabled={loading || !context.trim()}
            style={{
              width: "100%",
              padding: "18px 32px",
              background: loading
                ? "rgba(124, 58, 237, 0.5)"
                : "linear-gradient(135deg, #7c3aed, #5b21b6)",
              color: "white",
              borderRadius: "16px",
              fontSize: "16px",
              fontWeight: "700",
              border: "none",
              cursor: loading || !context.trim() ? "not-allowed" : "pointer",
              transition: "all 0.3s",
              boxShadow: "0 8px 32px rgba(124, 58, 237, 0.4)",
            }}
            onMouseEnter={(e) => {
              if (!loading && context.trim()) {
                e.target.style.transform = "translateY(-2px)";
                e.target.style.boxShadow =
                  "0 12px 40px rgba(124, 58, 237, 0.5)";
              }
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = "translateY(0)";
              e.target.style.boxShadow = "0 8px 32px rgba(124, 58, 237, 0.4)";
            }}
          >
            {loading ? "Génération en cours..." : "Générer le mème"}
          </button>

          {result && (
            <div
              style={{
                marginTop: "32px",
                padding: "32px",
                background: "rgba(124, 58, 237, 0.1)",
                borderRadius: "20px",
                border: "1px solid rgba(124, 58, 237, 0.25)",
              }}
            >
              <h3
                style={{
                  marginBottom: "24px",
                  fontSize: "20px",
                  fontWeight: "800",
                  color: "#a78bfa",
                }}
              >
                Mème généré
              </h3>

              {/* Meme Visual Preview */}
              <div
                style={{
                  background:
                    "linear-gradient(135deg, #1a1a2e 0%, #2d2d44 100%)",
                  padding: "40px",
                  borderRadius: "16px",
                  marginBottom: "24px",
                  textAlign: "center",
                  border: "1px solid rgba(124, 58, 237, 0.3)",
                  position: "relative",
                  minHeight: "300px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <CompanionAvatarWeb
                  companion="art"
                  size={240}
                  style={{ marginBottom: "24px" }}
                />
                <p
                  style={{
                    fontSize: "32px",
                    fontWeight: "900",
                    marginBottom: "16px",
                    lineHeight: "1.2",
                    color: "#fff",
                    textShadow: "2px 2px 4px rgba(0,0,0,0.5)",
                    maxWidth: "100%",
                    wordWrap: "break-word",
                  }}
                >
                  {result.topText}
                </p>
                <p
                  style={{
                    fontSize: "28px",
                    fontWeight: "700",
                    lineHeight: "1.2",
                    color: "#fff",
                    textShadow: "2px 2px 4px rgba(0,0,0,0.5)",
                    maxWidth: "100%",
                    wordWrap: "break-word",
                  }}
                >
                  {result.bottomText}
                </p>
                <div
                  style={{
                    position: "absolute",
                    bottom: "12px",
                    right: "12px",
                    fontSize: "12px",
                    color: "rgba(255, 255, 255, 0.4)",
                    fontStyle: "italic",
                  }}
                >
                  Viral Stick
                </div>
              </div>

              <p
                style={{
                  color: "rgba(255, 255, 255, 0.6)",
                  fontSize: "15px",
                  lineHeight: "1.6",
                  marginBottom: "24px",
                  fontStyle: "italic",
                }}
              >
                📸 {result.descriptionImage}
              </p>

              {/* Action Buttons */}
              <div
                style={{
                  display: "flex",
                  gap: "12px",
                  marginBottom: "24px",
                  flexWrap: "wrap",
                }}
              >
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(
                      `${result.topText}\n${result.bottomText}`,
                    );
                  }}
                  style={{
                    flex: 1,
                    padding: "14px 24px",
                    background: "rgba(124, 58, 237, 0.2)",
                    border: "1px solid rgba(124, 58, 237, 0.4)",
                    color: "#a78bfa",
                    borderRadius: "12px",
                    fontSize: "14px",
                    fontWeight: "600",
                    cursor: "pointer",
                    transition: "all 0.3s",
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = "rgba(124, 58, 237, 0.3)";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = "rgba(124, 58, 237, 0.2)";
                  }}
                >
                  📋 Copier le texte
                </button>
                <button
                  onClick={() => {
                    const text = `${result.topText}\n${result.bottomText}`;
                    const blob = new Blob([text], { type: "text/plain" });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    a.href = url;
                    a.download = "meme-viral-stick.txt";
                    a.click();
                    URL.revokeObjectURL(url);
                  }}
                  style={{
                    flex: 1,
                    padding: "14px 24px",
                    background: "rgba(124, 58, 237, 0.2)",
                    border: "1px solid rgba(124, 58, 237, 0.4)",
                    color: "#a78bfa",
                    borderRadius: "12px",
                    fontSize: "14px",
                    fontWeight: "600",
                    cursor: "pointer",
                    transition: "all 0.3s",
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = "rgba(124, 58, 237, 0.3)";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = "rgba(124, 58, 237, 0.2)";
                  }}
                >
                  💾 Télécharger
                </button>
              </div>

              {result.companionComment && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "16px",
                    padding: "20px",
                    background: "rgba(255, 255, 255, 0.04)",
                    borderRadius: "16px",
                    border: "1px solid rgba(255, 255, 255, 0.08)",
                  }}
                >
                  <CompanionAvatarWeb companion="art" size={96} />
                  <div>
                    <p
                      style={{
                        margin: 0,
                        fontSize: "14px",
                        fontWeight: "600",
                        color: "#a78bfa",
                        marginBottom: "4px",
                      }}
                    >
                      Art
                    </p>
                    <p
                      style={{
                        margin: 0,
                        fontSize: "15px",
                        lineHeight: "1.5",
                        fontStyle: "italic",
                        color: "rgba(255, 255, 255, 0.8)",
                      }}
                    >
                      {result.companionComment}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default ContextPage;
