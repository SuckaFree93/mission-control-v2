import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { UserPreferencesService, UserProfile } from '../user/preferences';

export interface AuthUser {
  userId: string;
  displayName: string;
  email?: string;
  role: 'admin' | 'user' | 'viewer';
  permissions: string[];
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  displayName: string;
}

export interface AuthSession {
  sessionId: string;
  userId: string;
  token: string;
  expiresAt: string;
  ipAddress?: string;
  userAgent?: string;
  createdAt: string;
}

export class AuthenticationService {
  private userService: UserPreferencesService;
  private sessions: Map<string, AuthSession> = new Map();
  private jwtSecret: string;
  private tokenExpiry: string = '7d';

  constructor() {
    this.userService = new UserPreferencesService();
    
    // In production, use environment variable
    this.jwtSecret = process.env.JWT_SECRET || this.generateRandomSecret();
    
    // Clean up expired sessions every hour
    setInterval(() => this.cleanupExpiredSessions(), 60 * 60 * 1000);
  }

  private generateRandomSecret(): string {
    return crypto.randomBytes(64).toString('hex');
  }

  private hashPassword(password: string): string {
    const salt = crypto.randomBytes(16).toString('hex');
    const hash = crypto
      .pbkdf2Sync(password, salt, 1000, 64, 'sha512')
      .toString('hex');
    return `${salt}:${hash}`;
  }

  private verifyPassword(password: string, storedHash: string): boolean {
    const [salt, originalHash] = storedHash.split(':');
    const hash = crypto
      .pbkdf2Sync(password, salt, 1000, 64, 'sha512')
      .toString('hex');
    return hash === originalHash;
  }

  private generateSessionId(): string {
    return crypto.randomBytes(32).toString('hex');
  }

  private generateToken(userId: string, role: string): string {
    return jwt.sign(
      { userId, role, iat: Math.floor(Date.now() / 1000) },
      this.jwtSecret,
      { expiresIn: this.tokenExpiry } as jwt.SignOptions
    );
  }

  private verifyToken(token: string): { userId: string; role: string } | null {
    try {
      const decoded = jwt.verify(token, this.jwtSecret) as { userId: string; role: string };
      return decoded;
    } catch (error) {
      return null;
    }
  }

  async register(data: RegisterData): Promise<{ user: AuthUser; session: AuthSession }> {
    // Check if user already exists (in a real app, you'd check database)
    // For now, we'll generate a user ID based on email
    
    const userId = crypto.createHash('sha256').update(data.email).digest('hex').substring(0, 16);
    
    // Create user profile
    const userProfile: UserProfile = {
      userId,
      displayName: data.displayName,
      email: data.email,
      role: 'user',
      permissions: ['view_dashboard', 'edit_preferences'],
      preferences: await this.userService.getUserPreferences(userId)
    };

    // Update profile with display name
    await this.userService.updateUserProfile(userId, {
      displayName: data.displayName,
      email: data.email
    });

    // Create session
    const session = await this.createSession(userId);

    const authUser: AuthUser = {
      userId,
      displayName: data.displayName,
      email: data.email,
      role: 'user',
      permissions: ['view_dashboard', 'edit_preferences']
    };

    return { user: authUser, session };
  }

  async login(credentials: LoginCredentials, ipAddress?: string, userAgent?: string): Promise<{ user: AuthUser; session: AuthSession } | null> {
    // In a real app, you'd verify credentials against database
    // For demo purposes, we'll accept any email/password and create a user
    
    const userId = crypto.createHash('sha256').update(credentials.email).digest('hex').substring(0, 16);
    
    // Get or create user profile
    let userProfile: UserProfile;
    try {
      userProfile = await this.userService.getUserProfile(userId);
    } catch {
      // Create new user if doesn't exist
      userProfile = {
        userId,
        displayName: credentials.email.split('@')[0],
        email: credentials.email,
        role: 'user',
        permissions: ['view_dashboard', 'edit_preferences'],
        preferences: await this.userService.getUserPreferences(userId)
      };
      
      await this.userService.updateUserProfile(userId, {
        displayName: credentials.email.split('@')[0],
        email: credentials.email
      });
    }

    // Create session
    const session = await this.createSession(userId, ipAddress, userAgent);

    const authUser: AuthUser = {
      userId,
      displayName: userProfile.displayName,
      email: userProfile.email,
      role: userProfile.role,
      permissions: userProfile.permissions
    };

    return { user: authUser, session };
  }

  async createSession(userId: string, ipAddress?: string, userAgent?: string): Promise<AuthSession> {
    const sessionId = this.generateSessionId();
    const token = this.generateToken(userId, 'user');
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(); // 7 days

    const session: AuthSession = {
      sessionId,
      userId,
      token,
      expiresAt,
      ipAddress,
      userAgent,
      createdAt: new Date().toISOString()
    };

    this.sessions.set(sessionId, session);
    return session;
  }

  async validateSession(sessionId: string, token: string): Promise<{ valid: boolean; user?: AuthUser; session?: AuthSession }> {
    const session = this.sessions.get(sessionId);
    
    if (!session) {
      return { valid: false };
    }

    // Check if session is expired
    if (new Date(session.expiresAt) < new Date()) {
      this.sessions.delete(sessionId);
      return { valid: false };
    }

    // Verify token
    const decoded = this.verifyToken(token);
    if (!decoded || decoded.userId !== session.userId) {
      return { valid: false };
    }

    // Get user profile
    try {
      const userProfile = await this.userService.getUserProfile(session.userId);
      
      const authUser: AuthUser = {
        userId: userProfile.userId,
        displayName: userProfile.displayName,
        email: userProfile.email,
        role: userProfile.role,
        permissions: userProfile.permissions
      };

      return { valid: true, user: authUser, session };
    } catch (error) {
      return { valid: false };
    }
  }

