// Mobile Access Page
'use client';

import { useState, useEffect } from 'react';
import { Smartphone, Wifi, Globe, QrCode, Copy, Check } from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';

export default function MobileAccessPage() {
  const [ipAddress, setIpAddress] = useState<string>('192.168.0.27:3000');
  const [copied, setCopied] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState('');

  useEffect(() => {
    // Get the current hostname and port
    const host = window.location.host;
    setIpAddress(host);
    setQrCodeUrl(`http://${host}/self-healing`);
  }, []);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const accessUrls = [
    {
      title: 'Self-Healing Dashboard',
      url: `http://${ipAddress}/self-healing`,
      description: 'Agent monitoring and recovery system',
      icon: <Globe className="w-6 h-6 text-blue-500" />
    },
    {
      title: 'Main Dashboard',
      url: `http://${ipAddress}`,
      description: 'Mission Control v2 main interface',
      icon: <Globe className="w-6 h-6 text-purple-500" />
    },
    {
      title: 'Health API',
      url: `http://${ipAddress}/api/health`,
      description: 'System health check endpoint',
      icon: <Wifi className="w-6 h-6 text-green-500" />
    },
    {
      title: 'Agent Monitor API',
      url: `http://${ipAddress}/api/agent-monitor/status`,
      description: 'Agent monitoring status endpoint',
      icon: <Smartphone className="w-6 h-6 text-yellow-500" />
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-500/20 mb-4">
            <Smartphone className="w-8 h-8 text-blue-500" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Mobile Access</h1>
          <p className="text-gray-400">
            Access Mission Control v2 from any device on your network
          </p>
        </div>

        {/* Network Info */}
        <GlassCard className="p-6 mb-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h2 className="text-xl font-bold text-white mb-2">Network Address</h2>
              <p className="text-gray-400 mb-4">
                Use this address on any device connected to the same WiFi network
              </p>
              <div className="flex items-center gap-4">
                <code className="bg-gray-800 px-4 py-3 rounded-lg text-lg text-white font-mono">
                  http://{ipAddress}
                </code>
                <button
                  onClick={() => copyToClipboard(`http://${ipAddress}`)}
                  className="px-4 py-3 rounded-lg bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 transition-colors flex items-center gap-2"
                >
                  {copied ? (
                    <>
                      <Check className="w-5 h-5" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-5 h-5" />
                      Copy
                    </>
                  )}
                </button>
              </div>
            </div>
            <div className="text-center">
              <div className="w-48 h-48 bg-white p-4 rounded-lg">
                {/* QR Code Placeholder */}
                <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded">
                  <div className="text-center">
                    <QrCode className="w-16 h-16 text-gray-600 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">Scan to access</p>
                    <p className="text-xs text-gray-500 mt-1">http://{ipAddress}</p>
                  </div>
                </div>
              </div>
              <p className="text-gray-500 text-sm mt-2">Scan QR code with mobile device</p>
            </div>
          </div>
        </GlassCard>

        {/* Access Points */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {accessUrls.map((item, index) => (
            <GlassCard key={index} className="p-6">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-gray-800/50">
                  {item.icon}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white mb-1">{item.title}</h3>
                  <p className="text-gray-400 text-sm mb-3">{item.description}</p>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 bg-gray-800 px-3 py-2 rounded text-sm text-gray-300 truncate">
                      {item.url}
                    </code>
                    <button
                      onClick={() => copyToClipboard(item.url)}
                      className="px-3 py-2 rounded bg-gray-700 text-gray-300 hover:bg-gray-600 text-sm"
                    >
                      Copy
                    </button>
                  </div>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>

        {/* Instructions */}
        <GlassCard className="p-6">
          <h2 className="text-xl font-bold text-white mb-4">How to Access</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
                  <span className="text-blue-400 font-bold">1</span>
                </div>
                <h3 className="font-semibold text-white">Connect to Same WiFi</h3>
              </div>
              <p className="text-gray-400 text-sm">
                Ensure your mobile device is connected to the same WiFi network as this computer.
              </p>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
                  <span className="text-green-400 font-bold">2</span>
                </div>
                <h3 className="font-semibold text-white">Enter Network Address</h3>
              </div>
              <p className="text-gray-400 text-sm">
                Open your mobile browser and enter: <code className="text-gray-300">http://{ipAddress}</code>
              </p>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center">
                  <span className="text-purple-400 font-bold">3</span>
                </div>
                <h3 className="font-semibold text-white">Access Dashboard</h3>
              </div>
              <p className="text-gray-400 text-sm">
                Navigate to the Self-Healing Dashboard or any other section from the main menu.
              </p>
            </div>
          </div>
        </GlassCard>

        {/* Troubleshooting */}
        <GlassCard className="p-6 mt-8">
          <h2 className="text-xl font-bold text-white mb-4">Troubleshooting</h2>
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-gray-800/30">
              <h3 className="font-semibold text-white mb-2">Can't connect?</h3>
              <ul className="text-gray-400 text-sm space-y-2">
                <li>• Check that both devices are on the same WiFi network</li>
                <li>• Verify the development server is running (port 3000)</li>
                <li>• Try disabling mobile data on your phone</li>
                <li>• Check Windows Firewall allows port 3000</li>
              </ul>
            </div>
            
            <div className="p-4 rounded-lg bg-gray-800/30">
              <h3 className="font-semibold text-white mb-2">Need public access?</h3>
              <p className="text-gray-400 text-sm">
                For access from outside your network, use the deployed version at:{' '}
                <a 
                  href="https://mission-control-v2.vercel.app" 
                  target="_blank"
                  className="text-blue-400 hover:text-blue-300"
                >
                  https://mission-control-v2.vercel.app
                </a>
              </p>
            </div>
          </div>
        </GlassCard>

        {/* Quick Links */}
        <div className="mt-8 text-center">
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href={`http://${ipAddress}/self-healing`}
              className="px-6 py-3 rounded-lg bg-blue-500/20 text-blue-400 border border-blue-500/30 hover:bg-blue-500/30 transition-colors"
            >
              Open Self-Healing Dashboard
            </a>
            <a
              href={`http://${ipAddress}`}
              className="px-6 py-3 rounded-lg bg-gray-800 text-gray-300 border border-gray-700 hover:bg-gray-700 transition-colors"
            >
              Open Main Dashboard
            </a>
            <a
              href="https://mission-control-v2.vercel.app"
              target="_blank"
              className="px-6 py-3 rounded-lg bg-green-500/20 text-green-400 border border-green-500/30 hover:bg-green-500/30 transition-colors"
            >
              Open Public Version
            </a>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center text-gray-500 text-sm">
          <p>Mission Control v2 • Mobile Access Portal</p>
          <p className="mt-1">Server running at: http://{ipAddress}</p>
          <p className="mt-4 text-gray-600">
            For public access from any network, use the Vercel deployment.
          </p>
        </div>
      </div>
    </div>
  );
}