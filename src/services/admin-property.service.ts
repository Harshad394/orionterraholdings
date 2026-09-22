import mongoose from 'mongoose';
import Property, { IProperty } from '@/models/Property';
import SellerSubmission from '@/models/SellerSubmission';
import { CreateAdminPropertyInput, UpdateAdminPropertyInput } from '@/lib/validations/property';
import { deleteImageFromCloudinary } from '@/lib/cloudinary';

export interface AdminImageItem {
  url: string;
  publicId: string;
}

export interface AdminPropertyDTO {
  id: string;
  propertyId: string;
  slug: string;
  title: string;
  description: string;
  location: {
    address?: string;
    city: string;
    state: string;
    country: string;
    latitude?: number;
    longitude?: number;
  };
  landArea: number;
  landAreaUnit: string;
  propertyType: string;
  opportunityType: string;
  price?: number | null;
  priceVisibility: string;
  images: AdminImageItem[];
  featured: boolean;
  status: string;
  sellerSubmissionId?: string;
  createdAt: string;
  updatedAt: string;
}

export function isValidObjectId(id: string) {
  return mongoose.Types.ObjectId.isValid(id);
}

export function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 90);
}

export async function ensureUniqueSlug(title: string, excludeId?: string) {
  const base = slugify(title) || 'property';
  let slug = base;
  let counter = 2;

  while (true) {
    const query: Record<string, unknown> = { slug };
    if (excludeId) query._id = { $ne: excludeId };
    const existing = await Property.exists(query);
    if (!existing) return slug;
    slug = `${base}-${counter}`;
    counter += 1;
  }
}

export function mapImages(doc: Pick<IProperty, 'images' | 'imagePublicIds'>): AdminImageItem[] {
  const urls = doc.images || [];
  const publicIds = doc.imagePublicIds || [];
  return urls.map((url, index) => ({
    url,
    publicId: publicIds[index] || '',
  }));
}

export function mapAdminProperty(doc: IProperty): AdminPropertyDTO {
  return {
    id: doc._id.toString(),
    propertyId: doc.propertyId,
    slug: doc.slug,
    title: doc.title,
    description: doc.description,
    location: {
      address: doc.location.address,
      city: doc.location.city,
      state: doc.location.state,
      country: doc.location.country,
      latitude: doc.location.latitude,
      longitude: doc.location.longitude,
    },
    landArea: doc.landArea,
    landAreaUnit: doc.landAreaUnit,
    propertyType: doc.propertyType,
    opportunityType: doc.opportunityType,
    price: doc.price,
    priceVisibility: doc.priceVisibility,
    images: mapImages(doc),
    featured: doc.featured,
    status: doc.status,
    sellerSubmissionId: doc.sellerSubmissionId ? doc.sellerSubmissionId.toString() : undefined,
    createdAt: doc.createdAt.toISOString(),
    updatedAt: doc.updatedAt.toISOString(),
  };
}

export async function validateSellerSubmissionForConversion(sellerSubmissionId?: string | null) {
  if (!sellerSubmissionId) return null;
  if (!isValidObjectId(sellerSubmissionId)) {
    throw new Error('Invalid seller submission ID');
  }

  const submission = await SellerSubmission.findById(sellerSubmissionId).exec();
  if (!submission) {
    throw new Error('Seller submission not found');
  }
  if (submission.status !== 'APPROVED') {
    throw new Error('Only approved seller submissions can be converted into properties');
  }

  const existing = await Property.findOne({ sellerSubmissionId }).exec();
  if (existing) {
    throw new Error('This seller submission has already been converted into a property');
  }

  return submission;
}

export function buildPropertyPayload(input: CreateAdminPropertyInput | UpdateAdminPropertyInput) {
  const images = input.images ?? [];

  return {
    ...(input.title !== undefined ? { title: input.title.trim() } : {}),
    ...(input.propertyId !== undefined ? { propertyId: input.propertyId.trim() } : {}),
    ...(input.description !== undefined ? { description: input.description.trim() } : {}),
    ...(input.location !== undefined
      ? {
          location: {
            address: input.location.address ? input.location.address.trim() : undefined,
            city: input.location.city.trim(),
            state: input.location.state.trim(),
            country: input.location.country?.trim() || 'India',
            latitude: input.location.latitude ?? undefined,
            longitude: input.location.longitude ?? undefined,
          },
        }
      : {}),
    ...(input.landArea !== undefined ? { landArea: input.landArea } : {}),
    ...(input.landAreaUnit !== undefined ? { landAreaUnit: input.landAreaUnit } : {}),
    ...(input.propertyType !== undefined ? { propertyType: input.propertyType } : {}),
    ...(input.opportunityType !== undefined ? { opportunityType: input.opportunityType } : {}),
    ...(input.price !== undefined ? { price: input.price ?? null } : {}),
    ...(input.priceVisibility !== undefined ? { priceVisibility: input.priceVisibility } : {}),
    ...(input.images !== undefined
      ? {
          images: images.map((image) => image.url),
          imagePublicIds: images.map((image) => image.publicId || ''),
        }
      : {}),
    ...(input.featured !== undefined ? { featured: input.featured } : {}),
    ...(input.status !== undefined ? { status: input.status } : {}),
    ...(input.sellerSubmissionId ? { sellerSubmissionId: input.sellerSubmissionId } : {}),
  };
}

export function validatePublishableProperty(doc: IProperty) {
  const missing: string[] = [];
  if (!doc.title) missing.push('title');
  if (!doc.slug) missing.push('slug');
  if (!doc.propertyId) missing.push('property ID');
  if (!doc.description) missing.push('description');
  if (!doc.location?.city || !doc.location?.state || !doc.location?.country) missing.push('location');
  if (!doc.landArea) missing.push('land area');
  if (!doc.propertyType) missing.push('property type');
  if (!doc.opportunityType) missing.push('opportunity type');
  return missing;
}

export async function deleteCloudinaryImages(publicIds: string[]) {
  const ids = publicIds.filter(Boolean);
  for (const publicId of ids) {
    await deleteImageFromCloudinary(publicId);
  }
}
