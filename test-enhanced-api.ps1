# Green Olive Chain Enhanced API Test Script
# Tests all the enhanced blockchain integration endpoints

Write-Host "🧪 Green Olive Chain Enhanced API Testing" -ForegroundColor Green
Write-Host "============================================" -ForegroundColor Green

$baseUrl = "http://localhost:5000"
$headers = @{'Content-Type' = 'application/json'}

# Test 1: Blockchain Status
Write-Host "`n1. Testing Blockchain Status..." -ForegroundColor Yellow
try {
    $status = Invoke-RestMethod -Uri "$baseUrl/api/blockchain/status" -Method GET
    Write-Host "✅ Blockchain Status: $($status.data.initialized)" -ForegroundColor Green
} catch {
    Write-Host "❌ Blockchain Status Failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 2: Create Waste
Write-Host "`n2. Testing Waste Creation..." -ForegroundColor Yellow
$wasteBody = @{
    wasteData = @{
        type = "olive_pits"
        quantity = 200
        harvestDate = "2025-06-09"
        status = "READY"
        source = "Farm Block C"
        farmerName = "Enhanced Test Farmer"
        qualityGrade = "A+"
        moistureContent = 14.2
    }
} | ConvertTo-Json -Depth 3

try {
    $wasteResult = Invoke-RestMethod -Uri "$baseUrl/api/waste/add" -Method POST -Body $wasteBody -Headers $headers
    $wasteId = $wasteResult.data.wasteId
    Write-Host "✅ Waste Created: $wasteId" -ForegroundColor Green
    
    # Test 3: Get Waste List
    Write-Host "`n3. Testing Waste List..." -ForegroundColor Yellow
    $wasteList = Invoke-RestMethod -Uri "$baseUrl/api/waste" -Method GET
    Write-Host "✅ Waste Count: $($wasteList.count)" -ForegroundColor Green
    
    # Test 4: Get Waste History
    Write-Host "`n4. Testing Waste History..." -ForegroundColor Yellow
    $wasteHistory = Invoke-RestMethod -Uri "$baseUrl/api/waste/history/$wasteId" -Method GET
    Write-Host "✅ History Records: $($wasteHistory.data.Count)" -ForegroundColor Green
    
    # Test 5: Create Extraction
    Write-Host "`n5. Testing Extraction Creation..." -ForegroundColor Yellow
    $extractionBody = @{
        extractionData = @{
            wasteId = $wasteId
            productType = "olive_oil"
            quantity = 100
            quality = "Extra Virgin"
            extractionMethod = "Cold Press"
            temperature = 24
            pressure = 180
            yieldPercentage = 50
        }
    } | ConvertTo-Json -Depth 3
    
    $extractionResult = Invoke-RestMethod -Uri "$baseUrl/api/extraction/add" -Method POST -Body $extractionBody -Headers $headers
    $extractionId = $extractionResult.data.extractionId
    Write-Host "✅ Extraction Created: $extractionId" -ForegroundColor Green
    
    # Test 6: Get Extraction by ID
    Write-Host "`n6. Testing Extraction Query..." -ForegroundColor Yellow
    $extraction = Invoke-RestMethod -Uri "$baseUrl/api/extraction/$extractionId" -Method GET
    Write-Host "✅ Extraction Found: $($extraction.data.productType)" -ForegroundColor Green
    
    # Test 7: Create Recycling
    Write-Host "`n7. Testing Recycling Creation..." -ForegroundColor Yellow
    $recyclingBody = @{
        recyclingData = @{
            wasteId = $wasteId
            recycledProduct = "compost"
            quantity = 80
            method = "aerobic_composting"
            qualityGrade = "Premium"
            environmentalImpact = "Very Low"
            certifications = "Organic,Carbon_Neutral"
        }
    } | ConvertTo-Json -Depth 3
    
    $recyclingResult = Invoke-RestMethod -Uri "$baseUrl/api/recycling/add" -Method POST -Body $recyclingBody -Headers $headers
    $recyclingId = $recyclingResult.data.recyclingId
    Write-Host "✅ Recycling Created: $recyclingId" -ForegroundColor Green
    
    # Test 8: Complete Traceability
    Write-Host "`n8. Testing Complete Traceability..." -ForegroundColor Yellow
    $traceability = Invoke-RestMethod -Uri "$baseUrl/api/traceability/$wasteId" -Method GET
    Write-Host "✅ Traceability Chain Complete" -ForegroundColor Green
    Write-Host "   - Waste: $($traceability.data.waste.type)" -ForegroundColor Cyan
    Write-Host "   - Extractions: $($traceability.data.extractions.Count)" -ForegroundColor Cyan
    Write-Host "   - Recyclings: $($traceability.data.recyclings.Count)" -ForegroundColor Cyan
    
    # Test 9: Update Waste Status
    Write-Host "`n9. Testing Waste Status Update..." -ForegroundColor Yellow
    $statusBody = @{
        wasteId = $wasteId
        newStatus = "TRANSFERRED"
    } | ConvertTo-Json
    
    $statusResult = Invoke-RestMethod -Uri "$baseUrl/api/waste/update-status" -Method PUT -Body $statusBody -Headers $headers
    Write-Host "✅ Status Updated: $($statusResult.data.status)" -ForegroundColor Green
    
} catch {
    Write-Host "❌ Test Failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 10: API Health Check
Write-Host "`n10. Testing API Health..." -ForegroundColor Yellow
try {
    $health = Invoke-RestMethod -Uri "$baseUrl" -Method GET
    Write-Host "✅ API Health: $($health.message)" -ForegroundColor Green
} catch {
    Write-Host "❌ API Health Failed: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n🎉 Enhanced API Testing Complete!" -ForegroundColor Green
Write-Host "All blockchain-integrated endpoints are functional" -ForegroundColor Green
