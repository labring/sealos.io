'use client';

import { useState } from 'react';
import { Package } from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';

interface AppIconProps {
  src: string;
  alt: string;
  className?: string;
  fallbackClassName?: string;
  fallbackIcon?: React.ComponentType<{ className?: string }>;
  width?: number;
  height?: number;
}

/**
 * AppIcon component with robust fallback functionality and Next.js Image optimization
 * Uses Next.js Image with built-in error handling for better performance
 */
export function AppIcon({
  src,
  alt,
  className,
  fallbackClassName,
  fallbackIcon: FallbackIcon = Package,
  width = 24,
  height = 24,
}: AppIconProps) {
  const [hasError, setHasError] = useState(false);

  // Show fallback for invalid src or error
  if (!src || src.trim() === '' || hasError) {
    return (
      <FallbackIcon
        className={cn('text-gray-600', fallbackClassName || className)}
        aria-label={`${alt} (fallback icon)`}
      />
    );
  }

  // Show the actual image using Next.js Image with error handling
  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      style={{ display: 'block' }}
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      priority={false}
      loading="lazy"
      onError={() => {
        console.log('Image failed to load:', src);
        setHasError(true);
      }}
    />
  );
}
