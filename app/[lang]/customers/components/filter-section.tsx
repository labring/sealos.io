'use client';

import { memo, useCallback } from 'react';
import { FilterButton } from './filter-button';
import { CaseTranslations } from '../config/case-translations';

interface FilterSectionProps {
  translations: CaseTranslations;
  selectedIndustry: string;
  selectedUseCase: string;
  onIndustryChange: (industry: string) => void;
  onUseCaseChange: (useCase: string) => void;
  onClearFilters: () => void;
}

/**
 * Filter section component for case grid filtering
 * Handles industry and use case filtering with clear filters functionality
 */
export const FilterSection = memo<FilterSectionProps>(({
  translations,
  selectedIndustry,
  selectedUseCase,
  onIndustryChange,
  onUseCaseChange,
  onClearFilters
}) => {
  const hasActiveFilters = selectedIndustry !== translations.industries[0] || selectedUseCase !== translations.useCases[0];

  const handleIndustryClick = useCallback((industry: string) => {
    onIndustryChange(industry);
  }, [onIndustryChange]);

  const handleUseCaseClick = useCallback((useCase: string) => {
    onUseCaseChange(useCase);
  }, [onUseCaseChange]);

  return (
    <div
      className="mb-12 rounded-xl bg-white p-4 shadow-lg sm:p-6 md:p-8"
      style={{
        boxShadow: '0 10px 30px -5px rgba(0, 120, 212, 0.08), 0 0 5px rgba(0, 120, 212, 0.03)',
        background: 'linear-gradient(135deg, #FFFFFF, #F8FBFF)'
      }}
    >
      <div className="flex flex-col space-y-6 md:space-y-8">
        {/* Mobile filter title */}
        <h3 className="text-center text-lg font-bold text-gray-800 md:hidden">
          {translations.filterTitle}
        </h3>

        {/* Industry Filter */}
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
          <span className="text-sm font-semibold text-gray-800 sm:mr-2">
            {translations.filterByIndustry}:
          </span>
          <div className="flex flex-wrap gap-2 overflow-x-auto pb-2 sm:pb-0">
            {translations.industries.map((industry, index) => (
              <FilterButton
                key={index}
                label={industry}
                isSelected={selectedIndustry === industry}
                onClick={() => handleIndustryClick(industry)}
              />
            ))}
          </div>
        </div>

        {/* Use Case Filter */}
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
          <span className="text-sm font-semibold text-gray-800 sm:mr-2">
            {translations.filterByUseCase}:
          </span>
          <div className="flex flex-wrap gap-2 overflow-x-auto pb-2 sm:pb-0">
            {translations.useCases.map((useCase, index) => (
              <FilterButton
                key={index}
                label={useCase}
                isSelected={selectedUseCase === useCase}
                onClick={() => handleUseCaseClick(useCase)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Clear Filters Button */}
      {hasActiveFilters && (
        <div className="mt-6 flex justify-end">
          <button
            className="group flex items-center rounded-md border border-red-200 bg-white px-4 py-2 text-sm font-medium text-red-600 shadow-sm transition-all duration-300 hover:border-red-300 hover:bg-gradient-to-r hover:from-red-50 hover:to-red-100 hover:shadow-md"
            onClick={onClearFilters}
            style={{ boxShadow: '0 2px 4px -1px rgba(220, 38, 38, 0.1), 0 1px 2px -1px rgba(220, 38, 38, 0.05)' }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="mr-1.5 h-4 w-4 transition-transform duration-300 group-hover:rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            <span className="relative">
              <span className="absolute bottom-0 left-0 h-[2px] w-0 bg-red-600 transition-all duration-300 group-hover:w-full"></span>
              {translations.clearFilters}
            </span>
          </button>
        </div>
      )}
    </div>
  );
});

FilterSection.displayName = 'FilterSection';
