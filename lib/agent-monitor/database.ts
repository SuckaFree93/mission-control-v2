// Agent Monitor Database Types
// SQLite implementation removed for Vercel compatibility

import { AgentHealth, RecoveryAttempt, GatewayStatus } from './types';

// Database interface for compatibility
export interface AgentMonitorDatabaseInterface {
  // Agent methods
  getAgentHealth(agentId: string): Promise<AgentHealth | null>;
  getAllAgents(): Promise<AgentHealth[]>;
  updateAgentHealth(agentId: string, updates: Partial<AgentHealth>): Promise<void>;
  
  // Recovery methods
  recordRecoveryAttempt(attempt: Omit<RecoveryAttempt, 'id' | 'createdAt'>): Promise<RecoveryAttempt>;
  getRecoveryAttempts(agentId: string, limit?: number): Promise<RecoveryAttempt[]>;
  
  // Gateway status methods
  recordGatewayStatus(status: Omit<GatewayStatus, 'id'>): Promise<GatewayStatus>;
  getHealthEvents(limit?: number): Promise<GatewayStatus[]>;
  getLatestGatewayStatus(): Promise<GatewayStatus | null>;
  
  // Maintenance
  cleanupOldData(daysToKeep?: number): Promise<void>;
  
  // Initialization
  initialize(): Promise<void>;
}