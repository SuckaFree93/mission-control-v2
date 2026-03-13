import { NextRequest, NextResponse } from 'next/server';
import { getAuthService } from '@/lib/auth/auth';

export async function GET(request: NextRequest) {
  try {
    const authService = getAuthService();
    const sessionId = request.headers.get('x-session-id');
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null;

    if (!sessionId || !token) {
      return NextResponse.json({ valid: false }, { status: 401 });
    }

    const validation = await authService.validateSession(sessionId, token);
    
    if (!validation.valid) {
      return NextResponse.json({ valid: false }, { status: 401 });
    }

    return NextResponse.json(validation);
  } catch (error) {
    console.error('Validation API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}