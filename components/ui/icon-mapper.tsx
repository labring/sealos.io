import {
  Activity,
  BarChart3,
  BookOpen,
  Cable,
  CircleCheck,
  Clock,
  Cloud,
  Code,
  Code2,
  Cpu,
  Database,
  DollarSign,
  FileText,
  Gamepad2,
  GitBranch,
  Globe,
  GraduationCap,
  HardDrive,
  Headphones,
  Layers,
  MemoryStick,
  Rocket,
  Server,
  Settings,
  Shield,
  Smile,
  TrendingUp,
  Trophy,
  Users,
  Wifi,
  Wrench,
  Zap,
  type LucideIcon,
} from 'lucide-react';

export const iconMap: Record<string, LucideIcon> = {
  Activity,
  BarChart3,
  BookOpen,
  Cable,
  CircleCheck,
  Clock,
  Cloud,
  Code,
  Code2,
  Cpu,
  Database,
  DollarSign,
  FileText,
  Gamepad2,
  GitBranch,
  Globe,
  GraduationCap,
  HardDrive,
  Headphones,
  Layers,
  MemoryStick,
  Rocket,
  Server,
  Settings,
  Shield,
  Smile,
  TrendingUp,
  Trophy,
  Users,
  Wifi,
  Wrench,
  Zap,
};

interface IconProps {
  name: string;
  className?: string;
  size?: number;
}

export function Icon({ name, className, size }: IconProps) {
  const IconComponent = iconMap[name];
  
  if (!IconComponent) {
    console.warn(`Icon "${name}" not found in icon map`);
    return null;
  }
  
  return <IconComponent className={className} size={size} />;
}