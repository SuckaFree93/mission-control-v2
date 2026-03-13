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
    <div className="min-h-screen p-6">
      {/* Top Command Bar */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <CommandBar />
      </motion.div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-12 gap-6">
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
        <div className="col-span-7 space-y-6">
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
          >
            <AgentFeed />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <BuildTimeline />
          </motion.div>
        </div>

        {/* Right Sidebar */}
        <div className="col-span-3 space-y-6">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <SystemHUD />
          </motion.div>

          {/* Quick Actions Panel */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="glass-dark rounded-2xl p-4"
          >
            <h3 className="font-semibold text-white tracking-wide mb-4">Quick Actions</h3>
            
            <div className="space-y-3">
              {[
                { label: 'New Deployment', color: 'bg-blue-500/20 text-blue-400' },
                { label: 'Run Diagnostics', color: 'bg-green-500/20 text-green-400' },
                { label: 'Clear Cache', color: 'bg-amber-500/20 text-amber-400' },
                { label: 'Backup System', color: 'bg-purple-500/20 text-purple-400' },
              ].map((action, index) => (
                <motion.button
                  key={action.label}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  whileHover={{ x: 5 }}
                  className={`w-full text-left px-4 py-3 rounded-xl ${action.color} hover:opacity-80 transition-opacity`}
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
            className="glass-dark rounded-2xl p-4"
          >
            <h3 className="font-semibold text-white tracking-wide mb-4">Recent Activity</h3>
            
            <div className="space-y-3">
              {[
                { time: '2 min ago', action: 'Agent Gemini 3 Pro started', user: 'System' },
                { time: '5 min ago', action: 'Build completed: mission-control-v2', user: 'Auto-Deploy' },
                { time: '12 min ago', action: 'Database backup initiated', user: 'Admin' },
                { time: '25 min ago', action: 'Security scan completed', user: 'System' },
              ].map((activity, index) => (
                <div key={index} className="p-3 rounded-lg bg-white/5">
                  <div className="text-sm text-white/80">{activity.action}</div>
                  <div className="flex items-center justify-between mt-2 text-xs">
                    <span className="text-white/50">{activity.user}</span>
                    <span className="text-white/50">{activity.time}</span>
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
        className="mt-8 pt-6 border-t border-white/10"
      >
        <div className="flex items-center justify-between text-sm text-white/70">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span>All Systems Operational</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
              <span>4 Active Agents</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              <span>1 Build in Progress</span>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <span>Last updated: Just now</span>
            <span>v2.0.1</span>
          </div>
        </div>
      </motion.footer>
    </div>
  )
}