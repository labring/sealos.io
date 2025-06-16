'use client';

import { useState, useMemo, useCallback } from 'react';
import { CaseItem, CaseTranslations } from '../config/case-translations';

/**
 * Custom hook for managing case filtering logic
 * Provides state management and filtering functionality for the case grid
 */
export function useCaseFilter(translations: CaseTranslations) {
  const [selectedIndustry, setSelectedIndustry] = useState(translations.industries[0]);
  const [selectedUseCase, setSelectedUseCase] = useState(translations.useCases[0]);

  // Memoized filtered cases to prevent unnecessary recalculations
  const filteredCases = useMemo(() => {
    return translations.cases.filter((caseItem: CaseItem) => {
      const industryMatch = selectedIndustry === translations.industries[0] || caseItem.industry === selectedIndustry;
      const useCaseMatch = selectedUseCase === translations.useCases[0] || (caseItem.useCase && caseItem.useCase === selectedUseCase);
      return industryMatch && useCaseMatch;
    });
  }, [translations.cases, translations.industries, translations.useCases, selectedIndustry, selectedUseCase]);

  // Memoized callbacks to prevent unnecessary re-renders
  const handleIndustryChange = useCallback((industry: string) => {
    setSelectedIndustry(industry);
  }, []);

  const handleUseCaseChange = useCallback((useCase: string) => {
    setSelectedUseCase(useCase);
  }, []);

  const clearFilters = useCallback(() => {
    setSelectedIndustry(translations.industries[0]);
    setSelectedUseCase(translations.useCases[0]);
  }, [translations.industries, translations.useCases]);

  return {
    selectedIndustry,
    selectedUseCase,
    filteredCases,
    handleIndustryChange,
    handleUseCaseChange,
    clearFilters
  };
}
