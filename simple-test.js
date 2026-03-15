// Simple test to check if server is responding
const http = require('http');

console.log('Testing server connectivity...');

const req = http.request({
  hostname: 'localhost',
  port: 3000,
  path: '/api/health',
  method: 'GET'
}, (res) => {
  console.log(`Health check status: ${res.statusCode}`);
  
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log('Health check response:', data);
    
    // Now test login
    console.log('\nTesting login...');
    const loginData = JSON.stringify({
      email: 'admin@mission-control.ai',
      password: 'admin123'
    });
    
    const loginReq = http.request({
      hostname: 'localhost',
      port: 3000,
      path: '/api/auth/login',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': loginData.length
      }
    }, (loginRes) => {
      console.log(`Login status: ${loginRes.statusCode}`);
      
      let loginData = '';
      loginRes.on('data', (chunk) => {
        loginData += chunk;
      });
      
      loginRes.on('end', () => {
        console.log('Login response:', loginData);
        
        if (loginRes.statusCode === 200) {
          console.log('✅ Authentication is WORKING!');
        } else {
          console.log('❌ Authentication is NOT working');
          console.log('Try visiting: http://localhost:3000/login');
          console.log('Use demo admin credentials:');
          console.log('Email: admin@mission-control.ai');
          console.log('Password: admin123');
        }
      });
    });
    
    loginReq.on('error', (error) => {
      console.log('Login request error:', error.message);
    });
    
    loginReq.write(loginData);
    loginReq.end();
  });
});

req.on('error', (error) => {
  console.log('Health check error:', error.message);
  console.log('Server might not be running. Start with: npm run dev');
});

req.end();