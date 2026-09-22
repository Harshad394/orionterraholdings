import { z } from 'zod';
import {
  LAND_AREA_UNITS,
  PROPERTY_TYPES,
  OPPORTUNITY_TYPES,
  PRICE_VISIBILITY,
  PROPERTY_STATUS,
} from '@/constants/enums';

const imageItemSchema = z.object({
  url: z.string().url({ message: 'Image URL must be valid' }),
  publicId: z.string().trim().optional().default(''),
});

const optionalNumber = z.preprocess((value) => {
  if (value === '' || value === null || value === undefined) return null;
  return value;
}, z.coerce.number().nonnegative().nullable().optional());

export const propertyQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce.number().int().positive().max(50).optional().default(12),
  search: z.string().optional().default(''),
  city: z.string().optional().default(''),
  state: z.string().optional().default(''),
  propertyType: z.enum([...PROPERTY_TYPES, '']).optional().default(''),
  opportunityType: z.enum([...OPPORTUNITY_TYPES, '']).optional().default(''),
  priceVisibility: z.enum([...PRICE_VISIBILITY, '']).optional().default(''),
  featured: z
    .boolean()
    .or(z.string().transform((val) => val === 'true'))
    .optional(),
  minArea: z.coerce.number().optional(),
  maxArea: z.coerce.number().optional(),
});

export const adminPropertyQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce.number().int().positive().max(100).optional().default(20),
  search: z.string().optional().default(''),
  status: z.enum([...PROPERTY_STATUS, '']).optional().default(''),
  city: z.string().optional().default(''),
  propertyType: z.enum([...PROPERTY_TYPES, '']).optional().default(''),
  opportunityType: z.enum([...OPPORTUNITY_TYPES, '']).optional().default(''),
});

export const createAdminPropertySchema = z.object({
  title: z.string().min(3, 'Title is required').max(180),
  propertyId: z.string().min(3, 'Property ID is required').max(60),
  description: z.string().min(10, 'Description is required').max(5000),
  location: z.object({
    address: z.string().max(250).optional().or(z.literal('')),
    city: z.string().min(2, 'City is required').max(100),
    state: z.string().min(2, 'State is required').max(100),
    country: z.string().min(2).max(100).default('India'),
    latitude: optionalNumber,
    longitude: optionalNumber,
  }),
  landArea: z.coerce.number().positive('Land area must be greater than 0'),
  landAreaUnit: z.enum(LAND_AREA_UNITS),
  propertyType: z.enum(PROPERTY_TYPES),
  opportunityType: z.enum(OPPORTUNITY_TYPES),
  price: optionalNumber,
  priceVisibility: z.enum(PRICE_VISIBILITY).default('CONTACT'),
  images: z.array(imageItemSchema).optional().default([]),
  featured: z.boolean().optional().default(false),
  status: z.enum(PROPERTY_STATUS).optional().default('DRAFT'),
  sellerSubmissionId: z.string().optional().nullable(),
});

export const updateAdminPropertySchema = createAdminPropertySchema.partial().extend({
  title: z.string().min(3).max(180).optional(),
  propertyId: z.string().min(3).max(60).optional(),
  description: z.string().min(10).max(5000).optional(),
});

export const propertyStatusUpdateSchema = z.object({
  status: z.enum(PROPERTY_STATUS),
});

export const propertyFeaturedUpdateSchema = z.object({
  featured: z.boolean(),
});

export const imageUploadResponseSchema = imageItemSchema;

export type PropertyQueryInput = z.input<typeof propertyQuerySchema>;
export type PropertyQueryOutput = z.output<typeof propertyQuerySchema>;
export type AdminPropertyQueryInput = z.input<typeof adminPropertyQuerySchema>;
export type AdminPropertyQueryOutput = z.output<typeof adminPropertyQuerySchema>;
export type CreateAdminPropertyInput = z.output<typeof createAdminPropertySchema>;
export type UpdateAdminPropertyInput = z.output<typeof updateAdminPropertySchema>;
