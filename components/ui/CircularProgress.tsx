'use client';

import { motion } from 'framer-motion';

interface CircularProgressProps {
  value: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  showValue?: boolean;
  label?: string;
}

export function CircularProgress({
  value,
  size = 120,
  strokeWidth = 10,
  color = 'from-cyan-400 to-blue-500',
  showValue = true,
  label,
}: CircularProgressProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          className="fill-none stroke-white/10"
        />
        
        {/* Progress circle */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          className={`fill-none stroke-gradient-to-r ${color}`}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1, ease: "easeOut" }}
          style={{
            filter: 'drop-shadow(0 0 8px rgba(59, 130, 246, 0.5))',
          }}
        />
      </svg>
      
      {/* Center text */}
      {showValue && (
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span 
            className="text-2xl font-bold text-white"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            {Math.round(value)}%
          </motion.span>
          {label && (
            <span className="text-xs text-gray-400 mt-1">{label}</span>
          )}
        </div>
      )}
    </div>
  );
}