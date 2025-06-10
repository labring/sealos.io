'use client';

import { useState } from 'react';
import { templateDomain } from '@/config/site';
import { ExternalLink, ChevronDown, ChevronUp } from 'lucide-react';
import { languagesType } from '@/lib/i18n';
import { appsConfig } from '@/config/apps';
import { AppIcon } from '@/components/ui/app-icon';

interface HighlightedAppsProps {
  lang: languagesType;
}

export default function HighlightedApps({ lang }: HighlightedAppsProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Calculate apps to show based on grid columns (5 rows)
  // Using the largest breakpoint (xl:grid-cols-10) for calculation
  const appsPerRow = 10; // Based on xl:grid-cols-10
  const rowsToShow = 5;
  const appsToShow = isExpanded ? appsConfig.length : appsPerRow * rowsToShow;
  const visibleApps = appsConfig.slice(0, appsToShow);
  const hasMoreApps = appsConfig.length > appsToShow;
  return (
    <section className="py-16">
      {/* Section Title */}
      <div className="mb-12 text-center">
        <h2 className="mb-4 text-4xl font-bold text-gray-900">
          Featured Applications
        </h2>
        <p className="mx-auto max-w-3xl text-xl text-gray-600">
          Deploy production-ready applications with one click. From databases to
          development tools.
        </p>
      </div>

      {/* Apps Icon Grid */}
      <div className="grid grid-cols-4 gap-6 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10">
        {visibleApps.map((app, index) => (
          <a
            key={index}
            href={`/${lang}/products/app-store/${app.slug}`}
            title={app.name}
            className="group flex h-20 w-20 items-center justify-center rounded-xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:scale-105 hover:border-blue-300 hover:shadow-lg"
          >
            <AppIcon
              src={app.icon}
              alt={`${app.name} icon`}
              className="h-10 w-10 transition-transform duration-300 group-hover:scale-110"
            />
          </a>
        ))}
      </div>

      {/* Expand/Collapse Button */}
      {(hasMoreApps || isExpanded) && (
        <div className="mt-8 text-center">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-6 py-3 font-medium text-gray-700 transition-all duration-300 hover:border-gray-400 hover:bg-gray-50"
          >
            {isExpanded ? (
              <>
                <ChevronUp className="h-5 w-5" />
                Show Less
              </>
            ) : (
              <>
                <ChevronDown className="h-5 w-5" />
                Show More Apps
              </>
            )}
          </button>
        </div>
      )}

      {/* Call to Action */}
      <div className="mt-12 text-center">
        <a
          href={templateDomain}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition-all duration-300 hover:bg-blue-700 hover:shadow-lg"
        >
          <ExternalLink className="h-5 w-5" />
          Browse App Store
        </a>
      </div>
    </section>
  );
}
