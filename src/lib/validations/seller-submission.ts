import { z } from 'zod';
import {
  PROPERTY_TYPES,
  OPPORTUNITY_TYPES,
  LAND_AREA_UNITS,
  DOCUMENTS_AVAILABLE,
  SUBMISSION_STATUS,
} from '@/constants/enums';

export const createSellerSubmissionSchema = z.object({
  sellerName: z
    .string()
    .min(2, { message: 'Seller name must be at least 2 characters long' })
    .max(100, { message: 'Seller name cannot exceed 100 characters' }),
  phone: z
    .string()
    .min(8, { message: 'Phone number must be at least 8 digits' })
    .max(20, { message: 'Phone number cannot exceed 20 characters' }),
  email: z.string().email({ message: 'Invalid email address' }).optional().or(z.literal('')),
  company: z.string().max(100).optional().or(z.literal('')),
  propertyLocation: z
    .string()
    .min(3, { message: 'Property location is required' })
    .max(200, { message: 'Location cannot exceed 200 characters' }),
  city: z.string().min(2, { message: 'City is required' }).max(100),
  state: z.string().min(2, { message: 'State is required' }).max(100),
  landArea: z.coerce.number().positive({ message: 'Land area must be greater than 0' }),
  landAreaUnit: z.enum(LAND_AREA_UNITS),
  propertyType: z.enum(PROPERTY_TYPES),
  opportunityType: z.enum(OPPORTUNITY_TYPES),
  expectedPrice: z.coerce.number().nonnegative().optional().nullable(),
  description: z
    .string()
    .min(1, { message: 'Description is required' })
    .max(2000, { message: 'Description cannot exceed 2000 characters' }),
  images: z.array(z.string().url()).optional().default([]),
  documentsAvailable: z.enum(DOCUMENTS_AVAILABLE).default('Yes'),
  consent: z.boolean().refine((val) => val === true, {
    message: 'You must confirm the consent checkbox to proceed',
  }),
  website: z.string().optional().default(''), // Honeypot field for bot spam protection
});

export const adminSubmissionQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce.number().int().positive().max(100).optional().default(20),
  search: z.string().optional().default(''),
  status: z.enum([...SUBMISSION_STATUS, '']).optional().default(''),
  city: z.string().optional().default(''),
  state: z.string().optional().default(''),
  propertyType: z.enum([...PROPERTY_TYPES, '']).optional().default(''),
  opportunityType: z.enum([...OPPORTUNITY_TYPES, '']).optional().default(''),
});

export const submissionStatusUpdateSchema = z.object({
  status: z.enum(SUBMISSION_STATUS),
});

export type CreateSellerSubmissionInput = z.infer<typeof createSellerSubmissionSchema>;
export type AdminSubmissionQueryInput = z.input<typeof adminSubmissionQuerySchema>;
export type AdminSubmissionQueryOutput = z.output<typeof adminSubmissionQuerySchema>;
