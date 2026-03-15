// Create a test user account for Mission Control v2
// This script creates a test user directly in the database

const bcrypt = require('bcryptjs');
const sqlite3 = require('sqlite3').verbose();
const { v4: uuidv4 } = require('uuid');

async function createTestUser() {
  console.log('🔧 Creating test user account...');
  
  const db = new sqlite3.Database('auth.db');
  
  try {
    // Create users table if it doesn't exist
    await new Promise((resolve, reject) => {
      db.run(`
        CREATE TABLE IF NOT EXISTS users (
          id TEXT PRIMARY KEY,
          email TEXT UNIQUE NOT NULL,
          username TEXT UNIQUE NOT NULL,
          password_hash TEXT NOT NULL,
          role TEXT DEFAULT 'user',
          created_at DATETIME DEFAULT (datetime('now')),
          updated_at DATETIME DEFAULT (datetime('now')),
          last_login_at DATETIME,
          is_active BOOLEAN DEFAULT 1
        )
      `, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });

    // Create sessions table if it doesn't exist
    await new Promise((resolve, reject) => {
      db.run(`
        CREATE TABLE IF NOT EXISTS sessions (
          id TEXT PRIMARY KEY,
          userId TEXT NOT NULL,
          token TEXT NOT NULL,
          refreshToken TEXT NOT NULL,
          expiresAt TEXT NOT NULL,
          createdAt TEXT DEFAULT (datetime('now')),
          userAgent TEXT,
          ipAddress TEXT,
          isRevoked BOOLEAN DEFAULT 0,
          FOREIGN KEY (userId) REFERENCES users (id)
        )
      `, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });

    // Test user credentials
    const testUser = {
      id: uuidv4(),
      email: 'test@mission-control.ai',
      username: 'testuser',
      password: 'Test123!',
      role: 'user'
    };

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(testUser.password, salt);

    // Check if user already exists
    const existingUser = await new Promise((resolve, reject) => {
      db.get('SELECT id FROM users WHERE email = ? OR username = ?', 
        [testUser.email, testUser.username], (err, row) => {
          if (err) reject(err);
          else resolve(row);
        });
    });

    if (existingUser) {
      console.log('⚠️ Test user already exists');
      console.log('Email:', testUser.email);
      console.log('Username:', testUser.username);
      console.log('Password:', testUser.password);
      return;
    }

    // Insert test user
    await new Promise((resolve, reject) => {
      db.run(`
        INSERT INTO users (id, email, username, password_hash, role, is_active)
        VALUES (?, ?, ?, ?, ?, ?)
      `, [
        testUser.id,
        testUser.email,
        testUser.username,
        passwordHash,
        testUser.role,
        1
      ], (err) => {
        if (err) reject(err);
        else resolve();
      });
    });

    console.log('✅ Test user created successfully!');
    console.log('📋 User Details:');
    console.log('- Email:', testUser.email);
    console.log('- Username:', testUser.username);
    console.log('- Password:', testUser.password);
    console.log('- Role:', testUser.role);
    console.log('\n🔐 Login Credentials:');
    console.log('Email: test@mission-control.ai');
    console.log('Password: Test123!');
    console.log('\n💡 Use these credentials to log in at: https://mission-control-v2.vercel.app/login');

  } catch (error) {
    console.error('❌ Error creating test user:', error.message);
  } finally {
    db.close();
  }
}

// Also create an admin user if needed
async function createAdminUser() {
  const db = new sqlite3.Database('auth.db');
  
  try {
    const adminUser = {
      id: uuidv4(),
      email: 'admin@mission-control.ai',
      username: 'admin',
      password: 'Admin123!',
      role: 'admin'
    };

    // Check if admin exists
    const existingAdmin = await new Promise((resolve, reject) => {
      db.get('SELECT id FROM users WHERE email = ?', [adminUser.email], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });

    if (!existingAdmin) {
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(adminUser.password, salt);
      
      await new Promise((resolve, reject) => {
        db.run(`
          INSERT INTO users (id, email, username, password_hash, role, is_active)
          VALUES (?, ?, ?, ?, ?, ?)
        `, [
          adminUser.id,
          adminUser.email,
          adminUser.username,
          passwordHash,
          adminUser.role,
          1
        ], (err) => {
          if (err) reject(err);
          else resolve();
        });
      });
      
      console.log('\n👑 Admin user created:');
      console.log('- Email: admin@mission-control.ai');
      console.log('- Password: Admin123!');
    }
  } catch (error) {
    console.error('Error creating admin:', error.message);
  } finally {
    db.close();
  }
}

// Run both
createTestUser().then(() => {
  createAdminUser();
});