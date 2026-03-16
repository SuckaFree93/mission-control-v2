// Agent Monitor Database Factory - chooses between SQLite and memory database
import { AgentMonitorDatabase } from './database';
import { MemoryAgentMonitorDatabase } from './memory-db';

export type AgentDbType = 'sqlite' | 'memory';

let agentDbInstance: AgentMonitorDatabase | MemoryAgentMonitorDatabase | null = null;
let currentAgentDbType: AgentDbType = 'sqlite';

export async function getAgentMonitorDatabase(): Promise<AgentMonitorDatabase | MemoryAgentMonitorDatabase> {
  if (agentDbInstance) {
    return agentDbInstance;
  }

  // Try SQLite first, fall back to memory if it fails
  try {
    console.log('🔄 Attempting to initialize Agent Monitor SQLite database...');
    const sqliteDb = new AgentMonitorDatabase();
    await sqliteDb.initialize();
    agentDbInstance = sqliteDb;
    currentAgentDbType = 'sqlite';
    console.log('✅ Agent Monitor SQLite database initialized successfully');
    return agentDbInstance;
  } catch (sqliteError) {
    console.warn('⚠️ Agent Monitor SQLite initialization failed, falling back to memory database');
    console.warn('Error details:', sqliteError.message);
    
    // Fall back to memory database
    try {
      const memoryDb = new MemoryAgentMonitorDatabase();
      await memoryDb.initialize();
      agentDbInstance = memoryDb;
      currentAgentDbType = 'memory';
      console.log('✅ Agent Monitor Memory database initialized as fallback');
      return agentDbInstance;
    } catch (memoryError) {
      console.error('❌ Both Agent Monitor SQLite and memory database initialization failed');
      console.error('Memory database error:', memoryError.message);
      throw new Error('Failed to initialize any agent monitor database backend');
    }
  }
}

export function getCurrentAgentDbType(): AgentDbType {
  return currentAgentDbType;
}

export function isUsingMemoryAgentDb(): boolean {
  return currentAgentDbType === 'memory';
}

export function isUsingSqliteAgentDb(): boolean {
  return currentAgentDbType === 'sqlite';
}

// Singleton export for backward compatibility
let agentMonitorDBInstance: AgentMonitorDatabase | MemoryAgentMonitorDatabase | null = null;

export async function agentMonitorDB(): Promise<AgentMonitorDatabase | MemoryAgentMonitorDatabase> {
  if (!agentMonitorDBInstance) {
    agentMonitorDBInstance = await getAgentMonitorDatabase();
  }
  return agentMonitorDBInstance;
}