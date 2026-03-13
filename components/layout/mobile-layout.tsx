'use client'

import { motion } from 'framer-motion'
import { CommandBar } from '@/components/ui/command-bar'
import { AgentFeed } from '@/components/charts/agent-feed'
import { BuildTimeline } from '@/components/charts/build-timeline'
import { SystemHUD } from '@/components/charts/system-hud'

export function MobileLayout() {
  return (
    <div className="min-h-screen p-4">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-widest text-white">Mission Control</h1>
            <p className="text-white/70 tracking-wide">Mobile Dashboard</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
            <span className="text-white font-bold">MC</span>
          </div>
        </div>
      </motion.header>

      {/* Command Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <CommandBar />
      </motion.div>

      {/* Content */}
      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <AgentFeed isMobile={true} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <BuildTimeline />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <SystemHUD />
        </motion.div>
      </div>

      {/* Bottom Navigation */}
      <motion.footer
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-8 pt-6 border-t border-white/10"
      >
        <div className="flex items-center justify-between text-sm text-white/70">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span>System Online</span>
          </div>
          <div>v2.0.1</div>
        </div>
      </motion.footer>
    </div>
  )
}