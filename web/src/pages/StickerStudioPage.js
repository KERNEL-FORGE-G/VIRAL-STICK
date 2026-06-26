import React, { useRef, useState } from "react";
import CompanionAvatarWeb from "../components/CompanionAvatarWeb";
import WebShell from "../components/WebShell";
import PremiumButton from "../components/PremiumButton";
import { colors, radius } from "../theme/tokens";

const ANIMATIONS = [
  { value: "bounce", label: "Bounce" },
  { value: "pulse", label: "Pulse" },
  { value: "wiggle", label: "Wiggle" },
];

const StickerStudioPage = () => {
  const [stickerFile, setStickerFile] = useState(null);
  const [faceFile, setFaceFile] = useState(null);
  const [stickerPreview, setStickerPreview] = useState(null);
  const [facePreview, setFacePreview] = useState(null);
  const [instruction, setInstruction] = useState("");
  const [topText, setTopText] = useState("");
  const [bottomText, setBottomText] = useState("");
  const [outputFormat, setOutputFormat] = useState("png");
  const [animation, setAnimation] = useState("bounce");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [recording, setRecording] = useState(false);
  const [error, setError] = useState("");

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const handleFile = (e, type) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    if (type === "sticker") {
      setStickerFile(file);
      setStickerPreview(url);
    } else {
      setFaceFile(file);
      setFacePreview(url);
    }
  };

  const startVoice = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];
      const mr = new MediaRecorder(stream);
      mediaRecorderRef.current = mr;
      mr.ondataavailable = (ev) => { if (ev.data.size) audioChunksRef.current.push(ev.data); };
      mr.onstop = async () => {
        stream.getTracks().forEach((t) => t.stop());
        const blob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        const form = new FormData();
        form.append("audio", blob, "voice.webm");
        setLoading(true);
        try {
          const res = await fetch("/api/memes/transcribe", { method: "POST", body: form });
          const data = await res.json();
          if (data.transcription) setInstruction(data.transcription);
        } catch {
          setError("Transcription vocale indisponible.");
        }
        setLoading(false);
      };
      mr.start();
      setRecording(true);
    } catch {
      setError("Microphone inaccessible. Autorise l'accès au micro.");
    }
  };

  const stopVoice = () => {
    mediaRecorderRef.current?.stop();
    setRecording(false);
  };

  const generate = async () => {
    if (!stickerFile) { setError("Sélectionne un sticker."); return; }
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const form = new FormData();
      form.append("sticker", stickerFile);
      if (faceFile) form.append("face", faceFile);
      form.append("instruction", instruction);
      form.append("topText", topText);
      form.append("bottomText", bottomText);
      form.append("outputFormat", outputFormat);
      form.append("animation", animation);

      const res = await fetch("/api/sticker/studio", { method: "POST", body: form });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erreur studio");
      setResult(data);
    } catch (e) {
      setError(e.message);
    }
    setLoading(false);
  };

  const download = () => {
    if (!result?.dataUrl) return;
    const ext = outputFormat === "gif" ? "gif" : "png";
    const a = document.createElement("a");
    a.href = result.dataUrl;
    a.download = `viral-stick-sticker.${ext}`;
    a.click();
  };

  return (
    <WebShell companion="art" title="Sticker Studio">
      <div style={{ marginBottom: 28 }}>
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 8,
          background: colors.duoGreenLight, color: colors.duoGreenDark,
          padding: "5px 14px", borderRadius: radius.pill, fontSize: 13, fontWeight: 800, marginBottom: 12,
        }}>
          MODULE 04 · STICKER STUDIO
        </div>
        <h1 style={{ fontFamily: "'Fredoka One', cursive", fontSize: 36, color: colors.almostBlack, margin: "0 0 8px" }}>
          Crée ton <span style={{ color: colors.duoGreen }}>sticker</span>
        </h1>
        <p style={{ fontFamily: "'Nunito', sans-serif", fontSize: 15, color: colors.graphite, margin: 0 }}>
          Upload un sticker, ajoute un visage, dis à voix haute ce que tu veux, exporte en PNG ou GIF.
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 24 }}>
        <div className="duo-card" style={{ padding: 24 }}>
          <h3 style={{ fontFamily: "'Fredoka One', cursive", margin: "0 0 16px" }}>1. Sticker de base</h3>
          <input type="file" accept="image/*" onChange={(e) => handleFile(e, "sticker")} />
          {stickerPreview && (
            <img src={stickerPreview} alt="Sticker" style={{ marginTop: 16, maxWidth: "100%", borderRadius: radius.md, border: `2px solid ${colors.cloudGray}` }} />
          )}
        </div>
        <div className="duo-card" style={{ padding: 24 }}>
          <h3 style={{ fontFamily: "'Fredoka One', cursive", margin: "0 0 16px" }}>2. Visage à coller</h3>
          <input type="file" accept="image/*" onChange={(e) => handleFile(e, "face")} />
          {facePreview && (
            <img src={facePreview} alt="Visage" style={{ marginTop: 16, maxWidth: "100%", borderRadius: radius.md, border: `2px solid ${colors.cloudGray}` }} />
          )}
        </div>
      </div>

      <div className="duo-card" style={{ padding: 24, marginBottom: 24 }}>
        <h3 style={{ fontFamily: "'Fredoka One', cursive", margin: "0 0 16px" }}>3. Instructions</h3>
        <textarea
          value={instruction}
          onChange={(e) => setInstruction(e.target.value)}
          placeholder="Décris ce que le sticker doit faire..."
          className="duo-input"
          style={{ width: "100%", minHeight: 80, marginBottom: 12 }}
        />
        <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
          <PremiumButton variant={recording ? "danger" : "secondary"} onClick={recording ? stopVoice : startVoice}>
            {recording ? "⏹ Arrêter" : "🎙️ Dire à voix haute"}
          </PremiumButton>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <input value={topText} onChange={(e) => setTopText(e.target.value)} placeholder="Texte haut (optionnel)" className="duo-input" />
          <input value={bottomText} onChange={(e) => setBottomText(e.target.value)} placeholder="Texte bas (optionnel)" className="duo-input" />
        </div>
      </div>

      <div className="duo-card" style={{ padding: 24, marginBottom: 24 }}>
        <h3 style={{ fontFamily: "'Fredoka One', cursive", margin: "0 0 16px" }}>4. Export</h3>
        <div style={{ display: "flex", gap: 16, alignItems: "center", flexWrap: "wrap" }}>
          <label style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 700 }}>
            Format :
            <select value={outputFormat} onChange={(e) => setOutputFormat(e.target.value)} className="duo-input" style={{ marginLeft: 8 }}>
              <option value="png">PNG (sticker statique)</option>
              <option value="gif">GIF (animé)</option>
            </select>
          </label>
          {outputFormat === "gif" && (
            <label style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 700 }}>
              Animation :
              <select value={animation} onChange={(e) => setAnimation(e.target.value)} className="duo-input" style={{ marginLeft: 8 }}>
                {ANIMATIONS.map((a) => <option key={a.value} value={a.value}>{a.label}</option>)}
              </select>
            </label>
          )}
          <PremiumButton variant="primary" onClick={generate} disabled={loading || !stickerFile}>
            {loading ? "Génération..." : "✨ Générer le sticker"}
          </PremiumButton>
        </div>
      </div>

      {error && (
        <div style={{ padding: 16, background: "#ffe0e0", borderRadius: radius.md, marginBottom: 16, color: colors.danger, fontWeight: 700 }}>
          {error}
        </div>
      )}

      {result && (
        <div className="duo-card" style={{ padding: 24, textAlign: "center" }}>
          <CompanionAvatarWeb companion="art" size={64} />
          <h3 style={{ fontFamily: "'Fredoka One', cursive", margin: "16px 0" }}>Sticker prêt !</h3>
          <img src={result.dataUrl} alt="Résultat" style={{ maxWidth: 320, borderRadius: radius.lg, border: `2px solid ${colors.cloudGray}` }} />
          <div style={{ marginTop: 20 }}>
            <PremiumButton variant="primary" onClick={download}>
              ⬇️ Télécharger {outputFormat.toUpperCase()}
            </PremiumButton>
          </div>
        </div>
      )}
    </WebShell>
  );
};

export default StickerStudioPage;
