#!/usr/bin/env node

/**
 * Script to fetch template data from API and generate app list config
 *
 * Usage:
 *   node generate-apps-api.js [--language=en|zh] [--clean]
 *
 * Parameters:
 *   --language=en|zh: Language for the API request (default: en)
 *   --clean: Clean the public/images/apps directory before downloading
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const crypto = require('crypto');

// API endpoint
const API_URL = 'https://template.usw.sealos.io/api/listTemplate';

// Output paths for configuration files
const CONFIG_DIR = path.join(__dirname, '..', 'config');
const APPS_CONFIG_PATH = path.join(CONFIG_DIR, 'apps.json');
const IMAGES_DIR = path.join(__dirname, '..', 'public', 'images', 'apps');

function isNetworkError(error) {
  if (!error) {
    return false;
  }

  const message = typeof error.message === 'string' ? error.message : '';
  const code = error.code || error.cause?.code;

  if (message.toLowerCase().includes('fetch failed')) {
    return true;
  }

  const networkErrorCodes = new Set([
    'EAI_AGAIN',
    'ENOTFOUND',
    'ECONNREFUSED',
    'ECONNRESET',
    'ETIMEDOUT',
  ]);

  return code ? networkErrorCodes.has(code) : false;
}

/**
 * Fetch templates from API
 */
async function fetchTemplates(language = 'en') {
  try {
    console.log(`📥 Fetching templates from API (language: ${language})...`);
    
    const response = await fetch(`${API_URL}?language=${language}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.code !== 200) {
      throw new Error(`API error: ${data.message || 'Unknown error'}`);
    }
    
    console.log(`✅ Fetched ${data.data.templates.length} templates from API`);
    return data.data.templates;
  } catch (error) {
    console.error('❌ Error fetching templates:', error.message);
    throw error;
  }
}

/**
 * Convert API template to app config format
 */
async function convertTemplateToAppConfig(template) {
  const spec = template.spec || {};
  const metadata = template.metadata || {};
  
  // Check if template is draft and skip if it is
  if (spec.draft === true) {
    console.log(`⏭ Skipping template "${spec.title || metadata.name}" - draft: true`);
    return null;
  }
  
  // Skip if locale is zh (Chinese-only templates)
  if (spec.locale === 'zh') {
    console.log(`⏭ Skipping template "${spec.title || metadata.name}" - locale is "zh"`);
    return null;
  }
  
  // Map categories
  const categoryMapping = {
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
  const gradientMapping = {
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
  const iconPath = await downloadIcon(spec.icon, slug);
  
  // Create i18n object if available
  const i18n = {};
  if (spec.i18n && spec.i18n.zh && spec.i18n.zh.description) {
    i18n.zh = {
      description: spec.i18n.zh.description,
    };
  }
  
  // Generate basic features based on category
  const categoryFeatures = {
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
  
  const appConfig = {
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
      url: template.filePath ? `https://github.com/labring-actions/templates/tree/kb-0.9${template.filePath}` : undefined,
      deployCount: template.deployCount || 0,
    },
    // Add i18n object if available
    ...(Object.keys(i18n).length > 0 && { i18n }),
  };
  
  return appConfig;
}

/**
 * Get file extension from URL or default to .png
 */
function getFileExtension(url) {
  try {
    const pathname = new URL(url).pathname;
    const ext = path.extname(pathname);
    if (ext && ['.png', '.jpg', '.jpeg', '.svg', '.ico', '.webp', '.gif'].includes(ext.toLowerCase())) {
      return ext;
    }
  } catch (e) {
    // Invalid URL
  }
  return '.png';
}

/**
 * Download icon from URL and save to public/images/apps folder
 */
async function downloadIcon(iconUrl, slug) {
  if (!iconUrl || iconUrl === '/icons/default.svg') {
    console.log(`⏭ Skipping icon download for ${slug} - using default icon`);
    return '/icons/default.svg';
  }
  
  try {
    // Get file extension
    const extension = getFileExtension(iconUrl);
    
    // Create filename with slug and original extension
    const filename = `${slug}${extension}`;
    const outputPath = path.join(IMAGES_DIR, filename);
    
    // Create directory if it doesn't exist
    if (!fs.existsSync(IMAGES_DIR)) {
      fs.mkdirSync(IMAGES_DIR, { recursive: true });
    }
    
    console.log(`📥 Downloading icon for ${slug}: ${iconUrl}`);
    
    // Use curl to download the icon
    execSync(`curl -s -L -o "${outputPath}" "${iconUrl}"`, {
      timeout: 10000, // 10 second timeout
    });
    
    // Check if file was downloaded successfully
    if (fs.existsSync(outputPath) && fs.statSync(outputPath).size > 0) {
      console.log(`✅ Downloaded icon: ${filename}`);
      return `/images/apps/${filename}`;
    } else {
      console.log(`❌ Failed to download icon for ${slug}, using default`);
      return '/icons/default.svg';
    }
  } catch (error) {
    console.error(`❌ Error downloading icon for ${slug}:`, error.message);
    return '/icons/default.svg';
  }
}

