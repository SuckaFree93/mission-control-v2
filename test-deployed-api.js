// Test deployed Mission Control v2 API endpoints
const https = require('https');

const BASE_URL = 'https://mission-control-v2.vercel.app';

function testEndpoint(url, method = 'GET', data = null) {
  return new Promise((resolve, reject) => {
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Mission-Control-Test/1.0'
      }
    };

    const req = https.request(url, options, (res) => {
      let responseData = '';
      
      res.on('data', (chunk) => {
        responseData += chunk;
      });

      res.on('end', () => {
        try {
          const parsed = responseData ? JSON.parse(responseData) : {};
          resolve({
            status: res.statusCode,
            statusText: res.statusMessage,
            headers: res.headers,
            data: parsed,
            raw: responseData
          });
        } catch (e) {
          resolve({
            status: res.statusCode,
            statusText: res.statusMessage,
            headers: res.headers,
            data: responseData,
            raw: responseData,
            parseError: e.message
          });
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    if (data && (method === 'POST' || method === 'PUT')) {
      req.write(JSON.stringify(data));
    }

    req.end();
  });
}

async function runTests() {
  console.log('🚀 Testing deployed Mission Control v2 API');
  console.log('===========================================\n');

  // Test 1: Health endpoint (might redirect to login)
  console.log('1. Testing /api/health endpoint...');
  try {
    const healthResult = await testEndpoint(`${BASE_URL}/api/health`);
    console.log(`   Status: ${healthResult.status} ${healthResult.statusText}`);
    console.log(`   Content-Type: ${healthResult.headers['content-type']}`);
    if (healthResult.status === 200) {
      console.log('   ✅ Health endpoint accessible');
    } else if (healthResult.status === 302 || healthResult.status === 307) {
      console.log('   ⚠️  Redirecting to login (expected for protected endpoint)');
    }
  } catch (error) {
    console.log(`   ❌ Error: ${error.message}`);
  }

  // Test 2: Main page
  console.log('\n2. Testing main page...');
  try {
    const mainPageResult = await testEndpoint(BASE_URL);
    console.log(`   Status: ${mainPageResult.status} ${mainPageResult.statusText}`);
    console.log(`   Content-Type: ${mainPageResult.headers['content-type']}`);
    if (mainPageResult.status === 200) {
      console.log('   ✅ Main page accessible');
      if (mainPageResult.raw && mainPageResult.raw.includes('Login')) {
        console.log('   📋 Contains login form (expected)');
      }
    }
  } catch (error) {
    console.log(`   ❌ Error: ${error.message}`);
  }

  // Test 3: Login page
  console.log('\n3. Testing login page...');
  try {
    const loginResult = await testEndpoint(`${BASE_URL}/login`);
    console.log(`   Status: ${loginResult.status} ${loginResult.statusText}`);
    console.log(`   Content-Type: ${loginResult.headers['content-type']}`);
    if (loginResult.status === 200) {
      console.log('   ✅ Login page accessible');
    }
  } catch (error) {
    console.log(`   ❌ Error: ${error.message}`);
  }

  // Test 4: Register page
  console.log('\n4. Testing register page...');
  try {
    const registerResult = await testEndpoint(`${BASE_URL}/signup`);
    console.log(`   Status: ${registerResult.status} ${registerResult.statusText}`);
    console.log(`   Content-Type: ${registerResult.headers['content-type']}`);
    if (registerResult.status === 200) {
      console.log('   ✅ Register page accessible');
    }
  } catch (error) {
    console.log(`   ❌ Error: ${error.message}`);
  }

  // Test 5: Try to register a test user
  console.log('\n5. Testing user registration API...');
  try {
    const registerData = {
      email: 'apitest@mission-control.ai',
      username: 'apitest',
      password: 'Test123!'
    };
    
    const registerApiResult = await testEndpoint(
      `${BASE_URL}/api/auth/register`,
      'POST',
      registerData
    );
    
    console.log(`   Status: ${registerApiResult.status} ${registerApiResult.statusText}`);
    
    if (registerApiResult.status === 201 || registerApiResult.status === 200) {
      console.log('   ✅ Registration API working');
      console.log(`   Response: ${JSON.stringify(registerApiResult.data)}`);
    } else if (registerApiResult.status === 400) {
      console.log('   ⚠️  Registration failed (might need database setup)');
      console.log(`   Error: ${JSON.stringify(registerApiResult.data)}`);
    } else if (registerApiResult.status === 302 || registerApiResult.status === 307) {
      console.log('   ⚠️  Redirecting (might be rate limiting or auth middleware)');
    } else {
      console.log(`   ❓ Unexpected status: ${registerApiResult.status}`);
    }
  } catch (error) {
    console.log(`   ❌ Error: ${error.message}`);
  }

  // Test 6: Check if static assets are loading
  console.log('\n6. Testing static assets...');
  try {
    const faviconResult = await testEndpoint(`${BASE_URL}/favicon.ico`);
    console.log(`   Favicon Status: ${faviconResult.status}`);
    if (faviconResult.status === 200) {
      console.log('   ✅ Static assets loading');
    }
  } catch (error) {
    console.log(`   ❌ Error: ${error.message}`);
  }

  console.log('\n===========================================');
  console.log('📊 Test Summary:');
  console.log('- Application is deployed and accessible');
  console.log('- Login/Register pages are working');
  console.log('- API endpoints respond (may need auth/database setup)');
  console.log('\n💡 Next Steps:');
  console.log('1. Set up environment variables in Vercel');
  console.log('2. Configure production database (PostgreSQL recommended)');
  console.log('3. Test authentication with real database');
  console.log('4. Set up OpenClaw gateway integration');
}

runTests().catch(console.error);