'use client';

import { useState, useEffect } from 'react';

interface GatewayStatus {
  status: string;
  version: string;
  uptime: number;
  agents: any[];
  channels: any[];
}

export default function TestOpenClawPage() {
  const [status, setStatus] = useState<GatewayStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStatus = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/openclaw/status');
      const data = await response.json();
      
      if (data.success) {
        setStatus(data.data);
        setError(null);
      } else {
        setError(data.error || 'Failed to fetch status');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  const handleRestart = async () => {
    try {
      const response = await fetch('/api/openclaw/status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'restart' }),
      });
      const data = await response.json();
      alert(data.message || 'Action completed');
      fetchStatus(); // Refresh status
    } catch (err) {
      alert('Failed to restart: ' + (err instanceof Error ? err.message : 'Unknown error'));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 to-gray-900 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">OpenClaw Integration Test</h1>
          <p className="text-gray-400">Test connection to OpenClaw gateway API</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Status Card */}
          <div className="lg:col-span-2 bg-gray-900/50 backdrop-blur-sm rounded-xl p-6 border border-gray-800">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">Gateway Status</h2>
              <div className="flex items-center gap-3">
                <button
                  onClick={fetchStatus}
                  className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg transition-colors"
                >
                  Refresh
                </button>
                <button
                  onClick={handleRestart}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                >
                  Restart Gateway
                </button>
              </div>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : error ? (
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <h3 className="font-medium text-red-400">Connection Error</h3>
                </div>
                <p className="text-red-300 text-sm">{error}</p>
                <p className="text-gray-400 text-sm mt-2">
                  Make sure OpenClaw gateway is running on port 18789
                </p>
              </div>
            ) : status ? (
              <div className="space-y-6">
                {/* Basic Info */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-gray-800/30 rounded-lg p-4">
                    <div className="text-sm text-gray-400 mb-1">Status</div>
                    <div className={`text-lg font-semibold ${
                      status.status === 'running' ? 'text-green-400' : 
                      status.status === 'error' ? 'text-red-400' : 'text-yellow-400'
                    }`}>
                      {status.status.toUpperCase()}
                    </div>
                  </div>
                  <div className="bg-gray-800/30 rounded-lg p-4">
                    <div className="text-sm text-gray-400 mb-1">Version</div>
                    <div className="text-lg font-semibold text-white">{status.version}</div>
                  </div>
                  <div className="bg-gray-800/30 rounded-lg p-4">
                    <div className="text-sm text-gray-400 mb-1">Uptime</div>
                    <div className="text-lg font-semibold text-white">
                      {Math.floor(status.uptime / 3600)}h {Math.floor((status.uptime % 3600) / 60)}m
                    </div>
                  </div>
                  <div className="bg-gray-800/30 rounded-lg p-4">
                    <div className="text-sm text-gray-400 mb-1">Agents</div>
                    <div className="text-lg font-semibold text-white">{status.agents.length}</div>
                  </div>
                </div>

                {/* Agents List */}
                <div>
                  <h3 className="text-lg font-medium text-white mb-3">Active Agents</h3>
                  <div className="space-y-2">
                    {status.agents.map((agent: any) => (
                      <div key={agent.id} className="bg-gray-800/30 rounded-lg p-4 border border-gray-700/50">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium text-white">{agent.name}</div>
                            <div className="text-sm text-gray-400">{agent.id}</div>
                          </div>
                          <div className={`px-3 py-1 rounded-full text-sm ${
                            agent.status === 'online' ? 'bg-green-500/20 text-green-400' :
                            agent.status === 'degraded' ? 'bg-yellow-500/20 text-yellow-400' :
                            'bg-red-500/20 text-red-400'
                          }`}>
                            {agent.status}
                          </div>
                        </div>
                        <div className="grid grid-cols-3 gap-4 mt-3 text-sm">
                          <div>
                            <div className="text-gray-400">Model</div>
                            <div className="text-gray-300">{agent.model}</div>
                          </div>
                          <div>
                            <div className="text-gray-400">CPU</div>
                            <div className="text-gray-300">{agent.cpuUsage || 0}%</div>
                          </div>
                          <div>
                            <div className="text-gray-400">Memory</div>
                            <div className="text-gray-300">{agent.memoryUsage || 0}%</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Channels */}
                <div>
                  <h3 className="text-lg font-medium text-white mb-3">Channels</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {status.channels.map((channel: any) => (
                      <div key={channel.id} className="bg-gray-800/30 rounded-lg p-4 border border-gray-700/50">
                        <div className="flex items-center justify-between mb-2">
                          <div className="font-medium text-white">{channel.provider}</div>
                          <div className={`w-2 h-2 rounded-full ${
                            channel.status === 'connected' ? 'bg-green-500' :
                            channel.status === 'error' ? 'bg-red-500' : 'bg-yellow-500'
                          }`} />
                        </div>
                        <div className="text-sm text-gray-400">
                          Messages: {channel.messageCount}
                        </div>
                        {channel.lastError && (
                          <div className="text-xs text-red-400 mt-2">
                            Error: {channel.lastError}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : null}
          </div>

          {/* API Endpoints */}
          <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-6 border border-gray-800">
            <h2 className="text-xl font-semibold text-white mb-6">API Endpoints</h2>
            <div className="space-y-4">
              <div className="bg-gray-800/30 rounded-lg p-4">
                <div className="font-medium text-white mb-1">Gateway Status</div>
                <div className="text-sm text-gray-400 font-mono">GET /api/openclaw/status</div>
                <button
                  onClick={() => fetch('/api/openclaw/status').then(r => r.json()).then(console.log)}
                  className="mt-2 text-sm text-blue-400 hover:text-blue-300"
                >
                  Test Endpoint
                </button>
              </div>
              
              <div className="bg-gray-800/30 rounded-lg p-4">
                <div className="font-medium text-white mb-1">Gateway Metrics</div>
                <div className="text-sm text-gray-400 font-mono">GET /api/openclaw/metrics</div>
                <button
                  onClick={() => fetch('/api/openclaw/metrics').then(r => r.json()).then(console.log)}
                  className="mt-2 text-sm text-blue-400 hover:text-blue-300"
                >
                  Test Endpoint
                </button>
              </div>
              
              <div className="bg-gray-800/30 rounded-lg p-4">
                <div className="font-medium text-white mb-1">Agents List</div>
                <div className="text-sm text-gray-400 font-mono">GET /api/openclaw/agents</div>
                <button
                  onClick={() => fetch('/api/openclaw/agents').then(r => r.json()).then(console.log)}
                  className="mt-2 text-sm text-blue-400 hover:text-blue-300"
                >
                  Test Endpoint
                </button>
              </div>
              
              <div className="bg-gray-800/30 rounded-lg p-4">
                <div className="font-medium text-white mb-1">Restart Gateway</div>
                <div className="text-sm text-gray-400 font-mono">POST /api/openclaw/status</div>
                <div className="text-xs text-gray-500 mt-1">Body: {"{ action: 'restart' }"}</div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-800">
              <h3 className="font-medium text-white mb-3">Connection Info</h3>
              <div className="text-sm space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-400">Base URL:</span>
                  <span className="text-gray-300">http://localhost:18789</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Environment:</span>
                  <span className="text-gray-300">{process.env.NODE_ENV}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">API Proxy:</span>
                  <span className="text-gray-300">/api/openclaw/*</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}