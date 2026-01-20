import { NextResponse } from 'next/server';
import { AppConfig } from '@/config/apps-loader';

const API_URL = 'https://template.usw.sealos.io/api/listTemplate';

/**
 * Convert API template to app config format
 */
async function convertTemplateToAppConfig(
  template: any,
): Promise<AppConfig | null> {
  const spec = template.spec || {};
  const metadata = template.metadata || {};

  // Skip draft templates
  if (spec.draft === true) {
    return null;
  }

  // Skip Chinese-only templates
  if (spec.locale === 'zh') {
    return null;
  }

  // Map categories
  const categoryMapping: Record<string, string> = {
    tool: 'Tools',
    database: 'Database',
    ai: 'AI',
    web: 'Web',
    development: 'Development',
    infrastructure: 'Infrastructure',
    monitoring: 'Monitoring',
    cms: 'CMS',
    'low-code': 'Low-Code',
    automation: 'Automation',
    storage: 'Storage',
    blog: 'Blog',
    'dev-ops': 'DevOps',
    monitor: 'Monitoring',
  };

  const templateCategory =
    spec.categories && spec.categories[0]
      ? spec.categories[0].toLowerCase()
      : 'tool';
  const category = categoryMapping[templateCategory] || 'Tools';

  // Generate gradient based on category
  const gradientMapping: Record<string, string> = {
    AI: 'from-purple-50/70 to-pink-50/70',
    Database: 'from-blue-50/70 to-indigo-50/70',
    Tools: 'from-green-50/70 to-emerald-50/70',
    Infrastructure: 'from-gray-50/70 to-slate-50/70',
    Monitoring: 'from-yellow-50/70 to-orange-50/70',
    CMS: 'from-rose-50/70 to-pink-50/70',
    Development: 'from-indigo-50/70 to-purple-50/70',
    'Low-Code': 'from-teal-50/70 to-cyan-50/70',
    Web: 'from-blue-50/70 to-cyan-50/70',
    Automation: 'from-red-50/70 to-rose-50/70',
    Storage: 'from-orange-50/70 to-amber-50/70',
    Blog: 'from-purple-50/70 to-indigo-50/70',
    DevOps: 'from-slate-50/70 to-gray-50/70',
  };

  // Use pre-downloaded icon path
  const slug = metadata.name || '';
  let iconPath = `/images/apps/${slug}.png`; // Default to .png extension

  // Check common extensions for the icon
  const possibleExtensions = [
    '.png',
    '.jpg',
    '.jpeg',
    '.svg',
    '.ico',
    '.webp',
    '.gif',
  ];
  for (const ext of possibleExtensions) {
    // In production, these icons should already be downloaded by generate-apps script
    const testPath = `/images/apps/${slug}${ext}`;
    // We'll use the path that matches the slug, but we can't check file existence in Edge runtime
    if (spec.icon && spec.icon.includes(ext)) {
      iconPath = testPath;
      break;
    }
  }

  // Fallback to default if no icon
  if (!spec.icon || !slug) {
    iconPath = '/icons/default.svg';
  }

  // Create i18n object if available
  const i18n: any = {};
  if (spec.i18n && spec.i18n.zh && spec.i18n.zh.description) {
    i18n.zh = {
      description: spec.i18n.zh.description,
    };
  }

  // Generate basic features based on category
  const categoryFeatures: Record<string, string[]> = {
    AI: [
      'AI Processing',
      'Machine Learning',
      'Natural Language',
      'Data Analysis',
    ],
    Database: [
      'Data Storage',
      'Query Processing',
      'Backup & Recovery',
      'High Availability',
    ],
    Tools: [
      'User-Friendly Interface',
      'Easy Configuration',
      'Multi-Platform Support',
      'Extensible',
    ],
    Infrastructure: [
      'High Performance',
      'Scalability',
      'Load Balancing',
      'Security',
    ],
    Monitoring: [
      'Real-time Monitoring',
      'Alerting System',
      'Dashboard Views',
      'Historical Data',
    ],
    CMS: [
      'Content Management',
      'Theme Support',
      'Plugin System',
      'SEO Optimization',
    ],
    Development: [
      'Code Editing',
      'Debugging Tools',
      'Version Control',
      'Collaboration',
    ],
    'Low-Code': [
      'Visual Interface',
      'Drag & Drop',
      'No Coding Required',
      'Integrations',
    ],
    Web: [
      'Web Server',
      'Static Content',
      'Dynamic Pages',
      'Performance Optimization',
    ],
    Automation: [
      'Workflow Automation',
      'Task Scheduling',
      'Event Triggers',
      'Process Management',
    ],
    Storage: [
      'File Storage',
      'Data Backup',
      'Access Control',
      'Synchronization',
    ],
    Blog: [
      'Content Creation',
      'Publishing Tools',
      'Comment System',
      'RSS Support',
    ],
    DevOps: [
      'CI/CD Pipeline',
      'Container Management',
      'Infrastructure as Code',
      'Monitoring',
    ],
  };

  const appConfig: AppConfig = {
    name: spec.title || metadata.name || '',
    slug: metadata.name || '',
    description: spec.description || '',
    icon: iconPath,
    category: category,
    features: categoryFeatures[category] || [
      'Feature 1',
      'Feature 2',
      'Feature 3',
      'Feature 4',
    ],
    benefits: [
      'Easy to deploy and manage',
      'Self-hosted solution',
      'Open source and free',
      'Community supported',
    ],
    useCases: [
      'Business Operations',
      'Development Workflow',
      'Data Management',
      'Team Collaboration',
    ],
    gradient: gradientMapping[category] || 'from-gray-50/70 to-slate-50/70',
    github: spec.gitRepo || undefined,
    website: spec.url || undefined,
    tags: spec.categories || [],
    source: {
      url: template.filePath
        ? `https://github.com/labring-actions/templates/tree/kb-0.9${template.filePath}`
        : undefined,
      deployCount: template.deployCount || 0,
    },
    // Add i18n object if available
    ...(Object.keys(i18n).length > 0 && { i18n }),
  };

  return appConfig;
}

