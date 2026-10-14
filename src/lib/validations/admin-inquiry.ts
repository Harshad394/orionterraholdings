import { z } from 'zod';
import { INQUIRY_STATUS } from '@/constants/enums';

export const adminInquiryQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  search: z.string().default(''),
  status: z.enum(['', ...INQUIRY_STATUS]).default(''),
});

export const updateInquiryStatusSchema = z.object({
  status: z.enum(INQUIRY_STATUS, {
    errorMap: () => ({ message: 'Invalid status value' }),
  }),
});

export type AdminInquiryQueryInput = z.infer<typeof adminInquiryQuerySchema>;
export type UpdateInquiryStatusInput = z.infer<typeof updateInquiryStatusSchema>;
