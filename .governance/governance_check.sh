#!/bin/bash
set -euo pipefail

echo "[Sentinel] Running Integrity Sweep..."

if grep -rnE "AIza[0-9A-Za-z]{35}|sk-[A-Za-z0-9]{32}" . \
  --exclude-dir=.git \
  --exclude-dir=.github \
  --exclude-dir=.governance \
  --exclude-dir=node_modules \
  --exclude-dir=dist; then
    echo "[!] CRITICAL: Potential secret found."
    exit 1
fi

missing_dirs=()
for dir in "projects" "lab" "knowledge-base" "archive"; do
    if [ ! -d "$dir" ]; then
        missing_dirs+=("$dir")
    fi
done

if [ ${#missing_dirs[@]} -gt 0 ]; then
    echo "[!] Missing required directories: ${missing_dirs[*]}"
    exit 1
fi

missing_files=()
for file in "README.md" "LICENSE" "CONTRIBUTING.md" "SECURITY.md"; do
    if [ ! -f "$file" ]; then
        missing_files+=("$file")
    fi
done

if [ ${#missing_files[@]} -gt 0 ]; then
    echo "[!] Missing required governance files: ${missing_files[*]}"
    exit 1
fi

echo "[OK] Integrity Passed."
