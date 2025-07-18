'use client';

import { useEffect, useState } from 'react';
import {
  Server,
  Database,
  Cloud,
  Zap,
  Globe,
  Shield,
  LucideIcon,
} from 'lucide-react';

// Infrastructure icons that float around the background
const infrastructureIcons = [
  { icon: Server, label: 'Managed Servers', color: 'text-white/50' },
  { icon: Database, label: 'Managed Databases', color: 'text-white/50' },
  { icon: Cloud, label: 'Cloud Infrastructure', color: 'text-white/50' },
  { icon: Zap, label: 'High Performance', color: 'text-white/50' },
  { icon: Globe, label: 'Global Distribution', color: 'text-white/50' },
  { icon: Shield, label: 'Security', color: 'text-white/50' },
];

interface FloatingIcon {
  id: number;
  icon: typeof Server;
  label: string;
  color: string;
  x: number;
  y: number;
  size: number;
  floatSpeed: number;
  floatDelay: number;
}

// Floating icon component that gently rocks in place
function FloatingIconComponent({ icon }: { icon: FloatingIcon }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const IconComponent = icon.icon;

  return (
    <div
      className="pointer-events-none absolute"
      style={{
        left: `${icon.x}%`,
        top: `${icon.y}%`,
        animation: `gentleFloat ${icon.floatSpeed}s ease-in-out infinite`,
        animationDelay: `${icon.floatDelay}s`,
      }}
    >
      <div
        className="flex items-center justify-center rounded-full border border-white/15 bg-white/5 shadow-md backdrop-blur-sm"
        style={{
          width: `${icon.size}px`,
          height: `${icon.size}px`,
        }}
      >
        <IconComponent
          size={icon.size * 0.5}
          className={`${icon.color} drop-shadow-sm`}
        />
      </div>
    </div>
  );
}

interface AnimatedVisualProps {
  centralIcon?: React.ReactNode;
}

export default function AnimatedVisual({ centralIcon }: AnimatedVisualProps) {
  const [floatingIcons, setFloatingIcons] = useState<FloatingIcon[]>([]);

  useEffect(() => {
    // Create structured floating icons with symmetrical placement
    const icons: FloatingIcon[] = [];
    const shuffledIcons = [...infrastructureIcons].sort(
      () => Math.random() - 0.5,
    );

    // Position calculations
    const edgeDistance = 18;
    const leftCenterX = edgeDistance;
    const rightCenterX = 100 - 1.5 * edgeDistance;
    const middleCenterAdjustment = 8;
    const topY = 25;
    const middleY = 50;
    const bottomY = 72;

    const leftPositions = [
      { x: leftCenterX, y: topY },
      { x: leftCenterX - middleCenterAdjustment, y: middleY },
      { x: leftCenterX, y: bottomY },
    ];

    const rightPositions = [
      { x: rightCenterX, y: topY },
      { x: rightCenterX + middleCenterAdjustment, y: middleY },
      { x: rightCenterX, y: bottomY },
    ];

    // Generate left side icons
    shuffledIcons.slice(0, 3).forEach((iconData, i) => {
      icons.push({
        id: i,
        icon: iconData.icon,
        label: iconData.label,
        color: iconData.color,
        x: leftPositions[i].x,
        y: leftPositions[i].y,
        size: 45 + Math.random() * 15,
        floatSpeed: 3 + Math.random() * 4,
        floatDelay: Math.random() * 3,
      });
    });

    // Generate right side icons
    shuffledIcons.slice(3, 6).forEach((iconData, i) => {
      icons.push({
        id: i + 3,
        icon: iconData.icon,
        label: iconData.label,
        color: iconData.color,
        x: rightPositions[i].x,
        y: rightPositions[i].y,
        size: 45 + Math.random() * 15,
        floatSpeed: 3 + Math.random() * 4,
        floatDelay: Math.random() * 3,
      });
    });

    setFloatingIcons(icons);
  }, []);

  return (
    <div className="relative flex h-96 w-full items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-indigo-900/30 via-purple-800/20 to-blue-900/30"></div>

      {/* Floating infrastructure icons */}
      {floatingIcons.map((icon) => (
        <FloatingIconComponent key={icon.id} icon={icon} />
      ))}

      {/* Central industry icon */}
      <div className="relative z-10 flex items-center justify-center">
        <div
          className="relative rounded-full bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-500 p-6 shadow-2xl"
          style={{
            animation: 'iconPulse 2s ease-in-out infinite',
          }}
        >
          <div className="absolute inset-0 scale-110 rounded-full bg-gradient-to-br from-cyan-400/30 via-purple-400/30 to-pink-400/30 blur-lg"></div>
          <div className="absolute inset-0 scale-105 rounded-full bg-gradient-to-br from-white/20 to-transparent"></div>
          <div className="relative z-10 text-white">
            {centralIcon && (
              <div className="size-[80px] drop-shadow-lg">{centralIcon}</div>
            )}
          </div>
        </div>
      </div>

      {/* Custom CSS animations */}
      <style jsx>{`
        @keyframes gentleFloat {
          0%,
          100% {
            transform: translateY(0px) translateX(0px) rotate(0deg);
          }
          25% {
            transform: translateY(-8px) translateX(3px) rotate(1deg);
          }
          50% {
            transform: translateY(-4px) translateX(-2px) rotate(-0.5deg);
          }
          75% {
            transform: translateY(-10px) translateX(4px) rotate(0.8deg);
          }
        }

        @keyframes iconPulse {
          0%,
          100% {
            transform: scale(1);
            box-shadow:
              0 25px 50px -12px rgba(99, 102, 241, 0.4),
              0 0 0 0 rgba(139, 92, 246, 0.7);
          }
          50% {
            transform: scale(1.05);
            box-shadow:
              0 25px 50px -12px rgba(99, 102, 241, 0.6),
              0 0 0 10px rgba(139, 92, 246, 0.2);
          }
        }
      `}</style>
    </div>
  );
}
