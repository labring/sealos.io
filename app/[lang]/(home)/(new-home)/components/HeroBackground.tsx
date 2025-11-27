import Image from 'next/image';
import HeroGrid from '@/assets/hero-grid.svg';
import HeroGridAnimation from '@/assets/hero-grid-animation.svg';

export function HeroBackground() {
  return (
    <>
      {/* 背景网格 - 放在section底部 */}
      <div
        className="pointer-events-none absolute right-0 bottom-0 left-0 -z-20 h-[30rem] overflow-visible"
        aria-hidden="true"
      >
        <Image
          src={HeroGridAnimation}
          className="absolute left-1/2 h-full w-full max-w-[2400px] -translate-x-1/2 object-cover object-bottom"
          alt=""
        />
        <Image
          src={HeroGrid}
          className="absolute left-1/2 h-full w-full max-w-[2400px] -translate-x-1/2 object-cover object-bottom"
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
