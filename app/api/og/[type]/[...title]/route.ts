import { drawCanvas } from '@/lib/og-canvas';
import { NextRequest, NextResponse } from 'next/server';
import { blog } from '@/lib/source';
import { languagesType } from '@/lib/i18n';
import { getPageCategory } from '@/lib/utils/blog-utils';

export async function generateStaticParams() {
  const params = [];

  for (const lang of ['en', 'zh-cn'] as languagesType[]) {
    // Blog images
    const posts = blog.getPages(lang);
    for (const post of posts) {
      const title = post.data.imageTitle || post.data.title;
      const category = getPageCategory(post);

      // Each blog needs two images (with and without category tag)
      if (category !== 'uncategorized') {
        params.push({
          type: 'blog',
          title: [encodeURIComponent(title), encodeURIComponent(category)],
        });
      }

      params.push({
        type: 'blog',
        title: [encodeURIComponent(title)],
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

    // We use `/title/category` for OG links, and the category part can be omitted.
    const decodedTitle = decodeURIComponent(title[0]).toUpperCase();
    const formattedCategory = title[1]
      ? decodeURIComponent(title[1]).toUpperCase()
      : undefined;

    const buffer = await drawCanvas(type, decodedTitle, formattedCategory);
    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'image/png',
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
