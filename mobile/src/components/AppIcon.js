import React from "react";
import {
  Home, BookOpen, Mic, Image as ImageIcon, MessageSquare, Users, Settings, Info,
  Rocket, ChevronRight, ChevronLeft, Share2, Heart, Sparkles, Globe, RefreshCw,
  Download, Flame, Clock, Zap, MoreHorizontal, X, Camera, RefreshCcw, Layout, User
} from "lucide-react-native";

const ICON_COLORS = {
  home: '#1cb0f6',
  book: '#58cc02',
  mic: '#ffc700',
  image: '#a570ff',
  message: '#cc348d',
  users: '#f97316',
  settings: '#64748b',
  info: '#10B981',
  rocket: '#3B82F6',
  'chevron-right': '#1899d6',
  'chevron-left': '#1899d6',
  'share-2': '#8B5CF6',
  heart: '#EF4444',
  sparkles: '#F59E0B',
  globe: '#10B981',
  'refresh-cw': '#06b6d4',
  'refresh-ccw': '#06b6d4',
  download: '#8B5CF6',
  flame: '#ff6b35',
  clock: '#f97316',
  zap: '#f7c531',
  'more-horizontal': '#71717a',
  x: '#71717a',
  camera: '#a570ff',
  layout: '#58cc02',
  user: '#1cb0f6'
};

export const AppIcon = ({ name, color, size = 20, filled = false }) => {
  const actualColor = color || ICON_COLORS[name] || '#71717a';
  const props = { color: actualColor, size, strokeWidth: filled ? 0 : 2.5, fill: filled ? actualColor : 'none' };

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
    case "user": return <User {...props} />;
    default: return <ImageIcon {...props} />;
  }
};

export default AppIcon;
