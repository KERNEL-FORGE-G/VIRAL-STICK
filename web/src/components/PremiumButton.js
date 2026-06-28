/**
 * DuoButton — Bouton signature style Duolingo
 * Ombre solide en bas = effet physique pressable
 */
import React, { useState } from "react";
import { colors } from "../theme/tokens";

const VARIANTS = {
  primary: {
    bg:     colors.duoGreen,
    shadow: colors.duoGreenDark,
    color:  "#ffffff",
    border: "transparent",
  },
  green: {
    bg:     colors.duoGreen,
    shadow: colors.duoGreenDark,
    color:  "#ffffff",
    border: "transparent",
  },
  ghost: {
    bg:     "#ffffff",
    shadow: "#b5b5b5",
    color:  colors.skyBlue,
    border: colors.cloudGray,
  },
  danger: {
    bg:     colors.danger,
    shadow: "#aa1d1d",
    color:  "#ffffff",
    border: "transparent",
  },
};

const PremiumButton = ({
  children,
  icon,
  variant = "primary",
  type = "button",
  style,
  disabled = false,
  onClick,
  ...props
}) => {
  const [pressed, setPressed] = useState(false);
  const v = VARIANTS[variant] || VARIANTS.primary;

  const shadowY   = pressed ? "0px" : "4px";
  const translateY = pressed ? "4px" : "0px";

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      onMouseLeave={() => setPressed(false)}
      onTouchStart={() => setPressed(true)}
      onTouchEnd={() => setPressed(false)}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        minHeight: 48,
        padding: "12px 24px",
        borderRadius: 12,
        fontFamily: "'Nunito', sans-serif",
        fontWeight: 700,
        fontSize: 15,
        letterSpacing: "0.05em",
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.5 : 1,
        background: v.bg,
        color: v.color,
        border: `2px solid ${v.border === "transparent" ? v.bg : v.border}`,
        boxShadow: disabled ? "none" : `0 ${shadowY} 0 ${v.shadow}`,
        transform: `translateY(${translateY})`,
        transition: "box-shadow 0.05s ease, transform 0.05s ease, opacity 0.2s ease",
        userSelect: "none",
        ...style,
      }}
      {...props}
    >
      {icon && <span style={{ display: "flex", alignItems: "center" }}>{icon}</span>}
      {children}
    </button>
  );
};

export default PremiumButton;
