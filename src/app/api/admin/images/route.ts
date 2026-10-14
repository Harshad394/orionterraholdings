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

function isValidImageType(file: File): boolean {
  const mime = file.type ? file.type.toLowerCase() : '';
  if (ALLOWED_MIME_TYPES.includes(mime)) return true;

  // Extension check fallback
  const ext = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
  const validExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.avif', '.gif', '.heic', '.heif'];
  return validExtensions.includes(ext);
}

async function uploadFile(file: File) {
  if (!isValidImageType(file)) {
    throw new Error(`${file.name} is not a supported image format. (Supported: JPG, PNG, WEBP, AVIF, GIF)`);
  }
  if (file.size > MAX_FILE_SIZE_BYTES) {
    throw new Error(`${file.name} exceeds the 10 MB maximum image size limit`);
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
      return errorResponse('VALIDATION_ERROR', 'At least one image file is required for upload', 400);
    }

    const uploaded = [];
    for (const file of files) {
      uploaded.push(await uploadFile(file));
    }

    return successResponse(uploaded, { status: 201 });
  } catch (error) {
    const rawMsg = getErrorMessage(error);
    console.error('Image Upload API Exception:', rawMsg);

    let clientMsg = rawMsg;
    if (rawMsg.includes('cloud_name mismatch') || rawMsg.includes('Must supply api_key') || rawMsg.includes('Invalid API key')) {
      clientMsg = 'Cloudinary API configuration mismatch. Please check CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET in your Cloudinary Dashboard.';
    }

    return errorResponse('UPLOAD_ERROR', clientMsg, 400);
  }
}

export async function DELETE(request: NextRequest) {
  const unauth = await requireAdmin();
  if (unauth) return unauth;

  try {
    const body = await request.json();
    const publicId = typeof body.publicId === 'string' ? body.publicId.trim() : '';
    if (!publicId) {
      return errorResponse('VALIDATION_ERROR', 'Cloudinary public ID is required for deletion', 400);
    }

    await deleteImageFromCloudinary(publicId);
    return successResponse({ deleted: true });
  } catch (error) {
    return errorResponse('IMAGE_DELETE_ERROR', getErrorMessage(error), 400);
  }
}
