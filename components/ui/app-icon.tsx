'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Package } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AppIconProps {
  src: string;
  alt: string;
  className?: string;
  fallbackClassName?: string;
  fallbackIcon?: React.ComponentType<{ className?: string }>;
  priority?: boolean; // For critical images that should load immediately
  sizes?: string; // For responsive images
}

// Image cache to avoid reloading the same images
const imageCache = new Map<string, 'loading' | 'loaded' | 'error'>();

/**
 * AppIcon component with optimized image loading and robust fallback functionality
 * Features: preloading, caching, intersection observer for lazy loading
 */
export function AppIcon({
  src,
  alt,
  className,
  fallbackClassName,
  fallbackIcon: FallbackIcon = Package,
  priority = false,
  sizes,
}: AppIconProps) {
  const [imageStatus, setImageStatus] = useState<
    'loading' | 'loaded' | 'error'
  >(() => {
    // Check cache first
    if (imageCache.has(src)) {
      return imageCache.get(src)!;
    }
    return !src || src.trim() === '' ? 'error' : 'loading';
  });

  const [isInView, setIsInView] = useState(priority); // Load immediately if priority
  const imgRef = useRef<HTMLImageElement>(null);

  // Optimized image loading function
  const loadImage = useCallback((imageSrc: string) => {
    // Check cache first
    if (imageCache.has(imageSrc)) {
      const cachedStatus = imageCache.get(imageSrc)!;
      setImageStatus(cachedStatus);
      return;
    }

    setImageStatus('loading');
    imageCache.set(imageSrc, 'loading');

    // Create a new image to test if it loads
    const img = new Image();

    // Add loading optimization attributes
    img.decoding = 'async';
    if (sizes) {
      img.sizes = sizes;
    }

    img.onload = () => {
      setImageStatus('loaded');
      imageCache.set(imageSrc, 'loaded');
    };

    img.onerror = () => {
      console.warn('Image failed to load:', imageSrc);
      setImageStatus('error');
      imageCache.set(imageSrc, 'error');
    };

    img.src = imageSrc;

    // Cleanup
    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [sizes]);

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (priority || !imgRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.unobserve(entry.target);
          }
        });
      },
      {
        rootMargin: '50px', // Start loading 50px before the image comes into view
        threshold: 0.1,
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [priority]);

  // Load image when in view or priority
  useEffect(() => {
    if (!src || src.trim() === '') {
      setImageStatus('error');
      return;
    }

    if (isInView) {
      const cleanup = loadImage(src);
      return cleanup;
    }
  }, [src, isInView, loadImage]);

  // Show fallback for error or invalid src
  if (imageStatus === 'error' || !src || src.trim() === '') {
    return (
      <div ref={imgRef}>
        <FallbackIcon
          className={cn('text-gray-600', fallbackClassName || className)}
          aria-label={`${alt} (fallback icon)`}
        />
      </div>
    );
  }

  // Show loading fallback (only if not in view yet or still loading)
  if (imageStatus === 'loading' || !isInView) {
    return (
      <div ref={imgRef}>
        <FallbackIcon
          className={cn(
            'animate-pulse text-gray-400',
            fallbackClassName || className,
          )}
          aria-label={`${alt} (loading...)`}
        />
      </div>
    );
  }

  // Show the actual image with optimizations
  return (
    <img
      ref={imgRef}
      src={src}
      alt={alt}
      className={cn(className, 'transition-opacity duration-200')}
      style={{ display: 'block' }}
      loading={priority ? 'eager' : 'lazy'}
      decoding="async"
      sizes={sizes}
      onLoad={() => {
        // Ensure smooth transition
        if (imgRef.current) {
          imgRef.current.style.opacity = '1';
        }
      }}
      onError={() => {
        console.warn('Image failed to load in img element:', src);
        setImageStatus('error');
        imageCache.set(src, 'error');
      }}
    />
  );
}
