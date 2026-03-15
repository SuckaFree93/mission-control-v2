'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { LogOut, User, Settings, Bell, Shield } from 'lucide-react';

export function UserProfileCard() {
  const { user, logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    setIsDropdownOpen(false);
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-500/10 text-red-400 border-red-500/20';
      case 'user': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'viewer': return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
      default: return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin': return <Shield className="w-4 h-4" />;
      default: return <User className="w-4 h-4" />;
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-800/50 transition-colors"
      >
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center">
          <span className="text-white font-bold text-sm">
            {user?.username?.charAt(0).toUpperCase() || 'U'}
          </span>
        </div>
        <div className="text-left hidden md:block">
          <div className="text-sm font-medium text-white">{user?.username || 'User'}</div>
          <div className="text-xs text-gray-400">{user?.email || 'user@example.com'}</div>
        </div>
      </button>

      <AnimatePresence>
        {isDropdownOpen && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsDropdownOpen(false)}
            />

            {/* Dropdown */}
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute right-0 top-full mt-2 w-64 bg-gray-900 border border-gray-800 rounded-xl shadow-2xl z-50 overflow-hidden"
            >
              {/* User Info Header */}
              <div className="p-4 border-b border-gray-800">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center">
                    <span className="text-white font-bold text-lg">
                      {user?.username?.charAt(0).toUpperCase() || 'U'}
                    </span>
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-white">{user?.username || 'User'}</div>
                    <div className="text-sm text-gray-400 truncate">{user?.email || 'user@example.com'}</div>
                    <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs mt-1 ${getRoleColor(user?.role || 'user')}`}>
                      {getRoleIcon(user?.role || 'user')}
                      <span>{user?.role?.toUpperCase() || 'USER'}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Menu Items */}
              <div className="p-2">
                <a
                  href="/profile"
                  className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-300 hover:text-white hover:bg-gray-800/50 transition-colors"
                >
                  <User className="w-4 h-4" />
                  <span>Profile Settings</span>
                </a>

                <a
                  href="/notifications"
                  className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-300 hover:text-white hover:bg-gray-800/50 transition-colors"
                >
                  <Bell className="w-4 h-4" />
                  <span>Notifications</span>
                  <span className="ml-auto px-2 py-0.5 bg-blue-500/20 text-blue-400 text-xs rounded-full">3</span>
                </a>

                {user?.role === 'admin' && (
                  <a
                    href="/admin"
                    className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-300 hover:text-white hover:bg-gray-800/50 transition-colors"
                  >
                    <Settings className="w-4 h-4" />
                    <span>Admin Panel</span>
                  </a>
                )}
              </div>

              {/* Logout Button */}
              <div className="p-2 border-t border-gray-800">
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Log Out</span>
                </button>
              </div>

              {/* Footer */}
              <div className="px-4 py-3 bg-gray-950/50 border-t border-gray-800">
                <div className="text-xs text-gray-500">
                  Session: {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}