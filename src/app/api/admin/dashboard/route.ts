import { NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/auth';
import connectToDatabase from '@/lib/db/mongodb';
import Property from '@/models/Property';
import SellerSubmission from '@/models/SellerSubmission';
import Inquiry from '@/models/Inquiry';

export async function GET() {
  try {
    // Double-check session (middleware already guards, but belt-and-suspenders)
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json(
        { success: false, error: { code: 'UNAUTHORIZED', message: 'Unauthorized' } },
        { status: 401 }
      );
    }

    await connectToDatabase();

    const [
      totalProperties,
      publishedProperties,
      draftProperties,
      pendingSubmissions,
      totalSubmissions,
      newInquiries,
      totalInquiries,
      recentSubmissions,
      recentInquiries,
    ] = await Promise.all([
      Property.countDocuments({}),
      Property.countDocuments({ status: 'PUBLISHED' }),
      Property.countDocuments({ status: 'DRAFT' }),
      SellerSubmission.countDocuments({ status: 'PENDING' }),
      SellerSubmission.countDocuments({}),
      Inquiry.countDocuments({ status: 'NEW' }),
      Inquiry.countDocuments({}),
      SellerSubmission.find({})
        .sort({ createdAt: -1 })
        .limit(5)
        .select('sellerName phone email city state propertyType status createdAt')
        .lean()
        .exec(),
      Inquiry.find({})
        .sort({ createdAt: -1 })
        .limit(5)
        .select('name phone email message status propertyId createdAt')
        .populate('propertyId', 'title propertyId slug')
        .lean()
        .exec(),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        stats: {
          totalProperties,
          publishedProperties,
          draftProperties,
          pendingSubmissions,
          totalSubmissions,
          newInquiries,
          totalInquiries,
        },
        recentSubmissions,
        recentInquiries,
      },
    });
  } catch (error) {
    console.error('Admin dashboard stats error:', error);
    return NextResponse.json(
      {
        success: false,
        error: { code: 'SERVER_ERROR', message: 'Failed to load dashboard data' },
      },
      { status: 500 }
    );
  }
}
