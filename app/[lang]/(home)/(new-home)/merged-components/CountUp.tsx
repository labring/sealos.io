'use client';

import { useCallback, useEffect, useRef } from 'react';
import { useInView } from 'react-intersection-observer';

interface CountUpProps {
  to: number;
  from?: number;
  direction?: 'up' | 'down';
  delay?: number;
  duration?: number;
  className?: string;
  startWhen?: boolean;
  separator?: string;
  onStart?: () => void;
  onEnd?: () => void;
}

export default function CountUp({
  to,
  from = 0,
  direction = 'up',
  delay = 0,
  duration = 2,
  className = '',
  startWhen = true,
  separator = '',
  onStart,
  onEnd,
}: CountUpProps) {
  const spanRef = useRef<HTMLSpanElement | null>(null);
  const hasAnimatedRef = useRef(false);

  const { ref: inViewRef, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  // Combine refs
  const setRefs = useCallback(
    (element: HTMLSpanElement | null) => {
      // Update our ref
      spanRef.current = element;
      // Call the inView ref callback
      inViewRef(element);
    },
    [inViewRef],
  );

  const formatNumber = (num: number): string => {
    const options: Intl.NumberFormatOptions = {
      useGrouping: !!separator,
    };

    const formattedNumber = Intl.NumberFormat('en-US', options).format(num);
    return separator
      ? formattedNumber.replace(/,/g, separator)
      : formattedNumber;
  };

  useEffect(() => {
    if (inView && startWhen && !hasAnimatedRef.current && spanRef.current) {
      hasAnimatedRef.current = true;

      onStart?.();

      const timer = setTimeout(() => {
        const steps = 60; // 60 FPS
        const increment = (to - from) / (steps * duration);
        let currentCount = from;

        const counter = setInterval(() => {
          currentCount += increment;

          if (direction === 'up' ? currentCount >= to : currentCount <= to) {
            // Final update
            if (spanRef.current) {
              spanRef.current.textContent = formatNumber(to);
            }
            clearInterval(counter);
            onEnd?.();
          } else {
            // Update DOM directly without triggering re-render
            if (spanRef.current) {
              spanRef.current.textContent = formatNumber(
                Math.floor(currentCount),
              );
            }
          }
        }, 1000 / steps);

        return () => clearInterval(counter);
      }, delay * 1000);

      return () => clearTimeout(timer);
    }
  }, [inView, startWhen, to, from, direction, delay, duration, separator]);

  return (
    <span className={className} ref={setRefs}>
      {formatNumber(from)}
    </span>
  );
}
