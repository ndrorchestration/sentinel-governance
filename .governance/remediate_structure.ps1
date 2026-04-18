# Sentinel Governance Remediation (PowerShell)
$ErrorActionPreference = "Stop"

Write-Host "[Sentinel] Remediating repository structure..." -ForegroundColor Cyan

$requiredDirs = @("projects", "lab", "knowledge-base", "archive")
foreach ($dir in $requiredDirs) {
    if (-not (Test-Path -Path $dir -PathType Container)) {
        Write-Host "[*] Creating missing directory: $dir" -ForegroundColor Yellow
        New-Item -Path $dir -ItemType Directory -Force | Out-Null
    }
}

$requiredFiles = @("README.md", "LICENSE", "CONTRIBUTING.md", "SECURITY.md")
foreach ($file in $requiredFiles) {
    if (-not (Test-Path -Path $file -PathType Leaf)) {
        Write-Host "[!] Missing governance file: $file" -ForegroundColor Yellow
    }
}

Write-Host "[OK] Remediation completed." -ForegroundColor Green
