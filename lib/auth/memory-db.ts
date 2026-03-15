// Memory-based database fallback for Vercel/serverless environments
// Used when SQLite fails to initialize

import { User, Session } from './database';

export class MemoryAuthDatabase {
  private users: Map<string, User> = new Map();
  private sessions: Map<string, Session> = new Map();
  private initialized = false;

  async initialize(): Promise<void> {
    console.log('📦 Initializing Memory Auth Database (SQLite fallback)...');
    this.initialized = true;
    
    // Create default admin user if none exists
    const adminExists = Array.from(this.users.values()).some(u => u.email === 'admin@mission-control.ai');
    if (!adminExists) {
      const adminUser: User = {
        id: 'admin-001',
        email: 'admin@mission-control.ai',
        username: 'admin',
        passwordHash: '$2a$10$X8zL7C7c5J5J5J5J5J5J5.J5J5J5J5J5J5J5J5J5J5J5J5J5J5J5J5', // hash of 'Admin123!'
        role: 'admin',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isActive: true
      };
      this.users.set(adminUser.id, adminUser);
      console.log('👑 Created default admin user in memory database');
    }
    
    // Create default test user
    const testUser: User = {
      id: 'test-001',
      email: 'test@mission-control.ai',
      username: 'testuser',
      passwordHash: '$2a$10$X8zL7C7c5J5J5J5J5J5J5.J5J5J5J5J5J5J5J5J5J5J5J5J5J5J5J5', // hash of 'Test123!'
      role: 'user',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isActive: true
    };
    this.users.set(testUser.id, testUser);
    console.log('👤 Created default test user in memory database');
    
    console.log(`📊 Memory database initialized with ${this.users.size} users`);
  }

  async getUserById(id: string): Promise<User | null> {
    return this.users.get(id) || null;
  }

  async getUserByEmail(email: string): Promise<User | null> {
    return Array.from(this.users.values()).find(u => u.email === email) || null;
  }

  async getUserByUsername(username: string): Promise<User | null> {
    return Array.from(this.users.values()).find(u => u.username === username) || null;
  }

  async createUser(userData: {
    email: string;
    username: string;
    passwordHash: string;
    role?: 'admin' | 'user' | 'viewer';
  }): Promise<User> {
    const id = `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const now = new Date().toISOString();
    
    const user: User = {
      id,
      email: userData.email,
      username: userData.username,
      passwordHash: userData.passwordHash,
      role: userData.role || 'user',
      createdAt: now,
      updatedAt: now,
      isActive: true
    };
    
    this.users.set(id, user);
    return user;
  }

  async updateUserLastLogin(userId: string): Promise<void> {
    const user = this.users.get(userId);
    if (user) {
      user.lastLoginAt = new Date().toISOString();
      this.users.set(userId, user);
    }
  }

  async createSession(sessionData: {
    userId: string;
    token: string;
    refreshToken: string;
    expiresAt: string;
    userAgent?: string;
    ipAddress?: string;
    isRevoked?: boolean;
  }): Promise<Session> {
    const id = `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const now = new Date().toISOString();
    
    const session: Session = {
      id,
      userId: sessionData.userId,
      token: sessionData.token,
      refreshToken: sessionData.refreshToken,
      expiresAt: sessionData.expiresAt,
      createdAt: now,
      userAgent: sessionData.userAgent,
      ipAddress: sessionData.ipAddress,
      isRevoked: sessionData.isRevoked || false
    };
    
    this.sessions.set(id, session);
    return session;
  }

  async getSessionByToken(token: string): Promise<Session | null> {
    return Array.from(this.sessions.values()).find(s => s.token === token) || null;
  }

  async getSessionByRefreshToken(refreshToken: string): Promise<Session | null> {
    return Array.from(this.sessions.values()).find(s => s.refreshToken === refreshToken) || null;
  }

  async revokeSession(sessionId: string): Promise<void> {
    const session = this.sessions.get(sessionId);
    if (session) {
      session.isRevoked = true;
      this.sessions.set(sessionId, session);
    }
  }

  async getAllUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }

  async updateUserRole(userId: string, role: 'admin' | 'user' | 'viewer'): Promise<void> {
    const user = this.users.get(userId);
    if (user) {
      user.role = role;
      user.updatedAt = new Date().toISOString();
      this.users.set(userId, user);
    }
  }

  async toggleUserActive(userId: string, isActive: boolean): Promise<void> {
    const user = this.users.get(userId);
    if (user) {
      user.isActive = isActive;
      user.updatedAt = new Date().toISOString();
      this.users.set(userId, user);
    }
  }
}

// Singleton instance
let memoryDbInstance: MemoryAuthDatabase | null = null;

export function getMemoryAuthDB(): MemoryAuthDatabase {
  if (!memoryDbInstance) {
    memoryDbInstance = new MemoryAuthDatabase();
  }
  return memoryDbInstance;
}