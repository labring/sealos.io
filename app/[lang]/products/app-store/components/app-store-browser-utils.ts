import type { AppConfig } from '@/config/apps';

export const ALL_CATEGORY = 'All';

export type SortOption = 'deploy-count' | 'name-asc' | 'name-desc';

export interface VisibleAppsInput {
  apps: AppConfig[];
  query: string;
  category: string;
  sort: SortOption;
  page: number;
  pageSize: number;
}

export interface VisibleAppsResult {
  apps: AppConfig[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
}

export function getMinimumCountLabel(count: number, minimum: number): string {
  return new Intl.NumberFormat('en-US').format(Math.max(count, minimum));
}

export function getDeployCount(app: AppConfig): number {
  return app.source?.deployCount ?? 0;
}

export function getCategoryCounts(apps: AppConfig[]): Record<string, number> {
  return apps.reduce<Record<string, number>>(
    (counts, app) => {
      counts[ALL_CATEGORY] += 1;
      counts[app.category] = (counts[app.category] ?? 0) + 1;
      return counts;
    },
    { [ALL_CATEGORY]: 0 },
  );
}

function matchesQuery(app: AppConfig, query: string) {
  if (!query) {
    return true;
  }

  const searchable = [
    app.name,
    app.description,
    app.category,
    ...(app.tags ?? []),
    ...(app.features ?? []),
  ]
    .join(' ')
    .toLowerCase();

  return searchable.includes(query);
}

function sortApps(apps: AppConfig[], sort: SortOption) {
  return [...apps].sort((a, b) => {
    if (sort === 'name-asc') {
      return a.name.localeCompare(b.name);
    }

    if (sort === 'name-desc') {
      return b.name.localeCompare(a.name);
    }

    const countDiff = getDeployCount(b) - getDeployCount(a);
    return countDiff || a.name.localeCompare(b.name);
  });
}

export function getVisibleApps({
  apps,
  query,
  category,
  sort,
  page,
  pageSize,
}: VisibleAppsInput): VisibleAppsResult {
  const normalizedQuery = query.trim().toLowerCase();
  const filteredApps = apps.filter((app) => {
    const categoryMatch = category === ALL_CATEGORY || app.category === category;
    return categoryMatch && matchesQuery(app, normalizedQuery);
  });
  const sortedApps = sortApps(filteredApps, sort);
  const totalPages = Math.max(1, Math.ceil(sortedApps.length / pageSize));
  const currentPage = Math.min(Math.max(1, page), totalPages);
  const startIndex = (currentPage - 1) * pageSize;

  return {
    apps: sortedApps.slice(startIndex, startIndex + pageSize),
    totalItems: sortedApps.length,
    totalPages,
    currentPage,
  };
}
