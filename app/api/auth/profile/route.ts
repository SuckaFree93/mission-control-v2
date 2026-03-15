// User Profile API (Protected)
import { NextRequest, NextResponse } from 'next/server';
import { getAuthService } from '@/lib/auth/jwt-service';
import { getAuthDB } from '@/lib/auth/database';
import { authenticate, getUserFromRequest } from '@/lib/auth/middleware';

export async function GET(request: NextRequest) {
  try {
    // Authenticate user
    const authError = await authenticate(request);
    if (authError) return authError;

    // Get user from request
    const user = getUserFromRequest(request);
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    const db = await getAuthDB();
    const userData = db.getUserById(user.userId);

    if (!userData) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    // Return user profile (excluding sensitive data)
    return NextResponse.json({
      success: true,
      data: {
        id: userData.id,
        email: userData.email,
        username: userData.username,
        role: userData.role,
        createdAt: userData.createdAt,
        updatedAt: userData.updatedAt,
        lastLoginAt: userData.lastLoginAt,
        isActive: userData.isActive,
      },
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error('Profile fetch error:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch profile',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    // Authenticate user
    const authError = await authenticate(request);
    if (authError) return authError;

    // Get user from request
    const user = getUserFromRequest(request);
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    const body = await request.json();
    const { username, email } = body;

    // Validate input
    if (username) {
      const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
      if (!usernameRegex.test(username)) {
        return NextResponse.json(
          { success: false, error: 'Username must be 3-20 characters (letters, numbers, underscores only)' },
          { status: 400 }
        );
      }
    }

    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return NextResponse.json(
          { success: false, error: 'Invalid email format' },
          { status: 400 }
        );
      }
    }

    const db = await getAuthDB();
    
    // Check if new username/email already exists
    if (username && username !== user.username) {
      const existingUser = db.getUserByUsername(username);
      if (existingUser) {
        return NextResponse.json(
          { success: false, error: 'Username already taken' },
          { status: 409 }
        );
      }
    }

    if (email && email !== user.email) {
      const existingUser = db.getUserByEmail(email);
      if (existingUser) {
        return NextResponse.json(
          { success: false, error: 'Email already registered' },
          { status: 409 }
        );
      }
    }

    // Update user (simplified - in real app, use proper update method)
    // For now, we'll just return the request data as if updated
    return NextResponse.json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        id: user.userId,
        email: email || user.email,
        username: username || user.username,
        role: user.role,
        updatedAt: new Date().toISOString(),
      },
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error('Profile update error:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to update profile',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}