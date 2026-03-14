'use client'

import { motion } from 'framer-motion'
import { CommandBar } from '@/components/ui/command-bar'
import { NavigationRail } from '@/components/layout/navigation-rail'
import { AgentFeed } from '@/components/charts/agent-feed'
import { BuildTimeline } from '@/components/charts/build-timeline'
import { SystemHUD } from '@/components/charts/system-hud'
import { LiveMetrics } from '@/components/dashboard/LiveMetrics'

export function DesktopLayout() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black p-8">
      {/* Top Command Bar with better spacing */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <CommandBar />
      </motion.div>

      {/* Main Content Grid with better spacing */}
      <div className="grid grid-cols-12 gap-8">
        {/* Left Navigation */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="col-span-2"
        >
          <NavigationRail />
        </motion.div>

        {/* Center Content */}
        <div className="col-span-7 space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <LiveMetrics />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10"
          >
            <h3 className="text-xl font-semibold text-white mb-6">Agent Activity</h3>
            <AgentFeed />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10"
          >
            <h3 className="text-xl font-semibold text-white mb-6">Build Timeline</h3>
            <BuildTimeline />
          </motion.div>
        </div>

        {/* Right Sidebar */}
        <div className="col-span-3 space-y-8">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10"
          >
            <h3 className="text-xl font-semibold text-white mb-6">System Status</h3>
            <SystemHUD />
          </motion.div>

          {/* Quick Actions Panel */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10"
          >
            <h3 className="text-xl font-semibold text-white mb-6">Quick Actions</h3>
            
            <div className="space-y-4">
              {[
                { label: '🚀 New Deployment', color: 'bg-blue-500/20 text-blue-300 hover:bg-blue-500/30' },
                { label: '🔧 Run Diagnostics', color: 'bg-green-500/20 text-green-300 hover:bg-green-500/30' },
                { label: '🧹 Clear Cache', color: 'bg-amber-500/20 text-amber-300 hover:bg-amber-500/30' },
                { label: '💾 Backup System', color: 'bg-purple-500/20 text-purple-300 hover:bg-purple-500/30' },
              ].map((action, index) => (
                <motion.button
                  key={action.label}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full text-left px-5 py-4 rounded-xl ${action.color} transition-all duration-200 font-medium`}
                >
                  {action.label}
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10"
          >
            <h3 className="text-xl font-semibold text-white mb-6">Recent Activity</h3>
            
            <div className="space-y-4">
              {[
                { time: '2 min ago', action: 'Agent Gemini 3 Pro started', user: 'System', status: 'success' },
                { time: '5 min ago', action: 'Build completed: mission-control-v2', user: 'Auto-Deploy', status: 'success' },
                { time: '12 min ago', action: 'Database backup initiated', user: 'Admin', status: 'info' },
                { time: '25 min ago', action: 'Security scan completed', user: 'System', status: 'warning' },
              ].map((activity, index) => (
                <div key={index} className="p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
                  <div className="text-sm text-white/90 font-medium">{activity.action}</div>
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${
                        activity.status === 'success' ? 'bg-green-500' :
                        activity.status === 'warning' ? 'bg-amber-500' :
                        'bg-blue-500'
                      }`} />
                      <span className="text-xs text-gray-400">{activity.user}</span>
                    </div>
                    <span className="text-xs text-gray-500">{activity.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Status Bar */}
      <motion.footer
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="mt-10 pt-6 border-t border-white/10"
      >
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
              <span className="text-gray-300">All Systems Operational</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500 animate-pulse" />
              <span className="text-gray-300">4 Active Agents</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-amber-500 animate-pulse" />
              <span className="text-gray-300">1 Build in Progress</span>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <span className="text-gray-400">Last updated: Just now</span>
            <span className="text-gray-400">v2.0.1</span>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              <span className="text-gray-400">100% Uptime</span>
            </div>
          </div>
        </div>
      </motion.footer>
    </div>
  )
}