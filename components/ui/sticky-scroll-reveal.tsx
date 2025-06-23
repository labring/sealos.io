import { cn } from '@/lib/utils';
import { motion, useMotionValueEvent, useScroll } from 'framer-motion';
import React, { useRef, useState, useMemo, memo, useCallback } from 'react';

interface StickyScrollContent {
  title: string;
  subtitle?: string;
  description: string;
  content?: React.ReactNode;
  icon?: React.ReactNode;
}

interface StickyScrollProps {
  content: StickyScrollContent[];
  contentClassName?: string;
}

const StickyScroll = memo<StickyScrollProps>(({
  content,
  contentClassName,
}) => {
  const targetRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeCard, setActiveCard] = useState(0);

  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ['0px 200px', 'end center'],
  });

  // Memoize active ranges to prevent recreation on every render
  const activeRanges = useMemo(() => [
    [0, 0.3],
    [0.31, 0.6],
    [0.61, 1],
  ], []);

  // Memoize the scroll handler to prevent unnecessary re-renders
  const handleScrollChange = useCallback((latest: number) => {
    for (let i = 0; i < activeRanges.length; i++) {
      if (latest >= activeRanges[i][0] && latest < activeRanges[i][1]) {
        setActiveCard(i);
        break;
      }
    }
  }, [activeRanges]);

  useMotionValueEvent(scrollYProgress, 'change', handleScrollChange);

  return (
    <motion.div
      ref={targetRef}
      className="relative flex justify-between gap-16"
    >
      <div className="basis-2/5 space-y-24 py-20 ">
        {content.map((item, index) => (
          <motion.div
            key={item.title + index}
            className="flex gap-5"
            initial={{ opacity: 0.2 }}
            animate={{ opacity: activeCard === index ? 1 : 0.2 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-[#F4FCFF]">
              {item?.icon ?? null}
            </div>
            <div className="flex flex-col gap-3">
              <h2 className="text-2xl font-bold">{item.title}</h2>
              {item.subtitle && (
                <p className="text-base text-blue-600">{item.subtitle}</p>
              )}
              <p className="text-lg text-[#4E6185]">{item.description}</p>
            </div>
          </motion.div>
        ))}
      </div>
      <div className="relative basis-1/2">
        <div
          className={cn('sticky top-[200px] h-2/5 w-full', contentClassName)}
        >
          {content[activeCard].content ?? null}
        </div>
      </div>
    </motion.div>
  );
});

StickyScroll.displayName = 'StickyScroll';

export default StickyScroll;
