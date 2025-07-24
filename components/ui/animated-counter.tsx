'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

interface AnimatedCounterProps {
  value: string;
  label: string;
  icon?: React.ReactNode;
  delay?: number;
  className?: string;
}

export default function AnimatedCounter({
  value,
  label,
  icon,
  delay = 0,
  className = '',
}: AnimatedCounterProps) {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const { ref, inView } = useInView({
    threshold: 0.3,
    triggerOnce: true,
  });

  // Extract number from value string (e.g., "95%" -> 95)
  const numericValue = parseInt(value.replace(/[^0-9]/g, '')) || 0;
  const suffix = value.replace(/[0-9]/g, '');

  useEffect(() => {
    if (inView && !hasAnimated) {
      const timer = setTimeout(() => {
        const duration = 2000; // 2 seconds
        const steps = 60; // 60 FPS
        const increment = numericValue / steps;
        let currentCount = 0;

        const counter = setInterval(() => {
          currentCount += increment;
          if (currentCount >= numericValue) {
            setCount(numericValue);
            clearInterval(counter);
            setHasAnimated(true);
          } else {
            setCount(Math.floor(currentCount));
          }
        }, duration / steps);

        return () => clearInterval(counter);
      }, delay);

      return () => clearTimeout(timer);
    }
  }, [inView, hasAnimated, numericValue, delay]);

  return (
    <motion.div
      ref={ref}
      className={`relative overflow-hidden rounded-xl border border-blue-100/50 bg-gradient-to-br from-blue-50 via-white to-purple-50 px-2 py-6 text-center shadow-lg ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ delay: delay * 0.1, duration: 0.6 }}
      whileHover={{ scale: 1.05, y: -5, transition: { duration: 0.2 } }}
    >
      {/* Background pulse effect */}
      <motion.div
        className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-400/10 to-purple-400/10"
        animate={{ opacity: [0.3, 0.7, 0.3] }}
        transition={{ duration: 3, repeat: Infinity, delay: delay * 0.2 }}
      />

      {/* Floating particles */}
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute h-1 w-1 rounded-full bg-blue-400/30"
          style={{
            left: `${20 + i * 30}%`,
            top: `${20 + i * 20}%`,
          }}
          animate={{
            y: [-10, 10, -10],
            opacity: [0.3, 0.8, 0.3],
          }}
          transition={{
            duration: 2 + i,
            repeat: Infinity,
            delay: delay * 0.1 + i * 0.3,
          }}
        />
      ))}

      {/* Main content */}
      <div className="relative z-10">
        {/* Number display */}
        <motion.div
          className="mb-2 bg-gradient-to-r from-[#44BCFF] to-[#0090FF] bg-clip-text text-4xl font-bold text-transparent"
          initial={{ scale: 0 }}
          animate={inView ? { scale: 1 } : { scale: 0 }}
          transition={{
            type: 'spring',
            stiffness: 200,
            delay: delay * 0.1 + 0.3,
            duration: 0.8,
          }}
        >
          {hasAnimated ? value : `${count}${suffix}`}
        </motion.div>

        {/* Label */}
        <motion.div
          className="text-sm font-medium text-gray-600"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: delay * 0.1 + 0.5 }}
        >
          {label}
        </motion.div>
      </div>

      {/* Decorative icon */}
      {icon && (
        <motion.div
          className="absolute top-3 right-3 text-blue-400/40"
          animate={{
            rotate: 360,
            scale: [1, 1.1, 1],
          }}
          transition={{
            rotate: { duration: 8, repeat: Infinity, ease: 'linear' },
            scale: { duration: 2, repeat: Infinity, delay: delay * 0.1 },
          }}
        >
          {icon}
        </motion.div>
      )}

      {/* Bottom glow effect */}
      <motion.div
        className="absolute bottom-0 left-1/2 h-1 w-3/4 -translate-x-1/2 transform rounded-full bg-gradient-to-r from-transparent via-blue-400/50 to-transparent"
        initial={{ opacity: 0, scaleX: 0 }}
        animate={inView ? { opacity: 1, scaleX: 1 } : { opacity: 0, scaleX: 0 }}
        transition={{ delay: delay * 0.1 + 0.8, duration: 0.6 }}
      />
    </motion.div>
  );
}
