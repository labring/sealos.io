'use client';

import { templateDomain } from '@/config/site';
import { ExternalLink } from 'lucide-react';
import { languagesType } from '@/lib/i18n';
import { appsConfig } from '@/config/apps';

interface HighlightedAppsProps {
  lang: languagesType;
}

export default function HighlightedApps({ lang }: HighlightedAppsProps) {
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
        {appsConfig.map((app, index) => (
          <a
            key={index}
            href={`/${lang}/products/app-store/${app.slug}`}
            className="group flex h-20 w-20 items-center justify-center rounded-xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:scale-105 hover:border-blue-300 hover:shadow-lg"
          >
            <img
              src={app.icon}
              alt={`${app.name} icon`}
              className="h-10 w-10 transition-transform duration-300 group-hover:scale-110"
            />
          </a>
        ))}
      </div>

      {/* Call to Action */}
      <div className="mt-12 text-center">
        <a
          href={templateDomain}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition-all duration-300 hover:bg-blue-700 hover:shadow-lg"
        >
          <ExternalLink className="h-5 w-5" />
          Browse All Apps
        </a>
      </div>
    </section>
  );
}
