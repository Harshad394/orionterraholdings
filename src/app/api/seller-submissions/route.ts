import { NextRequest, NextResponse } from 'next/server';
import { createSellerSubmission } from '@/services/seller-submission.service';
import { ZodError } from 'zod';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const submission = await createSellerSubmission(body);

    return NextResponse.json(
      {
        success: true,
        data: submission,
        message: 'Your property details have been submitted successfully. Our team will review the information and contact you.',
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
            message: 'Invalid property submission input',
            fields: fieldErrors,
          },
        },
        { status: 400 }
      );
    }

    console.error('Error creating seller submission:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'SERVER_ERROR',
          message: 'An error occurred while saving your property submission',
        },
      },
      { status: 500 }
    );
  }
}
