// Simple test to verify authentication API works
const http = require('http');

const testCredentials = {
  email: 'admin@mission-control.ai',
  password: 'admin123'
};

const testData = JSON.stringify(testCredentials);

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/api/auth/login',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': testData.length
  }
};

console.log('Testing authentication API...');
console.log('Server: http://localhost:3000');
console.log('Endpoint: /api/auth/login');
console.log('Credentials:', testCredentials);

const req = http.request(options, (res) => {
  console.log(`Status Code: ${res.statusCode}`);
  
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    try {
      const response = JSON.parse(data);
      console.log('Response:', JSON.stringify(response, null, 2));
      
      if (response.success) {
        console.log('✅ Authentication test PASSED!');
        console.log('User:', response.data.user.username);
        console.log('Role:', response.data.user.role);
        console.log('Token received:', response.data.tokens.accessToken ? 'Yes' : 'No');
      } else {
        console.log('❌ Authentication test FAILED!');
        console.log('Error:', response.error);
      }
    } catch (error) {
      console.log('❌ Failed to parse response:', error.message);
      console.log('Raw response:', data);
    }
  });
});

req.on('error', (error) => {
  console.log('❌ Connection error:', error.message);
  console.log('Make sure the server is running: npm run dev');
});

req.write(testData);
req.end();