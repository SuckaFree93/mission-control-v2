// Memory-based database for Agent Monitor (Vercel/serverless compatible)
import { AgentHealth, RecoveryAttempt, GatewayStatus } from './types';

export class MemoryAgentMonitorDatabase {
  private agents: Map<string, AgentHealth> = new Map();
  private recoveryAttempts: Map<string, RecoveryAttempt> = new Map();
  private gatewayStatuses: GatewayStatus[] = [];
  private initialized = false;

  async initialize(): Promise<void> {
    console.log('📦 Initializing Memory Agent Monitor Database...');
    this.initialized = true;
    
    // Initialize with some sample data for development
    const sampleAgent: AgentHealth = {
      id: 'gateway-001',
      name: 'OpenClaw Gateway',
      status: 'healthy',
      lastHeartbeat: new Date().toISOString(),
      responseTime: 150,
      errorCount: 0,
      uptime: 86400, // 24 hours in seconds
      cpuUsage: 12.5,
      memoryUsage: 520.87,
      autoRecoveryEnabled: true,
      recoveryAttempts: 2,
      maxRecoveryAttempts: 3,
      lastRecoveryAttempt: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
      createdAt: new Date(Date.now() - 86400000).toISOString(), // 24 hours ago
      updatedAt: new Date().toISOString()
    };
    
    this.agents.set(sampleAgent.id, sampleAgent);
    console.log('✅ Memory Agent Monitor Database initialized with sample data');
  }

  async getAgentHealth(agentId: string): Promise<AgentHealth | null> {
    return this.agents.get(agentId) || null;
  }

  async getAllAgents(): Promise<AgentHealth[]> {
    return Array.from(this.agents.values());
  }

  async updateAgentHealth(agentId: string, updates: Partial<AgentHealth>): Promise<void> {
    const agent = this.agents.get(agentId);
    if (agent) {
      Object.assign(agent, updates, { updatedAt: new Date().toISOString() });
      this.agents.set(agentId, agent);
    } else {
      // Create new agent if it doesn't exist
      const newAgent: AgentHealth = {
        id: agentId,
        name: updates.name || agentId,
        status: updates.status || 'unknown',
        lastHeartbeat: updates.lastHeartbeat || new Date().toISOString(),
        responseTime: updates.responseTime || 0,
        errorCount: updates.errorCount || 0,
        uptime: updates.uptime || 0,
        cpuUsage: updates.cpuUsage || 0,
        memoryUsage: updates.memoryUsage || 0,
        autoRecoveryEnabled: updates.autoRecoveryEnabled !== undefined ? updates.autoRecoveryEnabled : true,
        recoveryAttempts: updates.recoveryAttempts || 0,
        maxRecoveryAttempts: updates.maxRecoveryAttempts || 3,
        lastRecoveryAttempt: updates.lastRecoveryAttempt || null,
        createdAt: updates.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      this.agents.set(agentId, newAgent);
    }
  }

  async recordRecoveryAttempt(attempt: Omit<RecoveryAttempt, 'id' | 'createdAt'>): Promise<RecoveryAttempt> {
    const id = `recovery-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const recoveryAttempt: RecoveryAttempt = {
      ...attempt,
      id,
      createdAt: new Date().toISOString()
    };
    
    this.recoveryAttempts.set(id, recoveryAttempt);
    return recoveryAttempt;
  }

  async getRecoveryAttempts(agentId: string, limit: number = 50): Promise<RecoveryAttempt[]> {
    const attempts = Array.from(this.recoveryAttempts.values())
      .filter(attempt => attempt.agentId === agentId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, limit);
    
    return attempts;
  }

  async recordGatewayStatus(status: Omit<GatewayStatus, 'id'>): Promise<GatewayStatus> {
    const id = `gateway-status-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const gatewayStatus: GatewayStatus = {
      ...status,
      id
    };
    
    this.gatewayStatuses.push(gatewayStatus);
    
    // Keep only last 1000 statuses to prevent memory bloat
    if (this.gatewayStatuses.length > 1000) {
      this.gatewayStatuses = this.gatewayStatuses.slice(-1000);
    }
    
    return gatewayStatus;
  }

  async getHealthEvents(limit: number = 50): Promise<GatewayStatus[]> {
    return this.gatewayStatuses
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, limit);
  }

  async getLatestGatewayStatus(): Promise<GatewayStatus | null> {
    if (this.gatewayStatuses.length === 0) return null;
    
    return this.gatewayStatuses
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0];
  }

  async cleanupOldData(daysToKeep: number = 7): Promise<void> {
    const cutoffDate = new Date(Date.now() - daysToKeep * 24 * 60 * 60 * 1000);
    
    // Clean up old recovery attempts
    for (const [id, attempt] of this.recoveryAttempts.entries()) {
      if (new Date(attempt.createdAt) < cutoffDate) {
        this.recoveryAttempts.delete(id);
      }
    }
    
    // Clean up old gateway statuses
    this.gatewayStatuses = this.gatewayStatuses.filter(
      status => new Date(status.timestamp) >= cutoffDate
    );
  }
}

// Singleton instance
let memoryAgentMonitorInstance: MemoryAgentMonitorDatabase | null = null;

export function getMemoryAgentMonitorDB(): MemoryAgentMonitorDatabase {
  if (!memoryAgentMonitorInstance) {
    memoryAgentMonitorInstance = new MemoryAgentMonitorDatabase();
  }
  return memoryAgentMonitorInstance;
}