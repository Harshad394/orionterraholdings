import { NextRequest } from 'next/server';
import mongoose from 'mongoose';
import { ZodError } from 'zod';
import connectToDatabase from '@/lib/db/mongodb';
import { requireAdmin } from '@/lib/requireAdmin';
import Inquiry from '@/models/Inquiry';
import { updateInquiryStatusSchema } from '@/lib/validations/admin-inquiry';
import { mapAdminInquiry } from '@/services/admin-inquiry.service';
import { errorResponse, successResponse, validationErrorResponse } from '@/lib/api/responses';

interface Context {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, context: Context) {
  const unauth = await requireAdmin();
  if (unauth) return unauth;

  try {
    const { id } = await context.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return errorResponse('INVALID_ID', 'Invalid Inquiry ID format', 400);
    }

    await connectToDatabase();
    const inquiry = await Inquiry.findById(id)
      .populate('propertyId', 'title propertyId slug location landArea landAreaUnit propertyType opportunityType price priceVisibility images status')
      .lean()
      .exec();

    if (!inquiry) {
      return errorResponse('NOT_FOUND', 'Inquiry not found', 404);
    }

    return successResponse({ inquiry: mapAdminInquiry(inquiry) });
  } catch (error) {
    console.error('Fetch inquiry error:', error);
    return errorResponse('SERVER_ERROR', 'Unable to fetch inquiry details', 500);
  }
}

export async function PATCH(request: NextRequest, context: Context) {
  const unauth = await requireAdmin();
  if (unauth) return unauth;

  try {
    const { id } = await context.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return errorResponse('INVALID_ID', 'Invalid Inquiry ID format', 400);
    }

    const body = await request.json().catch(() => ({}));
    const { status } = updateInquiryStatusSchema.parse(body);

    await connectToDatabase();

    const updatedInquiry = await Inquiry.findByIdAndUpdate(
      id,
      {
        $set: {
          status,
          updatedAt: new Date(),
        },
      },
      { new: true }
    )
      .populate('propertyId', 'title propertyId slug location')
      .lean()
      .exec();

    if (!updatedInquiry) {
      return errorResponse('NOT_FOUND', 'Inquiry not found', 404);
    }

    return successResponse({ inquiry: mapAdminInquiry(updatedInquiry) });
  } catch (error) {
    if (error instanceof ZodError) return validationErrorResponse(error);
    console.error('Update inquiry status error:', error);
    return errorResponse('SERVER_ERROR', 'Unable to update inquiry status', 500);
  }
}

export async function DELETE(request: NextRequest, context: Context) {
  const unauth = await requireAdmin();
  if (unauth) return unauth;

  try {
    const { id } = await context.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return errorResponse('INVALID_ID', 'Invalid Inquiry ID format', 400);
    }

    await connectToDatabase();

    const deletedInquiry = await Inquiry.findByIdAndDelete(id).lean().exec();

    if (!deletedInquiry) {
      return errorResponse('NOT_FOUND', 'Inquiry not found', 404);
    }

    return successResponse({ message: 'Inquiry deleted successfully' });
  } catch (error) {
    console.error('Delete inquiry error:', error);
    return errorResponse('SERVER_ERROR', 'Unable to delete inquiry', 500);
  }
}
