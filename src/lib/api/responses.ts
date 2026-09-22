import { NextResponse } from 'next/server';
import { ZodError } from 'zod';

export function successResponse<T>(data: T, init?: ResponseInit & { message?: string }) {
  return NextResponse.json(
    {
      success: true,
      data,
      ...(init?.message ? { message: init.message } : {}),
    },
    init
  );
}

export function errorResponse(
  code: string,
  message: string,
  status = 400,
  fields?: Record<string, string>
) {
  return NextResponse.json(
    {
      success: false,
      error: {
        code,
        message,
        ...(fields ? { fields } : {}),
      },
    },
    { status }
  );
}

export function validationErrorResponse(error: ZodError) {
  const fields: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = issue.path.join('.') || 'form';
    if (!fields[key]) fields[key] = issue.message;
  }

  return errorResponse('VALIDATION_ERROR', 'Invalid request data', 400, fields);
}

export function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : 'Unexpected error';
}
