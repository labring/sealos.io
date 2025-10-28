'use client';
import InputCard from './assets/input-card.svg';
import ResponseCard from './assets/response-card.svg';
import ReportCard from './assets/report-card.svg';
import Image from 'next/image';
import { useAnimate } from 'framer-motion';
import { useEffect, memo } from 'react';

interface IdeaCardProps {
  isActive?: boolean;
}

export const IdeaCard = memo(function IdeaCard({
  isActive = false,
}: IdeaCardProps) {
  const [scope, animate] = useAnimate();

  useEffect(() => {
    if (!isActive) return;

    // 使用 useAnimate 实现卡片入场动画
    const animations = [
      animate(
        '[data-card="report"]',
        {
          opacity: [0, 1],
          transform: ['translateY(-80px)', 'translateY(0px)'],
        },
        { duration: 0.6, delay: 0.6 },
      ),
      animate(
        '[data-card="response"]',
        {
          opacity: [0, 1],
          transform: ['translateY(-80px)', 'translateY(0px)'],
        },
        { duration: 0.6, delay: 0.3 },
      ),
      animate(
        '[data-card="input"]',
        {
          opacity: [0, 1],
          transform: ['translateY(-80px)', 'translateY(0px)'],
        },
        { duration: 0.6, delay: 0 },
      ),
    ];

    // 清理函数：停止所有动画
    return () => {
      animations.forEach((anim) => anim.stop());
    };
  }, [animate, isActive]);

  return (
    <svg className="h-full w-full overflow-visible">
      <foreignObject x="0" y="0" width="100%" height="100%">
        <div ref={scope} className="relative h-full w-full overflow-hidden">
          <div
            data-card="report"
            className="absolute top-[10%] left-[30%] w-[65%] will-change-transform"
            style={{ opacity: 0 }}
          >
            <Image src={ReportCard} alt="" className="h-auto w-full" />
          </div>
          <div
            data-card="response"
            className="absolute top-[30%] left-[20%] w-[65%] will-change-transform"
            style={{ opacity: 0 }}
          >
            <Image src={ResponseCard} alt="" className="h-auto w-full" />
          </div>
          <div
            data-card="input"
            className="absolute top-[50%] left-[10%] w-[65%] will-change-transform"
            style={{ opacity: 0 }}
          >
            <Image src={InputCard} alt="" className="h-auto w-full" />
          </div>
        </div>
      </foreignObject>
    </svg>
  );
});
