import { NextRequest } from 'next/server';
import { ZodError } from 'zod';
import connectToDatabase from '@/lib/db/mongodb';
import { requireAdmin } from '@/lib/requireAdmin';
import SellerSubmission from '@/models/SellerSubmission';
import { adminSubmissionQuerySchema } from '@/lib/validations/seller-submission';
import { escapeRegex } from '@/services/admin-property.service';
import { mapAdminSubmission } from '@/services/admin-submission.service';
import { errorResponse, successResponse, validationErrorResponse } from '@/lib/api/responses';

export async function GET(request: NextRequest) {
  const unauth = await requireAdmin();
  if (unauth) return unauth;

  try {
    await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const query = adminSubmissionQuerySchema.parse({
      page: searchParams.get('page') || 1,
      limit: searchParams.get('limit') || 20,
      search: searchParams.get('search') || '',
      status: searchParams.get('status') || '',
      city: searchParams.get('city') || '',
      state: searchParams.get('state') || '',
      propertyType: searchParams.get('propertyType') || '',
      opportunityType: searchParams.get('opportunityType') || '',
    });

    const filter: Record<string, unknown> = {};
    if (query.search.trim()) {
      const regex = new RegExp(escapeRegex(query.search.trim()), 'i');
      filter.$or = [
        { sellerName: regex },
        { phone: regex },
        { email: regex },
        { propertyLocation: regex },
        { city: regex },
        { state: regex },
      ];
    }
    if (query.status) filter.status = query.status;
    if (query.city.trim()) filter.city = new RegExp(`^${escapeRegex(query.city.trim())}$`, 'i');
    if (query.state.trim()) filter.state = new RegExp(`^${escapeRegex(query.state.trim())}$`, 'i');
    if (query.propertyType) filter.propertyType = query.propertyType;
    if (query.opportunityType) filter.opportunityType = query.opportunityType;

    const skip = (query.page - 1) * query.limit;
    const [submissions, total] = await Promise.all([
      SellerSubmission.find(filter).sort({ createdAt: -1 }).skip(skip).limit(query.limit).exec(),
      SellerSubmission.countDocuments(filter),
    ]);

    return successResponse({
      submissions: submissions.map(mapAdminSubmission),
      pagination: {
        page: query.page,
        limit: query.limit,
        total,
        totalPages: Math.ceil(total / query.limit) || 1,
      },
    });
  } catch (error) {
    if (error instanceof ZodError) return validationErrorResponse(error);
    return errorResponse('SERVER_ERROR', 'Unable to fetch seller submissions', 500);
  }
}
