import { NextResponse } from 'next/server';
import { AppConfig } from '@/config/apps-loader';
import { downloadImage, cleanupUnusedImages } from '@/lib/image-downloader';

// Cache configuration
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes cache TTL
const API_URL = 'https://template.usw.sealos.io/api/listTemplate';

// In-memory cache
let cache: {
  data: AppConfig[] | null;
  lastFetch: number;
  etag?: string;
} = {
  data: null,
  lastFetch: 0,
};

/**
 * Convert API template to app config format
 */
async function convertTemplateToAppConfig(template: any): Promise<AppConfig | null> {
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
  
  const templateCategory = spec.categories && spec.categories[0] 
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
  
  // Download icon and get local path
  const slug = metadata.name || '';
  let iconPath = '/icons/default.svg';
  
  if (spec.icon && spec.icon.startsWith('http')) {
    // Download the icon to local storage
    iconPath = await downloadImage(spec.icon, slug);
  } else if (spec.icon) {
    iconPath = spec.icon;
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
    AI: ['AI Processing', 'Machine Learning', 'Natural Language', 'Data Analysis'],
    Database: ['Data Storage', 'Query Processing', 'Backup & Recovery', 'High Availability'],
    Tools: ['User-Friendly Interface', 'Easy Configuration', 'Multi-Platform Support', 'Extensible'],
    Infrastructure: ['High Performance', 'Scalability', 'Load Balancing', 'Security'],
    Monitoring: ['Real-time Monitoring', 'Alerting System', 'Dashboard Views', 'Historical Data'],
    CMS: ['Content Management', 'Theme Support', 'Plugin System', 'SEO Optimization'],
    Development: ['Code Editing', 'Debugging Tools', 'Version Control', 'Collaboration'],
    'Low-Code': ['Visual Interface', 'Drag & Drop', 'No Coding Required', 'Integrations'],
    Web: ['Web Server', 'Static Content', 'Dynamic Pages', 'Performance Optimization'],
    Automation: ['Workflow Automation', 'Task Scheduling', 'Event Triggers', 'Process Management'],
    Storage: ['File Storage', 'Data Backup', 'Access Control', 'Synchronization'],
    Blog: ['Content Creation', 'Publishing Tools', 'Comment System', 'RSS Support'],
    DevOps: ['CI/CD Pipeline', 'Container Management', 'Infrastructure as Code', 'Monitoring'],
  };
  
  const appConfig: AppConfig = {
    name: spec.title || metadata.name || '',
    slug: metadata.name || '',
    description: spec.description || '',
    icon: iconPath,
    category: category,
    features: categoryFeatures[category] || ['Feature 1', 'Feature 2', 'Feature 3', 'Feature 4'],
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
      url: template.filePath ? `https://github.com/labring-actions/templates/tree/main${template.filePath}` : undefined,
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
      'Accept': 'application/json',
    };
    
    // Add If-None-Match header if we have an etag
    if (cache.etag) {
      headers['If-None-Match'] = cache.etag;
    }
    
    const response = await fetch(`${API_URL}?language=${language}`, {
      headers,
      // Add cache control to prevent browser caching
      cache: 'no-store',
    });
    
    // If 304 Not Modified, return cached data
    if (response.status === 304 && cache.data) {
      console.log('API returned 304 Not Modified, using cached data');
      cache.lastFetch = Date.now();
      return cache.data;
    }
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.code !== 200 || !data.data?.templates) {
      throw new Error(`API error: ${data.message || 'Unknown error'}`);
    }
    
    // Store etag for future requests
    const newEtag = response.headers.get('etag');
    if (newEtag) {
      cache.etag = newEtag;
    }
    
    // Convert templates to app configs
    const apps: AppConfig[] = [];
    const activeImages = new Set<string>();
    
    for (const template of data.data.templates) {
      const appConfig = await convertTemplateToAppConfig(template);
      if (appConfig) {
        apps.push(appConfig);
        // Track active images
        if (appConfig.icon && appConfig.icon.startsWith('/images/apps/')) {
          activeImages.add(appConfig.icon);
        }
      }
    }
    
    // Clean up unused images in the background
    cleanupUnusedImages(activeImages).catch(err => 
      console.error('Error cleaning up images:', err)
    );
    
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

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const language = searchParams.get('language') || 'en';
    const forceRefresh = searchParams.get('refresh') === 'true';
    
    const now = Date.now();
    
    // Check if we should use cached data
    if (!forceRefresh && cache.data && (now - cache.lastFetch) < CACHE_TTL) {
      console.log('Returning cached apps data');
      return NextResponse.json({
        apps: cache.data,
        cached: true,
        lastFetch: cache.lastFetch,
      });
    }
    
    // Try to fetch from API
    try {
      console.log('Fetching fresh apps data from API');
      const apps = await fetchAppsFromAPI(language);
      
      // Update cache
      cache.data = apps;
      cache.lastFetch = now;
      
      return NextResponse.json({
        apps,
        cached: false,
        lastFetch: now,
      });
    } catch (apiError) {
      console.error('Failed to fetch from API:', apiError);
      
      // If we have cached data, return it even if it's stale
      if (cache.data) {
        console.log('API failed, returning stale cached data');
        return NextResponse.json({
          apps: cache.data,
          cached: true,
          stale: true,
          lastFetch: cache.lastFetch,
          error: 'API unavailable, using cached data',
        });
      }
      
      // Fall back to static JSON file
      console.log('No cache available, loading fallback apps');
      const fallbackApps = await loadFallbackApps();
      
      // Update cache with fallback data
      cache.data = fallbackApps;
      cache.lastFetch = now;
      
      return NextResponse.json({
        apps: fallbackApps,
        cached: false,
        fallback: true,
        lastFetch: now,
        error: 'API unavailable, using fallback data',
      });
    }
  } catch (error) {
    console.error('Error in apps API route:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}