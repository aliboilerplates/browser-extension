# wxt-extension template

## Toolchain

Vite+ (`vp`) handles test, lint, and format; WXT owns dev/build. `vp <name>`
runs a Vite+ built-in; `vp run <name>` runs the `package.json` script. Vite+
docs are local at `node_modules/vite-plus/docs`.

- `pnpm check` — format check + Oxlint (type-aware) + type-check
- `pnpm test` — Vitest via `vp test` (config in `vitest.config.ts`)
- `pnpm compile` — `tsc --noEmit`
- `pnpm dev` / `pnpm build` — WXT. Don't use `vp dev` / `vp build`; they run
  plain Vite, not WXT.

Lint and format config lives in `vite.config.ts`. Test config stays in
`vitest.config.ts` so the `WxtVitest` plugin never leaks into the WXT build.

Requires Node 22.22.1+ or 24.11+.

After changes, run `pnpm check && pnpm test && pnpm compile`.
