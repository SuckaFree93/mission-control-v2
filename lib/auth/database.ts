// Authentication Database
// SQLite for development, can be replaced with PostgreSQL for production

import { Database } from 'sqlite';
import { open } from 'sqlite';
import * as sqlite3 from 'sqlite3';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

export interface User {
  id: string;
  email: string;
  username: string;
  passwordHash: string;
  role: 'admin' | 'user' | 'viewer';
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
  isActive: boolean;
}

export interface Session {
  id: string;
  userId: string;
  token: string;
  refreshToken: string;
  expiresAt: string;
  createdAt: string;
  userAgent?: string;
  ipAddress?: string;
  isRevoked: boolean;
}

export class AuthDatabase {
  private db: Database | null = null;

  async initialize(): Promise<void> {
    try {
      console.log('Initializing Authentication Database...');
      
      // Use file-based database for auth to persist user data
      const dbPath = process.env.NODE_ENV === 'production'
        ? '/tmp/auth.db' // For Vercel/serverless
        : path.join(process.cwd(), 'auth.db');
      
      this.db = await open({
        filename: dbPath,
        driver: sqlite3.Database
      });

      await this.initializeSchema();
      await this.createDefaultAdminUser();
      
      console.log('Authentication Database initialized successfully');
    } catch (error) {
      console.error('Failed to initialize Authentication Database:', error);
      throw error;
    }
  }

