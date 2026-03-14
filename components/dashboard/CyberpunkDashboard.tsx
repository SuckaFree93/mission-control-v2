'use client';

import { motion } from 'framer-motion';
import { CyberpunkLiveMetrics } from './CyberpunkLiveMetrics';

export function CyberpunkDashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 p-6">
      {/* Subtle grid background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px]" />
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-gray-900/20 to-transparent" />
      </div>

      {/* Header - Professional Style */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative mb-8 pt-4"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight">Mission Control</h1>
            <div className="flex items-center gap-6 mt-2">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-sm text-gray-300">All Systems Operational</span>
              </div>
              <div className="text-sm text-gray-400">v2.1.0</div>
              <div className="text-sm text-gray-400">Last Update: 20:09 CDT</div>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="px-4 py-2 bg-green-500/10 border border-green-500/20 rounded-lg">
              <span className="text-sm font-medium text-green-400">OPERATIONAL</span>
            </div>
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center">
              <span className="text-white font-bold">MC</span>
            </div>
          </div>
        </div>
        
        {/* Header separator */}
        <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-gray-700 to-transparent" />
      </motion.header>

      {/* Main Dashboard Grid */}
      <div className="grid grid-cols-12 gap-6 relative">
        {/* Left Column - System Overview */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="col-span-3 space-y-6"
        >
          {/* System Status Card */}
          <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-6 border border-gray-800">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full" />
              System Status
            </h3>
            <div className="space-y-4">
              {[
                { label: 'Web Server', status: 'online', value: '100%', color: 'green' },
                { label: 'Database', status: 'online', value: '98%', color: 'green' },
                { label: 'Cache', status: 'degraded', value: '85%', color: 'yellow' },
                { label: 'Analytics', status: 'online', value: '100%', color: 'green' },
              ].map((system, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${
                      system.color === 'green' ? 'bg-green-500' :
                      system.color === 'yellow' ? 'bg-yellow-500' :
                      'bg-red-500'
                    }`} />
                    <div>
                      <div className="text-sm font-medium text-white">{system.label}</div>
                      <div className="text-xs text-gray-400">{system.status}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-white">{system.value}</div>
                    <div className="text-xs text-gray-400">uptime</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-6 border border-gray-800">
            <h3 className="text-lg font-semibold text-white mb-4">Quick Stats</h3>
            <div className="space-y-4">
              {[
                { label: 'Active Agents', value: '12', change: '+2', color: 'blue' },
                { label: 'Uptime', value: '99.8%', change: '▲ 0.2%', color: 'green' },
                { label: 'Response Time', value: '42ms', change: '▼ 8ms', color: 'indigo' },
                { label: 'Data Processed', value: '2.4TB', change: '+120GB', color: 'purple' },
              ].map((stat, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg">
                  <div>
                    <div className="text-sm text-gray-400">{stat.label}</div>
                    <div className="text-2xl font-bold text-white mt-1">{stat.value}</div>
                  </div>
                  <div className="text-right">
                    <div className={`text-sm font-medium ${
                      stat.color === 'green' ? 'text-green-400' :
                      stat.color === 'blue' ? 'text-blue-400' :
                      stat.color === 'indigo' ? 'text-indigo-400' :
                      'text-purple-400'
                    }`}>
                      {stat.change}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">24h</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Center Column - Main Metrics */}
        <div className="col-span-6 space-y-6">
          {/* Live Metrics */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-6 border border-gray-800"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-white">System Metrics</h3>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-sm text-gray-300">Live</span>
              </div>
            </div>
            <CyberpunkLiveMetrics />
          </motion.div>

          {/* Agent Activity */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-6 border border-gray-800"
          >
            <h3 className="text-xl font-semibold text-white mb-6">Agent Activity</h3>
            <div className="space-y-4">
              {[
                { name: 'Agent-001', status: 'active', task: 'Data Processing', progress: 85 },
                { name: 'Agent-002', status: 'active', task: 'Security Scan', progress: 42 },
                { name: 'Agent-003', status: 'idle', task: 'Standby', progress: 0 },
                { name: 'Agent-004', status: 'active', task: 'Backup', progress: 67 },
              ].map((agent, index) => (
                <div key={index} className="p-4 bg-gray-800/30 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${agent.status === 'active' ? 'bg-green-500' : 'bg-gray-500'}`} />
                      <div className="text-sm font-medium text-white">{agent.name}</div>
                    </div>
                    <div className="text-xs text-gray-400">{agent.status}</div>
                  </div>
                  <div className="text-sm text-gray-300 mb-3">{agent.task}</div>
                  <div className="w-full bg-gray-800 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-indigo-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${agent.progress}%` }}
                    />
                  </div>
                  <div className="text-xs text-gray-400 mt-2 text-right">{agent.progress}%</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Right Column - Timeline & Actions */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="col-span-3 space-y-6"
        >
          {/* Build Timeline */}
          <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-6 border border-gray-800">
            <h3 className="text-lg font-semibold text-white mb-4">Build Timeline</h3>
            <div className="space-y-4">
              {[
                { time: '19:45', build: 'v2.1.0', status: 'success', duration: '2m 34s' },
                { time: '18:20', build: 'v2.0.9', status: 'success', duration: '3m 12s' },
                { time: '16:55', build: 'v2.0.8', status: 'failed', duration: '1m 45s' },
                { time: '15:30', build: 'v2.0.7', status: 'success', duration: '2m 58s' },
              ].map((build, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${build.status === 'success' ? 'bg-green-500' : 'bg-red-500'}`} />
                    <div>
                      <div className="text-sm font-medium text-white">{build.build}</div>
                      <div className="text-xs text-gray-400">{build.time}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-sm font-medium ${build.status === 'success' ? 'text-green-400' : 'text-red-400'}`}>
                      {build.status}
                    </div>
                    <div className="text-xs text-gray-400">{build.duration}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-6 border border-gray-800">
            <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
            <div className="space-y-3">
              {[
                { label: 'Deploy Update', icon: '🚀', color: 'bg-blue-500/10 hover:bg-blue-500/20 text-blue-400' },
                { label: 'Run Diagnostics', icon: '🔧', color: 'bg-green-500/10 hover:bg-green-500/20 text-green-400' },
                { label: 'Generate Report', icon: '📊', color: 'bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400' },
                { label: 'Security Scan', icon: '🛡️', color: 'bg-purple-500/10 hover:bg-purple-500/20 text-purple-400' },
              ].map((action, index) => (
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full text-left px-4 py-3 rounded-lg ${action.color} border border-gray-700 hover:border-gray-600 transition-all duration-200 flex items-center gap-3`}
                >
                  <span className="text-lg">{action.icon}</span>
                  <span className="font-medium">{action.label}</span>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Recent Events */}
          <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-6 border border-gray-800">
            <h3 className="text-lg font-semibold text-white mb-4">Recent Events</h3>
            <div className="space-y-3">
              {[
                { time: '2m ago', event: 'Agent Gemini 3 Pro activated', type: 'success' },
                { time: '5m ago', event: 'Build v2.1.0 completed', type: 'info' },
                { time: '12m ago', event: 'Security audit passed', type: 'success' },
                { time: '25m ago', event: 'Database optimized', type: 'warning' },
              ].map((event, index) => (
                <div key={index} className="p-3 bg-gray-800/30 rounded-lg">
                  <div className="flex items-start gap-3">
                    <div className={`w-2 h-2 rounded-full mt-2 ${
                      event.type === 'success' ? 'bg-green-500' :
                      event.type === 'warning' ? 'bg-yellow-500' :
                      'bg-blue-500'
                    }`} />
                    <div className="flex-1">
                      <div className="text-sm text-white">{event.event}</div>
                      <div className="text-xs text-gray-400 mt-1">{event.time}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Footer Status Bar */}
      <motion.footer
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-8 pt-6 border-t border-gray-800"
      >
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
              <span className="text-gray-300">All Systems Nominal</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse" />
              <span className="text-gray-300">4 Active Deployments</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-indigo-500 rounded-full animate-pulse" />
              <span className="text-gray-300">12 Connected Agents</span>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="text-gray-400">Network Latency: 24ms</div>
            <div className="text-gray-400">CPU Usage: 42%</div>
            <div className="text-gray-400">Memory: 68%</div>
          </div>
        </div>
      </motion.footer>
    </div>
  );
}