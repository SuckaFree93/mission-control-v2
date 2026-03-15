'use client';

import { useAuth } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import CyberpunkDashboard from '@/components/dashboard/CyberpunkDashboard';
import Link from 'next/link';

export default function DashboardPage() {
  const { user, logout } = useAuth();

  return (
    <ProtectedRoute requiredRole="user">
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
        {/* Navigation */}
        <nav className="px-6 py-4 border-b border-gray-800/50">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                  Mission Control
                </span>
              </Link>
              <div className="hidden md:flex items-center space-x-1">
                <span className="text-gray-500">/</span>
                <span className="text-gray-300 font-medium">Dashboard</span>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {user && (
                <div className="flex items-center space-x-3">
                  <div className="text-right hidden md:block">
                    <div className="text-sm font-medium text-white">{user.username}</div>
                    <div className="text-xs text-gray-400 capitalize">{user.role}</div>
                  </div>
                  <div className="relative">
                    <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold">
                        {user.username.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    {user.role === 'admin' && (
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-500 rounded-full border-2 border-gray-900 flex items-center justify-center">
                        <svg className="w-2 h-2 text-gray-900" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <button
                    onClick={logout}
                    className="px-4 py-2 text-sm text-gray-400 hover:text-white hover:bg-gray-800/50 rounded-lg transition-colors"
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </nav>

        {/* Main content */}
        <main className="px-4 py-8">
          <div className="max-w-7xl mx-auto">
            {/* Welcome banner */}
            <div className="mb-8 p-6 bg-gradient-to-r from-cyan-900/20 to-blue-900/20 rounded-xl border border-cyan-500/20">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-white">
                    Welcome back, <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">{user?.username}</span>
                  </h1>
                  <p className="text-gray-400 mt-2">
                    Monitor your agents, track system performance, and manage deployments.
                  </p>
                </div>
                <div className="mt-4 md:mt-0 flex items-center space-x-3">
                  <div className="px-4 py-2 bg-gray-800/50 rounded-lg border border-gray-700">
                    <div className="text-xs text-gray-400">Last Login</div>
                    <div className="text-sm text-white">
                      {user?.lastLoginAt ? new Date(user.lastLoginAt).toLocaleDateString() : 'Today'}
                    </div>
                  </div>
                  {user?.role === 'admin' && (
                    <Link
                      href="/admin"
                      className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 rounded-lg text-white font-medium transition-all duration-200"
                    >
                      Admin Panel
                    </Link>
                  )}
                </div>
              </div>
            </div>

            {/* Dashboard */}
            <CyberpunkDashboard />
          </div>
        </main>

        {/* Footer */}
        <footer className="px-6 py-6 border-t border-gray-800/50">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="text-gray-500 text-sm">
                © 2026 Mission Control v2 • Authenticated with JWT • Role: {user?.role}
              </div>
              <div className="flex items-center space-x-6 mt-4 md:mt-0">
                <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Documentation
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Support
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">
                  API Status
                </a>
                <button
                  onClick={logout}
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </ProtectedRoute>
  );
}