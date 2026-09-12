# Persona-to-Role Governance Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remove current governance/security authority dependence on named-agent identities while preserving historical attribution and existing enforcement behavior.

**Architecture:** Replace current-facing ownership in `CONTRIBUTING.md` with canonical DGAF functional roles. Preserve the legacy NDR pattern register and its event-time agent fields unchanged, while prepending a current functional-role ownership overlay that explicitly supersedes those fields for present authority interpretation. Add repository-local regression coverage for both current role ownership and historical-lineage preservation.

**Tech Stack:** Markdown, Node.js built-in test runner, repository `npm test` pipeline.

**Spec:** `ndrorchestration/DGAF-Framework` accepted persona-to-role architecture (`governance/role_capability_registry.v1.json`, `governance/persona_role_lineage.v1.json`) and sentinel-governance issue #10.

## Global Constraints

- Preserve historical event-time identity and audit entries unchanged.
- Bare `Sentinel` is historical-only in the accepted DGAF lineage and transfers no active authority.
- Current security ownership uses `role.security-containment-gate`; current orchestration uses `role.governance-orchestrator`.
- Do not claim new security, compliance, production, or DGAF authorization status.
- Keep behavior/enforcement semantics unchanged; this is authority-label migration plus regression coverage.

---

### Task 1: Add current-authority regression test

**Files:**

- Create: `test/persona-role-policy.test.cjs`

**Interfaces:**

- Consumes: `CONTRIBUTING.md`, `knowledge-base/PATTERNS.md`
- Produces: assertions that current authority is role-keyed while legacy agent fields remain historical lineage.

- [ ] **Step 1: Write the failing test**

```js
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const assert = require('node:assert/strict');

const root = path.resolve(__dirname, '..');

function read(rel) {
  return fs.readFileSync(path.join(root, rel), 'utf8');
}

test('current governance ownership is role-keyed', () => {
  const contributing = read('CONTRIBUTING.md');
  assert.match(contributing, /role\.governance-orchestrator/);
  assert.match(contributing, /role\.security-containment-gate/);
  assert.doesNotMatch(contributing, /owned by \*\*Agent Sentinel\*\*/);
  assert.doesNotMatch(contributing, /meta-orchestrated by \*\*Agent Amethyst\*\*/);
});

test('pattern register overlays current role ownership while preserving historical lineage', () => {
  const patterns = read('knowledge-base/PATTERNS.md');
  const [active, historical = ''] = patterns.split('## Session Audit Trail');
  assert.match(active, /## Current Functional Role Ownership — 2026-09-12/);
  assert.match(active, /role\.governance-orchestrator/);
  assert.match(active, /role\.security-containment-gate/);
  assert.match(active, /role\.continuity-archive-coordinator/);
  assert.match(active, /Legacy `Primary Agent` and `Supporting Agents` fields below are historical lineage/);
  assert.match(active, /Bare `Sentinel` is historical-only/);
  assert.match(active, /\*\*Primary Agent:\*\*/);
  assert.match(historical, /Agent Amethyst/);
  assert.match(historical, /Agent COLLEEN/);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test test/persona-role-policy.test.cjs`
Expected: FAIL because current documents do not yet expose the role ownership contract.

- [ ] **Step 3: Commit RED test**

```bash
git add test/persona-role-policy.test.cjs
git commit -m "test: require role-keyed governance ownership"
```

### Task 2: Migrate current governance/security ownership

**Files:**

- Modify: `CONTRIBUTING.md`
- Modify: `knowledge-base/PATTERNS.md`

**Interfaces:**

- Consumes: canonical `role.governance-orchestrator`, `role.security-containment-gate`, `role.continuity-archive-coordinator`, `role.constraint-qa-auditor`, `role.provenance-archivist`, `role.publication-executor` role IDs.
- Produces: current-facing functional-role authority with historical actor attribution unchanged.

- [ ] **Step 1: Replace current CONTRIBUTING ownership**

Use functional role IDs and state explicitly that historical persona labels are lineage only and do not transfer authority. Bound standards wording to alignment rather than external compliance certification.

- [ ] **Step 2: Add current PATTERNS role overlay**

Prepend a `Current Functional Role Ownership — 2026-09-12` section that maps active NDR pattern routing to canonical role IDs. Explicitly state that legacy `Maintained by`, `Authority`, `Primary Agent`, `Supporting Agents`, role tables, and session attribution are historical/provenance fields and are non-authoritative for present execution. Preserve the original register below the overlay unchanged.

- [ ] **Step 3: Run focused regression test**

Run: `node --test test/persona-role-policy.test.cjs`
Expected: PASS.

- [ ] **Step 4: Run repository validation**

Run: `npm test`
Expected: build and all Node tests PASS.

- [ ] **Step 5: Commit GREEN implementation**

```bash
git add CONTRIBUTING.md knowledge-base/PATTERNS.md
git commit -m "docs: migrate governance ownership to functional roles"
```

### Task 3: Review and acceptance

**Files:**

- Review only: branch diff and issue #10.

**Interfaces:**

- Consumes: exact-head test results and branch diff.
- Produces: merge decision and issue closure only if current named identities no longer control authority semantics.

- [ ] **Step 1: Verify historical audit diff is zero**

Confirm that the original `knowledge-base/PATTERNS.md` content from its legacy provenance header through `## Session Audit Trail` and below is retained, with only the new current overlay inserted ahead of it.

- [ ] **Step 2: Verify authority non-expansion**

Confirm the migration replaces stale current identity ownership with functional contracts and adds no permissions, execution rights, certification, compliance, or DGAF authorization claims.

- [ ] **Step 3: Require exact-head CI before merge**

Do not merge if any repository workflow fails or if the branch head changes after evidence collection.
