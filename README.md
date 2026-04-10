# WXT Browser Extension Template

A production-ready browser extension starter built on [WXT](https://wxt.dev),
React 19, and TypeScript. Designed for serious multi-context extensions that
need typed messaging, clean ownership boundaries, and real tests from day one.

## Features

- **WXT** with explicit imports for predictable, readable code
- **React 19** + **Tailwind CSS v4** + **daisyUI** for UI
- **Zustand** for local UI state
- **Custom typed messaging** layer with central background routing, timeouts,
  and retriable content-tab delivery
- **Shadow DOM** content UI so page styles can't bleed in
- **`wxt/storage`** with reactive hooks
- **Vitest** + `fakeBrowser` with colocated unit and integration tests
- **ESLint 9** (flat config, `typescript-eslint`, `unicorn`) + **Prettier**
- **Husky** + **lint-staged** pre-commit hooks
- **Chrome** and **Firefox** build targets
- Popup, options, background, content, and offscreen entrypoints scaffolded

## Tech Stack

| Layer        | Choice                                    |
| -- | -- |
| Framework    | WXT 0.20                                  |
| UI           | React 19, Tailwind v4, daisyUI            |
| State        | Zustand, `wxt/storage`                    |
| Testing      | Vitest, @wxt-dev/module-react, fakeBrowser |
| Tooling      | TypeScript 5.8, ESLint 9, Prettier 3      |

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
# Chrome
pnpm build

# Firefox
pnpm build:firefox
```

### Package for the store

```bash
pnpm zip           # Chrome
pnpm zip:firefox   # Firefox
```

## Scripts

| Script             | Description                                    |
| -- | -- |
| `dev`              | Run the extension in Chrome with HMR           |
| `dev:firefox`      | Run the extension in Firefox with HMR          |
| `build`            | Production build for Chrome                    |
| `build:firefox`    | Production build for Firefox                   |
| `zip` / `zip:firefox` | Create a store-ready zip                    |
| `test`             | Run the Vitest suite once                      |
| `test:watch`       | Run Vitest in watch mode                       |
| `compile`          | Type-check with `tsc --noEmit`                 |
| `lint`             | Lint `src/` with ESLint                        |
| `lint:fix`         | Autofix lint issues                            |

## Project Structure

```text
src/
├── core/           # Framework-level code: messaging, storage, logging, browser
├── entrypoints/    # background, content, popup, options, offscreen
├── shared/         # Cross-context types and utilities
└── ui/             # Reusable components, hooks, stores, styles
```

See [`docs/architecture.md`](./docs/architecture.md) for the full architectural
rationale, ownership rules, and testing guidelines.

## Demo Feature

The template ships with a small **Web Clipper Notes** demo that exercises every
core system end to end:

- popup note creation and listing
- selected-text capture from the content script
- background orchestration and storage mutations
- Shadow DOM content UI in React
- persisted notes and preferences via `wxt/storage`
- popup-local state with Zustand

### Removing the demo

The demo is isolated so it can be deleted cleanly:

1. Delete the demo entrypoint files under `src/entrypoints/popup`,
   `src/entrypoints/content`, and `src/entrypoints/background` that reference
   `demo-notes`.
2. Delete `src/shared/demo-notes.storage.ts`.
3. Remove any demo message contracts from `src/core/messaging`.
4. Drop the corresponding colocated tests.

The core template infrastructure keeps working with the demo removed.

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
5. Remove the demo (see above) and start building.

## License

MIT
