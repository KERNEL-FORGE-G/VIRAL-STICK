import React, { useState, useMemo, useEffect } from "react";
import { useLocation } from "react-router-dom";
import CompanionAvatarWeb from "../components/CompanionAvatarWeb";
import WebShell from "../components/WebShell";
import PremiumButton from "../components/PremiumButton";
import WhatsAppShareButton from "../components/WhatsAppShareButton";
import { colors, radius } from "../theme/tokens";

const FILTERS = [
  { id: "none",     label: "Original", emoji: "📷" },
  { id: "dramatic", label: "Dramatic",  emoji: "🌑" },
  { id: "neon",     label: "Neon",      emoji: "💫" },
  { id: "vintage",  label: "Vintage",   emoji: "🎞️" },
  { id: "fire",     label: "Fire",      emoji: "🔥" },
];

const RemixPage = () => {
  const locationState = useLocation().state;
  const [remixText, setRemixText]               = useState("");
  const [inputImageBase64, setInputImageBase64] = useState("");
  const [filter, setFilter]                     = useState("none");
  const [loading, setLoading]                   = useState(false);
  const [result, setResult]                     = useState(null);
  const [error, setError]                       = useState("");
  const [published, setPublished]               = useState(false);
  const [sourceMemeId, setSourceMemeId]         = useState(null);

  useEffect(() => {
    if (locationState?.imageUrl) {
      // Si on vient du forum avec une image
      setInputImageBase64(locationState.imageUrl);
    }
    if (locationState?.text) {
      setRemixText(locationState.text);
    }
    if (locationState?.sourceMemeId) {
      setSourceMemeId(locationState.sourceMemeId);
    }
  }, [locationState]);

  const shareText = useMemo(() => {
    if (!result) return remixText;
    return [result.meme_text, result.companionComment].filter(Boolean).join("\n\n");
  }, [result, remixText]);

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setInputImageBase64(String(reader.result));
    reader.readAsDataURL(file);
  };

  const handleRemix = async () => {
    if (!remixText.trim() && !inputImageBase64) return;
    setLoading(true); setError(""); setResult(null); setPublished(false);
    try {
      const res  = await fetch("/api/memes/status-remixer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: remixText, inputImageBase64: inputImageBase64 || undefined }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Erreur remix");
      setResult(data);
    } catch (e) { setError(e.message); }
    setLoading(false);
  };

  const publishToForum = async () => {
    if (!result || published) return;
    try {
      const res = await fetch("/api/forum/publish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          shareId: result.share?.shareId,
          imageUrl: result.share?.publicUrl || result.imageUrl,
          topText: result.meme_text,
          bottomText: result.companionComment,
          sourceMemeId: sourceMemeId
        }),
      });
      if (res.ok) {
        setPublished(true);
      } else {
        const errData = await res.json();
        alert("Erreur publication: " + (errData.error || res.statusText));
      }
    } catch (e) {
      console.error(e);
      alert("Erreur réseau lors de la publication");
    }
  };

  const overlayColor = {
    dramatic: "rgba(0,0,0,0.55)",
    neon:     "rgba(34,211,238,0.22)",
    vintage:  "rgba(193,132,79,0.24)",
    fire:     "rgba(239,68,68,0.28)",
  }[filter] || "transparent";

  return (
    <WebShell companion="bio" title="Status Remixer">
      {/* En-tête */}
      <div style={{ marginBottom: 32 }}>
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 8,
          background: `${colors.bio}22`, color: colors.bio,
          padding: "5px 14px", borderRadius: radius.pill,
          fontSize: 13, fontWeight: 800, marginBottom: 12,
        }}>
          MODULE 03 · STATUS REMIXER
        </div>
        <h1 style={{
          fontFamily: "'Fredoka One', cursive", fontSize: 40,
          color: colors.almostBlack, margin: "0 0 8px",
        }}>
          Remixe ton <span style={{ color: colors.bio }}>visuel</span>
        </h1>
        <p style={{ fontFamily: "'Nunito', sans-serif", fontSize: 16, color: colors.graphite, margin: 0 }}>
          Charge une image ou décris une intention — l'IA génère la caption parfaite.
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32, alignItems: "start" }}>

        {/* ── Formulaire ── */}
        <div className="duo-card" style={{ padding: 32 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
            <CompanionAvatarWeb companion="bio" size={56} />
            <div>
              <div style={{ fontFamily: "'Fredoka One', cursive", fontSize: 18, color: colors.almostBlack }}>Bio</div>
              <div style={{ fontFamily: "'Nunito', sans-serif", fontSize: 13, color: colors.silver, fontWeight: 600 }}>
                Énergie visuelle
              </div>
            </div>
          </div>

          {/* Caption */}
          <label style={{ display: "block", fontFamily: "'Nunito', sans-serif",
            fontWeight: 800, fontSize: 14, color: colors.charcoal, marginBottom: 8 }}>
            Caption / Intention créative
          </label>
          <textarea
            value={remixText}
            onChange={(e) => setRemixText(e.target.value)}
            placeholder="Ex: Mème sur la procrastination avec une énergie feu…"
            className="duo-input"
            rows={4}
            style={{ resize: "vertical", marginBottom: 24 }}
          />

          {/* Upload image */}
          <label style={{ display: "block", fontFamily: "'Nunito', sans-serif",
            fontWeight: 800, fontSize: 14, color: colors.charcoal, marginBottom: 8 }}>
            Image source (optionnel)
          </label>
          <label style={{
            display: "flex", flexDirection: "column", alignItems: "center", gap: 10,
            border: `2px dashed ${colors.cloudGray}`, borderRadius: radius.md,
            padding: "28px 20px", cursor: "pointer", background: colors.bgSecondary,
            marginBottom: 24, transition: "border-color 0.2s ease",
          }}
            onMouseEnter={(e) => e.currentTarget.style.borderColor = colors.duoGreen}
            onMouseLeave={(e) => e.currentTarget.style.borderColor = colors.cloudGray}
          >
            <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: "none" }} />
            <span style={{ fontSize: 32 }}>{inputImageBase64 ? "✅" : "🖼️"}</span>
            <span style={{ fontFamily: "'Nunito', sans-serif", fontSize: 14, color: colors.silver, fontWeight: 700 }}>
              {inputImageBase64 ? "Image chargée !" : "Clique pour choisir une image"}
            </span>
          </label>

          {/* Filtres */}
          <label style={{ display: "block", fontFamily: "'Nunito', sans-serif",
            fontWeight: 800, fontSize: 14, color: colors.charcoal, marginBottom: 8 }}>
            Filtre visuel
          </label>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 24 }}>
            {FILTERS.map((f) => (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                style={{
                  display: "flex", alignItems: "center", gap: 6,
                  padding: "8px 14px", borderRadius: radius.md, cursor: "pointer",
                  fontFamily: "'Nunito', sans-serif", fontWeight: 700, fontSize: 13,
                  background: filter === f.id ? colors.duoGreenLight : colors.bgSecondary,
                  color: filter === f.id ? colors.duoGreenDark : colors.graphite,
                  border: `2px solid ${filter === f.id ? colors.duoGreen : colors.cloudGray}`,
                  transition: "all 0.15s ease",
                }}
              >
                {f.emoji} {f.label}
              </button>
            ))}
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
            onClick={handleRemix}
            disabled={loading || (!remixText.trim() && !inputImageBase64)}
            style={{ width: "100%", justifyContent: "center" }}
          >
            {loading ? "Remix en cours..." : "✨ Lancer le Remix IA"}
          </PremiumButton>
        </div>

        {/* ── Canvas résultat ── */}
        <div className="duo-card" style={{ padding: 32, minHeight: 480 }}>
          {/* Canvas visuel */}
          <div style={{
            position: "relative", borderRadius: radius.lg,
            overflow: "hidden", minHeight: 280,
            background: colors.almostBlack,
            border: `2px solid ${result ? colors.duoGreen : colors.cloudGray}`,
            marginBottom: 24,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            {result?.imageUrl ? (
              <img src={result.imageUrl} alt="Remix" style={{ width: "100%", height: "100%", objectFit: "cover", position: "absolute", inset: 0 }} />
            ) : inputImageBase64 ? (
              <img src={inputImageBase64} alt="Source" style={{ width: "100%", height: "100%", objectFit: "cover", position: "absolute", inset: 0, opacity: 0.4 }} />
            ) : (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12, padding: 32, opacity: 0.5 }}>
                <CompanionAvatarWeb companion="bio" size={96} floating />
                <span style={{ fontFamily: "'Nunito', sans-serif", color: "rgba(255,255,255,0.5)", fontSize: 14, fontWeight: 600 }}>
                  Aperçu du remix
                </span>
              </div>
            )}
            {/* Overlay filtre */}
            <div style={{ position: "absolute", inset: 0, background: overlayColor, pointerEvents: "none" }} />
          </div>

          {result ? (
            <div style={{ animation: "fadeUp 0.4s ease" }}>
              <div style={{
                background: colors.duoGreenLight, borderRadius: radius.md,
                border: `2px solid ${colors.duoGreen}44`, padding: 16, marginBottom: 16,
              }}>
                <div style={{ fontFamily: "'Fredoka One', cursive", fontSize: 20, color: colors.almostBlack, marginBottom: 6 }}>
                  {result.meme_text || "Caption générée"}
                </div>
                <div style={{ fontFamily: "'Nunito', sans-serif", fontSize: 13, color: colors.charcoal }}>
                  {result.companionComment || "Remix prêt à poster."}
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <WhatsAppShareButton
                  text={shareText}
                  url={result.share?.publicUrl}
                  imageDataUrl={result.share?.imageDataUrl}
                  label="Partager le remix"
                  style={{ width: "100%", justifyContent: "center" }}
                />

                {!published ? (
                  <PremiumButton variant="green" onClick={publishToForum} style={{ width: "100%" }}>
                    🌍 Propulser sur le Forum
                  </PremiumButton>
                ) : (
                  <div style={{ textAlign: "center", padding: 12, background: colors.duoGreenLight, color: colors.duoGreenDark, borderRadius: radius.md, fontWeight: 800 }}>
                    ✅ Remix publié !
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div style={{ textAlign: "center", padding: 16 }}>
              <p style={{ fontFamily: "'Nunito', sans-serif", fontSize: 14, color: colors.silver, fontWeight: 600 }}>
                Le résultat IA s'affichera ici après le remix.
              </p>
            </div>
          )}
        </div>
      </div>
    </WebShell>
  );
};

export default RemixPage;
