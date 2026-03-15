// Permanent fix for admin password hash
// This script updates the existing admin user in the SQLite database file

import { open } from 'sqlite';
import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function fixAdminPassword() {
  console.log('🔧 Permanent admin password fix...');
  
  const dbPath = path.join(__dirname, 'auth.db');
  console.log('Database path:', dbPath);
  
  try {
    // Open the database
    const db = await open({
      filename: dbPath,
      driver: sqlite3.Database
    });
    
    // Check if users table exists
    const tableExists = await db.get(
      "SELECT name FROM sqlite_master WHERE type='table' AND name='users'"
    );
    
    if (!tableExists) {
      console.log('❌ Users table does not exist yet');
      return;
    }
    
    // Check if admin user exists
    const adminUser = await db.get(
      "SELECT id, email, password_hash FROM users WHERE email = 'admin@mission-control.ai'"
    );
    
    if (!adminUser) {
      console.log('❌ Admin user not found in database');
      return;
    }
    
    console.log('Found admin user:', adminUser.email);
    console.log('Current hash:', adminUser.password_hash);
    
    // The correct bcrypt hash for 'admin123'
    const correctHash = '$2b$10$qtLxWqiMqBnCLSxeWjOAt.JCR0wnkrDjhAQ9srLj/BihIBurxfYT2';
    
    if (adminUser.password_hash === correctHash) {
      console.log('✅ Admin password is already correct!');
    } else {
      // Update the password hash
      await db.run(
        "UPDATE users SET password_hash = ? WHERE email = 'admin@mission-control.ai'",
        correctHash
      );
      
      console.log('✅ Admin password updated successfully!');
      console.log('New hash:', correctHash);
      
      // Verify the update
      const updatedUser = await db.get(
        "SELECT password_hash FROM users WHERE email = 'admin@mission-control.ai'"
      );
      
      console.log('Verification - Updated hash:', updatedUser.password_hash);
      console.log('Match:', updatedUser.password_hash === correctHash ? '✅ YES' : '❌ NO');
    }
    
    await db.close();
    console.log('✅ Permanent fix completed!');
    
  } catch (error) {
    console.error('❌ Error fixing admin password:', error);
  }
}

// Run the fix
fixAdminPassword();