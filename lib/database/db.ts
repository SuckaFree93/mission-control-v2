import sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite';
import path from 'path';

export interface SystemMetric {
  id?: number;
  timestamp: string;
  cpu_usage: number;
  memory_usage: number;
  network_connections: number;
  disk_usage: number;
  agent_count: number;
}

export interface AgentActivity {
  id?: number;
  agent_id: string;
  agent_name: string;
  status: 'online' | 'offline' | 'busy' | 'idle';
  activity: string;
  cpu_usage: number;
  memory_usage: number;
  last_heartbeat: string;
  created_at: string;
}

export interface UserActivity {
  id?: number;
  user_id: string;
  action: string;
  details: string;
  ip_address?: string;
  user_agent?: string;
  timestamp: string;
}

export interface Notification {
  id?: number;
  user_id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'error' | 'success';
  read: boolean;
  created_at: string;
}

export class MissionControlDatabase {
  private db: Database | null = null;
  private dbPath: string;

  constructor() {
    this.dbPath = path.join(process.cwd(), 'data', 'mission-control.db');
  }

  async initialize() {
    try {
      this.db = await open({
        filename: this.dbPath,
        driver: sqlite3.Database
      });

      await this.createTables();
      console.log('✅ Database initialized successfully');
    } catch (error) {
      console.error('Error initializing database:', error);
      throw error;
    }
  }

