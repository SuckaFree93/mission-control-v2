// Agent Monitor Service - Core monitoring logic
import { AgentHealth, RecoveryStrategy, DEFAULT_RECOVERY_STRATEGIES, DEFAULT_HEALTH_CONFIG, HealthCheckConfig, RecoveryNotification, RecoveryAttempt } from './types';
import { agentMonitorDB } from './database-factory';
import { v4 as uuidv4 } from 'uuid';

export class AgentMonitorService {
  private agents: Map<string, AgentHealth> = new Map();
  private monitoringInterval: NodeJS.Timeout | null = null;
  private recoveryStrategies: RecoveryStrategy[] = [...DEFAULT_RECOVERY_STRATEGIES];
  private config: HealthCheckConfig = DEFAULT_HEALTH_CONFIG;
  private isMonitoring = false;
  private eventListeners: Map<string, Function[]> = new Map();

  constructor() {
    this.initialize();
  }

  private async initialize(): Promise<void> {
    try {
      // Get database instance from factory
      const db = await agentMonitorDB();
      console.log('Agent Monitor Service initialized');
    } catch (error) {
      console.error('Failed to initialize Agent Monitor Service:', error);
      throw error;
    }
  }

  // Agent registration and management
  async registerAgent(agentId: string, name: string, tags?: string[]): Promise<void> {
    const agentHealth: AgentHealth = {
      agentId,
      name,
      status: 'unknown',
      lastHeartbeat: new Date(),
      responseTime: 0,
      errorCount: 0,
      uptime: 0,
      autoRecoveryEnabled: true,
      recoveryAttempts: 0,
      maxRecoveryAttempts: 3,
      tags
    };

    this.agents.set(agentId, agentHealth);
    await agentMonitorDB.saveAgentHealth(agentHealth);
    
    await agentMonitorDB.logHealthEvent(
      agentId,
      'agent_registered',
      `Agent "${name}" (${agentId}) registered`,
      'info',
      { tags }
    );

    this.emit('agentRegistered', agentHealth);
    console.log(`Agent registered: ${name} (${agentId})`);
  }

  async updateAgentHeartbeat(agentId: string, responseTime?: number): Promise<void> {
    const agent = this.agents.get(agentId);
    if (!agent) {
      console.warn(`Agent not found: ${agentId}`);
      return;
    }

    const now = new Date();
    const previousStatus = agent.status;

    // Update agent health
    agent.lastHeartbeat = now;
    agent.responseTime = responseTime || agent.responseTime;
    agent.uptime = Math.floor((now.getTime() - agent.lastHeartbeat.getTime()) / 1000);
    
    // Determine status based on response time
    if (responseTime && responseTime > 5000) {
      agent.status = 'degraded';
    } else {
      agent.status = 'healthy';
      agent.errorCount = 0; // Reset error count on successful heartbeat
    }

    this.agents.set(agentId, agent);
    await agentMonitorDB.saveAgentHealth(agent);

    // Log status change
    if (previousStatus !== agent.status) {
      await agentMonitorDB.logHealthEvent(
        agentId,
        'status_changed',
        `Agent status changed from ${previousStatus} to ${agent.status}`,
        agent.status === 'healthy' ? 'info' : 'warning',
        { previousStatus, newStatus: agent.status, responseTime }
      );

      this.emit('agentStatusChanged', { agentId, previousStatus, newStatus: agent.status });
    }
  }

  async reportAgentError(agentId: string, error: Error): Promise<void> {
    const agent = this.agents.get(agentId);
    if (!agent) {
      console.warn(`Agent not found: ${agentId}`);
      return;
    }

    agent.errorCount++;
    agent.status = 'degraded';
    
    // Check if agent should be marked as unresponsive
    if (agent.errorCount >= this.config.maxErrorCount) {
      agent.status = 'unresponsive';
      await this.handleUnresponsiveAgent(agentId);
    }

    this.agents.set(agentId, agent);
    await agentMonitorDB.saveAgentHealth(agent);

    await agentMonitorDB.logHealthEvent(
      agentId,
      'agent_error',
      `Agent error: ${error.message}`,
      'error',
      { error: error.message, stack: error.stack, errorCount: agent.errorCount }
    );

    this.emit('agentError', { agentId, error, errorCount: agent.errorCount });
  }

