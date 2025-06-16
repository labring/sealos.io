'use client';

import { memo } from 'react';
import Link from 'next/link';
import { CaseItem } from '../config/case-translations';

interface CaseCardProps {
  caseItem: CaseItem;
  readNowText: string;
  caseDescription: string;
  lang: string;
}

/**
 * Individual case card component with consistent styling and hover effects
 */
export const CaseCard = memo<CaseCardProps>(({ caseItem, readNowText, caseDescription, lang }) => {
  // Extract company name for description
  const companyName = lang === 'en' 
    ? caseItem.title.split(' ').slice(1).join(' ')
    : caseItem.title;

  const description = caseDescription.replace('{company}', companyName);

  return (
    <div
      className="group relative flex h-full flex-col overflow-hidden rounded-xl bg-white p-0 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
      style={{
        boxShadow: '0 10px 30px -5px rgba(0, 0, 0, 0.1), 0 0 5px rgba(0, 0, 0, 0.05)',
        background: 'linear-gradient(to bottom, white, #FAFCFF)'
      }}
    >
      {/* Decorative element */}
      <div className="absolute -right-10 -top-10 h-20 w-20 rounded-full bg-primary/5"></div>

      {/* Content area */}
      <div className="flex flex-1 flex-col p-4 sm:p-6 md:p-8">
        {/* Header with logo and industry tag */}
        <div className="mb-6 flex flex-col space-y-3 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
          <div className="h-10">
            <img
              src={caseItem.logo}
              alt={caseItem.title}
              className="h-full object-contain"
              loading="lazy"
            />
          </div>
          <div className="inline-block whitespace-nowrap rounded-md border border-primary/20 bg-gradient-to-r from-primary/5 to-primary/10 px-3 py-1.5 text-xs font-medium tracking-wide text-primary shadow-sm transition-all duration-300 hover:border-primary/30 hover:shadow">
            {caseItem.industry}
          </div>
        </div>

        {/* Title */}
        <h3 className="mb-5 text-xl font-bold leading-tight text-gray-800 transition-colors duration-300 group-hover:text-primary">
          {caseItem.title}
        </h3>

        {/* Description */}
        <p className="mb-6 flex-grow text-sm text-gray-600 line-clamp-3">
          {description}
        </p>
      </div>

      {/* Bottom action area */}
      <div className="mt-auto border-t border-gray-100 bg-gradient-to-r from-white to-blue-50 p-6">
        <Link
          href={`/case/${caseItem.slug}`}
          className="group/button flex w-full items-center justify-center rounded-lg border border-primary/30 bg-white px-5 py-2.5 font-medium text-primary shadow-md transition-all duration-300 hover:border-primary hover:bg-primary/5 hover:shadow-lg hover:translate-y-[-1px]"
          style={{ boxShadow: '0 4px 6px -1px rgba(0, 120, 212, 0.1), 0 2px 4px -1px rgba(0, 120, 212, 0.06)' }}
        >
          <span className="mr-2">{readNowText}</span>
          <span className="relative flex h-6 w-6 items-center justify-center overflow-hidden rounded-full bg-primary/10 transition-all duration-300 group-hover/button:bg-primary/20">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 transition-transform duration-300 group-hover/button:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </span>
        </Link>
      </div>
    </div>
  );
});

CaseCard.displayName = 'CaseCard';
