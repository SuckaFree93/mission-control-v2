// Database factory - Always use memory database for Vercel compatibility
import { MemoryAuthDatabase } from './memory-db';
import { AuthDatabaseInterface } from './database';

export type DatabaseType = 'memory';

let dbInstance: MemoryAuthDatabase | null = null;
let currentDbType: DatabaseType = 'memory';

export async function getDatabase(): Promise<AuthDatabaseInterface> {
  if (dbInstance) {
    return dbInstance;
  }

  // Always use memory database for Vercel compatibility
  try {
    console.log('🔄 Initializing Memory database (Vercel compatible)...');
    const memoryDb = new MemoryAuthDatabase();
    await memoryDb.initialize();
    dbInstance = memoryDb;
    currentDbType = 'memory';
    console.log('✅ Memory database initialized successfully');
    return dbInstance;
  } catch (memoryError) {
    console.error('❌ Memory database initialization failed');
    console.error('Memory database error:', memoryError.message);
    throw new Error('Failed to initialize database backend');
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