  // Monitoring control
  startMonitoring(): void {
    if (this.isMonitoring) {
      console.log('Monitoring already started');
      return;
    }

    this.isMonitoring = true;
    this.monitoringInterval = setInterval(() => {
      this.performHealthChecks();
    }, this.config.heartbeatInterval);

    console.log(`Agent monitoring started (interval: ${this.config.heartbeatInterval}ms)`);
    this.emit('monitoringStarted');
  }

  stopMonitoring(): void {
    if (!this.isMonitoring || !this.monitoringInterval) {
      return;
    }

    clearInterval(this.monitoringInterval);
    this.monitoringInterval = null;
    this.isMonitoring = false;

    console.log('Agent monitoring stopped');
    this.emit('monitoringStopped');
  }

  private async performHealthChecks(): Promise<void> {
    const now = new Date();
    const unresponsiveAgents: string[] = [];

    for (const [agentId, agent] of this.agents.entries()) {
      const timeSinceHeartbeat = now.getTime() - agent.lastHeartbeat.getTime();
      
      if (timeSinceHeartbeat > this.config.heartbeatInterval + this.config.responseTimeout) {
        // Agent is unresponsive
        agent.status = 'unresponsive';
        unresponsiveAgents.push(agentId);
        
        await agentMonitorDB.logHealthEvent(
          agentId,
          'agent_unresponsive',
          `Agent has not responded for ${Math.floor(timeSinceHeartbeat / 1000)} seconds`,
          'critical'
        );
      }
    }

    // Handle unresponsive agents
    for (const agentId of unresponsiveAgents) {
      await this.handleUnresponsiveAgent(agentId);
    }

    // Update gateway status
    await this.updateGatewayStatus();
  }

  // Recovery handling
  private async handleUnresponsiveAgent(agentId: string): Promise<void> {
    const agent = this.agents.get(agentId);
    if (!agent || !agent.autoRecoveryEnabled) {
      return;
    }

    // Check if we should attempt recovery
    const shouldAttemptRecovery = this.shouldAttemptRecovery(agent);
    if (!shouldAttemptRecovery) {
      console.log(`Skipping recovery for agent ${agentId} - max attempts reached or in cooldown`);
      return;
    }

    console.log(`Initiating recovery for unresponsive agent: ${agent.name} (${agentId})`);
    
    // Execute recovery strategies in order
    for (const strategy of this.recoveryStrategies.sort((a, b) => a.priority - b.priority)) {
      if (!strategy.enabled) continue;

      const recoveryId = uuidv4();
      const recoveryAttempt: RecoveryAttempt = {
        id: recoveryId,
        agentId,
        strategyId: strategy.id,
        timestamp: new Date(),
        status: 'in_progress'
      };

      await agentMonitorDB.saveRecoveryAttempt(recoveryAttempt);
      
      try {
        console.log(`Attempting recovery strategy: ${strategy.name} for agent ${agentId}`);
        
        // Execute recovery strategy
        const result = await this.executeRecoveryStrategy(strategy, agentId);
        
        const successAttempt: RecoveryAttempt = {
          ...recoveryAttempt,
          status: 'success',
          duration: result.duration,
          logs: result.logs
        };
        
        agent.recoveryAttempts++;
        agent.lastRecoveryAttempt = new Date();
        agent.status = 'healthy'; // Assume recovery succeeded
        
        await agentMonitorDB.saveAgentHealth(agent);
        await agentMonitorDB.saveRecoveryAttempt(successAttempt);

        await agentMonitorDB.logHealthEvent(
          agentId,
          'recovery_success',
          `Recovery successful using strategy: ${strategy.name}`,
          'info',
          { strategyId: strategy.id, duration: result.duration }
        );

        // Send recovery notification
        await this.sendRecoveryNotification({
          type: 'agent_recovered',
          agentId,
          message: `Agent "${agent.name}" recovered using ${strategy.name}`,
          timestamp: new Date(),
          priority: 'medium'
        });

        this.emit('agentRecovered', { agentId, strategy: strategy.name });
        break; // Stop after first successful recovery

      } catch (error) {
        console.error(`Recovery strategy ${strategy.name} failed:`, error);
        
        const failedAttempt: RecoveryAttempt = {
          ...recoveryAttempt,
          status: 'failed',
          error: error instanceof Error ? error.message : String(error)
        };
        
        await agentMonitorDB.saveRecoveryAttempt(failedAttempt);

        await agentMonitorDB.logHealthEvent(
          agentId,
          'recovery_failed',
          `Recovery failed using strategy: ${strategy.name}`,
          'error',
          { strategyId: strategy.id, error: error instanceof Error ? error.message : String(error) }
        );

        // Continue to next strategy
      }
    }

    // If all strategies failed, escalate
    if (agent.status === 'unresponsive') {
      await this.escalateToAdministrator(agentId);
    }
  }

