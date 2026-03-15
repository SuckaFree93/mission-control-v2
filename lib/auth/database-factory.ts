// Database factory - chooses between SQLite and memory database based on environment
import { AuthDatabase } from './database';
import { MemoryAuthDatabase } from './memory-db';

export type DatabaseType = 'sqlite' | 'memory';

let dbInstance: AuthDatabase | MemoryAuthDatabase | null = null;
let currentDbType: DatabaseType = 'sqlite';

export async function getDatabase(): Promise<AuthDatabase | MemoryAuthDatabase> {
  if (dbInstance) {
    return dbInstance;
  }

  // Try SQLite first, fall back to memory if it fails
  try {
    console.log('🔄 Attempting to initialize SQLite database...');
    const sqliteDb = new AuthDatabase();
    await sqliteDb.initialize();
    dbInstance = sqliteDb;
    currentDbType = 'sqlite';
    console.log('✅ SQLite database initialized successfully');
    return dbInstance;
  } catch (sqliteError) {
    console.warn('⚠️ SQLite initialization failed, falling back to memory database');
    console.warn('Error details:', sqliteError.message);
    
    // Fall back to memory database
    try {
      const memoryDb = new MemoryAuthDatabase();
      await memoryDb.initialize();
      dbInstance = memoryDb;
      currentDbType = 'memory';
      console.log('✅ Memory database initialized as fallback');
      return dbInstance;
    } catch (memoryError) {
      console.error('❌ Both SQLite and memory database initialization failed');
      console.error('Memory database error:', memoryError.message);
      throw new Error('Failed to initialize any database backend');
    }
  }
}

export function getCurrentDbType(): DatabaseType {
  return currentDbType;
}

export function isUsingMemoryDb(): boolean {
  return currentDbType === 'memory';
}

export function isUsingSqliteDb(): boolean {
  return currentDbType === 'sqlite';
}

// Helper function to get the appropriate database for auth
export async function getAuthDB() {
  const db = await getDatabase();
  return db;
}