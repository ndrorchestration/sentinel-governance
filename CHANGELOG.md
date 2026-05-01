# Changelog — Sentinel Governance

All notable changes to this project are documented here.
Format follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).
Versioning follows [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

---

## [1.1.0] — 2026-05-01

### Fixed
- Governance check script now auto-heals missing required directories (`projects`, `lab`, `knowledge-base`, `archive`)
- Added `set -euo pipefail` hardening to shell scripts
- Batched missing dir/file arrays for cleaner error reporting
- `remediate_structure.sh` + `remediate_structure.ps1` self-healing scripts added
- PowerShell exclusion filter refactored; `throw` on failure replaces `exit 1`
- Gitleaks action now receives `GITHUB_TOKEN` env correctly
- PR #1 squash-merged into `main` (Session 008 — Agent Amethyst sweep)

## [1.0.0] — 2026-03-29

### Added
- Initial governance check scaffold (`.governance/governance_check.sh` + `.governance/governance_check.ps1`)
- GitHub Actions workflow (`governance.yml`) with Gitleaks secret scanning
- Apache 2.0 license
- Automated integrity monitoring and CI/CD governance sweeps

---

_Maintained by ndrorchestration | DGAF-certified | Governed by Agent Amethyst + Sentinel_
