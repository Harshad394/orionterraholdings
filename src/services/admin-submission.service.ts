import { ISellerSubmission } from '@/models/SellerSubmission';

export interface AdminSubmissionDTO {
  id: string;
  sellerName: string;
  phone: string;
  email?: string;
  company?: string;
  propertyLocation: string;
  city: string;
  state: string;
  landArea: number;
  landAreaUnit: string;
  propertyType: string;
  opportunityType: string;
  expectedPrice?: number | null;
  description: string;
  images: string[];
  documentsAvailable: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export function mapAdminSubmission(doc: ISellerSubmission): AdminSubmissionDTO {
  return {
    id: doc._id.toString(),
    sellerName: doc.sellerName,
    phone: doc.phone,
    email: doc.email,
    company: doc.company,
    propertyLocation: doc.propertyLocation,
    city: doc.city,
    state: doc.state,
    landArea: doc.landArea,
    landAreaUnit: doc.landAreaUnit,
    propertyType: doc.propertyType,
    opportunityType: doc.opportunityType,
    expectedPrice: doc.expectedPrice,
    description: doc.description,
    images: doc.images || [],
    documentsAvailable: doc.documentsAvailable,
    status: doc.status,
    createdAt: doc.createdAt.toISOString(),
    updatedAt: doc.updatedAt.toISOString(),
  };
}
