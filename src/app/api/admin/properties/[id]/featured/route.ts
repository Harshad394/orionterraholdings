import { NextRequest } from 'next/server';
import { ZodError } from 'zod';
import connectToDatabase from '@/lib/db/mongodb';
import { requireAdmin } from '@/lib/requireAdmin';
import Property from '@/models/Property';
import { propertyFeaturedUpdateSchema } from '@/lib/validations/property';
import { isValidObjectId, mapAdminProperty } from '@/services/admin-property.service';
import { errorResponse, successResponse, validationErrorResponse } from '@/lib/api/responses';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const unauth = await requireAdmin();
  if (unauth) return unauth;

  try {
    const { id } = await params;
    if (!isValidObjectId(id)) return errorResponse('BAD_REQUEST', 'Invalid property ID', 400);

    await connectToDatabase();
    const property = await Property.findById(id).exec();
    if (!property) return errorResponse('NOT_FOUND', 'Property not found', 404);

    const { featured } = propertyFeaturedUpdateSchema.parse(await request.json());
    property.featured = featured;
    await property.save();

    return successResponse(mapAdminProperty(property), { message: 'Featured status updated' });
  } catch (error) {
    if (error instanceof ZodError) return validationErrorResponse(error);
    return errorResponse('FEATURED_UPDATE_ERROR', 'Unable to update featured status', 400);
  }
}
