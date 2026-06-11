import { NextResponse, type NextRequest } from 'next/server';
import {
  BLOG_THUMBNAIL_CACHE_CONTROL,
  getBlogThumbnailStaticParams,
  parseBlogThumbnailFormat,
  renderBlogThumbnailPngResponse,
  renderBlogThumbnailSvg,
  resolveBlogThumbnailPage,
} from '@/lib/native-rendering/blog-thumbnail-renderer';

export function generateStaticParams() {
  return getBlogThumbnailStaticParams();
}

export async function GET(
  _request: NextRequest,
  { params }: { params: { lang: string; slug: string; format: string } },
) {
  try {
    const parsed = parseBlogThumbnailFormat(decodeURIComponent(params.format));
    if (!parsed) {
      return NextResponse.json(
        {
          error:
            'Invalid format. Use <width>x<height>[@dpr].(png|svg) with width/height 128-4000 and dpr up to 3.',
        },
        { status: 400 },
      );
    }

    const slug = decodeURIComponent(params.slug);
    const resolved = resolveBlogThumbnailPage({
      lang: params.lang || 'en',
      slug,
    });

    if (!resolved) {
      return NextResponse.json(
        { error: 'Blog post not found' },
        { status: 404 },
      );
    }

    if (parsed.type === 'svg') {
      const svg = await renderBlogThumbnailSvg({
        title: resolved.title,
        category: resolved.category,
        parsed,
        lang: resolved.lang,
        slug: resolved.slug,
      });

      return new NextResponse(svg, {
        headers: {
          'Content-Type': 'image/svg+xml',
          'Cache-Control': BLOG_THUMBNAIL_CACHE_CONTROL,
        },
      });
    }

    const response = await renderBlogThumbnailPngResponse({
      title: resolved.title,
      category: resolved.category,
      parsed,
      lang: resolved.lang,
      slug: resolved.slug,
    });

    return response;
  } catch (error) {
    console.error('Error generating blog OG image:', error);
    return NextResponse.json(
      { error: 'Failed to generate image' },
      { status: 500 },
    );
  }
}
