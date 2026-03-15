// Simple authentication test
console.log('🔧 Testing authentication system setup...');

// Check if we can start the server
const { spawn } = require('child_process');

console.log('🚀 Starting server in test mode...');

const server = spawn('npx', ['next', 'dev', '--turbopack=false'], {
  cwd: __dirname,
  shell: true,
  stdio: ['pipe', 'pipe', 'pipe']
});

let serverOutput = '';
let serverReady = false;

server.stdout.on('data', (data) => {
  const text = data.toString();
  serverOutput += text;
  console.log('Server:', text.trim());
  
  if (text.includes('Ready in') || text.includes('started server')) {
    serverReady = true;
    console.log('✅ Server is ready!');
    
    // Give server a moment to initialize
    setTimeout(() => {
      console.log('\n🎯 Testing authentication endpoint...');
      testAuthEndpoint();
    }, 2000);
  }
  
  if (text.includes('Initializing Authentication Database')) {
    console.log('🔧 Database initialization detected...');
  }
  
  if (text.includes('Admin user already exists')) {
    console.log('✅ Admin user exists in database');
  }
  
  if (text.includes('Login error')) {
    console.log('❌ Login error detected');
  }
});

server.stderr.on('data', (data) => {
  const text = data.toString();
  console.error('Server Error:', text.trim());
});

function testAuthEndpoint() {
  const http = require('http');
  
  const postData = JSON.stringify({
    email: 'admin@mission-control.ai',
    password: 'admin123'
  });
  
  const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/api/auth/login',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData)
    }
  };
  
  const req = http.request(options, (res) => {
    console.log(`\n🔍 Authentication Test Result:`);
    console.log(`Status Code: ${res.statusCode}`);
    console.log(`Status Message: ${res.statusMessage}`);
    
    let responseData = '';
    res.on('data', (chunk) => {
      responseData += chunk;
    });
    
    res.on('end', () => {
      try {
        const parsed = JSON.parse(responseData);
        console.log('Response:', JSON.stringify(parsed, null, 2));
        
        if (res.statusCode === 200) {
          console.log('\n🎉 ✅ AUTHENTICATION IS WORKING!');
          console.log('You can now:');
          console.log('1. Visit http://localhost:3000/login');
          console.log('2. Use credentials: admin@mission-control.ai / admin123');
          console.log('3. Access the dashboard at http://localhost:3000/dashboard');
        } else {
          console.log('\n❌ Authentication failed');
          console.log('Error:', parsed.error || 'Unknown error');
        }
      } catch (e) {
        console.log('Raw response:', responseData);
      }
      
      // Stop the server
      server.kill();
      process.exit(res.statusCode === 200 ? 0 : 1);
    });
  });
  
  req.on('error', (e) => {
    console.error(`\n❌ Request error: ${e.message}`);
    server.kill();
    process.exit(1);
  });
  
  req.write(postData);
  req.end();
}

// Timeout after 30 seconds
setTimeout(() => {
  console.log('\n⏰ Test timeout after 30 seconds');
  server.kill();
  process.exit(1);
}, 30000);