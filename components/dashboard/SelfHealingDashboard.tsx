// Self-Healing Dashboard Component
'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Activity, 
  AlertCircle, 
  CheckCircle, 
  RefreshCw, 
  Server, 
  Shield, 
  Zap,
  Clock,
  BarChart3,
  Settings,
  Play,
  StopCircle,
  AlertTriangle,
  Heart
} from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import { CircularProgress } from '@/components/ui/CircularProgress';

interface AgentHealth {
  agentId: string;
  name: string;
  status: 'healthy' | 'degraded' | 'unresponsive' | 'crashed' | 'unknown';
  lastHeartbeat: Date;
  responseTime: number;
  errorCount: number;
  uptime: number;
  autoRecoveryEnabled: boolean;
  recoveryAttempts: number;
}

interface RecoveryAttempt {
  id: string;
  agentId: string;
  strategyId: string;
  timestamp: Date;
  status: 'pending' | 'in_progress' | 'success' | 'failed' | 'cancelled';
  duration?: number;
}

interface MonitoringStatus {
  isMonitoring: boolean;
  agentCount: number;
}

export function SelfHealingDashboard() {
  const [agents, setAgents] = useState<AgentHealth[]>([]);
  const [recoveryHistory, setRecoveryHistory] = useState<RecoveryAttempt[]>([]);
  const [monitoringStatus, setMonitoringStatus] = useState<MonitoringStatus>({ isMonitoring: false, agentCount: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);

  // Fetch data
  const fetchData = async () => {
    try {
      const [statusRes, historyRes] = await Promise.all([
        fetch('/api/agent-monitor/status'),
        fetch('/api/agent-monitor/recovery-history?limit=10')
      ]);

      if (statusRes.ok) {
        const statusData = await statusRes.json();
        if (statusData.success) {
          setAgents(statusData.data.agents || []);
          setMonitoringStatus(statusData.data.monitoring || { isMonitoring: false, agentCount: 0 });
        }
      }

      if (historyRes.ok) {
        const historyData = await historyRes.json();
        if (historyData.success) {
          setRecoveryHistory(historyData.data.recoveryAttempts || []);
        }
      }
    } catch (error) {
      console.error('Error fetching agent monitor data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Initial fetch and auto-refresh
  useEffect(() => {
    fetchData();
    
    if (autoRefresh) {
      const interval = setInterval(fetchData, 10000); // Refresh every 10 seconds
      return () => clearInterval(interval);
    }
  }, [autoRefresh]);

  // Control monitoring
  const toggleMonitoring = async (start: boolean) => {
    try {
      const response = await fetch('/api/agent-monitor/status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          action: start ? 'start_monitoring' : 'stop_monitoring' 
        })
      });

      if (response.ok) {
        fetchData(); // Refresh data
      }
    } catch (error) {
      console.error('Error toggling monitoring:', error);
    }
  };

  // Trigger manual recovery
  const triggerRecovery = async (agentId: string) => {
    try {
      const response = await fetch('/api/agent-monitor/status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          action: 'trigger_recovery',
          agentId
        })
      });

      if (response.ok) {
        alert(`Recovery triggered for agent ${agentId}`);
        fetchData();
      }
    } catch (error) {
      console.error('Error triggering recovery:', error);
    }
  };

  // Calculate statistics
  const healthyAgents = agents.filter(a => a.status === 'healthy').length;
  const degradedAgents = agents.filter(a => a.status === 'degraded').length;
  const unresponsiveAgents = agents.filter(a => a.status === 'unresponsive' || a.status === 'crashed').length;
  
  const totalRecoveryAttempts = recoveryHistory.length;
  const successfulRecoveries = recoveryHistory.filter(r => r.status === 'success').length;
  const recoverySuccessRate = totalRecoveryAttempts > 0 
    ? Math.round((successfulRecoveries / totalRecoveryAttempts) * 100) 
    : 100;

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'text-green-500';
      case 'degraded': return 'text-yellow-500';
      case 'unresponsive': return 'text-orange-500';
      case 'crashed': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  // Get status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy': return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'degraded': return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      case 'unresponsive': return <AlertTriangle className="w-5 h-5 text-orange-500" />;
      case 'crashed': return <AlertCircle className="w-5 h-5 text-red-500" />;
      default: return <Activity className="w-5 h-5 text-gray-500" />;
    }
  };

  // Format time
  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit'
    });
  };

  // Format duration
  const formatDuration = (ms?: number) => {
    if (!ms) return 'N/A';
    return `${Math.round(ms / 1000)}s`;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <Shield className="w-8 h-8 text-blue-500" />
            Self-Healing Agent System
          </h1>
          <p className="text-gray-400 mt-2">
            Automated monitoring and recovery for agent reliability
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <button
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
              autoRefresh 
                ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' 
                : 'bg-gray-800 text-gray-400 border border-gray-700'
            }`}
          >
            <RefreshCw className={`w-4 h-4 ${autoRefresh ? 'animate-spin' : ''}`} />
            {autoRefresh ? 'Auto-refresh ON' : 'Auto-refresh OFF'}
          </button>
          
          <button
            onClick={() => toggleMonitoring(!monitoringStatus.isMonitoring)}
            className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
              monitoringStatus.isMonitoring
                ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                : 'bg-green-500/20 text-green-400 border border-green-500/30'
            }`}
          >
            {monitoringStatus.isMonitoring ? (
              <>
                <StopCircle className="w-4 h-4" />
                Stop Monitoring
              </>
            ) : (
              <>
                <Play className="w-4 h-4" />
                Start Monitoring
              </>
            )}
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <GlassCard className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Agents</p>
              <p className="text-3xl font-bold text-white mt-2">{agents.length}</p>
            </div>
            <Server className="w-10 h-10 text-blue-500/50" />
          </div>
          <div className="mt-4 flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span className="text-sm text-gray-400">{healthyAgents} Healthy</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <span className="text-sm text-gray-400">{degradedAgents} Degraded</span>
            </div>
          </div>
        </GlassCard>

        <GlassCard className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Monitoring Status</p>
              <p className="text-3xl font-bold text-white mt-2">
                {monitoringStatus.isMonitoring ? 'ACTIVE' : 'INACTIVE'}
              </p>
            </div>
            <Activity className={`w-10 h-10 ${monitoringStatus.isMonitoring ? 'text-green-500/50 animate-pulse' : 'text-gray-500/50'}`} />
          </div>
          <div className="mt-4">
            <p className="text-sm text-gray-400">
              {monitoringStatus.isMonitoring 
                ? 'Agents being monitored every 30s' 
                : 'Monitoring paused'}
            </p>
          </div>
        </GlassCard>

        <GlassCard className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Recovery Success Rate</p>
              <p className="text-3xl font-bold text-white mt-2">{recoverySuccessRate}%</p>
            </div>
            <Zap className="w-10 h-10 text-green-500/50" />
          </div>
          <div className="mt-4">
            <p className="text-sm text-gray-400">
              {totalRecoveryAttempts} total recovery attempts
            </p>
          </div>
        </GlassCard>

        <GlassCard className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Auto-Recovery</p>
              <p className="text-3xl font-bold text-white mt-2">
                {agents.filter(a => a.autoRecoveryEnabled).length}/{agents.length}
              </p>
            </div>
            <Shield className="w-10 h-10 text-purple-500/50" />
          </div>
          <div className="mt-4">
            <p className="text-sm text-gray-400">
              Agents with auto-recovery enabled
            </p>
          </div>
        </GlassCard>
      </div>

      {/* Agent Status Grid */}
      <GlassCard className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Server className="w-5 h-5" />
            Agent Status
          </h2>
          <span className="text-sm text-gray-400">
            Last updated: {new Date().toLocaleTimeString()}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-800">
                <th className="text-left py-3 px-4 text-gray-400 font-medium">Agent</th>
                <th className="text-left py-3 px-4 text-gray-400 font-medium">Status</th>
                <th className="text-left py-3 px-4 text-gray-400 font-medium">Response Time</th>
                <th className="text-left py-3 px-4 text-gray-400 font-medium">Last Heartbeat</th>
                <th className="text-left py-3 px-4 text-gray-400 font-medium">Errors</th>
                <th className="text-left py-3 px-4 text-gray-400 font-medium">Recovery Attempts</th>
                <th className="text-left py-3 px-4 text-gray-400 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {agents.map((agent) => (
                <motion.tr 
                  key={agent.agentId}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="border-b border-gray-800/50 hover:bg-gray-800/20"
                >
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(agent.status)}
                      <div>
                        <p className="font-medium text-white">{agent.name}</p>
                        <p className="text-sm text-gray-500">{agent.agentId}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm ${getStatusColor(agent.status)} bg-gray-800/50`}>
                      {agent.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-500" />
                      <span className={agent.responseTime > 1000 ? 'text-yellow-500' : 'text-green-500'}>
                        {agent.responseTime}ms
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-gray-400">
                    {formatTime(agent.lastHeartbeat)}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <AlertCircle className={`w-4 h-4 ${agent.errorCount > 0 ? 'text-yellow-500' : 'text-gray-500'}`} />
                      <span className={agent.errorCount > 0 ? 'text-yellow-500' : 'text-gray-400'}>
                        {agent.errorCount}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <RefreshCw className="w-4 h-4 text-blue-500" />
                      <span className="text-blue-400">{agent.recoveryAttempts}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => triggerRecovery(agent.agentId)}
                        disabled={agent.status === 'healthy'}
                        className={`px-3 py-1 rounded text-sm ${
                          agent.status === 'healthy'
                            ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
                            : 'bg-blue-500/20 text-blue-400 hover:bg-blue-500/30'
                        }`}
                      >
                        Recover
                      </button>
                      <button className="px-3 py-1 rounded text-sm bg-gray-800 text-gray-400 hover:bg-gray-700">
                        Details
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {agents.length === 0 && (
          <div className="text-center py-12">
            <Activity className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-500">No agents registered yet</p>
            <p className="text-sm text-gray-600 mt-2">
              Agents will appear here once they register with the monitoring system
            </p>
          </div>
        )}
      </GlassCard>

      {/* Recovery History */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GlassCard className="p-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2 mb-6">
            <BarChart3 className="w-5 h-5" />
            Recovery History
          </h2>

          <div className="space-y-4">
            {recoveryHistory.slice(0, 5).map((attempt) => (
              <motion.div 
                key={attempt.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="p-4 rounded-lg bg-gray-800/30 border border-gray-700/50"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded ${
                      attempt.status === 'success' ? 'bg-green-500/20' :
                      attempt.status === 'failed' ? 'bg-red-500/20' :
                      attempt.status === 'in_progress' ? 'bg-blue-500/20' :
                      'bg-gray-500/20'
                    }`}>
                      {attempt.status === 'success' ? (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      ) : attempt.status === 'failed' ? (
                        <AlertCircle className="w-5 h-5 text-red-500" />
                      ) : attempt.status === 'in_progress' ? (
                        <RefreshCw className="w-5 h-5 text-blue-500 animate-spin" />
                      ) : (
                        <Clock className="w-5 h-5 text-gray-500" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-white">
                        Recovery for Agent {attempt.agentId.substring(0, 8)}...
                      </p>
                      <p className="text-sm text-gray-400">
                        Strategy: {attempt.strategyId.replace('_', ' ')}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-400">
                      {formatTime(attempt.timestamp)}
                    </p>
                    {attempt.duration && (
                      <p className="text-sm text-gray-500">
                        {formatDuration(attempt.duration)}
                      </p>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {recoveryHistory.length === 0 && (
            <div className="text-center py-8">
              <Shield className="w-12 h-12 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-500">No recovery attempts yet</p>
              <p className="text-sm text-gray-600 mt-2">
                Recovery history will appear here when agents need recovery
              </p>
            </div>
          )}

          {recoveryHistory.length > 0 && (
            <div className="mt-6 pt-6 border-t border-gray-800">
              <div className="flex items-center justify-between">
                <button className="text-blue-400 hover:text-blue-300 text-sm">
                  View All Recovery History →
                </button>
                <div className="text-sm text-gray-500">
                  Showing {Math.min(5, recoveryHistory.length)} of {recoveryHistory.length} attempts
                </div>
              </div>
            </div>
          )}
        </GlassCard>

        {/* Recovery Strategies */}
        <GlassCard className="p-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2 mb-6">
            <Settings className="w-5 h-5" />
            Recovery Strategies
          </h2>

          <div className="space-y-4">
            {[
              { id: 'connection_reset', name: 'Connection Reset', description: 'Reset network connection', priority: 1, timeout: '10s' },
              { id: 'agent_restart', name: 'Agent Restart', description: 'Restart agent process', priority: 2, timeout: '30s' },
              { id: 'gateway_reload', name: 'Gateway Reload', description: 'Reload gateway service', priority: 3, timeout: '60s' },
              { id: 'failover', name: 'Failover to Backup', description: 'Switch to backup agent', priority: 4, timeout: '120s' },
              { id: 'escalate_admin', name: 'Escalate to Admin', description: 'Manual intervention required', priority: 5, timeout: '300s' },
            ].map((strategy) => (
              <div 
                key={strategy.id}
                className="p-4 rounded-lg bg-gray-800/30 border border-gray-700/50"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
                        <span className="text-blue-400 font-bold">{strategy.priority}</span>
                      </div>
                      <div>
                        <p className="font-medium text-white">{strategy.name}</p>
                        <p className="text-sm text-gray-400">{strategy.description}</p>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-400">Timeout: {strategy.timeout}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                      <span className="text-sm text-gray-500">Enabled</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-6 border-t border-gray-800">
            <p className="text-sm text-gray-400">
              Recovery strategies are executed in priority order (1-5). 
              Each strategy has a timeout after which the next strategy is attempted.
            </p>
          </div>
        </GlassCard>
      </div>

      {/* System Health Overview */}
      <GlassCard className="p-6">
        <h2 className="text-xl font-bold text-white flex items-center gap-2 mb-6">
          <Heart className="w-5 h-5 text-red-500" />
          System Health Overview
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Agent Health Distribution</h3>
            <div className="h-64 flex items-center justify-center">
              <CircularProgress
                value={healthyAgents}
                maxValue={agents.length}
                size={160}
                strokeWidth={12}
                gradientFrom="from-green-500"
                gradientTo="to-emerald-500"
                label="Healthy"
                showValue
              />
            </div>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div>
                <p className="text-2xl font-bold text-green-500">{healthyAgents}</p>
                <p className="text-sm text-gray-400">Healthy</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-yellow-500">{degradedAgents}</p>
                <p className="text-sm text-gray-400">Degraded</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-red-500">{unresponsiveAgents}</p>
                <p className="text-sm text-gray-400">Unresponsive</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Response Time Trends</h3>
            <div className="h-64 flex items-center justify-center">
              <div className="relative w-full h-48">
                {/* Simulated response time chart */}
                <div className="absolute inset-0 flex items-end">
                  {[40, 60, 30, 80, 50, 90, 40, 70, 60, 50].map((height, index) => (
                    <div
                      key={index}
                      className="flex-1 mx-0.5"
                      style={{ height: `${height}%` }}
                    >
                      <div
                        className={`w-full rounded-t ${
                          height > 70 ? 'bg-red-500' :
                          height > 50 ? 'bg-yellow-500' :
                          'bg-green-500'
                        }`}
                        style={{ height: '100%' }}
                      ></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-400">
                Average Response Time: <span className="text-white font-medium">{
                  agents.length > 0 
                    ? Math.round(agents.reduce((sum, a) => sum + a.responseTime, 0) / agents.length)
                    : 0
                }ms</span>
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Recovery Performance</h3>
            <div className="h-64 flex items-center justify-center">
              <CircularProgress
                value={recoverySuccessRate}
                maxValue={100}
                size={160}
                strokeWidth={12}
                gradientFrom="from-blue-500"
                gradientTo="to-indigo-500"
                label="Success Rate"
                showValue
                valueSuffix="%"
              />
            </div>
            <div className="text-center space-y-2">
              <p className="text-sm text-gray-400">
                <span className="text-green-500 font-medium">{successfulRecoveries}</span> successful recoveries
              </p>
              <p className="text-sm text-gray-400">
                <span className="text-red-500 font-medium">{totalRecoveryAttempts - successfulRecoveries}</span> failed recoveries
              </p>
              <p className="text-sm text-gray-400">
                Total attempts: <span className="text-white font-medium">{totalRecoveryAttempts}</span>
              </p>
            </div>
          </div>
        </div>
      </GlassCard>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <GlassCard className="p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <button
              onClick={() => toggleMonitoring(!monitoringStatus.isMonitoring)}
              className={`w-full py-3 rounded-lg flex items-center justify-center gap-2 ${
                monitoringStatus.isMonitoring
                  ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                  : 'bg-green-500/20 text-green-400 border border-green-500/30'
              }`}
            >
              {monitoringStatus.isMonitoring ? (
                <>
                  <StopCircle className="w-5 h-5" />
                  Stop All Monitoring
                </>
              ) : (
                <>
                  <Play className="w-5 h-5" />
                  Start All Monitoring
                </>
              )}
            </button>
            
            <button
              onClick={() => {
                // Simulate registering a test agent
                const testAgentId = `test-agent-${Date.now()}`;
                fetch('/api/agent-monitor/status', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    action: 'register_agent',
                    agentId: testAgentId,
                    name: 'Test Agent',
                    tags: ['test', 'demo']
                  })
                }).then(() => fetchData());
              }}
              className="w-full py-3 rounded-lg bg-blue-500/20 text-blue-400 border border-blue-500/30 flex items-center justify-center gap-2"
            >
              <Server className="w-5 h-5" />
              Register Test Agent
            </button>
            
            <button
              onClick={() => {
                // Refresh all data
                fetchData();
              }}
              className="w-full py-3 rounded-lg bg-purple-500/20 text-purple-400 border border-purple-500/30 flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-5 h-5" />
              Force Refresh Data
            </button>
          </div>
        </GlassCard>

        <GlassCard className="p-6 md:col-span-2">
          <h3 className="text-lg font-semibold text-white mb-4">System Status</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-lg bg-gray-800/50">
              <p className="text-sm text-gray-400">Database</p>
              <div className="flex items-center gap-2 mt-2">
                <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
                <p className="text-white font-medium">Connected</p>
              </div>
            </div>
            
            <div className="p-4 rounded-lg bg-gray-800/50">
              <p className="text-sm text-gray-400">API Server</p>
              <div className="flex items-center gap-2 mt-2">
                <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
                <p className="text-white font-medium">Running</p>
              </div>
            </div>
            
            <div className="p-4 rounded-lg bg-gray-800/50">
              <p className="text-sm text-gray-400">WebSocket</p>
              <div className="flex items-center gap-2 mt-2">
                <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
                <p className="text-white font-medium">Active</p>
              </div>
            </div>
            
            <div className="p-4 rounded-lg bg-gray-800/50">
              <p className="text-sm text-gray-400">Notifications</p>
              <div className="flex items-center gap-2 mt-2">
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <p className="text-white font-medium">Ready</p>
              </div>
            </div>
          </div>
          
          <div className="mt-6 pt-6 border-t border-gray-800">
            <p className="text-sm text-gray-400">
              <span className="text-green-500">●</span> All systems operational
              <span className="mx-4">|</span>
              <span className="text-yellow-500">●</span> System requires attention
              <span className="mx-4">|</span>
              <span className="text-red-500">●</span> Critical issue detected
            </p>
          </div>
        </GlassCard>
      </div>

      {/* Footer Note */}
      <div className="text-center py-6">
        <p className="text-gray-500 text-sm">
          Self-Healing System • Version 1.0.0 • Last updated: {new Date().toLocaleString()}
        </p>
        <p className="text-gray-600 text-sm mt-2">
          This system automatically monitors agent health and executes recovery strategies when agents become unresponsive.
        </p>
      </div>
    </div>
  );
}