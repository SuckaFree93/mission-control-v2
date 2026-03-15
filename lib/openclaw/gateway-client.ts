// OpenClaw Gateway Client
// Connects to OpenClaw gateway API on port 18789

export interface GatewayStatus {
  status: 'running' | 'stopped' | 'starting' | 'stopping' | 'error';
  pid?: number;
  port: number;
  version: string;
  uptime: number;
  agents: AgentStatus[];
  channels: ChannelStatus[];
  lastError?: string;
  timestamp: string;
}

export interface AgentStatus {
  id: string;
  name: string;
  status: 'online' | 'offline' | 'degraded' | 'starting';
  model: string;
  uptime: number;
  lastActivity: string;
  memoryUsage?: number;
  cpuUsage?: number;
  sessionCount: number;
}

export interface ChannelStatus {
  id: string;
  provider: 'telegram' | 'whatsapp' | 'discord' | 'signal';
  status: 'connected' | 'disconnected' | 'error';
  connectedSince: string;
  messageCount: number;
  lastError?: string;
}

export interface GatewayMetrics {
  timestamp: string;
  system: {
    cpu: number;
    memory: number;
    disk: number;
    network: {
      in: number;
      out: number;
    };
  };
  gateway: {
    activeSessions: number;
    totalRequests: number;
    errorRate: number;
    responseTime: number;
  };
  agents: {
    total: number;
    online: number;
    offline: number;
    degraded: number;
  };
}

export class OpenClawGatewayClient {
  private baseUrl: string;
  private gatewayToken: string;

  constructor(baseUrl: string = 'http://localhost:18789', gatewayToken?: string) {
    this.baseUrl = baseUrl;
    this.gatewayToken = gatewayToken || process.env.OPENCLAW_GATEWAY_TOKEN || '';
  }

