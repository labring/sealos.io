#!/usr/bin/env node

/**
 * Script to fetch template data from GitHub API using curl and generate app list config
 *
 * Environment Variables:
 *   GITHUB_TOKEN or GH_TOKEN: GitHub Personal Access Token for authentication (optional but recommended)
 *
 * Usage:
 *   node generate-apps.js [limit] [--start=N] [--update]
 *   GITHUB_TOKEN=your_token node generate-apps.js [limit] [--start=N] [--update]
 *
 * Parameters:
 *   limit: Maximum number of items to process (default: 200)
 *   --start=N: Starting position/offset for processing (default: 0)
 *   --limit=N: Alternative way to specify limit
 *   --update, --overwrite, -u: Force update existing apps and process even unchanged sources
 */

const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const { execSync } = require('child_process');

// GitHub API endpoint
const API_BASE =
  'https://api.github.com/repos/labring-actions/templates/contents/template';

// Output path for apps.json (used for both input and output)
const APPS_CONFIG_PATH = path.join(__dirname, '..', 'config', 'apps.json');

/**
 * Load existing apps configuration from file
 */
function loadExistingApps() {
  try {
    if (fs.existsSync(APPS_CONFIG_PATH)) {
      console.log(`📖 Loading existing apps from: ${APPS_CONFIG_PATH}`);
      const content = fs.readFileSync(APPS_CONFIG_PATH, 'utf8');
      const existingApps = JSON.parse(content);
      console.log(`Found ${existingApps.length} existing apps`);
      return existingApps;
    } else {
      console.log(`📝 No existing apps file found, starting fresh`);
      return [];
    }
  } catch (error) {
    console.error('Error loading existing apps:', error.message);
    return [];
  }
}

/**
 * Check if we should skip processing an item based on source tracking
 * Only checks source URL and SHA hash
 */
function shouldSkipProcessing(existingApps, sourceUrl, sha, forceUpdate) {
  if (forceUpdate) return false;

  const existingApp = existingApps.find((app) => app.source?.url === sourceUrl);
  if (!existingApp) return false;

  // Handle missing SHA values
  const existingSha = existingApp.source?.sha;
  if (!existingSha || !sha) {
    console.log(
      `⚠️ Missing SHA information for ${sourceUrl} - processing to update`,
    );
    return false; // Process if either SHA is missing
  }

  // Skip if SHA hasn't changed (content is identical)
  const shouldSkip = existingSha === sha;

  if (shouldSkip) {
    console.log(`⏭ Skipping source ${sourceUrl} - no changes (SHA: ${sha})`);
  }

  return shouldSkip;
}

/**
 * Fetch data using curl command
 */
