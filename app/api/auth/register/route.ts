import { NextRequest, NextResponse } from 'next/server';
import { getAuthService } from '@/lib/auth/auth';

export async function POST(request: NextRequest) {
  try {
    const authService = getAuthService();
    const body = await request.json();
    const ipAddress = request.headers.get('x-forwarded-for') || request.ip || 'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';

    const { email, password, displayName } = body;

    if (!email || !password || !displayName) {
      return NextResponse.json(
        { error: 'Email, password, and display name required' },
        { status: 400 }
      );
    }

    const result = await authService.register({ email, password, displayName });

    return NextResponse.json({
      user: result.user,
      session: result.session,
      message: 'Registration successful'
    }, { status: 201 });
  } catch (error) {
    console.error('Registration API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}