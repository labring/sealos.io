import React from 'react';
import { LucideIcon, LucideProps } from 'lucide-react';
import {
  Activity,
  BarChart3,
  BookOpen,
  CircleCheck,
  Clock,
  Cloud,
  Code,
  Cpu,
  Database,
  DollarSign,
  FileText,
  GitBranch,
  Globe,
  Headphones,
  Layers,
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
} from 'lucide-react';

// Static icon map to avoid dynamic imports
const iconMap: Record<string, LucideIcon> = {
  Activity,
  BarChart3,
  BookOpen,
  CircleCheck,
  Clock,
  Cloud,
  Code,
  Cpu,
  Database,
  DollarSign,
  FileText,
  GitBranch,
  Globe,
  Headphones,
  Layers,
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

interface DynamicIconProps extends Omit<LucideProps, 'ref'> {
  name: string;
  fallback?: string;
}

const DynamicIcon: React.FC<DynamicIconProps> = ({
  name,
  fallback = 'CircleCheck',
  ...props
}) => {
  // Get the icon component from the static map
  const IconComponent = iconMap[name] || iconMap[fallback];

  if (!IconComponent) {
    if (process.env.NODE_ENV === 'development') {
      console.warn(
        `Icon "${name}" not found in icon map. Using fallback or empty span.`,
      );
    }
    // Return empty span with similar dimensions to prevent layout shift
    return <span className="inline-block" style={{ width: props.size || 24, height: props.size || 24 }} />;
  }

  return <IconComponent {...props} />;
};

export default DynamicIcon;