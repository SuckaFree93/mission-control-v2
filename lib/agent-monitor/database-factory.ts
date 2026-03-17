// Agent Monitor Database Factory - Always use memory database for Vercel compatibility
import { MemoryAgentMonitorDatabase } from './memory-db';

export type AgentDbType = 'memory';

let agentDbInstance: MemoryAgentMonitorDatabase | null = null;
let currentAgentDbType: AgentDbType = 'memory';

export async function getAgentMonitorDatabase(): Promise<MemoryAgentMonitorDatabase> {
  if (agentDbInstance) {
    return agentDbInstance;
  }

  // Always use memory database for Vercel compatibility
  try {
    console.log('🔄 Initializing Agent Monitor Memory database (Vercel compatible)...');
    const memoryDb = new MemoryAgentMonitorDatabase();
    await memoryDb.initialize();
    agentDbInstance = memoryDb;
    currentAgentDbType = 'memory';
    console.log('✅ Agent Monitor Memory database initialized successfully');
    return agentDbInstance;
  } catch (memoryError) {
    console.error('❌ Agent Monitor Memory database initialization failed');
    console.error('Memory database error:', memoryError.message);
    throw new Error('Failed to initialize agent monitor database');
  }
}

export function getCurrentAgentDbType(): AgentDbType {
  return currentAgentDbType;
}

export function isUsingMemoryAgentDb(): boolean {
  return true; // Always true for Vercel
}

// Singleton export for backward compatibility
let agentMonitorDBInstance: MemoryAgentMonitorDatabase | null = null;

export async function agentMonitorDB(): Promise<MemoryAgentMonitorDatabase> {
  if (!agentMonitorDBInstance) {
    agentMonitorDBInstance = await getAgentMonitorDatabase();
  }
  return agentMonitorDBInstance;
}