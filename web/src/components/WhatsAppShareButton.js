import React from "react";
import PremiumButton from "./PremiumButton";
import AppIcon from "./AppIcon";

async function dataUrlToFile(dataUrl, filename = "viral-stick-meme.jpg") {
  const res = await fetch(dataUrl);
  const blob = await res.blob();
  const ext = blob.type.includes("png") ? "png" : blob.type.includes("gif") ? "gif" : "jpg";
  return new File([blob], filename.replace(/\.(jpg|jpeg|png|gif)$/i, `.${ext}`), {
    type: blob.type || "image/jpeg",
  });
}

function downloadImage(dataUrl, filename = "viral-stick-meme.jpg") {
  const a = document.createElement("a");
  a.href = dataUrl;
  a.download = filename;
  a.click();
}

const WhatsAppShareButton = ({
  text,
  url,
  imageDataUrl,
  imageOnly = true,
  label = "Partager sur WhatsApp",
  variant = "secondary",
  style,
}) => {
  const handleShare = async () => {
    if (!imageDataUrl) {
      const encoded = encodeURIComponent([text, url].filter(Boolean).join("\n\n"));
      window.open(`https://wa.me/?text=${encoded}`, "_blank", "noopener,noreferrer");
      return;
    }

    if (navigator.share) {
      try {
        const file = await dataUrlToFile(imageDataUrl);
        const shareData = imageOnly
          ? { files: [file] }
          : { title: "Viral Stick", text: text || "", files: [file] };

        if (!navigator.canShare || navigator.canShare(shareData)) {
          await navigator.share(shareData);
          return;
        }
      } catch (e) {
        if (e?.name === "AbortError") return;
      }
    }

    downloadImage(imageDataUrl);
    window.open("https://wa.me/", "_blank", "noopener,noreferrer");
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