/**
 * Fetch apps from the external API
 */
async function fetchAppsFromAPI(language: string = 'en'): Promise<AppConfig[]> {
  try {
    const headers: HeadersInit = {
      Accept: 'application/json',
    };

    const response = await fetch(`${API_URL}?language=${language}`, {
      headers,
      // Use default caching for static generation
      // cache: 'no-store', // Removed to allow static generation
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (data.code !== 200 || !data.data?.templates) {
      throw new Error(`API error: ${data.message || 'Unknown error'}`);
    }

    // Convert templates to app configs
    const apps: AppConfig[] = [];

    for (const template of data.data.templates) {
      const appConfig = await convertTemplateToAppConfig(template);
      if (appConfig) {
        apps.push(appConfig);
      }
    }

    // Sort apps by deploy count (descending) and then by name
    apps.sort((a, b) => {
      const deployCountA = a.source?.deployCount || 0;
      const deployCountB = b.source?.deployCount || 0;
      if (deployCountB !== deployCountA) {
        return deployCountB - deployCountA;
      }
      return a.name.localeCompare(b.name);
    });

    return apps;
  } catch (error) {
    console.error('Error fetching apps from API:', error);
    throw error;
  }
}

/**
 * Load fallback apps from static JSON file
 */
async function loadFallbackApps(): Promise<AppConfig[]> {
  try {
    const { appsConfig } = await import('@/config/apps');
    return appsConfig;
  } catch (error) {
    console.error('Error loading fallback apps:', error);
    return [];
  }
}

/**
 * Main handler for apps API requests
 */
export async function handleAppsRequest(language: string = 'en') {
  try {
    const apps = await fetchAppsFromAPI(language);

    return NextResponse.json({
      apps,
      language,
    });
  } catch (apiError) {
    console.error('Failed to fetch from API:', apiError);

    // Fall back to static JSON file
    console.log('No cache available, loading fallback apps');
    const fallbackApps = await loadFallbackApps();

    return NextResponse.json({
      apps: fallbackApps,
      language,
    });
  }
}
