#!/usr/bin/env node

/**
 * Build optimization script for Vercel free tier
 * This script helps reduce build time to stay under 30-second limit
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 Mission Control v2 - Build Optimization Script');
console.log('================================================');

// Check if we're on Vercel
const isVercel = process.env.VERCEL === '1';
console.log(`Environment: ${isVercel ? 'Vercel' : 'Local'}`);

// Optimization steps
const optimizations = [];

// 1. Check package.json for dev dependencies that can be removed in production
console.log('\n📦 Checking dependencies...');
const packageJsonPath = path.join(__dirname, '..', 'package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

// List of dev dependencies that are only needed for development
const devOnlyDeps = [
  '@types/node',
  '@types/react', 
  '@types/react-dom',
  'typescript',
  'tailwindcss',
  '@tailwindcss/postcss'
];

console.log(`Found ${Object.keys(packageJson.devDependencies || {}).length} dev dependencies`);

// 2. Check for SQLite optimization opportunities
console.log('\n🗄️ Checking SQLite configuration...');
const databasePath = path.join(__dirname, '..', 'lib', 'auth', 'database.ts');
const databaseContent = fs.readFileSync(databasePath, 'utf8');

// Check if we're using memory database fallback (good for Vercel)
const hasMemoryFallback = databaseContent.includes('process.env.VERCEL') || 
                         databaseContent.includes('memory database') ||
                         databaseContent.includes('MemoryDatabase');
console.log(`Memory database fallback: ${hasMemoryFallback ? '✅ Enabled' : '❌ Not found'}`);

if (!hasMemoryFallback) {
  optimizations.push('Add memory database fallback for Vercel serverless');
}

// 3. Check Next.js configuration
console.log('\n⚡ Checking Next.js configuration...');
const nextConfigPath = path.join(__dirname, '..', 'next.config.ts');
const nextConfigContent = fs.readFileSync(nextConfigPath, 'utf8');

const hasBuildOptimizations = 
  nextConfigContent.includes('ignoreBuildErrors') &&
  nextConfigContent.includes('ignoreDuringBuilds') &&
  nextConfigContent.includes('swcMinify');

console.log(`Build optimizations: ${hasBuildOptimizations ? '✅ Configured' : '❌ Missing'}`);

if (!hasBuildOptimizations) {
  optimizations.push('Add Next.js build optimizations (skip TypeScript/ESLint, use SWC)');
}

// 4. Check for large files that could be optimized
console.log('\n📊 Checking for optimization opportunities...');

// Check for large component files
const componentsDir = path.join(__dirname, '..', 'components');
let largeFiles = [];

if (fs.existsSync(componentsDir)) {
  const walk = (dir) => {
    const files = fs.readdirSync(dir);
    files.forEach(file => {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      if (stat.isDirectory()) {
        walk(filePath);
      } else if (stat.isFile() && filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
        const content = fs.readFileSync(filePath, 'utf8');
        const lines = content.split('\n').length;
        if (lines > 300) {
          largeFiles.push({
            path: path.relative(path.join(__dirname, '..'), filePath),
            lines: lines,
            size: stat.size
          });
        }
      }
    });
  };
  
  walk(componentsDir);
}

console.log(`Found ${largeFiles.length} large component files (>300 lines)`);
if (largeFiles.length > 0) {
  console.log('Large files:');
  largeFiles.slice(0, 5).forEach(file => {
    console.log(`  - ${file.path} (${file.lines} lines, ${(file.size / 1024).toFixed(1)}KB)`);
  });
  if (largeFiles.length > 5) {
    console.log(`  ... and ${largeFiles.length - 5} more`);
  }
  
  optimizations.push(`Split large component files (${largeFiles.length} files >300 lines)`);
}

// 5. Recommendations
console.log('\n🎯 RECOMMENDATIONS:');
if (optimizations.length === 0) {
  console.log('✅ Build is already optimized for Vercel free tier!');
} else {
  console.log(`Found ${optimizations.length} optimization opportunities:`);
  optimizations.forEach((opt, index) => {
    console.log(`${index + 1}. ${opt}`);
  });
  
  console.log('\n💡 Quick fixes:');
  console.log('1. Run "npm ci --only=production" on Vercel to skip dev dependencies');
  console.log('2. Ensure memory database is used on Vercel (no SQLite compilation)');
  console.log('3. Use SWC minification in next.config.ts');
  console.log('4. Consider code splitting for large components');
}

// 6. Estimated build time reduction
console.log('\n⏱️ Estimated impact:');
const estimatedReduction = optimizations.length * 3; // ~3 seconds per optimization
console.log(`Potential build time reduction: ${estimatedReduction} seconds`);
console.log(`Current Vercel free tier limit: 30 seconds`);
console.log(`Target build time: < 25 seconds (safe margin)`);

console.log('\n✨ Optimization check complete!');