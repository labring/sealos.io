
import { join } from 'path';
import { createCanvas, loadImage, registerFont } from 'canvas';
import { siteConfig } from '@/config/site';
import fs from 'fs';

// Register fonts for canvas
function registerFonts() {
  const fontPath = join(process.cwd(), 'fonts');

  // Check if the directory exists
  if (!fs.existsSync(fontPath)) {
    console.warn('Fonts directory not found:', fontPath);
    return;
  }

  try {
    // Register Arial or a suitable alternative
    registerFont(join(fontPath, 'arial.ttf'), { family: 'Arial' });
    registerFont(join(fontPath, 'arial-bold.ttf'), {
      family: 'Arial',
      weight: 'bold',
    });
    registerFont(join(fontPath, 'NotoSansSC-Black.ttf'), {
      family: 'Noto Sans',
      weight: 'bold',
    });

    // You can register additional fonts if needed
    // registerFont(join(fontPath, 'inter.ttf'), { family: 'Inter' });
  } catch (error) {
    console.error('Error registering fonts:', error);
  }
}

// Register fonts at module level
registerFonts();

// Deterministic "random" function based on seed
function seededRandom(x: number, y: number, seed = 12345) {
  const value = Math.sin(seed + x * 12.9898 + y * 78.233) * 43758.5453;
  return value - Math.floor(value);
}


export async function drawCanvas(
  type: string,
  title: string,
  category?: string,
): Promise<Buffer> {
  // Configure content based on type
  const config = getContentConfig(type);

  // Define dimensions for the image
  const width = 1200;
  const height = 630;

  // Create a canvas with specified dimensions
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');

  // Draw background (common for all types)
  drawBackground(ctx, width, height);

  // Draw content based on type
  await drawContent(ctx, config, title, width, height, category);

  // Convert canvas to buffer
  const buffer = canvas.toBuffer('image/png');
  return buffer;
}


// Get configuration based on content type
function getContentConfig(type: string) {
  // Default tag and icon if type is not recognized
  let tagText = 'Sealos';
  let iconPath = join(process.cwd(), 'public', 'sealos.svg');
  let showTag = true;
  let showTitle = true;

  // Content specific configurations
  if (type === 'blog') {
    tagText = 'Sealos Blog';
    iconPath = join(
      process.cwd(),
      'public',
      'images',
      'og',
      'icons',
      'blog.svg',
    );
  } else if (type === 'docs') {
    tagText = 'Sealos Docs';
    iconPath = join(
      process.cwd(),
      'public',
      'images',
      'og',
      'icons',
      'docs.svg',
    );
  } else if (type === 'email') {
    tagText = 'Sealos Email';
    iconPath = join(
      process.cwd(),
      'public',
      'images',
      'og',
      'icons',
      'email.svg',
    );
  } else if (type === 'website') {
    // For website type, we'll use a different approach
    showTag = false;
    showTitle = false;
  }

  // Uppercase the tag text
  tagText = tagText.toUpperCase();

  return { tagText, iconPath, showTag, showTitle };
}

