import { NextResponse } from 'next/server';
import {
  OG_RENDER_DIMENSIONS,
  renderOgWebpBuffer,
} from '@/lib/native-rendering/og-renderer';

export async function GET() {
  try {
    const webpBuffer = await renderOgWebpBuffer();

    return new NextResponse(webpBuffer as any, {
      headers: {
        'Content-Type': OG_RENDER_DIMENSIONS.contentType,
        'Cache-Control': OG_RENDER_DIMENSIONS.cacheControl,
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
