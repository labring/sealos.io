import appsData from './apps.json';
import { templateDomain } from './site';

export interface AppConfig {
  name: string;
  slug: string;
  description: string;
  // longDescription?: string;
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
  i18n?: {
    zh?: {
      description: string;
    };
  };
}

// Export the apps data as typed AppConfig array with deploy URLs
export const appsConfig: AppConfig[] = (appsData as AppConfig[]).map((app) => ({
  ...app,
  deployUrl: getDeployUrl(app.slug),
}));

// Helper functions
export function getAppBySlug(slug: string): AppConfig | undefined {
  const lowerSlug = slug.toLowerCase();
  return appsConfig.find((app) => app.slug.toLowerCase() === lowerSlug);
}

export function getAppsByCategory(category: string): AppConfig[] {
  return appsConfig.filter((app) => app.category === category);
}

export function getAllCategories(): string[] {
  const categories = [...new Set(appsConfig.map((app) => app.category))];
  return ['All', ...categories];
}

export function searchApps(query: string): AppConfig[] {
  const lowercaseQuery = query.toLowerCase();
  return appsConfig.filter(
    (app) =>
      app.name.toLowerCase().includes(lowercaseQuery) ||
      app.description.toLowerCase().includes(lowercaseQuery) ||
      app.tags?.some((tag) => tag.toLowerCase().includes(lowercaseQuery)),
  );
}

export function getDeployUrl(slug: string): string {
  return templateDomain + '/deploy?templateName=' + slug;
}
