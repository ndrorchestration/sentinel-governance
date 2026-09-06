# Security Policy

## Reporting

If you find a security issue, open a private security advisory or contact the repository owner directly before publishing details.

## Sensitive Material

Do not commit:

- live API keys
- webhook secrets
- private keys
- production environment files

## Hardening

This repository runs governance and security-related checks in CI. Any change that weakens those checks should be called out explicitly in review.

Sentinel's repair mode is not a security authority. A generated workflow replacement must still be reviewed, tested, and evaluated within the target repository's own security and merge controls.
