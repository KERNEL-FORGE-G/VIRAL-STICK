import React, { useState } from "react";
import CompanionAvatarWeb from "../components/CompanionAvatarWeb";
import WebShell, { pageStyles } from "../components/WebShell";
import PremiumButton from "../components/PremiumButton";
import AppIcon from "../components/AppIcon";
import WhatsAppShareButton from "../components/WhatsAppShareButton";
import { colors } from "../theme/tokens";

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
        body: JSON.stringify({ text: context, inputType, location }),
      });
      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error("Error:", error);
    }
    setLoading(false);
  };

  return (
    <WebShell title="Context Reader" companion="art">
      <section
        style={{ display: "grid", gridTemplateColumns: "1.1fr 0.9fr", gap: 24 }}
      >
        <div style={{ ...pageStyles.panel, padding: 28 }}>
          <div
            style={{
              display: "flex",
              gap: 18,
              alignItems: "center",
              marginBottom: 20,
            }}
          >
            <CompanionAvatarWeb companion="art" size={110} />
            <div>
              <h1 style={{ margin: 0, fontSize: 34 }}>Context Reader</h1>
              <p style={{ color: colors.textSecondary }}>
                Art lit le contexte, détecte l'angle drôle et construit une
                structure de mème plus premium.
              </p>
            </div>
          </div>

          <div style={{ display: "flex", gap: 10, marginBottom: 14 }}>
            {[
              ["text", "Texte", "context"],
              ["image", "Image décrite", "gallery"],
            ].map(([value, label, icon]) => (
              <PremiumButton
                key={value}
                onClick={() => setInputType(value)}
                variant={inputType === value ? "secondary" : "ghost"}
                icon={
                  <AppIcon
                    name={icon}
                    size={16}
                    color={
                      inputType === value ? colors.text : colors.textSecondary
                    }
                  />
                }
                style={{
                  background:
                    inputType === value
                      ? "linear-gradient(135deg, rgba(139,92,246,0.28), rgba(34,211,238,0.18))"
                      : "rgba(255,255,255,0.04)",
                  border: `1px solid ${inputType === value ? colors.brandPrimary : colors.border}`,
                  minHeight: 46,
                  padding: "12px 18px",
                }}
              >
                {label}
              </PremiumButton>
            ))}
          </div>

          <select
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            style={{ ...pageStyles.input, marginBottom: 14 }}
          >
            <option value="france">🇫🇷 France</option>
            <option value="cameroun">🇨🇲 Cameroun</option>
            <option value="senegal">🇸🇳 Sénégal</option>
            <option value="coteivoire">🇨🇮 Côte d'Ivoire</option>
            <option value="mali">🇲🇱 Mali</option>
            <option value="benin">🇧🇯 Bénin</option>
            <option value="congo">🇨🇬 Congo</option>
            <option value="rdc">🇨🇩 RDC</option>
            <option value="maroc">🇲🇦 Maroc</option>
            <option value="algerie">🇩🇿 Algérie</option>
            <option value="tunisie">🇹🇳 Tunisie</option>
            <option value="belgique">🇧🇪 Belgique</option>
            <option value="suisse">🇨🇭 Suisse</option>
            <option value="canada">🇨🇦 Québec</option>
            <option value="international">🌍 International</option>
          </select>

          <textarea
            value={context}
            onChange={(e) => setContext(e.target.value)}
            placeholder="Décris la situation, la discussion ou la scène à transformer en mème..."
            style={{ ...pageStyles.textarea, minHeight: 220 }}
          />

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: 16,
              gap: 16,
              flexWrap: "wrap",
            }}
          >
            <div style={{ color: colors.textMuted }}>
              {context.length} caractères
            </div>
            <PremiumButton
              onClick={generateMeme}
              disabled={loading || !context.trim()}
              icon={<AppIcon name="studio" size={18} color="#fff" />}
            >
              {loading ? "Génération..." : "Générer un mème plus fort"}
            </PremiumButton>
          </div>

          {result ? (
            <div
              style={{
                display: "flex",
                gap: 12,
                flexWrap: "wrap",
                marginTop: 14,
              }}
            >
              <WhatsAppShareButton
                text={`${result.topText}\n${result.bottomText}`}
                url={window.location.href}
                label="Partager ce mème sur WhatsApp"
              />
              <PremiumButton
                variant="ghost"
                icon={
                  <AppIcon
                    name="global"
                    size={18}
                    color={colors.textSecondary}
                  />
                }
              >
                Bientôt : partage statut WhatsApp
              </PremiumButton>
            </div>
          ) : null}
        </div>

        <div style={{ ...pageStyles.panel, padding: 28 }}>
          <h2 style={{ marginTop: 0 }}>Prévisualisation</h2>
          {!result ? (
            <div
              style={{
                ...pageStyles.softPanel,
                minHeight: 420,
                padding: 24,
                display: "grid",
                placeItems: "center",
                textAlign: "center",
              }}
            >
              <CompanionAvatarWeb companion="art" size={140} />
              <p style={{ color: colors.textSecondary, maxWidth: 320 }}>
                Art attend un contexte suffisamment visuel pour produire un top
                text, un bottom text et une scène mémorable.
              </p>
            </div>
          ) : (
            <div style={{ ...pageStyles.softPanel, padding: 20 }}>
              <div
                style={{
                  minHeight: 360,
                  borderRadius: radius.md,
                  border: `1px solid ${colors.border}`,
                  background:
                    "linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02))",
                  padding: 20,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  textAlign: "center",
                }}
              >
                <div style={{ fontSize: 28, fontWeight: 900 }}>
                  {result.topText}
                </div>
                <div>
                  <CompanionAvatarWeb companion="art" size={160} />
                  <p style={{ color: colors.textMuted }}>
                    {result.descriptionImage}
                  </p>
                </div>
                <div style={{ fontSize: 22, fontWeight: 800 }}>
                  {result.bottomText}
                </div>
              </div>
              {result.companionComment ? (
                <p style={{ color: colors.textSecondary, marginTop: 14 }}>
                  {result.companionComment}
                </p>
              ) : null}
            </div>
          )}
        </div>
      </section>
    </WebShell>
  );
};

const radius = { md: 18 };

export default ContextPage;