  private async request(endpoint: string, method: string = 'GET', body?: any): Promise<any> {
    const url = `${this.baseUrl}${endpoint}`;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (this.gatewayToken) {
      headers['Authorization'] = `Bearer ${this.gatewayToken}`;
    }

    try {
      const response = await fetch(url, {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined,
      });

      if (!response.ok) {
        throw new Error(`Gateway API error: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`OpenClaw Gateway request failed: ${endpoint}`, error);
      throw error;
    }
  }

  // Get gateway status
  async getStatus(): Promise<GatewayStatus> {
    try {
      return await this.request('/status');
    } catch (error) {
      // Fallback to simulated data if gateway is not available
      console.warn('Gateway not available, using simulated data');
      return this.getSimulatedStatus();
    }
  }

  // Get gateway metrics
  async getMetrics(): Promise<GatewayMetrics> {
    try {
      return await this.request('/metrics');
    } catch (error) {
      console.warn('Gateway metrics not available, using simulated data');
      return this.getSimulatedMetrics();
    }
  }

  // Get agent details
  async getAgent(agentId: string): Promise<AgentStatus> {
    try {
      return await this.request(`/agents/${agentId}`);
    } catch (error) {
      console.warn(`Agent ${agentId} not available, using simulated data`);
      return this.getSimulatedAgent(agentId);
    }
  }

  // List all agents
  async listAgents(): Promise<AgentStatus[]> {
    try {
      return await this.request('/agents');
    } catch (error) {
      console.warn('Agents list not available, using simulated data');
      return this.getSimulatedAgents();
    }
  }

  // Restart gateway
  async restartGateway(): Promise<{ success: boolean; message: string }> {
    try {
      return await this.request('/restart', 'POST');
    } catch (error) {
      console.error('Failed to restart gateway:', error);
      throw error;
    }
  }

  // Get channel status
  async getChannels(): Promise<ChannelStatus[]> {
    try {
      return await this.request('/channels');
    } catch (error) {
      console.warn('Channels not available, using simulated data');
      return this.getSimulatedChannels();
    }
  }

  // Simulated data for development
  private getSimulatedStatus(): GatewayStatus {
    return {
      status: 'running',
      pid: 2544,
      port: 18789,
      version: '2026.3.12',
      uptime: 3600,
      agents: this.getSimulatedAgents(),
      channels: this.getSimulatedChannels(),
      timestamp: new Date().toISOString(),
    };
  }

  private getSimulatedMetrics(): GatewayMetrics {
    return {
      timestamp: new Date().toISOString(),
      system: {
        cpu: 45 + Math.random() * 20,
        memory: 68 + Math.random() * 15,
        disk: 25 + Math.random() * 10,
        network: {
          in: 120 + Math.random() * 80,
          out: 85 + Math.random() * 60,
        },
      },
      gateway: {
        activeSessions: 12 + Math.floor(Math.random() * 8),
        totalRequests: 12450 + Math.floor(Math.random() * 1000),
        errorRate: 0.5 + Math.random() * 1.5,
        responseTime: 42 + Math.random() * 20,
      },
      agents: {
        total: 8,
        online: 6,
        offline: 1,
        degraded: 1,
      },
    };
  }

  private getSimulatedAgent(agentId: string): AgentStatus {
    const agents = this.getSimulatedAgents();
    return agents.find(a => a.id === agentId) || {
      id: agentId,
      name: `Agent ${agentId}`,
      status: 'online',
      model: 'deepseek-chat',
      uptime: 1800,
      lastActivity: new Date().toISOString(),
      memoryUsage: 45 + Math.random() * 30,
      cpuUsage: 35 + Math.random() * 40,
      sessionCount: 3 + Math.floor(Math.random() * 5),
    };
  }

  private getSimulatedAgents(): AgentStatus[] {
    return [
      {
        id: 'agent-main',
        name: 'Main Orchestrator',
        status: 'online',
        model: 'deepseek/deepseek-chat',
        uptime: 7200,
        lastActivity: new Date().toISOString(),
        memoryUsage: 68,
        cpuUsage: 45,
        sessionCount: 8,
      },
      {
        id: 'agent-data',
        name: 'Data Processor',
        status: 'online',
        model: 'llama3.1:8b',
        uptime: 5400,
        lastActivity: new Date().toISOString(),
        memoryUsage: 45,
        cpuUsage: 32,
        sessionCount: 4,
      },
      {
        id: 'agent-api',
        name: 'API Gateway',
        status: 'degraded',
        model: 'claude-3-haiku',
        uptime: 1800,
        lastActivity: new Date(Date.now() - 300000).toISOString(),
        memoryUsage: 82,
        cpuUsage: 78,
        sessionCount: 12,
      },
      {
        id: 'agent-cache',
        name: 'Cache Manager',
        status: 'online',
        model: 'gpt-4o-mini',
        uptime: 10800,
        lastActivity: new Date().toISOString(),
        memoryUsage: 34,
        cpuUsage: 22,
        sessionCount: 6,
      },
    ];
  }

  private getSimulatedChannels(): ChannelStatus[] {
    return [
      {
        id: 'telegram-default',
        provider: 'telegram',
        status: 'connected',
        connectedSince: new Date(Date.now() - 3600000).toISOString(),
        messageCount: 124,
        lastError: 'Network request failed (temporary)',
      },
      {
        id: 'whatsapp-8622550990',
        provider: 'whatsapp',
        status: 'error',
        connectedSince: new Date(Date.now() - 1800000).toISOString(),
        messageCount: 56,
        lastError: 'Session conflict (status 440)',
      },
      {
        id: 'discord-main',
        provider: 'discord',
        status: 'connected',
        connectedSince: new Date(Date.now() - 7200000).toISOString(),
        messageCount: 892,
      },
    ];
  }
}

// Singleton instance
let gatewayClient: OpenClawGatewayClient | null = null;

export function getGatewayClient(): OpenClawGatewayClient {
  if (!gatewayClient) {
    const baseUrl = process.env.NEXT_PUBLIC_OPENCLAW_API || 'http://localhost:18789';
    const gatewayToken = process.env.OPENCLAW_GATEWAY_TOKEN;
    gatewayClient = new OpenClawGatewayClient(baseUrl, gatewayToken);
  }
  return gatewayClient;
}