# Standalone Checklist

This repository has already been extracted from the original Webshot workspace. Use this checklist to verify the repo remains self-contained and easy to reuse.

## Baseline Expectations

- `README.md` reflects the current architecture and demo behavior.
- Unit and integration tests stay colocated under `src/`.
- `tests/` stays reserved for setup, shared helpers, and future e2e support.
- No source files depend on Webshot-only paths or tooling.

## Verification Steps

1. Verify `package.json`, `tsconfig.json`, `wxt.config.ts`, and `vitest.config.ts` all resolve correctly from this repository root.
2. Run typecheck, tests, and a local WXT build from this repository root.
3. Confirm path aliases resolve without references to the old source repository.
4. Rename package metadata or demo branding only if creating a more neutral starter from this template.

## What Should Already Work

- `vitest.config.ts` resolves from its own directory.
- Path aliases resolve through the local TypeScript config.
- Entrypoints do not depend on Webshot source files.
- Task docs provide historical context, but the runtime code does not depend on them.
