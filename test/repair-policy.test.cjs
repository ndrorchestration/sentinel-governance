const test = require('node:test');
const assert = require('node:assert/strict');
const { validateWorkflowReplacement } = require('../dist/repair-policy.js');

const validWorkflow = `name: CI\non:\n  push:\njobs:\n  test:\n    runs-on: ubuntu-latest\n    steps: []\n`;

test('accepts a complete workflow replacement', () => {
  assert.deepEqual(validateWorkflowReplacement('.github/workflows/ci.yml', validWorkflow), { ok: true });
});

test('rejects targets outside workflow directory', () => {
  assert.equal(validateWorkflowReplacement('README.md', validWorkflow).ok, false);
  assert.equal(validateWorkflowReplacement('.github/workflows/../CODEOWNERS.yml', validWorkflow).ok, false);
});

test('rejects unified diffs and patch fragments', () => {
  const result = validateWorkflowReplacement('.github/workflows/ci.yml', 'diff --git a/ci.yml b/ci.yml\n@@ -1 +1 @@\n-old\n+new');
  assert.equal(result.ok, false);
});

test('rejects non-workflow text', () => {
  assert.equal(validateWorkflowReplacement('.github/workflows/ci.yml', 'please change the runner to ubuntu').ok, false);
});

test('rejects empty replacement', () => {
  assert.equal(validateWorkflowReplacement('.github/workflows/ci.yml', '   ').ok, false);
});
