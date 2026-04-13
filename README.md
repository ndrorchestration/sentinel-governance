# sentinel-governance
Automated integrity monitoring and CI/CD governance sweeps for project stability and security compliance.

## Sentinel GitHub Operator

This branch includes a GitHub App operator that listens for failed `workflow_run` events and can forward workflow context to an external orchestrator.

Runtime modes:
- `observe`: fetch failure context and request a patch, but do not open a PR.
- `repair`: request a patch and open a PR when the orchestrator returns a full replacement workflow file.

See [docs/sentinel-operator.md](docs/sentinel-operator.md) for setup and webhook details.
