import { z } from 'zod';

export const createInquirySchema = z.object({
  propertyId: z.string().min(1, { message: 'Property ID is required' }),
  name: z
    .string()
    .min(2, { message: 'Full name must be at least 2 characters long' })
    .max(100, { message: 'Name cannot exceed 100 characters' }),
  phone: z
    .string()
    .min(8, { message: 'Phone number must be at least 8 digits' })
    .max(20, { message: 'Phone number cannot exceed 20 characters' }),
  email: z.string().email({ message: 'Invalid email address' }).optional().or(z.literal('')),
  message: z
    .string()
    .min(5, { message: 'Message must be at least 5 characters long' })
    .max(1000, { message: 'Message cannot exceed 1000 characters' }),
  website: z.string().optional().default(''), // Honeypot field for bot spam protection
});

export type CreateInquiryInput = z.infer<typeof createInquirySchema>;
