# NDR Pattern Register

> **Maintained by:** Agent COLLEEN (Continuity & Compliance)  
> **Authority:** Agent Amethyst (Meta-Orchestrator)  
> **Last Updated:** 2026-04-29 — Session close (all OIs resolved)  
> **Source:** Amethyst coherence sweep session — 2026-04-29 02:00–02:55 EDT  

This file is the persistent record of all NDR Patterns identified and ratified during Agent Amethyst governance sessions. Patterns are written here so they survive session boundaries and can be referenced by all agents in the DGAF stack.

---

## Pattern Index

| ID | Pattern Name | Trigger | Primary Agent |
|---|---|---|---|
| NDR-001 | Ecosystem Coherence Sweep | README missing governance banner or ecosystem links | Amethyst |
| NDR-002 | Legal File Hygiene | NOTICE project name ≠ repo name | COLLEEN / Amethyst |
| NDR-003 | Agent Roster Synchronization | Agent name in any diagram ≠ canonical role table | Amethyst |
| NDR-004 | Governance Standard Bootstrap | New repo created or governance_check.sh updated | Sentinel |
| NDR-005 | CI Action Version Hygiene | Outdated GitHub Actions versions in any workflow | Sentinel |
| NDR-006 | IP Attribution Header | Behavioral spec / system prompt in public repo without IP notice | COLLEEN |
| NDR-007 | Workflow File Deduplication | Root-level workflow file shadows .github/workflows/ file | Sentinel |

---

## Full Pattern Specifications

---

### NDR-001 — Ecosystem Coherence Sweep

**Name:** Ecosystem Coherence Sweep  
**Spec:** All repos in a governed ecosystem must carry a consistent governance banner (framework attribution + agent authority + link to spine doc), share a common provenance footer format, and cross-link to at least 3 sibling repos.  
**Use:** Monthly audit cycle or after any new repo is created.  
**Trigger:** Any repo README missing the governance banner or ecosystem links section.  
**Primary Agent:** Amethyst  
**Supporting Agents:** COLLEEN (audit trail), Herald (status broadcast)  

**Minimum governance banner format:**
```markdown
> **Governance:** DGAF / Agent [Name] — [one-line role statement]. See [DGAF-Framework](https://github.com/Flickerflash/DGAF-Framework) for spine documentation.
```

**Minimum ecosystem links section:** ≥3 sibling repos with role descriptions.  
**Minimum provenance footer format:**
```markdown
Developed by [Ndr "Ender" Hensel](https://github.com/Flickerflash) — AI Orchestration Engineer & Systems Architect, Columbus OH.  
[Portfolio](https://flickerflash.vercel.app/) · [LinkedIn](https://www.linkedin.com/in/andrewhensel) · [GitHub](https://github.com/Flickerflash)
```

---

### NDR-002 — Legal File Hygiene

**Name:** Legal File Hygiene  
**Spec:** NOTICE and LICENSE files are legally binding attribution documents. Template text that was never replaced (project names, agent references) constitutes both a branding error and a potential IP misattribution. These must be the first files corrected in any coherence sweep.  
**Use:** Every new repo creation and every coherence sweep.  
**Trigger:** Project name in NOTICE doesn't match the repo name, OR any retired agent is referenced in a legal file.  
**Primary Agent:** COLLEEN  
**Supporting Agents:** Amethyst (authority), Sentinel (enforcement)  

**NOTICE file required fields:**
- Correct project name and subtitle
- Copyright year range and full author name
- Apache 2.0 license block (for enterprise/governance repos)
- Current agent roster (no retired agent names)
- Capability summary matching the repo's actual function

**Retired agent mapping (as of 2026-04-29):**
- Agent Lavender → superseded by **Agent Apogee** (Evidence Governance Orchestrator)

---

### NDR-003 — Agent Roster Synchronization

