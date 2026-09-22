import { NextRequest } from 'next/server';
import connectToDatabase from '@/lib/db/mongodb';
import { requireAdmin } from '@/lib/requireAdmin';
import SellerSubmission from '@/models/SellerSubmission';
import Property from '@/models/Property';
import { isValidObjectId, mapAdminProperty } from '@/services/admin-property.service';
import { mapAdminSubmission } from '@/services/admin-submission.service';
import { errorResponse, successResponse } from '@/lib/api/responses';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const unauth = await requireAdmin();
  if (unauth) return unauth;

  const { id } = await params;
  if (!isValidObjectId(id)) return errorResponse('BAD_REQUEST', 'Invalid seller submission ID', 400);

  await connectToDatabase();
  const submission = await SellerSubmission.findById(id).exec();
  if (!submission) return errorResponse('NOT_FOUND', 'Seller submission not found', 404);

  const convertedProperty = await Property.findOne({ sellerSubmissionId: id }).exec();

  return successResponse({
    submission: mapAdminSubmission(submission),
    convertedProperty: convertedProperty ? mapAdminProperty(convertedProperty) : null,
  });
}