/**
 * Clean images directory
 */
function cleanImagesDirectory() {
  console.log('🧹 Cleaning images directory...');
  if (fs.existsSync(IMAGES_DIR)) {
    fs.rmSync(IMAGES_DIR, { recursive: true, force: true });
  }
  fs.mkdirSync(IMAGES_DIR, { recursive: true });
  console.log('✅ Images directory cleaned');
}

/**
 * Main function to process templates
 */
async function processTemplates() {
  console.log('Processing template data from API...');
  
  // Parse command line arguments
  const args = process.argv.slice(2);
  
  // Parse language parameter (default: en)
  const languageArg = args.find((arg) => arg.startsWith('--language='));
  const language = languageArg ? languageArg.split('=')[1] : 'en';
  
  // Parse clean parameter
  const clean = args.includes('--clean');
  
  console.log(`Language: ${language}`);
  console.log(`Clean mode: ${clean ? 'enabled' : 'disabled'}`);
  
  try {
    // Clean images directory if requested
    if (clean) {
      cleanImagesDirectory();
    }
    
    // Fetch templates from API
    let templates;
    try {
      templates = await fetchTemplates(language);
    } catch (error) {
      if (isNetworkError(error)) {
        console.warn('⚠️ Network unavailable. Skipping remote template refresh and keeping existing config.');
        return;
      }
      throw error;
    }
    
    if (templates.length === 0) {
      console.log('⚠️ No templates found');
      return;
    }
    
    console.log(`Found ${templates.length} templates`);
    
    const appConfigs = [];
    let processedCount = 0;
    let skippedCount = 0;
    let addedCount = 0;
    
    for (const template of templates) {
      processedCount++;
      const templateName = template.metadata?.name || 'Unknown';
      
      console.log(`\n[${processedCount}/${templates.length}] Processing: ${templateName}`);
      
      try {
        const appConfig = await convertTemplateToAppConfig(template);
        
        if (appConfig) {
          appConfigs.push(appConfig);
          console.log(`✅ Added app: ${appConfig.name} (${appConfig.slug})`);
          addedCount++;
        } else {
          skippedCount++;
        }
      } catch (error) {
        console.error(`❌ Error processing ${templateName}:`, error.message);
        skippedCount++;
      }
    }
    
    // Sort apps by deploy count (descending) and then by name
    appConfigs.sort((a, b) => {
      const deployCountA = a.source?.deployCount || 0;
      const deployCountB = b.source?.deployCount || 0;
      if (deployCountB !== deployCountA) {
        return deployCountB - deployCountA;
      }
      return a.name.localeCompare(b.name);
    });
    
    // Generate the main JSON config file
    const configContent = JSON.stringify(appConfigs, null, 2);
    fs.writeFileSync(APPS_CONFIG_PATH, configContent, 'utf8');
    
    console.log(`\n✅ Generated main config file: ${APPS_CONFIG_PATH}`);
    
    // Generate category summary
    const appsByCategory = {};
    appConfigs.forEach(app => {
      const category = app.category || 'Tools';
      if (!appsByCategory[category]) {
        appsByCategory[category] = 0;
      }
      appsByCategory[category]++;
    });
    
    const categoryList = Object.keys(appsByCategory)
      .map(cat => `${cat} (${appsByCategory[cat]})`)
      .join(', ');
    
    console.log(`📊 Summary:`);
    console.log(`  - Total apps in config: ${appConfigs.length}`);
    console.log(`  - Categories: ${categoryList}`);
    console.log(`  - Apps added: ${addedCount}`);
    console.log(`  - Apps skipped: ${skippedCount}`);
    
    if (addedCount > 0) {
      console.log('\n🆕 Top 10 apps by deploy count:');
      const top10Apps = appConfigs.slice(0, 10);
      top10Apps.forEach((app, index) => {
        const deployCount = app.source?.deployCount || 0;
        console.log(`  ${index + 1}. ${app.name} (${app.category}) - ${deployCount} deploys`);
      });
    }
    
    if (skippedCount > 0) {
      console.log(`\n⏭ Apps skipped: ${skippedCount} (draft or Chinese-only templates)`);
    }
  } catch (error) {
    console.error('Error processing templates:', error.message);
    console.error('Full error:', error);
    process.exit(1);
  }
}

// Run the script
if (require.main === module) {
  processTemplates();
}

module.exports = { processTemplates };
