'use client';

import { useEffect, useRef, useState } from 'react';

import { cn } from '@/lib/utils';

import {
  demoActiveEventName,
  demoJumpEventName,
  demoNavigationItems,
} from './demo-navigation';

export function HeroDemoCards() {
  const activeIndexRef = useRef(0);
  const transitionLockRef = useRef(false);
  const transitionTimeoutRef = useRef<number>();
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPinned, setIsPinned] = useState(false);
  const [isReleased, setIsReleased] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [releaseOffset, setReleaseOffset] = useState(0);
  const [fixedTop, setFixedTop] = useState(112);

  useEffect(() => {
    const handleActiveDemo = (event: Event) => {
      const nextIndex = (event as CustomEvent<number>).detail;

      if (typeof nextIndex === 'number') {
        activeIndexRef.current = nextIndex;
        setActiveIndex(nextIndex);
      }
    };

    window.addEventListener(demoActiveEventName, handleActiveDemo);

    return () => {
      window.removeEventListener(demoActiveEventName, handleActiveDemo);
    };
  }, []);

  useEffect(() => {
    const updatePin = () => {
      const heroCards = document.getElementById('hero-demo-cards');
      const demosSection = document.getElementById('demos-section');

      if (!heroCards || !demosSection) {
        return;
      }

      const topOffset = 112;
      const pinStart = heroCards.offsetTop - topOffset;
      const pinEnd =
        demosSection.offsetTop + demosSection.offsetHeight - window.innerHeight;
      const scrollY = window.scrollY;

      setFixedTop(topOffset);
      setIsPinned(scrollY >= pinStart && scrollY < pinEnd + window.innerHeight);
      setIsReleased(scrollY >= pinEnd);
      setReleaseOffset(Math.max(0, scrollY - pinEnd));
    };

    updatePin();
    window.addEventListener('scroll', updatePin, { passive: true });
    window.addEventListener('resize', updatePin);

    return () => {
      window.removeEventListener('scroll', updatePin);
      window.removeEventListener('resize', updatePin);
    };
  }, []);

  useEffect(() => {
    return () => {
      if (transitionTimeoutRef.current) {
        window.clearTimeout(transitionTimeoutRef.current);
      }
    };
  }, []);

  const handleDemoSelect = (index: number) => {
    const section = document.getElementById('demos-section');

    if (!section || transitionLockRef.current) {
      return;
    }

    const sectionTop = window.scrollY + section.getBoundingClientRect().top;
    const isInsideSection =
      window.scrollY >= sectionTop &&
      window.scrollY <= sectionTop + section.offsetHeight - window.innerHeight;
    const isCurrentInSection =
      isInsideSection && index === activeIndexRef.current;
    const scrollableDistance = section.offsetHeight - window.innerHeight;
    const progress =
      index === demoNavigationItems.length - 1
        ? 1
        : (index + 0.05) / demoNavigationItems.length;
    const nextScrollTop = sectionTop + scrollableDistance * progress;

    activeIndexRef.current = index;
    setActiveIndex(index);

    if (!isInsideSection || isCurrentInSection) {
      window.scrollTo({
        top: nextScrollTop,
        behavior: 'auto',
      });
      return;
    }

    setIsTransitioning(true);
    transitionLockRef.current = true;
    window.dispatchEvent(new CustomEvent(demoJumpEventName, { detail: index }));
    transitionTimeoutRef.current = window.setTimeout(() => {
      window.scrollTo({
        top: nextScrollTop,
        behavior: 'auto',
      });
      transitionLockRef.current = false;
      setIsTransitioning(false);
    }, 500);
  };

  return (
    <div id="hero-demo-cards" className="relative">
      <DemoCardsGrid
        activeIndex={activeIndex}
        hidden={isPinned}
        isTransitioning={isTransitioning}
        onSelect={handleDemoSelect}
      />
      {isPinned && (
        <div
          className="fixed inset-x-0 z-40"
          style={{
            top: fixedTop,
            transform: isReleased
              ? `translate3d(0, -${releaseOffset}px, 0)`
              : undefined,
          }}
        >
          <div className="container mx-auto px-4 xl:px-14.25 2xl:px-15">
            <DemoCardsGrid
              activeIndex={activeIndex}
              isTransitioning={isTransitioning}
              onSelect={handleDemoSelect}
            />
          </div>
        </div>
      )}
    </div>
  );
}

function DemoCardsGrid({
  activeIndex,
  hidden = false,
  isTransitioning,
  onSelect,
}: {
  activeIndex: number;
  hidden?: boolean;
  isTransitioning: boolean;
  onSelect: (index: number) => void;
}) {
  return (
    <div
      className={cn(
        'grid gap-3 md:grid-cols-2 xl:grid-cols-4',
        hidden && 'opacity-0',
      )}
    >
      {demoNavigationItems.map(({ title, description, Icon, id }, index) => (
        <a
          key={title}
          className={cn(
            'group block rounded-xl border p-5 text-left transition hover:border-white/10 hover:bg-white/[0.04]',
            activeIndex === index
              ? 'border-white/10 bg-white/[0.04]'
              : 'border-transparent bg-transparent',
          )}
          href={`#${id}`}
          onClick={(event) => {
            event.preventDefault();
            onSelect(index);
          }}
        >
          <div className="mb-1.5 flex items-center gap-2 text-base font-medium text-white">
            <Icon
              className="text-zinc-300 transition-colors group-hover:text-white"
              size={16}
              aria-hidden="true"
            />
            {title}
          </div>
          <p className="text-sm leading-5 text-zinc-400">{description}</p>
        </a>
      ))}
    </div>
  );
}
