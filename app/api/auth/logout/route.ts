import { NextRequest, NextResponse } from 'next/server';
import { getAuthService } from '@/lib/auth/auth';

export async function POST(request: NextRequest) {
  try {
    const authService = getAuthService();
    const sessionId = request.headers.get('x-session-id');

    if (sessionId) {
      await authService.logout(sessionId);
    }

    return NextResponse.json({ message: 'Logout successful' });
  } catch (error) {
    console.error('Logout API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}