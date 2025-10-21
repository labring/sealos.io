'use client';
import Image from 'next/image';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import DeploymentImage from './assets/image.svg';

export function DeploymentCard() {
  const containerRef = useRef<HTMLDivElement>(null);

  // 使用 useInView 检测组件是否在视口内
  const isInView = useInView(containerRef, {
    margin: '0px 0px -10% 0px',
    amount: 0.2,
  });

  // 渐变动画：从左侧区域外开始，移动到右侧区域外
  // 原始范围 x1=217, x2=339，总长度 122
  // 扩展范围：在左边多加 150，在右边多加 800
  const leftExtend = 150;
  const rightExtend = 800;
  const startX1 = 217 - leftExtend; // 67
  const startX2 = 217; // 217
  const endX1 = 339; // 339
  const endX2 = 339 + rightExtend; // 619

  return (
    <div
      ref={containerRef}
      className="relative flex h-full w-full items-center justify-center overflow-hidden"
    >
      {/* 原始 SVG 图片 */}
      <Image src={DeploymentImage} alt="Deployment" className="h-full w-auto" />

      {/* 动画渐变层 */}
      <svg
        className="absolute inset-0 h-full w-full"
        width="514"
        height="210"
        viewBox="0 0 514 210"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ pointerEvents: 'none' }}
      >
        {/* 左侧曲线 path */}
        <path
          d="M253 28.499C270.16 28.499 285.64 38.8089 292.254 54.6426L303.668 81.9668C309.323 95.5053 322.179 104.556 336.692 105.429C337.457 105.384 338.227 105.36 339 105.36V106.499C338.666 106.499 338.333 106.493 338 106.484V107H332.048C319.501 109.326 308.76 117.852 303.777 129.936L292.136 158.166C285.599 174.017 270.146 184.36 253 184.36V183.36C269.741 183.36 284.829 173.261 291.211 157.784L302.853 129.555C307.418 118.483 316.695 110.321 327.795 107H217V106H331.955C332.083 105.977 332.211 105.953 332.339 105.931C319.243 103.681 307.984 94.8922 302.745 82.3516L291.331 55.0273C284.872 39.5661 269.756 29.499 253 29.499V28.499Z"
          fill="url(#paint0_linear_animated)"
        />

        {/* 右侧矩形边框 */}
        <rect
          x="339.5"
          y="78.5"
          width="174"
          height="53"
          rx="26.5"
          fill="none"
          stroke="url(#paint0_linear_animated)"
          strokeWidth="1"
        />

        <defs>
          <motion.linearGradient
            id="paint0_linear_animated"
            y1="106.43"
            y2="106.43"
            gradientUnits="userSpaceOnUse"
            initial={{ x1: startX1, x2: startX2 }}
            animate={
              isInView
                ? {
                    x1: [startX1, endX1],
                    x2: [startX2, endX2],
                  }
                : { x1: startX1, x2: startX2 }
            }
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'linear',
            }}
          >
            <stop stopColor="#6B7280" />
            <stop offset="0.3" stopColor="white" />
            <stop offset="0.7" stopColor="#146DFF" />
            <stop offset="1" stopColor="#6B7280" />
          </motion.linearGradient>
        </defs>
      </svg>
    </div>
  );
}
