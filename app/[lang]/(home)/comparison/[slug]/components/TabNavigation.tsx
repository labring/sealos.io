'use client';

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
  return (
    <div className="scrollbar-hide overflow-x-scroll px-4">
      <div className="bg-primary-foreground container mx-auto flex min-w-fit flex-nowrap items-stretch gap-2 overflow-x-auto overflow-y-hidden rounded-full border p-1">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={cn(
              'relative w-full flex-1 items-center justify-center rounded-full px-6 py-3 text-sm font-medium transition-colors',
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
  );
}
