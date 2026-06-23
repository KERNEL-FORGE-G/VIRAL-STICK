import React, { useState } from "react";
import CompanionAvatarWeb from "../components/CompanionAvatarWeb";
import WebShell, { pageStyles } from "../components/WebShell";
import PremiumButton from "../components/PremiumButton";
import WhatsAppShareButton from "../components/WhatsAppShareButton";
import AppIcon from "../components/AppIcon";
import { colors } from "../theme/tokens";

const RemixPage = () => {
  const [remixText, setRemixText] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleRemix = async () => {
    if (!remixText.trim()) return;
    setLoading(true);
    try {
      const response = await fetch("/api/memes/generate-from-text", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: remixText }),
      });
      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error("Error:", error);
    }
    setLoading(false);
  };

  return (
    <WebShell title="Status Remixer" companion="bio">
      <section
        style={{
          display: "grid",
          gridTemplateColumns: "1.05fr 0.95fr",
          gap: 24,
        }}
      >
        <div style={{ ...pageStyles.panel, padding: 28 }}>
          <div
            style={{
              display: "flex",
              gap: 18,
              alignItems: "center",
              marginBottom: 18,
            }}
          >
            <CompanionAvatarWeb companion="bio" size={110} />
            <div>
              <h1 style={{ margin: 0, fontSize: 34 }}>Status Remixer</h1>
              <p style={{ color: colors.textSecondary }}>
                Bio transforme une scène, un status ou un visuel décrit en
                caption plus vivant, plus stylé et plus viral.
              </p>
            </div>
          </div>

          <textarea
            value={remixText}
            onChange={(e) => setRemixText(e.target.value)}
            placeholder="Décris l'image, le mood, le texte voulu ou l'énergie du sticker..."
            style={{ ...pageStyles.textarea, minHeight: 240 }}
          />

          <div
            style={{
              ...pageStyles.softPanel,
              marginTop: 16,
              padding: 18,
              color: colors.textSecondary,
            }}
          >
            Upload image réel à finaliser, mais le design est déjà aligné sur le
            logo et l'univers compagnon.
          </div>

          <div
            style={{
              marginTop: 18,
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            <PremiumButton
              onClick={handleRemix}
              disabled={loading || !remixText.trim()}
              icon={<AppIcon name="remix" size={18} color="#fff" />}
            >
              {loading ? "Remix..." : "Créer le remix"}
            </PremiumButton>
          </div>
        </div>

        <div style={{ ...pageStyles.panel, padding: 28 }}>
          <h2 style={{ marginTop: 0 }}>Aperçu du rendu</h2>
          <div style={{ ...pageStyles.softPanel, padding: 20 }}>
            <div
              style={{
                minHeight: 420,
                borderRadius: 18,
                border: `1px solid ${colors.border}`,
                background:
                  "linear-gradient(160deg, rgba(124,58,237,0.18), rgba(6,182,212,0.10))",
                padding: 22,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                alignItems: "center",
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: 24, fontWeight: 900 }}>
                {result?.topText || "TON TEXTE D'ACCROCHE"}
              </div>
              <CompanionAvatarWeb companion="bio" size={180} />
              <div style={{ fontSize: 20, fontWeight: 800 }}>
                {result?.bottomText || "TA CHUTE VISUELLE ET VIRALE"}
              </div>
            </div>
            <p style={{ color: colors.textMuted, marginTop: 14 }}>
              {result?.descriptionImage ||
                "Le moteur peut ensuite servir de base à un export sticker ou à une génération d'image plus poussée."}
            </p>
            <div
              style={{
                display: "flex",
                gap: 12,
                flexWrap: "wrap",
                marginTop: 16,
              }}
            >
              <WhatsAppShareButton
                text={
                  result ? `${result.topText}\n${result.bottomText}` : remixText
                }
                url={window.location.href}
                label="Partager le remix sur WhatsApp"
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
                Bientôt : partager au statut WhatsApp
              </PremiumButton>
            </div>
          </div>
        </div>
      </section>
    </WebShell>
  );
};

export default RemixPage;
