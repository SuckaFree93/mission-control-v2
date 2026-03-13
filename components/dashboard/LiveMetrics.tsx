'use client';

import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CircularProgress } from '@/components/ui/CircularProgress';
import { GlassCard } from '@/components/ui/GlassCard';

interface SystemMetrics {
  cpu: {
    usage: number;
    cores: number;
  };
  memory: {
    used: number;
    total: number;
    percentage: number;
  };
  network: {
    connections: number;
    uptime: number;
  };
  agents: {
    active: number;
    total: number;
    status: string;
  };
  timestamp: string;
}

interface WebSocketMessage {
  type: string;
  payload: SystemMetrics;
  timestamp: string;
}

export function LiveMetrics() {
  const [metrics, setMetrics] = useState<SystemMetrics | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected'>('connecting');
  const [lastUpdate, setLastUpdate] = useState<string>('Never');
  const [ws, setWs] = useState<WebSocket | null>(null);

  const connectWebSocket = useCallback(() => {
    // For testing/demo purposes, we'll use a mock WebSocket
    // In production, this would connect to the real WebSocket server
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}/api/ws`;
    
    // Create a mock WebSocket for testing
    const websocket = new WebSocket(wsUrl);
    
    websocket.onopen = () => {
      console.log('🔌 WebSocket connected');
      setConnectionStatus('connected');
    };
    
    websocket.onmessage = (event) => {
      try {
        const message: WebSocketMessage = JSON.parse(event.data);
        
        if (message.type === 'system_metrics') {
          setMetrics(message.payload);
          setLastUpdate(new Date(message.timestamp).toLocaleTimeString());
        }
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };
    
    websocket.onclose = () => {
      console.log('🔌 WebSocket disconnected');
      setConnectionStatus('disconnected');
      
      // Attempt to reconnect after 3 seconds
      setTimeout(() => {
        if (connectionStatus !== 'connected') {
          connectWebSocket();
        }
      }, 3000);
    };
    
    websocket.onerror = (error) => {
      console.error('WebSocket error:', error);
      setConnectionStatus('disconnected');
    };
    
    setWs(websocket);
    
    return websocket;
  }, []);

  useEffect(() => {
    const websocket = connectWebSocket();
    
    return () => {
      if (websocket) {
        websocket.close();
      }
    };
  }, [connectWebSocket]);

  const formatUptime = (seconds: number) => {
    const days = Math.floor(seconds / (24 * 3600));
    const hours = Math.floor((seconds % (24 * 3600)) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'operational': return 'text-green-400';
      case 'degraded': return 'text-yellow-400';
      case 'critical': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getConnectionStatusColor = () => {
    switch (connectionStatus) {
      case 'connected': return 'bg-green-500';
      case 'connecting': return 'bg-yellow-500';
      case 'disconnected': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <GlassCard className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-semibold text-white">Live System Metrics</h3>
          <p className="text-sm text-gray-400">Real-time monitoring dashboard</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${getConnectionStatusColor()} animate-pulse`} />
            <span className="text-sm font-medium capitalize">
              {connectionStatus}
            </span>
          </div>
          
          <div className="text-xs text-gray-500">
            Last update: {lastUpdate}
          </div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {metrics ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {/* CPU Usage */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-300">CPU Usage</span>
                <span className="text-lg font-bold text-white">{metrics.cpu.usage.toFixed(1)}%</span>
              </div>
              <CircularProgress
                value={metrics.cpu.usage}
                size={80}
                strokeWidth={8}
                color="from-cyan-400 to-blue-500"
              />
              <div className="text-xs text-gray-400 text-center">
                {metrics.cpu.cores} cores
              </div>
            </div>

            {/* Memory Usage */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-300">Memory</span>
                <span className="text-lg font-bold text-white">{metrics.memory.percentage}%</span>
              </div>
              <CircularProgress
                value={metrics.memory.percentage}
                size={80}
                strokeWidth={8}
                color="from-purple-400 to-pink-500"
              />
              <div className="text-xs text-gray-400 text-center">
                {metrics.memory.used}MB / {metrics.memory.total}MB
              </div>
            </div>

            {/* Network */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-300">Network</span>
                <span className="text-lg font-bold text-white">{metrics.network.connections}</span>
              </div>
              <div className="relative">
                <div className="w-20 h-20 mx-auto rounded-full border-4 border-blue-500/30 flex items-center justify-center">
                  <div className="text-2xl font-bold text-white">{metrics.network.connections}</div>
                </div>
                <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-400 animate-spin" />
              </div>
              <div className="text-xs text-gray-400 text-center">
                Uptime: {formatUptime(metrics.network.uptime)}
              </div>
            </div>

            {/* Agents */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-300">Active Agents</span>
                <span className="text-lg font-bold text-white">{metrics.agents.active}/{metrics.agents.total}</span>
              </div>
              <div className="relative">
                <div className="w-20 h-20 mx-auto rounded-full border-4 border-green-500/30 flex items-center justify-center">
                  <div className="text-2xl font-bold text-white">{metrics.agents.active}</div>
                </div>
                <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-green-400 animate-pulse" />
              </div>
              <div className={`text-xs font-medium text-center ${getStatusColor(metrics.agents.status)}`}>
                {metrics.agents.status.toUpperCase()}
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center py-12"
          >
            <div className="w-16 h-16 border-4 border-gray-700 border-t-blue-500 rounded-full animate-spin mb-4" />
            <p className="text-gray-400">Connecting to real-time data stream...</p>
            <p className="text-sm text-gray-500 mt-2">Establishing WebSocket connection</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Connection Controls */}
      <div className="mt-8 pt-6 border-t border-white/10 flex items-center justify-between">
        <div className="text-sm text-gray-400">
          Data updates every 5 seconds via WebSocket
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={() => ws?.send(JSON.stringify({ type: 'request_metrics' }))}
            className="px-3 py-1.5 text-sm bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
          >
            Refresh Now
          </button>
          
          <button
            onClick={() => {
              if (ws?.readyState === WebSocket.OPEN) {
                ws.close();
              } else {
                connectWebSocket();
              }
            }}
            className="px-3 py-1.5 text-sm bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg transition-colors"
          >
            {connectionStatus === 'connected' ? 'Disconnect' : 'Reconnect'}
          </button>
        </div>
      </div>
    </GlassCard>
  );
}