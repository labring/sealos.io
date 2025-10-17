'use client';
import AiAgentImage from './image.svg';
import Image from 'next/image';

export function AiAgentCard() {
  return (
    <div className="relative flex h-full w-full justify-center overflow-hidden">
      {/* AI Agent 图片 - 顶部对齐 */}
      <div className="absolute top-0 flex justify-center">
        <Image
          src={AiAgentImage}
          alt=""
          className="pointer-events-none h-auto"
        />
      </div>
    </div>
  );
}
