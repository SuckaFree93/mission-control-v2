'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, LineChart, PieChart, TrendingUp, Users, Clock, DollarSign, Globe } from 'lucide-react';

interface AnalyticsData {
  dailyActiveUsers: number;
  weeklyGrowth: number;
  monthlyRevenue: number;
  conversionRate: number;
  averageSessionTime: number;
  topCountries: { country: string; users: number; percentage: number }[];
  trafficSources: { source: string; percentage: number; color: string }[];
  performanceMetrics: { metric: string; value: number; change: number }[];
}

export function AnalyticsDashboard() {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d');
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    dailyActiveUsers: 1245,
    weeklyGrowth: 12.4,
    monthlyRevenue: 45280,
    conversionRate: 3.2,
    averageSessionTime: 8.5,
    topCountries: [
      { country: 'United States', users: 456, percentage: 36.5 },
      { country: 'United Kingdom', users: 234, percentage: 18.7 },
      { country: 'Germany', users: 189, percentage: 15.1 },
      { country: 'Canada', users: 156, percentage: 12.5 },
      { country: 'Australia', users: 98, percentage: 7.8 },
    ],
    trafficSources: [
      { source: 'Direct', percentage: 35, color: 'bg-blue-500' },
      { source: 'Organic Search', percentage: 28, color: 'bg-green-500' },
      { source: 'Social Media', percentage: 18, color: 'bg-purple-500' },
      { source: 'Referral', percentage: 12, color: 'bg-yellow-500' },
      { source: 'Email', percentage: 7, color: 'bg-red-500' },
    ],
    performanceMetrics: [
      { metric: 'Page Load Time', value: 1.2, change: -15 },
      { metric: 'API Response Time', value: 42, change: -8 },
      { metric: 'Error Rate', value: 0.8, change: -25 },
      { metric: 'Cache Hit Rate', value: 92, change: 5 },
    ],
  });

  // Simulate data updates
  useEffect(() => {
    const interval = setInterval(() => {
      setAnalytics(prev => ({
        ...prev,
        dailyActiveUsers: Math.floor(prev.dailyActiveUsers * (1 + Math.random() * 0.02 - 0.01)),
        conversionRate: parseFloat((prev.conversionRate * (1 + Math.random() * 0.01 - 0.005)).toFixed(2)),
      }));
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Analytics Dashboard</h2>
          <p className="text-gray-400">Performance metrics and user insights</p>
        </div>
        <div className="flex items-center gap-2 bg-gray-900/50 rounded-lg p-1">
          {(['7d', '30d', '90d'] as const).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                timeRange === range
                  ? 'bg-gray-800 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            label: 'Daily Active Users',
            value: analytics.dailyActiveUsers.toLocaleString(),
            change: `+${analytics.weeklyGrowth}%`,
            color: 'blue',
            icon: <Users className="w-5 h-5" />,
          },
          {
            label: 'Monthly Revenue',
            value: `$${analytics.monthlyRevenue.toLocaleString()}`,
            change: '+8.2%',
            color: 'green',
            icon: <DollarSign className="w-5 h-5" />,
          },
          {
            label: 'Conversion Rate',
            value: `${analytics.conversionRate}%`,
            change: '+1.4%',
            color: 'purple',
            icon: <TrendingUp className="w-5 h-5" />,
          },
          {
            label: 'Avg Session Time',
            value: `${analytics.averageSessionTime}m`,
            change: '+0.8m',
            color: 'yellow',
            icon: <Clock className="w-5 h-5" />,
          },
        ].map((metric, index) => (
          <div
            key={index}
            className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-6 border border-gray-800"
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-400">{metric.label}</div>
                <div className="text-3xl font-bold text-white mt-2">{metric.value}</div>
                <div className={`text-sm font-medium mt-1 ${
                  metric.color === 'green' ? 'text-green-400' :
                  metric.color === 'blue' ? 'text-blue-400' :
                  metric.color === 'purple' ? 'text-purple-400' : 'text-yellow-400'
                }`}>
                  {metric.change}
                </div>
              </div>
              <div className={`p-3 rounded-lg ${
                metric.color === 'green' ? 'bg-green-500/10' :
                metric.color === 'blue' ? 'bg-blue-500/10' :
                metric.color === 'purple' ? 'bg-purple-500/10' :
                'bg-yellow-500/10'
              }`}>
                <div className={`${
                  metric.color === 'green' ? 'text-green-400' :
                  metric.color === 'blue' ? 'text-blue-400' :
                  metric.color === 'purple' ? 'text-purple-400' : 'text-yellow-400'
                }`}>
                  {metric.icon}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts and Visualizations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Traffic Sources */}
        <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-6 border border-gray-800">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-white">Traffic Sources</h3>
            <Globe className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-4">
            {analytics.trafficSources.map((source, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-300">{source.source}</span>
                  <span className="text-white">{source.percentage}%</span>
                </div>
                <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${source.color}`}
                    style={{ width: `${source.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Countries */}
        <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-6 border border-gray-800">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-white">Top Countries</h3>
            <Globe className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-4">
            {analytics.topCountries.map((country, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center">
                    <span className="text-xs font-bold text-gray-300">
                      {country.country.substring(0, 2).toUpperCase()}
                    </span>
                  </div>
                  <span className="text-gray-300">{country.country}</span>
                </div>
                <div className="text-right">
                  <div className="text-white font-medium">{country.users.toLocaleString()} users</div>
                  <div className="text-sm text-gray-400">{country.percentage}% of total</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-6 border border-gray-800">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-white">Performance Metrics</h3>
          <BarChart3 className="w-5 h-5 text-gray-400" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {analytics.performanceMetrics.map((metric, index) => (
            <div key={index} className="text-center p-4 bg-gray-800/30 rounded-lg">
              <div className="text-sm text-gray-400">{metric.metric}</div>
              <div className="text-2xl font-bold text-white mt-2">
                {metric.value}
                {metric.metric.includes('Time') ? 'ms' : metric.metric.includes('Rate') ? '%' : ''}
              </div>
              <div className={`text-sm font-medium mt-1 ${
                metric.change > 0 && metric.metric !== 'Error Rate' ? 'text-green-400' :
                metric.change < 0 && metric.metric === 'Error Rate' ? 'text-green-400' : 'text-red-400'
              }`}>
                {metric.change > 0 ? '+' : ''}{metric.change}%
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Growth Chart (Mock) */}
      <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-6 border border-gray-800">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-white">User Growth</h3>
            <p className="text-gray-400">Last {timeRange}</p>
          </div>
          <LineChart className="w-5 h-5 text-gray-400" />
        </div>
        <div className="h-64 flex items-end gap-2">
          {Array.from({ length: timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90 }).map((_, index) => {
            const height = 20 + Math.random() * 80;
            return (
              <div
                key={index}
                className="flex-1 bg-gradient-to-t from-blue-600 to-blue-400 rounded-t-lg"
                style={{ height: `${height}%` }}
              />
            );
          })}
        </div>
        <div className="flex justify-between text-xs text-gray-400 mt-4">
          <span>Start</span>
          <span>Mid</span>
          <span>End</span>
        </div>
      </div>

      {/* Summary */}
      <div className="bg-gradient-to-r from-gray-900/50 to-gray-800/30 backdrop-blur-sm rounded-xl p-6 border border-gray-800">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-blue-500/10 rounded-lg">
            <PieChart className="w-6 h-6 text-blue-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">Analytics Summary</h3>
            <p className="text-gray-400 mt-2">
              Overall performance is strong with {analytics.weeklyGrowth}% weekly growth.
              User engagement remains high with an average session time of {analytics.averageSessionTime} minutes.
              Conversion rates continue to improve, showing positive momentum for the platform.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}