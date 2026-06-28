import React from "react";
import WebShell from "../components/WebShell";
import { colors, radius } from "../theme/tokens";

const VideoPage = () => {
  // Utilisation du chemin statique (le fichier est copié dans public/video lors du build)
  const videoPath = "/video/whatsapp-video-2026-06-28-at-135933_ZNbdb5i5.mp4";

  return (
    <WebShell companion="para">
      <div style={{ textAlign: "center", marginBottom: 40 }}>
        <h1 style={{ fontFamily: "'Fredoka One', cursive", fontSize: 36, color: colors.almostBlack }}>
          Session Vidéo Viral Stick
        </h1>
        <p style={{ fontFamily: "'Nunito', sans-serif", fontSize: 18, color: colors.graphite }}>
          Découvrez la puissance de la création virale en action.
        </p>
      </div>

      <div style={{
        maxWidth: 800,
        margin: "0 auto",
        background: "#000",
        borderRadius: radius.lg,
        overflow: "hidden",
        boxShadow: `0 8px 0 0 ${colors.cloudGray}`,
        border: `2px solid ${colors.cloudGray}`,
      }}>
        <video
          controls
          style={{ width: "100%", display: "block" }}
          src={videoPath}
        >
          Votre navigateur ne supporte pas la lecture de vidéos.
        </video>
      </div>

      <div style={{ marginTop: 40, textAlign: "center" }}>
        <p style={{ color: colors.silver, fontWeight: 600 }}>
          Propulsé par KERNEL FORGE — 2026
        </p>
      </div>
    </WebShell>
  );
};

export default VideoPage;
