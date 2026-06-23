import React, { useState } from "react";
import WebShell, { pageStyles } from "../components/WebShell";
import CompanionAvatarWeb from "../components/CompanionAvatarWeb";
import { colors, gradients } from "../theme/tokens";

const SettingsPage = () => {
  const [keys, setKeys] = useState({
    GEMINI_API_KEY: "",
    MISTRAL_API_KEY: "",
    DEEPSEEK_API_KEY: "",
  });
  const [status, setStatus] = useState("");

  const handleSave = async () => {
    setStatus("Sauvegarde en cours...");
    try {
      const response = await fetch("/api/debug/update-keys", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(keys),
      });
      setStatus(
        response.ok
          ? "Clés mises à jour pour la session."
          : "Erreur de mise à jour.",
      );
    } catch {
      setStatus("Impossible de contacter le backend.");
    }
  };

  return (
    <WebShell title="Paramètres" companion="para">
      <section
        style={{ display: "grid", gap: 24, maxWidth: 1080, margin: "0 auto" }}
      >
        <div
          style={{
            ...pageStyles.panel,
            padding: 34,
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: -120,
              right: -40,
              width: 300,
              height: 300,
              borderRadius: 999,
              background: gradients.brandSoft,
              filter: "blur(34px)",
            }}
          />

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "0.95fr 1.05fr",
              gap: 30,
              alignItems: "center",
              position: "relative",
              zIndex: 1,
            }}
          >
            <div style={{ display: "grid", placeItems: "center" }}>
              <div
                style={{
                  width: 280,
                  height: 280,
                  borderRadius: 34,
                  display: "grid",
                  placeItems: "center",
                  background:
                    "linear-gradient(180deg, rgba(255,255,255,0.14), rgba(255,255,255,0.03))",
                  border: `1px solid ${colors.borderStrong}`,
                }}
              >
                <img
                  src="/asset/logo/logo_sans_fond.png"
                  alt="Viral Stick Logo"
                  style={{ width: 220, height: 220, objectFit: "contain" }}
                />
              </div>
            </div>

            <div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 16,
                  marginBottom: 12,
                }}
              >
                <CompanionAvatarWeb companion="para" size={100} />
                <div>
                  <h1 style={{ margin: 0 }}>Paramètres IA</h1>
                  <p
                    style={{
                      color: colors.textSecondary,
                      marginTop: 8,
                      lineHeight: 1.7,
                    }}
                  >
                    Zone de configuration produit pour piloter les providers de
                    génération de texte et préparer une chaîne de génération
                    d’image plus robuste.
                  </p>
                </div>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                  gap: 12,
                  marginTop: 18,
                }}
              >
                {[
                  ["Gemini", "provider principal"],
                  ["Mistral", "fallback texte"],
                  ["DeepSeek", "fallback texte"],
                ].map(([title, desc]) => (
                  <div
                    key={title}
                    style={{ ...pageStyles.softPanel, padding: 14 }}
                  >
                    <div style={{ fontWeight: 800 }}>{title}</div>
                    <div style={{ color: colors.textMuted, fontSize: 14 }}>
                      {desc}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div style={{ ...pageStyles.panel, padding: 28 }}>
          {[
            [
              "GEMINI_API_KEY",
              "Gemini API Key",
              "Clé du provider principal pour la génération de texte et, selon le setup, l’image.",
            ],
            [
              "MISTRAL_API_KEY",
              "Mistral API Key",
              "Fallback de génération textuelle lorsque Gemini est indisponible ou insuffisant.",
            ],
            [
              "DEEPSEEK_API_KEY",
              "DeepSeek API Key",
              "Fallback supplémentaire pour conserver une continuité de service côté texte.",
            ],
          ].map(([key, label, helper]) => (
            <div key={key} style={{ marginBottom: 18 }}>
              <label
                style={{
                  display: "block",
                  marginBottom: 8,
                  color: colors.textSecondary,
                  fontWeight: 700,
                }}
              >
                {label}
              </label>
              <input
                type="password"
                value={keys[key]}
                onChange={(e) => setKeys({ ...keys, [key]: e.target.value })}
                style={pageStyles.input}
              />
              <div
                style={{ color: colors.textMuted, fontSize: 13, marginTop: 8 }}
              >
                {helper}
              </div>
            </div>
          ))}

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 12,
              flexWrap: "wrap",
              marginTop: 20,
            }}
          >
            <div style={{ color: colors.textMuted, maxWidth: 720 }}>
              {status ||
                "Les clés sont injectées pour la session courante uniquement. Pour une production propre, il faut ensuite sécuriser la configuration côté serveur et éviter l’endpoint debug public."}
            </div>
            <button onClick={handleSave} style={pageStyles.buttonPrimary}>
              Enregistrer les clés
            </button>
          </div>
        </div>
      </section>
    </WebShell>
  );
};

export default SettingsPage;
