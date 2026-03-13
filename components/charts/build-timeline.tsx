'use client'

import { motion } from 'framer-motion'
import { GitBranch, CheckCircle, XCircle, Clock, Zap, Cloud } from 'lucide-react'
import { GlassCard, GlassCardHeader, GlassCardTitle, GlassCardContent } from '@/components/ui/glass-card'
import { formatTimestamp } from '@/lib/utils'

interface BuildEvent {
  id: string
  project: string
  status: 'success' | 'failed' | 'building' | 'pending'
  commit: string
  branch: string
  timestamp: number
  duration: number
  deployUrl?: string
}

const mockBuilds: BuildEvent[] = [
  {
    id: '1',
    project: 'mission-control-v2',
    status: 'success',
    commit: 'feat: add glass UI components',
    branch: 'main',
    timestamp: Date.now() - 300000,
    duration: 45,
    deployUrl: 'https://mission-control-v2.vercel.app'
  },
  {
    id: '2',
    project: 'api-gateway',
    status: 'building',
    commit: 'fix: CORS configuration',
    branch: 'develop',
    timestamp: Date.now() - 180000,
    duration: 30
  },
  {
    id: '3',
    project: 'dashboard-ui',
    status: 'failed',
    commit: 'chore: update dependencies',
    branch: 'feature/dark-mode',
    timestamp: Date.now() - 600000,
    duration: 120
  },
  {
    id: '4',
    project: 'auth-service',
    status: 'success',
    commit: 'feat: OAuth2 integration',
    branch: 'main',
    timestamp: Date.now() - 900000,
    duration: 60,
    deployUrl: 'https://auth-service.vercel.app'
  },
  {
    id: '5',
    project: 'analytics',
    status: 'pending',
    commit: 'init: project setup',
    branch: 'main',
    timestamp: Date.now() - 1200000,
    duration: 0
  }
]

const statusConfig = {
  success: { color: 'text-green-500', bg: 'bg-green-500/20', icon: CheckCircle },
  failed: { color: 'text-red-500', bg: 'bg-red-500/20', icon: XCircle },
  building: { color: 'text-amber-500', bg: 'bg-amber-500/20', icon: Zap },
  pending: { color: 'text-blue-500', bg: 'bg-blue-500/20', icon: Clock }
}

export function BuildTimeline() {
  return (
    <GlassCard>
      <GlassCardHeader>
        <div className="flex items-center justify-between">
          <GlassCardTitle>Build Timeline</GlassCardTitle>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-sm text-white/70">Live Updates</span>
          </div>
        </div>
      </GlassCardHeader>

      <GlassCardContent>
        <div className="relative">
          {/* Timeline spine */}
          <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-500/50 via-purple-500/50 to-pink-500/50" />

          <div className="space-y-8 pl-12">
            {mockBuilds.map((build, index) => {
              const StatusIcon = statusConfig[build.status].icon
              const isBuilding = build.status === 'building'
              
              return (
                <motion.div
                  key={build.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ x: 5 }}
                  className="relative"
                >
                  {/* Timeline node */}
                  <div className="absolute -left-12 top-1/2 transform -translate-y-1/2">
                    <motion.div
                      className={cn(
                        'w-12 h-12 rounded-full flex items-center justify-center border-2',
                        statusConfig[build.status].bg,
                        `border-${statusConfig[build.status].color.split('-')[1]}-500/50`
                      )}
                      whileHover={{ scale: 1.1 }}
                      animate={isBuilding ? { rotate: 360 } : {}}
                      transition={isBuilding ? { duration: 2, repeat: Infinity, ease: "linear" } : {}}
                    >
                      <StatusIcon size={20} className={statusConfig[build.status].color} />
                    </motion.div>
                    
                    {/* Glow effect */}
                    {isBuilding && (
                      <motion.div
                        className="absolute inset-0 rounded-full bg-amber-500/20"
                        animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                    )}
                  </div>

                  {/* Build card */}
                  <div className="glass-dark rounded-xl p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-semibold text-white tracking-wide">{build.project}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <GitBranch size={12} className="text-white/50" />
                          <span className="text-xs text-white/70">{build.branch}</span>
                        </div>
                      </div>
                      
                      <div className={cn(
                        'px-3 py-1 rounded-full flex items-center gap-2',
                        statusConfig[build.status].bg
                      )}>
                        <StatusIcon size={14} className={statusConfig[build.status].color} />
                        <span className={cn('text-xs font-medium capitalize', statusConfig[build.status].color)}>
                          {build.status}
                        </span>
                      </div>
                    </div>

                    <p className="text-sm text-white/80 mb-3">{build.commit}</p>

                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <Clock size={12} className="text-white/50" />
                          <span className="text-white/70">{formatTimestamp(build.timestamp)}</span>
                        </div>
                        
                        {build.duration > 0 && (
                          <div className="flex items-center gap-2">
                            <Zap size={12} className="text-white/50" />
                            <span className="text-white/70">{build.duration}s</span>
                          </div>
                        )}
                      </div>

                      {build.deployUrl && (
                        <a
                          href={build.deployUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors"
                        >
                          <Cloud size={12} />
                          <span className="text-xs">View Deployment</span>
                        </a>
                      )}
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-8 pt-6 border-t border-white/10"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-white">12</div>
              <div className="text-sm text-white/70">Total Builds</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-500">85%</div>
              <div className="text-sm text-white/70">Success Rate</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">45s</div>
              <div className="text-sm text-white/70">Avg Build Time</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">3</div>
              <div className="text-sm text-white/70">Active</div>
            </div>
          </div>
        </motion.div>
      </GlassCardContent>
    </GlassCard>
  )
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ')
}