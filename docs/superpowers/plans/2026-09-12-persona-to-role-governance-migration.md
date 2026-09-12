# Persona-to-Role Governance Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remove current governance/security authority dependence on named-agent identities while preserving historical attribution and existing enforcement behavior.

**Architecture:** Treat current-facing ownership statements as functional dependencies and replace them with canonical DGAF role IDs. Preserve the historical audit trail verbatim. Add a repository-local regression test that rejects named-agent authority language in current sections while allowing it below the historical audit boundary.

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
- Produces: test assertions that current-facing sections use functional role IDs and historical audit sections may retain actor names.

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

test('active pattern register is role-keyed while historical audit is preserved', () => {
  const patterns = read('knowledge-base/PATTERNS.md');
  const [active, historical = ''] = patterns.split('## Session Audit Trail');
  assert.match(active, /role\.governance-orchestrator/);
  assert.match(active, /role\.security-containment-gate/);
  assert.doesNotMatch(active, /\*\*Primary Agent:\*\*/);
  assert.match(historical, /Agent Amethyst/);
  assert.match(historical, /Agent COLLEEN/);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test test/persona-role-policy.test.cjs`
Expected: FAIL because current documents still use named-agent ownership.

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
- Produces: current-facing role-keyed governance language with historical audit attribution unchanged.

- [ ] **Step 1: Replace current CONTRIBUTING ownership**

Use functional role IDs and state explicitly that historical persona labels are lineage only and do not transfer authority.

- [ ] **Step 2: Convert PATTERNS current metadata**

Rename active `Primary Agent` / `Supporting Agents` fields to `Primary Role` / `Supporting Roles`, replace active pattern ownership with behavior-derived role IDs, and replace the current canonical agent table with a functional role-routing table. Do not edit content under `## Session Audit Trail`.

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
- Produces: merge decision and issue closure only if no current named identity retains authority semantics.

- [ ] **Step 1: Verify historical audit diff is zero**

Compare content from `## Session Audit Trail` onward against `main`; expected byte-equivalent historical section.

- [ ] **Step 2: Verify authority non-expansion**

Confirm the migration replaces stale identity ownership with functional contracts and does not add permissions, execution rights, certification, compliance, or DGAF authorization claims.

- [ ] **Step 3: Require exact-head CI before merge**

Do not merge if any repository workflow fails or if the branch head changes after evidence collection.
