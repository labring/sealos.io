'use client';

import { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { DIMENSIONS, DimensionId } from '../../config/platforms';

// Generate tabs from DIMENSIONS config
const TABS = Object.values(DIMENSIONS).map((dim) => ({
  id: dim.id as DimensionId,
  label: dim.title,
})) as Array<{ id: DimensionId; label: string }>;

export type TabId = DimensionId;

interface TabNavigationProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
}

export function TabNavigation({ activeTab, onTabChange }: TabNavigationProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<Map<TabId, HTMLButtonElement>>(new Map());

  // Scroll to active tab when it changes
  useEffect(() => {
    const activeTabElement = tabRefs.current.get(activeTab);
    const scrollContainer = scrollContainerRef.current;

    if (activeTabElement && scrollContainer) {
      const containerRect = scrollContainer.getBoundingClientRect();
      const tabRect = activeTabElement.getBoundingClientRect();

      const tabLeft =
        tabRect.left - containerRect.left + scrollContainer.scrollLeft;
      const tabRight = tabLeft + tabRect.width;
      const containerWidth = scrollContainer.clientWidth;
      const scrollLeft = scrollContainer.scrollLeft;

      const supportsSmoothScroll =
        'scrollBehavior' in document.documentElement.style;

      if (tabLeft < scrollLeft) {
        // Scroll left
        if (supportsSmoothScroll) {
          scrollContainer.scrollTo({
            left: tabLeft - 32,
            behavior: 'smooth',
          });
        } else {
          scrollContainer.scrollLeft = tabLeft - 32;
        }
      } else if (tabRight > scrollLeft + containerWidth) {
        // Scroll right
        if (supportsSmoothScroll) {
          scrollContainer.scrollTo({
            left: tabRight - containerWidth + 32,
            behavior: 'smooth',
          });
        } else {
          scrollContainer.scrollLeft = tabRight - containerWidth + 32;
        }
      }
    }
  }, [activeTab]);

  return (
    <div
      className={cn(
        'container-compact relative',
        'before:from-background before:pointer-events-none before:absolute before:z-10 before:h-full before:w-8 before:bg-linear-to-r before:to-transparent',
        'after:from-background after:pointer-events-none after:absolute after:top-0 after:right-4 after:z-10 after:h-full after:w-8 after:bg-linear-to-l after:to-transparent',
      )}
    >
      <div
        ref={scrollContainerRef}
        className="scrollbar-hide overflow-x-scroll"
      >
        <div className="bg-primary-foreground mx-8 flex min-w-fit flex-nowrap items-stretch gap-2 overflow-x-auto overflow-y-hidden rounded-full border p-1">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              ref={(el) => {
                if (el) {
                  tabRefs.current.set(tab.id, el);
                } else {
                  tabRefs.current.delete(tab.id);
                }
              }}
              onClick={() => onTabChange(tab.id)}
              className={cn(
                'relative w-full flex-1 cursor-pointer items-center justify-center rounded-full px-6 py-3 text-sm font-medium transition-colors',
                'text-center leading-snug whitespace-nowrap',
                activeTab === tab.id
                  ? 'text-primary-foreground bg-primary'
                  : 'text-muted-foreground hover:text-primary-white',
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
