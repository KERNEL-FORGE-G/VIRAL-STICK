import React from "react";
import { colors, gradients, radius, shadows } from "../theme/tokens";

const PremiumButton = ({
  children,
  icon,
  variant = "primary",
  type = "button",
  style,
  disabled = false,
  ...props
}) => {
  const variants = {
    primary: {
      background: gradients.brand,
      color: colors.white,
      border: "1px solid rgba(255,255,255,0.12)",
      boxShadow: shadows.glow,
    },
    secondary: {
      background:
        "linear-gradient(135deg, rgba(243,156,18,0.22), rgba(232,73,15,0.18))",
      color: colors.text,
      border: `1px solid ${colors.borderStrong}`,
      boxShadow: shadows.amberGlow,
    },
    ghost: {
      background: "rgba(255,255,255,0.06)",
      color: colors.text,
      border: `1px solid ${colors.border}`,
      boxShadow: shadows.lift,
    },
  };

  const current = variants[variant] || variants.primary;

  return (
    <button
      type={type}
      disabled={disabled}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 10,
        minHeight: 52,
        padding: "14px 22px",
        borderRadius: radius.pill,
        fontWeight: 800,
        fontSize: 14,
        letterSpacing: "0.02em",
        cursor: disabled ? "not-allowed" : "pointer",
        backdropFilter: "blur(18px)",
        transition:
          "transform 180ms ease, box-shadow 180ms ease, opacity 180ms ease",
        transform: "translateZ(0)",
        opacity: disabled ? 0.55 : 1,
        ...current,
        ...style,
      }}
      {...props}
    >
      {icon ? (
        <span style={{ display: "inline-flex", alignItems: "center" }}>
          {icon}
        </span>
      ) : null}
      <span>{children}</span>
    </button>
  );
};

export default PremiumButton;
