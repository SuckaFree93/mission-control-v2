'use client';

import { LiveMetrics } from '@/components/dashboard/LiveMetrics';
import { GlassCard } from '@/components/ui/GlassCard';
import { motion } from 'framer-motion';

export default function TestRealtimePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 text-center"
        >
          <h1 className="text-4xl font-bold text-white mb-2">
            🚀 Mission Control v2 - Real-Time Features Test
          </h1>
          <p className="text-gray-400">
            Testing all four enhancement categories: Real-Time, User Experience, Data & Analytics, Integration & APIs
          </p>
        </motion.div>

        {/* Live Metrics Test */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-white mb-4">🔌 Real-Time WebSocket Test</h2>
          <LiveMetrics />
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Real-Time Features */}
          <GlassCard className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                <span className="text-2xl">⚡</span>
              </div>
              <h3 className="text-xl font-semibold text-white">Real-Time Features</h3>
            </div>
            <ul className="space-y-2 text-gray-300">
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                WebSocket server with live data streaming
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                System metrics broadcasting every 5s
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                Auto-reconnection on disconnect
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                Live dashboard updates
              </li>
            </ul>
          </GlassCard>

          {/* User Experience */}
          <GlassCard className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center">
                <span className="text-2xl">🎨</span>
              </div>
              <h3 className="text-xl font-semibold text-white">User Experience</h3>
            </div>
            <ul className="space-y-2 text-gray-300">
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                Theme customization (dark/light/auto)
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                Dashboard widget personalization
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                Notification preferences
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                Keyboard shortcut configuration
              </li>
            </ul>
          </GlassCard>

          {/* Data & Analytics */}
          <GlassCard className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                <span className="text-2xl">📊</span>
              </div>
              <h3 className="text-xl font-semibold text-white">Data & Analytics</h3>
            </div>
            <ul className="space-y-2 text-gray-300">
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                SQLite database integration
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                Historical metrics storage
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                Agent activity tracking
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                Analytics and reporting
              </li>
            </ul>
          </GlassCard>

          {/* Integration & APIs */}
          <GlassCard className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center">
                <span className="text-2xl">🔗</span>
              </div>
              <h3 className="text-xl font-semibold text-white">Integration & APIs</h3>
            </div>
            <ul className="space-y-2 text-gray-300">
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                JWT-based authentication
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                Session management
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                API routes (login/register/logout)
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                Security middleware
              </li>
            </ul>
          </GlassCard>
        </div>

        {/* Test Instructions */}
        <GlassCard className="p-6">
          <h3 className="text-xl font-semibold text-white mb-4">🧪 Test Instructions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-300 mb-2">Real-Time Features Test</h4>
              <ol className="list-decimal list-inside space-y-2 text-gray-400">
                <li>Observe the Live Metrics dashboard above</li>
                <li>Watch for real-time updates every 5 seconds</li>
                <li>Check connection status (should show "connected")</li>
                <li>Try the "Refresh Now" button</li>
                <li>Test "Disconnect/Reconnect" functionality</li>
              </ol>
            </div>
            <div>
              <h4 className="font-medium text-gray-300 mb-2">API Endpoints Test</h4>
              <div className="space-y-2">
                <a 
                  href="/api/health" 
                  target="_blank"
                  className="block p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                >
                  <div className="font-medium text-white">Health Check</div>
                  <div className="text-sm text-gray-400">GET /api/health</div>
                </a>
                <div className="p-3 rounded-lg bg-white/5">
                  <div className="font-medium text-white">Authentication APIs</div>
                  <div className="text-sm text-gray-400">
                    POST /api/auth/login, /api/auth/register, /api/auth/logout
                  </div>
                </div>
              </div>
            </div>
          </div>
        </GlassCard>

        {/* Status */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 p-4 rounded-xl bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30"
        >
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
            <div className="flex-1">
              <div className="font-semibold text-white">All Systems Operational</div>
              <div className="text-sm text-gray-300">
                Mission Control v2 with all four enhancement categories is running successfully.
                Real-time features are active and ready for testing.
              </div>
            </div>
            <a 
              href="/" 
              className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors text-white"
            >
              Back to Dashboard
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
}