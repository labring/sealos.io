import React, { useState, useEffect } from 'react';
import { LucideIcon, LucideProps } from 'lucide-react';

interface DynamicIconProps extends Omit<LucideProps, 'ref'> {
  name: string;
  fallback?: string;
}

const DynamicIcon: React.FC<DynamicIconProps> = ({
  name,
  fallback = 'CircleCheck',
  ...props
}) => {
  const [IconComponent, setIconComponent] = useState<LucideIcon | null>(null);

  useEffect(() => {
    let mounted = true;

    const loadIcon = async (iconName: string) => {
      try {
        const module = await import(`lucide-react`);
        const icons = module as any;
        
        if (mounted && icons[iconName]) {
          setIconComponent(() => icons[iconName] as LucideIcon);
        } else if (mounted && fallback && fallback !== iconName) {
          // Try loading fallback
          loadIcon(fallback);
        }
      } catch (error) {
        if (process.env.NODE_ENV === 'development') {
          console.warn(`Failed to load icon "${iconName}":`, error);
        }
        if (mounted && fallback && fallback !== iconName) {
          loadIcon(fallback);
        }
      }
    };

    loadIcon(name);

    return () => {
      mounted = false;
    };
  }, [name, fallback]);

  if (!IconComponent) {
    // Return empty span with similar dimensions to prevent layout shift
    return <span className="inline-block" style={{ width: props.size || 24, height: props.size || 24 }} />;
  }

  return <IconComponent {...props} />;
};

export default DynamicIcon;
