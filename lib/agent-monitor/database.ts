// Agent Monitoring Database
import { Database } from 'sqlite';
import { open } from 'sqlite';
import * as sqlite3 from 'sqlite3';
import * as path from 'path';
import * as fs from 'fs';
import { AgentHealth, RecoveryAttempt, GatewayStatus } from './types';

export class AgentMonitorDatabase {
  private db: Database | null = null;

  async initialize(): Promise<void> {
    try {
      // Always use in-memory database for development to avoid file permission issues
      console.log('Initializing Agent Monitor Database (in-memory for development)...');
      
      this.db = await open({
        filename: ':memory:',
        driver: sqlite3.Database
      });

      await this.createTables();
      console.log('Agent Monitor Database initialized (in-memory)');
    } catch (error) {
      console.error('Failed to initialize database:', error);
      // Set db to null to indicate initialization failed
      this.db = null;
      console.log('Database initialization failed, using null database');
    }
  }

  private async createTables(): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    // Agents table
    await this.db.exec(`
      CREATE TABLE IF NOT EXISTS agents (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'unknown',
        last_heartbeat DATETIME,
        response_time INTEGER DEFAULT 0,
        error_count INTEGER DEFAULT 0,
        uptime INTEGER DEFAULT 0,
        cpu_usage REAL,
        memory_usage REAL,
        auto_recovery_enabled BOOLEAN DEFAULT 1,
        recovery_attempts INTEGER DEFAULT 0,
        max_recovery_attempts INTEGER DEFAULT 3,
        last_recovery_attempt DATETIME,
        tags TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Recovery attempts table
    await this.db.exec(`
      CREATE TABLE IF NOT EXISTS recovery_attempts (
        id TEXT PRIMARY KEY,
        agent_id TEXT NOT NULL,
        strategy_id TEXT NOT NULL,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        status TEXT NOT NULL DEFAULT 'pending',
        error TEXT,
        duration INTEGER,
        logs TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (agent_id) REFERENCES agents (id)
      )
    `);

    // Gateway status table
    await this.db.exec(`
      CREATE TABLE IF NOT EXISTS gateway_status (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        status TEXT NOT NULL,
        uptime INTEGER DEFAULT 0,
        agent_count INTEGER DEFAULT 0,
        healthy_agents INTEGER DEFAULT 0,
        degraded_agents INTEGER DEFAULT 0,
        unresponsive_agents INTEGER DEFAULT 0,
        last_restart DATETIME,
        version TEXT,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Health events table
    await this.db.exec(`
      CREATE TABLE IF NOT EXISTS health_events (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        agent_id TEXT,
        event_type TEXT NOT NULL,
        message TEXT NOT NULL,
        severity TEXT NOT NULL DEFAULT 'info',
        metadata TEXT,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (agent_id) REFERENCES agents (id)
      )
    `);

    // Create indexes
    await this.db.exec(`
      CREATE INDEX IF NOT EXISTS idx_agents_status ON agents (status);
      CREATE INDEX IF NOT EXISTS idx_agents_last_heartbeat ON agents (last_heartbeat);
      CREATE INDEX IF NOT EXISTS idx_recovery_attempts_agent_id ON recovery_attempts (agent_id);
      CREATE INDEX IF NOT EXISTS idx_recovery_attempts_timestamp ON recovery_attempts (timestamp);
      CREATE INDEX IF NOT EXISTS idx_health_events_timestamp ON health_events (timestamp);
    `);
  }

  // Agent methods
  async saveAgentHealth(health: AgentHealth): Promise<void> {
    if (!this.db) {
      console.warn('Database not initialized, skipping saveAgentHealth');
      return;
    }

    await this.db.run(`
      INSERT OR REPLACE INTO agents (
        id, name, status, last_heartbeat, response_time, error_count,
        uptime, cpu_usage, memory_usage, auto_recovery_enabled,
        recovery_attempts, max_recovery_attempts, last_recovery_attempt, tags, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
    `, [
      health.agentId,
      health.name,
      health.status,
      health.lastHeartbeat.toISOString(),
      health.responseTime,
      health.errorCount,
      health.uptime,
      health.cpuUsage,
      health.memoryUsage,
      health.autoRecoveryEnabled ? 1 : 0,
      health.recoveryAttempts,
      health.maxRecoveryAttempts,
      health.lastRecoveryAttempt?.toISOString(),
      health.tags ? JSON.stringify(health.tags) : null
    ]);
  }

  async getAgentHealth(agentId: string): Promise<AgentHealth | null> {
    if (!this.db) throw new Error('Database not initialized');

    const row = await this.db.get(`
      SELECT * FROM agents WHERE id = ?
    `, [agentId]);

    if (!row) return null;

    return {
      agentId: row.id,
      name: row.name,
      status: row.status as any,
      lastHeartbeat: new Date(row.last_heartbeat),
      responseTime: row.response_time,
      errorCount: row.error_count,
      uptime: row.uptime,
      cpuUsage: row.cpu_usage,
      memoryUsage: row.memory_usage,
      autoRecoveryEnabled: Boolean(row.auto_recovery_enabled),
      recoveryAttempts: row.recovery_attempts,
      maxRecoveryAttempts: row.max_recovery_attempts,
      lastRecoveryAttempt: row.last_recovery_attempt ? new Date(row.last_recovery_attempt) : undefined,
      tags: row.tags ? JSON.parse(row.tags) : undefined
    };
  }

  async getAllAgents(): Promise<AgentHealth[]> {
    if (!this.db) throw new Error('Database not initialized');

    const rows = await this.db.all(`
      SELECT * FROM agents ORDER BY updated_at DESC
    `);

    return rows.map(row => ({
      agentId: row.id,
      name: row.name,
      status: row.status as any,
      lastHeartbeat: new Date(row.last_heartbeat),
      responseTime: row.response_time,
      errorCount: row.error_count,
      uptime: row.uptime,
      cpuUsage: row.cpu_usage,
      memoryUsage: row.memory_usage,
      autoRecoveryEnabled: Boolean(row.auto_recovery_enabled),
      recoveryAttempts: row.recovery_attempts,
      maxRecoveryAttempts: row.max_recovery_attempts,
      lastRecoveryAttempt: row.last_recovery_attempt ? new Date(row.last_recovery_attempt) : undefined,
      tags: row.tags ? JSON.parse(row.tags) : undefined
    }));
  }

  // Recovery attempt methods
  async saveRecoveryAttempt(attempt: RecoveryAttempt): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    await this.db.run(`
      INSERT INTO recovery_attempts (
        id, agent_id, strategy_id, timestamp, status, error, duration, logs
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      attempt.id,
      attempt.agentId,
      attempt.strategyId,
      attempt.timestamp.toISOString(),
      attempt.status,
      attempt.error,
      attempt.duration,
      attempt.logs ? JSON.stringify(attempt.logs) : null
    ]);
  }

  async getRecoveryAttempts(agentId: string, limit: number = 10): Promise<RecoveryAttempt[]> {
    if (!this.db) throw new Error('Database not initialized');

    const rows = await this.db.all(`
      SELECT * FROM recovery_attempts 
      WHERE agent_id = ? 
      ORDER BY timestamp DESC 
      LIMIT ?
    `, [agentId, limit]);

    return rows.map(row => ({
      id: row.id,
      agentId: row.agent_id,
      strategyId: row.strategy_id,
      timestamp: new Date(row.timestamp),
      status: row.status as any,
      error: row.error,
      duration: row.duration,
      logs: row.logs ? JSON.parse(row.logs) : undefined
    }));
  }

  // Gateway status methods
  async saveGatewayStatus(status: GatewayStatus): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    await this.db.run(`
      INSERT INTO gateway_status (
        status, uptime, agent_count, healthy_agents, degraded_agents,
        unresponsive_agents, last_restart, version
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      status.status,
      status.uptime,
      status.agentCount,
      status.healthyAgents,
      status.degradedAgents,
      status.unresponsiveAgents,
      status.lastRestart?.toISOString(),
      status.version
    ]);
  }

