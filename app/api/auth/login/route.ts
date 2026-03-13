import { NextRequest, NextResponse } from 'next/server';
import { getAuthService } from '@/lib/auth/auth';

export async function POST(request: NextRequest) {
  try {
    const authService = getAuthService();
    const body = await request.json();
    const ipAddress = request.headers.get('x-forwarded-for') || request.ip || 'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';

    const result = await authService.login(body, ipAddress, userAgent);

    if (!result) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    return NextResponse.json({
      user: result.user,
      session: result.session,
      message: 'Login successful'
    });
  } catch (error) {
    console.error('Login API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}