# Local Orchestrator Stub

This folder contains a minimal FastAPI service that matches the Sentinel operator contract.

## Install

```bash
pip install -r requirements.txt
```

## Run

```bash
set ORCHESTRATOR_KEY=replace_with_shared_orchestrator_token
uvicorn main:app --reload --port 8000
```

## Endpoints

- `GET /health`
- `POST /sentinel/repair`

The POST endpoint expects `Authorization: Bearer <ORCHESTRATOR_KEY>` and returns either:

- `{ "patchedContent": "...yaml...", "reason": "..." }`
- `{ "patchedContent": null, "reason": "No deterministic fix available" }`

The stub currently inserts `actions/checkout@v4` when a workflow has a `steps:` block but no checkout step.

Sentinel treats the returned content as an untrusted proposal. Repair mode still requires the operator-side workflow mutation gate before any branch or pull request can be created.
