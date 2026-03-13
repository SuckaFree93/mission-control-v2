'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface CircularProgressProps {
  value: number
  max?: number
  size?: 'sm' | 'md' | 'lg'
  label?: string
  unit?: string
  showValue?: boolean
  className?: string
}

export function CircularProgress({
  value,
  max = 100,
  size = 'md',
  label,
  unit = '%',
  showValue = true,
  className
}: CircularProgressProps) {
  const percentage = Math.min((value / max) * 100, 100)
  const strokeWidth = size === 'sm' ? 4 : size === 'md' ? 6 : 8
  const radius = size === 'sm' ? 20 : size === 'md' ? 30 : 40
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (percentage / 100) * circumference
  
  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-32 h-32'
  }

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-lg',
    lg: 'text-2xl'
  }

  const getColor = (percent: number) => {
    if (percent >= 90) return '#ef4444' // red
    if (percent >= 70) return '#f59e0b' // amber
    if (percent >= 50) return '#3b82f6' // blue
    return '#10b981' // green
  }

  const strokeColor = getColor(percentage)

  return (
    <div className={cn('flex flex-col items-center', className)}>
      <div className="relative">
        <svg
          className={cn('transform -rotate-90', sizeClasses[size])}
          viewBox={`0 0 ${radius * 2 + strokeWidth} ${radius * 2 + strokeWidth}`}
        >
          {/* Background circle */}
          <circle
            cx={radius + strokeWidth / 2}
            cy={radius + strokeWidth / 2}
            r={radius}
            stroke="rgba(255, 255, 255, 0.1)"
            strokeWidth={strokeWidth}
            fill="none"
          />
          
          {/* Progress circle */}
          <motion.circle
            cx={radius + strokeWidth / 2}
            cy={radius + strokeWidth / 2}
            r={radius}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            fill="none"
            strokeLinecap="round"
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1, ease: "easeOut" }}
            strokeDasharray={circumference}
            style={{ filter: 'drop-shadow(0 0 8px rgba(59, 130, 246, 0.5))' }}
          />
          
          {/* Glow effect */}
          <circle
            cx={radius + strokeWidth / 2}
            cy={radius + strokeWidth / 2}
            r={radius}
            stroke={strokeColor}
            strokeWidth={strokeWidth / 2}
            fill="none"
            opacity="0.3"
            className="animate-pulse-glow"
          />
        </svg>
        
        {showValue && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                className={cn('font-semibold text-white', textSizeClasses[size])}
              >
                {Math.round(value)}
                <span className={cn('text-white/70', size === 'sm' ? 'text-xs' : 'text-sm')}>
                  {unit}
                </span>
              </motion.div>
            </div>
          </div>
        )}
      </div>
      
      {label && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-2 text-sm text-white/70 tracking-wide"
        >
          {label}
        </motion.p>
      )}
    </div>
  )
}