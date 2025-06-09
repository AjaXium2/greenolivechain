# Test script for all Green Olive Chain API endpoints

Write-Host "🧪 Testing Green Olive Chain API Endpoints" -ForegroundColor Green
Write-Host "=============================================" -ForegroundColor Green

$baseUrl = "http://localhost:5000"

# Test Health endpoint
Write-Host "`n1. Testing Health Endpoint..." -ForegroundColor Yellow
try {
    $healthResponse = Invoke-WebRequest -Uri "$baseUrl/health" -Method GET
    Write-Host "✅ Health Check: $($healthResponse.StatusCode)" -ForegroundColor Green
    $healthData = $healthResponse.Content | ConvertFrom-Json
    Write-Host "   Status: $($healthData.status)" -ForegroundColor Cyan
    Write-Host "   Environment: $($healthData.environment)" -ForegroundColor Cyan
} catch {
    Write-Host "❌ Health Check Failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test Waste endpoints
Write-Host "`n2. Testing Waste Endpoints..." -ForegroundColor Yellow

# Get waste list
try {
    $wasteListResponse = Invoke-WebRequest -Uri "$baseUrl/api/waste/list" -Method GET
    Write-Host "✅ Waste List: $($wasteListResponse.StatusCode)" -ForegroundColor Green
    $wasteData = $wasteListResponse.Content | ConvertFrom-Json
    Write-Host "   Found $($wasteData.data.Count) waste records" -ForegroundColor Cyan
} catch {
    Write-Host "❌ Waste List Failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Add new waste
$wastePayload = @{
    wasteData = @{
        type = "Feuilles d'olivier"
        quantity = 15.5
        harvestDate = (Get-Date).ToString("yyyy-MM-ddTHH:mm:ss.fffZ")
        status = "COLLECTED"
    }
} | ConvertTo-Json -Depth 3

try {
    $addWasteResponse = Invoke-WebRequest -Uri "$baseUrl/api/waste/add" -Method POST -Body $wastePayload -ContentType "application/json"
    Write-Host "✅ Add Waste: $($addWasteResponse.StatusCode)" -ForegroundColor Green
    $wasteResult = $addWasteResponse.Content | ConvertFrom-Json
    Write-Host "   Added waste with ID: $($wasteResult.data.id)" -ForegroundColor Cyan
} catch {
    Write-Host "❌ Add Waste Failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test Extraction endpoints
Write-Host "`n3. Testing Extraction Endpoints..." -ForegroundColor Yellow

# Get extraction list
try {
    $extractionListResponse = Invoke-WebRequest -Uri "$baseUrl/api/extraction/list" -Method GET
    Write-Host "✅ Extraction List: $($extractionListResponse.StatusCode)" -ForegroundColor Green
    $extractionData = $extractionListResponse.Content | ConvertFrom-Json
    Write-Host "   Found $($extractionData.data.Count) extraction records" -ForegroundColor Cyan
} catch {
    Write-Host "❌ Extraction List Failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Add new extraction
$extractionPayload = @{
    extractionData = @{
        wasteId = 1
        extractionDate = (Get-Date).ToString("yyyy-MM-ddTHH:mm:ss.fffZ")
        productType = "Huile d'olive extra vierge"
        quantity = 8.2
        quality = "Premium"
        status = "PROCESSED"
    }
} | ConvertTo-Json -Depth 3

try {
    $addExtractionResponse = Invoke-WebRequest -Uri "$baseUrl/api/extraction/add" -Method POST -Body $extractionPayload -ContentType "application/json"
    Write-Host "✅ Add Extraction: $($addExtractionResponse.StatusCode)" -ForegroundColor Green
    $extractionResult = $addExtractionResponse.Content | ConvertFrom-Json
    Write-Host "   Added extraction with ID: $($extractionResult.data.id)" -ForegroundColor Cyan
} catch {
    Write-Host "❌ Add Extraction Failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test Recycling endpoints
Write-Host "`n4. Testing Recycling Endpoints..." -ForegroundColor Yellow

# Get recycling list
try {
    $recyclingListResponse = Invoke-WebRequest -Uri "$baseUrl/api/recycling/list" -Method GET
    Write-Host "✅ Recycling List: $($recyclingListResponse.StatusCode)" -ForegroundColor Green
    $recyclingData = $recyclingListResponse.Content | ConvertFrom-Json
    Write-Host "   Found $($recyclingData.data.Count) recycling records" -ForegroundColor Cyan
} catch {
    Write-Host "❌ Recycling List Failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Add new recycling
$recyclingPayload = @{
    recyclingData = @{
        wasteId = 2
        recyclingDate = (Get-Date).ToString("yyyy-MM-ddTHH:mm:ss.fffZ")
        recycledProduct = "Compost bio"
        quantity = 30.0
        method = "Compostage accéléré"
        status = "COMPLETED"
    }
} | ConvertTo-Json -Depth 3

try {
    $addRecyclingResponse = Invoke-WebRequest -Uri "$baseUrl/api/recycling/add" -Method POST -Body $recyclingPayload -ContentType "application/json"
    Write-Host "✅ Add Recycling: $($addRecyclingResponse.StatusCode)" -ForegroundColor Green
    $recyclingResult = $addRecyclingResponse.Content | ConvertFrom-Json
    Write-Host "   Added recycling with ID: $($recyclingResult.data.id)" -ForegroundColor Cyan
} catch {
    Write-Host "❌ Add Recycling Failed: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n🎉 API Testing Complete!" -ForegroundColor Green
Write-Host "==========================================" -ForegroundColor Green
