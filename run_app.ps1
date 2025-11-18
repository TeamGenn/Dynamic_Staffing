# Quick Run Script for the Application
# Usage: .\run_app.ps1

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Dynamic Staffing Application Runner" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if venv exists
if (-not (Test-Path "venv\Scripts\python.exe")) {
    Write-Host "ERROR: Virtual environment not found!" -ForegroundColor Red
    Write-Host "Please create venv first: python -m venv venv" -ForegroundColor Yellow
    exit 1
}

# Check environment variables
$envVarsSet = $true
if (-not $env:QDRANT_URL) {
    Write-Host "WARNING: QDRANT_URL not set" -ForegroundColor Yellow
    $envVarsSet = $false
}
if (-not $env:QDRANT_API_KEY) {
    Write-Host "WARNING: QDRANT_API_KEY not set" -ForegroundColor Yellow
    $envVarsSet = $false
}
if (-not $env:GEMINI_API_KEY) {
    Write-Host "WARNING: GEMINI_API_KEY not set" -ForegroundColor Yellow
    $envVarsSet = $false
}

if (-not $envVarsSet) {
    Write-Host ""
    Write-Host "Please set environment variables first:" -ForegroundColor Yellow
    Write-Host '  $env:QDRANT_URL="your-url"' -ForegroundColor Cyan
    Write-Host '  $env:QDRANT_API_KEY="your-key"' -ForegroundColor Cyan
    Write-Host '  $env:GEMINI_API_KEY="your-key"' -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Then run this script again." -ForegroundColor Yellow
    exit 1
}

Write-Host "[OK] Environment variables are set" -ForegroundColor Green
Write-Host ""

# Menu
Write-Host "What would you like to run?" -ForegroundColor Cyan
Write-Host "1. Test the application (test_application.py)"
Write-Host "2. Run AI engine test (analyze_and_match.py)"
Write-Host "3. Start FastAPI server"
Write-Host "4. Exit"
Write-Host ""

$choice = Read-Host "Enter choice (1-4)"

switch ($choice) {
    "1" {
        Write-Host ""
        Write-Host "Running test suite..." -ForegroundColor Cyan
        venv\Scripts\python.exe test_application.py
    }
    "2" {
        Write-Host ""
        Write-Host "Running AI engine test..." -ForegroundColor Cyan
        venv\Scripts\python.exe backend\ai\analyze_and_match.py
    }
    "3" {
        Write-Host ""
        Write-Host "Starting FastAPI server..." -ForegroundColor Cyan
        Write-Host "Server will be available at: http://localhost:8000" -ForegroundColor Green
        Write-Host "Press Ctrl+C to stop" -ForegroundColor Yellow
        Write-Host ""
        venv\Scripts\python.exe -m uvicorn backend.main:app --reload
    }
    "4" {
        Write-Host "Exiting..." -ForegroundColor Yellow
        exit 0
    }
    default {
        Write-Host "Invalid choice!" -ForegroundColor Red
        exit 1
    }
}

