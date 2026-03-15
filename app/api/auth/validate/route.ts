// Token Validation API
import { NextRequest, NextResponse } from 'next/server';
import { getAuthService } from '@/lib/auth/jwt-service';
import { authenticate } from '@/lib/auth/middleware';

export async function GET(request: NextRequest) {
  try {
    // Authenticate user
    const authError = await authenticate(request);
    if (authError) return authError;

    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json(
        { success: false, error: 'No authorization header' },
        { status: 400 }
      );
    }

    const token = authHeader.substring(7);
    const authService = getAuthService();

    // Validate token and get user info
    const validation = await authService.validateToken(token);
    if (!validation) {
      return NextResponse.json(
        { success: false, error: 'Invalid token' },
        { status: 401 }
      );
    }

    // Return user info
    return NextResponse.json({
      success: true,
      message: 'Token is valid',
      data: {
        user: {
          id: validation.user.id,
          email: validation.user.email,
          username: validation.user.username,
          role: validation.user.role,
          lastLoginAt: validation.user.lastLoginAt,
        },
        session: {
          id: validation.session.id,
          createdAt: validation.session.createdAt,
          expiresAt: validation.session.expiresAt,
        },
      },
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error('Token validation error:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Token validation failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}