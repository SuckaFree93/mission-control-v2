// User Logout API
import { NextRequest, NextResponse } from 'next/server';
import { getAuthService } from '@/lib/auth/jwt-service';
import { authenticate } from '@/lib/auth/middleware';

export async function POST(request: NextRequest) {
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

    // Logout (revoke token)
    await authService.logout(token);

    // Return success response
    return NextResponse.json({
      success: true,
      message: 'Logout successful',
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error('Logout error:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Logout failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}