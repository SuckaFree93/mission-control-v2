// User Registration API
import { NextRequest, NextResponse } from 'next/server';
import { getAuthService } from '@/lib/auth/jwt-service';
import { authRateLimit } from '@/lib/auth/middleware';

export async function POST(request: NextRequest) {
  try {
    // Apply rate limiting
    const rateLimitError = await authRateLimit(request);
    if (rateLimitError) return rateLimitError;

    const body = await request.json();
    const { email, username, password, role } = body;

    // Validate input
    if (!email || !username || !password) {
      return NextResponse.json(
        { success: false, error: 'Email, username, and password are required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Validate username (alphanumeric, 3-20 chars)
    const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
    if (!usernameRegex.test(username)) {
      return NextResponse.json(
        { success: false, error: 'Username must be 3-20 characters (letters, numbers, underscores only)' },
        { status: 400 }
      );
    }

    // Validate password strength
    if (password.length < 8) {
      return NextResponse.json(
        { success: false, error: 'Password must be at least 8 characters long' },
        { status: 400 }
      );
    }

    const authService = getAuthService();
    const userAgent = request.headers.get('user-agent');
    const ipAddress = request.headers.get('x-forwarded-for') || 'unknown';

    // Register user
    const result = await authService.register({
      email,
      username,
      password,
      role: role || 'user',
    });

    // Return success response (excluding sensitive data)
    return NextResponse.json({
      success: true,
      message: 'Registration successful',
      data: {
        user: {
          id: result.user.id,
          email: result.user.email,
          username: result.user.username,
          role: result.user.role,
          createdAt: result.user.createdAt,
        },
        tokens: result.tokens,
      },
      timestamp: new Date().toISOString(),
    }, { status: 201 });

  } catch (error) {
    console.error('Registration error:', error);
    
    // Handle specific errors
    if (error instanceof Error) {
      if (error.message.includes('already exists')) {
        return NextResponse.json(
          { success: false, error: error.message },
          { status: 409 } // Conflict
        );
      }
      
      if (error.message.includes('Password must be')) {
        return NextResponse.json(
          { success: false, error: error.message },
          { status: 400 }
        );
      }
    }

    // Generic error response
    return NextResponse.json(
      { 
        success: false, 
        error: 'Registration failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}