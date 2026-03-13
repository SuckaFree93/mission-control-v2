'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Cpu, MemoryStick, Network, HardDrive, Thermometer, Battery } from 'lucide-react'
import { GlassCard, GlassCardHeader, GlassCardTitle, GlassCardContent } from '@/components/ui/glass-card'
import { CircularProgress } from '@/components/ui/circular-progress'
import { formatBytes } from '@/lib/utils'

interface SystemMetrics {
  cpu: number
  memory: number
  gpu: number
  network: number
  disk: number
  temperature: number
}

const initialMetrics: SystemMetrics = {
  cpu: 45,
  memory: 68,
  gpu: 32,
  network: 125,
  disk: 42,
  temperature: 65
}

export function SystemHUD() {
  const [metrics, setMetrics] = useState<SystemMetrics>(initialMetrics)
  const [isAutoRefresh, setIsAutoRefresh] = useState(true)

  // Simulate real-time updates
  useEffect(() => {
    if (!isAutoRefresh) return

    const interval = setInterval(() => {
      setMetrics(prev => ({
        cpu: Math.min(100, Math.max(0, prev.cpu + (Math.random() * 10 - 5))),
        memory: Math.min(100, Math.max(0, prev.memory + (Math.random() * 8 - 4))),
        gpu: Math.min(100, Math.max(0, prev.gpu + (Math.random() * 6 - 3))),
        network: Math.min(500, Math.max(0, prev.network + (Math.random() * 40 - 20))),
        disk: Math.min(100, Math.max(0, prev.disk + (Math.random() * 4 - 2))),
        temperature: Math.min(90, Math.max(30, prev.temperature + (Math.random() * 2 - 1)))
      }))
    }, 2000)

    return () => clearInterval(interval)
  }, [isAutoRefresh])

  const metricCards = [
    {
      id: 'cpu',
      label: 'CPU',
      value: metrics.cpu,
      unit: '%',
      icon: Cpu,
      color: 'text-blue-500',
      description: 'Intel Core i9 13900K'
    },
    {
      id: 'memory',
      label: 'Memory',
      value: metrics.memory,
      unit: '%',
      icon: MemoryStick,
      color: 'text-purple-500',
      description: '32GB DDR5'
    },
    {
      id: 'gpu',
      label: 'GPU',
      value: metrics.gpu,
      unit: '%',
      icon: Thermometer,
      color: 'text-green-500',
      description: 'RTX 4090'
    },
    {
      id: 'network',
      label: 'Network',
      value: metrics.network,
      unit: 'MB/s',
      icon: Network,
      color: 'text-amber-500',
      description: '1 Gbps'
    }
  ]

  const systemInfo = [
    { label: 'Disk Usage', value: `${metrics.disk}%`, icon: HardDrive },
    { label: 'Temperature', value: `${metrics.temperature}°C`, icon: Thermometer },
    { label: 'Uptime', value: '14d 6h', icon: Battery },
    { label: 'Processes', value: '247', icon: Cpu }
  ]

  return (
    <GlassCard>
      <GlassCardHeader>
        <div className="flex items-center justify-between">
          <GlassCardTitle>System HUD</GlassCardTitle>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-sm text-white/70">Live</span>
            </div>
            
            <button
              onClick={() => setIsAutoRefresh(!isAutoRefresh)}
              className={cn(
                'px-3 py-1 rounded-lg text-sm transition-colors',
                isAutoRefresh
                  ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                  : 'bg-white/5 text-white/70 hover:text-white'
              )}
            >
              {isAutoRefresh ? 'Auto: ON' : 'Auto: OFF'}
            </button>
          </div>
        </div>
      </GlassCardHeader>

      <GlassCardContent>
        {/* Main Metrics Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {metricCards.map((metric, index) => (
            <motion.div
              key={metric.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="flex flex-col items-center"
            >
              <CircularProgress
                value={metric.value}
                size="md"
                label={metric.label}
                unit={metric.unit}
                className="mb-3"
              />
              
              <div className="flex items-center gap-2">
                <metric.icon size={16} className={metric.color} />
                <span className="text-sm text-white/70">{metric.description}</span>
              </div>
              
              <motion.div
                className="mt-2 text-lg font-semibold text-white"
                key={metric.value}
                initial={{ scale: 1.2 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200 }}
              >
                {Math.round(metric.value)}{metric.unit}
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* System Info Grid */}
        <div className="glass-dark rounded-xl p-4">
          <h4 className="font-semibold text-white tracking-wide mb-4">System Information</h4>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {systemInfo.map((info, index) => (
              <motion.div
                key={info.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.05 }}
                className="flex items-center gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
              >
                <div className="p-2 rounded-lg bg-white/10">
                  <info.icon size={18} className="text-white/70" />
                </div>
                <div>
                  <div className="text-sm text-white/70">{info.label}</div>
                  <div className="text-lg font-semibold text-white">{info.value}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-6 pt-6 border-t border-white/10"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-500">99.8%</div>
              <div className="text-sm text-white/70">Availability</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">14ms</div>
              <div className="text-sm text-white/70">Avg Response</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">2.4TB</div>
              <div className="text-sm text-white/70">Data Processed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">0</div>
              <div className="text-sm text-white/70">Critical Alerts</div>
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