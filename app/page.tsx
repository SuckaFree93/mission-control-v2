import { CyberpunkDashboard } from '@/components/dashboard/CyberpunkDashboard'
import { MobileLayout } from '@/components/layout/mobile-layout'
import Link from 'next/link'

export default function Home() {
  return (
    <>
      {/* Navigation Bar */}
      <nav className="sticky top-0 z-50 bg-gray-900/80 backdrop-blur-md border-b border-gray-800">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
                <span className="text-blue-400 font-bold">MC</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Mission Control v2</h1>
                <p className="text-sm text-gray-400">Professional Tech Dashboard</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Link 
                href="/self-healing" 
                className="px-4 py-2 rounded-lg bg-green-500/20 text-green-400 border border-green-500/30 hover:bg-green-500/30 transition-colors flex items-center gap-2"
              >
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                Self-Healing System
              </Link>
              <Link 
                href="/mobile-access" 
                className="px-4 py-2 rounded-lg bg-blue-500/20 text-blue-400 border border-blue-500/30 hover:bg-blue-500/30 transition-colors flex items-center gap-2"
              >
                <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
                Mobile Access
              </Link>
              <a 
                href="/api/health" 
                target="_blank"
                className="px-4 py-2 rounded-lg text-purple-400 hover:text-purple-300 hover:bg-purple-500/10"
              >
                API Health
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Cyberpunk Dashboard (hidden on mobile) */}
      <div className="hidden lg:block">
        <CyberpunkDashboard />
      </div>
      
      {/* Mobile Version (hidden on desktop) */}
      <div className="lg:hidden">
        <MobileLayout />
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-800 mt-12">
        <div className="container mx-auto px-6 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-500 text-sm">
              <p>© 2026 Mission Control v2. All rights reserved.</p>
              <p className="mt-1">Professional Tech Dashboard v1.0.0</p>
            </div>
            <div className="flex items-center gap-6 mt-4 md:mt-0">
              <Link href="/self-healing" className="text-green-400 hover:text-green-300 text-sm flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                Self-Healing System
              </Link>
              <Link href="/mobile-access" className="text-blue-400 hover:text-blue-300 text-sm flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
                Mobile Access
              </Link>
              <a href="/api/health" target="_blank" className="text-gray-500 hover:text-white text-sm">
                API Status
              </a>
              <a href="/test-realtime" className="text-gray-500 hover:text-white text-sm">
                Real-time Test
              </a>
            </div>
          </div>
        </div>
      </footer>
    </>
  )
}