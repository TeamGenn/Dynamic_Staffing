# Qdrant Embeddings Pipeline Runner
# Make sure to set QDRANT_URL and QDRANT_API_KEY environment variables first!

Write-Host "Starting Qdrant Embeddings Pipeline..." -ForegroundColor Green
Write-Host ""

# Check if environment variables are set
if (-not $env:QDRANT_URL -or -not $env:QDRANT_API_KEY) {
    Write-Host "ERROR: QDRANT_URL and QDRANT_API_KEY must be set!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Set them with:" -ForegroundColor Yellow
    Write-Host '  $env:QDRANT_URL="your-url"' -ForegroundColor Yellow
    Write-Host '  $env:QDRANT_API_KEY="your-key"' -ForegroundColor Yellow
    exit 1
}

Write-Host "Step 1/4: Setting up Qdrant collections..." -ForegroundColor Cyan
python qdrant_setup.py
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Setup failed!" -ForegroundColor Red
    exit 1
}
Write-Host ""

Write-Host "Step 2/4: Embedding employees..." -ForegroundColor Cyan
python embed_employees.py
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Employee embedding failed!" -ForegroundColor Red
    exit 1
}
Write-Host ""

Write-Host "Step 3/4: Embedding tasks..." -ForegroundColor Cyan
python embed_tasks.py
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Task embedding failed!" -ForegroundColor Red
    exit 1
}
Write-Host ""

Write-Host "Step 4/4: Testing search..." -ForegroundColor Cyan
python test_search.py
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Search test failed!" -ForegroundColor Red
    exit 1
}
Write-Host ""

Write-Host "Pipeline completed successfully!" -ForegroundColor Green

