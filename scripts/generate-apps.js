#!/usr/bin/env node

/**
 * Script to fetch template data from GitHub API using curl and generate app list config
 */

const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const { execSync } = require('child_process');

// GitHub API endpoint
const API_BASE =
  'https://api.github.com/repos/labring-actions/templates/contents/template';

/**
 * Fetch data using curl command
 */
function fetchWithCurl(url) {
  try {
    console.log(`Fetching: ${url}`);
    const result = execSync(
      `curl -s -H "User-Agent: Node.js GitHub API Client" "${url}"`,
      {
        encoding: 'utf8',
        timeout: 30000, // 30 second timeout
      },
    );
    return result;
  } catch (error) {
    console.error(`Error fetching ${url}:`, error.message);
    throw error;
  }
}

/**
 * Parse YAML content and extract template data
 */
function parseTemplateYAML(yamlContent) {
  try {
    const docs = yaml.loadAll(yamlContent);
    const template = docs.find(
      (doc) =>
        doc && doc.apiVersion === 'app.sealos.io/v1' && doc.kind === 'Template',
    );

    if (!template) {
      console.warn('No valid template found in YAML');
      return null;
    }

    return template;
  } catch (error) {
    console.error('Error parsing YAML:', error);
    return null;
  }
}

/**
 * Convert template to app config format
 */
async function convertTemplateToAppConfig(template) {
  const spec = template.spec || {};
  const metadata = template.metadata || {};

  // Check locale and skip if it's Chinese
  const locale = spec.locale || '';
  if (locale === 'zh') {
    console.log(
      `⏭ Skipping template "${spec.title || metadata.name}" - locale is "${locale}"`,
    );
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
  };

  const templateCategory =
    spec.categories && spec.categories[0]
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
  };

  // Extract description - use spec.description as primary
  const description = spec.description || '';
  // const longDescription = description; // Commented out for now since there isn't one

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
  };

  const appConfig = {
    name: spec.title || metadata.name || '',
    slug: metadata.name || '',
    description: description,
    // longDescription: longDescription, // Commented out for now
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
    // Add i18n object if available
    ...(Object.keys(i18n).length > 0 && { i18n }),
  };

  return appConfig;
}

/**
 * Generate JSON config file content
 */
function generateConfigFile(appConfigs) {
  return JSON.stringify(appConfigs, null, 2);
}

/**
 * Sleep for specified milliseconds
 */
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
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
    // Extract file extension from URL
    const urlObj = new URL(iconUrl);
    const pathname = urlObj.pathname;
    const extension = path.extname(pathname) || '.png'; // Default if no extension

    // Create filename with slug and original extension
    const filename = `${slug}${extension}`;
    const outputDir = path.join(__dirname, '..', 'public', 'images', 'apps');
    const outputPath = path.join(outputDir, filename);

    // Create directory if it doesn't exist
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
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
 * Main function to process templates
 */
async function processTemplates() {
  console.log('Fetching template data from GitHub using curl...');
  console.log('API Endpoint:', API_BASE);

  try {
    // Fetch the contents of the template directory
    console.log('Making API request...');
    const contentsJson = fetchWithCurl(API_BASE);
    console.log('API response received, parsing JSON...');
    const contents = JSON.parse(contentsJson);
    console.log(`Found ${contents.length} items in the directory`);

    const appConfigs = [];
    let processedCount = 0;
    const maxItems = process.argv[2] ? parseInt(process.argv[2]) : 200;

    for (const item of contents.slice(0, maxItems)) {
      processedCount++;
      console.log(
        `\n[${processedCount}/${Math.min(contents.length, maxItems)}] Processing: ${item.name}`,
      );

      // Add delay between requests
      if (processedCount > 1) {
        console.log('Waiting 1 second...');
        await sleep(1000);
      }

      try {
        if (item.type === 'dir') {
          // This is a folder, get the index.yaml file
          console.log(`Processing folder: ${item.name}`);

          const folderContentsJson = fetchWithCurl(item.url);
          const folderContents = JSON.parse(folderContentsJson);
          const indexYaml = folderContents.find(
            (file) => file.name === 'index.yaml',
          );

          if (indexYaml) {
            console.log(`Found index.yaml in folder`);
            await sleep(500);

            const yamlContent = fetchWithCurl(indexYaml.download_url);
            const template = parseTemplateYAML(yamlContent);

            if (template) {
              const appConfig = await convertTemplateToAppConfig(template);
              if (appConfig) {
                appConfigs.push(appConfig);
                console.log(`✅ Processed template: ${appConfig.name}`);
              }
            } else {
              console.log(
                `⚠ No valid template found in ${item.name}/index.yaml`,
              );
            }
          } else {
            console.log(`⚠ No index.yaml found in folder: ${item.name}`);
          }
        } else if (item.type === 'file' && item.name.endsWith('.yaml')) {
          // This is a YAML file
          console.log(`Processing file: ${item.name}`);
          await sleep(500);

          const yamlContent = fetchWithCurl(item.download_url);
          const template = parseTemplateYAML(yamlContent);

          if (template) {
            const appConfig = await convertTemplateToAppConfig(template);
            if (appConfig) {
              appConfigs.push(appConfig);
              console.log(`✅ Processed template: ${appConfig.name}`);
            }
          } else {
            console.log(`⚠ No valid template found in ${item.name}`);
          }
        } else {
          console.log(
            `⏭ Skipping ${item.name} (not a YAML file or directory)`,
          );
        }
      } catch (error) {
        console.error(`❌ Error processing ${item.name}:`, error.message);
      }
    }

    if (contents.length > maxItems) {
      console.log(
        `\n⚠ Note: Only processed first ${maxItems} items out of ${contents.length} total.`,
      );
    }

    // Generate the JSON config file
    const configContent = generateConfigFile(appConfigs);

    // Write to file
    const outputPath = path.join(__dirname, '..', 'config', 'apps.json');
    fs.writeFileSync(outputPath, configContent, 'utf8');

    console.log(
      `\n✅ Generated JSON config file with ${appConfigs.length} apps: ${outputPath}`,
    );
    console.log('\nGenerated apps:');
    appConfigs.forEach((app) => {
      console.log(`  - ${app.name} (${app.category})`);
    });
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
