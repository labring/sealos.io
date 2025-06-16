'use client';

import { memo } from 'react';
import { languagesType } from '@/lib/i18n';
import { caseTranslations } from '../config/case-translations';
import { FilterSection } from './filter-section';
import { CaseCard } from './case-card';
import { EmptyState } from './empty-state';
import { useCaseFilter } from '../hooks/use-case-filter';

interface CaseGridProps {
  lang: languagesType;
}

/**
 * Main case grid component that displays filtered customer success stories
 * Optimized with React.memo and separated concerns for better maintainability
 */
const CaseGrid = memo<CaseGridProps>(({ lang }) => {
  const translations = caseTranslations[lang];
  const {
    selectedIndustry,
    selectedUseCase,
    filteredCases,
    handleIndustryChange,
    handleUseCaseChange,
    clearFilters
  } = useCaseFilter(translations);

  return (
    <section className="py-24">
      <h2 className="mb-12 text-center text-3xl font-bold tracking-tight text-black md:text-4xl">
        {translations.title}
      </h2>

      <FilterSection
        translations={translations}
        selectedIndustry={selectedIndustry}
        selectedUseCase={selectedUseCase}
        onIndustryChange={handleIndustryChange}
        onUseCaseChange={handleUseCaseChange}
        onClearFilters={clearFilters}
      />

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {filteredCases.length > 0 ? (
          filteredCases.map((caseItem, index) => (
            <CaseCard
              key={index}
              caseItem={caseItem}
              readNowText={translations.readNow}
              caseDescription={translations.caseDescription}
              lang={lang}
            />
          ))
        ) : (
          <EmptyState message={translations.noResults} />
        )}
      </div>
    </section>
  );
});

CaseGrid.displayName = 'CaseGrid';

export default CaseGrid;
