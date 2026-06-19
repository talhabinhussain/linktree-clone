import {
  Link,
  Mail,
  Globe,
  ShoppingBag,
  BookOpen,
  Music,
  Video,
  Image,
  Download,
  Calendar,
  Phone,
  MapPin,
  Star,
  Heart,
  MessageSquare,
  Share2,
  Code2,
  Briefcase,
  Award,
  Zap,
  Palette,
  ExternalLink,
  Users,
  Rss,
  Smartphone,
  Gamepad2,
  Coffee,
  Lightbulb,
  Pencil,
  LucideIcon,
} from 'lucide-react';

// Icon mapping - maps descriptive names to actual lucide icons
// Uses real icons for most common platforms and fallbacks for others
export const ICON_MAP: Record<string, LucideIcon> = {
  // Social Media & Professional Networks
  link: Link,
  github: Code2,
  twitter: Share2,
  linkedin: Briefcase,
  instagram: Smartphone,
  facebook: Users,
  youtube: Video,
  tiktok: Music,
  twitch: Gamepad2,
  
  // Communication
  mail: Mail,
  phone: Phone,
  message: MessageSquare,
  
  // Web & Content
  globe: Globe,
  website: ExternalLink,
  blog: BookOpen,
  rss: Rss,
  portfolio: Image,
  
  // Creative & Work
  code: Code2,
  briefcase: Briefcase,
  figma: Palette,
  design: Palette,
  
  // Content Types
  book: BookOpen,
  video: Video,
  music: Music,
  image: Image,
  
  // Lifestyle & Other
  shopping: ShoppingBag,
  'shopping-bag': ShoppingBag,
  download: Download,
  calendar: Calendar,
  'map-pin': MapPin,
  star: Star,
  heart: Heart,
  award: Award,
  zap: Zap,
  coffee: Coffee,
  lightbulb: Lightbulb,
  pencil: Pencil,
};

export const getIconComponent = (iconName: string): LucideIcon => {
  return ICON_MAP[iconName] || Link;
};
