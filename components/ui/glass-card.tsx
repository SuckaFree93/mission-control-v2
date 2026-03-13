'use client'

import { motion } from 'framer-motion'
import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface GlassCardProps {
  children: ReactNode
  className?: string
  hoverEffect?: boolean
  delay?: number
}

export function GlassCard({ 
  children, 
  className, 
  hoverEffect = true,
  delay = 0 
}: GlassCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
      whileHover={hoverEffect ? { scale: 1.02, transition: { duration: 0.2 } } : undefined}
      className={cn(
        'glass rounded-2xl p-6 transition-all duration-300',
        hoverEffect && 'hover:bg-glass-highlight/50',
        className
      )}
    >
      {children}
    </motion.div>
  )
}

interface GlassCardHeaderProps {
  children: ReactNode
  className?: string
}

export function GlassCardHeader({ children, className }: GlassCardHeaderProps) {
  return (
    <div className={cn('mb-4', className)}>
      {children}
    </div>
  )
}

interface GlassCardTitleProps {
  children: ReactNode
  className?: string
}

export function GlassCardTitle({ children, className }: GlassCardTitleProps) {
  return (
    <h3 className={cn('text-xl font-semibold tracking-wider text-white', className)}>
      {children}
    </h3>
  )
}

interface GlassCardDescriptionProps {
  children: ReactNode
  className?: string
}

export function GlassCardDescription({ children, className }: GlassCardDescriptionProps) {
  return (
    <p className={cn('text-sm text-white/70 tracking-wide', className)}>
      {children}
    </p>
  )
}

interface GlassCardContentProps {
  children: ReactNode
  className?: string
}

export function GlassCardContent({ children, className }: GlassCardContentProps) {
  return (
    <div className={cn('mt-4', className)}>
      {children}
    </div>
  )
}