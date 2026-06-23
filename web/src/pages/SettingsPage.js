import React, { useState } from "react";
import { Link } from "react-router-dom";
import CompanionAvatarWeb from "../components/CompanionAvatarWeb";

const SettingsPage = () => {
  const [keys, setKeys] = useState({
    GEMINI_API_KEY: "",
    MISTRAL_API_KEY: "",
    DEEPSEEK_API_KEY: "",
  });
  const [status, setStatus] = useState("");
  const [statusType, setStatusType] = useState("");

  const handleSave = async () => {
    setStatus("Sauvegarde en cours...");
    setStatusType("info");
    try {
      const response = await fetch("/api/debug/update-keys", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(keys),
      });
      if (response.ok) {
        setStatus("Clés mises à jour avec succès (session uniquement).");
        setStatusType("success");
      } else {
        setStatus("Erreur lors de la mise à jour des clés.");
        setStatusType("error");
      }
    } catch (e) {
      setStatus("Impossible de se connecter au backend.");
      setStatusType("error");
    }
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
          <CompanionAvatarWeb companion="para" size={96} />
          <h1 style={{ margin: 0, fontSize: "20px", fontWeight: "800" }}>
            Paramètres
          </h1>
        </div>
      </header>

      {/* Main Content */}
      <main
        style={{
          maxWidth: "600px",
          margin: "0 auto",
          padding: "140px 40px 80px",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Background Effect */}
        <div
          style={{
            position: "absolute",
            top: "20%",
            left: "50%",
            transform: "translateX(-50%)",
            width: "600px",
            height: "600px",
            background:
              "radial-gradient(circle, rgba(16, 185, 129, 0.1) 0%, transparent 70%)",
            filter: "blur(80px)",
            zIndex: 0,
            pointerEvents: "none",
          }}
        />

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
            <CompanionAvatarWeb companion="para" size={128} />
            <div>
              <h2
                style={{
                  margin: 0,
                  fontSize: "24px",
                  fontWeight: "800",
                  marginBottom: "4px",
                }}
              >
                Para
              </h2>
              <p
                style={{
                  margin: 0,
                  fontSize: "14px",
                  color: "rgba(255, 255, 255, 0.6)",
                }}
              >
                Gestionnaire des paramètres
              </p>
            </div>
          </div>

          <p
            style={{
              marginBottom: "32px",
              color: "rgba(255, 255, 255, 0.6)",
              fontSize: "16px",
              lineHeight: "1.6",
            }}
          >
            Configurez vos clés API pour les services IA. Ces clés sont stockées
            uniquement en session et ne sont pas persistantes.
          </p>

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
              Gemini API Key (Google)
            </label>
            <input
              type="password"
              value={keys.GEMINI_API_KEY}
              onChange={(e) =>
                setKeys({ ...keys, GEMINI_API_KEY: e.target.value })
              }
              placeholder="Entrez votre clé Gemini..."
              style={{
                width: "100%",
                padding: "18px 20px",
                background: "rgba(255, 255, 255, 0.02)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                borderRadius: "16px",
                color: "#f3f4f6",
                fontSize: "15px",
                outline: "none",
                transition: "border-color 0.3s",
              }}
              onFocus={(e) =>
                (e.target.style.borderColor = "rgba(16, 185, 129, 0.5)")
              }
              onBlur={(e) =>
                (e.target.style.borderColor = "rgba(255, 255, 255, 0.1)")
              }
            />
          </div>

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
              Mistral API Key
            </label>
            <input
              type="password"
              value={keys.MISTRAL_API_KEY}
              onChange={(e) =>
                setKeys({ ...keys, MISTRAL_API_KEY: e.target.value })
              }
              placeholder="Entrez votre clé Mistral..."
              style={{
                width: "100%",
                padding: "18px 20px",
                background: "rgba(255, 255, 255, 0.02)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                borderRadius: "16px",
                color: "#f3f4f6",
                fontSize: "15px",
                outline: "none",
                transition: "border-color 0.3s",
              }}
              onFocus={(e) =>
                (e.target.style.borderColor = "rgba(16, 185, 129, 0.5)")
              }
              onBlur={(e) =>
                (e.target.style.borderColor = "rgba(255, 255, 255, 0.1)")
              }
            />
          </div>

          <div style={{ marginBottom: "32px" }}>
            <label
              style={{
                display: "block",
                marginBottom: "12px",
                fontSize: "14px",
                fontWeight: "600",
                color: "#f3f4f6",
              }}
            >
              DeepSeek API Key
            </label>
            <input
              type="password"
              value={keys.DEEPSEEK_API_KEY}
              onChange={(e) =>
                setKeys({ ...keys, DEEPSEEK_API_KEY: e.target.value })
              }
              placeholder="Entrez votre clé DeepSeek..."
              style={{
                width: "100%",
                padding: "18px 20px",
                background: "rgba(255, 255, 255, 0.02)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                borderRadius: "16px",
                color: "#f3f4f6",
                fontSize: "15px",
                outline: "none",
                transition: "border-color 0.3s",
              }}
              onFocus={(e) =>
                (e.target.style.borderColor = "rgba(16, 185, 129, 0.5)")
              }
              onBlur={(e) =>
                (e.target.style.borderColor = "rgba(255, 255, 255, 0.1)")
              }
            />
          </div>

          <button
            onClick={handleSave}
            style={{
              width: "100%",
              padding: "18px 32px",
              background: "linear-gradient(135deg, #10b981, #059669)",
              color: "white",
              border: "none",
              borderRadius: "16px",
              fontSize: "16px",
              fontWeight: "700",
              cursor: "pointer",
              transition: "all 0.3s",
              boxShadow: "0 8px 32px rgba(16, 185, 129, 0.4)",
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = "translateY(-2px)";
              e.target.style.boxShadow = "0 12px 40px rgba(16, 185, 129, 0.5)";
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = "translateY(0)";
              e.target.style.boxShadow = "0 8px 32px rgba(16, 185, 129, 0.4)";
            }}
          >
            Enregistrer les clés
          </button>

          {status && (
            <div
              style={{
                marginTop: "24px",
                padding: "20px",
                borderRadius: "16px",
                background:
                  statusType === "success"
                    ? "rgba(16, 185, 129, 0.1)"
                    : statusType === "error"
                      ? "rgba(239, 68, 68, 0.1)"
                      : "rgba(59, 130, 246, 0.1)",
                border:
                  statusType === "success"
                    ? "1px solid rgba(16, 185, 129, 0.25)"
                    : statusType === "error"
                      ? "1px solid rgba(239, 68, 68, 0.25)"
                      : "1px solid rgba(59, 130, 246, 0.25)",
                color:
                  statusType === "success"
                    ? "#10b981"
                    : statusType === "error"
                      ? "#ef4444"
                      : "#3b82f6",
                fontSize: "15px",
                textAlign: "center",
                fontWeight: "500",
              }}
            >
              {status}
            </div>
          )}

          <div
            style={{
              marginTop: "32px",
              padding: "20px",
              background: "rgba(239, 68, 68, 0.05)",
              borderRadius: "16px",
              border: "1px solid rgba(239, 68, 68, 0.15)",
            }}
          >
            <p
              style={{
                margin: 0,
                fontSize: "14px",
                color: "rgba(239, 68, 68, 0.8)",
                display: "flex",
                alignItems: "center",
                gap: "12px",
                lineHeight: "1.6",
              }}
            >
              <span style={{ fontSize: "20px" }}>⚠️</span>
              <span>
                <strong>Important :</strong> Ne partagez jamais vos clés API.
                Elles sont utilisées uniquement pour cette session locale.
              </span>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SettingsPage;
