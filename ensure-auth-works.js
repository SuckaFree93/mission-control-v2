// Script to ensure authentication works
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🔧 Ensuring authentication system works...');

// Check if auth.db exists
const authDbPath = path.join(__dirname, 'auth.db');
if (fs.existsSync(authDbPath)) {
  console.log('📁 auth.db exists, checking contents...');
  
  // Try to query the database
  try {
    // Use sqlite3 command line to check the admin user
    const output = execSync(`sqlite3 "${authDbPath}" "SELECT email, password_hash FROM users WHERE email='admin@mission-control.ai';"`, {
      encoding: 'utf-8'
    });
    
    console.log('Database query result:', output);
    
    if (output.trim()) {
      const [email, passwordHash] = output.trim().split('|');
      console.log(`Found admin user: ${email}`);
      console.log(`Current password hash: ${passwordHash}`);
      
      // The correct bcrypt hash for 'admin123'
      const correctHash = '$2b$10$qtLxWqiMqBnCLSxeWjOAt.JCR0wnkrDjhAQ9srLj/BihIBurxfYT2';
      
      if (passwordHash === correctHash) {
        console.log('✅ Admin password hash is CORRECT!');
      } else {
        console.log('❌ Admin password hash is INCORRECT!');
        console.log('Updating to correct hash...');
        
        execSync(`sqlite3 "${authDbPath}" "UPDATE users SET password_hash='${correctHash}' WHERE email='admin@mission-control.ai';"`);
        console.log('✅ Password hash updated!');
      }
    } else {
      console.log('❌ Admin user not found in database');
    }
    
  } catch (error) {
    console.log('❌ Error querying database:', error.message);
  }
} else {
  console.log('📁 auth.db does not exist yet');
  console.log('It will be created when the server starts');
}

console.log('\n🎯 Testing authentication with curl...');
console.log('Run this command to test:');
console.log('curl -X POST http://localhost:3000/api/auth/login \\');
console.log('  -H "Content-Type: application/json" \\');
console.log('  -d \'{"email":"admin@mission-control.ai","password":"admin123"}\'');

console.log('\n🎯 Or use this PowerShell command:');
console.log('$body = @{email="admin@mission-control.ai";password="admin123"} | ConvertTo-Json');
console.log('Invoke-WebRequest -Uri "http://localhost:3000/api/auth/login" -Method POST -Body $body -ContentType "application/json"');

console.log('\n✅ Authentication system should now work!');
console.log('Start the server with: npm run dev');