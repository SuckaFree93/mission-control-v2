'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Settings, Shield, Database, Key, Bell, Trash2, Edit, Eye, CheckCircle, XCircle } from 'lucide-react';

interface User {
  id: string;
  email: string;
  username: string;
  role: 'admin' | 'user' | 'viewer';
  status: 'active' | 'inactive' | 'suspended';
  createdAt: Date;
  lastLogin: Date;
}

interface SystemSetting {
  key: string;
  value: string;
  description: string;
  category: 'security' | 'performance' | 'general';
}

export function AdminPanel() {
  const [users, setUsers] = useState<User[]>([
    {
      id: '1',
      email: 'admin@mission-control.ai',
      username: 'admin',
      role: 'admin',
      status: 'active',
      createdAt: new Date('2024-01-15'),
      lastLogin: new Date(),
    },
    {
      id: '2',
      email: 'john@example.com',
      username: 'john_doe',
      role: 'user',
      status: 'active',
      createdAt: new Date('2024-02-20'),
      lastLogin: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    },
    {
      id: '3',
      email: 'jane@example.com',
      username: 'jane_smith',
      role: 'user',
      status: 'inactive',
      createdAt: new Date('2024-03-01'),
      lastLogin: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    },
    {
      id: '4',
      email: 'viewer@example.com',
      username: 'viewer',
      role: 'viewer',
      status: 'active',
      createdAt: new Date('2024-03-10'),
      lastLogin: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    },
  ]);

  const [settings, setSettings] = useState<SystemSetting[]>([
    {
      key: 'SESSION_TIMEOUT',
      value: '3600',
      description: 'Session timeout in seconds',
      category: 'security',
    },
    {
      key: 'MAX_LOGIN_ATTEMPTS',
      value: '5',
      description: 'Maximum failed login attempts before lockout',
      category: 'security',
    },
    {
      key: 'ENABLE_2FA',
      value: 'true',
      description: 'Enable two-factor authentication',
      category: 'security',
    },
    {
      key: 'CACHE_TTL',
      value: '300',
      description: 'Cache time-to-live in seconds',
      category: 'performance',
    },
    {
      key: 'LOG_RETENTION_DAYS',
      value: '30',
      description: 'Number of days to retain logs',
      category: 'general',
    },
    {
      key: 'NOTIFICATION_ENABLED',
      value: 'true',
      description: 'Enable system notifications',
      category: 'general',
    },
  ]);

  const [selectedTab, setSelectedTab] = useState<'users' | 'settings' | 'logs'>('users');
  const [editingSetting, setEditingSetting] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
  };

  const handleEditSetting = (key: string, value: string) => {
    setEditingSetting(key);
    setEditValue(value);
  };

  const handleSaveSetting = (key: string) => {
    setSettings(prev => prev.map(setting => 
      setting.key === key ? { ...setting, value: editValue } : setting
    ));
    setEditingSetting(null);
  };

  const handleCancelEdit = () => {
    setEditingSetting(null);
  };

  const handleDeleteUser = (userId: string) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      setUsers(prev => prev.filter(user => user.id !== userId));
    }
  };

  const handleToggleUserStatus = (userId: string) => {
    setUsers(prev => prev.map(user => {
      if (user.id === userId) {
        const newStatus = user.status === 'active' ? 'inactive' : 'active';
        return { ...user, status: newStatus };
      }
      return user;
    }));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Admin Panel</h2>
          <p className="text-gray-400">System administration and user management</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-gray-900/50 rounded-lg p-1">
            {(['users', 'settings', 'logs'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setSelectedTab(tab)}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  selectedTab === tab
                    ? 'bg-gray-800 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
          <button className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-lg hover:opacity-90 transition-opacity">
            Export Data
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          {
            label: 'Total Users',
            value: users.length.toString(),
            change: '+2',
            color: 'blue',
            icon: <Users className="w-5 h-5" />,
          },
          {
            label: 'Active Users',
            value: users.filter(u => u.status === 'active').length.toString(),
            change: '▲ 1',
            color: 'green',
            icon: <CheckCircle className="w-5 h-5" />,
          },
          {
            label: 'System Settings',
            value: settings.length.toString(),
            change: 'Updated',
            color: 'purple',
            icon: <Settings className="w-5 h-5" />,
          },
        ].map((stat, index) => (
          <div
            key={index}
            className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-6 border border-gray-800"
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-400">{stat.label}</div>
                <div className="text-3xl font-bold text-white mt-2">{stat.value}</div>
                <div className={`text-sm font-medium mt-1 ${
                  stat.color === 'green' ? 'text-green-400' :
                  stat.color === 'blue' ? 'text-blue-400' : 'text-purple-400'
                }`}>
                  {stat.change}
                </div>
              </div>
              <div className={`p-3 rounded-lg ${
                stat.color === 'green' ? 'bg-green-500/10' :
                stat.color === 'blue' ? 'bg-blue-500/10' : 'bg-purple-500/10'
              }`}>
                <div className={`${
                  stat.color === 'green' ? 'text-green-400' :
                  stat.color === 'blue' ? 'text-blue-400' : 'text-purple-400'
                }`}>
                  {stat.icon}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Tab Content */}
      {selectedTab === 'users' && (
        <motion.div
          key="users"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800 overflow-hidden"
        >
          <div className="p-6 border-b border-gray-800">
            <h3 className="text-lg font-semibold text-white">User Management</h3>
            <p className="text-gray-400">Manage user accounts and permissions</p>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-800">
                  <th className="text-left p-4 text-gray-400 font-medium">User</th>
                  <th className="text-left p-4 text-gray-400 font-medium">Role</th>
                  <th className="text-left p-4 text-gray-400 font-medium">Status</th>
                  <th className="text-left p-4 text-gray-400 font-medium">Created</th>
                  <th className="text-left p-4 text-gray-400 font-medium">Last Login</th>
                  <th className="text-left p-4 text-gray-400 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-b border-gray-800/50 hover:bg-gray-800/20">
                    <td className="p-4">
                      <div>
                        <div className="font-medium text-white">{user.username}</div>
                        <div className="text-sm text-gray-400">{user.email}</div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${
                        user.role === 'admin' ? 'bg-red-500/10 text-red-400' :
                        user.role === 'user' ? 'bg-blue-500/10 text-blue-400' :
                        'bg-gray-500/10 text-gray-400'
                      }`}>
                        {user.role === 'admin' && <Shield className="w-3 h-3" />}
                        {user.role === 'user' && <Users className="w-3 h-3" />}
                        {user.role === 'viewer' && <Eye className="w-3 h-3" />}
                        {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${
                        user.status === 'active' ? 'bg-green-500/10 text-green-400' :
                        user.status === 'inactive' ? 'bg-yellow-500/10 text-yellow-400' :
                        'bg-red-500/10 text-red-400'
                      }`}>
                        {user.status === 'active' && <CheckCircle className="w-3 h-3" />}
                        {user.status === 'inactive' && <XCircle className="w-3 h-3" />}
                        {user.status === 'suspended' && <XCircle className="w-3 h-3" />}
                        {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                      </span>
                    </td>
                    <td className="p-4 text-gray-300">{formatDate(user.createdAt)}</td>
                    <td className="p-4 text-gray-300">{formatTimeAgo(user.lastLogin)}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleToggleUserStatus(user.id)}
                          className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
                          title={user.status === 'active' ? 'Deactivate' : 'Activate'}
                        >
                          {user.status === 'active' ? <XCircle className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                        </button>
                        <button className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors" title="Edit">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          className="p-2 text-gray-400 hover:text-red-400 hover:bg-gray-800 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-6 border-t border-gray-800">
            <button className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-lg hover:opacity-90 transition-opacity">
              Add New User
            </button>
          </div>
        </motion.div>
      )}

      {selectedTab === 'settings' && (
        <motion.div
          key="settings"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-6"
        >
          {['security', 'performance', 'general'].map((category) => (
            <div key={category} className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800 overflow-hidden">
              <div className="p-6 border-b border-gray-800">
                <div className="flex items-center gap-2">
                  {category === 'security' && <Shield className="w-5 h-5 text-red-400" />}
                  {category === 'performance' && <Database className="w-5 h-5 text-blue-400" />}
                  {category === 'general' && <Settings className="w-5 h-5 text-gray-400" />}
                  <h3 className="text-lg font-semibold text-white">
                    {category.charAt(0).toUpperCase() + category.slice(1)} Settings
                  </h3>
                </div>
              </div>
              
              <div className="divide-y divide-gray-800/50">
                {settings
                  .filter(setting => setting.category === category)
                  .map((setting) => (
                    <div key={setting.key} className="p-6 hover:bg-gray-800/20">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <code className="px-2 py-1 bg-gray-800 text-blue-400 text-sm rounded">
                              {setting.key}
                            </code>
                            {setting.category === 'security' && (
                              <span className="px-2 py-1 bg-red-500/10 text-red-400 text-xs rounded">
                                Security
                              </span>
                            )}
                          </div>
                          <p className="text-gray-400 text-sm mb-3">{setting.description}</p>
                          {editingSetting === setting.key ? (
                            <div className="flex items-center gap-2">
                              <input
                                type="text"
                                value={editValue}
                                onChange={(e) => setEditValue(e.target.value)}
                                className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
                                autoFocus
                              />
                              <button
                                onClick={() => handleSaveSetting(setting.key)}
                                className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                              >
                                Save
                              </button>
                              <button
                                onClick={handleCancelEdit}
                                className="px-3 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
                              >
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2">
                              <code className="px-3 py-2 bg-gray-800 text-white rounded-lg">
                                {setting.value}
                              </code>
                              <button
                                onClick={() => handleEditSetting(setting.key, setting.value)}
                                className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </motion.div>
      )}

      {selectedTab === 'logs' && (
        <motion.div
          key="logs"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800 overflow-hidden"
        >
          <div className="p-6 border-b border-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-white">System Logs</h3>
                <p className="text-gray-400">Audit trail and system events</p>
              </div>
              <Database className="w-5 h-5 text-gray-400" />
            </div>
          </div>
          
          <div className="p-6">
            <div className="text-center py-12">
              <Database className="w-12 h-12 text-gray-600 mx-auto mb-4" />
              <h4 className="text-lg font-medium text-gray-300 mb-2">Logs Feature Coming Soon</h4>
              <p className="text-gray-500 max-w-md mx-auto">
                The system logs viewer is currently under development. You'll be able to view audit trails,
                error logs, and system events here in the next update.
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
