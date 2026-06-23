import React from "react";
import PremiumButton from "./PremiumButton";
import AppIcon from "./AppIcon";

const WhatsAppShareButton = ({ text, url, label = "Partager sur WhatsApp", variant = "secondary", style }) => {
  const handleShare = () => {
    const payload = [text, url].filter(Boolean).join("\n\n");
    const encoded = encodeURIComponent(payload);
    window.open(`https://wa.me/?text=${encoded}`, "_blank", "noopener,noreferrer");
  };

  return (
    <PremiumButton
      onClick={handleShare}
      variant={variant}
      icon={<AppIcon name="chat" size={18} color="#ffffff" />}
      style={style}
    >
      {label}
    </PremiumButton>
  );
};

export default WhatsAppShareButton;
