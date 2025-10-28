'use client';
import Image from 'next/image';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

// Import logos
import AnthropicLogo from '../../../assets/aiagent-appicons/anthropic.svg';
import AwsLogo from '../../../assets/aiagent-appicons/aws.svg';
import AzureLogo from '../../../assets/aiagent-appicons/azure.svg';
import ClaudeLogo from '../../../assets/aiagent-appicons/claude.svg';
import DeepseekLogo from '../../../assets/aiagent-appicons/deepseek.svg';
import GeminiLogo from '../../../assets/aiagent-appicons/gemini.svg';
import OpenaiLogo from '../../../assets/aiagent-appicons/openai.svg';
import QwenLogo from '../../../assets/aiagent-appicons/qwen.svg';
import SealosLogo from '../../../assets/shared-icons/sealos.svg';

// 定义每行的图标配置
const logoRows = [
  // 第一行 - 向右滚动
  {
    logos: [AnthropicLogo, AwsLogo, AzureLogo, ClaudeLogo],
    direction: 'right' as const,
  },
  // 第二行 - 向左滚动
  {
    logos: [DeepseekLogo, GeminiLogo, OpenaiLogo, QwenLogo],
    direction: 'left' as const,
  },
  // 第三行 - 向右滚动
  {
    logos: [AzureLogo, ClaudeLogo, AnthropicLogo, AwsLogo],
    direction: 'right' as const,
  },
];

export function AiRuntimeCard() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, amount: 0.1 });

  return (
    <div
      ref={ref}
      className="relative h-full w-full overflow-hidden rounded-2xl"
    >
      {/* 暗角特效 - SVG 径向渐变叠加层 */}
      <svg
        className="pointer-events-none absolute inset-0 z-10 h-full w-full"
        preserveAspectRatio="none"
      >
        <defs>
          <radialGradient id="vignette-ai" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="black" stopOpacity="0" />
            <stop offset="40%" stopColor="black" stopOpacity="0" />
            <stop offset="100%" stopColor="black" stopOpacity="0.4" />
          </radialGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(#vignette-ai)" />
      </svg>

      {/* 图标墙内容 */}
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 py-4">
        {logoRows.map((row, rowIndex) => (
          <div
            key={rowIndex}
            className="relative h-[72px]"
            style={{
              width: 'calc(5 * 72px + 4 * 16px)', // 5个图标 + 4个间距
            }}
          >
            <motion.div
              className="flex gap-4 will-change-transform"
              animate={
                isInView
                  ? row.direction === 'right'
                    ? { x: ['0%', '-50%'] }
                    : { x: ['-50%', '0%'] }
                  : {}
              }
              transition={{
                duration: 15,
                repeat: Infinity,
                ease: 'linear',
              }}
            >
              {/* 渲染两批相同内容 */}
              {[...row.logos, ...row.logos].map((logo, logoIndex) => (
                <div
                  key={logoIndex}
                  className="flex h-[72px] w-[72px] shrink-0 items-center justify-center overflow-hidden rounded-[18px] bg-white/5 p-3 backdrop-blur-sm"
                  style={{
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                  }}
                >
                  <Image
                    src={logo}
                    alt=""
                    width={56}
                    height={56}
                    className="h-full w-full object-contain"
                  />
                </div>
              ))}
            </motion.div>
          </div>
        ))}
      </div>

      {/* Sealos Logo - 居中不动 */}
      <div className="absolute inset-0 z-20 flex items-center justify-center">
        <div className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-[32px] border border-neutral-700 bg-gradient-to-b from-neutral-700 to-neutral-900 p-6">
          <Image
            src={SealosLogo}
            alt="Sealos"
            width={96}
            height={96}
            className="h-full w-full object-contain"
          />
        </div>
      </div>
    </div>
  );
}
