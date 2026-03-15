# PowerShell script to test authentication API

Write-Host "🔧 Testing Mission Control v2 Authentication API" -ForegroundColor Cyan
Write-Host ""

# Test health endpoint first
Write-Host "1. Testing health endpoint..." -ForegroundColor Yellow
try {
    $healthResponse = Invoke-WebRequest -Uri "http://localhost:3000/api/health" -Method GET -ErrorAction Stop
    Write-Host "   ✅ Health check: $($healthResponse.StatusCode) $($healthResponse.StatusDescription)" -ForegroundColor Green
    $healthData = $healthResponse.Content | ConvertFrom-Json
    Write-Host "   Service: $($healthData.service)" -ForegroundColor Gray
    Write-Host "   Status: $($healthData.status)" -ForegroundColor Gray
} catch {
    Write-Host "   ❌ Health check failed: $_" -ForegroundColor Red
    exit 1
}

Write-Host ""

# Test login endpoint
Write-Host "2. Testing login endpoint..." -ForegroundColor Yellow
$loginBody = @{
    email = "admin@mission-control.ai"
    password = "admin123"
} | ConvertTo-Json

try {
    $loginResponse = Invoke-WebRequest -Uri "http://localhost:3000/api/auth/login" -Method POST -Body $loginBody -ContentType "application/json" -ErrorAction Stop
    Write-Host "   ✅ Login successful: $($loginResponse.StatusCode) $($loginResponse.StatusDescription)" -ForegroundColor Green
    $loginData = $loginResponse.Content | ConvertFrom-Json
    
    Write-Host "   Message: $($loginData.message)" -ForegroundColor Gray
    Write-Host "   User: $($loginData.data.user.email)" -ForegroundColor Gray
    Write-Host "   Role: $($loginData.data.user.role)" -ForegroundColor Gray
    
    # Extract tokens
    $accessToken = $loginData.data.tokens.accessToken
    $refreshToken = $loginData.data.tokens.refreshToken
    
    Write-Host "   Access Token: $($accessToken.Substring(0, 20))..." -ForegroundColor Gray
    Write-Host "   Refresh Token: $($refreshToken.Substring(0, 20))..." -ForegroundColor Gray
    
    # Test token validation
    Write-Host ""
    Write-Host "3. Testing token validation..." -ForegroundColor Yellow
    
    $validateBody = @{
        token = $accessToken
    } | ConvertTo-Json
    
    $validateResponse = Invoke-WebRequest -Uri "http://localhost:3000/api/auth/validate" -Method POST -Body $validateBody -ContentType "application/json" -ErrorAction Stop
    Write-Host "   ✅ Token validation successful: $($validateResponse.StatusCode)" -ForegroundColor Green
    $validateData = $validateResponse.Content | ConvertFrom-Json
    Write-Host "   Validated user: $($validateData.data.email)" -ForegroundColor Gray
    
} catch {
    Write-Host "   ❌ Login failed: $_" -ForegroundColor Red
    if ($_.Exception.Response) {
        $errorStream = $_.Exception.Response.GetResponseStream()
        $reader = New-Object System.IO.StreamReader($errorStream)
        $errorBody = $reader.ReadToEnd()
        Write-Host "   Error response: $errorBody" -ForegroundColor Red
    }
    exit 1
}

Write-Host ""
Write-Host "🎉 Authentication API is WORKING correctly!" -ForegroundColor Green
Write-Host ""
Write-Host "You can now:" -ForegroundColor Cyan
Write-Host "1. Visit http://localhost:3000/login" -ForegroundColor White
Write-Host "2. Use demo admin credentials:" -ForegroundColor White
Write-Host "   Email: admin@mission-control.ai" -ForegroundColor Gray
Write-Host "   Password: admin123" -ForegroundColor Gray
Write-Host "3. Access the protected dashboard at http://localhost:3000/dashboard" -ForegroundColor White