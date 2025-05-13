'use client';

import { motion, useInView } from 'framer-motion';
import { ReactNode, useRef, memo } from 'react';

type AnimationType = 'fadeIn' | 'slideUp' | 'scale' | 'rotate';

interface AnimateElementProps {
  children: ReactNode;
  type: AnimationType;
  delay?: number;
  duration?: number;
  className?: string;
}

// Pre-define animation variants to avoid recreating objects on each render
const animations = {
  fadeIn: { opacity: [0, 1] },
  slideUp: { opacity: [0, 1], y: [50, 0] },
  scale: { scale: [0, 1] },
  rotate: { rotate: [-180, 0], opacity: [0, 1] },
};

// Hidden variant is constant, so define it outside the component
const hiddenVariant = { opacity: 0, y: 50 };

// Memoize the component to prevent unnecessary re-renders
export const AnimateElement = memo(({
  children,
  type,
  delay = 0.2,
  duration = 0.4,
  className,
}: AnimateElementProps) => {
  const ref = useRef(null);
  // Only track inView changes, with a margin to start animation before fully in view
  const isInView = useInView(ref, {
    once: true, // Only animate once
    margin: "-10% 0px" // Start animation when element is 10% away from viewport
  });

  // Create the visible variant with the specific animation type
  const visibleVariant = {
    ...animations[type],
    transition: {
      duration,
      delay,
      // Use a simpler easing function for better performance
      ease: "easeOut",
    },
  };

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={{
        hidden: hiddenVariant,
        visible: visibleVariant,
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
});
