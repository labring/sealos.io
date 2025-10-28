import { appDomain } from './site';

export interface AppConfig {
  name: string;
  slug: string;
  description: string;
  icon: string;
  category: string;
  features: string[];
  benefits: string[];
  useCases: string[];
  gradient: string;
  github?: string;
  website?: string;
  tags: string[];
  deployUrl?: string;
  source?: {
    url?: string;
    sha?: string;
    deployCount?: number;
  };
  i18n?: {
    zh?: {
      description: string;
    };
  };
}

// Flag to determine if we should use dynamic loading
// Always use dynamic loading in client side for better updates
const USE_DYNAMIC_LOADING = typeof window !== 'undefined';

// Cache for loaded category data
const categoryCache = new Map<string, AppConfig[]>();
let allAppsCache: AppConfig[] | null = null;
let dynamicAppsCache: AppConfig[] | null = null;
let lastDynamicFetch = 0;
const DYNAMIC_CACHE_TTL = 5 * 60 * 1000; // 5 minutes

/**
 * Load apps for a specific category
 */
export async function loadAppsByCategory(
  category: string,
): Promise<AppConfig[]> {
  // Check cache first
  if (categoryCache.has(category)) {
    return categoryCache.get(category)!;
  }

  try {
    // Load all apps and filter by category
    const allApps = await loadAllApps();
    const categoryApps = allApps.filter((app) => app.category === category);

    // Cache the result
    categoryCache.set(category, categoryApps);
    return categoryApps;
  } catch (error) {
    console.error(`Failed to load apps for category ${category}:`, error);
    throw new Error(
      `category: "${category}" not available. Please run "npm run generate-apps" first.`,
    );
  }
}

/**
 * Fetch apps dynamically from API
 */
async function fetchDynamicApps(): Promise<AppConfig[]> {
  try {
    // Only fetch in browser environment
    if (typeof window === 'undefined') {
      return loadStaticApps();
    }

    const now = Date.now();

    // Check cache
    if (dynamicAppsCache && now - lastDynamicFetch < DYNAMIC_CACHE_TTL) {
      return dynamicAppsCache;
    }

    const response = await fetch('/api/apps');
    if (!response.ok) {
      throw new Error(`Failed to fetch apps: ${response.status}`);
    }

    const data = await response.json();
    const apps = (data.apps as AppConfig[]).map((app) => ({
      ...app,
      deployUrl: app.deployUrl || getDeployUrl(app.slug),
    }));

    // Update cache
    dynamicAppsCache = apps;
    lastDynamicFetch = now;
    allAppsCache = apps; // Also update the main cache

    return apps;
  } catch (error) {
    console.error('Failed to fetch dynamic apps:', error);
    // Fall back to static apps
    return loadStaticApps();
  }
}

/**
 * Load static apps from JSON file
 */
async function loadStaticApps(): Promise<AppConfig[]> {
  try {
    // Load from main apps.json file
    const appsModule = await import('./apps.json');
    const apps = (appsModule.default as AppConfig[]).map((app) => ({
      ...app,
      deployUrl: getDeployUrl(app.slug),
    }));

    return apps;
  } catch (error) {
    console.error('Failed to load apps from apps.json:', error);
    throw new Error(
      'Apps configuration not available. Please run "npm run generate-apps" first.',
    );
  }
}

/**
 * Load all apps (with caching)
 */
export async function loadAllApps(): Promise<AppConfig[]> {
  if (allAppsCache) {
    return allAppsCache;
  }

  let apps: AppConfig[];

  if (USE_DYNAMIC_LOADING) {
    apps = await fetchDynamicApps();
  } else {
    apps = await loadStaticApps();
  }

  allAppsCache = apps;
  return apps;
}

/**
 * Get all available categories
 */
export async function getAllCategories(): Promise<string[]> {
  const allApps = await loadAllApps();
  const categories = [...new Set(allApps.map((app) => app.category))];
  return ['All', ...categories];
}

/**
 * Search apps across all categories
 */
export async function searchApps(query: string): Promise<AppConfig[]> {
  const allApps = await loadAllApps();
  const lowercaseQuery = query.toLowerCase();

  return allApps.filter(
    (app) =>
      app.name.toLowerCase().includes(lowercaseQuery) ||
      app.description.toLowerCase().includes(lowercaseQuery) ||
      app.tags?.some((tag) => tag.toLowerCase().includes(lowercaseQuery)),
  );
}

/**
 * Get app by slug
 */
export async function getAppBySlug(
  slug: string,
): Promise<AppConfig | undefined> {
  const allApps = await loadAllApps();
  const lowerSlug = slug.toLowerCase();
  return allApps.find((app) => app.slug.toLowerCase() === lowerSlug);
}

/**
 * Get apps by category with 'All' support
 */
export async function getAppsByCategory(
  category: string,
): Promise<AppConfig[]> {
  if (category === 'All') {
    return loadAllApps();
  }
  return loadAppsByCategory(category);
}

/**
 * Generate deploy URL for an app
 */
export function getDeployUrl(slug: string): string {
  return appDomain + '?openapp=system-template%3FtemplateName%3D' + slug;
}

/**
 * Clear all caches (useful for development or when data is updated)
 */
export function clearCache(): void {
  categoryCache.clear();
  allAppsCache = null;
  dynamicAppsCache = null;
  lastDynamicFetch = 0;
}

/**
 * Force refresh dynamic apps (only works in browser)
 */
export async function refreshApps(): Promise<AppConfig[]> {
  clearCache();
  return loadAllApps();
}

/**
 * Get cache statistics
 */
export function getCacheStats() {
  return {
    categoriesCached: categoryCache.size,
    allAppsCached: allAppsCache !== null,
    dynamicAppsCached: dynamicAppsCache !== null,
    lastDynamicFetch: lastDynamicFetch,
    usingDynamicLoading: USE_DYNAMIC_LOADING,
  };
}
