import { NextRequest } from 'next/server';
import connectToDatabase from '@/lib/db/mongodb';
import { requireAdmin } from '@/lib/requireAdmin';
import {
  ALLOWED_MIME_TYPES,
  MAX_FILE_SIZE_BYTES,
  uploadImageToCloudinary,
  deleteImageFromCloudinary,
} from '@/lib/cloudinary';
import Property from '@/models/Property';
import { isValidObjectId, mapAdminProperty, mapImages } from '@/services/admin-property.service';
import { errorResponse, getErrorMessage, successResponse } from '@/lib/api/responses';

export const runtime = 'nodejs';

async function uploadFile(file: File) {
  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    throw new Error(`${file.name} is not a supported image type`);
  }
  if (file.size > MAX_FILE_SIZE_BYTES) {
    throw new Error(`${file.name} exceeds the 10 MB image limit`);
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  return uploadImageToCloudinary(buffer);
}

export async function POST(
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

    const formData = await request.formData();
    const files = formData.getAll('images').filter((item): item is File => item instanceof File);
    if (files.length === 0) {
      return errorResponse('VALIDATION_ERROR', 'At least one image file is required', 400);
    }

    const uploaded = [];
    for (const file of files) {
      uploaded.push(await uploadFile(file));
    }

    property.images = [...(property.images || []), ...uploaded.map((image) => image.url)];
    property.imagePublicIds = [
      ...(property.imagePublicIds || []),
      ...uploaded.map((image) => image.publicId),
    ];
    await property.save();

    return successResponse(mapAdminProperty(property), {
      status: 201,
      message: 'Images uploaded successfully',
    });
  } catch (error) {
    return errorResponse('UPLOAD_ERROR', getErrorMessage(error), 400);
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

    const body = await request.json();
    const index = Number(body.index);
    if (!Number.isInteger(index) || index < 0) {
      return errorResponse('VALIDATION_ERROR', 'Valid image index is required', 400);
    }

    await connectToDatabase();
    const property = await Property.findById(id).exec();
    if (!property) return errorResponse('NOT_FOUND', 'Property not found', 404);

    const images = mapImages(property);
    const image = images[index];
    if (!image) return errorResponse('NOT_FOUND', 'Image not found on this property', 404);

    if (image.publicId) {
      await deleteImageFromCloudinary(image.publicId);
    }

    images.splice(index, 1);
    property.images = images.map((item) => item.url);
    property.imagePublicIds = images.map((item) => item.publicId || '');
    await property.save();

    return successResponse(mapAdminProperty(property), { message: 'Image removed successfully' });
  } catch (error) {
    return errorResponse('IMAGE_DELETE_ERROR', getErrorMessage(error), 400);
  }
}
