# PowerShell Deployment Script for Persona Sintetis
# Usage: .\scripts\deploy.ps1

$ErrorActionPreference = "Stop"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Persona Sintetis - Deployment Script" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Step 1: Install dependencies
Write-Host "[1/5] Installing dependencies..." -ForegroundColor Yellow
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: npm install failed" -ForegroundColor Red
    exit 1
}

# Step 2: Build Angular application
Write-Host ""
Write-Host "[2/5] Building Angular application..." -ForegroundColor Yellow
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Build failed" -ForegroundColor Red
    exit 1
}

# Step 3: Verify build output
Write-Host ""
Write-Host "[3/5] Verifying build output..." -ForegroundColor Yellow
$buildPath = "dist\persona-sintetis\browser"
if (-not (Test-Path $buildPath)) {
    Write-Host "ERROR: Build directory not found at $buildPath" -ForegroundColor Red
    exit 1
}

if (-not (Test-Path "$buildPath\index.html")) {
    Write-Host "ERROR: index.html not found in build directory" -ForegroundColor Red
    exit 1
}

Write-Host "✓ Build verified successfully" -ForegroundColor Green

# Step 4: Install Express dependencies (if not already installed)
Write-Host ""
Write-Host "[4/5] Checking Express server dependencies..." -ForegroundColor Yellow
if (-not (Test-Path "node_modules\express")) {
    Write-Host "Installing Express..." -ForegroundColor Yellow
    npm install express
    if ($LASTEXITCODE -ne 0) {
        Write-Host "ERROR: Express installation failed" -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "✓ Express already installed" -ForegroundColor Green
}

# Step 5: Start server (optional - comment out for CI/CD)
Write-Host ""
Write-Host "[5/5] Deployment complete!" -ForegroundColor Green
Write-Host ""
Write-Host "To start the server, run:" -ForegroundColor Cyan
Write-Host "  npm run serve" -ForegroundColor White
Write-Host ""
Write-Host "To start Cloudflare Tunnel, run:" -ForegroundColor Cyan
Write-Host "  cloudflared tunnel run persona-sintetis-tunnel" -ForegroundColor White
Write-Host ""

# Optional: Auto-start server (uncomment for local deployment)
# Write-Host "Starting server..." -ForegroundColor Yellow
# node server.js
