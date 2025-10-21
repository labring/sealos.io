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

// 定义每行的图标配置 - 增加图标数量确保无空白
const logoRows = [
  // 第一行 - 向右滚动
  {
    logos: [
      AnthropicLogo,
      AwsLogo,
      AzureLogo,
      ClaudeLogo,
      AnthropicLogo,
      AwsLogo,
      AzureLogo,
      ClaudeLogo,
      AnthropicLogo,
      AwsLogo,
      AzureLogo,
      ClaudeLogo,
      AnthropicLogo,
      AwsLogo,
      AzureLogo,
      ClaudeLogo,
    ],
    direction: 'right' as const,
  },
  // 第二行 - 向左滚动
  {
    logos: [
      DeepseekLogo,
      GeminiLogo,
      OpenaiLogo,
      QwenLogo,
      DeepseekLogo,
      GeminiLogo,
      OpenaiLogo,
      QwenLogo,
      DeepseekLogo,
      GeminiLogo,
      OpenaiLogo,
      QwenLogo,
      DeepseekLogo,
      GeminiLogo,
      OpenaiLogo,
      QwenLogo,
    ],
    direction: 'left' as const,
  },
  // 第三行 - 向右滚动
  {
    logos: [
      AzureLogo,
      ClaudeLogo,
      AnthropicLogo,
      AwsLogo,
      AzureLogo,
      ClaudeLogo,
      AnthropicLogo,
      AwsLogo,
      AzureLogo,
      ClaudeLogo,
      AnthropicLogo,
      AwsLogo,
      AzureLogo,
      ClaudeLogo,
      AnthropicLogo,
      AwsLogo,
    ],
    direction: 'right' as const,
  },
];

export function AiRuntimeCard() {
  const containerRef = useRef<HTMLDivElement>(null);

  // 使用 useInView 检测组件是否在视口内
  const isInView = useInView(containerRef, {
    margin: '0px 0px -10% 0px',
    amount: 0.2,
  });

  return (
    <div
      ref={containerRef}
      className="relative h-full w-full overflow-hidden rounded-2xl"
    >
      {/* 暗角特效 */}
      <div
        className="pointer-events-none absolute inset-0 z-10"
        style={{
          background: `
            radial-gradient(ellipse at center, transparent 0%, transparent 40%, rgba(0,0,0,0.4) 100%)
          `,
          mixBlendMode: 'darken',
        }}
      />

      {/* 图标墙内容 */}
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 py-4">
        {logoRows.map((row, rowIndex) => (
          <div
            key={rowIndex}
            className="relative h-[72px] overflow-visible"
            style={{
              width: 'calc(5 * 72px + 4 * 16px)', // 5个图标 + 4个间距
            }}
          >
            <div className="absolute top-0 left-1/2 h-full -translate-x-1/2">
              <motion.div
                className="flex gap-4 will-change-transform"
                animate={
                  isInView
                    ? {
                        transform:
                          row.direction === 'right'
                            ? ['translateX(0px)', 'translateX(-352px)']
                            : ['translateX(-352px)', 'translateX(0px)'],
                      }
                    : undefined
                }
                transition={{
                  duration: 15,
                  repeat: Infinity,
                  repeatType: 'reverse',
                  ease: 'linear',
                }}
                style={{
                  width: 'max-content',
                }}
              >
                {row.logos.map((logo, logoIndex) => (
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
