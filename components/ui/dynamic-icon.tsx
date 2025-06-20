import React from 'react';
import * as LucideIcons from 'lucide-react';
import { LucideIcon, LucideProps } from 'lucide-react';

interface DynamicIconProps extends Omit<LucideProps, 'ref'> {
  name: string;
  fallback?: keyof typeof LucideIcons;
}

const DynamicIcon: React.FC<DynamicIconProps> = ({
  name,
  fallback = 'CircleCheck',
  ...props
}) => {
  // Convert icon name to the correct format (should already be PascalCase)
  const iconName = name as keyof typeof LucideIcons;

  // Get the icon component from Lucide Icons
  const IconComponent = LucideIcons[iconName] as LucideIcon;

  // Fallback to a default icon if the specified icon doesn't exist
  if (!IconComponent) {
    if (process.env.NODE_ENV === 'development') {
      console.warn(
        `Icon "${name}" not found in Lucide React. Using fallback icon "${fallback}".`,
      );
    }
    const FallbackIcon = LucideIcons[
      fallback as keyof typeof LucideIcons
    ] as LucideIcon;
    return <FallbackIcon {...props} />;
  }

  return <IconComponent {...props} />;
};

export default DynamicIcon;
