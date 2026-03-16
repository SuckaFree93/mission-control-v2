// Test script to check deployed version
const https = require('https');

const options = {
  hostname: 'mission-control-v2.vercel.app',
  port: 443,
  path: '/',
  method: 'GET',
  headers: {
    'User-Agent': 'Test-Script'
  }
};

const req = https.request(options, (res) => {
  console.log(`Status: ${res.statusCode}`);
  console.log(`Headers: ${JSON.stringify(res.headers, null, 2)}`);
  
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    // Look for version indicators in HTML
    if (data.includes('Mission Control v2')) {
      console.log('✓ Site contains "Mission Control v2"');
    } else {
      console.log('✗ Site does NOT contain "Mission Control v2"');
    }
    
    if (data.includes('2.1.0')) {
      console.log('✓ Site contains version "2.1.0"');
    } else {
      console.log('✗ Site does NOT contain version "2.1.0"');
    }
    
    // Check for CyberpunkDashboard component
    if (data.includes('CyberpunkDashboard')) {
      console.log('✓ CyberpunkDashboard component detected');
    } else {
      console.log('✗ CyberpunkDashboard component NOT detected');
    }
  });
});

req.on('error', (error) => {
  console.error(`Error: ${error.message}`);
});

req.end();