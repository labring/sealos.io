'use client';

import React, { useEffect, useState, useRef } from 'react';

interface CounterProps {
  end: number;
  duration?: number;
  decimals?: number;
  suffix?: string;
  className?: string;
}

export const Counter: React.FC<CounterProps> = ({
  end,
  duration = 1500,
  decimals = 0,
  suffix = '',
  className = '',
}) => {
  const [count, setCount] = useState(0);
  const countRef = useRef<number>(0);
  const frameRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const elementRef = useRef<HTMLSpanElement>(null);
  const hasStartedRef = useRef<boolean>(false);

  useEffect(() => {
    // Animation function
    const animate = (timestamp: number) => {
      if (startTimeRef.current === null) {
        startTimeRef.current = timestamp;
      }

      const progress = timestamp - startTimeRef.current;
      const percentage = Math.min(progress / duration, 1);

      // Easing function for smoother animation
      const easeOutQuad = (t: number) => t * (2 - t);
      const easedProgress = easeOutQuad(percentage);

      countRef.current = easedProgress * end;
      setCount(countRef.current);

      if (percentage < 1) {
        frameRef.current = requestAnimationFrame(animate);
      } else {
        setCount(end); // Ensure we end at the exact target
      }
    };

    // Function to start the animation
    const startAnimation = () => {
      if (hasStartedRef.current) return; // Prevent multiple starts
      hasStartedRef.current = true;
      countRef.current = 0;
      setCount(0);
      startTimeRef.current = null;
      frameRef.current = requestAnimationFrame(animate);
    };

    // Create an intersection observer to detect when the counter is visible
    const observer = new IntersectionObserver((entries) => {
      const entry = entries[0];
      if (entry.isIntersecting) {
        startAnimation();
        observer.disconnect(); // Stop observing once animation has started
      }
    }, {
      threshold: 0.1, // Start animation when at least 10% of the element is visible
      rootMargin: '0px 0px -50px 0px' // Trigger a bit before the element comes into view
    });

    // Start observing
    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => {
      // Clean up
      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current);
      }
      observer.disconnect();
    };
  }, [end, duration]);

  const formattedCount = count.toFixed(decimals);

  return (
    <span ref={elementRef} className={className}>
      {formattedCount}{suffix}
    </span>
  );
};
