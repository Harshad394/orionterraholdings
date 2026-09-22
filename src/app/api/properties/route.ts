import { NextRequest, NextResponse } from 'next/server';
import { getPublishedProperties } from '@/services/property.service';
import { propertyQuerySchema } from '@/lib/validations/property';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const rawParams = {
      page: searchParams.get('page') || 1,
      limit: searchParams.get('limit') || 12,
      search: searchParams.get('search') || '',
      city: searchParams.get('city') || '',
      state: searchParams.get('state') || '',
      propertyType: searchParams.get('propertyType') || '',
      opportunityType: searchParams.get('opportunityType') || '',
      priceVisibility: searchParams.get('priceVisibility') || '',
      featured: searchParams.get('featured') || undefined,
      minArea: searchParams.get('minArea') || undefined,
      maxArea: searchParams.get('maxArea') || undefined,
    };

    const validatedQuery = propertyQuerySchema.parse(rawParams);
    const result = await getPublishedProperties(validatedQuery);

    return NextResponse.json({
      success: true,
      data: result.data,
      pagination: result.pagination,
    });
  } catch (error: unknown) {
    console.error('Error fetching published properties:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'SERVER_ERROR',
          message: 'An unexpected error occurred while fetching properties',
        },
      },
      { status: 500 }
    );
  }
}