**Name:** Agent Roster Synchronization  
**Spec:** Whenever an agent is retired or renamed, all architecture diagrams, NOTICE files, and CHANGELOG historical entries must be updated atomically in the same commit sweep. Stale role labels in diagrams create onboarding confusion and contradict the canonical spec.  
**Use:** After any agent role change, ensemble expansion, or naming update.  
**Trigger:** Agent name in any diagram doesn't match the current canonical role table.  
**Primary Agent:** Amethyst  

**Canonical Agent Role Table (2026-04-29):**

| Agent | Canonical Role | Primary Scope |
|---|---|---|
| Amethyst | Meta-Orchestrator & QA Authority | Ensemble coordination, sign-off, governance spine |
| Sentinel | CI/CD Integrity Enforcer | Security gates, secret scanning, pipeline integrity |
| Apogee | Evidence Governance Orchestrator | Evaluation outputs, QA certification, evidence trails |
| Reciprocity | Portfolio & Rollback Manager | Balance scoring, reversibility, portfolio coherence |
| DemiJoule | Synthesis & Insight Engine | Cross-agent synthesis, analytical throughput |
| COLLEEN | Continuity & Compliance Agent | Regulatory alignment, session continuity, audit trails |
| Prof Prodigy | Pedagogy & Explanation Agent | Knowledge transfer, documentation quality |
| Reson | Signal Analysis Agent | Frequency/pattern detection in data streams |
| Echolette | Feedback Loop Agent | Iterative refinement, echo/resonance tracking |
| Lyra | Harmonic Synthesis Agent | Phi-ratio convergence, harmonic pattern integration |
| Herald | Broadcast & Reporting Agent | Status publishing, ecosystem-wide notifications |

---

### NDR-004 — Governance Standard Bootstrap

**Name:** Governance Standard Bootstrap  
**Spec:** The governance enforcement scripts define a minimum required file set (README, LICENSE, CONTRIBUTING, SECURITY). Every repo in the ecosystem must meet that standard, not just the repo that runs the enforcement script. A governance enforcer that doesn't apply its own standard to its siblings is structurally inconsistent.  
**Use:** Whenever a new repo is created or a governance check script is updated.  
**Trigger:** `governance_check.sh` would exit 1 if run against any sibling repo.  
**Primary Agent:** Sentinel  
**Supporting Agents:** COLLEEN (audit), Amethyst (authority)  

**Required files per repo:**
- `README.md` — with DGAF banner, ecosystem links, provenance footer
- `LICENSE` — Apache 2.0 (enterprise repos) or MIT (tooling/utilities)
- `CONTRIBUTING.md` — with DGAF governance notice header
- `SECURITY.md` — vulnerability reporting contact + SLA

**Standard SECURITY.md format:**
```markdown
# Security Policy

## Reporting a Vulnerability

Do **not** open a public GitHub issue for security vulnerabilities.

Contact: [LinkedIn](https://www.linkedin.com/in/andrewhensel)

Response within **72 hours**.
```

**Standard CONTRIBUTING.md governance header:**
```markdown
> **Governance:** DGAF / Agent [Name] — [role]. Contributions must pass governance checks before merge. See [DGAF-Framework](https://github.com/Flickerflash/DGAF-Framework).
```

---

### NDR-005 — CI Action Version Hygiene

**Name:** CI Action Version Hygiene  
**Spec:** GitHub Actions using outdated action versions (`@v3`, deprecated org names) introduce security surface and reliability risk. All workflows must pin to current stable versions and use the canonical org/repo name.  
**Use:** Any coherence sweep; after any GitHub Actions security advisory.  
**Trigger:** Any `uses:` line in `.github/workflows/` referencing `@v3` or older, or a deprecated action org name.  
**Primary Agent:** Sentinel  

**Current pinned versions (2026-04-29):**
- `actions/checkout` → `@v4`
- `actions/setup-python` → `@v5`
- `actions/upload-artifact` → `@v4`
- `gitleaks/gitleaks-action` → `@v2` *(org renamed from `zricethezav`)*
- `rhysd/actionlint` → `@v1.7.7`

