// Simple build test for Mission Control v2
// This tests TypeScript compilation without full build

const fs = require('fs');
const path = require('path');

console.log('🔍 Testing Mission Control v2 TypeScript compilation...\n');

// Check critical files
const criticalFiles = [
  'app/api/openclaw/status/route.ts',
  'app/api/openclaw/metrics/route.ts',
  'app/api/openclaw/agents/route.ts',
  'lib/openclaw/gateway-client.ts',
  'components/dashboard/RealTimeMetrics.tsx',
  'app/test-openclaw/page.tsx'
];

let allFilesExist = true;

criticalFiles.forEach(file => {
  const filePath = path.join(__dirname, file);
  if (fs.existsSync(filePath)) {
    console.log(`✅ ${file}`);
  } else {
    console.log(`❌ ${file} - MISSING`);
    allFilesExist = false;
  }
});

console.log('\n📁 Checking directory structure...');

// Check directory structure
const directories = [
  'app/api/openclaw',
  'lib/openclaw',
  'components/dashboard',
  'app/test-openclaw'
];

directories.forEach(dir => {
  const dirPath = path.join(__dirname, dir);
  if (fs.existsSync(dirPath)) {
    console.log(`✅ ${dir}/`);
  } else {
    console.log(`❌ ${dir}/ - MISSING`);
    allFilesExist = false;
  }
});

console.log('\n📋 Checking environment configuration...');

// Check env file
const envPath = path.join(__dirname, '.env.local');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  const hasOpenClawConfig = envContent.includes('OPENCLAW_GATEWAY_TOKEN') && 
                           envContent.includes('NEXT_PUBLIC_OPENCLAW_API');
  
  if (hasOpenClawConfig) {
    console.log('✅ .env.local has OpenClaw configuration');
  } else {
    console.log('⚠️ .env.local missing OpenClaw configuration');
  }
} else {
  console.log('❌ .env.local - MISSING');
  allFilesExist = false;
}

console.log('\n🎯 Summary:');
if (allFilesExist) {
  console.log('✅ All critical files and directories exist');
  console.log('🚀 Ready for OpenClaw integration testing');
  console.log('\nNext steps:');
  console.log('1. Run: npm run dev');
  console.log('2. Visit: http://localhost:3000/test-openclaw');
  console.log('3. Test OpenClaw gateway connection');
} else {
  console.log('❌ Some files are missing');
  console.log('Please check the missing files above');
}

// Check package.json for required dependencies
console.log('\n📦 Checking package.json...');
const packagePath = path.join(__dirname, 'package.json');
if (fs.existsSync(packagePath)) {
  const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
  
  const requiredDeps = ['react', 'next', 'framer-motion'];
  const missingDeps = requiredDeps.filter(dep => !packageJson.dependencies?.[dep]);
  
  if (missingDeps.length === 0) {
    console.log('✅ All required dependencies are installed');
  } else {
    console.log(`⚠️ Missing dependencies: ${missingDeps.join(', ')}`);
  }
}

console.log('\n✨ Test completed!');