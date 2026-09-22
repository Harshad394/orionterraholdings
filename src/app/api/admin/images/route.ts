import { NextRequest } from 'next/server';
import { requireAdmin } from '@/lib/requireAdmin';
import {
  ALLOWED_MIME_TYPES,
  MAX_FILE_SIZE_BYTES,
  uploadImageToCloudinary,
  deleteImageFromCloudinary,
} from '@/lib/cloudinary';
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

export async function POST(request: NextRequest) {
  const unauth = await requireAdmin();
  if (unauth) return unauth;

  try {
    const formData = await request.formData();
    const files = formData.getAll('images').filter((item): item is File => item instanceof File);

    if (files.length === 0) {
      return errorResponse('VALIDATION_ERROR', 'At least one image file is required', 400);
    }

    const uploaded = [];
    for (const file of files) {
      uploaded.push(await uploadFile(file));
    }

    return successResponse(uploaded, { status: 201 });
  } catch (error) {
    return errorResponse('UPLOAD_ERROR', getErrorMessage(error), 400);
  }
}

export async function DELETE(request: NextRequest) {
  const unauth = await requireAdmin();
  if (unauth) return unauth;

  try {
    const body = await request.json();
    const publicId = typeof body.publicId === 'string' ? body.publicId.trim() : '';
    if (!publicId) {
      return errorResponse('VALIDATION_ERROR', 'Cloudinary public ID is required', 400);
    }

    await deleteImageFromCloudinary(publicId);
    return successResponse({ deleted: true });
  } catch (error) {
    return errorResponse('IMAGE_DELETE_ERROR', getErrorMessage(error), 400);
  }
}
