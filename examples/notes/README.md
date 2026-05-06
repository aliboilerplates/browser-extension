# Web Clipper Notes — Runnable Example

A standalone WXT extension built on top of the lean
[`wxt-browser-extension-template`](../../README.md). It demonstrates a Web
Clipper Notes feature that exercises every core system end to end:

- popup CRUD with filter, theme switcher, and Zustand-backed UI state
- selected-text capture from the content script with a "Save selection"
  button
- right-click context-menu integration ("Save selection as note")
- background command handlers + `wxt/storage` persistence
- toast feedback delivered via `content/showToast`
- typed message contracts including the `Result` type

This is an **independent project** — it has its own `package.json`,
`node_modules`, and configs. It does not import from the template's `src/`.

## Getting Started

```bash
cd examples/notes
pnpm install
pnpm dev          # Chrome
pnpm dev:firefox  # Firefox
```

WXT loads the extension into a fresh browser profile with HMR.

## Scripts

| Script           | Description                          |
|-|-|
| `dev`            | Run the extension in Chrome with HMR |
| `dev:firefox`    | Run the extension in Firefox with HMR |
| `build`          | Production build for Chrome          |
| `build:firefox`  | Production build for Firefox         |
| `zip`            | Store-ready Chrome zip               |
| `test`           | Run the Vitest suite once            |
| `test:watch`     | Run Vitest in watch mode             |
| `compile`        | Type-check with `tsc --noEmit`       |
| `lint`           | Lint `src/`                          |

## What this example adds on top of the template

The template ships a lean `core/` plus a tiny `core/ping` example message.
This project layers a real feature on top:

| File | Change vs. template |
|-|-|
| `src/core/messaging/messageConstants.ts` | adds 4 `demoNotes/*` keys |
| `src/core/messaging/definitions/backgroundMessages.ts` | adds 4 message contracts (request + response + config) |
| `src/shared/types/index.ts` | `Settings` adds `maxNotes` |
| `src/core/storage/storageItems.ts` | `settingsStorage` fallback adds `maxNotes: 100` |
| `src/shared/demo-notes.storage.ts` | new — persisted notes list |
| `src/shared/types/note.ts`, `demoNotes.ts` | new — note domain types |
| `src/entrypoints/background/index.ts` | adds context-menu integration |
| `src/entrypoints/background/messageListener.ts` | wires 4 demo handlers |
| `src/entrypoints/background/demoNotes.handlers.ts` | new — note CRUD logic |
| `src/entrypoints/content/index.tsx` | adds mouseup listener + save-selection button |
| `src/entrypoints/content/demoNotes.{bridge,selection}.ts` | new — page-side selection capture |
| `src/entrypoints/popup/main.tsx` | mounts `<DemoNotesPanel />` |
| `src/entrypoints/popup/DemoNotesPanel.tsx` | new — popup UI |
| `src/entrypoints/options/main.tsx` | adds `maxNotes` number input |
| `src/ui/stores/usePopupStore.ts` | new — Zustand store for popup search query |

Everything else mirrors the template verbatim.

## Using this as a starting point

You can copy this whole folder out as the basis for your own extension, then
strip what you don't need. Or cherry-pick individual pieces into your own
project — each addition above is small enough to grok and copy in isolation.

The architectural patterns (typed messaging, `Result`, single `sendMessage`,
shadow-root content UI, reactive storage hooks, MV3-safe listener
registration) all come from the template — see
[`../../docs/architecture.md`](../../docs/architecture.md) for the full
rationale.
