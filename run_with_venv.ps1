# Qdrant Embeddings Pipeline Runner (with venv)
# This script activates the venv and runs the complete pipeline

Write-Host "=== Qdrant Embeddings Pipeline ===" -ForegroundColor Green
Write-Host ""

# Check if venv exists
if (-not (Test-Path "venv\Scripts\python.exe")) {
    Write-Host "ERROR: Virtual environment not found at venv\" -ForegroundColor Red
    Write-Host "Please create a venv first: python -m venv venv" -ForegroundColor Yellow
    exit 1
}

# Check if environment variables are set
if (-not $env:QDRANT_URL -or -not $env:QDRANT_API_KEY) {
    Write-Host "QDRANT_URL and QDRANT_API_KEY are not set." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Please set them before running:" -ForegroundColor Yellow
    Write-Host '  $env:QDRANT_URL="https://7318448d-ab25-4121-aa65-4aa1289f3c3c.eu-central-1-0.aws.cloud.qdrant.io"' -ForegroundColor Cyan
    Write-Host '  $env:QDRANT_API_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2Nlc3MiOiJtIn0.V2hCWryZpE3lQwBkWLW3Ev6pZei51n5Hwr5aulcmhJY
"' -ForegroundColor Cyan
    Write-Host ""
    
    $setNow = Read-Host "Would you like to set them now? (y/n)"
    if ($setNow -eq "y" -or $setNow -eq "Y") {
        $url = Read-Host "Enter QDRANT_URL"
        $key = Read-Host "Enter QDRANT_API_KEY"
        $env:QDRANT_URL = $url
        $env:QDRANT_API_KEY = $key
        Write-Host "Environment variables set for this session." -ForegroundColor Green
    } else {
        Write-Host "Exiting. Please set environment variables and run again." -ForegroundColor Red
        exit 1
    }
}

Write-Host ""
Write-Host "Using Python from venv: venv\Scripts\python.exe" -ForegroundColor Cyan
Write-Host ""

# Verify packages are installed
Write-Host "Checking dependencies..." -ForegroundColor Cyan
$packages = venv\Scripts\python.exe -m pip list 2>&1 | Select-String -Pattern "qdrant-client|sentence-transformers|pandas"
if (-not $packages) {
    Write-Host "Installing required packages..." -ForegroundColor Yellow
    venv\Scripts\python.exe -m pip install -q qdrant-client sentence-transformers pandas
}

Write-Host ""
Write-Host "Step 1/4: Setting up Qdrant collections..." -ForegroundColor Cyan
venv\Scripts\python.exe .\scripts\setup_qdrant.py
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Setup failed!" -ForegroundColor Red
    exit 1
}
Write-Host ""

Write-Host "Step 2/4: Embedding employees..." -ForegroundColor Cyan
venv\Scripts\python.exe .\scripts\setup_employees_collection.py
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Employee embedding failed!" -ForegroundColor Red
    exit 1
}
Write-Host ""

Write-Host "Step 3/4: Embedding tasks..." -ForegroundColor Cyan
venv\Scripts\python.exe .\scripts\setup_tasks_collection.py
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Task embedding failed!" -ForegroundColor Red
    exit 1
}
Write-Host ""

Write-Host "Step 4/4: Testing search..." -ForegroundColor Cyan
venv\Scripts\python.exe .\scripts\test_search.py
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Search test failed!" -ForegroundColor Red
    exit 1
}
Write-Host ""

Write-Host "=== Pipeline completed successfully! ===" -ForegroundColor Green

