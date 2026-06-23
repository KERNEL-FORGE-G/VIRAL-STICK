import React from "react";
import { colors } from "../theme/tokens";

// Mapping des assets PNG (sans fond)
const COMPANIONS_PNG = {
  arch: "/asset/compagnons/arch_sans_fond.png",
  para: "/asset/compagnons/para_sans_fond.png",
  secu: "/asset/compagnons/secu_sans_fond.png",
  data: "/asset/compagnons/data_sans_fond.png",
  bio: "/asset/compagnons/bio_sans_fond.png",
  ubu: "/asset/compagnons/ubu_sans_fond.png",
  art: "/asset/compagnons/art_sans_fond.png",
};

const CompanionAvatarWeb = ({ companion = "arch", size = 160 }) => {
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
          width: size + 20,
          height: size + 20,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${accentColor}40 0%, transparent 70%)`,
          filter: "blur(8px)",
          zIndex: 0,
        }}
      />
      <img
        src={COMPANIONS_PNG[companion]}
        alt={companion}
        style={{
          width: size,
          height: size,
          objectFit: "contain",
          position: "relative",
          zIndex: 1,
          filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.3))",
        }}
        onError={(e) => {
          e.target.style.display = "none";
          e.target.nextSibling.style.display = "flex";
        }}
      />
      <div
        style={{
          display: "none",
          width: size,
          height: size,
          borderRadius: "50%",
          background: `linear-gradient(135deg, ${accentColor}, ${accentColor}80)`,
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          fontWeight: "bold",
          fontSize: size / 2.5,
          textTransform: "uppercase",
          position: "relative",
          zIndex: 1,
        }}
      >
        {companion[0]}
      </div>
    </div>
  );
};

export default CompanionAvatarWeb;
