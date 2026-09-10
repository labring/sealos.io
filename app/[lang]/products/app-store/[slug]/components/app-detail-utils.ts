import type { AppConfig } from '@/config/apps';

export type AppDetailConfig = AppConfig & {
  longDescription?: string;
  screenshots?: string[];
};

export function getDisplayDescription(app: AppDetailConfig) {
  return app.longDescription || app.description;
}

export function getTagLabel(app: Pick<AppDetailConfig, 'category' | 'tags'>) {
  return app.tags?.[0]?.replace(/-/g, ' ') || app.category;
}

export function getDeployCount(app: Pick<AppDetailConfig, 'source'>) {
  return app.source?.deployCount ?? 0;
}

export function formatAppCount(value: number) {
  return new Intl.NumberFormat('en-US', {
    notation: value >= 1000 ? 'compact' : 'standard',
    maximumFractionDigits: 1,
  }).format(value);
}

export function getRelatedApps({
  apps,
  currentApp,
  limit = 3,
}: {
  apps: AppDetailConfig[];
  currentApp: AppDetailConfig;
  limit?: number;
}) {
  const candidates = apps.filter((app) => app.slug !== currentApp.slug);
  const sameCategory = candidates.filter(
    (app) => app.category === currentApp.category,
  );
  const fallback = candidates.filter(
    (app) => app.category !== currentApp.category,
  );
  const sharesTag = (app: AppDetailConfig) =>
    app.tags?.some((tag) => currentApp.tags?.includes(tag)) ?? false;
  const related = [...sameCategory, ...fallback].sort(
    (a, b) => Number(sharesTag(b)) - Number(sharesTag(a)),
  );

  return related.slice(0, limit);
}
