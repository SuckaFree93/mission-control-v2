// Fix admin password in existing database
const bcrypt = require('bcryptjs');
const { open } = require('sqlite');
const sqlite3 = require('sqlite3');
const path = require('path');

async function fixAdminPassword() {
  try {
    console.log('Fixing admin password...');
    
    // Open the database
    const dbPath = path.join(process.cwd(), 'auth.db');
    const db = await open({
      filename: dbPath,
      driver: sqlite3.Database
    });
    
    // Check if admin user exists
    const admin = await db.get(
      'SELECT id, email, password_hash FROM users WHERE email = ?',
      'admin@mission-control.ai'
    );
    
    if (!admin) {
      console.log('❌ Admin user not found in database');
      return;
    }
    
    console.log('Found admin user:', admin.email);
    console.log('Current hash:', admin.password_hash);
    
    // Generate new hash for 'admin123'
    const salt = await bcrypt.genSalt(10);
    const newHash = await bcrypt.hash('admin123', salt);
    
    console.log('New hash:', newHash);
    
    // Update the password hash
    await db.run(
      'UPDATE users SET password_hash = ? WHERE id = ?',
      [newHash, admin.id]
    );
    
    // Verify the update
    const updatedAdmin = await db.get(
      'SELECT email, password_hash FROM users WHERE id = ?',
      admin.id
    );
    
    console.log('\n✅ Password updated successfully!');
    console.log('Updated hash:', updatedAdmin.password_hash);
    
    // Test the new hash
    const isValid = await bcrypt.compare('admin123', updatedAdmin.password_hash);
    console.log('Password verification test:', isValid ? '✅ PASSED' : '❌ FAILED');
    
    await db.close();
    
  } catch (error) {
    console.error('Error:', error);
  }
}

fixAdminPassword();