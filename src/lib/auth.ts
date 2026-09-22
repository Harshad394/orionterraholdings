import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';

const SESSION_COOKIE_NAME = 'ot_admin_session';
const SESSION_DURATION_SECONDS = 60 * 60 * 8; // 8 hours

interface AdminPayload {
  adminId: string;
  email: string;
}

function getJwtSecret(): Uint8Array {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET environment variable is not set');
  }
  return new TextEncoder().encode(secret);
}

/**
 * Sign and return a JWT token for the given admin payload.
 */
export async function signAdminToken(payload: AdminPayload): Promise<string> {
  const secret = getJwtSecret();
  const token = await new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_DURATION_SECONDS}s`)
    .sign(secret);

  return token;
}

/**
 * Verify and decode a JWT token. Returns null if invalid or expired.
 */
export async function verifyAdminToken(token: string): Promise<AdminPayload | null> {
  try {
    const secret = getJwtSecret();
    const { payload } = await jwtVerify(token, secret);
    return {
      adminId: payload.adminId as string,
      email: payload.email as string,
    };
  } catch {
    return null;
  }
}

/**
 * Set the admin session cookie (HTTP-only, Secure in production).
 */
export async function setAdminSession(payload: AdminPayload): Promise<void> {
  const token = await signAdminToken(payload);
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: SESSION_DURATION_SECONDS,
    path: '/',
  });
}

/**
 * Clear the admin session cookie.
 */
export async function clearAdminSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}

/**
 * Get the currently authenticated admin from the session cookie.
 * Returns null if not authenticated.
 */
export async function getAdminSession(): Promise<AdminPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (!token) return null;
  return verifyAdminToken(token);
}

/**
 * Get the raw session token value from cookies (for middleware use).
 */
export { SESSION_COOKIE_NAME };
