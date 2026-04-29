# Contributing

> **Governance:** DGAF / Agent Sentinel — All changes to this repository are subject to Sentinel CI/CD integrity enforcement. Contributions must pass governance checks in `.governance/` before merge. See [DGAF-Framework](https://github.com/Flickerflash/DGAF-Framework) for spine documentation.

## Scope
This repository contains governance checks and the Sentinel GitHub Operator.

## Development
- Keep changes small and reviewable.
- Prefer explicit configuration over hidden defaults.
- Validate with `npm run build` and `npm run lint` before pushing operator changes.

## Secrets
- Never commit `.env`, `private-key.pem`, or live credentials.
- Use `.env.example` or `.env.local.example` for shareable templates.

## Pull Requests
- Explain the operational impact of the change.
- Note whether the change affects governance checks, GitHub App behavior, or orchestrator contracts.
