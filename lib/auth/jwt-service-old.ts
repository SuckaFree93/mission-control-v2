// JWT Authentication Service
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { getAuthDB, User, Session } from './database';

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  tokenType: string;
}

export interface AuthPayload {
  userId: string;
  email: string;
  username: string;
  role: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  username: string;
  password: string;
  role?: 'admin' | 'user' | 'viewer';
}

export class AuthService {
  private jwtSecret: string;
  private jwtExpiresIn: string;
  private refreshTokenExpiresIn: string;

  constructor() {
    this.jwtSecret = process.env.JWT_SECRET || 'mission-control-secret-key-change-in-production';
    this.jwtExpiresIn = process.env.JWT_EXPIRES_IN || '15m';
    this.refreshTokenExpiresIn = process.env.REFRESH_TOKEN_EXPIRES_IN || '7d';
    
    if (!process.env.JWT_SECRET) {
      console.warn('⚠️ JWT_SECRET not set, using default key. Change in production!');
    }
  }

  // Generate JWT token
  private generateToken(payload: AuthPayload, expiresIn: string = this.jwtExpiresIn): string {
    return jwt.sign(payload, this.jwtSecret, { expiresIn });
  }

  // Generate refresh token
  private generateRefreshToken(): string {
    return require('crypto').randomBytes(64).toString('hex');
  }

  // Verify JWT token
  verifyToken(token: string): AuthPayload | null {
    try {
      const decoded = jwt.verify(token, this.jwtSecret) as AuthPayload;
      return decoded;
    } catch (error) {
      console.error('JWT verification failed:', error);
      return null;
    }
  }

  // Hash password
  async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
  }

  // Verify password
  async verifyPassword(password: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(password, hash);
  }

  // Register new user
  async register(data: RegisterData): Promise<{ user: User; tokens: AuthTokens }> {
    const db = getAuthDatabase();
    
    // Check if user already exists
    const existingUser = db.getUserByEmail(data.email) || db.getUserByUsername(data.username);
    if (existingUser) {
      throw new Error('User with this email or username already exists');
    }

    // Validate password
    if (data.password.length < 8) {
      throw new Error('Password must be at least 8 characters long');
    }

    // Hash password
    const passwordHash = await this.hashPassword(data.password);

    // Create user
    const user = db.createUser({
      email: data.email,
      username: data.username,
      passwordHash,
      role: data.role || 'user',
    });

    // Generate tokens
    const tokens = await this.generateTokens(user);

    return { user, tokens };
  }

  // Login user
  async login(credentials: LoginCredentials, userAgent?: string, ipAddress?: string): Promise<{ user: User; tokens: AuthTokens }> {
    const db = getAuthDatabase();
    
    // Find user by email
    const user = db.getUserByEmail(credentials.email);
    if (!user) {
      throw new Error('Invalid email or password');
    }

    // Check if user is active
    if (!user.isActive) {
      throw new Error('Account is deactivated');
    }

    // Verify password
    const isValidPassword = await this.verifyPassword(credentials.password, user.passwordHash);
    if (!isValidPassword) {
      throw new Error('Invalid email or password');
    }

    // Update last login
    db.updateUserLastLogin(user.id);

    // Generate tokens
    const tokens = await this.generateTokens(user, userAgent, ipAddress);

    return { user, tokens };
  }

  // Generate tokens for user
  async generateTokens(user: User, userAgent?: string, ipAddress?: string): Promise<AuthTokens> {
    const db = getAuthDatabase();
    
    // Create payload
    const payload: AuthPayload = {
      userId: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
    };

    // Generate tokens
    const accessToken = this.generateToken(payload);
    const refreshToken = this.generateRefreshToken();

    // Calculate expiration
    const expiresIn = 15 * 60; // 15 minutes in seconds
    const expiresAt = new Date(Date.now() + expiresIn * 1000).toISOString();

    // Create session
    db.createSession({
      userId: user.id,
      token: accessToken,
      refreshToken,
      expiresAt,
      userAgent,
      ipAddress,
    });

    // Cleanup expired sessions
    db.cleanupExpiredSessions();

    return {
      accessToken,
      refreshToken,
      expiresIn,
      tokenType: 'Bearer',
    };
  }

  // Refresh access token
  async refreshToken(refreshToken: string, userAgent?: string, ipAddress?: string): Promise<AuthTokens> {
    const db = getAuthDatabase();
    
    // Find session by refresh token
    const session = db.getSessionByRefreshToken(refreshToken);
    if (!session) {
      throw new Error('Invalid refresh token');
    }

    // Check if session is expired
    if (new Date(session.expiresAt) < new Date()) {
      db.revokeSession(session.token);
      throw new Error('Refresh token expired');
    }

    // Get user
    const user = db.getUserById(session.userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Revoke old session
    db.revokeSession(session.token);

    // Generate new tokens
    return await this.generateTokens(user, userAgent, ipAddress);
  }

  // Logout (revoke token)
  async logout(token: string): Promise<void> {
    const db = getAuthDatabase();
    db.revokeSession(token);
  }

  // Logout all sessions for user
  async logoutAll(userId: string): Promise<void> {
    const db = getAuthDatabase();
    db.revokeAllUserSessions(userId);
  }

  // Validate token and get user
  async validateToken(token: string): Promise<{ user: User; session: Session } | null> {
    const db = getAuthDatabase();
    
    // Verify JWT
    const payload = this.verifyToken(token);
    if (!payload) {
      return null;
    }

    // Check session in database
    const session = db.getSessionByToken(token);
    if (!session) {
      return null;
    }

    // Get user
    const user = db.getUserById(payload.userId);
    if (!user) {
      return null;
    }

    return { user, session };
  }

  // Get user from token (without session validation)
  getUserFromToken(token: string): AuthPayload | null {
    return this.verifyToken(token);
  }

  // Get auth statistics
  getAuthStats(): { userCount: number; activeSessionCount: number } {
    const db = getAuthDatabase();
    return {
      userCount: db.getUserCount(),
      activeSessionCount: db.getActiveSessionCount(),
    };
  }
}

// Singleton instance
let authService: AuthService | null = null;

export function getAuthService(): AuthService {
  if (!authService) {
    authService = new AuthService();
  }
  return authService;
}