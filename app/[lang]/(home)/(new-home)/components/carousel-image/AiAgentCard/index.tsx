'use client';
import AiAgentImage from './image.svg';
import Image from 'next/image';

export function AiAgentCard() {
  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden">
      {/* AI Agent 图片 - 垂直居中，占满高度，按宽度计算 */}
      <div className="flex h-full w-full items-center justify-center">
        <Image
          src={AiAgentImage}
          alt=""
          className="pointer-events-none h-full w-auto"
        />
      </div>
    </div>
  );
}
