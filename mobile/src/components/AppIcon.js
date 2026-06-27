import React from "react";
import {
  Home,
  BookOpen,
  Mic,
  Image as ImageIcon,
  MessageSquare,
  Users,
  Settings,
  Info,
  Rocket,
  ChevronRight,
  ChevronLeft,
  Share2,
  Heart,
  Sparkles,
  Globe
} from "lucide-react-native";

export const AppIcon = ({ name, color = "#777777", size = 20, filled = false }) => {
  // Stroke width 2 for outlined, 0 for filled look
  const props = { color, size, strokeWidth: filled ? 0 : 2, fill: filled ? color : "none" };

  switch (name) {
    case "home":
      return <Home {...props} />;
    case "context":
    case "book":
      return <BookOpen {...props} />;
    case "voice":
    case "mic":
      return <Mic {...props} />;
    case "remix":
    case "image":
      return <ImageIcon {...props} />;
    case "chat":
    case "message":
      return <MessageSquare {...props} />;
    case "multichat":
    case "users":
      return <Users {...props} />;
    case "settings":
    case "gear":
      return <Settings {...props} />;
    case "about":
    case "info":
      return <Info {...props} />;
    case "rocket":
      return <Rocket {...props} />;
    case "arrow":
    case "chevron-right":
      return <ChevronRight {...props} />;
    case "arrow-left":
      return <ChevronLeft {...props} />;
    case "share":
    case "whatsapp":
      return <Share2 {...props} />;
    case "heart":
    case "like":
      return <Heart {...props} />;
    case "sparkles":
      return <Sparkles {...props} />;
    case "globe":
      return <Globe {...props} />;
    default:
      return null;
  }
};

export default AppIcon;
