'use client';

import { LiveMetrics } from '@/components/dashboard/LiveMetrics';
import { GlassCard } from '@/components/ui/GlassCard';
import { motion } from 'framer-motion';

export default function MobilePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black p-4 pb-20">
      {/* Mobile Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0 z-50 mb-6 pt-4"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Mission Control</h1>
            <p className="text-sm text-gray-400">Mobile Dashboard</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
            <span className="text-sm text-gray-300">Live</span>
          </div>
        </div>
      </motion.div>

      {/* Quick Stats */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 gap-3 mb-6"
      >
        <GlassCard className="p-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-white">12</div>
            <div className="text-xs text-gray-400">Active Systems</div>
          </div>
        </GlassCard>
        
        <GlassCard className="p-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-white">98%</div>
            <div className="text-xs text-gray-400">Uptime</div>
          </div>
        </GlassCard>
      </motion.div>

      {/* Live Metrics - Mobile Optimized */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-6"
      >
        <LiveMetrics />
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mb-6"
      >
        <h2 className="text-lg font-semibold text-white mb-3">Quick Actions</h2>
        <div className="grid grid-cols-2 gap-3">
          <button className="p-4 rounded-xl bg-blue-500/20 hover:bg-blue-500/30 transition-colors text-blue-300 text-sm font-medium">
            📊 View Analytics
          </button>
          <button className="p-4 rounded-xl bg-green-500/20 hover:bg-green-500/30 transition-colors text-green-300 text-sm font-medium">
            🔔 Notifications
          </button>
          <button className="p-4 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 transition-colors text-purple-300 text-sm font-medium">
            ⚙️ Settings
          </button>
          <button className="p-4 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 transition-colors text-amber-300 text-sm font-medium">
            🚀 Launch Task
          </button>
        </div>
      </motion.div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <h2 className="text-lg font-semibold text-white mb-3">Recent Activity</h2>
        <GlassCard className="p-4">
          <div className="space-y-3">
            {[
              { time: '2 min ago', action: 'System backup completed', status: 'success' },
              { time: '5 min ago', action: 'New agent connected', status: 'info' },
              { time: '15 min ago', action: 'Performance scan', status: 'warning' },
              { time: '1 hour ago', action: 'Database optimized', status: 'success' },
            ].map((item, index) => (
              <div key={index} className="flex items-center justify-between py-2 border-b border-white/10 last:border-0">
                <div>
                  <div className="text-sm text-white">{item.action}</div>
                  <div className="text-xs text-gray-500">{item.time}</div>
                </div>
                <div className={`px-2 py-1 rounded text-xs ${
                  item.status === 'success' ? 'bg-green-500/20 text-green-300' :
                  item.status === 'warning' ? 'bg-amber-500/20 text-amber-300' :
                  'bg-blue-500/20 text-blue-300'
                }`}>
                  {item.status}
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      </motion.div>

      {/* Mobile Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-gray-900/90 backdrop-blur-xl border-t border-white/10 p-3">
        <div className="flex justify-around">
          {[
            { icon: '🏠', label: 'Home' },
            { icon: '📊', label: 'Dashboard' },
            { icon: '🔔', label: 'Alerts' },
            { icon: '👤', label: 'Profile' },
          ].map((item, index) => (
            <button
              key={index}
              className="flex flex-col items-center p-2 rounded-lg hover:bg-white/5 transition-colors"
            >
              <span className="text-xl">{item.icon}</span>
              <span className="text-xs text-gray-400 mt-1">{item.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}