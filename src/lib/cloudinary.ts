import { v2 as cloudinary } from 'cloudinary';

let configured = false;

/**
 * Get the server-side Cloudinary instance, configured lazily.
 * This module must NEVER be imported in client components.
 */
export function getCloudinary() {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error(
      'Cloudinary environment variables are not properly configured. ' +
      'Please check CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET in your .env.local file.'
    );
  }

  if (!configured) {
    cloudinary.config({
      cloud_name: cloudName.trim(),
      api_key: apiKey.trim(),
      api_secret: apiSecret.trim(),
      secure: true,
    });
    configured = true;
  }

  return cloudinary;
}

export const CLOUDINARY_FOLDER = 'orion-terra/properties';
export const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/avif',
  'image/gif',
  'image/heic',
  'image/heif',
  'image/pjpeg',
  'image/x-png',
];
export const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB

/**
 * Upload a Buffer to Cloudinary.
 * Returns { url, publicId }.
 */
export async function uploadImageToCloudinary(
  buffer: Buffer,
  options?: { folder?: string }
): Promise<{ url: string; publicId: string }> {
  const cld = getCloudinary();

  return new Promise((resolve, reject) => {
    const uploadStream = cld.uploader.upload_stream(
      {
        folder: options?.folder ?? CLOUDINARY_FOLDER,
        resource_type: 'image',
        use_filename: false,
        unique_filename: true,
        overwrite: false,
        transformation: [{ quality: 'auto', fetch_format: 'auto' }],
      },
      (error, result) => {
        if (error || !result) {
          const errMsg = error?.message || 'Cloudinary upload returned no result';
          console.error('Cloudinary upload_stream error:', error);
          reject(new Error(errMsg));
          return;
        }
        resolve({
          url: result.secure_url,
          publicId: result.public_id,
        });
      }
    );

    uploadStream.end(buffer);
  });
}

/**
 * Delete an image from Cloudinary by its public ID.
 * Returns true if deleted, false if not found, throws on error.
 */
export async function deleteImageFromCloudinary(publicId: string): Promise<boolean> {
  const cld = getCloudinary();
  const result = await cld.uploader.destroy(publicId, { resource_type: 'image' });
  if (result.result === 'ok') return true;
  if (result.result === 'not found') return false;
  throw new Error(`Cloudinary deletion failed: ${result.result}`);
}
