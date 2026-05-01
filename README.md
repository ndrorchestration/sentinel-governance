# sentinel-governance
![Status](https://img.shields.io/badge/Status-Active-brightgreen)
![Language](https://img.shields.io/badge/Language-Python%20%7C%20Bash%20%7C%20PowerShell-blue)
![License](https://img.shields.io/badge/License-Apache%202.0-blue)
![Topics](https://img.shields.io/badge/topics-ci--cd%20%7C%20governance%20%7C%20integrity--monitoring%20%7C%20agent--sentinel-purple)

> **Governance:** DGAF / Agent Amethyst — Yes. This repo is the CI/CD enforcement layer of the DGAF stack, operated by **Agent Sentinel**. See [DGAF-Framework](https://github.com/ndrorchestration/DGAF-Framework) for spine documentation.

**Automated integrity monitoring and CI/CD governance sweeps for project stability, security compliance, and detect-remediate-revalidate operations.**

---

## What Sentinel Does

Agent Sentinel enforces governance integrity across the **ndrorchestration ecosystem** by:

- **Detecting** structural violations, workflow failures, and boundary breaches
- **Remediating** via automated patch requests or operator-assisted repair
- **Revalidating** that the fix holds before closing the loop

This is the **detect-remediate-revalidate** cycle in production.

---

## Core Capabilities

- **GitHub App Operator** — listens for failed `workflow_run` events and forwards context to an external orchestrator
- **Observe mode** — fetch failure context and request a patch without opening a PR
- **Repair mode** — request a patch and open a PR when the orchestrator returns a full replacement workflow file
- **Cross-platform parity** — Bash and PowerShell scripts maintained in sync
- **Auto-healing structure checks** — validates repo structure integrity on every push
- **Hardened CI** — GitHub Actions workflows with failure escalation to Sentinel operator

---

## Sentinel GitHub Operator

Runtime modes:

| Mode | Behavior |
|------|----------|
| `observe` | Fetch failure context, request a patch — no PR opened |
| `repair` | Request a patch, open a PR with full replacement workflow file |

See [docs/sentinel-operator.md](docs/sentinel-operator.md) for setup and webhook details.

---

## Quick Start

```bash
git clone https://github.com/ndrorchestration/sentinel-governance.git
cd sentinel-governance
pip install -r requirements.txt
```

Configure your GitHub App credentials in `.env`, then run:

```bash
python sentinel_operator.py --mode observe
```

Or repair mode:

```bash
python sentinel_operator.py --mode repair
```

---

## Related Ecosystem

- [DGAF-Framework](https://github.com/ndrorchestration/DGAF-Framework) — governance spine
- [junior-apogee-app](https://github.com/ndrorchestration/junior-apogee-app) — primary monitored system
- [Amethyst-Governance-Eval-Stack](https://github.com/ndrorchestration/Amethyst-Governance-Eval-Stack) — eval framework Sentinel protects
- [Driftwatch](https://github.com/ndrorchestration/Driftwatch) — drift detection; Sentinel responds to Driftwatch alerts
- [Gold-star-standards](https://github.com/ndrorchestration/Gold-star-standards) — certification standards Sentinel enforces

---

## License

Apache 2.0 — see [LICENSE](LICENSE) for details.

## Provenance

Developed by [Ndr "Ender" Hensel](https://github.com/ndrorchestration) — AI Orchestration Engineer & Systems Architect, Columbus OH.  
[LinkedIn](https://www.linkedin.com/in/andrewhensel) · [GitHub](https://github.com/ndrorchestration)
