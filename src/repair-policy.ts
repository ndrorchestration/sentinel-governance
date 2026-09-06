export interface ReplacementValidation {
  ok: boolean;
  reason?: string;
}

const MAX_WORKFLOW_BYTES = 200_000;
const WORKFLOW_PATH = /^\.github\/workflows\/[A-Za-z0-9._/-]+\.ya?ml$/;

export function validateWorkflowReplacement(
  workflowPath: string,
  content: string
): ReplacementValidation {
  if (!WORKFLOW_PATH.test(workflowPath) || workflowPath.includes('..')) {
    return { ok: false, reason: 'target path is not a workflow YAML file' };
  }

  const trimmed = content.trim();
  if (!trimmed) return { ok: false, reason: 'replacement is empty' };
  if (Buffer.byteLength(trimmed, 'utf8') > MAX_WORKFLOW_BYTES) {
    return { ok: false, reason: 'replacement exceeds size limit' };
  }

  // Sentinel applies complete replacement files, never unified diffs/patch fragments.
  if (/^(diff --git|@@ |--- a\/|\+\+\+ b\/)/m.test(trimmed)) {
    return { ok: false, reason: 'orchestrator returned a diff instead of a complete workflow file' };
  }

  const hasTrigger = /^(?:on|['"]on['"]):\s*(?:$|\S)/m.test(trimmed);
  const hasJobs = /^jobs:\s*(?:$|\S)/m.test(trimmed);
  if (!hasTrigger || !hasJobs) {
    return { ok: false, reason: 'replacement does not contain top-level on/jobs workflow keys' };
  }

  return { ok: true };
}
