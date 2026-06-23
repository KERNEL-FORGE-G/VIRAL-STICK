import React from "react";
import { colors } from "../theme/tokens";

const COMPANIONS_PNG = {
  arch: "/asset/compagnons/arch_sans_fond.png",
  para: "/asset/compagnons/para_sans_fond.png",
  secu: "/asset/compagnons/secu_sans_fond.png",
  data: "/asset/compagnons/data_sans_fond.png",
  bio: "/asset/compagnons/bio_sans_fond.png",
  ubu: "/asset/compagnons/ubu_sans_fond.png",
  art: "/asset/compagnons/art_sans_fond.png",
};

const CompanionAvatarWeb = ({
  companion = "arch",
  size = 140,
  ring = true,
}) => {
  const accentColor = colors[companion] || colors.arch;

  return (
    <div
      style={{
        position: "relative",
        width: size,
        height: size,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: -10,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${accentColor}55 0%, transparent 68%)`,
          filter: "blur(16px)",
          opacity: 0.95,
        }}
      />
      {ring && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "50%",
            border: `1px solid ${accentColor}66`,
            background: `linear-gradient(180deg, rgba(255,255,255,0.12), rgba(255,255,255,0.03))`,
            boxShadow: `0 10px 36px ${accentColor}33`,
          }}
        />
      )}
      <img
        src={COMPANIONS_PNG[companion]}
        alt={companion}
        style={{
          width: size * 0.88,
          height: size * 0.88,
          objectFit: "contain",
          position: "relative",
          zIndex: 1,
          filter: "drop-shadow(0 12px 28px rgba(0,0,0,0.4))",
        }}
      />
    </div>
  );
};

export default CompanionAvatarWeb;