  async getLatestGatewayStatus(): Promise<GatewayStatus | null> {
    if (!this.db) throw new Error('Database not initialized');

    const row = await this.db.get(`
      SELECT * FROM gateway_status 
      ORDER BY timestamp DESC 
      LIMIT 1
    `);

    if (!row) return null;

    return {
      status: row.status as any,
      uptime: row.uptime,
      agentCount: row.agent_count,
      healthyAgents: row.healthy_agents,
      degradedAgents: row.degraded_agents,
      unresponsiveAgents: row.unresponsive_agents,
      lastRestart: row.last_restart ? new Date(row.last_restart) : undefined,
      version: row.version
    };
  }

  // Health event methods
  async logHealthEvent(
    agentId: string | null,
    eventType: string,
    message: string,
    severity: 'info' | 'warning' | 'error' | 'critical' = 'info',
    metadata?: any
  ): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    await this.db.run(`
      INSERT INTO health_events (
        agent_id, event_type, message, severity, metadata
      ) VALUES (?, ?, ?, ?, ?)
    `, [
      agentId,
      eventType,
      message,
      severity,
      metadata ? JSON.stringify(metadata) : null
    ]);
  }

  async getHealthEvents(limit: number = 50): Promise<any[]> {
    if (!this.db) throw new Error('Database not initialized');

    const rows = await this.db.all(`
      SELECT * FROM health_events 
      ORDER BY timestamp DESC 
      LIMIT ?
    `, [limit]);

    return rows.map(row => ({
      id: row.id,
      agentId: row.agent_id,
      eventType: row.event_type,
      message: row.message,
      severity: row.severity,
      metadata: row.metadata ? JSON.parse(row.metadata) : null,
      timestamp: new Date(row.timestamp)
    }));
  }

  // Cleanup methods
  async cleanupOldData(daysToKeep: number = 30): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);

    await this.db.run(`
      DELETE FROM recovery_attempts 
      WHERE timestamp < ?
    `, [cutoffDate.toISOString()]);

    await this.db.run(`
      DELETE FROM health_events 
      WHERE timestamp < ?
    `, [cutoffDate.toISOString()]);

    await this.db.run(`
      DELETE FROM gateway_status 
      WHERE timestamp < ?
    `, [cutoffDate.toISOString()]);
  }

  async close(): Promise<void> {
    if (this.db) {
      await this.db.close();
      this.db = null;
    }
  }
}

// Singleton instance
export const agentMonitorDB = new AgentMonitorDatabase();