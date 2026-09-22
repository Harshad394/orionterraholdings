import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import connectToDatabase from '@/lib/db/mongodb';
import Admin from '@/models/Admin';
import { setAdminSession } from '@/lib/auth';

const loginSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }).toLowerCase(),
  password: z.string().min(1, { message: 'Password is required' }),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const parsed = loginSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid credentials format',
            fields: parsed.error.flatten().fieldErrors as Record<string, string>,
          },
        },
        { status: 400 }
      );
    }

    const { email, password } = parsed.data;

    await connectToDatabase();

    const admin = await Admin.findOne({ email }).select('+passwordHash').exec();

    // Use constant-time comparison to prevent timing attacks
    const dummyHash = '$2b$12$invalidhashforcomparison000000000000000000000000000000';
    const hashToCompare = admin?.passwordHash ?? dummyHash;
    const passwordMatch = await bcrypt.compare(password, hashToCompare);

    if (!admin || !passwordMatch) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'INVALID_CREDENTIALS',
            message: 'Invalid email or password',
          },
        },
        { status: 401 }
      );
    }

    // Issue session cookie
    await setAdminSession({
      adminId: admin._id.toString(),
      email: admin.email,
    });

    return NextResponse.json({
      success: true,
      data: {
        email: admin.email,
      },
    });
  } catch (error) {
    console.error('Admin login error:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'SERVER_ERROR',
          message: 'An unexpected error occurred. Please try again.',
        },
      },
      { status: 500 }
    );
  }
}
