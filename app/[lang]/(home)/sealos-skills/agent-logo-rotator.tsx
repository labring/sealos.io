'use client';

import { useEffect, useState } from 'react';
import type { AgentIconKey } from './content';
import { AgentLogo } from './shared';

const ROTATION_DELAY = 2400;
const TRANSITION_DURATION = 320;

export function AgentLogoRotator({
  icons,
}: {
  icons: readonly AgentIconKey[];
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [transitionEnabled, setTransitionEnabled] = useState(true);
  const [isRotatorHovered, setIsRotatorHovered] = useState(false);
  const [isNavHovered, setIsNavHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updateMotionPreference = () => setReducedMotion(mediaQuery.matches);
    updateMotionPreference();
    mediaQuery.addEventListener('change', updateMotionPreference);

    return () =>
      mediaQuery.removeEventListener('change', updateMotionPreference);
  }, []);

  useEffect(() => {
    const updateVisibility = () =>
      setIsHidden(document.visibilityState !== 'visible');
    const updateFocus = (event: FocusEvent) => {
      setIsFocused(
        Boolean((event.target as HTMLElement).closest('[data-agent-logo-nav]')),
      );
    };
    const clearFocus = (event: FocusEvent) => {
      setIsFocused(
        Boolean(
          (event.relatedTarget as HTMLElement | null)?.closest(
            '[data-agent-logo-nav]',
          ),
        ),
      );
    };
    const updateNavHover = (event: MouseEvent) => {
      setIsNavHovered(
        Boolean((event.target as HTMLElement).closest('[data-agent-logo-nav]')),
      );
    };
    const clearNavHover = (event: MouseEvent) => {
      setIsNavHovered(
        Boolean(
          (event.relatedTarget as HTMLElement | null)?.closest(
            '[data-agent-logo-nav]',
          ),
        ),
      );
    };

    updateVisibility();
    document.addEventListener('visibilitychange', updateVisibility);
    document.addEventListener('focusin', updateFocus);
    document.addEventListener('focusout', clearFocus);
    document.addEventListener('mouseover', updateNavHover);
    document.addEventListener('mouseout', clearNavHover);

    return () => {
      document.removeEventListener('visibilitychange', updateVisibility);
      document.removeEventListener('focusin', updateFocus);
      document.removeEventListener('focusout', clearFocus);
      document.removeEventListener('mouseover', updateNavHover);
      document.removeEventListener('mouseout', clearNavHover);
    };
  }, []);

  useEffect(() => {
    if (reducedMotion) {
      setActiveIndex(0);
      return;
    }

    if (
      isRotatorHovered ||
      isNavHovered ||
      isFocused ||
      isHidden ||
      icons.length < 2
    ) {
      return;
    }

    const rotationTimer = window.setTimeout(() => {
      setActiveIndex((current) => current + 1);
    }, ROTATION_DELAY);

    return () => window.clearTimeout(rotationTimer);
  }, [
    activeIndex,
    icons.length,
    isFocused,
    isHidden,
    isNavHovered,
    isRotatorHovered,
    reducedMotion,
  ]);

  useEffect(() => {
    if (activeIndex !== icons.length) return;

    let animationFrame = 0;
    const resetTimer = window.setTimeout(() => {
      setTransitionEnabled(false);
      setActiveIndex(0);
      animationFrame = window.requestAnimationFrame(() =>
        setTransitionEnabled(true),
      );
    }, TRANSITION_DURATION);

    return () => {
      window.clearTimeout(resetTimer);
      window.cancelAnimationFrame(animationFrame);
    };
  }, [activeIndex, icons.length]);

  const rotatingIcons = icons.length > 0 ? [...icons, icons[0]] : [];

  return (
    <span
      aria-hidden="true"
      className="relative inline-block size-12 overflow-hidden align-middle lg:size-14"
      data-agent-logo-rotator
      onMouseEnter={() => setIsRotatorHovered(true)}
      onMouseLeave={() => setIsRotatorHovered(false)}
    >
      <span
        className={
          transitionEnabled
            ? 'absolute inset-x-0 top-0 transition-transform duration-[320ms] ease-out motion-reduce:transition-none'
            : 'absolute inset-x-0 top-0 transition-none'
        }
        style={{
          transform: `translateY(-${(activeIndex * 100) / rotatingIcons.length}%)`,
        }}
      >
        {rotatingIcons.map((icon, index) => (
          <span
            key={`${icon}-${index}`}
            className="flex size-12 shrink-0 items-center justify-center lg:size-14"
          >
            <AgentLogo icon={icon} className="size-10 lg:size-12" />
          </span>
        ))}
      </span>
    </span>
  );
}
