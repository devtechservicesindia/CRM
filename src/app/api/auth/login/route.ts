import { NextRequest, NextResponse } from 'next/server';

/**
 * POST /api/auth/login
 * Validates credentials and returns user data.
 * 
 * FOR BACKEND DEVELOPER:
 * Replace the hardcoded credential check with a database lookup.
 * Example with Prisma:
 *   const user = await prisma.user.findUnique({ where: { email } });
 *   const isValid = await bcrypt.compare(password, user.passwordHash);
 * Then set a proper HTTP-only cookie for session management.
 */
export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    // TODO: Replace with DB lookup + bcrypt comparison
    const ADMIN_EMAIL = 'admin@gpcrm.com';
    const ADMIN_PASSWORD = 'admin123';

    if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    const user = {
      id: 'admin-1',
      name: 'Admin User',
      email: ADMIN_EMAIL,
      role: 'admin',
    };

    return NextResponse.json({ user, token: 'mock-jwt-token' });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
