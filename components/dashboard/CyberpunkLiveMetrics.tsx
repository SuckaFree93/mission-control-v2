'use client';

import { motion } from 'framer-motion';
import { CircularProgress } from '@/components/ui/CircularProgress';

export function CyberpunkLiveMetrics() {
  const metrics = [
    { 
      label: 'CPU Usage', 
      value: 78, 
      gradient: 'from-blue-500 to-indigo-500',
      unit: '%',
      trend: '▲ 2%',
      status: 'high',
      details: '8 cores @ 3.2GHz'
    },
    { 
      label: 'Memory', 
      value: 64, 
      gradient: 'from-green-500 to-emerald-500',
      unit: '%',
      trend: '▼ 4%',
      status: 'normal',
      details: '12GB / 16GB'
    },
    { 
      label: 'Network', 
      value: 92, 
      gradient: 'from-indigo-500 to-purple-500',
      unit: 'MB/s',
      trend: '▲ 12MB',
      status: 'high',
      details: '42ms latency'
    },
    { 
      label: 'Storage', 
      value: 45, 
      gradient: 'from-purple-500 to-pink-500',
      unit: '%',
      trend: '▲ 5%',
      status: 'normal',
      details: '240GB / 512GB'
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
      {metrics.map((metric, index) => (
        <motion.div
          key={metric.label}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.1 }}
          className="relative group"
        >
          {/* Card background with professional style */}
          <div className="absolute inset-0 bg-gray-900/50 rounded-xl border border-gray-800 group-hover:border-gray-700 transition-all duration-300" />
          
          {/* Content */}
          <div className="relative p-6">
            <div className="flex flex-col items-center">
              {/* Circular progress */}
              <div className="relative">
                <CircularProgress
                  value={metric.value}
                  size={100}
                  strokeWidth={10}
                  color={metric.gradient}
                  showValue={true}
                />
                
                {/* Status indicator */}
                <div className={`absolute -top-1 -right-1 w-3 h-3 rounded-full ${
                  metric.status === 'high' ? 'bg-red-500 animate-pulse' :
                  metric.status === 'normal' ? 'bg-green-500' :
                  'bg-yellow-500'
                }`} />
              </div>
              
              {/* Metric info */}
              <div className="mt-6 text-center">
                <div className="text-lg font-semibold text-white">{metric.label}</div>
                <div className="flex items-center justify-center gap-2 mt-2">
                  <div className="text-2xl font-bold text-white">{metric.value}{metric.unit}</div>
                  <div className={`text-sm font-medium ${
                    metric.trend.includes('▲') ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {metric.trend}
                  </div>
                </div>
                <div className="text-xs text-gray-400 mt-2">{metric.details}</div>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}