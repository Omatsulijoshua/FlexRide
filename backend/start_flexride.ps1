<#
.SYNOPSIS
FlexRide Master Boot Script
.DESCRIPTION
This script starts the entire FlexRide ecosystem using Docker Compose.
#>

Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "       🚀 BOOTING FLEX RIDE 🚀          " -ForegroundColor Yellow
Write-Host "=========================================" -ForegroundColor Cyan

# Check if Docker is running
docker info > $null 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ ERROR: Docker daemon is not running! Please start Docker Desktop." -ForegroundColor Red
    exit 1
}

Write-Host "✅ Docker is running. Initializing infrastructure..." -ForegroundColor Green

# Bring up the whole system
docker-compose up -d --build

Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "✅ Ecosystem is LIVE!" -ForegroundColor Green
Write-Host "Database (Postgres)  -> :5432"
Write-Host "Cache (Redis)        -> :6379"
Write-Host "API Gateway          -> http://localhost:3000"
Write-Host "Analytics Dash       -> http://localhost:3011"
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "Use 'docker-compose logs -f' to view real-time traffic." -ForegroundColor Gray
