'use client';
import Image from 'next/image';
import ChoiceSVG from '@/assets/choose-sealos-card.svg';

interface SealosChoiceCardProps {
  className?: string;
}

export function SealosChoiceCard({ className = '' }: SealosChoiceCardProps) {
  return (
    <div
      className={`relative ${className}`}
      aria-label="Have an idea, describe it to Sealos, and it's live"
    >
      {/* 静态SVG背景 - 保持原始尺寸 */}
      <Image
        src={ChoiceSVG}
        alt="Sealos Choice Card"
        className="absolute h-auto w-full -translate-y-1/2"
      />

      {/* 动画层 - 纯CSS动画 */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="-16 0 500 266"
        className="absolute -translate-y-1/2"
      >
        <style jsx>
          {`
            @keyframes pingingRing {
              0%,
              to {
                transform: scale(1);
                opacity: 0.3;
              }
              50% {
                transform: scale(1.15);
                opacity: 0.8;
              }
            }

            @keyframes lineGlow1 {
              0%,
              25% {
                clip-path: inset(0 0 100% 0);
                opacity: 1;
              }
              50% {
                clip-path: inset(0 0 0 0);
                opacity: 1;
              }
              50.1% {
                clip-path: inset(0 0 0 0);
                opacity: 0;
              }
              100% {
                clip-path: inset(0 0 100% 0);
                opacity: 0;
              }
            }

            @keyframes lineGlow2 {
              0%,
              50% {
                clip-path: inset(0 0 100% 0);
                opacity: 1;
              }
              75% {
                clip-path: inset(0 0 0 0);
                opacity: 1;
              }
              75.1% {
                clip-path: inset(0 0 0 0);
                opacity: 0;
              }
              100% {
                clip-path: inset(0 0 100% 0);
                opacity: 0;
              }
            }

            @keyframes lineGlow3 {
              0%,
              75% {
                clip-path: inset(0 0 100% 0);
                opacity: 1;
              }
              100% {
                clip-path: inset(0 0 0 0);
                opacity: 1;
              }
            }

            @keyframes horizontalGlow {
              0% {
                clip-path: inset(0 100% 0 0);
                opacity: 1;
              }
              25% {
                clip-path: inset(0 0 0 0);
                opacity: 1;
              }
              25.1% {
                clip-path: inset(0 0 0 0);
                opacity: 0;
              }
              100% {
                clip-path: inset(0 100% 0 0);
                opacity: 0;
              }
            }
          `}
        </style>
        <g>
          {/* 第一条竖线 - 灰色底 */}
          <path
            stroke="#717171"
            strokeDasharray="6 6"
            strokeWidth="3"
            d="M387.6 61.5v36.2"
            style={{ transform: 'translateX(-30px)' }}
          />
          {/* 第一条竖线 - 蓝色动画层 */}
          <path
            stroke="#5C9AFF"
            strokeDasharray="6 6"
            strokeWidth="3"
            d="M387.6 61.5v36.2"
            style={{
              transform: 'translateX(-30px)',
              animation: 'lineGlow1 4s infinite',
            }}
          />

          {/* 第二条竖线 - 灰色底 */}
          <path
            stroke="#717171"
            strokeDasharray="6 6"
            strokeWidth="3"
            d="M387.6 167.7V204"
            style={{ transform: 'translateX(-30px)' }}
          />
          {/* 第二条竖线 - 蓝色动画层 */}
          <path
            stroke="#5C9AFF"
            strokeDasharray="6 6"
            strokeWidth="3"
            d="M387.6 167.7V204"
            style={{
              transform: 'translateX(-30px)',
              animation: 'lineGlow2 4s infinite',
            }}
          />

          {/* 圆环动画 */}
          <circle
            cx="64.1"
            cy="135.8"
            r="63.5"
            stroke="#444"
            strokeWidth=".9"
            style={{
              transformOrigin: '64.098px 135.808px',
              animation: 'pingingRing 2s ease-in-out infinite',
            }}
          />

          {/* 水平箭头 - 灰色底 */}
          <path
            fill="#8B8B8B"
            d="m153.6 129.5.2.3-.2.2-4.2 7.4-1-.5 4.2-7.1-4.1-7.2.9-.5zm11.3 0 .1.3-.1.2-4.3 7.4-.9-.5 4.1-7.1-4-7.2.8-.5zm11.2 0 .2.3-.2.2-4.2 7.4-.9-.5 4.1-7.1-4.1-7.2.9-.5zm11.3 0 .1.3-.1.2-4.3 7.4-.8-.5 4-7.1-4-7.2.8-.5zm11.2 0 .2.3-.2.2-4.2 7.4-.9-.5 4.1-7.1-4-7.2.8-.5zm11.3 0 .1.3-.1.2-4.3 7.4-.8-.5 4-7.1-4-7.2.8-.5zm11.2 0 .2.3-.2.2-4.2 7.4-.9-.5 4.1-7.1-4-7.2.8-.5zm11.3 0 .1.3-.1.2-4.3 7.4-.8-.5 4-7.1-4-7.2.8-.5zm11.2 0 .2.3-.2.2-4.2 7.4-.9-.5 4.1-7.1-4-7.2.8-.5zm11.3 0 .1.3-.1.2-4.3 7.4-.8-.5 4-7.1-4-7.2.8-.5z"
            style={{ transform: 'scaleX(0.9)' }}
          />
          {/* 水平箭头 - 蓝色动画层 */}
          <path
            fill="#3B82F6"
            d="m153.6 129.5.2.3-.2.2-4.2 7.4-1-.5 4.2-7.1-4.1-7.2.9-.5zm11.3 0 .1.3-.1.2-4.3 7.4-.9-.5 4.1-7.1-4-7.2.8-.5zm11.2 0 .2.3-.2.2-4.2 7.4-.9-.5 4.1-7.1-4.1-7.2.9-.5zm11.3 0 .1.3-.1.2-4.3 7.4-.8-.5 4-7.1-4-7.2.8-.5zm11.2 0 .2.3-.2.2-4.2 7.4-.9-.5 4.1-7.1-4-7.2.8-.5zm11.3 0 .1.3-.1.2-4.3 7.4-.8-.5 4-7.1-4-7.2.8-.5zm11.2 0 .2.3-.2.2-4.2 7.4-.9-.5 4.1-7.1-4-7.2.8-.5zm11.3 0 .1.3-.1.2-4.3 7.4-.8-.5 4-7.1-4-7.2.8-.5zm11.2 0 .2.3-.2.2-4.2 7.4-.9-.5 4.1-7.1-4-7.2.8-.5zm11.3 0 .1.3-.1.2-4.3 7.4-.8-.5 4-7.1-4-7.2.8-.5z"
            style={{
              transform: 'scaleX(0.9)',
              animation: 'horizontalGlow 4s infinite',
            }}
          />

          {/* 矩形 - 灰色底 */}
          <rect
            width="227"
            height="53"
            x="274.1"
            y="212.5"
            stroke="#A9A9A9"
            style={{ transform: 'translateX(-30px)' }}
            rx="26.5"
          />
          {/* 矩形 - 蓝色动画层 */}
          <rect
            width="227"
            height="53"
            x="274.1"
            y="212.5"
            stroke="#0051E6"
            style={{
              transform: 'translateX(-30px)',
              animation: 'lineGlow3 4s infinite',
            }}
            rx="26.5"
          />
        </g>
      </svg>
    </div>
  );
}
