$ErrorActionPreference = "Stop"

Write-Host "[Sentinel] Running Integrity Sweep..." -ForegroundColor Cyan

$secretPattern = "AIza[0-9A-Za-z]{35}|sk-[A-Za-z0-9]{32}"
$excludedFragments = @(
    "\.git\\",
    "\.github\\",
    "\.governance\\",
    "\node_modules\\",
    "\dist\\"
)

$files = Get-ChildItem -Recurse -File | Where-Object {
    $fullName = $_.FullName
    foreach ($fragment in $excludedFragments) {
        if ($fullName -match $fragment) {
            return $false
        }
    }
    return $true
}

$secretsFound = $false
foreach ($file in $files) {
    if (Select-String -Path $file.FullName -Pattern $secretPattern -Quiet) {
        Write-Host "[!] CRITICAL: Potential secret found in $($file.FullName)" -ForegroundColor Red
        $secretsFound = $true
    }
}

if ($secretsFound) {
    throw "Secret scan failed."
}

$requiredDirs = @("projects", "lab", "knowledge-base", "archive")
$missingDirs = @()
foreach ($dir in $requiredDirs) {
    if (-not (Test-Path -Path $dir -PathType Container)) {
        $missingDirs += $dir
    }
}

if ($missingDirs.Count -gt 0) {
    throw "Missing required directories: $($missingDirs -join ', ')"
}

$requiredFiles = @("README.md", "LICENSE", "CONTRIBUTING.md", "SECURITY.md")
$missingFiles = @()
foreach ($file in $requiredFiles) {
    if (-not (Test-Path -Path $file -PathType Leaf)) {
        $missingFiles += $file
    }
}

if ($missingFiles.Count -gt 0) {
    throw "Missing required governance files: $($missingFiles -join ', ')"
}

Write-Host "[OK] Integrity Passed." -ForegroundColor Green
