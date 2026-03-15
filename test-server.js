// Simple test to check if server can start
const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Starting Mission Control v2 server test...');

const serverProcess = spawn('npm', ['run', 'dev'], {
  cwd: __dirname,
  shell: true,
  env: { ...process.env, NODE_OPTIONS: '--max-old-space-size=4096' }
});

let output = '';
let errorOutput = '';

serverProcess.stdout.on('data', (data) => {
  const text = data.toString();
  output += text;
  console.log(text);
  
  // Check for success message
  if (text.includes('Ready in')) {
    console.log('✅ Server started successfully!');
    console.log('Stopping test...');
    serverProcess.kill();
    process.exit(0);
  }
  
  // Check for errors
  if (text.includes('error') || text.includes('Error') || text.includes('ERROR')) {
    console.log('❌ Error detected:', text);
    errorOutput += text;
  }
});

serverProcess.stderr.on('data', (data) => {
  const text = data.toString();
  errorOutput += text;
  console.error('STDERR:', text);
});

serverProcess.on('close', (code) => {
  console.log(`Server process exited with code ${code}`);
  
  if (code !== 0) {
    console.log('❌ Server failed to start');
    console.log('Error output:', errorOutput);
    process.exit(1);
  }
});

// Timeout after 30 seconds
setTimeout(() => {
  console.log('⏰ Test timeout after 30 seconds');
  serverProcess.kill();
  process.exit(1);
}, 30000);