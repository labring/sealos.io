'use client';

import { useEffect, useRef, useState } from 'react';

import { cn } from '@/lib/utils';

import {
  demoActiveEventName,
  demoHandoffEventName,
  demoJumpEventName,
  demoNavigationItems,
} from './demo-navigation';

type HeroDemoCardsProps = {
  pinDelayPx?: number;
  pinDelayVh?: number;
  pinStartElementId?: string;
};

export function HeroDemoCards({
  pinDelayPx = 0,
  pinDelayVh = 0,
  pinStartElementId,
}: HeroDemoCardsProps) {
  const activeIndexRef = useRef(0);
  const transitionLockRef = useRef(false);
  const transitionTimeoutRef = useRef<number>();
  const [isHandoffHidden, setIsHandoffHidden] = useState(false);
  const [isPinned, setIsPinned] = useState(false);
  const [isReleased, setIsReleased] = useState(false);
  const [releaseOffset, setReleaseOffset] = useState(0);
  const [fixedTop, setFixedTop] = useState(112);

  useEffect(() => {
    const handleActiveDemo = (event: Event) => {
      const nextIndex = (event as CustomEvent<number>).detail;

      if (typeof nextIndex === 'number') {
        activeIndexRef.current = nextIndex;
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
      const pinStartElement = pinStartElementId
        ? document.getElementById(pinStartElementId)
        : heroCards;

      if (!pinStartElement) {
        return;
      }

      const pinStartOffset =
        pinStartElement === heroCards ? 0 : heroCards.offsetTop;
      const pinStart =
        pinStartElement.offsetTop +
        pinStartOffset -
        topOffset +
        Math.max(window.innerHeight * pinDelayVh, pinDelayPx);
      const pinEnd =
        demosSection.offsetTop + demosSection.offsetHeight - window.innerHeight;
      const scrollY = window.scrollY;

      setFixedTop(topOffset);
      setIsPinned(scrollY >= pinStart && scrollY < pinEnd + window.innerHeight);
      setIsReleased(scrollY >= pinEnd);
      setReleaseOffset(Math.max(0, scrollY - pinEnd));
    };
    const handleDemoHandoff = (event: Event) => {
      const hidden = (event as CustomEvent<boolean>).detail !== false;

      setIsHandoffHidden(hidden);
      if (!hidden) {
        updatePin();
      }
    };

    updatePin();
    window.addEventListener(demoHandoffEventName, handleDemoHandoff);
    window.addEventListener('scroll', updatePin, { passive: true });
    window.addEventListener('resize', updatePin);

    return () => {
      window.removeEventListener(demoHandoffEventName, handleDemoHandoff);
      window.removeEventListener('scroll', updatePin);
      window.removeEventListener('resize', updatePin);
    };
  }, [pinDelayPx, pinDelayVh, pinStartElementId]);

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
    window.dispatchEvent(new CustomEvent(demoJumpEventName, { detail: index }));

    if (!isInsideSection || isCurrentInSection) {
      window.scrollTo({
        top: nextScrollTop,
        behavior: 'auto',
      });
      return;
    }

    transitionLockRef.current = true;
    window.scrollTo({
      top: nextScrollTop,
      behavior: 'auto',
    });
    transitionTimeoutRef.current = window.setTimeout(() => {
      transitionLockRef.current = false;
    }, 250);
  };

  return (
    <div id="hero-demo-cards" className="relative">
      <DemoCardsGrid
        hidden={isPinned || isHandoffHidden}
        onSelect={handleDemoSelect}
        staticSource
      />
      {isPinned && (
        <div
          className={cn(
            'fixed inset-x-0 z-40',
            isHandoffHidden && 'pointer-events-none opacity-0',
          )}
          style={{
            top: fixedTop,
            transform: isReleased
              ? `translate3d(0, -${releaseOffset}px, 0)`
              : undefined,
          }}
        >
          <div className="container mx-auto px-4 xl:px-14.25 2xl:px-15">
            <DemoCardsGrid sourceGrid onSelect={handleDemoSelect} />
          </div>
        </div>
      )}
    </div>
  );
}

function DemoCardsGrid({
  hidden = false,
  onSelect,
  sourceGrid = false,
  staticSource = false,
}: {
  hidden?: boolean;
  onSelect: (index: number) => void;
  sourceGrid?: boolean;
  staticSource?: boolean;
}) {
  return (
    <div
      data-demo-source-grid={sourceGrid ? '' : undefined}
      className={cn(
        'grid gap-3 md:grid-cols-2 xl:grid-cols-4',
        hidden && 'opacity-0',
      )}
    >
      {demoNavigationItems.map(({ title, description, Icon, id }, index) => (
        <a
          key={title}
          className="group block rounded-xl border border-transparent bg-transparent p-5 text-left transition hover:border-white/10 hover:bg-white/[0.04]"
          data-demo-static-card={staticSource ? index : undefined}
          data-demo-source-card={sourceGrid ? index : undefined}
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
