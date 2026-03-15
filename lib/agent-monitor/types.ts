// Agent Monitoring Types
export interface AgentHealth {
  agentId: string;
  name: string;
  status: 'healthy' | 'degraded' | 'unresponsive' | 'crashed' | 'unknown';
  lastHeartbeat: Date;
  responseTime: number; // milliseconds
  errorCount: number;
  uptime: number; // seconds
  cpuUsage?: number; // percentage
  memoryUsage?: number; // MB
  autoRecoveryEnabled: boolean;
  recoveryAttempts: number;
  maxRecoveryAttempts: number;
  lastRecoveryAttempt?: Date;
  tags?: string[];
}

export interface RecoveryStrategy {
  id: string;
  name: string;
  description: string;
  timeout: number; // milliseconds
  retryCount: number;
  priority: number; // lower = higher priority
  enabled: boolean;
}

export interface RecoveryAttempt {
  id: string;
  agentId: string;
  strategyId: string;
  timestamp: Date;
  status: 'pending' | 'in_progress' | 'success' | 'failed' | 'cancelled';
  error?: string;
  duration?: number; // milliseconds
  logs?: string[];
}

export interface GatewayStatus {
  status: 'running' | 'stopped' | 'degraded' | 'restarting';
  uptime: number; // seconds
  agentCount: number;
  healthyAgents: number;
  degradedAgents: number;
  unresponsiveAgents: number;
  lastRestart?: Date;
  version?: string;
}

export interface HealthCheckConfig {
  heartbeatInterval: number; // milliseconds
  responseTimeout: number; // milliseconds
  maxErrorCount: number;
  recoveryCooldown: number; // milliseconds
  notificationThreshold: number; // error count before notification
}

export interface RecoveryNotification {
  type: 'agent_unresponsive' | 'agent_recovered' | 'gateway_restart' | 'escalation';
  agentId?: string;
  message: string;
  timestamp: Date;
  priority: 'low' | 'medium' | 'high' | 'critical';
  recipients?: string[];
}

export const DEFAULT_RECOVERY_STRATEGIES: RecoveryStrategy[] = [
  {
    id: 'connection_reset',
    name: 'Connection Reset',
    description: 'Reset network connection to agent',
    timeout: 10000, // 10 seconds
    retryCount: 2,
    priority: 1,
    enabled: true
  },
  {
    id: 'agent_restart',
    name: 'Agent Restart',
    description: 'Restart agent process',
    timeout: 30000, // 30 seconds
    retryCount: 1,
    priority: 2,
    enabled: true
  },
  {
    id: 'gateway_reload',
    name: 'Gateway Reload',
    description: 'Reload gateway service',
    timeout: 60000, // 60 seconds
    retryCount: 1,
    priority: 3,
    enabled: true
  },
  {
    id: 'failover',
    name: 'Failover to Backup',
    description: 'Switch to backup agent',
    timeout: 120000, // 120 seconds
    retryCount: 0,
    priority: 4,
    enabled: true
  },
  {
    id: 'escalate_admin',
    name: 'Escalate to Admin',
    description: 'Notify administrators for manual intervention',
    timeout: 300000, // 5 minutes
    retryCount: 0,
    priority: 5,
    enabled: true
  }
];

export const DEFAULT_HEALTH_CONFIG: HealthCheckConfig = {
  heartbeatInterval: 30000, // 30 seconds
  responseTimeout: 10000, // 10 seconds
  maxErrorCount: 3,
  recoveryCooldown: 60000, // 60 seconds
  notificationThreshold: 2
};