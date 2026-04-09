# Extraction Checklist

Use this checklist when moving `template/` into its own repository.

## Before Extracting

- Make sure `README.md` reflects the current architecture and demo behavior.
- Keep unit and integration tests colocated under `src/`.
- Keep `tests/` reserved for setup, shared helpers, and future e2e support.
- Remove any ignore rules that only exist because the template currently lives inside Webshot.

## Extraction Steps

1. Move the full `template/` directory into the new repository root.
2. Remove the `template/` ignore entry from Webshot's `.gitignore`.
3. Verify `package.json`, `tsconfig.json`, `wxt.config.ts`, and `vitest.config.ts` from the new root.
4. Run typecheck, tests, and a local WXT build in the new repository.
5. Rename package metadata and demo branding if the extracted repo should be neutral.

## What Should Already Work

- `vitest.config.ts` resolves from its own directory
- path aliases resolve through the template-local TypeScript config
- entrypoints do not depend on Webshot source files
- Webshot task docs are not required by the template itself
