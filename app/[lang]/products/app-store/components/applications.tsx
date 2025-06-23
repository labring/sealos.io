'use client';

import { useState, useMemo, useCallback, memo } from 'react';
import { appsConfig, getAllCategories, AppConfig } from '@/config/apps';
import { templateDomain } from '@/config/site';
import { AppIcon } from '@/components/ui/app-icon';

const categories = getAllCategories();

const Applications = memo(() => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAll, setShowAll] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'compact'>('grid');

  // Memoize filtered applications to prevent unnecessary recalculations
  const filteredApplications = useMemo(() => {
    return appsConfig.filter((app: AppConfig) => {
      const matchesCategory =
        activeCategory === 'All' || app.category === activeCategory;
      const matchesSearch =
        app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.description.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchTerm]);

  // Memoize displayed applications to prevent unnecessary slicing
  const displayedApplications = useMemo(() => {
    return showAll ? filteredApplications : filteredApplications.slice(0, 12);
  }, [filteredApplications, showAll]);

  // Memoize event handlers to prevent unnecessary re-renders
  const handleCategoryChange = useCallback((category: string) => {
    setActiveCategory(category);
  }, []);

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  }, []);

  const handleViewModeChange = useCallback((mode: 'grid' | 'compact') => {
    setViewMode(mode);
  }, []);

  const handleShowAllToggle = useCallback(() => {
    setShowAll(prev => !prev);
  }, []);

  return (
    <section className="py-16">
      <div className="mb-12 text-center">
        <h2 className="mb-4 text-4xl font-bold text-gray-900">
          Popular Applications
        </h2>
        <p className="mx-auto max-w-3xl text-xl text-gray-600">
          Deploy production-ready applications in minutes. Each template
          includes all necessary dependencies and optimized configurations.
        </p>

        {/* Search Bar and View Toggle */}
        <div className="mx-auto mt-8 flex max-w-2xl items-center gap-4">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3">
              <svg
                className="h-5 w-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search applications..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-full rounded-lg border border-gray-300 bg-white py-3 pr-4 pl-10 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
            />
          </div>

          {/* View Mode Toggle */}
          <div className="flex rounded-lg border border-gray-300 bg-white">
            <button
              onClick={() => handleViewModeChange('grid')}
              className={`rounded-l-lg px-3 py-2 transition-colors ${
                viewMode === 'grid'
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                />
              </svg>
            </button>
            <button
              onClick={() => handleViewModeChange('compact')}
              className={`rounded-r-lg px-3 py-2 transition-colors ${
                viewMode === 'compact'
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 10h16M4 14h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="mb-8 flex flex-wrap justify-center gap-2">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => handleCategoryChange(category)}
            className={`rounded-full border px-4 py-2 text-sm font-medium transition-all duration-200 ${
              activeCategory === category
                ? 'border-blue-500 bg-blue-500 text-white shadow-lg'
                : 'border-blue-200 bg-white text-gray-700 hover:border-blue-300 hover:bg-blue-50'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Applications Display */}
      {viewMode === 'grid' ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {displayedApplications.map((app: AppConfig, index: number) => (
            <div
              key={index}
              className="group flex flex-col overflow-hidden rounded-xl border border-blue-50 bg-white shadow-lg transition-all duration-300 hover:border-blue-100 hover:shadow-xl"
            >
              <div
                className={`bg-gradient-to-r ${app.gradient} border-b border-blue-100/50 p-4`}
              >
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-blue-100/30 bg-white/80 shadow-sm">
                    <AppIcon
                      src={app.icon}
                      alt={`${app.name} icon`}
                      className="h-6 w-6"
                    />
                  </div>
                  <span className="rounded-full bg-white/60 px-2 py-1 text-xs font-medium text-gray-700">
                    {app.category}
                  </span>
                </div>
                <h3 className="mb-2 text-lg font-bold text-gray-900">
                  {app.name}
                </h3>
                <p className="line-clamp-2 text-sm leading-relaxed text-gray-600">
                  {app.description}
                </p>
              </div>

              <div className="flex flex-1 flex-col p-4">
                <div className="mb-4 flex-1">
                  <div className="flex flex-wrap gap-1">
                    {app.features
                      .slice(0, 3)
                      .map((feature: string, featureIndex: number) => (
                        <span
                          key={featureIndex}
                          className="inline-flex items-center rounded-md bg-gray-100 px-2 py-1 text-xs text-gray-600"
                        >
                          {feature}
                        </span>
                      ))}
                    {app.features.length > 3 && (
                      <span className="inline-flex items-center rounded-md bg-gray-100 px-2 py-1 text-xs text-gray-500">
                        +{app.features.length - 3}
                      </span>
                    )}
                  </div>
                </div>

                <a
                  href={app.deployUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full rounded-lg bg-blue-600 px-4 py-2 text-center text-sm font-medium text-white transition-all duration-300 hover:bg-blue-700 hover:shadow-lg"
                >
                  Deploy {app.name}
                </a>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {displayedApplications.map((app: AppConfig, index: number) => (
            <div
              key={index}
              className="group flex items-center justify-between rounded-lg border border-blue-50 bg-white p-4 shadow-sm transition-all duration-300 hover:border-blue-100 hover:shadow-md"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-blue-100/30 bg-gradient-to-r from-blue-50/50 to-indigo-50/50 shadow-sm">
                  <AppIcon
                    src={app.icon}
                    alt={`${app.name} icon`}
                    className="h-8 w-8"
                  />
                </div>
                <div className="flex-1">
                  <div className="mb-1 flex items-center gap-2">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {app.name}
                    </h3>
                    <span className="rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-700">
                      {app.category}
                    </span>
                  </div>
                  <p className="line-clamp-1 text-sm text-gray-600">
                    {app.description}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {app.features
                      .slice(0, 4)
                      .map((feature: string, featureIndex: number) => (
                        <span
                          key={featureIndex}
                          className="inline-flex items-center text-xs text-gray-500"
                        >
                          {feature}
                          {featureIndex <
                            Math.min(app.features.length - 1, 3) && ' • '}
                        </span>
                      ))}
                  </div>
                </div>
              </div>
              <a
                href={app.deployUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-all duration-300 hover:bg-blue-700 hover:shadow-lg"
              >
                Deploy
                <svg
                  className="ml-1 h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
              </a>
            </div>
          ))}
        </div>
      )}

      {/* Show More/Less Button */}
      {filteredApplications.length > 12 && (
        <div className="mt-8 text-center">
          <button
            onClick={handleShowAllToggle}
            className="inline-flex items-center rounded-lg border border-blue-200 bg-white px-6 py-3 font-medium text-blue-600 transition-all duration-300 hover:border-blue-300 hover:bg-blue-50"
          >
            {showAll ? (
              <>
                Show Less
                <svg
                  className="ml-2 h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 15l7-7 7 7"
                  />
                </svg>
              </>
            ) : (
              <>
                Show All {filteredApplications.length} Apps
                <svg
                  className="ml-2 h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </>
            )}
          </button>
        </div>
      )}

      <div className="mt-12 text-center">
        <div className="rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 p-6">
          <h3 className="mb-3 text-xl font-bold text-gray-900">
            Browse All Applications
          </h3>
          <p className="mx-auto mb-4 max-w-2xl text-gray-600">
            Explore our complete catalog of applications including databases,
            development tools, monitoring solutions, and more.
          </p>
          <a
            href={templateDomain}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition-all duration-300 hover:bg-blue-700 hover:shadow-lg"
          >
            View All Apps
            <svg
              className="ml-2 h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
});

Applications.displayName = 'Applications';

export default Applications;
