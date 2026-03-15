// Admin Users Management API
import { NextRequest, NextResponse } from 'next/server';
import { getAuthDB } from '@/lib/auth/database';
import { adminMiddleware } from '@/lib/auth/middleware';

export async function GET(request: NextRequest) {
  try {
    // Check admin role
    const authError = await adminMiddleware(request);
    if (authError) return authError;

    const db = await getAuthDB();
    
    // Get all users (excluding password hashes)
    const users = db.db.prepare(`
      SELECT 
        id, email, username, role,
        created_at as createdAt, updated_at as updatedAt,
        last_login_at as lastLoginAt, is_active as isActive
      FROM users 
      ORDER BY created_at DESC
    `).all();

    // Get statistics
    const stats = {
      total: users.length,
      active: users.filter(u => u.isActive).length,
      admins: users.filter(u => u.role === 'admin').length,
      users: users.filter(u => u.role === 'user').length,
      viewers: users.filter(u => u.role === 'viewer').length,
    };

    return NextResponse.json({
      success: true,
      data: {
        users,
        statistics: stats,
      },
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error('Admin users fetch error:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch users',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Check admin role
    const authError = await adminMiddleware(request);
    if (authError) return authError;

    const body = await request.json();
    const { action, userId, data } = body;

    if (!action) {
      return NextResponse.json(
        { success: false, error: 'Action is required' },
        { status: 400 }
      );
    }

    const db = await getAuthDB();

    switch (action) {
      case 'update_role':
        if (!userId || !data?.role) {
          return NextResponse.json(
            { success: false, error: 'User ID and role are required' },
            { status: 400 }
          );
        }

        // Update user role
        db.db.prepare(`
          UPDATE users 
          SET role = ?, updated_at = ?
          WHERE id = ?
        `).run(data.role, new Date().toISOString(), userId);

        return NextResponse.json({
          success: true,
          message: `User role updated to ${data.role}`,
          timestamp: new Date().toISOString(),
        });

      case 'toggle_active':
        if (!userId) {
          return NextResponse.json(
            { success: false, error: 'User ID is required' },
            { status: 400 }
          );
        }

        // Toggle user active status
        const user = db.getUserById(userId);
        if (!user) {
          return NextResponse.json(
            { success: false, error: 'User not found' },
            { status: 404 }
          );
        }

        const newStatus = !user.isActive;
        db.db.prepare(`
          UPDATE users 
          SET is_active = ?, updated_at = ?
          WHERE id = ?
        `).run(newStatus ? 1 : 0, new Date().toISOString(), userId);

        return NextResponse.json({
          success: true,
          message: `User ${newStatus ? 'activated' : 'deactivated'}`,
          data: { isActive: newStatus },
          timestamp: new Date().toISOString(),
        });

      case 'delete_user':
        if (!userId) {
          return NextResponse.json(
            { success: false, error: 'User ID is required' },
            { status: 400 }
          );
        }

        // Delete user and their sessions
        db.db.prepare('DELETE FROM sessions WHERE user_id = ?').run(userId);
        const result = db.db.prepare('DELETE FROM users WHERE id = ?').run(userId);

        if (result.changes === 0) {
          return NextResponse.json(
            { success: false, error: 'User not found' },
            { status: 404 }
          );
        }

        return NextResponse.json({
          success: true,
          message: 'User deleted successfully',
          timestamp: new Date().toISOString(),
        });

      default:
        return NextResponse.json(
          { success: false, error: `Unknown action: ${action}` },
          { status: 400 }
        );
    }

  } catch (error) {
    console.error('Admin user management error:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'User management failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}