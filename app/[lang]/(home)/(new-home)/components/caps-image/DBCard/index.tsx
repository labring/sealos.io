'use client';
import Image from 'next/image';
import DBImage from './index.svg';

export function DBCard() {
  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden">
      {/* 原始 SVG 图片 */}
      <Image src={DBImage} alt="Database" className="h-auto w-full" />
    </div>
  );
}
