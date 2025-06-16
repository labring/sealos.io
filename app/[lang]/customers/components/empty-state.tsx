'use client';

import { memo } from 'react';

interface EmptyStateProps {
  message: string;
}

/**
 * Empty state component displayed when no cases match the filter criteria
 */
export const EmptyState = memo<EmptyStateProps>(({ message }) => {
  return (
    <div 
      className="col-span-full rounded-xl bg-white/90 p-12 text-center shadow-md" 
      style={{ boxShadow: '0 4px 12px -2px rgba(0, 120, 212, 0.06), 0 0 4px rgba(0, 120, 212, 0.03)' }}
    >
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        className="mx-auto mb-4 h-12 w-12 text-gray-400" 
        fill="none" 
        viewBox="0 0 24 24" 
        stroke="currentColor"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={1.5} 
          d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
        />
      </svg>
      <p className="text-lg font-medium text-gray-600">{message}</p>
    </div>
  );
});

EmptyState.displayName = 'EmptyState';