  private async createTables() {
    if (!this.db) throw new Error('Database not initialized');

    // System metrics table
    await this.db.exec(`
      CREATE TABLE IF NOT EXISTS system_metrics (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        timestamp DATETIME NOT NULL,
        cpu_usage REAL NOT NULL,
        memory_usage REAL NOT NULL,
        network_connections INTEGER NOT NULL,
        disk_usage REAL NOT NULL,
        agent_count INTEGER NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Agent activity table
    await this.db.exec(`
      CREATE TABLE IF NOT EXISTS agent_activity (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        agent_id TEXT NOT NULL,
        agent_name TEXT NOT NULL,
        status TEXT NOT NULL,
        activity TEXT NOT NULL,
        cpu_usage REAL NOT NULL,
        memory_usage REAL NOT NULL,
        last_heartbeat DATETIME NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(agent_id)
      )
    `);

    // User activity table
    await this.db.exec(`
      CREATE TABLE IF NOT EXISTS user_activity (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id TEXT NOT NULL,
        action TEXT NOT NULL,
        details TEXT NOT NULL,
        ip_address TEXT,
        user_agent TEXT,
        timestamp DATETIME NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Notifications table
    await this.db.exec(`
      CREATE TABLE IF NOT EXISTS notifications (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id TEXT NOT NULL,
        title TEXT NOT NULL,
        message TEXT NOT NULL,
        type TEXT NOT NULL,
        read BOOLEAN DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create indexes for performance
    await this.db.exec(`
      CREATE INDEX IF NOT EXISTS idx_system_metrics_timestamp ON system_metrics(timestamp);
      CREATE INDEX IF NOT EXISTS idx_agent_activity_status ON agent_activity(status);
      CREATE INDEX IF NOT EXISTS idx_user_activity_user_id ON user_activity(user_id);
      CREATE INDEX IF NOT EXISTS idx_notifications_user_read ON notifications(user_id, read);
    `);
  }

  // System Metrics Methods
  async recordSystemMetric(metric: Omit<SystemMetric, 'id'>): Promise<number> {
    if (!this.db) throw new Error('Database not initialized');

    const result = await this.db.run(
      `INSERT INTO system_metrics (timestamp, cpu_usage, memory_usage, network_connections, disk_usage, agent_count)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [metric.timestamp, metric.cpu_usage, metric.memory_usage, metric.network_connections, metric.disk_usage, metric.agent_count]
    );

    return result.lastID!;
  }

  async getRecentSystemMetrics(limit: number = 100): Promise<SystemMetric[]> {
    if (!this.db) throw new Error('Database not initialized');

    return await this.db.all(
      `SELECT * FROM system_metrics 
       ORDER BY timestamp DESC 
       LIMIT ?`,
      [limit]
    );
  }

  async getSystemMetricsByTimeRange(startTime: string, endTime: string): Promise<SystemMetric[]> {
    if (!this.db) throw new Error('Database not initialized');

    return await this.db.all(
      `SELECT * FROM system_metrics 
       WHERE timestamp BETWEEN ? AND ? 
       ORDER BY timestamp ASC`,
      [startTime, endTime]
    );
  }

  // Agent Activity Methods
  async upsertAgentActivity(activity: Omit<AgentActivity, 'id' | 'created_at'>): Promise<number> {
    if (!this.db) throw new Error('Database not initialized');

    const result = await this.db.run(
      `INSERT INTO agent_activity (agent_id, agent_name, status, activity, cpu_usage, memory_usage, last_heartbeat)
       VALUES (?, ?, ?, ?, ?, ?, ?)
       ON CONFLICT(agent_id) DO UPDATE SET
         status = excluded.status,
         activity = excluded.activity,
         cpu_usage = excluded.cpu_usage,
         memory_usage = excluded.memory_usage,
         last_heartbeat = excluded.last_heartbeat`,
      [activity.agent_id, activity.agent_name, activity.status, activity.activity, 
       activity.cpu_usage, activity.memory_usage, activity.last_heartbeat]
    );

    return result.lastID!;
  }

  async getActiveAgents(): Promise<AgentActivity[]> {
    if (!this.db) throw new Error('Database not initialized');

    return await this.db.all(
      `SELECT * FROM agent_activity 
       WHERE status IN ('online', 'busy')
       ORDER BY last_heartbeat DESC`
    );
  }

  async getAllAgents(): Promise<AgentActivity[]> {
    if (!this.db) throw new Error('Database not initialized');

    return await this.db.all(
      `SELECT * FROM agent_activity 
       ORDER BY last_heartbeat DESC`
    );
  }

  // User Activity Methods
  async recordUserActivity(activity: Omit<UserActivity, 'id' | 'created_at'>): Promise<number> {
    if (!this.db) throw new Error('Database not initialized');

    const result = await this.db.run(
      `INSERT INTO user_activity (user_id, action, details, ip_address, user_agent, timestamp)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [activity.user_id, activity.action, activity.details, activity.ip_address, activity.user_agent, activity.timestamp]
    );

    return result.lastID!;
  }

  async getUserActivity(userId: string, limit: number = 50): Promise<UserActivity[]> {
    if (!this.db) throw new Error('Database not initialized');

    return await this.db.all(
      `SELECT * FROM user_activity 
       WHERE user_id = ? 
       ORDER BY timestamp DESC 
       LIMIT ?`,
      [userId, limit]
    );
  }

  async getRecentActivity(limit: number = 100): Promise<UserActivity[]> {
    if (!this.db) throw new Error('Database not initialized');

    return await this.db.all(
      `SELECT * FROM user_activity 
       ORDER BY timestamp DESC 
       LIMIT ?`,
      [limit]
    );
  }

  // Notification Methods
  async createNotification(notification: Omit<Notification, 'id' | 'created_at'>): Promise<number> {
    if (!this.db) throw new Error('Database not initialized');

    const result = await this.db.run(
      `INSERT INTO notifications (user_id, title, message, type, read)
       VALUES (?, ?, ?, ?, ?)`,
      [notification.user_id, notification.title, notification.message, notification.type, notification.read ? 1 : 0]
    );

    return result.lastID!;
  }

  async getUserNotifications(userId: string, unreadOnly: boolean = false): Promise<Notification[]> {
    if (!this.db) throw new Error('Database not initialized');

    const whereClause = unreadOnly ? 'WHERE user_id = ? AND read = 0' : 'WHERE user_id = ?';
    
    return await this.db.all(
      `SELECT * FROM notifications 
       ${whereClause}
       ORDER BY created_at DESC`,
      [userId]
    );
  }

  async markNotificationAsRead(notificationId: number): Promise<boolean> {
    if (!this.db) throw new Error('Database not initialized');

    const result = await this.db.run(
      `UPDATE notifications SET read = 1 WHERE id = ?`,
      [notificationId]
    );

    return result.changes! > 0;
  }

  async markAllNotificationsAsRead(userId: string): Promise<boolean> {
    if (!this.db) throw new Error('Database not initialized');

    const result = await this.db.run(
      `UPDATE notifications SET read = 1 WHERE user_id = ? AND read = 0`,
      [userId]
    );

    return result.changes! > 0;
  }

  // Analytics Methods
  async getSystemHealthStats(): Promise<{
    avg_cpu: number;
    avg_memory: number;
    max_connections: number;
    total_agents: number;
    uptime_hours: number;
  }> {
    if (!this.db) throw new Error('Database not initialized');

    const result = await this.db.get(`
      SELECT 
        AVG(cpu_usage) as avg_cpu,
        AVG(memory_usage) as avg_memory,
        MAX(network_connections) as max_connections,
        COUNT(DISTINCT agent_id) as total_agents,
        (JULIANDAY('now') - JULIANDAY(MIN(timestamp))) * 24 as uptime_hours
      FROM system_metrics sm
      LEFT JOIN agent_activity aa ON 1=1
      WHERE sm.timestamp >= datetime('now', '-24 hours')
    `);

    return {
      avg_cpu: result?.avg_cpu || 0,
      avg_memory: result?.avg_memory || 0,
      max_connections: result?.max_connections || 0,
      total_agents: result?.total_agents || 0,
      uptime_hours: result?.uptime_hours || 0
    };
  }

  async getActivitySummary(hours: number = 24): Promise<{
    user_actions: number;
    agent_activities: number;
    system_metrics: number;
    notifications: number;
  }> {
    if (!this.db) throw new Error('Database not initialized');

    const sinceTime = new Date(Date.now() - hours * 60 * 60 * 1000).toISOString();

    const [userResult, agentResult, systemResult, notificationResult] = await Promise.all([
      this.db.get(`SELECT COUNT(*) as count FROM user_activity WHERE timestamp >= ?`, [sinceTime]),
      this.db.get(`SELECT COUNT(*) as count FROM agent_activity WHERE last_heartbeat >= ?`, [sinceTime]),
      this.db.get(`SELECT COUNT(*) as count FROM system_metrics WHERE timestamp >= ?`, [sinceTime]),
      this.db.get(`SELECT COUNT(*) as count FROM notifications WHERE created_at >= ?`, [sinceTime])
    ]);

    return {
      user_actions: userResult?.count || 0,
      agent_activities: agentResult?.count || 0,
      system_metrics: systemResult?.count || 0,
      notifications: notificationResult?.count || 0
    };
  }

  // Maintenance Methods
  async cleanupOldData(daysToKeep: number = 30): Promise<number> {
    if (!this.db) throw new Error('Database not initialized');

    const cutoffDate = new Date(Date.now() - daysToKeep * 24 * 60 * 60 * 1000).toISOString();

    const [metricsResult, activityResult, userActivityResult] = await Promise.all([
      this.db.run(`DELETE FROM system_metrics WHERE timestamp < ?`, [cutoffDate]),
      this.db.run(`DELETE FROM agent_activity WHERE last_heartbeat < ?`, [cutoffDate]),
      this.db.run(`DELETE FROM user_activity WHERE timestamp < ?`, [cutoffDate])
    ]);

    return (metricsResult.changes || 0) + (activityResult.changes || 0) + (userActivityResult.changes || 0);
  }

  async close() {
    if (this.db) {
      await this.db.close();
      this.db = null;
      console.log('🔒 Database connection closed');
    }
  }
}

// Singleton instance
let dbInstance: MissionControlDatabase | null = null;

export async function getDatabase(): Promise<MissionControlDatabase> {
  if (!dbInstance) {
    dbInstance = new MissionControlDatabase();
    await dbInstance.initialize();
  }
  return dbInstance;
}