  private shouldAttemptRecovery(agent: AgentHealth): boolean {
    // Check max attempts
    if (agent.recoveryAttempts >= agent.maxRecoveryAttempts) {
      return false;
    }

    // Check cooldown period
    if (agent.lastRecoveryAttempt) {
      const timeSinceLastAttempt = new Date().getTime() - agent.lastRecoveryAttempt.getTime();
      if (timeSinceLastAttempt < this.config.recoveryCooldown) {
        return false;
      }
    }

    return true;
  }

  private async executeRecoveryStrategy(strategy: RecoveryStrategy, agentId: string): Promise<{ duration: number; logs: string[] }> {
    const startTime = Date.now();
    const logs: string[] = [];

    logs.push(`Starting recovery strategy: ${strategy.name}`);
    
    switch (strategy.id) {
      case 'connection_reset':
        await this.resetAgentConnection(agentId);
        logs.push('Connection reset completed');
        break;

      case 'agent_restart':
        await this.restartAgent(agentId);
        logs.push('Agent restart completed');
        break;

      case 'gateway_reload':
        await this.reloadGateway();
        logs.push('Gateway reload completed');
        break;

      case 'failover':
        await this.failoverToBackup(agentId);
        logs.push('Failover to backup completed');
        break;

      case 'escalate_admin':
        // This is handled separately
        throw new Error('Escalation should be handled by escalateToAdministrator method');

      default:
        throw new Error(`Unknown recovery strategy: ${strategy.id}`);
    }

    const duration = Date.now() - startTime;
    logs.push(`Recovery completed in ${duration}ms`);

    return { duration, logs };
  }

  // Recovery strategy implementations
  private async resetAgentConnection(agentId: string): Promise<void> {
    // Simulate connection reset
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // In a real implementation, this would:
    // 1. Close existing connections to the agent
    // 2. Clear connection pools
    // 3. Re-establish connection
    // 4. Verify connection is working
  }

  private async restartAgent(agentId: string): Promise<void> {
    // Simulate agent restart
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    // In a real implementation, this would:
    // 1. Send restart command to agent
    // 2. Wait for agent to stop
    // 3. Wait for agent to start
    // 4. Verify agent is responsive
  }

  private async reloadGateway(): Promise<void> {
    // Simulate gateway reload
    await new Promise(resolve => setTimeout(resolve, 10000));
    
    // In a real implementation, this would:
    // 1. Gracefully stop gateway service
    // 2. Reload configuration
    // 3. Restart gateway service
    // 4. Reconnect all agents
    // 5. Verify all agents are responsive
  }

