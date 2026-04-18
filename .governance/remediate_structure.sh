#!/bin/bash
set -euo pipefail

echo "[Sentinel] Remediating repository structure..."

for dir in "projects" "lab" "knowledge-base" "archive"; do
    if [ ! -d "$dir" ]; then
        echo "[*] Creating missing directory: $dir"
        mkdir -p "$dir"
    fi
done

for file in "README.md" "LICENSE" "CONTRIBUTING.md" "SECURITY.md"; do
    if [ ! -f "$file" ]; then
        echo "[!] Missing governance file: $file"
    fi
done

echo "[OK] Remediation completed."