function fetchWithCurl(url) {
  try {
    console.log(`Fetching: ${url}`);

    // Build curl command with optional GitHub token
    let curlCommand = `curl -s -H "User-Agent: Node.js GitHub API Client"`;

    // Add GitHub token if available
    const githubToken = process.env.GITHUB_TOKEN || process.env.GH_TOKEN;
    if (githubToken) {
      curlCommand += ` -H "Authorization: Bearer ${githubToken}"`;
      console.log('Using GitHub authentication token');
    } else {
      console.log(
        '⚠️ No GitHub token found. Using unauthenticated requests (rate limited)',
      );
      console.log(
        '💡 Set GITHUB_TOKEN or GH_TOKEN environment variable for higher rate limits',
      );
    }

    curlCommand += ` "${url}"`;

    const result = execSync(curlCommand, {
      encoding: 'utf8',
      timeout: 30000, // 30 second timeout
    });
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
async function convertTemplateToAppConfig(template, sourceUrl, sha) {
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
    source: {
      url: sourceUrl,
      sha: sha,
    },
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

  // Parse command line arguments
  const args = process.argv.slice(2);

  // Parse start parameter (default: 0)
  const startArg = args.find((arg) => arg.startsWith('--start='));
  const start = startArg ? parseInt(startArg.split('=')[1]) : 0;

  // Parse limit parameter (default: 200)
  // Look for --limit= format first, then plain numbers (excluding start values and flags)
  const limitArg =
    args.find((arg) => arg.startsWith('--limit=')) ||
    args.find(
      (arg) =>
        !isNaN(parseInt(arg)) && !arg.startsWith('--') && !arg.startsWith('-'),
    );
  const limit = limitArg
    ? limitArg.startsWith('--limit=')
      ? parseInt(limitArg.split('=')[1])
      : parseInt(limitArg)
    : 200;

  const forceUpdate =
    args.includes('--update') ||
    args.includes('--overwrite') ||
    args.includes('-u');

  console.log(`Start position: ${start}`);
  console.log(`Max items to process: ${limit}`);
  console.log(`Force update mode: ${forceUpdate ? 'enabled' : 'disabled'}`);

  // Load existing apps
  const existingApps = loadExistingApps();

  try {
    // Fetch the contents of the template directory
    console.log('Making API request...');
    const contentsJson = fetchWithCurl(API_BASE);
    console.log('API response received, parsing JSON...');

    let contents;
    try {
      contents = JSON.parse(contentsJson);

      // Debug: Check if contents is an array
      if (!Array.isArray(contents)) {
        console.error(`❌ API response is not an array:`, typeof contents);
        console.error('Response:', contentsJson.substring(0, 500) + '...');

        // Check if it's an error response
        if (contents && contents.message) {
          console.error('GitHub API Error:', contents.message);
          if (contents.documentation_url) {
            console.error('Documentation:', contents.documentation_url);
          }

          // Handle rate limit specifically
          if (contents.message.includes('rate limit exceeded')) {
            console.error('\n🚫 GitHub API Rate Limit Exceeded!');
            console.error('Solutions:');
            console.error(
              '1. Wait for rate limit reset (check: curl -s https://api.github.com/rate_limit)',
            );
            console.error(
              '2. Use GitHub token: GITHUB_TOKEN=your_token node scripts/generate-apps.js',
            );
            console.error(
              '3. Create token at: https://github.com/settings/tokens',
            );
            console.error('\nRate limit info:');

            // Get rate limit info
            try {
              const rateLimitJson = execSync(
                'curl -s https://api.github.com/rate_limit',
                { encoding: 'utf8' },
              );
              const rateLimitData = JSON.parse(rateLimitJson);
              const resetTime = new Date(rateLimitData.rate.reset * 1000);
              console.error(
                `- Remaining: ${rateLimitData.rate.remaining}/${rateLimitData.rate.limit}`,
              );
              console.error(`- Resets at: ${resetTime.toLocaleString()}`);
            } catch (e) {
              console.error('- Could not fetch rate limit details');
            }
          }

          process.exit(1);
        }
        process.exit(1);
      }
    } catch (error) {
      console.error(`❌ Error parsing main API response JSON:`, error.message);
      console.error('Response:', contentsJson.substring(0, 500) + '...');
      process.exit(1);
    }

    console.log(`Found ${contents.length} items in the directory`);
    console.log(
      `Processing range: ${start} to ${Math.min(start + limit, contents.length)} (${Math.min(limit, contents.length - start)} items)`,
    );

    const appConfigs = [...existingApps]; // Start with existing apps
    let processedCount = 0;
    let skippedCount = 0;
    let addedCount = 0;
    let updatedCount = 0;

    for (const item of contents.slice(start, start + limit)) {
      processedCount++;
      const totalInRange = Math.min(limit, contents.length - start);
      console.log(
        `\n[${processedCount}/${totalInRange}] Processing: ${item.name}`,
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

            // Check if we should skip processing based on source tracking
            if (
              shouldSkipProcessing(
                existingApps,
                indexYaml.download_url,
                indexYaml.sha,
                forceUpdate,
              )
            ) {
              skippedCount++;
              continue;
            }

            await sleep(500);

            const yamlContent = fetchWithCurl(indexYaml.download_url);
            const template = parseTemplateYAML(yamlContent);

            if (template) {
              const appConfig = await convertTemplateToAppConfig(
                template,
                indexYaml.download_url,
                indexYaml.sha,
              );
              if (appConfig) {
                // Find existing app by source URL
                const existingAppIndex = appConfigs.findIndex(
                  (app) => app.source?.url === indexYaml.download_url,
                );

                if (existingAppIndex !== -1) {
                  // Update existing app based on source URL
                  appConfigs[existingAppIndex] = appConfig;
                  console.log(
                    `🔄 Updated app from source: ${appConfig.name} (${appConfig.slug})`,
                  );
                  updatedCount++;
                } else {
                  // Add new app
                  appConfigs.push(appConfig);
                  console.log(
                    `✅ Added new app: ${appConfig.name} (${appConfig.slug})`,
                  );
                  addedCount++;
                }
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

          // Check if we should skip processing based on source tracking
          if (
            shouldSkipProcessing(
              existingApps,
              item.download_url,
              item.sha,
              forceUpdate,
            )
          ) {
            skippedCount++;
            continue;
          }

          await sleep(500);

          const yamlContent = fetchWithCurl(item.download_url);
          const template = parseTemplateYAML(yamlContent);

          if (template) {
            const appConfig = await convertTemplateToAppConfig(
              template,
              item.download_url,
              item.sha,
            );
            if (appConfig) {
              // Find existing app by source URL
              const existingAppIndex = appConfigs.findIndex(
                (app) => app.source?.url === item.download_url,
              );

              if (existingAppIndex !== -1) {
                // Update existing app based on source URL
                appConfigs[existingAppIndex] = appConfig;
                console.log(
                  `🔄 Updated app from source: ${appConfig.name} (${appConfig.slug})`,
                );
                updatedCount++;
              } else {
                // Add new app
                appConfigs.push(appConfig);
                console.log(
                  `✅ Added new app: ${appConfig.name} (${appConfig.slug})`,
                );
                addedCount++;
              }
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

    const processedRange = Math.min(limit, contents.length - start);
    if (start + limit < contents.length) {
      console.log(
        `\n⚠ Note: Processed ${processedRange} items (${start} to ${start + limit - 1}) out of ${contents.length} total.`,
      );
      console.log(
        `💡 Use --start=${start + limit} to continue from where you left off.`,
      );
    }

    // Generate the JSON config file
    const configContent = generateConfigFile(appConfigs);

    // Write to file
    fs.writeFileSync(APPS_CONFIG_PATH, configContent, 'utf8');

    console.log(`\n✅ Generated JSON config file: ${APPS_CONFIG_PATH}`);
    console.log(`📊 Summary:`);
    console.log(`  - Total apps in config: ${appConfigs.length}`);
    console.log(`  - New apps added: ${addedCount}`);
    console.log(`  - Existing apps updated: ${updatedCount}`);
    console.log(`  - Apps skipped (no changes): ${skippedCount}`);

    if (addedCount > 0) {
      console.log('\n🆕 New apps added:');
      // Show only the new apps added in this run
      const newApps = appConfigs.slice(-addedCount);
      newApps.forEach((app) => {
        console.log(`  - ${app.name} (${app.category})`);
      });
    }

    if (updatedCount > 0) {
      console.log('\n🔄 Apps updated in this run:', updatedCount);
    }

    if (skippedCount > 0) {
      console.log(`\n⏭ Apps skipped: ${skippedCount}`);
      if (!forceUpdate) {
        console.log('   (Source files unchanged since last update)');
        console.log('💡 Use --update flag to force update all apps');
      } else {
        console.log('   (Apps already exist and were skipped)');
      }
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
