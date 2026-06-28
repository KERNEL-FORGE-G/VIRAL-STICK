import React from "react";
import {
  Home, BookOpen, Mic, Image as ImageIcon, MessageSquare, Users, Settings, Info,
  Rocket, ChevronRight, ChevronLeft, Share2, Heart, Sparkles, Globe, RefreshCw,
  Download, Flame, Clock, Zap, MoreHorizontal, X, Camera, RefreshCcw, Layout
} from "lucide-react-native";

export const AppIcon = ({ name, color = "#777777", size = 20, filled = false }) => {
  const props = { color, size, strokeWidth: filled ? 0 : 2.5, fill: filled ? color : "none" };

  switch (name) {
    case "home": return <Home {...props} />;
    case "book": return <BookOpen {...props} />;
    case "mic": return <Mic {...props} />;
    case "image": return <ImageIcon {...props} />;
    case "message": return <MessageSquare {...props} />;
    case "users": return <Users {...props} />;
    case "settings": return <Settings {...props} />;
    case "info": return <Info {...props} />;
    case "rocket": return <Rocket {...props} />;
    case "chevron-right": return <ChevronRight {...props} />;
    case "chevron-left": return <ChevronLeft {...props} />;
    case "share-2": return <Share2 {...props} />;
    case "heart": return <Heart {...props} />;
    case "sparkles": return <Sparkles {...props} />;
    case "globe": return <Globe {...props} />;
    case "refresh-cw": return <RefreshCw {...props} />;
    case "refresh-ccw": return <RefreshCcw {...props} />;
    case "download": return <Download {...props} />;
    case "flame": return <Flame {...props} />;
    case "clock": return <Clock {...props} />;
    case "zap": return <Zap {...props} />;
    case "more-horizontal": return <MoreHorizontal {...props} />;
    case "x": return <X {...props} />;
    case "camera": return <Camera {...props} />;
    case "layout": return <Layout {...props} />;
    default: return <ImageIcon {...props} />;
  }
};

export default AppIcon;
