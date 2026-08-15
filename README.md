# sentinel-governance

![Status](https://img.shields.io/badge/Status-Experimental-blue)
![Language](https://img.shields.io/badge/Language-Python%20%7C%20Bash%20%7C%20PowerShell-blue)
![License](https://img.shields.io/badge/License-Apache%202.0-blue)
![Topics](https://img.shields.io/badge/topics-ci--cd%20%7C%20integrity--monitoring-purple)

> **Epistemic status:** Experimental CI/CD integrity and automation repository. Implemented operator workflows should be distinguished from claims of ecosystem-wide enforcement, autonomous remediation, security compliance, or production reliability.

## Purpose

`sentinel-governance` provides automation for observing GitHub Actions failures, collecting failure context, requesting workflow repairs, and optionally opening pull requests when the configured orchestrator returns a complete replacement workflow file.

The repository is best understood as a **CI/CD automation and integrity-monitoring layer**, not as an independent certification authority.

## What Sentinel Does

Where implemented, Sentinel can:

- detect structural violations and workflow failures;
- collect failure context;
- request remediation from an external orchestrator;
- operate in `observe` mode without opening a PR;
- operate in `repair` mode and open a PR when the configured conditions are satisfied;
- run cross-platform Bash and PowerShell checks;
- re-run or validate configured checks after changes.

The phrase **detect → remediate → revalidate** describes the intended workflow. It should not be interpreted as proof that every failure is automatically detected, repaired, or correctly resolved.

## Sentinel GitHub Operator

Runtime modes:

| Mode | Behavior |
|------|----------|
| `observe` | Fetch failure context and request a patch; no PR opened |
| `repair` | Request a patch and open a PR when the configured orchestrator returns the required workflow replacement |

See `docs/sentinel-operator.md` for setup and webhook details.

## Quick Start

```bash
git clone https://github.com/ndrorchestration/sentinel-governance.git
cd sentinel-governance
pip install -r requirements.txt
```

Configure the required GitHub App credentials in `.env`, then run:

```bash
python sentinel_operator.py --mode observe
```

Or:

```bash
python sentinel_operator.py --mode repair
```

Credentials enable the integration; they do not establish security certification or external compliance.

## Terminology

- **Sentinel** — project-local operator/automation name.
- **DGAF** — Dynamic Governance Agentic Formation, a related but separate governance/evaluation research track.
- **Amethyst** — related evaluation/orchestration terminology used elsewhere in the ecosystem.

These names describe repository relationships and architecture. They are not independent authorities.

## Related Ecosystem

- `DGAF-Framework` — related governance/evaluation research track
- `junior-apogee-app` — related evaluation/QA track
- `Amethyst-Governance-Eval-Stack` — related evaluation/orchestration track
- `Driftwatch` — separate drift-detection track
- `Gold-star-standards` — related internal rubric/standards artifacts

Cross-repository references do not establish mutual validation, certification, or security compliance.

## Epistemic Standard

Claims should distinguish:

**DEFINED → IMPLEMENTED → COMPUTED → VERIFIED → ATTESTED → HISTORICAL → HYPOTHESIS → METAPHOR → UNSUPPORTED → DEPRECATED**

A successful CI run demonstrates the checks that ran under those conditions. It does not automatically establish ecosystem-wide reliability or security compliance.

## License

Apache 2.0 — see `LICENSE` for details.

## Provenance

Developed by Ndr / Ender Hensel (`ndrorchestration`).
