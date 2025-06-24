'use client';

import { useState, useEffect } from 'react';
import { ExternalLink, ChevronDown, ChevronUp } from 'lucide-react';
import { languagesType } from '@/lib/i18n';
import { AppIcon } from '@/components/ui/app-icon';
import { CustomButton } from '@/components/ui/button-custom';
import { loadAllApps, AppConfig } from '@/config/apps-loader';

interface AppGridProps {
  lang: languagesType;
  initialApps: AppConfig[];
  templateDomain: string;
}

export default function AppGrid({ lang, initialApps, templateDomain }: AppGridProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [apps, setApps] = useState<AppConfig[]>(initialApps);
  const [isLoading, setIsLoading] = useState(false);

  // Load apps dynamically on client side
  useEffect(() => {
    const loadApps = async () => {
      try {
        const dynamicApps = await loadAllApps();
        if (dynamicApps.length > 0) {
          setApps(dynamicApps);
        }
      } catch (error) {
        console.error('Failed to load apps dynamically:', error);
      }
    };

    // Only load if we're on the client side
    if (typeof window !== 'undefined') {
      loadApps();
    }
  }, []);

  // Calculate apps to show based on grid columns (5 rows)
  const appsPerRow = 10; // Based on xl:grid-cols-10
  const rowsToShow = 5;
  const appsToShow = isExpanded ? apps.length : appsPerRow * rowsToShow;
  const visibleApps = apps.slice(0, appsToShow);
  const hasMoreApps = apps.length > appsToShow;

  return (
    <>
      {/* Apps Icon Grid */}
      <div className="grid grid-cols-4 gap-6 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10">
        {isLoading ? (
          // Loading skeleton
          Array.from({ length: appsToShow }).map((_, index) => (
            <div
              key={index}
              className="flex h-20 w-20 items-center justify-center rounded-xl border border-gray-200 bg-gray-100 animate-pulse"
            />
          ))
        ) : (
          visibleApps.map((app, index) => (
            <a
              key={`${app.slug}-${index}`}
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
          ))
        )}
      </div>

      {/* Expand/Collapse Button */}
      {(hasMoreApps || isExpanded) && (
        <div className="mt-8 text-center">
          <CustomButton
            className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-gray-300 bg-white px-6 py-3 font-medium text-gray-700 transition-all duration-300 hover:border-gray-400 hover:bg-gray-50"
            title="Toggle Apps View"
            actionType="custom"
            newWindow={true}
            location="app-list"
            additionalData={{ isExpanded }}
            onClick={() => setIsExpanded(!isExpanded)}
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
          </CustomButton>
        </div>
      )}

      {/* Call to Action */}
      <div className="mt-12 text-center">
        <CustomButton
          className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition-all duration-300 hover:bg-blue-700 hover:shadow-lg"
          title="Browse App Store"
          newWindow={true}
          location="app-list"
          href={templateDomain}
        >
          <ExternalLink className="h-5 w-5" />
          Browse App Store
        </CustomButton>
      </div>
    </>
  );
}