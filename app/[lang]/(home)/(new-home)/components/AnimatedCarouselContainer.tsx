'use client';

import { ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface AnimatedCarouselContainerProps {
  activeIndex: number;
  children: ReactNode;
}

export function AnimatedCarouselContainer({
  activeIndex,
  children,
}: AnimatedCarouselContainerProps) {
  return (
    <div className="relative pb-[35rem] sm:pb-[38rem] lg:pb-[40rem] 2xl:pb-[44rem]">
      <AnimatePresence initial={false} mode="popLayout">
        <motion.div
          key={`carousel-item-${activeIndex}`}
          className="absolute w-full"
          initial={{
            opacity: 0,
            scale: 1.05,
            filter: 'blur(8px)',
            y: -20,
            zIndex: 10,
          }}
          animate={{
            opacity: 1,
            scale: 1,
            filter: 'blur(0px)',
            y: 0,
            zIndex: 10,
          }}
          exit={{
            opacity: 0,
            scale: 0.95,
            filter: 'blur(8px)',
            y: 20,
            zIndex: 20,
          }}
          transition={{
            duration: 0.6,
            ease: [0.4, 0, 0.2, 1],
          }}
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
