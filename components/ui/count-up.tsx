'use client';

import { useEffect, useState } from 'react';
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
  onEnd
}: CountUpProps) {
  const [count, setCount] = useState(from);
  const [hasAnimated, setHasAnimated] = useState(false);
  
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  useEffect(() => {
    if (inView && startWhen && !hasAnimated) {
      if (typeof onStart === 'function') {
        onStart();
      }

      const timer = setTimeout(() => {
        const steps = 60; // 60 FPS
        const increment = (to - from) / (steps * duration);
        let currentCount = from;

        const counter = setInterval(() => {
          currentCount += increment;
          if (direction === 'up' ? currentCount >= to : currentCount <= to) {
            setCount(to);
            clearInterval(counter);
            setHasAnimated(true);
            if (typeof onEnd === 'function') {
              onEnd();
            }
          } else {
            setCount(Math.floor(currentCount));
          }
        }, 1000 / steps);

        return () => clearInterval(counter);
      }, delay * 1000);

      return () => clearTimeout(timer);
    }
  }, [inView, startWhen, hasAnimated, to, from, direction, delay, duration, onStart, onEnd]);

  const formatNumber = (num: number): string => {
    const options: Intl.NumberFormatOptions = {
      useGrouping: !!separator,
    };
    
    const formattedNumber = Intl.NumberFormat('en-US', options).format(num);
    return separator ? formattedNumber.replace(/,/g, separator) : formattedNumber;
  };

  return <span className={className} ref={ref}>{formatNumber(count)}</span>;
}
