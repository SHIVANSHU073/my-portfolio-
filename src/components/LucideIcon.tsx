/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  Briefcase,
  GraduationCap,
  Calendar,
  Code2,
  Users,
  Coffee,
  Atom,
  FileJson,
  Server,
  Sparkles,
  Database,
  Cloud,
  Layers,
  Paintbrush,
  Users2,
  MessageCircle,
  Brain,
  Speech,
  Cpu,
  Palette,
  LineChart,
  Check,
  Star,
  TrendingUp,
  Mail,
  Phone,
  MapPin,
  ExternalLink,
  Github,
  Linkedin,
  Twitter,
  Instagram,
  Search,
  Send,
  BookOpen,
  Award,
  ChevronDown,
  ChevronUp,
  Plus,
  Trash2,
  Edit2,
  LogOut,
  LayoutDashboard,
  Settings,
  BarChart3,
  Sun,
  Moon,
  Menu,
  X,
  Lock,
  ArrowUp,
  Globe,
  Share2
} from 'lucide-react';

const iconMap: Record<string, React.ComponentType<any>> = {
  Briefcase,
  GraduationCap,
  Calendar,
  Code2,
  Users,
  Coffee,
  Atom,
  FileJson,
  Server,
  Sparkles,
  Database,
  Cloud,
  Layers,
  Paintbrush,
  Users2,
  MessageCircle,
  Brain,
  Speech,
  Cpu,
  Palette,
  LineChart,
  Check,
  Star,
  TrendingUp,
  Mail,
  Phone,
  MapPin,
  ExternalLink,
  Github,
  Linkedin,
  Twitter,
  Instagram,
  Search,
  Send,
  BookOpen,
  Award,
  ChevronDown,
  ChevronUp,
  Plus,
  Trash2,
  Edit2,
  LogOut,
  LayoutDashboard,
  Settings,
  BarChart3,
  Sun,
  Moon,
  Menu,
  X,
  Lock,
  ArrowUp,
  Globe,
  Share2
};

interface LucideIconProps extends React.SVGProps<SVGSVGElement> {
  name: string;
  className?: string;
  size?: number;
}

export default function LucideIcon({ name, className = '', size = 20, ...props }: LucideIconProps) {
  // Try precise casing first, then lowercase match
  let IconComponent = iconMap[name];
  
  if (!IconComponent) {
    const foundKey = Object.keys(iconMap).find(
      key => key.toLowerCase() === name.toLowerCase()
    );
    if (foundKey) {
      IconComponent = iconMap[foundKey];
    }
  }

  // Fallback icon
  if (!IconComponent) {
    IconComponent = Sparkles;
  }

  return <IconComponent className={className} size={size} {...props} />;
}
