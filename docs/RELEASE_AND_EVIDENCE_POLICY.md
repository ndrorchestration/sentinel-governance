# Release and Evidence Policy

## Current posture

Sentinel Governance contains an implemented GitHub operator path for workflow-failure handling, diagnosis, orchestrator calls, and optional PR automation. Live repair behavior depends on external credentials, endpoints, and deployment configuration.

## Versioning

Use `0.x.y` while the operator contract and deployment model remain under development. Promote to `1.0.0` only after stable interfaces, security controls, integration tests, and operational evidence are established.

## Evidence rule

Implementation of observe/repair paths is not evidence of safe or reliable autonomous repair. Claims about production operation require authenticated deployment evidence, failure-mode testing, rate-limit behavior, idempotency testing, and auditable repair outcomes.
