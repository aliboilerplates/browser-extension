# wxt-extension template

## Repo shape

- `src/` — the lean template. This is what users fork.
- `examples/*` — runnable demos built on top of the template. Each is an
  independent project with its own `package.json` and configs. Mirrors the
  pattern WXT uses for its own `templates/*` (independent, hand-edited).

## Rule: when changing shared code, also update each example

If a file you're editing under `src/` also exists in any `examples/*/src/`,
apply the same change there too. Same for `tests/setup.ts` and any other
file the examples mirror.

After a dual-edit, run `pnpm test && pnpm compile && pnpm lint` in the
template AND in each affected example.

Files that diverge between the template and an example are demo-specific
overrides — don't "fix" them by reverting to the template version.
