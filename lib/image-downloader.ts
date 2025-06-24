import { promises as fs } from 'fs';
import path from 'path';

const IMAGES_DIR = path.join(process.cwd(), 'public', 'images', 'apps');

// Create images directory if it doesn't exist
async function ensureImagesDir() {
  try {
    await fs.access(IMAGES_DIR);
  } catch {
    await fs.mkdir(IMAGES_DIR, { recursive: true });
  }
}

/**
 * Get file extension from URL or content type
 */
function getFileExtension(url: string, contentType?: string): string {
  // Try to get extension from URL
  const urlPath = new URL(url).pathname;
  const ext = path.extname(urlPath);
  
  if (ext && ['.png', '.jpg', '.jpeg', '.svg', '.ico', '.webp', '.gif'].includes(ext.toLowerCase())) {
    return ext;
  }
  
  // Try to get from content type
  if (contentType) {
    const mimeToExt: Record<string, string> = {
      'image/png': '.png',
      'image/jpeg': '.jpg',
      'image/jpg': '.jpg',
      'image/svg+xml': '.svg',
      'image/x-icon': '.ico',
      'image/vnd.microsoft.icon': '.ico',
      'image/webp': '.webp',
      'image/gif': '.gif',
    };
    
    const mimeType = contentType.split(';')[0].trim().toLowerCase();
    if (mimeToExt[mimeType]) {
      return mimeToExt[mimeType];
    }
  }
  
  // Default to .png if can't determine
  return '.png';
}

/**
 * Generate a filename based on slug
 */
function generateFilename(url: string, slug: string, extension: string): string {
  // Use simple filename to match static generation
  return `${slug}${extension}`;
}

/**
 * Check if image already exists locally
 */
async function imageExists(filename: string): Promise<boolean> {
  try {
    await fs.access(path.join(IMAGES_DIR, filename));
    return true;
  } catch {
    return false;
  }
}

/**
 * Download image from URL and save to local directory
 */
export async function downloadImage(imageUrl: string, slug: string): Promise<string> {
  // Handle default or empty URLs
  if (!imageUrl || imageUrl === '/icons/default.svg') {
    return '/icons/default.svg';
  }
  
  try {
    // Ensure the URL is valid
    const url = new URL(imageUrl);
    
    // Ensure images directory exists
    await ensureImagesDir();
    
    // Make initial request to get content type
    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; SealosBot/1.0)',
      },
    });
    
    if (!response.ok) {
      console.error(`Failed to download image from ${imageUrl}: ${response.status}`);
      return '/icons/default.svg';
    }
    
    const contentType = response.headers.get('content-type') || '';
    const extension = getFileExtension(imageUrl, contentType);
    const filename = generateFilename(imageUrl, slug, extension);
    const localPath = `/images/apps/${filename}`;
    
    // Check if image already exists
    if (await imageExists(filename)) {
      return localPath;
    }
    
    // Download the image
    const buffer = await response.arrayBuffer();
    const fullPath = path.join(IMAGES_DIR, filename);
    
    // Save to file
    await fs.writeFile(fullPath, Buffer.from(buffer) as any);
    
    console.log(`Downloaded image: ${filename}`);
    return localPath;
  } catch (error) {
    console.error(`Error downloading image from ${imageUrl}:`, error);
    return '/icons/default.svg';
  }
}

/**
 * Clean up old images that are no longer referenced
 * Only removes files with hash pattern (legacy files)
 */
export async function cleanupUnusedImages(activeImages: Set<string>): Promise<void> {
  try {
    await ensureImagesDir();
    const files = await fs.readdir(IMAGES_DIR);
    
    // Pattern to match files with hash (e.g., affine-3bb829d6.png)
    const hashPattern = /^.+-[a-f0-9]{8}\.[a-z]+$/i;
    
    for (const file of files) {
      // Only remove files with hash pattern (legacy files)
      if (hashPattern.test(file)) {
        const fullPath = path.join(IMAGES_DIR, file);
        await fs.unlink(fullPath);
        console.log(`Removed legacy image with hash: ${file}`);
      }
    }
  } catch (error) {
    console.error('Error cleaning up images:', error);
  }
}