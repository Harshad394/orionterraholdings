import { NextRequest } from 'next/server';
import { revalidatePath } from 'next/cache';
import { ZodError } from 'zod';
import connectToDatabase from '@/lib/db/mongodb';
import { requireAdmin } from '@/lib/requireAdmin';
import Property from '@/models/Property';
import { updateAdminPropertySchema } from '@/lib/validations/property';
import {
  buildPropertyPayload,
  deleteCloudinaryImages,
  isValidObjectId,
  mapAdminProperty,
  mapImages,
} from '@/services/admin-property.service';
import {
  errorResponse,
  getErrorMessage,
  successResponse,
  validationErrorResponse,
} from '@/lib/api/responses';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const unauth = await requireAdmin();
  if (unauth) return unauth;

  const { id } = await params;
  if (!isValidObjectId(id)) return errorResponse('BAD_REQUEST', 'Invalid property ID', 400);

  await connectToDatabase();
  const property = await Property.findById(id).exec();
  if (!property) return errorResponse('NOT_FOUND', 'Property not found', 404);

  return successResponse(mapAdminProperty(property));
}

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

    const input = updateAdminPropertySchema.parse(await request.json());

    if (input.propertyId && input.propertyId.trim() !== property.propertyId) {
      const duplicate = await Property.findOne({ propertyId: input.propertyId.trim(), _id: { $ne: id } }).exec();
      if (duplicate) {
        return errorResponse('DUPLICATE_PROPERTY_ID', 'A property with this property ID already exists', 409);
      }
    }

    if (input.images) {
      const oldPublicIds = new Set(mapImages(property).map((image) => image.publicId).filter(Boolean));
      const nextPublicIds = new Set(input.images.map((image) => image.publicId).filter(Boolean));
      const removedPublicIds = [...oldPublicIds].filter((publicId) => !nextPublicIds.has(publicId));
      await deleteCloudinaryImages(removedPublicIds);
    }

    property.set(buildPropertyPayload(input));
    await property.save();

    // Revalidate public cache immediately
    revalidatePath('/properties');
    revalidatePath('/');
    if (property.slug) {
      revalidatePath(`/properties/${property.slug}`);
    }

    return successResponse(mapAdminProperty(property), { message: 'Property updated successfully' });
  } catch (error) {
    if (error instanceof ZodError) return validationErrorResponse(error);
    return errorResponse('PROPERTY_UPDATE_ERROR', getErrorMessage(error), 400);
  }
}

export async function DELETE(
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

    const slug = property.slug;
    await deleteCloudinaryImages(property.imagePublicIds || []);
    await property.deleteOne();

    // Revalidate public cache immediately
    revalidatePath('/properties');
    revalidatePath('/');
    if (slug) {
      revalidatePath(`/properties/${slug}`);
    }

    return successResponse({ deleted: true });
  } catch (error) {
    return errorResponse('PROPERTY_DELETE_ERROR', getErrorMessage(error), 400);
  }
}
