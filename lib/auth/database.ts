// Authentication Database Types
// SQLite implementation removed for Vercel compatibility

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

// Database interface for compatibility
export interface AuthDatabaseInterface {
  // User methods
  getUserById(id: string): Promise<User | null>;
  getUserByEmail(email: string): Promise<User | null>;
  getUserByUsername(username: string): Promise<User | null>;
  createUser(userData: {
    email: string;
    username: string;
    passwordHash: string;
    role?: 'admin' | 'user' | 'viewer';
  }): Promise<User>;
  updateUserLastLogin(userId: string): Promise<void>;
  getAllUsers(): Promise<User[]>;
  updateUserRole(userId: string, role: 'admin' | 'user' | 'viewer'): Promise<void>;
  toggleUserActive(userId: string, isActive: boolean): Promise<void>;
  
  // Session methods
  createSession(sessionData: {
    userId: string;
    token: string;
    refreshToken: string;
    expiresAt: string;
    userAgent?: string;
    ipAddress?: string;
    isRevoked?: boolean;
  }): Promise<Session>;
  getSessionByToken(token: string): Promise<Session | null>;
  getSessionByRefreshToken(refreshToken: string): Promise<Session | null>;
  revokeSession(sessionId: string): Promise<void>;
  revokeAllUserSessions(userId: string): Promise<void>;
  
  // Initialization
  initialize(): Promise<void>;
}