  async logout(sessionId: string): Promise<boolean> {
    return this.sessions.delete(sessionId);
  }

  async logoutAllUserSessions(userId: string): Promise<number> {
    let count = 0;
    this.sessions.forEach((session, sessionId) => {
      if (session.userId === userId) {
        this.sessions.delete(sessionId);
        count++;
      }
    });
    return count;
  }

  async getUserSessions(userId: string): Promise<AuthSession[]> {
    const sessions: AuthSession[] = [];
    this.sessions.forEach((session) => {
      if (session.userId === userId) {
        sessions.push(session);
      }
    });
    return sessions;
  }

  async updateUserRole(userId: string, role: 'admin' | 'user' | 'viewer'): Promise<boolean> {
    try {
      await this.userService.updateUserProfile(userId, { role });
      return true;
    } catch (error) {
      console.error('Error updating user role:', error);
      return false;
    }
  }

  async updateUserPermissions(userId: string, permissions: string[]): Promise<boolean> {
    try {
      await this.userService.updateUserProfile(userId, { permissions });
      return true;
    } catch (error) {
      console.error('Error updating user permissions:', error);
      return false;
    }
  }

  async getUserById(userId: string): Promise<AuthUser | null> {
    try {
      const userProfile = await this.userService.getUserProfile(userId);
      
      return {
        userId: userProfile.userId,
        displayName: userProfile.displayName,
        email: userProfile.email,
        role: userProfile.role,
        permissions: userProfile.permissions
      };
    } catch (error) {
      return null;
    }
  }

  async getAllUsers(): Promise<AuthUser[]> {
    try {
      const profiles = await this.userService.getAllUsers();
      
      return profiles.map(profile => ({
        userId: profile.userId,
        displayName: profile.displayName,
        email: profile.email,
        role: profile.role,
        permissions: profile.permissions
      }));
    } catch (error) {
      return [];
    }
  }

  private cleanupExpiredSessions(): void {
    const now = new Date();
    let expiredCount = 0;

    this.sessions.forEach((session, sessionId) => {
      if (new Date(session.expiresAt) < now) {
        this.sessions.delete(sessionId);
        expiredCount++;
      }
    });

    if (expiredCount > 0) {
      console.log(`🧹 Cleaned up ${expiredCount} expired sessions`);
    }
  }

  // Middleware for Express/Next.js
  getAuthMiddleware() {
    return async (req: any, res: any, next: any) => {
      try {
        const authHeader = req.headers.authorization;
        
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
          req.user = null;
          return next();
        }

        const token = authHeader.substring(7);
        const sessionId = req.headers['x-session-id'] as string;

        if (!sessionId) {
          req.user = null;
          return next();
        }

        const validation = await this.validateSession(sessionId, token);
        
        if (validation.valid && validation.user) {
          req.user = validation.user;
          req.session = validation.session;
        } else {
          req.user = null;
        }

        next();
      } catch (error) {
        console.error('Auth middleware error:', error);
        req.user = null;
        next();
      }
    };
  }

  // API route handlers
  getLoginHandler() {
    return async (req: any, res: any) => {
      try {
        const { email, password } = req.body;
        const ipAddress = req.ip;
        const userAgent = req.headers['user-agent'];

        if (!email || !password) {
          return res.status(400).json({ error: 'Email and password required' });
        }

        const result = await this.login({ email, password }, ipAddress, userAgent);

        if (!result) {
          return res.status(401).json({ error: 'Invalid credentials' });
        }

        res.json({
          user: result.user,
          session: result.session,
          message: 'Login successful'
        });
      } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Internal server error' });
      }
    };
  }

  getLogoutHandler() {
    return async (req: any, res: any) => {
      try {
        const sessionId = req.headers['x-session-id'] as string;
        
        if (sessionId) {
          await this.logout(sessionId);
        }

        res.json({ message: 'Logout successful' });
      } catch (error) {
        console.error('Logout error:', error);
        res.status(500).json({ error: 'Internal server error' });
      }
    };
  }

  getRegisterHandler() {
    return async (req: any, res: any) => {
      try {
        const { email, password, displayName } = req.body;
        const ipAddress = req.ip;
        const userAgent = req.headers['user-agent'];

        if (!email || !password || !displayName) {
          return res.status(400).json({ error: 'Email, password, and display name required' });
        }

        const result = await this.register({ email, password, displayName });

        res.status(201).json({
          user: result.user,
          session: result.session,
          message: 'Registration successful'
        });
      } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Internal server error' });
      }
    };
  }

  getValidateHandler() {
    return async (req: any, res: any) => {
      try {
        const sessionId = req.headers['x-session-id'] as string;
        const token = req.headers.authorization?.substring(7);

        if (!sessionId || !token) {
          return res.status(401).json({ valid: false });
        }

        const validation = await this.validateSession(sessionId, token);
        res.json(validation);
      } catch (error) {
        console.error('Validation error:', error);
        res.status(500).json({ error: 'Internal server error' });
      }
    };
  }
}

// Singleton instance
let authInstance: AuthenticationService | null = null;

export function getAuthService(): AuthenticationService {
  if (!authInstance) {
    authInstance = new AuthenticationService();
  }
  return authInstance;
}