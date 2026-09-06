# Sentinel GitHub Operator

Event-driven GitHub App server that detects CI workflow failures and dispatches to the configured orchestrator for reviewable workflow-repair proposals.

## Architecture

```text
GitHub Webhook (workflow_run)
  └─ HMAC signature verification
       └─ Idempotency check (deliveryId TTL map)
            └─ handleWorkflowRunEvent
                 ├─ getInstallationToken (cached, 1hr TTL)
                 ├─ fetch failed jobs
                 ├─ fetch log tails (302 redirect → S3 zip → AdmZip parse)
                 ├─ fetch workflow YAML
                 ├─ callLLMForPatch → configured orchestrator
                 ├─ validate complete workflow replacement
                 └─ applyPatchAsPR (repair mode only)
```

## Setup

1. Create a GitHub App with permissions:

   - `actions: read`
   - `contents: write`
   - `pull_requests: write`
   - `metadata: read`

1. Subscribe to `workflow_run` events.
1. Copy `.env.example` to `.env` and fill in credentials.
1. Place the GitHub App private key as `private-key.pem` in the root.

```bash
npm install
npm run dev
```

1. Expose locally with a webhook tunnel for testing:

```bash
ngrok http 3000
# Set webhook URL to: https://<your-ngrok-id>.ngrok.io/webhooks/github
```

## Local Test

```bash
curl -X POST http://localhost:3000/webhooks/github \
  -H "Content-Type: application/json" \
  -H "X-GitHub-Event: workflow_run" \
  -H "X-GitHub-Delivery: test-$(date +%s)" \
  -H "X-Hub-Signature-256: sha256=$(echo -n @test/fixtures/workflow_run_failure.json | openssl dgst -sha256 -hmac $GITHUB_WEBHOOK_SECRET | awk '{print $2}')" \
  -d @test/fixtures/workflow_run_failure.json
```

## Orchestrator Integration

`callLLMForPatch()` is wired to `ORCHESTRATOR_URL` in `src/server.ts`.

Request payload:

- **Input:** `{ mode, repoOwner, repoName, headBranch, workflowPath, workflowContent, failedJobs, logTails }`

Accepted response fields may include:

- `{ "patchedContent": "...yaml..." }`
- `{ "workflowContent": "...yaml..." }`
- `{ "patch": "...yaml..." }`

The returned string is **not trusted merely because it is non-empty**. Before any repair-mode mutation Sentinel requires a complete replacement workflow that passes the local mutation gate: the target must stay under `.github/workflows/`, traversal is rejected, unified diffs are rejected, size is bounded, and top-level workflow trigger/jobs structure must be present.

Behavior by mode:

- `SENTINEL_MODE=observe`: analyze and log patch availability, but do not open a PR.
- `SENTINEL_MODE=repair`: open a reviewable PR only when the replacement passes the mutation gate.

A passing mutation gate establishes only structural admissibility for a proposed workflow replacement. It does not establish semantic correctness, security, or successful remediation.

## Failure Conclusions Handled

| Conclusion | Handled |
|---|---|
| `failure` | yes |
| `timed_out` | yes |
| `startup_failure` | yes |
| `success` | no (skipped) |
| `cancelled` | no (skipped) |