// Draw the triangle pattern background
function drawBackground(ctx: any, width: number, height: number) {
  // Create a gradient background covering the whole image
  const gradient = ctx.createLinearGradient(width, height, 0, 0);
  gradient.addColorStop(0, '#97D9FF');
  gradient.addColorStop(0.7, '#b9e5ff');
  gradient.addColorStop(1, '#ffffff');

  // Fill the background with the gradient
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  // Create an isometric grid of triangles
  const triangleSize = 125; // Base size of triangles

  // Calculate dimensions for equilateral triangles
  const triangleHeight = (triangleSize * Math.sqrt(3)) / 2;
  const halfWidth = triangleSize / 2;

  // Calculate grid size with offset rows for isometric effect
  const cols = Math.ceil(width / triangleSize) + 2; // Add buffer
  const rows = Math.ceil(height / triangleHeight) + 2; // Add buffer

  // Define base colors for stronger gradient
  const colors = [
    { r: 255, g: 255, b: 255 }, // white
    { r: 221, g: 241, b: 255 }, // very light blue
    { r: 177, g: 224, b: 255 }, // light blue
    { r: 151, g: 217, b: 255 }, // #97D9FF
    { r: 120, g: 185, b: 255 }, // lighter blue
    { r: 80, g: 150, b: 230 }, // medium blue
    { r: 40, g: 100, b: 200 }, // darker blue
  ];

  // Base opacity for triangles - with more variation
  const baseOpacity = 0.2;

  // Draw isometric grid of triangles with gradient-based colors
  for (let row = -1; row < rows; row++) {
    const isOddRow = row % 2 !== 0;
    const xOffset = isOddRow ? halfWidth : 0;

    for (let col = -1; col < cols; col++) {
      const x = col * triangleSize + xOffset;
      const y = row * triangleHeight;

      // Set opacity based on position - more variation but still deterministic
      const opacityVariation = seededRandom(row * 51, col * 23) * 0.15;
      ctx.globalAlpha = baseOpacity + opacityVariation;

      // First triangle (upward)
      const colorIndex1 = (row + col) % 7; // More variation with mod 7
      ctx.fillStyle = getPositionalColor(
        row,
        col,
        colorIndex1 % 2 === 0,
        1,
        colors,
      );

      // Draw upward triangle
      ctx.beginPath();
      ctx.moveTo(x, y + triangleHeight);
      ctx.lineTo(x + triangleSize, y + triangleHeight);
      ctx.lineTo(x + halfWidth, y);
      ctx.closePath();
      ctx.fill();

      // Second triangle (downward)
      const colorIndex2 = (row + col + 3) % 7; // Offset to ensure difference
      ctx.fillStyle = getPositionalColor(
        row,
        col,
        colorIndex2 % 2 === 0,
        2,
        colors,
      );

      ctx.beginPath();
      ctx.moveTo(x + triangleSize, y + triangleHeight);
      ctx.lineTo(x + triangleSize * 1.5, y);
      ctx.lineTo(x + triangleSize * 2, y + triangleHeight);
      ctx.closePath();
      ctx.fill();
    }
  }

  // Reset alpha for the rest of the elements
  ctx.globalAlpha = 1.0;
}

// Helper function to get color based on position in the grid
function getPositionalColor(
  row: number,
  col: number,
  isBase1: boolean,
  triangleType: number,
  colors: Array<{ r: number; g: number; b: number }>,
) {
  // Use multiple seeds for different aspects of randomness
  const positionSeed = row * 1000 + col * 10 + (isBase1 ? 5000 : 0);
  const colorSeed = triangleType * 2345 + row * 67 + col * 90;
  const variationSeed = col * 37 + row * 41 + triangleType * 13;

  // Add "noise" to the position calculation to break up the linear pattern
  // while still maintaining the overall gradient direction
  const xRatio = (col * 125) / 1200;
  const yRatio = (row * ((125 * Math.sqrt(3)) / 2)) / 630;

  // Base position in the gradient
  let positionRatio = (xRatio + yRatio) / 2;

  // Add a larger deterministic variation to break linearity
  // This creates a more "random" look while keeping deterministic behavior
  const noiseAmount =
    seededRandom(row * 3.7, col * 2.9, positionSeed) * 0.6 - 0.3;
  positionRatio = Math.max(0, Math.min(1, positionRatio + noiseAmount));

  // Sometimes completely jump to a different part of the gradient
  // for more visual interest (about 15% of triangles)
  if (seededRandom(row * 7.1, col * 9.3, colorSeed) < 0.15) {
    // Jump to a random position in the gradient
    positionRatio = seededRandom(col * 13.7, row * 15.1, colorSeed + 1000);
  }

  // Select colors from our palette
  // Use a non-linear mapping to emphasize certain color ranges
  const gradientPosition = Math.pow(positionRatio, 0.8);

  // Choose two adjacent colors from our palette based on position
  const colorIndex = Math.min(
    Math.floor(gradientPosition * (colors.length - 1)),
    colors.length - 2,
  );
  const color1 = colors[colorIndex];
  const color2 = colors[colorIndex + 1];

  // Calculate blend factor between these two colors
  const blendFactor = gradientPosition * (colors.length - 1) - colorIndex;

  // Sometimes swap the colors or pick different colors for more variation
  let finalColor1 = color1;
  let finalColor2 = color2;

  // About 20% of the time, pick different colors from the palette
  if (seededRandom(row * 11.3, col * 17.9, colorSeed + 500) < 0.2) {
    // Pick two random adjacent colors from the palette
    const randomIndex = Math.floor(
      seededRandom(col * 23.1, row * 19.7, colorSeed + 600) *
        (colors.length - 1),
    );
    finalColor1 = colors[randomIndex];
    finalColor2 = colors[Math.min(randomIndex + 1, colors.length - 1)];
  }

  // Interpolate between the two colors
  let r = finalColor1.r + (finalColor2.r - finalColor1.r) * blendFactor;
  let g = finalColor1.g + (finalColor2.g - finalColor1.g) * blendFactor;
  let b = finalColor1.b + (finalColor2.b - finalColor1.b) * blendFactor;

  // Add significant color variation to individual triangles
  // while still following the gradient
  const variationFactor =
    seededRandom(col * 31.1, row * 27.3, variationSeed) * 60 - 30;
  r = Math.max(0, Math.min(255, r + variationFactor));
  g = Math.max(0, Math.min(255, g + variationFactor * 0.7)); // Less variation in green
  b = Math.max(0, Math.min(255, b + variationFactor * 0.5)); // Even less in blue to preserve bluish tones

  return `rgb(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)})`;
}

