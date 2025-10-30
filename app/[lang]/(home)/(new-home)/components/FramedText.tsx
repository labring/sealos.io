import React from 'react';

export function FramedText({ children }: { children?: React.ReactNode }) {
  const gradientId = React.useId();

  return (
    <span className="relative inline-block overflow-visible">
      <svg
        className="absolute inset-0 h-full w-full"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
        style={{ overflow: 'visible' }}
        aria-hidden="true"
      >
        <defs>
          {/* 定义渐变色 - 从 white 到 blue-600 */}
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="white" />
            <stop offset="100%" stopColor="#2563eb" />
          </linearGradient>
        </defs>

        {/* 背景矩形 - white 5% */}
        <rect
          x="0"
          y="0"
          width="100%"
          height="100%"
          fill="rgba(255, 255, 255, 0.05)"
          stroke={`url(#${gradientId})`}
          strokeWidth="1"
        />

        {/* 左上角实心矩形 - 中心在边框上 */}
        <rect x="-2" y="-2" width="4" height="4" fill={`url(#${gradientId})`} />

        {/* 右上角实心矩形 - 中心在边框上 */}
        <rect
          x="calc(100% - 2px)"
          y="-2"
          width="4"
          height="4"
          fill={`url(#${gradientId})`}
        />

        {/* 左下角实心矩形 - 中心在边框上 */}
        <rect
          x="-2"
          y="calc(100% - 2px)"
          width="4"
          height="4"
          fill={`url(#${gradientId})`}
        />

        {/* 右下角实心矩形 - 中心在边框上 */}
        <rect
          x="calc(100% - 2px)"
          y="calc(100% - 2px)"
          width="4"
          height="4"
          fill={`url(#${gradientId})`}
        />
      </svg>

      {/* 文字内容 */}
      <span className="relative z-10 inline-block px-3 py-1">{children}</span>
    </span>
  );
}
