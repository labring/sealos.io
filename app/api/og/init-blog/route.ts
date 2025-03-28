import { NextRequest, NextResponse } from 'next/server';

import fs from 'fs';
import path from 'path';

import { blog } from '@/lib/source';
import { languagesType } from '@/lib/i18n';
import { getPageCategory } from '@/lib/utils/blog-utils';
import { drawCanvas } from '@/lib/og-canvas';
import sharp from 'sharp';

const OUTPUT_DIR = path.join(process.cwd(), 'public', 'images', 'og-blog');

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

async function generateImages() {
  for (const lang of ['en', 'zh-cn']) {
    const posts = blog.getPages(lang as languagesType);
    for (const post of posts) {
      const title = post.data.title;
      const category = getPageCategory(post);
      try {
        const canvasBuffer = await drawCanvas(
          'blog',
          title.toUpperCase(),
          category !== 'uncategorized' ? category.toUpperCase() : undefined,
        );

        const webpBuffer = await sharp(canvasBuffer)
          .webp({ quality: 90 })
          .toBuffer();

        const filePath = path.join(
          OUTPUT_DIR,
          `${title}.webp`.replaceAll(' ', '').replaceAll('?', ''),
        );

        fs.writeFileSync(filePath, webpBuffer as Uint8Array);
      } catch (error) {
        console.error(`Failed to generate image for ${title} - ${category}:`);
      }
    }
  }
}

await generateImages();

export async function GET(request: NextRequest) {
  return NextResponse.json({
    error:
      'This is not a link that you normally visit, this is a slot used to generate open graph images for drawing blog pages during build time. The generateImages function in this file will be automatically run when packaging.',
  });
}
