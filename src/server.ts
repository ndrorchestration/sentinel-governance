import express, { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import jwt from 'jsonwebtoken';
import axios from 'axios';
import AdmZip from 'adm-zip';
import { validateWorkflowReplacement } from './repair-policy';

process.loadEnvFile?.();

const app = express();
const WEBHOOK_SECRET = process.env.GITHUB_WEBHOOK_SECRET!;
const APP_ID = process.env.GITHUB_APP_ID!;
const PRIVATE_KEY_PATH = process.env.GITHUB_APP_PRIVATE_KEY_PATH || 'private-key.pem';
const PORT = Number(process.env.PORT || 3000);
const SENTINEL_MODE = (process.env.SENTINEL_MODE || 'observe').toLowerCase();
const ORCHESTRATOR_URL = process.env.ORCHESTRATOR_URL || '';
const ORCHESTRATOR_KEY = process.env.ORCHESTRATOR_KEY || '';

if (!WEBHOOK_SECRET || !APP_ID) throw new Error('GITHUB_WEBHOOK_SECRET and GITHUB_APP_ID must be set');
if (!['observe', 'repair'].includes(SENTINEL_MODE)) throw new Error("SENTINEL_MODE must be either 'observe' or 'repair'");

const PRIVATE_KEY = fs.readFileSync(path.resolve(PRIVATE_KEY_PATH), 'utf8');
const tokenCache = new Map<number, { token: string; expiresAt: number }>();

function createAppJWT(): string {
  const now = Math.floor(Date.now() / 1000);
  return jwt.sign({ iat: now - 60, exp: now + 600, iss: APP_ID }, PRIVATE_KEY, { algorithm: 'RS256' });
}

async function getInstallationToken(installationId: number): Promise<string> {
  const cached = tokenCache.get(installationId);
  if (cached && cached.expiresAt > Date.now() + 60_000) return cached.token;
  const res = await axios.post(
    `https://api.github.com/app/installations/${installationId}/access_tokens`,
    {},
    { headers: { Authorization: `Bearer ${createAppJWT()}`, Accept: 'application/vnd.github+json', 'X-GitHub-Api-Version': '2022-11-28' } }
  );
  const token = res.data.token as string;
  tokenCache.set(installationId, { token, expiresAt: Date.now() + 3_600_000 });
  return token;
}

const processedDeliveries = new Map<string, number>();
const DELIVERY_TTL_MS = 10 * 60 * 1000;
function isDuplicate(deliveryId: string): boolean {
  const ts = processedDeliveries.get(deliveryId);
  if (ts && Date.now() - ts < DELIVERY_TTL_MS) return true;
  processedDeliveries.set(deliveryId, Date.now());
  return false;
}

app.use(express.json({ verify: (req: any, _res, buf) => { req.rawBody = buf.toString('utf8'); } }));

function verifySignature(req: any, res: Response, next: NextFunction) {
  const sig = req.headers['x-hub-signature-256'] as string | undefined;
  if (!sig) return res.status(401).send('Missing signature');
  const digest = 'sha256=' + crypto.createHmac('sha256', WEBHOOK_SECRET).update(req.rawBody).digest('hex');
  const a = Buffer.from(sig);
  const b = Buffer.from(digest);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return res.status(401).send('Bad signature');
  return next();
}

async function ghGet(url: string, token: string, extra: object = {}) {
  return axios.get(url, { headers: { Authorization: `Bearer ${token}`, Accept: 'application/vnd.github+json', 'X-GitHub-Api-Version': '2022-11-28' }, ...extra });
}

async function fetchLogTails(token: string, repoOwner: string, repoName: string, runId: number, failedJobNames: string[], tailLines = 50): Promise<Record<string, string>> {
  let logsRedirectUrl: string;
  try {
    await axios.get(`https://api.github.com/repos/${repoOwner}/${repoName}/actions/runs/${runId}/logs`, {
      headers: { Authorization: `Bearer ${token}`, Accept: 'application/vnd.github+json', 'X-GitHub-Api-Version': '2022-11-28' },
      maxRedirects: 0,
      validateStatus: (s) => s === 302,
    });
    return {};
  } catch (err: any) {
    if (err.response?.status !== 302) throw err;
    logsRedirectUrl = err.response.headers['location'];
  }

  const zipRes = await axios.get(logsRedirectUrl, { responseType: 'arraybuffer' });
  const zip = new AdmZip(Buffer.from(zipRes.data));
  const tails: Record<string, string> = {};
  for (const entry of zip.getEntries()) {
    const jobName = failedJobNames.find((n) => entry.entryName.toLowerCase().includes(n.toLowerCase().replace(/\s/g, '_')));
    if (!jobName) continue;
    const lines = zip.readAsText(entry).split('\n');
    tails[jobName] = lines.slice(-tailLines).join('\n');
  }
  return tails;
}

interface PatchRequest {
  repoOwner: string;
  repoName: string;
  headBranch: string;
  workflowPath: string;
  workflowContent: string;
  failedJobs: any[];
  logTails: Record<string, string>;
}
interface PatchResponse { patchedContent?: string; workflowContent?: string; patch?: string; }

async function callLLMForPatch(req: PatchRequest): Promise<string | null> {
  if (!ORCHESTRATOR_URL) {
    console.log('[Sentinel][LLM] ORCHESTRATOR_URL is not configured; skipping patch generation.');
    return null;
  }
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (ORCHESTRATOR_KEY) headers.Authorization = `Bearer ${ORCHESTRATOR_KEY}`;
  try {
    const res = await axios.post<PatchResponse>(ORCHESTRATOR_URL, { mode: SENTINEL_MODE, ...req }, { headers, timeout: 30_000 });
    const patchedContent = res.data?.patchedContent ?? res.data?.workflowContent ?? res.data?.patch ?? null;
    if (!patchedContent) console.log('[Sentinel][LLM] Orchestrator returned no patch.');
    return patchedContent;
  } catch (err: any) {
    console.error('[Sentinel][LLM] Orchestrator request failed', { status: err.response?.status, detail: err.response?.data || err.message });
    return null;
  }
}

async function applyPatchAsPR(params: { token: string; repoOwner: string; repoName: string; baseBranch: string; workflowPath: string; patchedContent: string; runId: number; }): Promise<void> {
  const { token, repoOwner, repoName, baseBranch, workflowPath, patchedContent, runId } = params;
  const validation = validateWorkflowReplacement(workflowPath, patchedContent);
  if (!validation.ok) throw new Error(`Refusing unsafe workflow replacement: ${validation.reason}`);

  const branchName = `sentinel/fix-workflow-${runId}`;
  const ghHeaders = { Authorization: `Bearer ${token}`, Accept: 'application/vnd.github+json', 'X-GitHub-Api-Version': '2022-11-28' };
  const refRes = await ghGet(`https://api.github.com/repos/${repoOwner}/${repoName}/git/ref/heads/${baseBranch}`, token);
  const baseSha = refRes.data.object.sha;
  await axios.post(`https://api.github.com/repos/${repoOwner}/${repoName}/git/refs`, { ref: `refs/heads/${branchName}`, sha: baseSha }, { headers: ghHeaders });
  const fileRes = await ghGet(`https://api.github.com/repos/${repoOwner}/${repoName}/contents/${encodeURIComponent(workflowPath)}?ref=${branchName}`, token);
  await axios.put(
    `https://api.github.com/repos/${repoOwner}/${repoName}/contents/${encodeURIComponent(workflowPath)}`,
    { message: `fix(ci): Sentinel auto-patch for failed run #${runId}`, content: Buffer.from(patchedContent).toString('base64'), sha: fileRes.data.sha, branch: branchName },
    { headers: ghHeaders }
  );
  await axios.post(
    `https://api.github.com/repos/${repoOwner}/${repoName}/pulls`,
    { title: `[Sentinel] Auto-fix: workflow failure on run #${runId}`, head: branchName, base: baseBranch, body: `Automated replacement generated by Sentinel for failed workflow run [#${runId}].\n\nThe replacement passed Sentinel's structural mutation gate. Review before merging.` },
    { headers: ghHeaders }
  );
  console.log(`[Sentinel] PR opened: ${branchName} -> ${baseBranch}`);
}

app.post('/webhooks/github', verifySignature, async (req: any, res: Response) => {
  const event = req.headers['x-github-event'] as string;
  const deliveryId = req.headers['x-github-delivery'] as string;
  res.status(200).send('OK');
  if (!deliveryId || isDuplicate(deliveryId)) {
    console.log(`[Sentinel] Missing/duplicate delivery skipped: ${deliveryId || '<missing>'}`);
    return;
  }
  try {
    if (event === 'workflow_run') await handleWorkflowRunEvent(req.body, deliveryId);
  } catch (err) {
    console.error('[Sentinel] Error handling event', deliveryId, err);
  }
});

const FAIL_CONCLUSIONS = new Set(['failure', 'timed_out', 'startup_failure']);

async function handleWorkflowRunEvent(payload: any, deliveryId: string) {
  const { action, workflow_run } = payload;
  if (!workflow_run || action !== 'completed' || !FAIL_CONCLUSIONS.has(workflow_run.conclusion)) return;
  const installationId = payload.installation?.id;
  if (!installationId) {
    console.warn('[Sentinel] No installation id on payload', deliveryId);
    return;
  }

  const token = await getInstallationToken(installationId);
  const repoOwner = workflow_run.repository.owner.login;
  const repoName = workflow_run.repository.name;
  const runId = workflow_run.id as number;
  const headBranch = workflow_run.head_branch;
  const workflowPath = workflow_run.path;
  const ref = workflow_run.head_sha;
  console.log(`[Sentinel] Handling failed workflow_run: ${repoOwner}/${repoName}#${runId} (${workflow_run.conclusion}) on ${headBranch}, delivery=${deliveryId}`);

  const jobsRes = await ghGet(`https://api.github.com/repos/${repoOwner}/${repoName}/actions/runs/${runId}/jobs`, token);
  const failedJobs = (jobsRes.data.jobs || []).filter((j: any) => j.conclusion === 'failure');
  const logTails = await fetchLogTails(token, repoOwner, repoName, runId, failedJobs.map((j: any) => j.name as string));
  const wfRes = await ghGet(`https://api.github.com/repos/${repoOwner}/${repoName}/contents/${encodeURIComponent(workflowPath)}?ref=${ref}`, token);
  const workflowContent = Buffer.from(wfRes.data.content, 'base64').toString('utf8');
  const patch = await callLLMForPatch({ repoOwner, repoName, headBranch, workflowPath, workflowContent, failedJobs, logTails });
  if (!patch) {
    console.log(`[Sentinel] No replacement generated for ${repoOwner}/${repoName}#${runId}`);
    return;
  }

  const validation = validateWorkflowReplacement(workflowPath, patch);
  if (!validation.ok) {
    console.warn(`[Sentinel] Replacement rejected for ${repoOwner}/${repoName}#${runId}: ${validation.reason}`);
    return;
  }

  if (SENTINEL_MODE !== 'repair') {
    console.log(`[Sentinel] Observe mode active; valid replacement generated for ${repoOwner}/${repoName}#${runId} but mutation was skipped.`);
    return;
  }

  await applyPatchAsPR({ token, repoOwner, repoName, baseBranch: headBranch, workflowPath, patchedContent: patch, runId });
}

app.listen(PORT, () => {
  console.log(`[Sentinel] GitHub Operator listening on port ${PORT} in ${SENTINEL_MODE} mode`);
});
