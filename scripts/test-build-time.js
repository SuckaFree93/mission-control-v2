#!/usr/bin/env node

/**
 * Test build time script
 * Measures how long the Next.js build takes locally
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('⏱️ Testing Next.js build time...');
console.log('===============================');

// Clean any previous build
console.log('🧹 Cleaning previous build...');
try {
  if (fs.existsSync(path.join(__dirname, '..', '.next'))) {
    fs.rmSync(path.join(__dirname, '..', '.next'), { recursive: true, force: true });
    console.log('✅ Removed .next directory');
  }
} catch (error) {
  console.log('⚠️ Could not clean .next directory:', error.message);
}

// Start timer
const startTime = Date.now();

try {
  console.log('🚀 Starting Next.js build...');
  
  // Run the build with production settings
  const buildOutput = execSync('npm run build', {
    cwd: path.join(__dirname, '..'),
    stdio: 'pipe',
    encoding: 'utf8',
    env: {
      ...process.env,
      NODE_ENV: 'production',
      // Simulate Vercel environment
      VERCEL: '1',
      // Use memory database to avoid SQLite compilation
      USE_MEMORY_DB: 'true'
    }
  });
  
  const endTime = Date.now();
  const buildTimeSeconds = (endTime - startTime) / 1000;
  
  console.log(`\n✅ Build completed in ${buildTimeSeconds.toFixed(1)} seconds`);
  
  // Check if build time is under Vercel free tier limit
  const vercelLimit = 30; // seconds
  const safeMargin = 5; // seconds
  
  console.log('\n📊 Build Time Analysis:');
  console.log(`   Actual build time: ${buildTimeSeconds.toFixed(1)}s`);
  console.log(`   Vercel free tier limit: ${vercelLimit}s`);
  console.log(`   Safe margin target: < ${vercelLimit - safeMargin}s`);
  
  if (buildTimeSeconds < vercelLimit - safeMargin) {
    console.log('🎉 SUCCESS: Build time is within Vercel free tier limits!');
    console.log(`   You have ${(vercelLimit - buildTimeSeconds).toFixed(1)}s of buffer`);
  } else if (buildTimeSeconds < vercelLimit) {
    console.log('⚠️ WARNING: Build time is close to Vercel limit');
    console.log(`   Only ${(vercelLimit - buildTimeSeconds).toFixed(1)}s of buffer remaining`);
    console.log('   Consider additional optimizations');
  } else {
    console.log('❌ CRITICAL: Build time exceeds Vercel free tier limit');
    console.log(`   Exceeds by ${(buildTimeSeconds - vercelLimit).toFixed(1)}s`);
    console.log('   Immediate optimizations required');
  }
  
  // Extract build stats from output
  const statsMatch = buildOutput.match(/First Load JS shared by all[^]+?(\d+\.?\d*)\s*kB/);
  if (statsMatch) {
    console.log(`\n📦 Bundle size: ${statsMatch[1]} kB (first load JS)`);
  }
  
  // Check for warnings
  const warningCount = (buildOutput.match(/⚠️/g) || []).length;
  if (warningCount > 0) {
    console.log(`\n⚠️ Found ${warningCount} warnings during build`);
  }
  
  // Check for errors
  const errorCount = (buildOutput.match(/✗|error/gi) || []).length;
  if (errorCount > 0) {
    console.log(`\n❌ Found ${errorCount} errors during build`);
  }
  
} catch (error) {
  const endTime = Date.now();
  const buildTimeSeconds = (endTime - startTime) / 1000;
  
  console.log(`\n❌ Build failed after ${buildTimeSeconds.toFixed(1)} seconds`);
  console.log('Error:', error.message);
  
  if (error.stdout) {
    console.log('\nBuild output:');
    console.log(error.stdout.toString().slice(-1000)); // Last 1000 chars
  }
}

console.log('\n✨ Build test complete!');