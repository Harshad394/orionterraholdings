import { NextRequest, NextResponse } from 'next/server';
import { getPublishedPropertyBySlug } from '@/services/property.service';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    if (!slug) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'BAD_REQUEST',
            message: 'Property slug parameter is required',
          },
        },
        { status: 400 }
      );
    }

    const property = await getPublishedPropertyBySlug(slug);

    if (!property) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: 'Property opportunity not found or is not currently active',
          },
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: property,
    });
  } catch (error: unknown) {
    console.error('Error fetching property detail:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'SERVER_ERROR',
          message: 'An unexpected error occurred while fetching property details',
        },
      },
      { status: 500 }
    );
  }
}
