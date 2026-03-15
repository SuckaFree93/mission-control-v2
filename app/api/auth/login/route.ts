// User Login API
import { NextRequest, NextResponse } from 'next/server';
import { getAuthService } from '@/lib/auth/jwt-service';
import { authRateLimit } from '@/lib/auth/middleware';

export async function POST(request: NextRequest) {
  try {
    // Apply rate limiting
    const rateLimitError = await authRateLimit(request);
    if (rateLimitError) return rateLimitError;

    const body = await request.json();
    const { email, password } = body;

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email and password are required' },
        { status: 400 }
      );
    }

    const authService = getAuthService();
    const userAgent = request.headers.get('user-agent');
    const ipAddress = request.headers.get('x-forwarded-for') || 'unknown';

    // Login user
    const result = await authService.login(
      { email, password },
      userAgent || undefined,
      ipAddress
    );

    // Return success response
    return NextResponse.json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: result.user.id,
          email: result.user.email,
          username: result.user.username,
          role: result.user.role,
          lastLoginAt: result.user.lastLoginAt,
        },
        tokens: result.tokens,
      },
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error('Login error:', error);
    
    // Handle authentication errors
    if (error instanceof Error) {
      if (error.message.includes('Invalid') || error.message.includes('Account is deactivated')) {
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
        error: 'Login failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}