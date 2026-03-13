'use client'

import { motion } from 'framer-motion'
import { Search, Rocket, RefreshCw, Upload, Terminal } from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'

const quickActions = [
  { id: 'deploy', label: 'Deploy', icon: Rocket, shortcut: '⌘D' },
  { id: 'build', label: 'Build', icon: RefreshCw, shortcut: '⌘B' },
  { id: 'sync', label: 'Sync', icon: Upload, shortcut: '⌘S' },
  { id: 'logs', label: 'Logs', icon: Terminal, shortcut: '⌘L' },
]

export function CommandBar() {
  const [isFocused, setIsFocused] = useState(false)
  const [command, setCommand] = useState('')

  const handleQuickAction = (actionId: string) => {
    console.log(`Quick action: ${actionId}`)
    // Implement action logic here
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (command.trim()) {
      console.log(`Command: ${command}`)
      setCommand('')
    }
  }

  return (
    <div className="glass-dark rounded-2xl p-4 mb-6">
      <div className="flex items-center gap-4">
        {/* Search/Command Input */}
        <form onSubmit={handleSubmit} className="flex-1">
          <div className="relative">
            <div className={cn(
              'absolute left-4 top-1/2 transform -translate-y-1/2 transition-all duration-300',
              isFocused ? 'text-blue-400' : 'text-white/50'
            )}>
              <Search size={20} />
            </div>
            
            <input
              type="text"
              value={command}
              onChange={(e) => setCommand(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder="Type a command or search..."
              className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300"
            />
            
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/30 text-sm">
              ⌘K
            </div>
          </div>
        </form>

        {/* Quick Actions */}
        <div className="flex items-center gap-2">
          {quickActions.map((action, index) => (
            <motion.button
              key={action.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleQuickAction(action.id)}
              className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-white/80 hover:text-white transition-all duration-300 group"
            >
              <action.icon size={16} className="group-hover:animate-pulse" />
              <span className="text-sm font-medium">{action.label}</span>
              <span className="text-xs text-white/40">{action.shortcut}</span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Command Suggestions */}
      {isFocused && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="mt-4 p-4 bg-glass-dark border border-white/10 rounded-xl"
        >
          <div className="grid grid-cols-2 gap-2">
            <button className="text-left p-2 hover:bg-white/5 rounded-lg transition-colors">
              <div className="text-sm font-medium text-white">deploy production</div>
              <div className="text-xs text-white/50">Deploy to production environment</div>
            </button>
            <button className="text-left p-2 hover:bg-white/5 rounded-lg transition-colors">
              <div className="text-sm font-medium text-white">build all</div>
              <div className="text-xs text-white/50">Build all projects</div>
            </button>
            <button className="text-left p-2 hover:bg-white/5 rounded-lg transition-colors">
              <div className="text-sm font-medium text-white">sync database</div>
              <div className="text-xs text-white/50">Sync with remote database</div>
            </button>
            <button className="text-left p-2 hover:bg-white/5 rounded-lg transition-colors">
              <div className="text-sm font-medium text-white">show logs</div>
              <div className="text-xs text-white/50">Display system logs</div>
            </button>
          </div>
        </motion.div>
      )}
    </div>
  )
}