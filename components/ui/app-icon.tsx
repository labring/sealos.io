'use client';

import { useState, useEffect } from 'react';
import { Package } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AppIconProps {
  src: string;
  alt: string;
  className?: string;
  fallbackClassName?: string;
  fallbackIcon?: React.ComponentType<{ className?: string }>;
}

/**
 * AppIcon component with robust fallback functionality
 * Always shows fallback icon instead of broken images
 */
export function AppIcon({
  src,
  alt,
  className,
  fallbackClassName,
  fallbackIcon: FallbackIcon = Package,
}: AppIconProps) {
  const [imageStatus, setImageStatus] = useState<
    'loading' | 'loaded' | 'error'
  >('loading');

  // Reset when src changes
  useEffect(() => {
    if (!src || src.trim() === '') {
      setImageStatus('error');
      return;
    }

    setImageStatus('loading');

    // Create a new image to test if it loads
    const img = new Image();

    img.onload = () => {
      setImageStatus('loaded');
    };

    img.onerror = () => {
      console.log('Image failed to load:', src);
      setImageStatus('error');
    };

    img.src = src;

    // Cleanup
    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [src]);

  // Show fallback for error or invalid src
  if (imageStatus === 'error' || !src || src.trim() === '') {
    return (
      <FallbackIcon
        className={cn('text-gray-600', fallbackClassName || className)}
        aria-label={`${alt} (fallback icon)`}
      />
    );
  }

  // Show loading fallback
  if (imageStatus === 'loading') {
    return (
      <FallbackIcon
        className={cn(
          'animate-pulse text-gray-400',
          fallbackClassName || className,
        )}
        aria-label={`${alt} (loading...)`}
      />
    );
  }

  // Show the actual image
  return (
    <img
      src={src}
      alt={alt}
      className={className}
      style={{ display: 'block' }}
    />
  );
}
