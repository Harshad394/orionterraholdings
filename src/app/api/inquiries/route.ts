import { NextRequest, NextResponse } from 'next/server';
import { createBuyerInquiry } from '@/services/seller-submission.service';
import { ZodError } from 'zod';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const inquiry = await createBuyerInquiry(body);

    return NextResponse.json(
      {
        success: true,
        data: inquiry,
        message: 'Thank you. Our team will contact you regarding this opportunity.',
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    if (error instanceof ZodError) {
      const fieldErrors: Record<string, string> = {};
      error.errors.forEach((err) => {
        if (err.path.length > 0) {
          fieldErrors[err.path[0].toString()] = err.message;
        }
      });

      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid inquiry form input',
            fields: fieldErrors,
          },
        },
        { status: 400 }
      );
    }

    if (error instanceof Error && error.message.includes('Property not found')) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: error.message,
          },
        },
        { status: 404 }
      );
    }

    console.error('Error creating buyer inquiry:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'SERVER_ERROR',
          message: 'An error occurred while submitting your inquiry',
        },
      },
      { status: 500 }
    );
  }
}
