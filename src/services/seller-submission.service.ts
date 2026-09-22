import connectToDatabase from '@/lib/db/mongodb';
import SellerSubmission from '@/models/SellerSubmission';
import Inquiry from '@/models/Inquiry';
import Property from '@/models/Property';
import { createSellerSubmissionSchema, CreateSellerSubmissionInput } from '@/lib/validations/seller-submission';
import { createInquirySchema, CreateInquiryInput } from '@/lib/validations/inquiry';

export async function createSellerSubmission(rawInput: CreateSellerSubmissionInput) {
  // Validate server-side with Zod schema
  const validated = createSellerSubmissionSchema.parse(rawInput);

  // Honeypot check: If bot filled the invisible 'website' field, reject cleanly
  if (validated.website && validated.website.trim().length > 0) {
    throw new Error('Spam submission detected');
  }

  await connectToDatabase();

  // Mass assignment protection: Explicitly select whitelisted fields & force status = PENDING
  const submission = await SellerSubmission.create({
    sellerName: validated.sellerName.trim(),
    phone: validated.phone.trim(),
    email: validated.email ? validated.email.trim() : undefined,
    company: validated.company ? validated.company.trim() : undefined,
    propertyLocation: validated.propertyLocation.trim(),
    city: validated.city.trim(),
    state: validated.state.trim(),
    landArea: validated.landArea,
    landAreaUnit: validated.landAreaUnit,
    propertyType: validated.propertyType,
    opportunityType: validated.opportunityType,
    expectedPrice: validated.expectedPrice || null,
    description: validated.description ? validated.description.trim() : '',
    images: validated.images || [],
    documentsAvailable: validated.documentsAvailable || 'Yes',
    status: 'PENDING', // ALWAYS force status to PENDING on server side
  });

  return {
    id: submission._id.toString(),
    sellerName: submission.sellerName,
    propertyLocation: submission.propertyLocation,
    city: submission.city,
    status: submission.status,
    createdAt: submission.createdAt.toISOString(),
  };
}

export async function createBuyerInquiry(rawInput: CreateInquiryInput) {
  const validated = createInquirySchema.parse(rawInput);

  // Honeypot check: If bot filled the invisible 'website' field, reject cleanly
  if (validated.website && validated.website.trim().length > 0) {
    throw new Error('Spam inquiry detected');
  }

  await connectToDatabase();

  // Verify referenced property exists AND is PUBLISHED
  let propertyDoc = await Property.findOne({
    _id: validated.propertyId,
    status: 'PUBLISHED',
  }).exec();

  if (!propertyDoc) {
    propertyDoc = await Property.findOne({
      propertyId: validated.propertyId,
      status: 'PUBLISHED',
    }).exec();
  }

  if (!propertyDoc) {
    throw new Error('Property not found or is not currently active for inquiries');
  }

  // Mass assignment protection: Explicitly select whitelisted fields & force status = NEW
  const inquiry = await Inquiry.create({
    propertyId: propertyDoc._id,
    name: validated.name.trim(),
    phone: validated.phone.trim(),
    email: validated.email ? validated.email.trim() : undefined,
    message: validated.message.trim(),
    status: 'NEW', // ALWAYS force status to NEW on server side
  });

  return {
    id: inquiry._id.toString(),
    propertyId: propertyDoc.propertyId,
    propertyTitle: propertyDoc.title,
    name: inquiry.name,
    status: inquiry.status,
    createdAt: inquiry.createdAt.toISOString(),
  };
}
