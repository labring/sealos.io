import { ImageResponse } from 'next/og';
import satori from 'satori';
import type { languagesType } from '@/lib/i18n';
import { blog } from '@/lib/source';
import {
  BlogThumbnailTemplate,
  renderScaledThumbnail,
} from '@/app/api/blog/[lang]/[slug]/thumbnail/[format]/template';
import { buildNativeImageCacheKey } from './cache-key';
import {
  getNativeRenderFonts,
  NATIVE_RENDER_FONT_VERSION,
} from './fonts';

export const BLOG_THUMBNAIL_RENDERER_VERSION =
  'blog-thumbnail-renderer-v1';
export const BLOG_THUMBNAIL_TEMPLATE_VERSION = 'blog-thumbnail-template-v1';
export const BLOG_THUMBNAIL_CACHE_CONTROL = 'public, max-age=86400';

export const DEFAULT_WIDTH = 384;
export const DEFAULT_HEIGHT = 256;
export const MIN_DIM = 128;
export const MAX_DIM = 4000;
export const MAX_DPR = 3;

const FORMAT_REGEX =
  /^(?<width>\d{2,5})x(?<height>\d{2,5})(?:@(?<dpr>\d(?:\.\d+)?)x)?\.(?<type>png|svg)$/i;

export const PREGENERATED_FORMATS = [
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

export type BlogThumbnailFormat = {
  type: 'svg' | 'png';
  width: number;
  height: number;
  baseWidth: number;
  baseHeight: number;
  dpr: number;
};

export type BlogThumbnailRenderInput = {
  title: string;
  category?: string;
  parsed: BlogThumbnailFormat;
  lang?: string;
  slug?: string;
};

const SUPPORTED_LANGUAGES: languagesType[] = ['en', 'zh-cn'];

function clampDimension(value: number, fallback: number) {
  return Number.isFinite(value)
    ? Math.min(Math.max(value, MIN_DIM), MAX_DIM)
    : fallback;
}

export function formatBlogThumbnailSegment(
  format: (typeof PREGENERATED_FORMATS)[number],
) {
  const dprSuffix = format.dpr && format.dpr !== 1 ? `@${format.dpr}x` : '';
  return `${format.width}x${format.height}${dprSuffix}.${format.type}`;
}

export function parseBlogThumbnailFormat(
  segment: string,
): BlogThumbnailFormat | null {
  const match = FORMAT_REGEX.exec(segment);
  if (!match?.groups) return null;

  const widthRaw = match.groups.width
    ? Number(match.groups.width)
    : DEFAULT_WIDTH;
  const heightRaw = match.groups.height
    ? Number(match.groups.height)
    : DEFAULT_HEIGHT;
  const type = (match.groups.type?.toLowerCase() ?? 'png') as 'svg' | 'png';
  const dprRaw = match.groups.dpr ? Number(match.groups.dpr) : 1;

  const width = clampDimension(widthRaw, DEFAULT_WIDTH);
  const height = clampDimension(heightRaw, DEFAULT_HEIGHT);
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
  };
}

export function getBlogThumbnailStaticParams() {
  const params: { lang: languagesType; slug: string; format: string }[] = [];

  for (const lang of SUPPORTED_LANGUAGES) {
    const posts = blog.getPages(lang);
    for (const post of posts) {
      const slug = post.slugs[0];

      PREGENERATED_FORMATS.forEach((format) => {
        params.push({
          lang,
          slug,
          format: formatBlogThumbnailSegment(format),
        });
      });
    }
  }

  return params;
}

export function normalizeBlogThumbnailLanguage(lang: string) {
  return SUPPORTED_LANGUAGES.includes(lang as languagesType)
    ? (lang as languagesType)
    : 'en';
}

export function extractBlogThumbnailCategory(dirname: string) {
  const match = dirname.match(/\((.*?)\)/);
  return match ? match[1] : 'uncategorized';
}

export function resolveBlogThumbnailPage({
  lang,
  slug,
}: {
  lang: string;
  slug: string;
}) {
  const normalizedLang = normalizeBlogThumbnailLanguage(lang);
  const page = blog.getPage([slug], normalizedLang);

  if (!page) {
    return null;
  }

  return {
    lang: normalizedLang,
    slug,
    title: page.data.imageTitle || page.data.title || slug,
    category: extractBlogThumbnailCategory(page.file.dirname),
    page,
  };
}

export function getBlogThumbnailCacheKey({
  lang,
  slug,
  parsed,
}: {
  lang: string;
  slug: string;
  parsed: BlogThumbnailFormat;
}) {
  return buildNativeImageCacheKey({
    imageType: 'blog-thumbnail',
    language: lang,
    slug,
    width: parsed.width,
    height: parsed.height,
    dpr: parsed.dpr,
    format: parsed.type,
    rendererVersion: BLOG_THUMBNAIL_RENDERER_VERSION,
    templateVersion: BLOG_THUMBNAIL_TEMPLATE_VERSION,
    fontVersion: NATIVE_RENDER_FONT_VERSION,
  });
}

export function renderBlogThumbnailElement({
  title,
  category,
  parsed,
}: BlogThumbnailRenderInput) {
  return renderScaledThumbnail({
    width: parsed.baseWidth,
    height: parsed.baseHeight,
    dpr: parsed.dpr,
    children: BlogThumbnailTemplate({
      title,
      category,
    }),
  });
}

export async function renderBlogThumbnailSvg(input: BlogThumbnailRenderInput) {
  return satori(renderBlogThumbnailElement(input), {
    width: input.parsed.width,
    height: input.parsed.height,
    fonts: await getNativeRenderFonts(),
  });
}

export async function renderBlogThumbnailPngResponse(
  input: BlogThumbnailRenderInput,
) {
  return new ImageResponse(renderBlogThumbnailElement(input), {
    width: input.parsed.width,
    height: input.parsed.height,
    fonts: await getNativeRenderFonts(),
    headers: {
      'Cache-Control': BLOG_THUMBNAIL_CACHE_CONTROL,
    },
  });
}
