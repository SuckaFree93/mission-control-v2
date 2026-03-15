// Debug authentication
const bcrypt = require('bcryptjs');

async function debug() {
  console.log('Debugging authentication...\n');
  
  // Test 1: Hash generation
  console.log('Test 1: Hash generation');
  const testPassword = 'admin123';
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(testPassword, salt);
  console.log('Generated hash:', hash);
  console.log('Hash from database.ts:', '$2b$10$LzeLEHkeSzYZJ6PWQRMP1ukz/r9FgM8ZXWZFqPohsA8AF1faRZayW');
  
  // Test 2: Verification
  console.log('\nTest 2: Verification');
  const isValid = await bcrypt.compare(testPassword, hash);
  console.log('Verify generated hash:', isValid);
  
  const isValidDb = await bcrypt.compare(testPassword, '$2b$10$LzeLEHkeSzYZJ6PWQRMP1ukz/r9FgM8ZXWZFqPohsA8AF1faRZayW');
  console.log('Verify database hash:', isValidDb);
  
  // Test 3: Check hash algorithm
  console.log('\nTest 3: Hash algorithm analysis');
  const hashParts = hash.split('$');
  console.log('Algorithm:', hashParts[1]);
  console.log('Cost factor:', hashParts[2]);
  console.log('Salt + hash length:', hashParts[3].length);
  
  const dbHashParts = '$2b$10$LzeLEHkeSzYZJ6PWQRMP1ukz/r9FgM8ZXWZFqPohsA8AF1faRZayW'.split('$');
  console.log('\nDatabase hash algorithm:', dbHashParts[1]);
  console.log('Database cost factor:', dbHashParts[2]);
  console.log('Database salt + hash length:', dbHashParts[3].length);
}

debug().catch(console.error);