import RegisterForm from '@/components/auth/RegisterForm';
import Link from 'next/link';

export default function RegisterPage() {
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
              href="/login" 
              className="text-cyan-400 hover:text-cyan-300 transition-colors px-4 py-2 rounded-lg border border-cyan-500/30 hover:bg-cyan-500/10"
            >
              Sign In
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
                    <span className="block text-white">Join</span>
                    <span className="block bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                      Mission Control
                    </span>
                  </h1>
                  <p className="mt-6 text-xl text-gray-400 max-w-2xl">
                    Create your account to start monitoring agents, managing deployments, and accessing real-time system analytics.
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
                      <h3 className="text-lg font-semibold text-white">Enterprise Security</h3>
                      <p className="text-gray-400 mt-1">Military-grade encryption with JWT tokens, rate limiting, and secure session management.</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4 p-4 bg-gray-800/30 rounded-xl border border-gray-700">
                    <div className="flex-shrink-0 w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">Real-time Analytics</h3>
                      <p className="text-gray-400 mt-1">Monitor agent performance, system health, and deployment status with live updates.</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4 p-4 bg-gray-800/30 rounded-xl border border-gray-700">
                    <div className="flex-shrink-0 w-10 h-10 bg-purple-500/10 rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">Role Management</h3>
                      <p className="text-gray-400 mt-1">Admin, user, and viewer roles with granular permissions for team collaboration.</p>
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-gray-800">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-gray-800/20 rounded-lg">
                      <div className="text-2xl font-bold text-white">Free</div>
                      <div className="text-sm text-gray-400 mt-1">Basic Features</div>
                    </div>
                    <div className="text-center p-4 bg-cyan-500/10 rounded-lg border border-cyan-500/30">
                      <div className="text-2xl font-bold text-cyan-300">Pro</div>
                      <div className="text-sm text-gray-400 mt-1">All Features</div>
                    </div>
                  </div>
                  <p className="text-gray-500 text-sm mt-4">
                    All accounts include full access during beta. No credit card required.
                  </p>
                </div>
              </div>
            </div>

            {/* Right side - Registration form */}
            <div className="lg:w-1/2">
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl blur opacity-20"></div>
                <div className="relative">
                  <RegisterForm />
                </div>
              </div>

              {/* Trust indicators */}
              <div className="mt-8 p-6 bg-gray-800/30 rounded-xl border border-gray-700">
                <h3 className="text-lg font-semibold text-white mb-4">Trusted by Teams Worldwide</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center">
                      <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-white">SOC 2 Compliant</div>
                      <div className="text-xs text-gray-400">Enterprise security</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                      <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-white">GDPR Ready</div>
                      <div className="text-xs text-gray-400">Data protection</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center">
                      <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-white">Zero Trust</div>
                      <div className="text-xs text-gray-400">Security model</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-cyan-500/20 rounded-lg flex items-center justify-center">
                      <svg className="w-4 h-4 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-white">99.9% Uptime</div>
                      <div className="text-xs text-gray-400">Service reliability</div>
                    </div>
                  </div>
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