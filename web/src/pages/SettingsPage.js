import React, { useState, useEffect } from "react";
import CompanionAvatarWeb from "../components/CompanionAvatarWeb";
import WebShell from "../components/WebShell";
import PremiumButton from "../components/PremiumButton";
import { colors, radius } from "../theme/tokens";

const API_FIELDS = [
  { key: "GEMINI_API_KEY",     label: "Google Gemini",   helper: "Primaire texte/mème — Gemini 2.5 Flash (quota généreux, fortement recommandé).", emoji: "💎" },
  { key: "GROQ_API_KEY",       label: "Groq Whisper",    helper: "Primaire audio — Whisper large-v3 gratuit et ultra-rapide. Obtenir sur console.groq.com", emoji: "🎙️" },
  { key: "MISTRAL_API_KEY",    label: "Mistral AI",      helper: "Fallback texte 1 — très bon en français.",                                          emoji: "🌊" },
  { key: "PUTER_KEY",          label: "Puter",           helper: "Fallback texte 2 + image + audio — modèles OpenAI-compat.",                          emoji: "🖥️" },
  { key: "DEEPSEEK_API_KEY",   label: "DeepSeek",        helper: "Fallback texte 3 — fort en raisonnement structuré.",                                 emoji: "🔍" },
  { key: "OPENROUTER_API_KEY", label: "OpenRouter",      helper: "Fallback texte 4 — filet de sécurité ultime (50+ modèles disponibles).",             emoji: "🔀" },
];

const FIELDS_NOTE = "💡 Pollinations.ai (génération d'image) est 100% gratuit et ne nécessite aucune clé.";

const SettingsPage = () => {
  const [keys, setKeys] = useState({
    GEMINI_API_KEY:     "",
    GROQ_API_KEY:       "",
    MISTRAL_API_KEY:    "",
    PUTER_KEY:          "",
    DEEPSEEK_API_KEY:   "",
    OPENROUTER_API_KEY: "",
  });
  const [show, setShow]         = useState(false);
  const [status, setStatus]     = useState(null);
  const [saving, setSaving]     = useState(false);
  const [updatable, setUpdatable] = useState(true);
  const [checked, setChecked]   = useState(false);

  useEffect(() => {
    fetch("/api/debug/keys-status")
      .then((r) => r.json())
      .then((d) => setUpdatable(!!d.updatable))
      .catch(() => setUpdatable(false))
      .finally(() => setChecked(true));
  }, []);

  const handleSave = async () => {
    setSaving(true); setStatus(null);
    try {
      const res = await fetch("/api/debug/update-keys", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(keys),
      });
      setStatus({ ok: res.ok, msg: res.ok ? "Clés enregistrées avec succès !" : "Erreur lors de l'enregistrement." });
    } catch {
      setStatus({ ok: false, msg: "Serveur backend inaccessible." });
    } finally { setSaving(false); }
  };

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
            Configure tes clés API pour activer les différents moteurs d'intelligence artificielle.
          </p>
        </div>
        <div style={{ animation: "floatSoft 4s ease-in-out infinite" }}>
          <CompanionAvatarWeb companion="para" size={120} />
        </div>
      </div>

      {/* Formulaire clés */}
      <div className="duo-card" style={{ padding: 40, marginBottom: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
          <h2 style={{ fontFamily: "'Fredoka One', cursive", fontSize: 26, color: colors.almostBlack, margin: 0 }}>
            🔑 Clés API
          </h2>
          <button
            onClick={() => setShow((v) => !v)}
            style={{
              fontFamily: "'Nunito', sans-serif", fontWeight: 700, fontSize: 14,
              padding: "8px 18px", borderRadius: radius.md, cursor: "pointer",
              background: colors.bgSecondary, border: `2px solid ${colors.cloudGray}`,
              color: colors.charcoal, transition: "all 0.15s ease",
            }}
          >
            {show ? "🙈 Masquer" : "👁️ Afficher"}
          </button>
        </div>

          {checked && !updatable && (
            <div style={{
              marginTop: 0, marginBottom: 24, padding: "12px 20px", borderRadius: radius.md,
              background: `${colors.skyBlue}15`, border: `2px solid ${colors.skyBlue}44`,
              fontFamily: "'Nunito', sans-serif", fontSize: 14, fontWeight: 700,
              color: colors.charcoal,
            }}>
              ℹ️ La mise à jour des clés depuis cette page n'est disponible qu'en environnement de développement local.
              En production, configure les clés directement dans les variables d'environnement du serveur (Vercel / GitHub Actions).
            </div>
          )}

        <div style={{ display: "grid", gap: 24 }}>
          {API_FIELDS.map((f) => (
            <div key={f.key}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <label style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 800, fontSize: 15, color: colors.charcoal, display: "flex", alignItems: "center", gap: 8 }}>
                  <span>{f.emoji}</span> {f.label}
                </label>
                <span style={{ fontFamily: "monospace", fontSize: 11, color: colors.silver, background: colors.bgSecondary,
                  padding: "2px 8px", borderRadius: radius.sm }}>
                  {f.key}
                </span>
              </div>
              <input
                type={show ? "text" : "password"}
                value={keys[f.key]}
                onChange={(e) => setKeys({ ...keys, [f.key]: e.target.value })}
                placeholder="Colle ta clé ici..."
                className="duo-input"
                disabled={!updatable}
              />
              <p style={{ fontFamily: "'Nunito', sans-serif", fontSize: 13, color: colors.silver, margin: "6px 0 0", fontWeight: 600 }}>
                {f.helper}
              </p>
            </div>
          ))}
        </div>

        {/* Status */}
        {status && (
          <div style={{
            marginTop: 24, padding: "12px 20px", borderRadius: radius.md,
            background: status.ok ? colors.duoGreenLight : "#ffe0e0",
            border: `2px solid ${status.ok ? colors.duoGreen : colors.danger}44`,
            fontFamily: "'Nunito', sans-serif", fontSize: 14, fontWeight: 700,
            color: status.ok ? colors.duoGreenDark : colors.danger,
          }}>
            {status.ok ? "✅" : "⚠️"} {status.msg}
          </div>
        )}

        {/* Bouton save */}
        <div style={{ marginTop: 32, display: "flex", justifyContent: "flex-end" }}>
          <PremiumButton variant="primary" onClick={handleSave} disabled={saving || !updatable} style={{ minWidth: 220, justifyContent: "center" }}>
            {saving ? "Enregistrement..." : "💾 Enregistrer les clés"}
          </PremiumButton>
        </div>
      </div>

      {/* Info sécurité */}
      <div style={{
        display: "flex", alignItems: "flex-start", gap: 14,
        background: `${colors.skyBlue}15`, border: `2px solid ${colors.skyBlue}33`,
        borderRadius: radius.lg, padding: 20,
      }}>
        <span style={{ fontSize: 20 }}>ℹ️</span>
        <p style={{ fontFamily: "'Nunito', sans-serif", fontSize: 14, color: colors.charcoal, margin: 0, lineHeight: 1.6, fontWeight: 600 }}>
          Les clés sont transmises au serveur backend et stockées en mémoire pour la session courante.
          Ne partage jamais tes clés dans un environnement public. Pour la production, configure-les
          directement dans les variables d'environnement du serveur.
        </p>
      </div>
    </WebShell>
  );
};

export default SettingsPage;
