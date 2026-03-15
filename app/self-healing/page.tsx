// Self-Healing Dashboard Page
import { SelfHealingDashboard } from '@/components/dashboard/SelfHealingDashboard';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Self-Healing Agent System | Mission Control v2',
  description: 'Automated monitoring and recovery system for agent reliability',
};

export default function SelfHealingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950">
      {/* Navigation */}
      <nav className="border-b border-gray-800">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
                <span className="text-blue-400 font-bold">SH</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Mission Control v2</h1>
                <p className="text-sm text-gray-400">Self-Healing System</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <a 
                href="/" 
                className="px-4 py-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800/50"
              >
                Main Dashboard
              </a>
              <a 
                href="/api/agent-monitor/status" 
                target="_blank"
                className="px-4 py-2 rounded-lg text-blue-400 hover:text-blue-300 hover:bg-blue-500/10"
              >
                API Status
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        <SelfHealingDashboard />
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-800 mt-12">
        <div className="container mx-auto px-6 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-500 text-sm">
              <p>© 2026 Mission Control v2. All rights reserved.</p>
              <p className="mt-1">Self-Healing Agent System v1.0.0</p>
            </div>
            <div className="flex items-center gap-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-500 hover:text-white text-sm">
                Documentation
              </a>
              <a href="#" className="text-gray-500 hover:text-white text-sm">
                API Reference
              </a>
              <a href="#" className="text-gray-500 hover:text-white text-sm">
                Support
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}