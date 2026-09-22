import { NextRequest } from 'next/server';
import { ZodError } from 'zod';
import connectToDatabase from '@/lib/db/mongodb';
import { requireAdmin } from '@/lib/requireAdmin';
import SellerSubmission from '@/models/SellerSubmission';
import { submissionStatusUpdateSchema } from '@/lib/validations/seller-submission';
import { isValidObjectId } from '@/services/admin-property.service';
import { mapAdminSubmission } from '@/services/admin-submission.service';
import { errorResponse, successResponse, validationErrorResponse } from '@/lib/api/responses';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const unauth = await requireAdmin();
  if (unauth) return unauth;

  try {
    const { id } = await params;
    if (!isValidObjectId(id)) return errorResponse('BAD_REQUEST', 'Invalid seller submission ID', 400);

    await connectToDatabase();
    const submission = await SellerSubmission.findById(id).exec();
    if (!submission) return errorResponse('NOT_FOUND', 'Seller submission not found', 404);

    const { status } = submissionStatusUpdateSchema.parse(await request.json());
    submission.status = status;
    await submission.save();

    return successResponse(mapAdminSubmission(submission), { message: 'Submission status updated' });
  } catch (error) {
    if (error instanceof ZodError) return validationErrorResponse(error);
    return errorResponse('STATUS_UPDATE_ERROR', 'Unable to update submission status', 400);
  }
}
