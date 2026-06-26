import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import CompanionAvatarWeb from "../components/CompanionAvatarWeb";
import WebShell from "../components/WebShell";
import PremiumButton from "../components/PremiumButton";
import WhatsAppShareButton from "../components/WhatsAppShareButton";
import { colors, radius } from "../theme/tokens";
import { useUser } from "../contexts/UserContext";

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
  const [loading, setLoading]   = useState(false);
  const [result, setResult]     = useState(null);
  const [error, setError]       = useState("");
  const [published, setPublished] = useState(false);
  const { userId, username } = useUser();
  const navigate = useNavigate();

  const generate = async () => {
    if (!context.trim()) return;
    setLoading(true); setError(""); setResult(null); setPublished(false);
    try {
      const res  = await fetch("/api/memes/generate-from-text", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: context, location }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Erreur serveur");
      setResult(data);
    } catch (e) { setError(e.message); }
    setLoading(false);
  };

  const publishToForum = async () => {
    if (!result || published) return;
    if (!userId) {
      navigate("/auth");
      return;
    }
    try {
      const res = await fetch("/api/forum/publish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          shareId: result.share?.shareId,
          imageUrl: result.share?.publicUrl || result.imageUrl,
          topText: result.topText,
          bottomText: result.bottomText,
          userId,
          username
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

  return (
    <WebShell companion="art" title="Context Reader">
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontFamily: "'Fredoka One', cursive", fontSize: 40, color: colors.almostBlack, margin: "0 0 8px" }}>
          Context <span style={{ color: colors.duoGreen }}>Reader</span>
        </h1>
        <p style={{ fontFamily: "'Nunito', sans-serif", fontSize: 16, color: colors.graphite, margin: 0 }}>
          Décris une situation, l'IA s'occupe de la chute.
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32, alignItems: "start" }}>
        <div className="duo-card" style={{ padding: 32 }}>
          <label style={{ display: "block", fontWeight: 800, fontSize: 14, marginBottom: 8 }}>CONTEXTE CULTUREL</label>
          <select value={location} onChange={(e) => setLocation(e.target.value)} className="duo-input" style={{ marginBottom: 24 }}>
            {LOCATIONS.map((l) => (<option key={l.value} value={l.value}>{l.label}</option>))}
          </select>

          <label style={{ display: "block", fontWeight: 800, fontSize: 14, marginBottom: 8 }}>SITUATION</label>
          <textarea
            value={context} onChange={(e) => setContext(e.target.value)}
            placeholder="Ex: Mon pote me dit 'j'arrive'..." className="duo-input"
            rows={6} style={{ resize: "vertical", marginBottom: 24 }}
          />

          <PremiumButton variant="primary" onClick={generate} disabled={loading || !context.trim()} style={{ width: "100%", justifyContent: "center" }}>
            {loading ? "Génération..." : "Générer le mème"}
          </PremiumButton>
        </div>

        <div className="duo-card" style={{ padding: 32, minHeight: 480 }}>
          {!result ? (
            <div style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", opacity: 0.6 }}>
              <CompanionAvatarWeb companion="art" size={120} floating />
              <p style={{ marginTop: 20, fontWeight: 600, color: colors.silver }}>Ton mème apparaîtra ici.</p>
            </div>
          ) : (
            <div style={{ animation: "fadeUp 0.4s ease" }}>
              <div style={{ background: "#000", borderRadius: radius.lg, overflow: "hidden", marginBottom: 24, border: `3px solid ${colors.cloudGray}` }}>
                <img src={result.composedImageUrl || result.share?.imageDataUrl || result.imageUrl} alt="Mème" style={{ width: "100%", display: "block" }} />
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <WhatsAppShareButton text={result.share?.text} url={result.share?.publicUrl} style={{ width: "100%" }} />

                {!published ? (
                  <PremiumButton variant="green" onClick={publishToForum} style={{ width: "100%" }}>
                    🌍 Propulser sur le Forum
                  </PremiumButton>
                ) : (
                  <div style={{ textAlign: "center", padding: 12, background: colors.duoGreenLight, color: colors.duoGreenDark, borderRadius: radius.md, fontWeight: 800 }}>
                    ✅ Publié avec succès !
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </WebShell>
  );
};

export default ContextPage;
