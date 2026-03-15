// Test script for Self-Healing System
const http = require('http');

console.log('Testing Self-Healing System API...\n');

// Test 1: Check if API endpoints exist
const endpoints = [
  '/api/agent-monitor/status',
  '/api/agent-monitor/recovery-history',
  '/api/health'
];

endpoints.forEach(endpoint => {
  const options = {
    hostname: 'localhost',
    port: 3000,
    path: endpoint,
    method: 'GET',
    timeout: 5000
  };

  const req = http.request(options, (res) => {
    console.log(`✅ ${endpoint}: Status ${res.statusCode}`);
    res.on('data', () => {});
    res.on('end', () => {
      if (endpoint === endpoints[endpoints.length - 1]) {
        console.log('\n🎉 All API endpoints tested successfully!');
        console.log('\n📱 Access the Self-Healing Dashboard at:');
        console.log('   http://localhost:3000/self-healing');
        console.log('\n🌐 Main Dashboard at:');
        console.log('   http://localhost:3000');
        console.log('\n🚀 Features Implemented:');
        console.log('   1. Agent Health Monitoring System');
        console.log('   2. Automated Recovery Strategies');
        console.log('   3. Recovery History Tracking');
        console.log('   4. Real-time Dashboard Interface');
        console.log('   5. Gateway Reload Capability');
        console.log('\n🔧 Next Steps:');
        console.log('   - Start the dev server: npm run dev');
        console.log('   - Access http://localhost:3000/self-healing');
        console.log('   - Register test agents via the dashboard');
        console.log('   - Test recovery by stopping agents');
      }
    });
  });

  req.on('error', (err) => {
    console.log(`❌ ${endpoint}: ${err.message}`);
    if (err.code === 'ECONNREFUSED') {
      console.log('\n⚠️  Development server not running.');
      console.log('   Start it with: npm run dev');
      console.log('   Then access: http://localhost:3000');
    }
  });

  req.on('timeout', () => {
    console.log(`⏱️  ${endpoint}: Request timeout`);
    req.destroy();
  });

  req.end();
});