  private async initializeSchema(): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    // Users table
    await this.db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        username TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        role TEXT NOT NULL DEFAULT 'user',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        last_login_at DATETIME,
        is_active BOOLEAN DEFAULT 1
      )
    `);

    // Sessions table
    await this.db.exec(`
      CREATE TABLE IF NOT EXISTS sessions (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        token TEXT NOT NULL,
        refresh_token TEXT NOT NULL,
        expires_at DATETIME NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        user_agent TEXT,
        ip_address TEXT,
        is_revoked BOOLEAN DEFAULT 0,
        FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
      )
    `);

    // Create indexes
    await this.db.exec('CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)');
    await this.db.exec('CREATE INDEX IF NOT EXISTS idx_users_username ON users(username)');
    await this.db.exec('CREATE INDEX IF NOT EXISTS idx_sessions_token ON sessions(token)');
    await this.db.exec('CREATE INDEX IF NOT EXISTS idx_sessions_refresh_token ON sessions(refresh_token)');
    await this.db.exec('CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions(user_id)');
  }

  private async createDefaultAdminUser(): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    try {
      // Check if admin user already exists
      const existingAdmin = await this.db.get(
        'SELECT id FROM users WHERE email = ?',
        'admin@mission-control.ai'
      );

      // The correct bcrypt hash for 'admin123'
      const correctPasswordHash = '$2b$10$qtLxWqiMqBnCLSxeWjOAt.JCR0wnkrDjhAQ9srLj/BihIBurxfYT2';
      
      if (!existingAdmin) {
        // Create default admin user (password: admin123)
        const adminId = uuidv4();
        
        await this.db.run(
          `INSERT INTO users (id, email, username, password_hash, role, is_active) 
           VALUES (?, ?, ?, ?, ?, ?)`,
          [adminId, 'admin@mission-control.ai', 'admin', correctPasswordHash, 'admin', 1]
        );
        
        console.log('✅ Default admin user created: admin@mission-control.ai / admin123');
        console.log('User ID:', adminId);
        console.log('Password hash:', correctPasswordHash);
      } else {
        console.log('✅ Admin user already exists');
        console.log('Admin ID:', existingAdmin.id);
        
        // Always ensure the admin password hash is correct
        if (existingAdmin.password_hash !== correctPasswordHash) {
          console.log('🔄 Updating admin password to correct hash...');
          await this.db.run(
            `UPDATE users SET password_hash = ? WHERE email = 'admin@mission-control.ai'`,
            correctPasswordHash
          );
          console.log('✅ Admin password hash updated');
        } else {
          console.log('✅ Admin password hash is already correct');
        }
      }
    } catch (error) {
      console.error('Error creating default admin user:', error);
    }
  }

  async getUserByEmail(email: string): Promise<User | null> {
    if (!this.db) throw new Error('Database not initialized');
    
    const user = await this.db.get(
      `SELECT 
        id, email, username, password_hash as passwordHash, 
        role, created_at as createdAt, updated_at as updatedAt,
        last_login_at as lastLoginAt, is_active as isActive
       FROM users 
       WHERE email = ? AND is_active = 1`,
      email
    );
    
    return user || null;
  }

  async getUserByUsername(username: string): Promise<User | null> {
    if (!this.db) throw new Error('Database not initialized');
    
    const user = await this.db.get(
      `SELECT 
        id, email, username, password_hash as passwordHash, 
        role, created_at as createdAt, updated_at as updatedAt,
        last_login_at as lastLoginAt, is_active as isActive
       FROM users 
       WHERE username = ? AND is_active = 1`,
      username
    );
    
    return user || null;
  }

  async getUserById(id: string): Promise<User | null> {
    if (!this.db) throw new Error('Database not initialized');
    
    const user = await this.db.get(
      `SELECT 
        id, email, username, password_hash as passwordHash, 
        role, created_at as createdAt, updated_at as updatedAt,
        last_login_at as lastLoginAt, is_active as isActive
       FROM users 
       WHERE id = ? AND is_active = 1`,
      id
    );
    
    return user || null;
  }

  async createUser(userData: {
    email: string;
    username: string;
    passwordHash: string;
    role?: 'admin' | 'user' | 'viewer';
  }): Promise<User> {
    if (!this.db) throw new Error('Database not initialized');
    
    const id = uuidv4();
    const now = new Date().toISOString();
    
    await this.db.run(
      `INSERT INTO users (id, email, username, password_hash, role, created_at, updated_at, is_active)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        userData.email,
        userData.username,
        userData.passwordHash,
        userData.role || 'user',
        now,
        now,
        1
      ]
    );
    
    return {
      id,
      email: userData.email,
      username: userData.username,
      passwordHash: userData.passwordHash,
      role: userData.role || 'user',
      createdAt: now,
      updatedAt: now,
      isActive: true
    };
  }

  async updateUserLastLogin(userId: string): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');
    
    await this.db.run(
      'UPDATE users SET last_login_at = ? WHERE id = ?',
      [new Date().toISOString(), userId]
    );
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
    if (!this.db) throw new Error('Database not initialized');
    
    const id = uuidv4();
    const now = new Date().toISOString();
    
    await this.db.run(
      `INSERT INTO sessions (id, user_id, token, refresh_token, expires_at, created_at, user_agent, ip_address, is_revoked)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        sessionData.userId,
        sessionData.token,
        sessionData.refreshToken,
        sessionData.expiresAt,
        now,
        sessionData.userAgent || null,
        sessionData.ipAddress || null,
        0
      ]
    );
    
    return {
      id,
      userId: sessionData.userId,
      token: sessionData.token,
      refreshToken: sessionData.refreshToken,
      expiresAt: sessionData.expiresAt,
      createdAt: now,
      userAgent: sessionData.userAgent,
      ipAddress: sessionData.ipAddress,
      isRevoked: false
    };
  }

  async getSessionByToken(token: string): Promise<Session | null> {
    if (!this.db) throw new Error('Database not initialized');
    
    const session = await this.db.get(
      `SELECT 
        id, user_id as userId, token, refresh_token as refreshToken,
        expires_at as expiresAt, created_at as createdAt,
        user_agent as userAgent, ip_address as ipAddress, is_revoked as isRevoked
       FROM sessions 
       WHERE token = ? AND is_revoked = 0 AND expires_at > ?`,
      [token, new Date().toISOString()]
    );
    
    return session || null;
  }

  async getSessionByRefreshToken(refreshToken: string): Promise<Session | null> {
    if (!this.db) throw new Error('Database not initialized');
    
    const session = await this.db.get(
      `SELECT 
        id, user_id as userId, token, refresh_token as refreshToken,
        expires_at as expiresAt, created_at as createdAt,
        user_agent as userAgent, ip_address as ipAddress, is_revoked as isRevoked
       FROM sessions 
       WHERE refresh_token = ? AND is_revoked = 0`,
      refreshToken
    );
    
    return session || null;
  }

  async revokeSession(sessionId: string): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');
    
    await this.db.run(
      'UPDATE sessions SET is_revoked = 1 WHERE id = ?',
      sessionId
    );
  }

  async revokeAllUserSessions(userId: string): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');
    
    await this.db.run(
      'UPDATE sessions SET is_revoked = 1 WHERE user_id = ?',
      userId
    );
  }

  async cleanupExpiredSessions(): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');
    
    await this.db.run(
      'DELETE FROM sessions WHERE expires_at < ?',
      new Date().toISOString()
    );
  }

  async close(): Promise<void> {
    if (this.db) {
      await this.db.close();
      this.db = null;
    }
  }
}

// Singleton instance
let authDBInstance: AuthDatabase | null = null;

export async function getAuthDB(): Promise<AuthDatabase> {
  if (!authDBInstance) {
    authDBInstance = new AuthDatabase();
    await authDBInstance.initialize();
  }
  return authDBInstance;
}