// Create admin user with real bcrypt hash
const bcrypt = require('bcryptjs');

async function createAdmin() {
  try {
    // Hash the password 'admin123'
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash('admin123', salt);
    
    console.log('Admin password hash:');
    console.log(passwordHash);
    console.log('\nCopy this hash to the database.ts file');
    
    // Test the hash
    const isValid = await bcrypt.compare('admin123', passwordHash);
    console.log('\nPassword verification test:', isValid ? '✅ PASSED' : '❌ FAILED');
    
  } catch (error) {
    console.error('Error:', error);
  }
}

createAdmin();