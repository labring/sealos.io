'use client';

import { useEffect, useRef, useState } from 'react';

interface LazyIntersectionProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  rootMargin?: string;
  threshold?: number | number[];
}

export default function LazyIntersection({
  children,
  fallback = null,
  rootMargin = '50px',
  threshold = 0,
}: LazyIntersectionProps) {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsIntersecting(true);
            observer.disconnect();
          }
        });
      },
      { rootMargin, threshold },
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [rootMargin, threshold]);

  return <div ref={ref}>{isIntersecting ? children : fallback}</div>;
}