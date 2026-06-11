import sharp from 'sharp';
import { drawCanvas } from '@/lib/og-canvas';
import { buildNativeImageCacheKey } from './cache-key';
import { NATIVE_RENDER_FONT_VERSION } from './fonts';

export const OG_RENDER_DIMENSIONS = {
  width: 1200,
  height: 630,
  dpr: 1,
  format: 'webp' as const,
  contentType: 'image/webp',
  cacheControl: 'public, max-age=86400',
  rendererVersion: 'homepage-og-renderer-v1',
  templateVersion: 'homepage-og-template-v1',
  fontVersion: NATIVE_RENDER_FONT_VERSION,
};

export type RenderOgInput = {
  type?: string;
  title?: string;
  category?: string;
};

export function getOgRenderMetadata() {
  return {
    ...OG_RENDER_DIMENSIONS,
    cacheKey: buildNativeImageCacheKey({
      imageType: 'homepage-og',
      language: 'default',
      slug: 'homepage',
      width: OG_RENDER_DIMENSIONS.width,
      height: OG_RENDER_DIMENSIONS.height,
      dpr: OG_RENDER_DIMENSIONS.dpr,
      format: OG_RENDER_DIMENSIONS.format,
      rendererVersion: OG_RENDER_DIMENSIONS.rendererVersion,
      templateVersion: OG_RENDER_DIMENSIONS.templateVersion,
      fontVersion: OG_RENDER_DIMENSIONS.fontVersion,
    }),
  };
}

export async function renderOgPngBuffer({
  type = 'website',
  title = 'Sealos',
  category,
}: RenderOgInput = {}) {
  return drawCanvas(type, title, category);
}

export async function renderOgWebpBuffer(input: RenderOgInput = {}) {
  const pngBuffer = await renderOgPngBuffer(input);
  return sharp(pngBuffer).webp({ quality: 90 }).toBuffer();
}