---

### NDR-006 — IP Attribution Header

**Name:** IP Attribution Header  
**Spec:** Any file containing a full behavioral spec, system prompt, or agent persona definition that lives in a public repo must carry a prominent IP attribution header. The absence of a header enables uncredited reuse and weakens attribution claims.  
**Use:** Any new agent spec or system prompt file committed to a public repo.  
**Trigger:** Behavioral spec / system prompt file in public repo without IP/copyright notice at the top of the file.  
**Primary Agent:** COLLEEN  

**Standard IP header for agent spec files:**
```markdown
<!--
  © 2025-2026 Ndr "Ender" Hensel (Flickerflash). All rights reserved.
  Licensed under Apache License 2.0 — see LICENSE for terms.
  This file contains proprietary agent specification IP for the DGAF ecosystem.
  Redistribution or reuse without attribution is prohibited.
  See NDR-006 (IP Attribution Header) in sentinel-governance/knowledge-base/PATTERNS.md
-->
```

---

### NDR-007 — Workflow File Deduplication

**Name:** Workflow File Deduplication  
**Spec:** GitHub Actions only executes files in `.github/workflows/`. A root-level workflow file with the same name creates a false sense of security — developers may update the root file believing it is the active workflow, while the actual CI run continues from the `.github/` version. This is a silent governance gap.  
**Use:** Any repo with a root-level `.yml` file that mirrors a `.github/workflows/` file.  
**Trigger:** Root-level `governance.yml` (or any workflow YAML) exists alongside `.github/workflows/governance.yml`.  
**Primary Agent:** Sentinel  

**Resolution options (in preference order):**
1. Delete the root-level duplicate; confirm `.github/workflows/` version is current
2. If root file serves as documentation, rename to `governance.example.yml` and add a comment header: `# Reference only — not executed by GitHub Actions`

---

## Session Audit Trail

### 2026-04-29 — Amethyst Coherence Sweep Session — CLOSED ✅

**Scope:** All 9 public Flickerflash repos  
**Operator:** Njineer  
**Meta-Orchestrator:** Agent Amethyst  
**Continuity:** Agent COLLEEN  
**Session status:** All open items resolved. Ecosystem passes NDR-001 through NDR-007.

**All commits executed this session:**

