'use client';

import { motion, useScroll, useSpring } from 'motion/react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';

interface ScrollProgressProps {
  className?: string;
  color?: string;
}

export function ScrollProgress({
  className,
  color = 'bg-gradient-to-r from-[#44BCFF] via-[#FF44EC] to-[#FF675E]',
}: ScrollProgressProps) {
  const { scrollYProgress } = useScroll();

  const scaleX = useSpring(scrollYProgress, {
    stiffness: 200,
    damping: 50,
    restDelta: 0.001,
  });

  return (
    <motion.div
      className={cn(
        'fixed inset-x-0 top-0 z-30 h-1 origin-left',
        color,
        className,
      )}
      style={{
        scaleX,
      }}
    />
  );
}

interface ScrollDownIndicatorProps {
  className?: string;
  onClick?: () => void;
}

export function ScrollDownIndicator({
  className,
  onClick,
}: ScrollDownIndicatorProps) {
  const [isVisible, setIsVisible] = useState(true);

  // Hide the indicator when user scrolls down
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsVisible(scrollPosition < 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleClick = () => {
    // Scroll down to the next section
    window.scrollTo({
      top: window.innerHeight,
      behavior: 'smooth',
    });

    if (onClick) onClick();
  };

  return (
    <motion.div
      className={cn(
        'absolute bottom-8 left-1/2 flex -translate-x-1/2 cursor-pointer flex-col items-center justify-center',
        isVisible ? 'opacity-100' : 'pointer-events-none opacity-0',
        className,
      )}
      initial={{ opacity: 0, y: 10 }}
      animate={{
        opacity: isVisible ? 1 : 0,
        y: isVisible ? 0 : 10,
        transition: {
          delay: 1,
          duration: 0.5,
        },
      }}
      onClick={handleClick}
    >
      <span className="mb-2 text-sm font-medium text-gray-600">
        Scroll for more
      </span>
      <motion.div
        className="flex size-10 items-center justify-center rounded-full bg-white/80 shadow-md backdrop-blur-sm"
        animate={{
          y: [0, 5, 0],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          repeatType: 'loop',
          ease: 'easeInOut',
        }}
      >
        <ChevronDown className="h-5 w-5 text-gray-700" />
      </motion.div>
    </motion.div>
  );
}
