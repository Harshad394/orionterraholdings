import { NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/auth';

/**
 * Server-side admin authentication guard for API routes.
 * Returns null if authenticated (caller should proceed).
 * Returns a 401 NextResponse if NOT authenticated (caller should return it immediately).
 *
 * Usage:
 *   const unauth = await requireAdmin();
 *   if (unauth) return unauth;
 */
export async function requireAdmin(): Promise<NextResponse | null> {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'Authentication required',
        },
      },
      { status: 401 }
    );
  }
  return null;
}

export async function getRequiredAdminSession() {
  const session = await getAdminSession();
  if (!session) {
    throw new Error('UNAUTHORIZED');
  }
  return session;
}
