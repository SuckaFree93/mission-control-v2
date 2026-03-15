// Authentication Database
// SQLite for development, can be replaced with PostgreSQL for production

import { Database } from 'sqlite';
import { open } from 'sqlite';
import * as sqlite3 from 'sqlite3';
import path from 'path';

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
  private db: Database.Database;

  constructor() {
    const dbPath = process.env.NODE_ENV === 'production'
      ? '/tmp/auth.db' // For Vercel/serverless
      : path.join(process.cwd(), 'auth.db');
    
    this.db = new Database(dbPath);
    this.initializeSchema();
  }

  private initializeSchema() {
    // Users table
    this.db.exec(`
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
    this.db.exec(`
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
    this.db.exec('CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)');
    this.db.exec('CREATE INDEX IF NOT EXISTS idx_sessions_token ON sessions(token)');
    this.db.exec('CREATE INDEX IF NOT EXISTS idx_sessions_refresh_token ON sessions(refresh_token)');
    this.db.exec('CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions(user_id)');

    // Insert default admin user if not exists (development only)
    if (process.env.NODE_ENV === 'development') {
      const adminExists = this.db.prepare('SELECT id FROM users WHERE email = ?').get('admin@mission-control.ai');
      if (!adminExists) {
        const bcrypt = require('bcryptjs');
        const passwordHash = bcrypt.hashSync('admin123', 10);
        
        this.db.prepare(`
          INSERT INTO users (id, email, username, password_hash, role)
          VALUES (?, ?, ?, ?, ?)
        `).run(
          'admin-001',
          'admin@mission-control.ai',
          'admin',
          passwordHash,
          'admin'
        );
        
        console.log('✅ Created default admin user: admin@mission-control.ai / admin123');
      }
    }
  }

  // User operations
  createUser(user: Omit<User, 'id' | 'createdAt' | 'updatedAt' | 'isActive'>): User {
    const id = `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    const stmt = this.db.prepare(`
      INSERT INTO users (id, email, username, password_hash, role, last_login_at)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    
    stmt.run(
      id,
      user.email,
      user.username,
      user.passwordHash,
      user.role,
      new Date().toISOString()
    );
    
    return this.getUserById(id)!;
  }

  getUserById(id: string): User | null {
    const user = this.db.prepare(`
      SELECT 
        id, email, username, password_hash as passwordHash, role,
        created_at as createdAt, updated_at as updatedAt,
        last_login_at as lastLoginAt, is_active as isActive
      FROM users 
      WHERE id = ?
    `).get(id) as User | undefined;
    
    return user || null;
  }

  getUserByEmail(email: string): User | null {
    const user = this.db.prepare(`
      SELECT 
        id, email, username, password_hash as passwordHash, role,
        created_at as createdAt, updated_at as updatedAt,
        last_login_at as lastLoginAt, is_active as isActive
      FROM users 
      WHERE email = ?
    `).get(email) as User | undefined;
    
    return user || null;
  }

  getUserByUsername(username: string): User | null {
    const user = this.db.prepare(`
      SELECT 
        id, email, username, password_hash as passwordHash, role,
        created_at as createdAt, updated_at as updatedAt,
        last_login_at as lastLoginAt, is_active as isActive
      FROM users 
      WHERE username = ?
    `).get(username) as User | undefined;
    
    return user || null;
  }

  updateUserLastLogin(userId: string): void {
    this.db.prepare(`
      UPDATE users 
      SET last_login_at = ?, updated_at = ?
      WHERE id = ?
    `).run(new Date().toISOString(), new Date().toISOString(), userId);
  }

  // Session operations
  createSession(session: Omit<Session, 'id' | 'createdAt' | 'isRevoked'>): Session {
    const id = `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    const stmt = this.db.prepare(`
      INSERT INTO sessions (id, user_id, token, refresh_token, expires_at, user_agent, ip_address)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    
    stmt.run(
      id,
      session.userId,
      session.token,
      session.refreshToken,
      session.expiresAt,
      session.userAgent,
      session.ipAddress
    );
    
    return this.getSessionById(id)!;
  }

  getSessionById(id: string): Session | null {
    const session = this.db.prepare(`
      SELECT 
        id, user_id as userId, token, refresh_token as refreshToken,
        expires_at as expiresAt, created_at as createdAt,
        user_agent as userAgent, ip_address as ipAddress,
        is_revoked as isRevoked
      FROM sessions 
      WHERE id = ?
    `).get(id) as Session | undefined;
    
    return session || null;
  }

  getSessionByToken(token: string): Session | null {
    const session = this.db.prepare(`
      SELECT 
        id, user_id as userId, token, refresh_token as refreshToken,
        expires_at as expiresAt, created_at as createdAt,
        user_agent as userAgent, ip_address as ipAddress,
        is_revoked as isRevoked
      FROM sessions 
      WHERE token = ? AND is_revoked = 0
    `).get(token) as Session | undefined;
    
    return session || null;
  }

  getSessionByRefreshToken(refreshToken: string): Session | null {
    const session = this.db.prepare(`
      SELECT 
        id, user_id as userId, token, refresh_token as refreshToken,
        expires_at as expiresAt, created_at as createdAt,
        user_agent as userAgent, ip_address as ipAddress,
        is_revoked as isRevoked
      FROM sessions 
      WHERE refresh_token = ? AND is_revoked = 0
    `).get(refreshToken) as Session | undefined;
    
    return session || null;
  }

  revokeSession(token: string): void {
    this.db.prepare(`
      UPDATE sessions 
      SET is_revoked = 1 
      WHERE token = ?
    `).run(token);
  }

  revokeAllUserSessions(userId: string): void {
    this.db.prepare(`
      UPDATE sessions 
      SET is_revoked = 1 
      WHERE user_id = ?
    `).run(userId);
  }

  cleanupExpiredSessions(): number {
    const result = this.db.prepare(`
      DELETE FROM sessions 
      WHERE expires_at < ? OR is_revoked = 1
    `).run(new Date().toISOString());
    
    return result.changes;
  }

  // Statistics
  getUserCount(): number {
    const result = this.db.prepare('SELECT COUNT(*) as count FROM users').get() as { count: number };
    return result.count;
  }

  getActiveSessionCount(): number {
    const result = this.db.prepare(`
      SELECT COUNT(*) as count FROM sessions 
      WHERE is_revoked = 0 AND expires_at > ?
    `).get(new Date().toISOString()) as { count: number };
    return result.count;
  }

  // Close database connection
  close(): void {
    this.db.close();
  }
}

// Singleton instance
let authDB: AuthDatabase | null = null;

export function getAuthDatabase(): AuthDatabase {
  if (!authDB) {
    authDB = new AuthDatabase();
  }
  return authDB;
}