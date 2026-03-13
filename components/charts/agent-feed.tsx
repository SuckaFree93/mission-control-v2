'use client'

import { motion } from 'framer-motion'
import { Cpu, Zap, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react'
import { GlassCard, GlassCardHeader, GlassCardTitle, GlassCardContent } from '@/components/ui/glass-card'
import { formatLatency, formatTimestamp } from '@/lib/utils'

interface Agent {
  id: string
  name: string
  model: string
  status: 'online' | 'offline' | 'busy' | 'idle'
  latency: number
  lastAction: string
  lastActionTime: number
  cpuUsage: number
  memoryUsage: number
}

const mockAgents: Agent[] = [
  {
    id: '1',
    name: 'Gemini 3 Pro',
    model: 'google/gemini-3-pro',
    status: 'online',
    latency: 142,
    lastAction: 'Processed image analysis request',
    lastActionTime: Date.now() - 30000,
    cpuUsage: 45,
    memoryUsage: 68
  },
  {
    id: '2',
    name: 'DeepSeek V3',
    model: 'deepseek/deepseek-chat',
    status: 'busy',
    latency: 89,
    lastAction: 'Generating code review',
    lastActionTime: Date.now() - 15000,
    cpuUsage: 78,
    memoryUsage: 82
  },
  {
    id: '3',
    name: 'Claude 3.5',
    model: 'anthropic/claude-3.5-sonnet',
    status: 'online',
    latency: 210,
    lastAction: 'Summarized meeting notes',
    lastActionTime: Date.now() - 60000,
    cpuUsage: 32,
    memoryUsage: 45
  },
  {
    id: '4',
    name: 'GPT-4 Turbo',
    model: 'openai/gpt-4-turbo',
    status: 'idle',
    latency: 165,
    lastAction: 'Completed chat session',
    lastActionTime: Date.now() - 120000,
    cpuUsage: 15,
    memoryUsage: 28
  },
  {
    id: '5',
    name: 'Llama 3.1',
    model: 'meta/llama-3.1-405b',
    status: 'offline',
    latency: 0,
    lastAction: 'System maintenance',
    lastActionTime: Date.now() - 300000,
    cpuUsage: 0,
    memoryUsage: 5
  }
]

const statusConfig = {
  online: { color: 'text-green-500', bg: 'bg-green-500/20', icon: CheckCircle },
  offline: { color: 'text-red-500', bg: 'bg-red-500/20', icon: XCircle },
  busy: { color: 'text-amber-500', bg: 'bg-amber-500/20', icon: Zap },
  idle: { color: 'text-blue-500', bg: 'bg-blue-500/20', icon: Clock }
}

export function AgentFeed({ isMobile = false }: { isMobile?: boolean }) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  }

  return (
    <GlassCard className={isMobile ? 'overflow-x-auto' : ''}>
      <GlassCardHeader>
        <div className="flex items-center justify-between">
          <GlassCardTitle>Live Agent Feed</GlassCardTitle>
          <div className="flex items-center gap-2 text-sm text-white/70">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span>Real-time</span>
          </div>
        </div>
      </GlassCardHeader>

      <GlassCardContent>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className={isMobile ? 'flex gap-4 pb-4' : 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'}
        >
          {mockAgents.map((agent, index) => {
            const StatusIcon = statusConfig[agent.status].icon
            
            return (
              <motion.div
                key={agent.id}
                variants={itemVariants}
                whileHover={{ scale: 1.02 }}
                className={cn(
                  'glass-dark rounded-xl p-4 transition-all duration-300',
                  isMobile && 'min-w-[300px]'
                )}
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h4 className="font-semibold text-white tracking-wide">{agent.name}</h4>
                    <p className="text-sm text-white/50">{agent.model}</p>
                  </div>
                  
                  <div className={cn(
                    'px-3 py-1 rounded-full flex items-center gap-2',
                    statusConfig[agent.status].bg
                  )}>
                    <StatusIcon size={14} className={statusConfig[agent.status].color} />
                    <span className={cn('text-xs font-medium capitalize', statusConfig[agent.status].color)}>
                      {agent.status}
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Clock size={14} className="text-white/50" />
                      <span className="text-sm text-white/70">Latency</span>
                    </div>
                    <span className="font-medium text-white">{formatLatency(agent.latency)}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Cpu size={14} className="text-white/50" />
                      <span className="text-sm text-white/70">CPU/Memory</span>
                    </div>
                    <span className="font-medium text-white">
                      {agent.cpuUsage}% / {agent.memoryUsage}%
                    </span>
                  </div>

                  <div className="pt-3 border-t border-white/10">
                    <p className="text-sm text-white/80 line-clamp-2">{agent.lastAction}</p>
                    <p className="text-xs text-white/50 mt-1">
                      {formatTimestamp(agent.lastActionTime)}
                    </p>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </motion.div>

        {/* Stats Summary */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-6 pt-6 border-t border-white/10"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-white">4</div>
              <div className="text-sm text-white/70">Active Agents</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">142ms</div>
              <div className="text-sm text-white/70">Avg Latency</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">78%</div>
              <div className="text-sm text-white/70">Peak CPU</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">82%</div>
              <div className="text-sm text-white/70">Peak Memory</div>
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