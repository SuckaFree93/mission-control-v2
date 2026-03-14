'use client'

import { motion } from 'framer-motion'
import { CommandBar } from '@/components/ui/command-bar'
import { AgentFeed } from '@/components/charts/agent-feed'
import { BuildTimeline } from '@/components/charts/build-timeline'
import { SystemHUD } from '@/components/charts/system-hud'

export function MobileLayout() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black p-4 pb-24">
      {/* Header with better spacing */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 pt-4"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Mission Control</h1>
            <p className="text-sm text-gray-400 mt-1">Mobile Dashboard</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
            <span className="text-sm text-gray-300">Live</span>
          </div>
        </div>
      </motion.header>

      {/* Quick Stats Row */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 gap-4 mb-8"
      >
        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
          <div className="text-center">
            <div className="text-2xl font-bold text-white">12</div>
            <div className="text-xs text-gray-400 mt-1">Active Systems</div>
          </div>
        </div>
        
        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
          <div className="text-center">
            <div className="text-2xl font-bold text-white">98%</div>
            <div className="text-xs text-gray-400 mt-1">Uptime</div>
          </div>
        </div>
      </motion.div>

      {/* Command Bar with better spacing */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-8"
      >
        <CommandBar />
      </motion.div>

      {/* Content with proper spacing */}
      <div className="space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white/5 backdrop-blur-sm rounded-xl p-5 border border-white/10"
        >
          <h3 className="text-lg font-semibold text-white mb-4">Agent Activity</h3>
          <AgentFeed isMobile={true} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white/5 backdrop-blur-sm rounded-xl p-5 border border-white/10"
        >
          <h3 className="text-lg font-semibold text-white mb-4">Build Timeline</h3>
          <BuildTimeline />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white/5 backdrop-blur-sm rounded-xl p-5 border border-white/10"
        >
          <h3 className="text-lg font-semibold text-white mb-4">System Status</h3>
          <SystemHUD />
        </motion.div>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-gray-900/95 backdrop-blur-xl border-t border-white/10 p-3">
        <div className="flex justify-around">
          {[
            { icon: '🏠', label: 'Home', active: true },
            { icon: '📊', label: 'Dashboard' },
            { icon: '🔔', label: 'Alerts' },
            { icon: '⚙️', label: 'Settings' },
          ].map((item, index) => (
            <button
              key={index}
              className={`flex flex-col items-center p-2 rounded-lg transition-colors ${
                item.active 
                  ? 'bg-white/10 text-white' 
                  : 'hover:bg-white/5 text-gray-400'
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="text-xs mt-1">{item.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}