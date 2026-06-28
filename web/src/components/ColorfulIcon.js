import React from 'react';
import { 
  Home, BookOpen, Mic, Image as ImageIcon, MessageSquare, Users, 
  Settings, Info, Rocket, ChevronRight, Share2, Heart, Sparkles, 
  Globe, RefreshCw, Download, Flame, Clock, Zap, MoreHorizontal, X, 
  Camera, Layout, User
} from 'lucide-react';

const ICONS = {
  home: Home,
  book: BookOpen,
  mic: Mic,
  image: ImageIcon,
  message: MessageSquare,
  users: Users,
  settings: Settings,
  info: Info,
  rocket: Rocket,
  'chevron-right': ChevronRight,
  'share-2': Share2,
  heart: Heart,
  sparkles: Sparkles,
  globe: Globe,
  'refresh-cw': RefreshCw,
  download: Download,
  flame: Flame,
  clock: Clock,
  zap: Zap,
  'more-horizontal': MoreHorizontal,
  x: X,
  camera: Camera,
  layout: Layout,
  user: User
};

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
  'share-2': '#8B5CF6',
  heart: '#EF4444',
  sparkles: '#F59E0B',
  globe: '#10B981',
  'refresh-cw': '#06b6d4',
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

export const ColorfulIcon = ({ name, size = 24, filled = false }) => {
  const IconComponent = ICONS[name] || ICONS.image;
  const color = ICON_COLORS[name] || '#71717a';

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <IconComponent 
        color={color} 
        size={size} 
        strokeWidth={filled ? 0 : 2.5} 
        fill={filled ? color : 'none'} 
      />
    </div>
  );
};

export default ColorfulIcon;
