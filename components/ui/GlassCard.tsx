'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hoverEffect?: boolean;
  delay?: number;
}

export function GlassCard({
  children,
  className = '',
  hoverEffect = true,
  delay = 0,
}: GlassCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={hoverEffect ? { scale: 1.02, transition: { duration: 0.2 } } : undefined}
      className={`
        relative
        rounded-2xl
        bg-white/5
        backdrop-blur-lg
        border border-white/10
        shadow-xl
        overflow-hidden
        transition-all duration-300
        hover:border-white/20
        hover:shadow-2xl
        ${className}
      `}
    >
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/[0.02] to-transparent" />
      
      {/* Content */}
      <div className="relative z-10 p-6">
        {children}
      </div>
      
      {/* Corner accents */}
      <div className="absolute top-0 left-0 w-16 h-16 bg-gradient-to-br from-cyan-500/10 to-transparent rounded-tl-2xl" />
      <div className="absolute bottom-0 right-0 w-16 h-16 bg-gradient-to-tl from-blue-500/10 to-transparent rounded-br-2xl" />
    </motion.div>
  );
}