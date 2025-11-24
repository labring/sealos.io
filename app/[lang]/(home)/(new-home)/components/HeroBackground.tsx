import Image from 'next/image';
import HeroGrid from '@/assets/hero-grid.svg';

export function HeroBackground() {
  return (
    <>
      {/* 背景网格 - 放在section底部 */}
      <div
        className="pointer-events-none absolute right-0 bottom-0 left-0 -z-20 container h-[30rem] overflow-visible"
        aria-hidden="true"
      >
        <Image
          src={HeroGrid}
          className="h-full w-full overflow-visible object-cover object-bottom"
          alt=""
        />
      </div>

      <div
        className="absolute right-0 bottom-0 left-0 h-32"
        style={{
          background:
            'linear-gradient(to bottom, transparent 0%, var(--color-background) 100%)',
          mixBlendMode: 'multiply',
        }}
      />
    </>
  );
}
