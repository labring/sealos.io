import { ImageResponse } from 'next/og';
import { NextResponse, type NextRequest } from 'next/server';
import satori, { type SatoriOptions } from 'satori';

import { blog } from '@/lib/source';
import { languagesType } from '@/lib/i18n';
import { BlogThumbnailTemplate, renderScaledThumbnail } from './template';

export const runtime = 'edge';

const DEFAULT_WIDTH = 384;
const DEFAULT_HEIGHT = 256;
const MIN_DIM = 128;
const MAX_DIM = 4000;
const MAX_DPR = 3;
const FORMAT_REGEX =
  /^(?<type>svg|png)(?:@(?<width>\d{2,5})x(?<height>\d{2,5}))?(?:@(?<dpr>\d(?:\.\d+)?)x)?$/i;
const PREGENERATED_FORMATS = [
  {
    type: 'svg' as const,
    width: DEFAULT_WIDTH,
    height: DEFAULT_HEIGHT,
    dpr: 1,
  },
  {
    type: 'svg' as const,
    width: 400,
    height: 210,
    dpr: 1,
  },
  {
    type: 'png' as const,
    width: 1200,
    height: 630,
    dpr: 3,
  },
];

export function generateStaticParams() {
  const params: { lang: languagesType; slug: string; format: string }[] = [];

  for (const lang of ['en', 'zh-cn'] as languagesType[]) {
    const posts = blog.getPages(lang);
    for (const post of posts) {
      const slug = post.slugs[0];

      PREGENERATED_FORMATS.forEach((format) => {
        const dprSuffix =
          format.dpr && format.dpr !== 1 ? `@${format.dpr}x` : '';
        params.push({
          lang,
          slug,
          format: `${format.type}@${format.width}x${format.height}${dprSuffix}`,
        });
      });
    }
  }

  return params;
}

const fontRegular = fetch(
  new URL('../../../../../../../fonts/arial.ttf', import.meta.url),
).then((res) => res.arrayBuffer());
const fontBold = fetch(
  new URL('../../../../../../../fonts/arial-bold.ttf', import.meta.url),
).then((res) => res.arrayBuffer());
const fontHan = fetch(
  new URL('../../../../../../../fonts/NotoSansSC-Black.ttf', import.meta.url),
).then((res) => res.arrayBuffer());

async function getFonts(): Promise<SatoriOptions['fonts']> {
  const [regular, bold, han] = await Promise.all([
    fontRegular,
    fontBold,
    fontHan,
  ]);
  return [
    {
      name: 'Arial',
      data: regular,
      weight: 400 as const,
      style: 'normal' as const,
    },
    {
      name: 'Arial',
      data: bold,
      weight: 700 as const,
      style: 'normal' as const,
    },
    {
      name: 'Noto Sans SC',
      data: han,
      weight: 900 as const,
      style: 'normal' as const,
    },
  ];
}

const extractCategory = (dirname: string) => {
  const match = dirname.match(/\((.*?)\)/);
  return match ? match[1] : 'uncategorized';
};

function parseFormatSegment(segment: string) {
  const match = FORMAT_REGEX.exec(segment);
  if (!match?.groups) return null;

  const type = (match.groups.type?.toLowerCase() ?? 'png') as 'svg' | 'png';
  const widthRaw = match.groups.width
    ? Number(match.groups.width)
    : DEFAULT_WIDTH;
  const heightRaw = match.groups.height
    ? Number(match.groups.height)
    : DEFAULT_HEIGHT;
  const dprRaw = match.groups.dpr ? Number(match.groups.dpr) : 1;

  const clamp = (value: number) =>
    Number.isFinite(value)
      ? Math.min(Math.max(value, MIN_DIM), MAX_DIM)
      : DEFAULT_WIDTH;

  const width = clamp(widthRaw);
  const height = clamp(heightRaw);
  const dpr = Number.isFinite(dprRaw)
    ? Math.min(Math.max(dprRaw, 1), MAX_DPR)
    : 1;

  const baseWidth = Math.max(Math.round(width / dpr), MIN_DIM);
  const baseHeight = Math.max(Math.round(height / dpr), MIN_DIM);

  return {
    type,
    width,
    height,
    baseWidth,
    baseHeight,
    dpr,
  } as const;
}

export async function GET(
  _request: NextRequest,
  { params }: { params: { lang: string; slug: string; format: string } },
) {
  try {
    const parsed = parseFormatSegment(decodeURIComponent(params.format));
    if (!parsed) {
      return NextResponse.json(
        {
          error:
            'Invalid format. Use png|svg@<width>x<height>[@dpr] with width/height 128-4000 and dpr up to 3.',
        },
        { status: 400 },
      );
    }

    const requestedLang = (params.lang || 'en') as languagesType;
    const lang = (['en', 'zh-cn'] as languagesType[]).includes(requestedLang)
      ? requestedLang
      : 'en';
    const slug = decodeURIComponent(params.slug);
    const page = blog.getPage([slug], lang);

    if (!page) {
      return NextResponse.json(
        { error: 'Blog post not found' },
        { status: 404 },
      );
    }

    const title = page.data.imageTitle || page.data.title || slug;
    const category = extractCategory(page.file.dirname);

    const scaledContent = renderScaledThumbnail({
      width: parsed.baseWidth,
      height: parsed.baseHeight,
      dpr: parsed.dpr,
      children: BlogThumbnailTemplate({
        title,
        category,
      }),
    });

    if (parsed.type === 'svg') {
      const svg = await satori(scaledContent, {
        width: parsed.width,
        height: parsed.height,
        fonts: await getFonts(),
      });

      return new NextResponse(svg, {
        headers: {
          'Content-Type': 'image/svg+xml',
          'Cache-Control': 'public, max-age=86400',
        },
      });
    }

    const response = new ImageResponse(scaledContent, {
      width: parsed.width,
      height: parsed.height,
      fonts: await getFonts(),
      headers: {
        'Cache-Control': 'public, max-age=86400',
      },
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
