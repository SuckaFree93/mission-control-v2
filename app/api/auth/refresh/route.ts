// Token Refresh API
import { NextRequest, NextResponse } from 'next/server';
import { getAuthService } from '@/lib/auth/jwt-service';
import { authRateLimit } from '@/lib/auth/middleware';

export async function POST(request: NextRequest) {
  try {
    // Apply rate limiting
    const rateLimitError = await authRateLimit(request);
    if (rateLimitError) return rateLimitError;

    const body = await request.json();
    const { refreshToken } = body;

    // Validate input
    if (!refreshToken) {
      return NextResponse.json(
        { success: false, error: 'Refresh token is required' },
        { status: 400 }
      );
    }

    const authService = getAuthService();
    const userAgent = request.headers.get('user-agent');
    const ipAddress = request.headers.get('x-forwarded-for') || 'unknown';

    // Refresh token
    const tokens = await authService.refreshToken(
      refreshToken,
      userAgent || undefined,
      ipAddress
    );

    // Return new tokens
    return NextResponse.json({
      success: true,
      message: 'Token refreshed successfully',
      data: { tokens },
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error('Token refresh error:', error);
    
    // Handle token errors
    if (error instanceof Error) {
      if (error.message.includes('Invalid') || error.message.includes('expired')) {
        return NextResponse.json(
          { success: false, error: error.message },
          { status: 401 }
        );
      }
    }

    // Generic error response
    return NextResponse.json(
      { 
        success: false, 
        error: 'Token refresh failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}