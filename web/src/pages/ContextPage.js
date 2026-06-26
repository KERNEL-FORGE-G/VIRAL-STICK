import React, { useState } from "react";
import CompanionAvatarWeb from "../components/CompanionAvatarWeb";
import WebShell from "../components/WebShell";
import PremiumButton from "../components/PremiumButton";
import WhatsAppShareButton from "../components/WhatsAppShareButton";
import AppIcon from "../components/AppIcon";
import { colors, radius } from "../theme/tokens";

const LOCATIONS = [
  { value: "france",       label: "🇫🇷 France" },
  { value: "cameroun",     label: "🇨🇲 Cameroun" },
  { value: "senegal",      label: "🇸🇳 Sénégal" },
  { value: "coteivoire",   label: "🇨🇮 Côte d'Ivoire" },
  { value: "international",label: "🌍 International" },
];

const ContextPage = () => {
  const [context, setContext]   = useState("");
  const [location, setLocation] = useState("france");
  const [shareToForum, setShareToForum] = useState(true);
  const [loading, setLoading]   = useState(false);
  const [result, setResult]     = useState(null);
  const [error, setError]       = useState("");

  const generate = async () => {
    if (!context.trim()) return;
    setLoading(true); setError(""); setResult(null);
    try {
      const res  = await fetch("/api/memes/generate-from-text", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: context, location, shareToForum }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Erreur serveur");
      setResult(data);
    } catch (e) { setError(e.message); }
    setLoading(false);
  };

  return (
    <WebShell companion="art" title="Context Reader">
      {/* En-tête */}
      <div style={{ marginBottom: 32 }}>
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 8,
          background: colors.duoGreenLight, color: colors.duoGreenDark,
          padding: "5px 14px", borderRadius: radius.pill,
          fontSize: 13, fontWeight: 800, marginBottom: 12,
        }}>
          MODULE 01 · CONTEXT READER
        </div>
        <h1 style={{
          fontFamily: "'Fredoka One', cursive", fontSize: 40,
          color: colors.almostBlack, margin: "0 0 8px",
        }}>
          Transforme ton texte en <span style={{ color: colors.duoGreen }}>mème</span>
        </h1>
        <p style={{ fontFamily: "'Nunito', sans-serif", fontSize: 16, color: colors.graphite, margin: 0 }}>
          Décris une situation et l'IA génère le mème parfait, adapté à ta culture.
        </p>
      </div>

      {/* Layout 2 colonnes */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32, alignItems: "start" }}>

        {/* ── Formulaire ── */}
        <div className="duo-card" style={{ padding: 32 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
            <CompanionAvatarWeb companion="art" size={56} />
            <div>
              <div style={{ fontFamily: "'Fredoka One', cursive", fontSize: 18, color: colors.almostBlack }}>Art</div>
              <div style={{ fontFamily: "'Nunito', sans-serif", fontSize: 13, color: colors.silver, fontWeight: 600 }}>
                Direction artistique
              </div>
            </div>
          </div>

          {/* Localisation */}
          <label style={{ display: "block", fontFamily: "'Nunito', sans-serif", fontWeight: 800,
            fontSize: 14, color: colors.charcoal, marginBottom: 8 }}>
            Contexte culturel
          </label>
          <select
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="duo-input"
            style={{ marginBottom: 24 }}
          >
            {LOCATIONS.map((l) => (
              <option key={l.value} value={l.value}>{l.label}</option>
            ))}
          </select>

          {/* Texte */}
          <label style={{ display: "block", fontFamily: "'Nunito', sans-serif", fontWeight: 800,
            fontSize: 14, color: colors.charcoal, marginBottom: 8 }}>
            Décris la situation
          </label>
          <textarea
            value={context}
            onChange={(e) => setContext(e.target.value)}
            placeholder="Ex: Mon pote a dit qu'il arrive dans 5 minutes... il y a 2 heures."
            className="duo-input"
            rows={6}
            style={{ resize: "vertical", marginBottom: 8 }}
          />
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
            <span style={{ fontFamily: "'Nunito', sans-serif", fontSize: 12, color: colors.silver, fontWeight: 600 }}>
              {context.length}/500 caractères
            </span>
            {/* Progress */}
            <div style={{
              width: 120, height: 6, background: colors.cloudGray, borderRadius: radius.pill, overflow: "hidden",
            }}>
              <div style={{
                height: "100%", borderRadius: radius.pill, background: colors.duoGreen,
                width: `${Math.min((context.length / 500) * 100, 100)}%`,
                transition: "width 0.3s ease",
              }} />
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24, padding: "0 4px" }}>
            <input
              type="checkbox"
              id="shareToForum"
              checked={shareToForum}
              onChange={(e) => setShareToForum(e.target.checked)}
              style={{ width: 18, height: 18, accentColor: colors.duoGreen }}
            />
            <label htmlFor="shareToForum" style={{ fontFamily: "'Nunito', sans-serif", fontSize: 14, fontWeight: 700, color: colors.charcoal, cursor: "pointer" }}>
              Partager sur le Forum public 🌍
            </label>
          </div>

          {error && (
            <div style={{
              background: "#fff0f0", border: `2px solid ${colors.danger}33`,
              borderRadius: radius.md, padding: 12, marginBottom: 16,
              fontFamily: "'Nunito', sans-serif", fontSize: 14, color: colors.danger, fontWeight: 700,
            }}>
              ⚠️ {error}
            </div>
          )}

          <PremiumButton
            variant="primary"
            onClick={generate}
            disabled={loading || !context.trim()}
            style={{ width: "100%", justifyContent: "center" }}
            icon={<AppIcon name="context" size={18} color="#fff" />}
          >
            {loading ? "Génération en cours..." : "Générer le mème"}
          </PremiumButton>
        </div>

        {/* ── Résultat ── */}
        <div className="duo-card" style={{ padding: 32, minHeight: 480 }}>
          {!result ? (
            <div style={{
              height: "100%", display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "center", gap: 20, opacity: 0.6,
              minHeight: 360,
            }}>
              <div style={{ animation: "floatSoft 3s ease-in-out infinite" }}>
                <CompanionAvatarWeb companion="art" size={120} />
              </div>
              <p style={{
                fontFamily: "'Nunito', sans-serif", fontSize: 16, color: colors.silver,
                fontWeight: 600, textAlign: "center", margin: 0,
              }}>
                Ton mème apparaîtra ici après génération.
              </p>
            </div>
          ) : (
            <div style={{ animation: "fadeUp 0.4s ease" }}>
              {/* Tag */}
              <div style={{
                display: "inline-flex", alignItems: "center", gap: 6,
                background: colors.duoGreenLight, color: colors.duoGreenDark,
                padding: "4px 12px", borderRadius: radius.pill,
                fontSize: 12, fontWeight: 800, marginBottom: 24,
              }}>
                ✅ MÈME GÉNÉRÉ
              </div>

              {/* Aperçu mème final (Utilise le Cloudinary URL ou Composed Image) */}
              <div style={{
                background: colors.almostBlack, borderRadius: radius.lg,
                padding: 0, overflow: "hidden", textAlign: "center", marginBottom: 24,
                border: `3px solid ${colors.cloudGray}`,
                boxShadow: "0 4px 0 #e5e5e5"
              }}>
                <img
                  src={result.composedImageUrl || result.share?.imageDataUrl || result.imageUrl}
                  alt="Mème généré"
                  style={{ width: "100%", height: "auto", display: "block" }}
                />
              </div>

              {/* Commentaire du compagnon */}
              <div style={{
                background: colors.bgSecondary, padding: 16, borderRadius: radius.md,
                marginBottom: 24, border: `2px solid ${colors.cloudGray}`
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                  <CompanionAvatarWeb companion="art" size={24} />
                  <span style={{ fontWeight: 800, fontSize: 13, color: colors.art }}>Art dit :</span>
                </div>
                <p style={{ fontStyle: "italic", fontSize: 14, margin: 0, color: colors.almostBlack }}>
                  "{result.companionComment}"
                </p>
              </div>

              <WhatsAppShareButton
                text={result.share?.text || `${result.topText}\n${result.bottomText}`}
                url={result.share?.publicUrl}
                imageDataUrl={result.share?.imageDataUrl}
                label="Partager ce mème"
                style={{ width: "100%", justifyContent: "center" }}
              />
            </div>
          )}
        </div>
      </div>
    </WebShell>
  );
};

export default ContextPage;
