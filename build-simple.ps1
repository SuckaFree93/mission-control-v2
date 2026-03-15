# Simple build script for Mission Control v2
Write-Host "🚀 Building Mission Control v2..." -ForegroundColor Cyan

# Clean previous build
Write-Host "🧹 Cleaning previous build..." -ForegroundColor Yellow
if (Test-Path ".next") {
    Remove-Item -Recurse -Force ".next"
}

# Install dependencies if needed
Write-Host "📦 Checking dependencies..." -ForegroundColor Yellow
if (-not (Test-Path "node_modules")) {
    Write-Host "Installing dependencies..." -ForegroundColor Green
    npm install
}

# Build with memory optimization
Write-Host "🔨 Building with memory optimization..." -ForegroundColor Green
$env:NODE_OPTIONS = "--max-old-space-size=4096"
npm run build

# Check build status
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Build successful!" -ForegroundColor Green
    Write-Host "📁 Build output: .next/" -ForegroundColor Cyan
    Write-Host "🚀 Ready for deployment to Vercel" -ForegroundColor Cyan
    
    # Show build info
    if (Test-Path ".next/BUILD_ID") {
        $buildId = Get-Content ".next/BUILD_ID"
        Write-Host "📋 Build ID: $buildId" -ForegroundColor Cyan
    }
} else {
    Write-Host "❌ Build failed with exit code: $LASTEXITCODE" -ForegroundColor Red
    exit 1
}