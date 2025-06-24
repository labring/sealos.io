// Re-export everything from the new apps-loader for backward compatibility
export type { AppConfig } from './apps-loader';
export {
  loadAllApps,
  loadAppsByCategory,
  getAllCategories,
  searchApps,
  getAppBySlug,
  getAppsByCategory,
  getDeployUrl,
  clearCache,
  getCacheStats
} from './apps-loader';

// Legacy synchronous exports for backward compatibility
// Note: These will load from the main apps.json file
import appsData from './apps.json';
import { getDeployUrl, type AppConfig } from './apps-loader';

// Export the apps data as typed AppConfig array with deploy URLs
export const appsConfig: AppConfig[] = (appsData as any[]).map((app) => ({
  ...app,
  deployUrl: getDeployUrl(app.slug),
}));

// Legacy synchronous helper functions for backward compatibility
// Note: These use the main appsConfig loaded from apps.json
export function getAppBySlugSync(slug: string): AppConfig | undefined {
  const lowerSlug = slug.toLowerCase();
  return appsConfig.find((app) => app.slug.toLowerCase() === lowerSlug);
}

export function getAppsByCategorySync(category: string): AppConfig[] {
  return appsConfig.filter((app) => app.category === category);
}

export function getAllCategoriesSync(): string[] {
  const categories = [...new Set(appsConfig.map((app) => app.category))];
  return ['All', ...categories];
}

export function searchAppsSync(query: string): AppConfig[] {
  const lowercaseQuery = query.toLowerCase();
  return appsConfig.filter(
    (app) =>
      app.name.toLowerCase().includes(lowercaseQuery) ||
      app.description.toLowerCase().includes(lowercaseQuery) ||
      app.tags?.some((tag: string) => tag.toLowerCase().includes(lowercaseQuery)),
  );
}
