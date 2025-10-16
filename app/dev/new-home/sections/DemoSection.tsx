'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { FeatureStepper } from '../components/FeatureStepper';
import DemoLightSvg from '../assets/demo-light.svg';

export function DemoSection() {
  const demoRef = useRef<HTMLDivElement>(null);

  // 使用 useScroll 跟踪元素的滚动进度
  const { scrollYProgress } = useScroll({
    target: demoRef,
    // 当元素顶边进入viewport底部时开始(start start)
    // 当元素底边到达viewport底部时结束(end end)
    offset: ['start end', 'end end'],
  });

  // 将滚动进度映射到旋转角度：从24度到0度
  const rotateAngle = useTransform(scrollYProgress, [0, 1], [24, 0]);

  return (
    <section className="relative mt-28">
      {/* Light */}
      <div className="absolute top-0 -z-10 -mt-36 w-full">
        <img src={DemoLightSvg.src} alt="" className="w-full" />
      </div>

      {/* Stepper */}
      <FeatureStepper />

      {/* Demo */}
      <div className="perspective-midrange perspective-origin-center">
        <motion.div
          ref={demoRef}
          className="bg-background mx-auto mt-12 aspect-video max-h-[calc(100vh-8rem)] origin-[top_center] rounded-4xl border-4"
          style={{
            rotateX: rotateAngle,
          }}
        >
          Video here
        </motion.div>
      </div>
    </section>
  );
}
