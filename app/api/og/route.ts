import { drawCanvas } from '@/lib/og-canvas';
import { NextRequest, NextResponse } from 'next/server';
import sharp from 'sharp';

export async function GET() {
  try {
    const homepageType = 'website';
    const homepageTitle = 'Sealos';
    const ogCategory = undefined;

    const canvasBuffer = await drawCanvas(
      homepageType,
      homepageTitle,
      ogCategory,
    );

    // All major platforms support WebP Open Graph images.
    const webpBuffer = await sharp(canvasBuffer)
      .webp({ quality: 90 })
      .toBuffer();

    return new NextResponse(webpBuffer as any, {
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
