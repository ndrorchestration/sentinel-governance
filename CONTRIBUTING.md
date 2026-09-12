# Contributing to Sentinel Governance

## Governance

This repository operates under the [DGAF Framework](https://github.com/ndrorchestration/DGAF-Framework). Current governance coordination is bound to **`role.governance-orchestrator`**. Security protocols and CI/CD integrity enforcement are bound to **`role.security-containment-gate`** within their documented scope.

Historical persona labels such as Agent Amethyst and bare Agent Sentinel are lineage only and do not independently grant current authority. In the accepted DGAF lineage, bare `Sentinel` is historical-only; current security authority is defined by the functional role contract rather than the persona name.

## What This Repo Does

- Automated integrity monitoring across the ndrorchestration ecosystem
- CI/CD governance sweeps via GitHub Actions
- Security alignment checks against the OWASP Agentic Top 10
- PowerShell + TypeScript integrity tooling
- NDR-133 Personal Document Firewall enforcement automation

## Standards & Attribution

- **OWASP Agentic Top 10** — security alignment reference
- **NIST AI RMF** — risk management alignment
- **DGAF NDR-133** — Personal Document Firewall (Drive-only for personal docs)
- **GitHub Actions** — CI/CD substrate

## How to Contribute

1. Open an issue describing the integrity gap or security concern
2. Fork and branch from `main`
3. All new sweep rules must reference the relevant NDR pattern
4. Submit PR with evidence of sweep test passing

## Cross-References

- [DGAF-Framework](https://github.com/ndrorchestration/DGAF-Framework) — NDR pattern registry & governance
- [junior-apogee-app](https://github.com/ndrorchestration/junior-apogee-app) — QA platform monitored by repository integrity tooling
- [ai-governance-frameworks](https://github.com/ndrorchestration/ai-governance-frameworks) — Standards alignment
