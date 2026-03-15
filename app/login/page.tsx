import LoginForm from '@/components/auth/LoginForm';
import Link from 'next/link';

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl"></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-10 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
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
          <div className="flex items-center space-x-4">
            <Link 
              href="/" 
              className="text-gray-400 hover:text-white transition-colors px-4 py-2 rounded-lg hover:bg-gray-800/50"
            >
              Home
            </Link>
            <Link 
              href="/register" 
              className="text-cyan-400 hover:text-cyan-300 transition-colors px-4 py-2 rounded-lg border border-cyan-500/30 hover:bg-cyan-500/10"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </nav>

      {/* Main content */}
      <main className="relative z-10 px-4 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
            {/* Left side - Hero text */}
            <div className="lg:w-1/2">
              <div className="space-y-8">
                <div>
                  <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                    <span className="block text-white">Welcome Back to</span>
                    <span className="block bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                      Mission Control
                    </span>
                  </h1>
                  <p className="mt-6 text-xl text-gray-400 max-w-2xl">
                    Sign in to access your dashboard, monitor agents in real-time, and manage your OpenClaw deployment.
                  </p>
                </div>

                <div className="space-y-6">
                  <div className="flex items-start space-x-4 p-4 bg-gray-800/30 rounded-xl border border-gray-700">
                    <div className="flex-shrink-0 w-10 h-10 bg-cyan-500/10 rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">Secure Authentication</h3>
                      <p className="text-gray-400 mt-1">Protected by JWT tokens with automatic refresh and rate limiting.</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4 p-4 bg-gray-800/30 rounded-xl border border-gray-700">
                    <div className="flex-shrink-0 w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">Real-time Monitoring</h3>
                      <p className="text-gray-400 mt-1">Live metrics and agent status updates with WebSocket integration.</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4 p-4 bg-gray-800/30 rounded-xl border border-gray-700">
                    <div className="flex-shrink-0 w-10 h-10 bg-purple-500/10 rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">Role-based Access</h3>
                      <p className="text-gray-400 mt-1">Admin, user, and viewer roles with granular permission controls.</p>
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-gray-800">
                  <p className="text-gray-500 text-sm">
                    Need help?{' '}
                    <a href="#" className="text-cyan-400 hover:text-cyan-300 transition-colors">
                      Contact support
                    </a>{' '}
                    or{' '}
                    <a href="#" className="text-cyan-400 hover:text-cyan-300 transition-colors">
                      read our documentation
                    </a>
                  </p>
                </div>
              </div>
            </div>

            {/* Right side - Login form */}
            <div className="lg:w-1/2">
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl blur opacity-20"></div>
                <div className="relative">
                  <LoginForm />
                </div>
              </div>

              {/* Stats */}
              <div className="mt-8 grid grid-cols-3 gap-4">
                <div className="p-4 bg-gray-800/30 rounded-lg border border-gray-700 text-center">
                  <div className="text-2xl font-bold text-white">99.9%</div>
                  <div className="text-xs text-gray-400 mt-1">Uptime</div>
                </div>
                <div className="p-4 bg-gray-800/30 rounded-lg border border-gray-700 text-center">
                  <div className="text-2xl font-bold text-white">256-bit</div>
                  <div className="text-xs text-gray-400 mt-1">Encryption</div>
                </div>
                <div className="p-4 bg-gray-800/30 rounded-lg border border-gray-700 text-center">
                  <div className="text-2xl font-bold text-white">24/7</div>
                  <div className="text-xs text-gray-400 mt-1">Monitoring</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 px-6 py-8 border-t border-gray-800/50">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="text-gray-500 text-sm">
              © 2026 Mission Control v2. All rights reserved.
            </div>
            <div className="flex items-center space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">
                Privacy Policy
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">
                Terms of Service
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">
                Security
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">
                Status
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}