# PowerShell script to create clean submission zip file
$destination = "..\truthlens-submission.zip"
if (Test-Path $destination) { Remove-Item $destination }

Write-Host "Creating TruthLens submission archive..." -ForegroundColor Cyan
Compress-Archive -Path ".\*" -DestinationPath $destination -CompressionLevel Optimal
Write-Host "Successfully generated truthlens-submission.zip at parent directory!" -ForegroundColor Green
