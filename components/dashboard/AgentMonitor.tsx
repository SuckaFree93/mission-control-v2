'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Activity, Cpu, HardDrive, Network, Shield, Zap, AlertCircle, CheckCircle } from 'lucide-react';

interface Agent {
  id: string;
  name: string;
  type: 'websocket' | 'database' | 'api' | 'cache' | 'monitor';
  status: 'online' | 'offline' | 'degraded' | 'maintenance';
  cpu: number;
  memory: number;
  uptime: number; // in hours
  lastSeen: Date;
  version: string;
  location: string;
  tags: string[];
  metrics: {
    requestsPerSecond: number;
    errorRate: number;
    responseTime: number;
    connections: number;
  };
}

export function AgentMonitor() {
  const [agents, setAgents] = useState<Agent[]>([
    {
      id: '1',
      name: 'WebSocket Server',
      type: 'websocket',
      status: 'online',
      cpu: 24,
      memory: 68,
      uptime: 720,
      lastSeen: new Date(),
      version: '2.1.0',
      location: 'us-east-1',
      tags: ['core', 'realtime'],
      metrics: {
        requestsPerSecond: 142,
        errorRate: 0.2,
        responseTime: 42,
        connections: 156,
      },
    },
    {
      id: '2',
      name: 'Database Cluster',
      type: 'database',
      status: 'online',
      cpu: 18,
      memory: 45,
      uptime: 168,
      lastSeen: new Date(Date.now() - 5 * 60 * 1000),
      version: '1.4.2',
      location: 'us-west-2',
      tags: ['persistence', 'critical'],
      metrics: {
        requestsPerSecond: 89,
        errorRate: 0.1,
        responseTime: 28,
        connections: 24,
      },
    },
    {
      id: '3',
      name: 'API Gateway',
      type: 'api',
      status: 'degraded',
      cpu: 92,
      memory: 78,
      uptime: 336,
      lastSeen: new Date(Date.now() - 2 * 60 * 1000),
      version: '3.0.1',
      location: 'eu-central-1',
      tags: ['gateway', 'load-balancer'],
      metrics: {
        requestsPerSecond: 245,
        errorRate: 2.4,
        responseTime: 128,
        connections: 89,
      },
    },
    {
      id: '4',
      name: 'Cache Service',
      type: 'cache',
      status: 'online',
      cpu: 12,
      memory: 32,
      uptime: 240,
      lastSeen: new Date(Date.now() - 1 * 60 * 1000),
      version: '1.2.3',
      location: 'us-east-1',
      tags: ['performance', 'memory'],
      metrics: {
        requestsPerSecond: 512,
        errorRate: 0.05,
        responseTime: 8,
        connections: 45,
      },
    },
    {
      id: '5',
      name: 'Monitoring Agent',
      type: 'monitor',
      status: 'maintenance',
      cpu: 8,
      memory: 24,
      uptime: 480,
      lastSeen: new Date(Date.now() - 30 * 60 * 1000),
      version: '1.0.0',
      location: 'global',
      tags: ['monitoring', 'metrics'],
      metrics: {
        requestsPerSecond: 12,
        errorRate: 0,
        responseTime: 15,
        connections: 8,
      },
    },
  ]);

  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [filter, setFilter] = useState<'all' | 'online' | 'degraded' | 'offline'>('all');

  const filteredAgents = agents.filter(agent => {
    if (filter === 'all') return true;
    return agent.status === filter;
  });

  const getAgentIcon = (type: Agent['type']) => {
    switch (type) {
      case 'websocket': return <Network className="w-5 h-5" />;
      case 'database': return <HardDrive className="w-5 h-5" />;
      case 'api': return <Activity className="w-5 h-5" />;
      case 'cache': return <Zap className="w-5 h-5" />;
      case 'monitor': return <Shield className="w-5 h-5" />;
    }
  };

  const getStatusColor = (status: Agent['status']) => {
    switch (status) {
      case 'online': return 'bg-green-500/10 text-green-400 border-green-500/20';
      case 'degraded': return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
      case 'offline': return 'bg-red-500/10 text-red-400 border-red-500/20';
      case 'maintenance': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
    }
  };

  const getStatusIcon = (status: Agent['status']) => {
    switch (status) {
      case 'online': return <CheckCircle className="w-4 h-4" />;
      case 'degraded': return <AlertCircle className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  const formatUptime = (hours: number) => {
    if (hours < 24) return `${hours}h`;
    const days = Math.floor(hours / 24);
    const remainingHours = hours % 24;
    return `${days}d ${remainingHours}h`;
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    return `${diffHours}h ago`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Agent Monitor</h2>
          <p className="text-gray-400">Monitor and manage all system agents</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-gray-900/50 rounded-lg p-1">
            {(['all', 'online', 'degraded', 'offline'] as const).map((filterType) => (
              <button
                key={filterType}
                onClick={() => setFilter(filterType)}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  filter === filterType
                    ? 'bg-gray-800 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                }`}
              >
                {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
              </button>
            ))}
          </div>
          <button className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-lg hover:opacity-90 transition-opacity">
            Add Agent
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          {
            label: 'Total Agents',
            value: agents.length.toString(),
            change: '+2',
            color: 'blue',
            icon: <Activity className="w-5 h-5" />,
          },
          {
            label: 'Online',
            value: agents.filter(a => a.status === 'online').length.toString(),
            change: '▲ 1',
            color: 'green',
            icon: <CheckCircle className="w-5 h-5" />,
          },
          {
            label: 'Degraded',
            value: agents.filter(a => a.status === 'degraded').length.toString(),
            change: '▲ 1',
            color: 'yellow',
            icon: <AlertCircle className="w-5 h-5" />,
          },
          {
            label: 'Avg CPU',
            value: `${Math.round(agents.reduce((sum, a) => sum + a.cpu, 0) / agents.length)}%`,
            change: '▼ 5%',
            color: 'indigo',
            icon: <Cpu className="w-5 h-5" />,
          },
        ].map((stat, index) => (
          <div
            key={index}
            className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-6 border border-gray-800"
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-400">{stat.label}</div>
                <div className="text-3xl font-bold text-white mt-2">{stat.value}</div>
                <div className={`text-sm font-medium mt-1 ${
                  stat.color === 'green' ? 'text-green-400' :
                  stat.color === 'blue' ? 'text-blue-400' :
                  stat.color === 'yellow' ? 'text-yellow-400' :
                  'text-indigo-400'
                }`}>
                  {stat.change}
                </div>
              </div>
              <div className={`p-3 rounded-lg ${
                stat.color === 'green' ? 'bg-green-500/10' :
                stat.color === 'blue' ? 'bg-blue-500/10' :
                stat.color === 'yellow' ? 'bg-yellow-500/10' :
                'bg-indigo-500/10'
              }`}>
                <div className={`${
                  stat.color === 'green' ? 'text-green-400' :
                  stat.color === 'blue' ? 'text-blue-400' :
                  stat.color === 'yellow' ? 'text-yellow-400' :
                  'text-indigo-400'
                }`}>
                  {stat.icon}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Agents Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredAgents.map((agent) => (
          <motion.div
            key={agent.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`bg-gray-900/50 backdrop-blur-sm rounded-xl p-6 border ${
              selectedAgent?.id === agent.id ? 'border-blue-500' : 'border-gray-800'
            } hover:border-gray-700 transition-colors cursor-pointer`}
            onClick={() => setSelectedAgent(agent)}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-800/50 rounded-lg">
                  {getAgentIcon(agent.type)}
                </div>
                <div>
                  <h3 className="font-semibold text-white">{agent.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs ${getStatusColor(agent.status)}`}>
                      {getStatusIcon(agent.status)}
                      {agent.status.charAt(0).toUpperCase() + agent.status.slice(1)}
                    </span>
                    <span className="text-xs text-gray-400">{agent.version}</span>
                    <span className="text-xs text-gray-400">•</span>
                    <span className="text-xs text-gray-400">{agent.location}</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-400">Uptime</div>
                <div className="text-lg font-bold text-white">{formatUptime(agent.uptime)}</div>
              </div>
            </div>

            {/* Resource Usage */}
            <div className="space-y-3 mb-4">
              <div>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-gray-400">CPU Usage</span>
                  <span className={`font-medium ${
                    agent.cpu > 80 ? 'text-red-400' :
                    agent.cpu > 60 ? 'text-yellow-400' : 'text-green-400'
                  }`}>
                    {agent.cpu}%
                  </span>
                </div>
                <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      agent.cpu > 80 ? 'bg-red-500' :
                      agent.cpu > 60 ? 'bg-yellow-500' : 'bg-green-500'
                    }`}
                    style={{ width: `${agent.cpu}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-gray-400">Memory Usage</span>
                  <span className={`font-medium ${
                    agent.memory > 80 ? 'text-red-400' :
                    agent.memory > 60 ? 'text-yellow-400' : 'text-green-400'
                  }`}>
                    {agent.memory}%
                  </span>
                </div>
                <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      agent.memory > 80 ? 'bg-red-500' :
                      agent.memory > 60 ? 'bg-yellow-500' : 'bg-blue-500'
                    }`}
                    style={{ width: `${agent.memory}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Requests/s', value: agent.metrics.requestsPerSecond, unit: '' },
                { label: 'Error Rate', value: agent.metrics.errorRate, unit: '%' },
                { label: 'Response Time', value: agent.metrics.responseTime, unit: 'ms' },
                { label: 'Connections', value: agent.metrics.connections, unit: '' },
              ].map((metric, index) => (
                <div key={index} className="text-center p-3 bg-gray-800/30 rounded-lg">
                  <div className="text-sm text-gray-400">{metric.label}</div>
                  <div className="text-xl font-bold text-white mt-1">
                    {metric.value}
                    {metric.unit}
                  </div>
                </div>
              ))}
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mt-4">
              {agent.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-gray-800/50 text-gray-300 text-xs rounded"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Last Seen */}
            <div className="text-xs text-gray-500 mt-4">
              Last seen: {formatTimeAgo(agent.lastSeen)}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Agent Detail Panel */}
      {selectedAgent && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-6 border border-gray-800"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-white">Agent Details: {selectedAgent.name}</h3>
            <button
              onClick={() => setSelectedAgent(null)}
              className="text-gray-400 hover:text-white"
            >
              Close
            </button>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-400 mb-2">Agent Information</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-300">Type</span>
                    <span className="text-white">{selectedAgent.type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Status</span>
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs ${getStatusColor(selectedAgent.status)}`}>
                      {getStatusIcon(selectedAgent.status)}
                      {selectedAgent.status}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Version</span>
                    <span className="text-white">{selectedAgent.version}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Location</span>
                    <span className="text-white">{selectedAgent.location}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Uptime</span>
                    <span className="text-white">{formatUptime(selectedAgent.uptime)}</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-400 mb-2">Resource Usage</h4>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-gray-400">CPU Usage</span>
                      <span className={`font-medium ${
                        selectedAgent.cpu > 80 ? 'text-red-400' :
                        selectedAgent.cpu > 60 ? 'text-yellow-400' : 'text-green-400'
                      }`}>
                        {selectedAgent.cpu}%
                      </span>
                    </div>
                    <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          selectedAgent.cpu > 80 ? 'bg-red-500' :
                          selectedAgent.cpu > 60 ? 'bg-yellow-500' : 'bg-green-500'
                        }`}
                        style={{ width: `${selectedAgent.cpu}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-gray-400">Memory Usage</span>
                      <span className={`font-medium ${
                        selectedAgent.memory > 80 ? 'text-red-400' :
                        selectedAgent.memory > 60 ? 'text-yellow-400' : 'text-blue-400'
                      }`}>
                        {selectedAgent.memory}%
                      </span>
                    </div>
                    <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          selectedAgent.memory > 80 ? 'bg-red-500' :
                          selectedAgent.memory > 60 ? 'bg-yellow-500' : 'bg-blue-500'
                        }`}
                        style={{ width: `${selectedAgent.memory}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-2 space-y-6">
              <div>
                <h4 className="text-sm font-medium text-gray-400 mb-4">Performance Metrics</h4>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: 'Requests/s', value: selectedAgent.metrics.requestsPerSecond, unit: '', color: 'blue' },
                    { label: 'Error Rate', value: selectedAgent.metrics.errorRate, unit: '%', color: selectedAgent.metrics.errorRate > 2 ? 'red' : 'green' },
                    { label: 'Response Time', value: selectedAgent.metrics.responseTime, unit: 'ms', color: selectedAgent.metrics.responseTime > 100 ? 'yellow' : 'green' },
                    { label: 'Connections', value: selectedAgent.metrics.connections, unit: '', color: 'indigo' },
                  ].map((metric, index) => (
                    <div key={index} className="bg-gray-800/30 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-sm text-gray-400">{metric.label}</div>
                          <div className="text-2xl font-bold text-white mt-1">
                            {metric.value}
                            {metric.unit}
                          </div>
                        </div>
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                          metric.color === 'blue' ? 'bg-blue-500/10 text-blue-400' :
                          metric.color === 'red' ? 'bg-red-500/10 text-red-400' :
                          metric.color === 'yellow' ? 'bg-yellow-500/10 text-yellow-400' :
                          metric.color === 'green' ? 'bg-green-500/10 text-green-400' :
                          'bg-indigo-500/10 text-indigo-400'
                        }`}>
                          {metric.label === 'Requests/s' && <Activity className="w-6 h-6" />}
                          {metric.label === 'Error Rate' && <AlertCircle className="w-6 h-6" />}
                          {metric.label === 'Response Time' && <Zap className="w-6 h-6" />}
                          {metric.label === 'Connections' && <Network className="w-6 h-6" />}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-400 mb-4">Tags</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedAgent.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1.5 bg-gray-800/50 text-gray-300 text-sm rounded-lg"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-400 mb-4">Actions</h4>
                <div className="flex gap-3">
                  <button className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors">
                    Restart Agent
                  </button>
                  <button className="px-4 py-2 bg-gray-800 text-white font-medium rounded-lg hover:bg-gray-700 transition-colors">
                    View Logs
                  </button>
                  <button className="px-4 py-2 bg-gray-800 text-white font-medium rounded-lg hover:bg-gray-700 transition-colors">
                    Configuration
                  </button>
                  {selectedAgent.status === 'degraded' && (
                    <button className="px-4 py-2 bg-yellow-600 text-white font-medium rounded-lg hover:bg-yellow-700 transition-colors">
                      Diagnose
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}