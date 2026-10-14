import { IProperty } from '@/models/Property';

export interface AdminInquiryDTO {
  id: string;
  propertyId: string;
  property?: {
    id: string;
    title: string;
    propertyId: string;
    slug: string;
    city?: string;
    state?: string;
  } | null;
  name: string;
  phone: string;
  email?: string;
  message: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface InquiryDocRaw {
  _id: { toString: () => string };
  propertyId?: unknown;
  name: string;
  phone: string;
  email?: string;
  message: string;
  status: string;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export function mapAdminInquiry(doc: InquiryDocRaw): AdminInquiryDTO {
  let propertyObj: AdminInquiryDTO['property'] = null;

  if (doc.propertyId && typeof doc.propertyId === 'object' && 'title' in (doc.propertyId as Record<string, unknown>)) {
    const p = doc.propertyId as unknown as IProperty;
    propertyObj = {
      id: p._id.toString(),
      title: p.title,
      propertyId: p.propertyId,
      slug: p.slug,
      city: p.location?.city,
      state: p.location?.state,
    };
  }

  const pId = doc.propertyId && typeof doc.propertyId === 'object' && '_id' in (doc.propertyId as Record<string, unknown>)
    ? (doc.propertyId as { _id: { toString: () => string } })._id.toString()
    : doc.propertyId?.toString() || '';

  return {
    id: doc._id.toString(),
    propertyId: pId,
    property: propertyObj,
    name: doc.name,
    phone: doc.phone,
    email: doc.email,
    message: doc.message,
    status: doc.status,
    createdAt: doc.createdAt instanceof Date ? doc.createdAt.toISOString() : new Date(doc.createdAt).toISOString(),
    updatedAt: doc.updatedAt instanceof Date ? doc.updatedAt.toISOString() : new Date(doc.updatedAt).toISOString(),
  };
}
