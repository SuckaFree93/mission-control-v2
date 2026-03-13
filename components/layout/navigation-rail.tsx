'use client'

import { motion } from 'framer-motion'
import { Home, BarChart3, Cpu, Settings, Users, Cloud, Bell, HelpCircle } from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: Home },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  { id: 'agents', label: 'Agents', icon: Users },
  { id: 'system', label: 'System', icon: Cpu },
  { id: 'deployments', label: 'Deployments', icon: Cloud },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'settings', label: 'Settings', icon: Settings },
  { id: 'help', label: 'Help', icon: HelpCircle },
]

export function NavigationRail() {
  const [activeItem, setActiveItem] = useState('dashboard')

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="glass-dark rounded-2xl p-4 h-full flex flex-col"
    >
      {/* Logo/Brand */}
      <div className="mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
            <span className="text-white font-bold text-lg">MC</span>
          </div>
          <div>
            <h1 className="text-white font-semibold tracking-wider">Mission Control</h1>
            <p className="text-white/50 text-xs tracking-wide">v2.0</p>
          </div>
        </div>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1">
        <ul className="space-y-2">
          {navItems.map((item, index) => (
            <motion.li
              key={item.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <button
                onClick={() => setActiveItem(item.id)}
                className={cn(
                  'w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300',
                  activeItem === item.id
                    ? 'bg-white/10 text-white border border-white/20'
                    : 'text-white/70 hover:text-white hover:bg-white/5'
                )}
              >
                <item.icon size={20} />
                <span className="font-medium tracking-wide">{item.label}</span>
                {activeItem === item.id && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="ml-auto w-2 h-2 rounded-full bg-blue-500"
                  />
                )}
              </button>
            </motion.li>
          ))}
        </ul>
      </nav>

      {/* Status Indicator */}
      <div className="mt-8 pt-6 border-t border-white/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-sm text-white/70">System Online</span>
          </div>
          <div className="text-xs text-white/50">v2.0.1</div>
        </div>
      </div>
    </motion.div>
  )
}