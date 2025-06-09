# Test script to verify backend-frontend connection
$headers = @{
    "Content-Type" = "application/json"
}

$testWasteData = @{
    wasteData = @{
        type = "Branches"
        quantity = 25
        harvestDate = "2025-06-09"
        status = "READY"
    }
} | ConvertTo-Json -Depth 3

Write-Host "Testing waste addition endpoint..."
Write-Host "Sending data: $testWasteData"

try {
    $response = Invoke-WebRequest -Uri "http://localhost:5000/api/waste/add" -Method POST -Headers $headers -Body $testWasteData
    Write-Host "Success! Response:"
    Write-Host $response.Content
} catch {
    Write-Host "Error: $($_.Exception.Message)"
}

Write-Host "`nTesting waste list endpoint..."
try {
    $listResponse = Invoke-WebRequest -Uri "http://localhost:5000/api/waste/list" -Method GET
    Write-Host "Waste list response:"
    Write-Host $listResponse.Content
} catch {
    Write-Host "Error: $($_.Exception.Message)"
}
