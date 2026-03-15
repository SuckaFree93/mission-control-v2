'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface SystemMetric {
  id: string;
  name: string;
  value: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  change: number;
  max: number;
}

interface OpenClawMetrics {
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

export function RealTimeMetrics() {
  const [metrics, setMetrics] = useState<SystemMetric[]>([
    { id: 'cpu', name: 'CPU Usage', value: 0, unit: '%', trend: 'stable', change: 0, max: 100 },
    { id: 'memory', name: 'Memory', value: 0, unit: '%', trend: 'stable', change: 0, max: 100 },
    { id: 'network', name: 'Network I/O', value: 0, unit: 'MB/s', trend: 'stable', change: 0, max: 1000 },
    { id: 'disk', name: 'Disk I/O', value: 0, unit: 'MB/s', trend: 'stable', change: 0, max: 500 },
    { id: 'agents', name: 'Active Agents', value: 0, unit: '', trend: 'stable', change: 0, max: 20 },
    { id: 'response', name: 'Response Time', value: 0, unit: 'ms', trend: 'stable', change: 0, max: 100 },
  ]);

  const [lastUpdate, setLastUpdate] = useState<string>('Loading...');
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch real OpenClaw metrics
  const fetchOpenClawMetrics = async () => {
    try {
      const response = await fetch('/api/openclaw/metrics');
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success && data.data) {
        const metricsData: OpenClawMetrics = data.data;
        
        // Update metrics with real data
        setMetrics([
          { 
            id: 'cpu', 
            name: 'CPU Usage', 
            value: parseFloat(metricsData.system.cpu.toFixed(1)), 
            unit: '%', 
            trend: 'stable', 
            change: 0, 
            max: 100 
          },
          { 
            id: 'memory', 
            name: 'Memory', 
            value: parseFloat(metricsData.system.memory.toFixed(1)), 
            unit: '%', 
            trend: 'stable', 
            change: 0, 
            max: 100 
          },
          { 
            id: 'network', 
            name: 'Network I/O', 
            value: parseFloat((metricsData.system.network.in + metricsData.system.network.out).toFixed(1)), 
            unit: 'MB/s', 
            trend: 'stable', 
            change: 0, 
            max: 1000 
          },
          { 
            id: 'disk', 
            name: 'Disk I/O', 
            value: parseFloat(metricsData.system.disk.toFixed(1)), 
            unit: 'MB/s', 
            trend: 'stable', 
            change: 0, 
            max: 500 
          },
          { 
            id: 'agents', 
            name: 'Active Agents', 
            value: metricsData.agents.online, 
            unit: '', 
            trend: 'stable', 
            change: 0, 
            max: 20 
          },
          { 
            id: 'response', 
            name: 'Response Time', 
            value: parseFloat(metricsData.gateway.responseTime.toFixed(1)), 
            unit: 'ms', 
            trend: 'stable', 
            change: 0, 
            max: 100 
          },
        ]);
        
        setIsConnected(true);
        setError(null);
        setLastUpdate(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
      } else {
        throw new Error(data.error || 'Failed to fetch metrics');
      }
    } catch (error) {
      console.error('Failed to fetch OpenClaw metrics:', error);
      setIsConnected(false);
      setError(error instanceof Error ? error.message : 'Connection failed');
      
      // Fallback to simulated data
      setMetrics(prev => prev.map(metric => {
        const randomChange = Math.random() * 4 - 2;
        const newValue = Math.max(0, Math.min(metric.max, metric.value + randomChange));
        
        let trend: 'up' | 'down' | 'stable';
        if (randomChange > 0.5) trend = 'up';
        else if (randomChange < -0.5) trend = 'down';
        else trend = 'stable';

        return {
          ...metric,
          value: parseFloat(newValue.toFixed(1)),
          trend,
          change: parseFloat(randomChange.toFixed(1))
        };
      }));
      
      setLastUpdate('Simulated data');
    }
  };

  // Fetch metrics on component mount and periodically
  useEffect(() => {
    fetchOpenClawMetrics();
    
    const interval = setInterval(() => {
      fetchOpenClawMetrics();
    }, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, []);

  const getTrendColor = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up': return 'text-green-500';
      case 'down': return 'text-red-500';
      case 'stable': return 'text-yellow-500';
    }
  };

  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up': return '↗';
      case 'down': return '↘';
      case 'stable': return '→';
    }
  };

  const getProgressColor = (value: number, max: number) => {
    const percentage = (value / max) * 100;
    if (percentage > 80) return 'bg-red-500';
    if (percentage > 60) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-6 border border-gray-800">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full animate-pulse ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
            Real-time System Metrics
            {isConnected ? (
              <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded-full">Connected</span>
            ) : (
              <span className="text-xs bg-red-500/20 text-red-400 px-2 py-1 rounded-full">Simulated</span>
            )}
          </h3>
          <p className="text-sm text-gray-400 mt-1">
            {isConnected ? 'Live monitoring of OpenClaw gateway' : 'Using simulated data (gateway not connected)'}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full animate-pulse ${isConnected ? 'bg-green-500' : 'bg-yellow-500'}`} />
            <span className="text-sm text-gray-300">{isConnected ? 'Live' : 'Simulated'}</span>
          </div>
          <div className="text-sm text-gray-400">Updated: {lastUpdate}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {metrics.map((metric, index) => (
          <motion.div
            key={metric.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-gray-800/30 rounded-lg p-4 border border-gray-700/50 hover:border-gray-600 transition-colors"
          >
            <div className="flex items-center justify-between mb-3">
              <div>
                <div className="text-sm font-medium text-gray-300">{metric.name}</div>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-2xl font-bold text-white">{metric.value}</span>
                  <span className="text-sm text-gray-400">{metric.unit}</span>
                </div>
              </div>
              <div className={`text-lg font-bold ${getTrendColor(metric.trend)}`}>
                {getTrendIcon(metric.trend)}
              </div>
            </div>

            {/* Progress bar */}
            <div className="mb-2">
              <div className="flex justify-between text-xs text-gray-400 mb-1">
                <span>0{metric.unit}</span>
                <span>{metric.max}{metric.unit}</span>
              </div>
              <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                <motion.div
                  className={`h-full ${getProgressColor(metric.value, metric.max)}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${(metric.value / metric.max) * 100}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>

            {/* Trend indicator */}
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-400">Trend</span>
              <div className={`flex items-center gap-1 ${getTrendColor(metric.trend)}`}>
                <span>{metric.change > 0 ? '+' : ''}{metric.change}{metric.unit}</span>
                <span>•</span>
                <span className="capitalize">{metric.trend}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Legend & Connection Status */}
      <div className="mt-6 pt-6 border-t border-gray-800">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-6 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <span className="text-gray-400">Normal</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <span className="text-gray-400">Warning</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <span className="text-gray-400">Critical</span>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
              <span className="text-xs text-gray-400">
                Gateway: {isConnected ? 'Connected' : 'Not Connected'}
              </span>
            </div>
            {error && (
              <div className="text-xs text-red-400 bg-red-500/10 px-2 py-1 rounded">
                Error: {error}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}