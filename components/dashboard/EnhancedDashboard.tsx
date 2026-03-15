'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { RealTimeMetrics } from './RealTimeMetrics';
import { UserProfileCard } from './UserProfileCard';
import { AgentMonitor } from './AgentMonitor';
import { NotificationCenter } from './NotificationCenter';

interface DashboardStats {
  totalAgents: number;
  onlineAgents: number;
  systemHealth: number;
  activeSessions: number;
  totalUsers: number;
  dataProcessed: number;
  averageResponseTime: number;
  errorRate: number;
}

export function EnhancedDashboard() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalAgents: 0,
    onlineAgents: 0,
    systemHealth: 100,
    activeSessions: 0,
    totalUsers: 0,
    dataProcessed: 0,
    averageResponseTime: 0,
    errorRate: 0,
  });
  const [activeTab, setActiveTab] = useState<'overview' | 'agents'>('overview');

  // Fetch dashboard stats
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/dashboard/stats');
        if (response.ok) {
          const data = await response.json();
          setStats(data);
        }
      } catch (error) {
        console.error('Failed to fetch dashboard stats:', error);
        // Use mock data for development
        setStats({
          totalAgents: 12,
          onlineAgents: 8,
          systemHealth: 92,
          activeSessions: 45,
          totalUsers: 156,
          dataProcessed: 1245000000,
          averageResponseTime: 42,
          errorRate: 0.8,
        });
      }
    };

    fetchStats();
    const interval = setInterval(fetchStats, 10000); // Refresh every 10 seconds

    return () => clearInterval(interval);
  }, []);

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-300">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // Show login prompt if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 flex items-center justify-center">
        <div className="text-center max-w-md p-8 bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800">
          <h2 className="text-2xl font-bold text-white mb-4">Authentication Required</h2>
          <p className="text-gray-300 mb-6">
            Please log in to access the Mission Control dashboard.
          </p>
          <a
            href="/login"
            className="inline-block px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-lg hover:opacity-90 transition-opacity"
          >
            Go to Login
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950">
      {/* Subtle grid background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px]" />
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-gray-900/20 to-transparent" />
      </div>

      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0 z-40 backdrop-blur-md bg-gray-900/80 border-b border-gray-800"
      >
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg" />
                <h1 className="text-xl font-bold text-white">Mission Control v2</h1>
                <span className="px-2 py-1 bg-gray-800 text-gray-300 text-xs rounded">
                  v2.1.0
                </span>
              </div>
              <div className="hidden md:flex items-center gap-4">
                <div className="flex space-x-1">
                  <button
                    onClick={() => setActiveTab('overview')}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      activeTab === 'overview'
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                    }`}
                  >
                    Overview
                  </button>
                  <button
                    onClick={() => setActiveTab('agents')}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      activeTab === 'agents'
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                    }`}
                  >
                    Agents
                  </button>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <NotificationCenter />
              <UserProfileCard />
            </div>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8 relative z-10">
        {/* Welcome Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="bg-gradient-to-r from-gray-900/50 to-gray-800/30 backdrop-blur-sm rounded-xl p-6 border border-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white">
                  Welcome back, {user?.username || 'Agent'}!
                </h2>
                <p className="text-gray-400 mt-1">
                  {user?.role === 'admin' 
                    ? 'Administrator access enabled. Full system control available.'
                    : 'Monitor system status and agent activity.'}
                </p>
              </div>
              <div className="hidden md:block">
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-sm text-gray-400">System Health</div>
                    <div className="text-2xl font-bold text-white">{stats.systemHealth}%</div>
                  </div>
                  <div className="w-16 h-16">
                    <svg viewBox="0 0 36 36" className="w-full h-full">
                      <path
                        d="M18 2.0845
                          a 15.9155 15.9155 0 0 1 0 31.831
                          a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="#1e40af"
                        strokeWidth="3"
                        strokeDasharray={`${stats.systemHealth}, 100`}
                      />
                      <text x="18" y="20" textAnchor="middle" fill="white" fontSize="8">
                        {stats.systemHealth}%
                      </text>
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Tab Content */}
        {activeTab === 'overview' ? (
          <motion.div
            key="overview"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-8"
          >
            {/* Real-time Metrics */}
            <RealTimeMetrics />

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  label: 'Total Agents',
                  value: stats.totalAgents.toString(),
                  change: '+2',
                  color: 'blue',
                  icon: '👥',
                },
                {
                  label: 'Online Agents',
                  value: stats.onlineAgents.toString(),
                  change: '▲ 1',
                  color: 'green',
                  icon: '✅',
                },
                {
                  label: 'Active Sessions',
                  value: stats.activeSessions.toString(),
                  change: '+8',
                  color: 'indigo',
                  icon: '🔗',
                },
                {
                  label: 'Error Rate',
                  value: `${stats.errorRate}%`,
                  change: '▼ 0.2%',
                  color: stats.errorRate > 2 ? 'red' : 'yellow',
                  icon: '📊',
                },
              ].map((stat, index) => (
                <div
                  key={index}
                  className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-6 border border-gray-800 hover:border-gray-700 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm text-gray-400">{stat.label}</div>
                      <div className="text-3xl font-bold text-white mt-2">{stat.value}</div>
                      <div className={`text-sm font-medium mt-1 ${
                        stat.color === 'green' ? 'text-green-400' :
                        stat.color === 'blue' ? 'text-blue-400' :
                        stat.color === 'red' ? 'text-red-400' : 'text-yellow-400'
                      }`}>
                        {stat.change}
                      </div>
                    </div>
                    <div className={`text-2xl ${
                      stat.color === 'green' ? 'text-green-400' :
                      stat.color === 'blue' ? 'text-blue-400' :
                      stat.color === 'red' ? 'text-red-400' : 'text-yellow-400'
                    }`}>
                      {stat.icon}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Recent Activity */}
            <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-6 border border-gray-800">
              <h3 className="text-xl font-bold text-white mb-4">Recent Activity</h3>
              <div className="space-y-4">
                {[
                  { time: '2 min ago', action: 'Agent "WebSocket Server" connected', user: 'system' },
                  { time: '5 min ago', action: 'Database backup completed', user: 'backup-service' },
                  { time: '12 min ago', action: 'User login from new device', user: user?.username || 'admin' },
                  { time: '25 min ago', action: 'System health check passed', user: 'monitor-agent' },
                  { time: '1 hour ago', action: 'Cache optimization completed', user: 'optimizer' },
                ].map((activity, index) => (
                  <div key={index} className="flex items-center justify-between py-3 border-b border-gray-800 last:border-0">
                    <div>
                      <div className="text-white">{activity.action}</div>
                      <div className="text-sm text-gray-400">by {activity.user}</div>
                    </div>
                    <div className="text-sm text-gray-500">{activity.time}</div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="agents"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <AgentMonitor />
          </motion.div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-12 border-t border-gray-800 py-6">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between text-gray-400 text-sm">
            <div className="mb-4 md:mb-0">
              <p>Mission Control v2 • Cyberpunk Dashboard</p>
              <p className="text-xs text-gray-500 mt-1">
                Real-time monitoring and agent management system
              </p>
            </div>
            <div className="flex items-center gap-6">
              <a href="/docs" className="hover:text-white transition-colors">
                Documentation
              </a>
              <a href="/api" className="hover:text-white transition-colors">
                API Reference
              </a>
              <a href="/status" className="hover:text-white transition-colors">
                System Status
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}