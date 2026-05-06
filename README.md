# WXT Browser Extension Template

A production-ready browser extension starter built on [WXT](https://wxt.dev),
React 19, and TypeScript. Designed for serious multi-context extensions that
need typed messaging, clean ownership boundaries, and real tests from day one.

## Features

- **WXT** with explicit imports for predictable, readable code
- **React 19** + **Tailwind CSS v4** + **daisyUI** for UI
- **Zustand** ready for popup-local UI state
- **Custom typed messaging** layer with central background routing, single
  unified `sendMessage` for every target, retriable content-tab delivery, and
  a `Result<TCode, TData, TErrorData>` type for typed handler errors
- **Shadow DOM** content UI so page styles can't bleed in
- **`wxt/storage`** with reactive hooks
- **Vitest** + `fakeBrowser` with colocated unit and integration tests
- **ESLint 9** (flat config, `typescript-eslint`, `unicorn`) + **Prettier**
- **Husky** + **lint-staged** pre-commit hooks
- **Chrome** and **Firefox** build targets
- Popup, options, background, content, and offscreen entrypoints scaffolded

## Tech Stack

| Layer    | Choice                                     |
|-|-|
| Framework | WXT 0.20                                  |
| UI       | React 19, Tailwind v4, daisyUI             |
| State    | `wxt/storage`, optional Zustand            |
| Testing  | Vitest, @wxt-dev/module-react, fakeBrowser |
| Tooling  | TypeScript 5.8, ESLint 9, Prettier 3       |

## Getting Started

### Prerequisites

- Node.js 20+
- [pnpm](https://pnpm.io) (recommended) or npm

### Installation

```bash
pnpm install
```

### Development

```bash
# Chrome
pnpm dev

# Firefox
pnpm dev:firefox
```

WXT will launch a browser with the extension loaded and hot-reload on changes.

### Build

```bash
pnpm build           # Chrome
pnpm build:firefox   # Firefox
```

### Package for the store

```bash
pnpm zip           # Chrome
pnpm zip:firefox   # Firefox
```

## Scripts

| Script                | Description                          |
|-|-|
| `dev`                 | Run the extension in Chrome with HMR |
| `dev:firefox`         | Run the extension in Firefox with HMR |
| `build`               | Production build for Chrome          |
| `build:firefox`       | Production build for Firefox         |
| `zip` / `zip:firefox` | Create a store-ready zip             |
| `test`                | Run the Vitest suite once            |
| `test:watch`          | Run Vitest in watch mode             |
| `compile`             | Type-check with `tsc --noEmit`       |
| `lint`                | Lint `src/` with ESLint              |
| `lint:fix`            | Autofix lint issues                  |

## Project Structure

```text
src/
├── core/           # Framework-level code: messaging, storage, logging, browser
├── entrypoints/    # background, content, popup, options, offscreen
├── shared/         # Cross-context types and utilities
└── ui/             # Reusable components, hooks, stores, styles
examples/
└── notes/          # Optional Web Clipper Notes overlay (copy into src/ to use)
```

See [`docs/architecture.md`](./docs/architecture.md) for the full architectural
rationale, ownership rules, and testing guidelines.

## Examples

Opinionated overlays that exercise the template's core systems live under
[`examples/`](./examples/). Each example is a self-contained folder you copy
into `src/` plus a small set of contract/storage merges documented in its own
README.

- [**Web Clipper Notes**](./examples/notes/README.md) — popup CRUD, content
  selection capture, context-menu integration, toast feedback, persisted
  notes.

## Testing

Tests live next to the code they cover. Use `tests/` only for shared setup and
helpers.

```bash
pnpm test         # run once
pnpm test:watch   # watch mode
```

The suite uses `fakeBrowser` from WXT's testing utilities and avoids broad
module mocks. See [`docs/architecture.md`](./docs/architecture.md#testing) for
testing conventions.

## Customizing

Before shipping your own extension:

1. Update `name`, `version`, and metadata in [`package.json`](./package.json).
2. Update the manifest in [`wxt.config.ts`](./wxt.config.ts) — name,
   description, permissions, and `browser_specific_settings.gecko.id`.
3. Replace the localized strings under `public/_locales/`.
4. Swap the extension icons in `public/`.
5. Decide whether to overlay any examples and start building.

## License

MIT
