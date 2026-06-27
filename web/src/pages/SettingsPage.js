import React from "react";
import CompanionAvatarWeb from "../components/CompanionAvatarWeb";
import WebShell from "../components/WebShell";
import { colors, radius } from "../theme/tokens";

const SettingsPage = () => {
  return (
    <WebShell companion="para" title="Réglages">
      {/* Hero */}
      <div style={{
        display: "grid", gridTemplateColumns: "1fr auto", gap: 40,
        alignItems: "center", marginBottom: 40,
        background: colors.bgSecondary, borderRadius: radius.xl,
        border: `2px solid ${colors.cloudGray}`, padding: "40px 48px",
        boxShadow: "0 2px 0 #e5e5e5",
      }}>
        <div>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            background: `${colors.para}22`, color: colors.para,
            padding: "5px 14px", borderRadius: radius.pill,
            fontSize: 13, fontWeight: 800, marginBottom: 16,
          }}>
            ⚙️ CONFIGURATION IA
          </div>
          <h1 style={{ fontFamily: "'Fredoka One', cursive", fontSize: 40, color: colors.almostBlack, margin: "0 0 12px" }}>
            Réglages du <span style={{ color: colors.para }}>studio</span>
          </h1>
          <p style={{ fontFamily: "'Nunito', sans-serif", fontSize: 16, color: colors.graphite, margin: 0, maxWidth: 480, lineHeight: 1.6 }}>
            Les clés API sont gérées par le serveur Vercel. Configure uniquement les préférences d'affichage.
          </p>
        </div>
        <div style={{ animation: "floatSoft 4s ease-in-out infinite" }}>
          <CompanionAvatarWeb companion="para" size={120} />
        </div>
      </div>

      {/* Info serveur */}
      <div style={{
        display: "flex", alignItems: "flex-start", gap: 14,
        background: `${colors.skyBlue}15`, border: `2px solid ${colors.skyBlue}33`,
        borderRadius: radius.lg, padding: 20,
      }}>
        <span style={{ fontSize: 20 }}>ℹ️</span>
        <p style={{ fontFamily: "'Nunito', sans-serif", fontSize: 14, color: colors.charcoal, margin: 0, lineHeight: 1.6, fontWeight: 600 }}>
          Les clés API sont configurées sur le serveur backend (Vercel). L'application mobile et web utilisent
          automatiquement ces clés pour communiquer avec les providers IA (Gemini, Mistral, DeepSeek, Hugging Face).
        </p>
      </div>
    </WebShell>
  );
};

export default SettingsPage;
