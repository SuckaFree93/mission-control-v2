// Authentication Middleware
import { NextRequest, NextResponse } from 'next/server';
import { getAuthService } from './jwt-service';

export interface AuthRequest extends NextRequest {
  user?: {
    userId: string;
    email: string;
    username: string;
    role: string;
  };
}

export async function authenticate(request: NextRequest): Promise<NextResponse | null> {
  const authHeader = request.headers.get('authorization');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return NextResponse.json(
      { success: false, error: 'Authentication required' },
      { status: 401 }
    );
  }

  const token = authHeader.substring(7);
  const authService = getAuthService();
  
  const validation = await authService.validateToken(token);
  if (!validation) {
    return NextResponse.json(
      { success: false, error: 'Invalid or expired token' },
      { status: 401 }
    );
  }

  // Add user to request object (for use in route handlers)
  (request as AuthRequest).user = {
    userId: validation.user.id,
    email: validation.user.email,
    username: validation.user.username,
    role: validation.user.role,
  };

  return null; // Authentication successful
}

export function requireRole(roles: string[]) {
  return async (request: NextRequest): Promise<NextResponse | null> => {
    // First authenticate
    const authError = await authenticate(request);
    if (authError) return authError;

    // Check role
    const authRequest = request as AuthRequest;
    if (!authRequest.user) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }

    if (!roles.includes(authRequest.user.role)) {
      return NextResponse.json(
        { success: false, error: 'Insufficient permissions' },
        { status: 403 }
      );
    }

    return null; // Role check passed
  };
}

// Rate limiting middleware
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

export function rateLimit(limit: number, windowMs: number) {
  return async (request: NextRequest): Promise<NextResponse | null> => {
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    const key = `${ip}:${request.nextUrl.pathname}`;
    
    const now = Date.now();
    const windowStart = now - windowMs;
    
    // Cleanup old entries
    for (const [k, v] of rateLimitStore.entries()) {
      if (v.resetTime < windowStart) {
        rateLimitStore.delete(k);
      }
    }
    
    // Get or create rate limit entry
    let entry = rateLimitStore.get(key);
    if (!entry || entry.resetTime < windowStart) {
      entry = { count: 0, resetTime: now };
      rateLimitStore.set(key, entry);
    }
    
    // Check limit
    if (entry.count >= limit) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Rate limit exceeded',
          retryAfter: Math.ceil((entry.resetTime + windowMs - now) / 1000)
        },
        { 
          status: 429,
          headers: {
            'Retry-After': Math.ceil((entry.resetTime + windowMs - now) / 1000).toString(),
            'X-RateLimit-Limit': limit.toString(),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': new Date(entry.resetTime + windowMs).toISOString(),
          }
        }
      );
    }
    
    // Increment counter
    entry.count++;
    
    // Add rate limit headers
    const response = NextResponse.next();
    response.headers.set('X-RateLimit-Limit', limit.toString());
    response.headers.set('X-RateLimit-Remaining', (limit - entry.count).toString());
    response.headers.set('X-RateLimit-Reset', new Date(entry.resetTime + windowMs).toISOString());
    
    return null; // Rate limit check passed
  };
}

// Combined middleware wrapper
export async function withMiddleware(
  request: NextRequest,
  middlewares: Array<(req: NextRequest) => Promise<NextResponse | null>>
): Promise<NextResponse | null> {
  for (const middleware of middlewares) {
    const result = await middleware(request);
    if (result) {
      return result; // Middleware failed, return error response
    }
  }
  return null; // All middleware passed
}

// Helper to extract user from authenticated request
export function getUserFromRequest(request: NextRequest) {
  const authRequest = request as AuthRequest;
  return authRequest.user;
}

// Helper to check if user is admin
export function isAdmin(request: NextRequest): boolean {
  const user = getUserFromRequest(request);
  return user?.role === 'admin';
}

// Helper to check if user has specific role
export function hasRole(request: NextRequest, role: string): boolean {
  const user = getUserFromRequest(request);
  return user?.role === role;
}

// Helper to get user ID from request
export function getUserId(request: NextRequest): string | null {
  const user = getUserFromRequest(request);
  return user?.userId || null;
}

// Export middleware for common use cases
export const authMiddleware = authenticate;
export const adminMiddleware = requireRole(['admin']);
export const userMiddleware = requireRole(['admin', 'user']);
export const viewerMiddleware = requireRole(['admin', 'user', 'viewer']);

// Rate limit configurations
export const authRateLimit = rateLimit(5, 60 * 1000); // 5 requests per minute for auth endpoints
export const apiRateLimit = rateLimit(100, 60 * 1000); // 100 requests per minute for API endpoints
export const strictRateLimit = rateLimit(10, 60 * 1000); // 10 requests per minute for sensitive endpoints