import { NextRequest } from 'next/server';
import { ZodError } from 'zod';
import connectToDatabase from '@/lib/db/mongodb';
import { requireAdmin } from '@/lib/requireAdmin';
import Property from '@/models/Property';
import { propertyStatusUpdateSchema } from '@/lib/validations/property';
import {
  isValidObjectId,
  mapAdminProperty,
  validatePublishableProperty,
} from '@/services/admin-property.service';
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

    const { status } = propertyStatusUpdateSchema.parse(await request.json());
    if (status === 'PUBLISHED') {
      const missing = validatePublishableProperty(property);
      if (missing.length > 0) {
        return errorResponse(
          'PUBLISH_VALIDATION_ERROR',
          `Cannot publish until required fields are complete: ${missing.join(', ')}`,
          400
        );
      }
    }

    property.status = status;
    await property.save();

    return successResponse(mapAdminProperty(property), { message: 'Property status updated' });
  } catch (error) {
    if (error instanceof ZodError) return validationErrorResponse(error);
    return errorResponse('STATUS_UPDATE_ERROR', 'Unable to update property status', 400);
  }
}
