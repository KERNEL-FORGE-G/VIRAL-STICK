import React, { useState } from "react";
import WebShell, { pageStyles } from "../components/WebShell";
import CompanionAvatarWeb from "../components/CompanionAvatarWeb";
import { colors } from "../theme/tokens";

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
      <section style={{ maxWidth: 820, margin: "0 auto" }}>
        <div style={{ ...pageStyles.panel, padding: 28 }}>
          <div
            style={{
              display: "flex",
              gap: 18,
              alignItems: "center",
              marginBottom: 22,
            }}
          >
            <CompanionAvatarWeb companion="para" size={110} />
            <div>
              <h1 style={{ margin: 0 }}>Paramètres IA</h1>
              <p style={{ color: colors.textSecondary }}>
                Écran repensé pour coller à l'identité du logo et au rôle de
                Para.
              </p>
            </div>
          </div>

          {[
            ["GEMINI_API_KEY", "Gemini API Key"],
            ["MISTRAL_API_KEY", "Mistral API Key"],
            ["DEEPSEEK_API_KEY", "DeepSeek API Key"],
          ].map(([key, label]) => (
            <div key={key} style={{ marginBottom: 16 }}>
              <label
                style={{
                  display: "block",
                  marginBottom: 8,
                  color: colors.textSecondary,
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
            <div style={{ color: colors.textMuted }}>
              {status ||
                "Les clés ne sont pas persistées au-delà de la session actuelle."}
            </div>
            <button onClick={handleSave} style={pageStyles.buttonPrimary}>
              Enregistrer
            </button>
          </div>
        </div>
      </section>
    </WebShell>
  );
};

export default SettingsPage;
