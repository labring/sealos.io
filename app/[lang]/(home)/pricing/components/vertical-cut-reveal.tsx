'use client';

import { motion, useInView } from 'framer-motion';
import { ReactNode, useRef, useMemo } from 'react';
import { cn } from '@/lib/utils';

interface VerticalCutRevealProps {
  children: ReactNode | string;
  className?: string;
  delay?: number;
  duration?: number;
  splitBy?: 'words' | 'characters' | 'lines';
  staggerDelay?: number;
  animateOnce?: boolean;
}

function splitText(text: string, splitBy: 'words' | 'characters' | 'lines') {
  if (splitBy === 'words') {
    return text
      .split(' ')
      .map((word, i, arr) => (i < arr.length - 1 ? word + ' ' : word));
  } else if (splitBy === 'characters') {
    // Use Intl.Segmenter for proper character splitting (handles emojis, etc.)
    if (typeof Intl !== 'undefined' && Intl.Segmenter) {
      const segmenter = new Intl.Segmenter(undefined, {
        granularity: 'grapheme',
      });
      return Array.from(segmenter.segment(text)).map((seg) => seg.segment);
    }
    return text.split('');
  } else {
    return [text];
  }
}

export function VerticalCutReveal({
  children,
  className = '',
  delay = 0,
  duration = 0.5,
  splitBy = 'words',
  staggerDelay = 0.05,
  animateOnce = true,
}: VerticalCutRevealProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: animateOnce, margin: '-20%' });

  const content = useMemo(() => {
    if (typeof children === 'string') {
      return splitText(children, splitBy);
    }
    return [children];
  }, [children, splitBy]);

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: staggerDelay,
        delayChildren: delay,
      },
    },
  };

  const itemVariants = {
    hidden: {
      y: '100%',
      opacity: 0,
    },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration,
        ease: [0.4, 0, 0.2, 1] as [number, number, number, number],
      },
    },
  };

  return (
    <motion.div
      ref={ref}
      className={cn('inline-flex flex-wrap', className)}
      variants={containerVariants}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
    >
      {content.map((item, index) => (
        <span
          key={index}
          className={cn(
            'inline-block overflow-hidden',
            // Ensure visible spacing between words
            splitBy === 'words' && index !== content.length - 1 && 'mr-[0.25em]'
          )}
        >
          <motion.span className="inline-block" variants={itemVariants}>
            {item}
          </motion.span>
        </span>
      ))}
    </motion.div>
  );
}