// Draw content based on the content type
async function drawContent(
  ctx: any,
  config: {
    tagText: string;
    iconPath: string;
    showTag: boolean;
    showTitle: boolean;
  },
  title: string,
  width: number,
  height: number,
  category?: string,
) {
  // Load logo SVG for all types
  const logoPath = join(process.cwd(), 'public', 'sealos.svg');
  const logo = await loadImage(logoPath);

  if (config.showTag === false && config.showTitle === false) {
    // Website-specific layout
    await drawWebsiteContent(ctx, width, height, logo);
  } else {
    // Blog/Docs layout
    await drawBlogDocsContent(
      ctx,
      config,
      title,
      width,
      height,
      logo,
      category,
    );
  }
}

// Draw content for blog and docs types
async function drawBlogDocsContent(
  ctx: any,
  config: { tagText: string; iconPath: string },
  title: string,
  width: number,
  height: number,
  logo: any,
  category?: string,
) {
  // Draw logo in the top left corner
  const logoWidth = width * 0.1; // 10% of canvas width
  const logoHeight = (logoWidth / logo.width) * logo.height;
  const x = 80;
  const y = 30;
  ctx.drawImage(logo, x, y, logoWidth, logoHeight);

  // Calculate positions for text elements
  const centerX = width / 2;
  const centerY = height / 2;

  // Draw the pill/tag style type indicator
  ctx.font = 'bold 24px Arial, NotoSans, sans-serif';
  const tagWidth = ctx.measureText(config.tagText).width + 70; // Add padding
  const tagHeight = 45;
  const tagX = centerX - tagWidth / 2;
  const tagY = centerY - 120;

  // Draw rounded rectangle for the pill
  ctx.fillStyle = '#0F3460';
  roundRect(ctx, tagX, tagY, tagWidth, tagHeight, 22.5);

  // Load and draw the appropriate icon in the pill
  try {
    const icon = await loadImage(config.iconPath);
    const iconSize = tagHeight * 0.6;
    const iconPadding = 15;

    // Create a new canvas for the icon to apply color
    const iconCanvas = createCanvas(iconSize, iconSize);
    const iconCtx = iconCanvas.getContext('2d');

    // Draw the original icon
    iconCtx.drawImage(icon, 0, 0, iconSize, iconSize);

    // Apply color filter
    iconCtx.globalCompositeOperation = 'source-in';
    iconCtx.fillStyle = '#FFFFFF';
    iconCtx.fillRect(0, 0, iconSize, iconSize);

    // Draw the recolored icon on the main canvas
    ctx.drawImage(
      iconCanvas,
      tagX + iconPadding,
      tagY + (tagHeight - iconSize) / 2,
      iconSize,
      iconSize,
    );

    // Add text to the pill (adjusted position to account for icon)
    ctx.fillStyle = '#FFFFFF';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    // Offset text position slightly to account for icon on left
    const textOffset = iconSize / 2;
    ctx.fillText(config.tagText, centerX + textOffset, tagY + tagHeight / 2);
  } catch (e) {
    // If icon loading fails, just show text without an icon
    console.error('Error loading icon:', e);
    ctx.fillStyle = '#FFFFFF';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(config.tagText, centerX, tagY + tagHeight / 2);
  }

  // Add category above the main title if provided
  if (category) {
    ctx.font = 'bold 28px Arial, NotoSans, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#0F3460';

    // Add slight shadow for better readability
    ctx.shadowColor = 'rgba(255, 255, 255, 0.7)';
    ctx.shadowBlur = 15;
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;

    // Position category text above the main title
    ctx.fillText(category, centerX, centerY - 30);
  }

  // Add the main title text in the center
  ctx.font = 'bold 64px Arial, Noto Sans, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = '#0F3460';

  // Add slight shadow for better readability
  ctx.shadowColor = 'rgba(255, 255, 255, 0.7)';
  ctx.shadowBlur = 15;
  ctx.shadowOffsetX = 2;
  ctx.shadowOffsetY = 2;

  // Draw the title with word wrapping if needed
  const maxTitleWidth = width * 0.8;
  const titleY = centerY + 30; // Position below the tag

  drawWrappedText(ctx, title, centerX, titleY, maxTitleWidth, 70);
}

