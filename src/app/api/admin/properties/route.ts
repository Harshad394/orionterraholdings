import { NextRequest } from 'next/server';
import { ZodError } from 'zod';
import connectToDatabase from '@/lib/db/mongodb';
import { requireAdmin } from '@/lib/requireAdmin';
import Property from '@/models/Property';
import {
  adminPropertyQuerySchema,
  createAdminPropertySchema,
} from '@/lib/validations/property';
import {
  buildPropertyPayload,
  ensureUniqueSlug,
  escapeRegex,
  mapAdminProperty,
  validateSellerSubmissionForConversion,
} from '@/services/admin-property.service';
import {
  errorResponse,
  getErrorMessage,
  successResponse,
  validationErrorResponse,
} from '@/lib/api/responses';

export async function GET(request: NextRequest) {
  const unauth = await requireAdmin();
  if (unauth) return unauth;

  try {
    await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const query = adminPropertyQuerySchema.parse({
      page: searchParams.get('page') || 1,
      limit: searchParams.get('limit') || 20,
      search: searchParams.get('search') || '',
      status: searchParams.get('status') || '',
      city: searchParams.get('city') || '',
      propertyType: searchParams.get('propertyType') || '',
      opportunityType: searchParams.get('opportunityType') || '',
    });

    const filter: Record<string, unknown> = {};
    if (query.search.trim()) {
      const regex = new RegExp(escapeRegex(query.search.trim()), 'i');
      filter.$or = [{ title: regex }, { propertyId: regex }, { slug: regex }];
    }
    if (query.status) filter.status = query.status;
    if (query.city.trim()) filter['location.city'] = new RegExp(`^${escapeRegex(query.city.trim())}$`, 'i');
    if (query.propertyType) filter.propertyType = query.propertyType;
    if (query.opportunityType) filter.opportunityType = query.opportunityType;

    const skip = (query.page - 1) * query.limit;
    const [properties, total] = await Promise.all([
      Property.find(filter).sort({ createdAt: -1 }).skip(skip).limit(query.limit).exec(),
      Property.countDocuments(filter),
    ]);

    return successResponse({
      properties: properties.map(mapAdminProperty),
      pagination: {
        page: query.page,
        limit: query.limit,
        total,
        totalPages: Math.ceil(total / query.limit) || 1,
      },
    });
  } catch (error) {
    if (error instanceof ZodError) return validationErrorResponse(error);
    return errorResponse('SERVER_ERROR', 'Unable to fetch properties', 500);
  }
}

export async function POST(request: NextRequest) {
  const unauth = await requireAdmin();
  if (unauth) return unauth;

  try {
    await connectToDatabase();
    const input = createAdminPropertySchema.parse(await request.json());

    await validateSellerSubmissionForConversion(input.sellerSubmissionId);

    const duplicate = await Property.findOne({ propertyId: input.propertyId.trim() }).exec();
    if (duplicate) {
      return errorResponse('DUPLICATE_PROPERTY_ID', 'A property with this property ID already exists', 409);
    }

    const slug = await ensureUniqueSlug(input.title);
    const property = await Property.create({
      ...buildPropertyPayload(input),
      slug,
    });

    return successResponse(mapAdminProperty(property), {
      status: 201,
      message: 'Property created successfully',
    });
  } catch (error) {
    if (error instanceof ZodError) return validationErrorResponse(error);
    return errorResponse('PROPERTY_CREATE_ERROR', getErrorMessage(error), 400);
  }
}
