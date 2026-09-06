# sentinel-governance

> **Epistemic status:** Experimental CI/CD integrity and automation repository. Sentinel can observe selected GitHub Actions failures and, in repair mode, propose a replacement workflow through an external orchestrator. It is not an autonomous certification authority or proof that failures are correctly repaired.

## Current operator model

```text
GitHub workflow_run failure
        ↓
verify webhook signature + delivery identity
        ↓
collect failed-job context / log tails / exact workflow
        ↓
external orchestrator proposes replacement
        ↓
Sentinel structural mutation gate
        ↓
observe mode ──→ record only; NO GitHub mutation
repair mode  ──→ open reviewable PR only if gate passes
```

## Implemented controls

Where configured, the TypeScript GitHub operator provides:

- HMAC webhook signature verification;
- short-lived duplicate-delivery suppression;
- GitHub App installation-token acquisition/caching;
- detection of completed `failure`, `timed_out`, and `startup_failure` workflow runs;
- failed-job and log-tail collection;
- exact failed-workflow retrieval;
- external orchestrator call with a bounded timeout;
- explicit `observe` and `repair` modes;
- **observe-mode no-write behavior** after a proposed replacement is generated;
- **fail-closed workflow replacement validation** before repair mutation;
- reviewable branch/PR creation rather than direct merge.

## Repair mutation gate

A proposed repair is rejected unless it:

- targets a `.github/workflows/*.yml` or `.yaml` path;
- contains no `..` path traversal;
- is non-empty and below the configured size bound;
- is a complete workflow document rather than a unified diff/patch fragment;
- contains top-level workflow trigger (`on`) and `jobs` keys.

The gate is checked before entering repair mutation and again in the PR-application function. Deterministic tests cover valid replacement, out-of-scope paths, traversal, unified diffs, non-workflow text, and empty responses.

These checks establish a **structural mutation boundary**, not semantic correctness of the proposed workflow. Human review remains required before merge.

## Verification

```bash
npm ci
npm run lint
npm test
```

The operator CI workflow runs locked installation, TypeScript checking, build, and deterministic repair-boundary tests.

## Modes

| Mode | Behavior |
|---|---|
| `observe` | Collect context and request a replacement; GitHub mutation is skipped even when a valid replacement is returned. |
| `repair` | May open a repair PR only after the replacement passes the structural mutation gate. |

## What is not established

The repository does **not** establish:

- that every CI failure is detected;
- that an external orchestrator diagnoses failures correctly;
- that a structurally valid replacement is semantically correct;
- that repair PRs should be merged automatically;
- ecosystem-wide enforcement;
- security compliance or certification;
- production reliability.

## Related ecosystem

DGAF-Framework, Driftwatch, Agent Control Plane, Amethyst-related work, and other repositories have separate evidence boundaries. A Sentinel integration does not transfer validation between repositories.

## Evidence standard

`DEFINED → IMPLEMENTED → COMPUTED → VERIFIED → ATTESTED → HISTORICAL → HYPOTHESIS → METAPHOR → UNSUPPORTED → DEPRECATED`

A successful CI run demonstrates only the checks that ran at that revision. A generated repair is a proposal until independently reviewed and verified.

## License

Apache 2.0 — see `LICENSE`.

## Provenance

Maintained by Ndr / Ender Hensel (`ndrorchestration`).
