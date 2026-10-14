import { NextRequest } from 'next/server';
import { ZodError } from 'zod';
import connectToDatabase from '@/lib/db/mongodb';
import { requireAdmin } from '@/lib/requireAdmin';
import Inquiry from '@/models/Inquiry';
import Property from '@/models/Property';
import { adminInquiryQuerySchema } from '@/lib/validations/admin-inquiry';
import { mapAdminInquiry } from '@/services/admin-inquiry.service';
import { escapeRegex } from '@/services/admin-property.service';
import { errorResponse, successResponse, validationErrorResponse } from '@/lib/api/responses';

export async function GET(request: NextRequest) {
  const unauth = await requireAdmin();
  if (unauth) return unauth;

  try {
    await connectToDatabase();
    const { searchParams } = new URL(request.url);

    const query = adminInquiryQuerySchema.parse({
      page: searchParams.get('page') || 1,
      limit: searchParams.get('limit') || 20,
      search: searchParams.get('search') || '',
      status: searchParams.get('status') || '',
    });

    const filter: Record<string, unknown> = {};

    if (query.status) {
      filter.status = query.status;
    }

    if (query.search.trim()) {
      const regex = new RegExp(escapeRegex(query.search.trim()), 'i');

      // Also search matching properties
      const matchingProperties = await Property.find({
        $or: [{ title: regex }, { propertyId: regex }],
      }).select('_id');

      const propertyIds = matchingProperties.map((p) => p._id);

      filter.$or = [
        { name: regex },
        { phone: regex },
        { email: regex },
        { message: regex },
        { propertyId: { $in: propertyIds } },
      ];
    }

    const skip = (query.page - 1) * query.limit;

    const [inquiries, total, newCount, contactedCount, inProgressCount, closedCount] = await Promise.all([
      Inquiry.find(filter)
        .populate('propertyId', 'title propertyId slug location')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(query.limit)
        .lean()
        .exec(),
      Inquiry.countDocuments(filter),
      Inquiry.countDocuments({ status: 'NEW' }),
      Inquiry.countDocuments({ status: 'CONTACTED' }),
      Inquiry.countDocuments({ status: 'IN_PROGRESS' }),
      Inquiry.countDocuments({ status: 'CLOSED' }),
    ]);

    return successResponse({
      inquiries: inquiries.map(mapAdminInquiry),
      pagination: {
        page: query.page,
        limit: query.limit,
        total,
        totalPages: Math.ceil(total / query.limit) || 1,
      },
      counts: {
        total: await Inquiry.countDocuments({}),
        new: newCount,
        contacted: contactedCount,
        inProgress: inProgressCount,
        closed: closedCount,
      },
    });
  } catch (error) {
    if (error instanceof ZodError) return validationErrorResponse(error);
    console.error('Fetch inquiries error:', error);
    return errorResponse('SERVER_ERROR', 'Unable to fetch buyer inquiries', 500);
  }
}