  private async failoverToBackup(agentId: string): Promise<void> {
    // Simulate failover
    await new Promise(resolve => setTimeout(resolve, 8000));
    
    // In a real implementation, this would:
    // 1. Identify backup agent
    // 2. Transfer state to backup
    // 3. Update routing to use backup
    // 4. Verify backup is working
    // 5. Mark primary as failed
  }

  private async escalateToAdministrator(agentId: string): Promise<void> {
    const agent = this.agents.get(agentId);
    if (!agent) return;

    console.log(`Escalating agent ${agentId} to administrator`);
    
    await agentMonitorDB.logHealthEvent(
      agentId,
      'escalation_required',
      `Agent requires manual intervention - all recovery strategies failed`,
      'critical',
      { recoveryAttempts: agent.recoveryAttempts }
    );

    await this.sendRecoveryNotification({
      type: 'escalation',
      agentId,
      message: `Agent "${agent.name}" requires manual intervention. All recovery attempts failed.`,
      timestamp: new Date(),
      priority: 'critical',
      recipients: ['admin@example.com'] // Would be configured
    });

    this.emit('escalationRequired', { agentId, agentName: agent.name });
  }

  // Gateway status management
  private async updateGatewayStatus(): Promise<void> {
    const agents = Array.from(this.agents.values());
    
    const status = {
      status: 'running' as const,
      uptime: Math.floor(process.uptime()),
      agentCount: agents.length,
      healthyAgents: agents.filter(a => a.status === 'healthy').length,
      degradedAgents: agents.filter(a => a.status === 'degraded').length,
      unresponsiveAgents: agents.filter(a => a.status === 'unresponsive').length,
      version: process.env.npm_package_version || '1.0.0'
    };

    await agentMonitorDB.saveGatewayStatus(status);
    this.emit('gatewayStatusUpdated', status);
  }

  // Notification system
  private async sendRecoveryNotification(notification: RecoveryNotification): Promise<void> {
    // In a real implementation, this would:
    // 1. Send email notifications
    // 2. Send SMS alerts
    // 3. Send push notifications
    // 4. Log to notification system
    
    console.log('Recovery notification:', notification);
    this.emit('recoveryNotification', notification);
  }

  // Configuration management
  updateConfig(newConfig: Partial<HealthCheckConfig>): void {
    this.config = { ...this.config, ...newConfig };
    console.log('Monitoring configuration updated:', this.config);
    this.emit('configUpdated', this.config);
  }

  updateRecoveryStrategies(strategies: RecoveryStrategy[]): void {
    this.recoveryStrategies = strategies;
    console.log('Recovery strategies updated');
    this.emit('recoveryStrategiesUpdated', strategies);
  }

  // Getters
  getAgent(agentId: string): AgentHealth | undefined {
    return this.agents.get(agentId);
  }

  getAllAgents(): AgentHealth[] {
    return Array.from(this.agents.values());
  }

  getMonitoringStatus(): { isMonitoring: boolean; agentCount: number } {
    return {
      isMonitoring: this.isMonitoring,
      agentCount: this.agents.size
    };
  }

  getConfig(): HealthCheckConfig {
    return { ...this.config };
  }

  getRecoveryStrategies(): RecoveryStrategy[] {
    return [...this.recoveryStrategies];
  }

  // Cleanup
  async cleanup(): Promise<void> {
    this.stopMonitoring();
    await agentMonitorDB.cleanupOldData();
    console.log('Agent Monitor Service cleaned up');
  }

  // Simple event emitter methods
  private emit(event: string, data?: any): void {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      listeners.forEach(listener => {
        try {
          listener(data);
        } catch (error) {
          console.error(`Error in event listener for ${event}:`, error);
        }
      });
    }
  }

  on(event: string, listener: Function): void {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, []);
    }
    this.eventListeners.get(event)!.push(listener);
  }

  off(event: string, listener: Function): void {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      const index = listeners.indexOf(listener);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    }
  }
}

// Singleton instance
export const agentMonitorService = new AgentMonitorService();