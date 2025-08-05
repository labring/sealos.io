import { drawCanvas } from '@/lib/og-canvas';
import { NextRequest, NextResponse } from 'next/server';
import { blog } from '@/lib/source';
import { languagesType } from '@/lib/i18n';
import { getPageCategory } from '@/lib/utils/blog-utils';
import sharp from 'sharp';

export async function generateStaticParams() {
  const params = [];

  for (const lang of ['en', 'zh-cn'] as languagesType[]) {
    // Blog images
    const posts = blog.getPages(lang);
    for (const post of posts) {
      const slug = post.slugs[0];
      const category = getPageCategory(post);

      // Each blog needs two images (with and without category tag)
      if (category !== 'uncategorized') {
        params.push({
          type: 'blog',
          title: [
            encodeURIComponent(slug + '.' + lang),
            encodeURIComponent(category),
          ],
        });
      }

      params.push({
        type: 'blog',
        title: [encodeURIComponent(slug + '.' + lang)],
      });
    }
  }

  return params;
}

export async function GET(
  request: NextRequest,
  { params }: { params: { type: string; title: string[] } },
) {
  try {
    const { type, title } = params;

    // We use `/slug/category` for OG links, and the category part can be omitted.
    const decodedSlug = decodeURIComponent(title[0]);
    const formattedCategory = title[1]
      ? decodeURIComponent(title[1]).toUpperCase()
      : undefined;

    let ogTitle = decodedSlug.toUpperCase(); // Default fallback
    let ogCategory = formattedCategory;

    // Special handling for blog type: use slug to find the actual title
    if (type === 'blog') {
      // Extract slug and locale from the decoded slug (format: slug.locale)
      const slugParts = decodedSlug.split('.');
      const slug = slugParts[0];
      const locale = slugParts[1];

      // Find the blog post by slug and locale
      let found = false;
      if (locale && ['en', 'zh-cn'].includes(locale)) {
        const posts = blog.getPages(locale as languagesType);
        const post = posts.find((p) => p.slugs[0] === slug);
        if (post) {
          ogTitle = (post.data.imageTitle || post.data.title).toUpperCase();
          ogCategory = formattedCategory;
          found = true;
        }
      }

      // If not found, try to find by slug in any language
      if (!found) {
        for (const lang of ['en', 'zh-cn'] as languagesType[]) {
          const posts = blog.getPages(lang);
          const post = posts.find((p) => p.slugs[0] === slug);
          if (post) {
            ogTitle = (post.data.imageTitle || post.data.title).toUpperCase();
            ogCategory = formattedCategory;
            found = true;
            break;
          }
        }
      }

      // If still not found, use the slug as title (fallback)
      if (!found) {
        ogTitle = slug.toUpperCase();
        ogCategory = formattedCategory;
      }
    } else {
      // For non-blog types, use the slug directly as title
      ogTitle = decodedSlug.toUpperCase();
      ogCategory = formattedCategory;
    }

    const canvasBuffer = await drawCanvas(type, ogTitle, ogCategory);

    // All major platforms support WebP Open Graph images.
    const webpBuffer = await sharp(canvasBuffer)
      .webp({ quality: 90 })
      .toBuffer();

    return new NextResponse(webpBuffer, {
      headers: {
        'Content-Type': 'image/webp',
        'Cache-Control': 'public, max-age=86400',
      },
    });
  } catch (error) {
    console.error('Error generating image:', error);
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: 'Failed to generate image', details: errorMessage },
      { status: 500 },
    );
  }
}
