import { readFile } from 'fs/promises';
import { join } from 'path';

export type NativeRenderFontCacheState = 'cold' | 'warm';

export type NativeRenderFontContract = {
  path: string;
  fileName: string;
  name: string;
  family: string;
  weight: 400 | 700 | 900;
  style: 'normal';
  expectedBytes: number;
};

export type NativeRenderFontEntry = {
  name: string;
  data: ArrayBuffer;
  weight: 400 | 700 | 900;
  style: 'normal';
};

export type NativeRenderFontStatus = {
  cacheState: NativeRenderFontCacheState;
  version: typeof NATIVE_RENDER_FONT_VERSION;
  fonts: Array<NativeRenderFontContract & { cachedBytes: number | null }>;
};

export const NATIVE_RENDER_FONT_VERSION = 'native-fonts-2026-06-12';

export const NATIVE_RENDER_FONT_CONTRACT: NativeRenderFontContract[] = [
  {
    path: 'fonts/arial.ttf',
    fileName: 'arial.ttf',
    name: 'Arial',
    family: 'Arial',
    weight: 400,
    style: 'normal',
    expectedBytes: 915212,
  },
  {
    path: 'fonts/arial-bold.ttf',
    fileName: 'arial-bold.ttf',
    name: 'Arial',
    family: 'Arial',
    weight: 700,
    style: 'normal',
    expectedBytes: 57448,
  },
  {
    path: 'fonts/NotoSansSC-Black.ttf',
    fileName: 'NotoSansSC-Black.ttf',
    name: 'Noto Sans SC',
    family: 'Noto Sans SC',
    weight: 900,
    style: 'normal',
    expectedBytes: 10541596,
  },
];

let fontCache: NativeRenderFontEntry[] | null = null;
let lastCacheState: NativeRenderFontCacheState = 'cold';

function toArrayBuffer(buffer: Buffer): ArrayBuffer {
  const arrayBuffer = new ArrayBuffer(buffer.length);
  new Uint8Array(arrayBuffer).set(buffer);
  return arrayBuffer;
}

async function loadFont(contract: NativeRenderFontContract) {
  const buffer = await readFile(join(process.cwd(), contract.path));
  return {
    name: contract.name,
    data: toArrayBuffer(buffer),
    weight: contract.weight,
    style: contract.style,
  };
}

export async function getNativeRenderFonts() {
  if (fontCache) {
    lastCacheState = 'warm';
    return fontCache;
  }

  lastCacheState = 'cold';
  fontCache = await Promise.all(NATIVE_RENDER_FONT_CONTRACT.map(loadFont));
  return fontCache;
}

export function getNativeRenderFontStatus(): NativeRenderFontStatus {
  return {
    cacheState: fontCache ? lastCacheState : 'cold',
    version: NATIVE_RENDER_FONT_VERSION,
    fonts: NATIVE_RENDER_FONT_CONTRACT.map((font, index) => ({
      ...font,
      cachedBytes: fontCache?.[index]?.data.byteLength ?? null,
    })),
  };
}

export function getCanvasFontRegistrations() {
  return NATIVE_RENDER_FONT_CONTRACT.map((font) => ({
    path: join(process.cwd(), font.path),
    family: font.family === 'Noto Sans SC' ? 'Noto Sans' : font.family,
    weight: font.weight === 400 ? undefined : String(font.weight),
  }));
}
