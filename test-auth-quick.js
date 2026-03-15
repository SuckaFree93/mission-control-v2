// Quick authentication test
import { AuthService } from './lib/auth/jwt-service.js';

async function testAuth() {
  console.log('🔧 Testing authentication service...');
  
  try {
    const authService = new AuthService();
    
    // Test login with admin credentials
    const credentials = {
      email: 'admin@mission-control.ai',
      password: 'admin123'
    };
    
    console.log('Testing login with:', credentials.email);
    
    const result = await authService.login(credentials);
    
    console.log('✅ Login successful!');
    console.log('User:', result.user.email);
    console.log('Role:', result.user.role);
    console.log('Access token length:', result.tokens.accessToken.length);
    console.log('Refresh token length:', result.tokens.refreshToken.length);
    
    // Test token validation
    const validated = await authService.validateToken(result.tokens.accessToken);
    console.log('✅ Token validation successful!');
    console.log('Validated user:', validated.email);
    
    return true;
    
  } catch (error) {
    console.error('❌ Authentication test failed:', error.message);
    console.error('Error details:', error);
    return false;
  }
}

// Run test
testAuth().then(success => {
  if (success) {
    console.log('\n🎉 Authentication system is WORKING!');
    process.exit(0);
  } else {
    console.log('\n❌ Authentication system has issues');
    process.exit(1);
  }
});