// Draw content for website type
async function drawWebsiteContent(
  ctx: any,
  width: number,
  height: number,
  logo: any,
) {
  // For website type, use the full Sealos logo instead
  const fullLogoPath = join(process.cwd(), 'public', 'sealos-full.svg');
  let fullLogo;

  try {
    fullLogo = await loadImage(fullLogoPath);
  } catch (e) {
    console.error('Error loading full logo, falling back to standard logo:', e);
    fullLogo = logo; // Fallback to the standard logo if the full logo can't be loaded
  }

  // Use a larger, centered logo for website type
  const logoWidth = width * 0.5; // 50% of canvas width
  const logoHeight = (logoWidth / fullLogo.width) * fullLogo.height;
  const logoX = (width - logoWidth) / 2;
  const logoY = (height - logoHeight) / 2 - 50; // Move logo higher to make room for title

  ctx.drawImage(fullLogo, logoX, logoY, logoWidth, logoHeight);

  // Add title below the logo
  ctx.font = 'bold 48px Arial, Noto Sans, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = '#0F3460';

  // Add slight shadow for better readability
  ctx.shadowColor = 'rgba(255, 255, 255, 0.7)';
  ctx.shadowBlur = 15;
  ctx.shadowOffsetX = 2;
  ctx.shadowOffsetY = 2;

  // Add tagline below the title - only if using standard logo
  if (fullLogo === logo) {
    // Only add tagline if we're using the fallback logo
    ctx.font = 'bold 36px Arial, Noto Sans, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    const tagline = siteConfig.tagline;
    ctx.fillText(tagline, width / 2, logoY + logoHeight + 120); // Position below the title
  } else {
    // If using the full logo, still add the tagline below the "here here here" title
    ctx.font = 'bold 36px Arial, Noto Sans, sans-serif';
    const tagline = siteConfig.tagline;
    ctx.fillText(tagline, width / 2, logoY + logoHeight + 120); // Position below the title
  }
}

// Helper function to draw rounded rectangles
function roundRect(
  ctx: any,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
  ctx.fill();
}

// Helper function to draw text with wrapping
function drawWrappedText(
  ctx: any,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
) {
  // Ensure we use a font that's registered or a fallback
  // ctx.font already set in the calling context, but we can make it more robust:
  ctx.font = ctx.font || 'bold 64px Arial, Noto Sans, sans-serif';

  const words = text.split(' ');
  let line = '';
  let testLine = '';
  let lineCount = 0;

  for (let i = 0; i < words.length; i++) {
    testLine = line + words[i] + ' ';
    const metrics = ctx.measureText(testLine);
    const testWidth = metrics.width;

    if (testWidth > maxWidth && i > 0) {
      ctx.fillText(line, x, y + lineCount * lineHeight);
      line = words[i] + ' ';
      lineCount++;
    } else {
      line = testLine;
    }
  }

  ctx.fillText(line, x, y + lineCount * lineHeight);
}


