// Simple WebSocket server for testing real-time features
// This is a mock implementation for demonstration

export class TestWebSocketServer {
  private clients: Set<WebSocket> = new Set();
  private interval: NodeJS.Timeout | null = null;

  constructor() {
    console.log('🧪 Test WebSocket server created');
  }

  // Mock WebSocket connection handler
  handleConnection(ws: WebSocket) {
    this.clients.add(ws);
    console.log(`🧪 Test client connected. Total: ${this.clients.size}`);

    // Send welcome message
    this.sendToClient(ws, {
      type: 'notification',
      payload: {
        title: 'Test WebSocket Connected',
        message: 'Real-time test server is active',
        level: 'info'
      },
      timestamp: new Date().toISOString()
    });

    // Send initial metrics
    this.sendSystemMetrics(ws);

    // Handle messages
    ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data.toString());
        console.log('🧪 Received message:', message.type);
        
        if (message.type === 'request_metrics') {
          this.sendSystemMetrics(ws);
        }
      } catch (error) {
        console.error('Error parsing test message:', error);
      }
    };

    // Handle disconnect
    ws.onclose = () => {
      this.clients.delete(ws);
      console.log(`🧪 Test client disconnected. Total: ${this.clients.size}`);
    };

    // Handle errors
    ws.onerror = (error) => {
      console.error('Test WebSocket error:', error);
      this.clients.delete(ws);
    };
  }

  private sendSystemMetrics(ws: WebSocket) {
    const metrics = this.generateTestMetrics();
    this.sendToClient(ws, {
      type: 'system_metrics',
      payload: metrics,
      timestamp: new Date().toISOString()
    });
  }

  private generateTestMetrics() {
    const now = Date.now();
    
    // Generate realistic-looking test data
    return {
      cpu: {
        usage: 20 + Math.sin(now / 1000) * 15 + Math.random() * 10,
        cores: 8
      },
      memory: {
        used: 1200 + Math.sin(now / 2000) * 200,
        total: 16384,
        percentage: Math.round((1200 + Math.sin(now / 2000) * 200) / 16384 * 100)
      },
      network: {
        connections: this.clients.size,
        uptime: Math.floor(now / 1000) % 86400 // Simulate uptime in seconds
      },
      agents: {
        active: 3 + Math.floor(Math.random() * 4),
        total: 15,
        status: Math.random() > 0.8 ? 'degraded' : 'operational'
      },
      timestamp: new Date().toISOString()
    };
  }

  private sendToClient(ws: WebSocket, message: any) {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(message));
    }
  }

  startBroadcasting(intervalMs: number = 5000) {
    if (this.interval) {
      clearInterval(this.interval);
    }

    this.interval = setInterval(() => {
      const metrics = this.generateTestMetrics();
      const message = {
        type: 'system_metrics',
        payload: metrics,
        timestamp: new Date().toISOString()
      };

      this.clients.forEach(client => {
        this.sendToClient(client, message);
      });

      console.log(`🧪 Broadcast metrics to ${this.clients.size} clients`);
    }, intervalMs);

    console.log(`🧪 Started broadcasting every ${intervalMs}ms`);
  }

  stop() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }

    this.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.close();
      }
    });

    this.clients.clear();
    console.log('🧪 Test WebSocket server stopped');
  }

  getClientCount(): number {
    return this.clients.size;
  }
}

// Create a global instance for testing
let testServer: TestWebSocketServer | null = null;

export function getTestWebSocketServer(): TestWebSocketServer {
  if (!testServer) {
    testServer = new TestWebSocketServer();
  }
  return testServer;
}