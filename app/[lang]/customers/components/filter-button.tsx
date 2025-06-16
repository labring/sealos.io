'use client';

import { memo } from 'react';

interface FilterButtonProps {
  label: string;
  isSelected: boolean;
  onClick: () => void;
}

/**
 * Reusable filter button component with consistent styling and animations
 */
export const FilterButton = memo<FilterButtonProps>(({ label, isSelected, onClick }) => {
  return (
    <button
      className={`group relative rounded-md px-3 py-1.5 text-xs sm:px-4 sm:py-2 sm:text-sm font-medium transition-all duration-300 ${
        isSelected
          ? 'border border-primary/50 bg-gradient-to-r from-primary/90 to-primary text-white shadow-md'
          : 'border border-gray-200 bg-white text-gray-700 hover:border-primary/30 hover:bg-gradient-to-r hover:from-primary/5 hover:to-primary/10 hover:text-primary hover:shadow-sm'
      }`}
      onClick={onClick}
      style={isSelected ? { boxShadow: '0 4px 6px -1px rgba(0, 120, 212, 0.2), 0 2px 4px -1px rgba(0, 120, 212, 0.1)' } : {}}
    >
      {/* Hover effect background element */}
      <span className={`absolute inset-0 rounded-md bg-primary/10 opacity-0 transition-opacity duration-300 ${!isSelected ? 'group-hover:opacity-30' : ''}`}></span>

      {/* Selection indicator */}
      {isSelected && (
        <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-white shadow-md">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </span>
      )}

      <span className="relative">{label}</span>
    </button>
  );
});

FilterButton.displayName = 'FilterButton';
