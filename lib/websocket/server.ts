import { WebSocketServer, WebSocket } from 'ws';
import { Server } from 'http';

export interface WebSocketMessage {
  type: 'system_metrics' | 'agent_status' | 'notification' | 'user_action' | 'dashboard_update';
  payload: any;
  timestamp: string;
  userId?: string;
}

export class MissionControlWebSocketServer {
  private wss: WebSocketServer;
  private clients: Map<string, WebSocket> = new Map();
  private metricsInterval: NodeJS.Timeout | null = null;

  constructor(server: Server) {
    this.wss = new WebSocketServer({ server });
    this.setupWebSocketServer();
  }

  private setupWebSocketServer() {
    this.wss.on('connection', (ws: WebSocket, request) => {
      const clientId = this.generateClientId();
      this.clients.set(clientId, ws);
      
      console.log(`🔌 WebSocket client connected: ${clientId}`);
      
      // Send welcome message
      this.sendToClient(clientId, {
        type: 'notification',
        payload: {
          title: 'Connected to Mission Control',
          message: 'Real-time data stream active',
          level: 'info'
        },
        timestamp: new Date().toISOString()
      });

      // Send initial system metrics
      this.sendToClient(clientId, {
        type: 'system_metrics',
        payload: this.generateSystemMetrics(),
        timestamp: new Date().toISOString()
      });

      // Handle messages from client
      ws.on('message', (data: Buffer) => {
        try {
          const message: WebSocketMessage = JSON.parse(data.toString());
          this.handleClientMessage(clientId, message);
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      });

      // Handle client disconnect
      ws.on('close', () => {
        console.log(`🔌 WebSocket client disconnected: ${clientId}`);
        this.clients.delete(clientId);
      });

      // Handle errors
      ws.on('error', (error) => {
        console.error(`WebSocket error for client ${clientId}:`, error);
        this.clients.delete(clientId);
      });
    });

    // Start metrics broadcasting
    this.startMetricsBroadcast();
  }

  private generateClientId(): string {
    return `client_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private startMetricsBroadcast() {
    // Broadcast system metrics every 5 seconds
    this.metricsInterval = setInterval(() => {
      this.broadcast({
        type: 'system_metrics',
        payload: this.generateSystemMetrics(),
        timestamp: new Date().toISOString()
      });
    }, 5000);
  }

  private generateSystemMetrics() {
    const memoryUsage = process.memoryUsage();
    const uptime = process.uptime();
    
    return {
      cpu: {
        usage: Math.random() * 100, // Simulated - replace with real metrics
        cores: require('os').cpus().length
      },
      memory: {
        used: Math.round(memoryUsage.heapUsed / 1024 / 1024),
        total: Math.round(memoryUsage.heapTotal / 1024 / 1024),
        percentage: Math.round((memoryUsage.heapUsed / memoryUsage.heapTotal) * 100)
      },
      network: {
        connections: this.clients.size,
        uptime: Math.round(uptime)
      },
      agents: {
        active: Math.floor(Math.random() * 10) + 1, // Simulated
        total: 15,
        status: 'operational'
      },
      timestamp: new Date().toISOString()
    };
  }

  private handleClientMessage(clientId: string, message: WebSocketMessage) {
    console.log(`📨 Message from ${clientId}:`, message.type);
    
    switch (message.type) {
      case 'user_action':
        // Handle user actions (button clicks, commands, etc.)
        this.broadcast({
          type: 'dashboard_update',
          payload: {
            action: message.payload.action,
            user: message.payload.user,
            data: message.payload.data
          },
          timestamp: new Date().toISOString(),
          userId: clientId
        });
        break;
        
      case 'notification':
        // Broadcast notifications to all clients
        this.broadcast({
          type: 'notification',
          payload: message.payload,
          timestamp: new Date().toISOString()
        });
        break;
        
      default:
        console.log(`Unhandled message type: ${message.type}`);
    }
  }

  public sendToClient(clientId: string, message: WebSocketMessage) {
    const client = this.clients.get(clientId);
    if (client && client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(message));
    }
  }

  public broadcast(message: WebSocketMessage) {
    const messageStr = JSON.stringify(message);
    
    this.clients.forEach((client, clientId) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(messageStr);
      }
    });
  }

  public getClientCount(): number {
    return this.clients.size;
  }

  public stop() {
    if (this.metricsInterval) {
      clearInterval(this.metricsInterval);
    }
    
    this.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.close();
      }
    });
    
    this.wss.close();
    console.log('🔌 WebSocket server stopped');
  }
}