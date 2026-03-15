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
    const db = await getAuthDB();
    
    // Check if user already exists
    const existingUser = await db.getUserByEmail(data.email) || await db.getUserByUsername(data.username);
    if (existingUser) {
      throw new Error('User already exists');
    }

    // Hash password
    const passwordHash = await this.hashPassword(data.password);

    // Create user
    const user = await db.createUser({
      email: data.email,
      username: data.username,
      passwordHash,
      role: data.role || 'user'
    });

    // Generate tokens
    const tokens = await this.generateTokens(user);

    return { user, tokens };
  }

  // Login user
  async login(credentials: LoginCredentials): Promise<{ user: User; tokens: AuthTokens }> {
    const db = await getAuthDB();
    
    // Find user by email
    const user = await db.getUserByEmail(credentials.email);
    if (!user) {
      throw new Error('Invalid credentials');
    }

    // Verify password
    const isValidPassword = await this.verifyPassword(credentials.password, user.passwordHash);
    if (!isValidPassword) {
      throw new Error('Invalid credentials');
    }

    // Update last login
    await db.updateUserLastLogin(user.id);

    // Generate tokens
    const tokens = await this.generateTokens(user);

    return { user, tokens };
  }

  // Generate tokens for user
  private async generateTokens(user: User): Promise<AuthTokens> {
    const db = await getAuthDB();
    
    // Create payload
    const payload: AuthPayload = {
      userId: user.id,
      email: user.email,
      username: user.username,
      role: user.role
    };

    // Generate tokens
    const accessToken = this.generateToken(payload);
    const refreshToken = this.generateRefreshToken();

    // Calculate expiration
    const expiresIn = 15 * 60; // 15 minutes in seconds

    // Create session
    await db.createSession({
      userId: user.id,
      token: accessToken,
      refreshToken,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days
      userAgent: 'web',
      ipAddress: '127.0.0.1'
    });

    return {
      accessToken,
      refreshToken,
      expiresIn,
      tokenType: 'Bearer'
    };
  }

  // Refresh token
  async refreshToken(refreshToken: string): Promise<AuthTokens> {
    const db = await getAuthDB();
    
    // Find session by refresh token
    const session = await db.getSessionByRefreshToken(refreshToken);
    if (!session) {
      throw new Error('Invalid refresh token');
    }

    // Get user
    const user = await db.getUserById(session.userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Revoke old session
    await db.revokeSession(session.id);

    // Generate new tokens
    return await this.generateTokens(user);
  }

  // Validate token
  async validateToken(token: string): Promise<{ valid: boolean; user?: User; error?: string }> {
    const db = await getAuthDB();
    
    // Verify JWT
    const payload = this.verifyToken(token);
    if (!payload) {
      return { valid: false, error: 'Invalid token' };
    }

    // Check session
    const session = await db.getSessionByToken(token);
    if (!session) {
      return { valid: false, error: 'Session not found or expired' };
    }

    // Get user
    const user = await db.getUserById(payload.userId);
    if (!user) {
      return { valid: false, error: 'User not found' };
    }

    return { valid: true, user };
  }

  // Logout
  async logout(token: string): Promise<void> {
    const db = await getAuthDB();
    
    // Find session by token
    const session = await db.getSessionByToken(token);
    if (session) {
      await db.revokeSession(session.id);
    }
  }

  // Logout all sessions for user
  async logoutAll(userId: string): Promise<void> {
    const db = await getAuthDB();
    await db.revokeAllUserSessions(userId);
  }

  // Cleanup expired sessions
  async cleanupSessions(): Promise<void> {
    const db = await getAuthDB();
    await db.cleanupExpiredSessions();
  }
}

// Singleton instance
let authServiceInstance: AuthService | null = null;

export function getAuthService(): AuthService {
  if (!authServiceInstance) {
    authServiceInstance = new AuthService();
  }
  return authServiceInstance;
}