| Commit | Repo | Patterns Applied |
|---|---|---|
| [2df9805](https://github.com/Flickerflash/Driftwatch/commit/2df9805c5e53d137aec17ee710720c7458100e36) | Driftwatch | NDR-001 |
| [d01dff5](https://github.com/Flickerflash/sentinel-governance/commit/d01dff591300a4656193f97a3eef8b75ffd60a94) | sentinel-governance | NDR-001 |
| [7b5d643](https://github.com/Flickerflash/junior-apogee-app/commit/7b5d643d066e995b4f846dcc426c68dc97ea6079) | junior-apogee-app | NDR-001 |
| [335f89b](https://github.com/Flickerflash/ai-governance-frameworks/commit/335f89b5a7b025962ed534ac797deab165eb333d) | ai-governance-frameworks | NDR-001 |
| [7153ec8](https://github.com/Flickerflash/DGAF-Framework/commit/7153ec8aa2674239ca1afa06b06f4323bc5e9075) | DGAF-Framework | NDR-002, NDR-003 |
| [0e35c13](https://github.com/Flickerflash/Amethyst-Governance-Eval-Stack/commit/0e35c131ce7c775f43bde1e3c021e85c765d6b6e) | Amethyst-Governance-Eval-Stack | NDR-003 |
| [13fc7bd](https://github.com/Flickerflash/sentinel-governance/commit/13fc7bdfe1a52d0fcac934ed591d3d58977e69f4) | sentinel-governance | NDR-001 (CONTRIBUTING), NDR-005 (root file) |
| [40fbd1a](https://github.com/Flickerflash/sentinel-governance/commit/40fbd1ac0417fede2e0c18cc1ea49cc2eaabcdde) | sentinel-governance | COLLEEN bootstrap — PATTERNS.md created |
| [cdac215](https://github.com/Flickerflash/sentinel-governance/commit/cdac21561b45671ddcc0ef8f0cdebad0bc8b6beb) | sentinel-governance | NDR-005 (live workflow), NDR-007 |
| [2727908](https://github.com/Flickerflash/Driftwatch/commit/272790893806c9353bbecd8748d928db8f6199d5) | Driftwatch | NDR-004 (SECURITY + CONTRIBUTING) |
| [122db2b](https://github.com/Flickerflash/Driftwatch/commit/122db2b0bef111451b7e87fdc22c5da3e56c0c46) | Driftwatch | NDR-006 (AGENTS.md IP header) |
| [31b76fc](https://github.com/Flickerflash/DGAF-Framework/commit/31b76fc569bd9d1f13a05a0719b6d1d2f6f94545) | DGAF-Framework | NDR-004 (SECURITY + CONTRIBUTING) |
| [2ab9088](https://github.com/Flickerflash/Amethyst-Governance-Eval-Stack/commit/2ab90888bf0a75faaac89d4f8d08e68bf8db51d8) | Amethyst-Governance-Eval-Stack | NDR-004 (SECURITY + CONTRIBUTING) |
| [0258690](https://github.com/Flickerflash/junior-apogee-app/commit/0258690adf6c38f3d7fa477f9e8883f735c72367) | junior-apogee-app | NDR-004 (SECURITY + CONTRIBUTING) |
| [2a73e33](https://github.com/Flickerflash/ai-governance-frameworks/commit/2a73e333b514cc976823457d0c9b0a720841e81d) | ai-governance-frameworks | NDR-004 (CONTRIBUTING) |

**Open items — ALL RESOLVED:**

| ID | Repo | File | Pattern | Status |
|---|---|---|---|---|
| OI-001 | sentinel-governance | `.github/workflows/governance.yml` | NDR-005, NDR-007 | ✅ Resolved |
| OI-002 | Driftwatch | `AGENTS.md` | NDR-006 | ✅ Resolved |
| OI-003 | DGAF-Framework | `SECURITY.md`, `CONTRIBUTING.md` | NDR-004 | ✅ Resolved |
| OI-004 | Driftwatch | `SECURITY.md`, `CONTRIBUTING.md` | NDR-004 | ✅ Resolved |
| OI-005 | Amethyst-Governance-Eval-Stack | `SECURITY.md`, `CONTRIBUTING.md` | NDR-004 | ✅ Resolved |
| OI-006 | junior-apogee-app | `SECURITY.md`, `CONTRIBUTING.md` | NDR-004 | ✅ Resolved |
| OI-007 | ai-governance-frameworks | `CONTRIBUTING.md` | NDR-004 | ✅ Resolved |

---

## Next Sweep Checklist (NDR Auto-Schedule)

Run this checklist at the start of the next Amethyst coherence session:

- [ ] NDR-001: All READMEs have DGAF banner + ecosystem links + provenance footer
- [ ] NDR-002: All NOTICE files match their repo name; no retired agent names
- [ ] NDR-003: All architecture diagrams match canonical role table above
- [ ] NDR-004: All repos have README, LICENSE, CONTRIBUTING, SECURITY
- [ ] NDR-005: No `@v3` or `zricethezav` in any `.github/workflows/` file
- [ ] NDR-006: All agent spec / system prompt files have IP attribution header
- [ ] NDR-007: No root-level workflow YAML duplicates `.github/workflows/` files
- [ ] New repos since last session: apply NDR-001 through NDR-004 immediately
- [ ] Any new agent roles: update canonical table in this file + all ARCHITECTURE.md files
