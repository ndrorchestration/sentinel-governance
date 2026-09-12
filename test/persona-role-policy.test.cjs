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
