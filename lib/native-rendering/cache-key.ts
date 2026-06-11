export type NativeImageType = 'homepage-og' | 'blog-thumbnail';
export type NativeImageFormat = 'webp' | 'png' | 'svg';

export type NativeImageCacheKeyInput = {
  imageType: NativeImageType;
  language?: string;
  slug?: string;
  width: number;
  height: number;
  dpr: number;
  format: NativeImageFormat;
  rendererVersion: string;
  templateVersion: string;
  fontVersion: string;
};

const EMPTY_TOKEN = 'default';

function normalizeToken(value: string | undefined) {
  return value && value.trim().length > 0
    ? encodeURIComponent(value.trim())
    : EMPTY_TOKEN;
}

export function buildNativeImageCacheKey(input: NativeImageCacheKeyInput) {
  const dimensions = `${input.width}x${input.height}`;

  return [
    `imageType=${input.imageType}`,
    `language=${normalizeToken(input.language)}`,
    `slug=${normalizeToken(input.slug)}`,
    `dimensions=${dimensions}`,
    `dpr=${input.dpr}`,
    `format=${input.format}`,
    `rendererVersion=${input.rendererVersion}`,
    `templateVersion=${input.templateVersion}`,
    `fontVersion=${input.fontVersion}`,
  ].join('|');
}
