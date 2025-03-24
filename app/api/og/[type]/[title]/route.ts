import { drawCanvas } from '@/lib/og-canvas';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { type: string; title: string } },
) {
  try {
    // Extract type and title from params
    const { type, title } = params;

    const decodedTitle = decodeURIComponent(title).toUpperCase();

    // Get category from search params if available
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const formattedCategory = category
      ? decodeURIComponent(category).toUpperCase()
      : undefined;

    const buffer = await drawCanvas(type, decodedTitle, formattedCategory);

    // Return the image as response
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

export const dynamic = 'force-dynamic';
